/**
 * Shakshya AI — Regulatory Compliance Validation Engine
 * Approval Process Handbook (APH 2025-26)
 * Implements deterministic rules, cross-document reconciliation, scoring, and dataset loaders.
 */

import {
  Application,
  AdminRule,
  DocumentCategory,
  DocumentFile,
  EOA_DOCUMENT_CATEGORIES,
  ValidationFinding,
  ValidationSnapshot,
} from '../types';

export const DEFAULT_ADMIN_RULES: AdminRule[] = [
  {
    id: 'RULE-DEMO-EOA-001',
    name: 'Mandatory Category Checklist Completeness',
    description: 'Verifies that all 7 statutory EoA checklist categories are uploaded and attached.',
    category: 'checklist',
    severity: 'CRITICAL',
    enabled: true,
    aphClause: 'APH 2025-26 Chapter II, Clause 2.14',
    penaltyPoints: 15,
  },
  {
    id: 'RULE-DEMO-EOA-002',
    name: 'Cross-Document Institution Name Consistency',
    description: 'Ensures the institution name in statutory certificates and fee receipts matches the official application profile.',
    category: 'cross_document',
    severity: 'HIGH',
    enabled: true,
    aphClause: 'APH 2025-26 Clause 2.4.1 & Clause 2.14.1',
    penaltyPoints: 15,
  },
  {
    id: 'RULE-DEMO-EOA-003',
    name: 'TER Fee Receipt Verification & Status',
    description: 'Checks that the Technical Education Regulatory fee challan is marked SUCCESSFUL and verified.',
    category: 'ter_receipt',
    severity: 'HIGH',
    enabled: true,
    aphClause: 'APH 2025-26 Clause 2.4.1',
    penaltyPoints: 10,
  },
  {
    id: 'RULE-DEMO-EOA-004',
    name: 'Text Layer Presence & Readability Check',
    description: 'Detects scanned bitmaps without searchable text layer and flags for human or OCR scrutiny.',
    category: 'audited_accounts',
    severity: 'MEDIUM',
    enabled: true,
    aphClause: 'APH 2025-26 Clause 2.14.9',
    penaltyPoints: 10,
  },
  {
    id: 'RULE-DEMO-EOA-005',
    name: 'Fire Safety NOC Validity Period',
    description: 'Confirms that the State Fire and Rescue Services NOC is unexpired for the active academic session.',
    category: 'fire_safety',
    severity: 'MEDIUM',
    enabled: true,
    aphClause: 'APH 2025-26 Clause 2.14.5',
    penaltyPoints: 8,
  },
  {
    id: 'RULE-DEMO-EOA-006',
    name: 'Affidavit 2 Statutory Execution & Notarization',
    description: 'Validates presence of legal deponent declaration, land ownership disclosure, and built-up area undertaking.',
    category: 'affidavit_2',
    severity: 'MEDIUM',
    enabled: true,
    aphClause: 'APH 2025-26 Chapter II, Affidavit 2',
    penaltyPoints: 8,
  },
  {
    id: 'RULE-DEMO-EOA-007',
    name: 'GIS Satellite Boundary Coordinates',
    description: 'Verifies GPS coordinates and continuous perimeter polygon data on the satellite survey record.',
    category: 'satellite_map',
    severity: 'LOW',
    enabled: true,
    aphClause: 'APH 2025-26 Clause 2.14.8',
    penaltyPoints: 4,
  },
];

const LOCAL_STORAGE_RULES_KEY = 'aicte_verifyai_admin_rules';

export function getPersistedAdminRules(): AdminRule[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_ADMIN_RULES;
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_RULES_KEY);
    if (!raw) return DEFAULT_ADMIN_RULES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_ADMIN_RULES;
}

export function saveAdminRules(rules: AdminRule[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(rules));
  }
}

/**
 * Checks if a document contains all configured required fields.
 */
export function checkDocumentRequiredFields(
  doc: DocumentFile,
  requiredFields: string[]
): { passed: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  const textLower = (doc.extractedText || '').toLowerCase();

  for (const field of requiredFields) {
    const fieldLower = field.toLowerCase();
    const hasInFields = Boolean(doc.extractedFields && doc.extractedFields[field]);
    const hasInText = textLower.includes(fieldLower);
    if (!hasInFields && !hasInText) {
      missingFields.push(field);
    }
  }

  return {
    passed: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Checks for cross-document institution name consistency.
 * Compares institution name across uploaded documents with application.institutionName.
 */
export function checkCrossDocumentInstitutionNames(
  app: Application,
  rules: AdminRule[] = DEFAULT_ADMIN_RULES
): ValidationFinding[] {
  const rule = rules.find((r) => r.id === 'RULE-DEMO-EOA-002' || r.id === 'RULE DEMO-EoA-002');
  if (rule && !rule.enabled) {
    return [];
  }

  const findings: ValidationFinding[] = [];
  const expectedName = app.institutionName.trim().toLowerCase();

  for (const doc of app.documents) {
    const docInstName = doc.extractedFields.institutionName;
    if (!docInstName) continue;

    const normalizedDocName = docInstName.trim().toLowerCase();
    if (normalizedDocName !== expectedName) {
      findings.push({
        id: `finding-inst-mismatch-${doc.id}`,
        ruleId: 'RULE DEMO-EoA-002',
        ruleName: 'Cross-Document Institution Name Mismatch',
        severity: 'HIGH',
        category: 'cross_document',
        filename: doc.filename,
        pageNumber: 1,
        evidenceSnippet: `Extracted: "${docInstName}" | Application Expected: "${app.institutionName}"`,
        aphClause: 'APH 2025-26 Clause 2.4.1 & Clause 2.14.1',
        description: `Institution name mismatch detected in ${doc.categoryName}. The document specifies "${docInstName}", which does not match the application record "${app.institutionName}".`,
        recommendedAction: 'Verify institutional amalgamation, change of name approval, or replace with correct fee receipt.',
      });
    }
  }

  return findings;
}

/**
 * Flags byte-identical uploads within an application. This is a preliminary
 * signal only and does not establish document fraud or ownership.
 */
export function checkDuplicateDocuments(documents: DocumentFile[]): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const documentsByHash = new Map<string, DocumentFile[]>();

  for (const doc of documents) {
    if (!doc.sha256) continue;
    const matchingDocuments = documentsByHash.get(doc.sha256) || [];
    matchingDocuments.push(doc);
    documentsByHash.set(doc.sha256, matchingDocuments);
  }

  for (const matchingDocuments of documentsByHash.values()) {
    if (matchingDocuments.length < 2) continue;

    const filenames = matchingDocuments.map((doc) => doc.filename).join(', ');
    for (const doc of matchingDocuments) {
      findings.push({
        id: `finding-duplicate-${doc.id}`,
        ruleId: 'RULE-DOCUMENT-DUPLICATE-HASH',
        ruleName: 'Duplicate File Hash Detected',
        severity: 'HIGH',
        category: 'cross_document',
        filename: doc.filename,
        pageNumber: 1,
        evidenceSnippet: `SHA-256 ${doc.sha256} matches: ${filenames}`,
        description: 'This upload is byte-identical to another document in the application. The match may be intentional, but it requires human review because the same file may have been attached to multiple checklist categories.',
        recommendedAction: 'Confirm that the shared file legitimately satisfies each category; replace it if the document was attached incorrectly.',
      });
    }
  }

  return findings;
}

/**
 * Validates document checklist completeness against the 7 mandatory categories.
 */
export function validateChecklistCompleteness(
  documents: DocumentFile[],
  rules: AdminRule[] = DEFAULT_ADMIN_RULES
): ValidationFinding[] {
  const rule = rules.find((r) => r.id === 'RULE-DEMO-EOA-001' || r.id === 'RULE DEMO-EoA-001');
  if (rule && !rule.enabled) {
    return [];
  }

  const findings: ValidationFinding[] = [];
  const presentCategories = new Set(documents.map((d) => d.category));

  for (const categoryMeta of EOA_DOCUMENT_CATEGORIES) {
    if (categoryMeta.mandatory && !presentCategories.has(categoryMeta.id)) {
      findings.push({
        id: `finding-missing-cat-${categoryMeta.id}`,
        ruleId: 'RULE DEMO-EoA-001',
        ruleName: 'Missing Mandatory Document Category',
        severity: 'CRITICAL',
        category: 'checklist',
        filename: 'N/A (Document not uploaded)',
        evidenceSnippet: `Mandatory category "${categoryMeta.name}" has no attached document file.`,
        aphClause: categoryMeta.aphClause,
        description: `Mandatory document category "${categoryMeta.name}" is missing from the submission checklist. AICTE APH regulations require this document for Extension of Approval evaluation.`,
        recommendedAction: `Upload a verified PDF for ${categoryMeta.name} before final officer scrutiny.`,
      });
    }
  }

  return findings;
}

/**
 * Validates document text layers, readability and field rules.
 */
export function validateDocumentFields(
  doc: DocumentFile,
  rules: AdminRule[] = DEFAULT_ADMIN_RULES
): ValidationFinding[] {
  const findings: ValidationFinding[] = [];

  // RULE-DEMO-EOA-004: Text layer check
  const ocrRule = rules.find((r) => r.id === 'RULE-DEMO-EOA-004');
  if (ocrRule && ocrRule.enabled && !doc.hasTextLayer) {
    findings.push({
      id: `finding-ocr-${doc.id}`,
      ruleId: 'RULE-DEMO-EOA-004',
      ruleName: 'Text Layer Presence & Readability Check',
      severity: 'MEDIUM',
      category: doc.category,
      filename: doc.filename,
      pageNumber: 1,
      evidenceSnippet: 'No extractable text stream detected. Document is an unsearchable scanned bitmap.',
      aphClause: 'APH 2025-26 Clause 2.14.9',
      description: 'Document has no extractable text layer. Automated field validation cannot complete without manual officer verification or optical character recognition (OCR).',
      recommendedAction: 'Upload a digitally created PDF or route to authorized human officer for manual scrutiny.',
    });
  }

  // Category specific rules
  if (doc.category === 'ter_receipt') {
    const terRule = rules.find((r) => r.id === 'RULE-DEMO-EOA-003');
    if (terRule && terRule.enabled) {
      const text = (doc.extractedText || '').toUpperCase();
      if (!text.includes('SUCCESSFUL') && !text.includes('CLEARED')) {
        findings.push({
          id: `finding-ter-status-${doc.id}`,
          ruleId: 'RULE-DEMO-EOA-003',
          ruleName: 'TER Fee Receipt Verification & Status',
          severity: 'HIGH',
          category: 'ter_receipt',
          filename: doc.filename,
          pageNumber: 1,
          evidenceSnippet: 'Status keyword "SUCCESSFUL" or "CLEARED" not verified in challan text.',
          aphClause: 'APH 2025-26 Clause 2.4.1',
          description: 'Payment status in TER fee receipt could not be confirmed as successful.',
          recommendedAction: 'Attach official Bharatkosh bank clearance receipt with transaction reference.',
        });
      }
    }
  }

  return findings;
}

/**
 * Calculates honest prototype readiness score based on documented formula:
 * Base 100 - sum of rule penalties - missing mandatory penalties.
 * Clamped between 0 and 100.
 */
export function calculateReadinessScore(
  documents: DocumentFile[],
  findings: ValidationFinding[]
): number {
  let score = 100;

  // Checklist coverage penalty (if fewer than 7 mandatory categories present)
  const presentCategories = new Set(documents.map((d) => d.category));
  const missingCount = EOA_DOCUMENT_CATEGORIES.filter((c) => c.mandatory && !presentCategories.has(c.id)).length;
  score -= missingCount * 15;

  for (const finding of findings) {
    if (finding.resolved) continue;

    switch (finding.severity) {
      case 'CRITICAL':
        score -= 15;
        break;
      case 'HIGH':
        score -= 14;
        break;
      case 'MEDIUM':
        score -= 8;
        break;
      case 'LOW':
        score -= 4;
        break;
      default:
        break;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Maps calculated score and findings to compliance status.
 */
export function mapStatusFromFindings(
  score: number,
  findings: ValidationFinding[],
  missingCount: number = 0
): 'Ready' | 'Needs Attention' | 'Not Ready' {
  const unresolvedCriticalOrHigh = findings.filter(
    (f) => !f.resolved && (f.severity === 'CRITICAL' || f.severity === 'HIGH')
  ).length;

  if (score >= 85 && unresolvedCriticalOrHigh === 0 && missingCount === 0) {
    return 'Ready';
  }
  if (score >= 50) {
    return 'Needs Attention';
  }
  return 'Not Ready';
}

export const statusFromFindings = mapStatusFromFindings;

/**
 * Before and after snapshot diffing for rectification workflow.
 */
export function diffSnapshots(
  previousFindings: ValidationFinding[],
  currentFindings: ValidationFinding[]
): {
  resolved: ValidationFinding[];
  unresolved: ValidationFinding[];
  newlyDetected: ValidationFinding[];
} {
  const currentIds = new Set(currentFindings.map((f) => f.ruleId + f.category));
  const previousIds = new Set(previousFindings.map((f) => f.ruleId + f.category));

  const resolved = previousFindings.filter((pf) => !currentIds.has(pf.ruleId + pf.category));
  const unresolved = currentFindings.filter((cf) => previousIds.has(cf.ruleId + cf.category));
  const newlyDetected = currentFindings.filter((cf) => !previousIds.has(cf.ruleId + cf.category));

  return { resolved, unresolved, newlyDetected };
}

/**
 * Creates the deterministic sample documents metadata.
 */
export function getSampleDocuments(mismatchScenario: boolean = true): DocumentFile[] {
  const docs: DocumentFile[] = [
    {
      id: 'doc-affidavit-2',
      category: 'affidavit_2',
      categoryName: 'Affidavit 2',
      filename: 'affidavit-2-matching.pdf',
      url: '/sample-documents/affidavit-2-matching.pdf',
      fileSize: '6.5 KB',
      uploadTimestamp: '2026-10-25T10:14:00Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText:
        'Shakshya AI — Synthetic Demonstration Document. AFFIDAVIT 2 — MANDATORY COMPLIANCE DECLARATION. Institution Name: ABC College of Engineering. Application ID: DEMO-EOA-2026-001. Academic Year: 2026-2027. Land Area: 10.5 Acres. Built-up area: 18,450 sq. meters. Duly notarized and executed.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
        applicationId: 'DEMO-EOA-2026-001',
        academicYear: '2026-2027',
        deponentName: 'Dr. Arvind S. Sharma',
        builtUpArea: '18,450 sq. meters',
      },
    },
    {
      id: 'doc-ter-receipt',
      category: 'ter_receipt',
      categoryName: 'TER Payment Receipt',
      filename: mismatchScenario ? 'ter-receipt-mismatch.pdf' : 'ter-receipt-matching.pdf',
      url: mismatchScenario ? '/sample-documents/ter-receipt-mismatch.pdf' : '/sample-documents/ter-receipt-matching.pdf',
      fileSize: '6.4 KB',
      uploadTimestamp: '2026-10-25T10:15:30Z',
      pageCount: 1,
      hasTextLayer: true,
      status: mismatchScenario ? 'flagged' : 'verified',
      extractedText: mismatchScenario
        ? 'Shakshya AI. TER CHARGES PAYMENT RECEIPT (SAMPLE MISMATCH DATASET). Institution Name: XYZ Institute of Technology. Application ID: DEMO-EOA-2026-001. Fee Head: TER Processing Charges. Transaction Amount: Rs. 2,00,000/-. Status: SUCCESSFUL / CLEARED.'
        : 'Shakshya AI. TER CHARGES PAYMENT RECEIPT (OFFICIAL EOA CHALLAN). Institution Name: ABC College of Engineering. Application ID: DEMO-EOA-2026-001. Fee Head: TER Processing Charges. Transaction Amount: Rs. 2,00,000/-. Status: SUCCESSFUL / CLEARED.',
      extractedFields: {
        institutionName: mismatchScenario ? 'XYZ Institute of Technology' : 'ABC College of Engineering',
        applicationId: 'DEMO-EOA-2026-001',
        amountPaid: 'Rs. 2,00,000/-',
        challanReference: mismatchScenario ? 'AICTE-TER-2026-990145' : 'AICTE-TER-2026-889143',
        paymentStatus: 'SUCCESSFUL',
      },
    },
    {
      id: 'doc-occupancy-cert',
      category: 'occupancy_certificate',
      categoryName: 'Occupancy Certificate / Building License',
      filename: 'building-license-matching.pdf',
      url: '/sample-documents/building-license-matching.pdf',
      fileSize: '6.2 KB',
      uploadTimestamp: '2026-10-25T10:16:00Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText:
        'Shakshya AI. BUILDING LICENSE & OCCUPANCY CERTIFICATE. Permitted Use: Educational Institution. Institution Name: ABC College of Engineering. Built-up Area: 18,450 sq. meters. Approved by Municipal Authority. Seismic Zone IV certified.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
        builtUpArea: '18,450 sq. meters',
        nocNumber: 'GNIDA/PLN/BDO/2024/774',
      },
    },
    {
      id: 'doc-structural-cert',
      category: 'structural_stability',
      categoryName: 'Structural Stability Certificate',
      filename: 'building-license-matching.pdf',
      url: '/sample-documents/building-license-matching.pdf',
      fileSize: '6.2 KB',
      uploadTimestamp: '2026-10-25T10:16:30Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText:
        'Shakshya AI. Structural Stability endorsement by Chartered Structural Engineer for ABC College of Engineering. Seismic safety zone IV compliant.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
        structuralSafety: 'Compliant with NBC 2016',
      },
    },
    {
      id: 'doc-fire-safety',
      category: 'fire_safety',
      categoryName: 'Fire Safety Certificate',
      filename: 'fire-safety-matching.pdf',
      url: '/sample-documents/fire-safety-matching.pdf',
      fileSize: '6.3 KB',
      uploadTimestamp: '2026-10-25T10:17:00Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText:
        'Shakshya AI. State Fire & Rescue Services Department — No Objection Certificate (Fire Safety). Institution Name: ABC College of Engineering. NOC Ref: UPFS/NOC/2025/1109. Validity: 01-Jan-2025 to 31-Dec-2027.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
        nocNumber: 'UPFS/NOC/2025/1109',
        validityPeriod: '01-Jan-2025 to 31-Dec-2027',
      },
    },
    {
      id: 'doc-satellite-map',
      category: 'satellite_map',
      categoryName: 'Satellite Map with Coordinates',
      filename: 'satellite-map-sample.pdf',
      url: '/sample-documents/satellite-map-sample.pdf',
      fileSize: '5.9 KB',
      uploadTimestamp: '2026-10-25T10:17:30Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText:
        'Shakshya AI. SATELLITE MAP & GIS GEOLOCATION RECORD. Institution Name: ABC College of Engineering. GPS Center Point: 28.4682 N, 77.4984 E. Enclosed Area: 10.5 Acres in single parcel.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
        gpsCoordinates: '28.4682 N, 77.4984 E',
      },
    },
    {
      id: 'doc-audited-accounts',
      category: 'audited_accounts',
      categoryName: 'Previous-Year Audited Accounts',
      filename: 'scanned-ocr-sample.pdf',
      url: '/sample-documents/scanned-ocr-sample.pdf',
      fileSize: '3.9 KB',
      uploadTimestamp: '2026-10-25T10:18:00Z',
      pageCount: 1,
      hasTextLayer: false, // Scanned without searchable text layer
      status: 'ocr_required',
      extractedText: '', // No extractable text stream
      extractedFields: {},
    },
  ];

  return docs;
}

/**
 * Runs full validation on an application with given rules.
 */
export function runApplicationValidation(
  app: Application,
  rules: AdminRule[] = DEFAULT_ADMIN_RULES
): { findings: ValidationFinding[]; readinessScore: number; status: Application['status'] } {
  const findings: ValidationFinding[] = [];

  // 1. Checklist completeness
  findings.push(...validateChecklistCompleteness(app.documents, rules));

  // 2. Individual document field checks
  for (const doc of app.documents) {
    findings.push(...validateDocumentFields(doc, rules));
  }

  // 3. Cross-document consistency
  findings.push(...checkCrossDocumentInstitutionNames(app, rules));
  findings.push(...checkDuplicateDocuments(app.documents));

  // 4. Calculate score & status
  const readinessScore = calculateReadinessScore(app.documents, findings);
  const presentCategories = new Set(app.documents.map((d) => d.category));
  const missingCount = EOA_DOCUMENT_CATEGORIES.filter((c) => c.mandatory && !presentCategories.has(c.id)).length;
  const status = mapStatusFromFindings(readinessScore, findings, missingCount);

  return { findings, readinessScore, status };
}

/**
 * Loads the mismatch sample dataset into an application (deterministic compliance anomaly test scenario).
 */
export function loadSampleMismatchSetIntoApp(app: Application): Application {
  const documents = getSampleDocuments(true);
  const updatedApp: Application = {
    ...app,
    documents,
    lastUpdated: new Date().toISOString(),
  };
  const { findings, readinessScore, status } = runApplicationValidation(updatedApp, getPersistedAdminRules());
  return {
    ...updatedApp,
    findings,
    readinessScore,
    status,
  };
}

/**
 * Loads the matching sample dataset into an application (rectified test scenario).
 */
export function loadSampleMatchingSetIntoApp(app: Application): Application {
  const documents = getSampleDocuments(false);
  const updatedApp: Application = {
    ...app,
    documents,
    lastUpdated: new Date().toISOString(),
  };
  const { findings, readinessScore, status } = runApplicationValidation(updatedApp, getPersistedAdminRules());
  return {
    ...updatedApp,
    findings,
    readinessScore,
    status,
  };
}

/**
 * Initializes the deterministic DEMO-EOA-001 session.
 */
export function initializeDemoSession(existingApps: Application[] = []): {
  demoApp: Application;
  allApps: Application[];
} {
  const demoAppTemplate: Application = {
    id: 'DEMO-EOA-001',
    institutionName: 'ABC College of Engineering',
    instituteId: '1-9876543210',
    academicYear: '2026-2027',
    applicationCategory: 'Extension of Approval (EoA)',
    documents: [],
    findings: [],
    readinessScore: 0,
    status: 'Needs Attention',
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  };

  const initializedDemo = loadSampleMismatchSetIntoApp(demoAppTemplate);

  // Preserve unrelated applications, replace or insert DEMO-EOA-001
  const otherApps = existingApps.filter((a) => a.id !== 'DEMO-EOA-001');
  const allApps = [initializedDemo, ...otherApps];

  return { demoApp: initializedDemo, allApps };
}

/**
 * Resets the demo session safely without deleting user-created applications.
 */
export function resetDemoSession(existingApps: Application[] = []): {
  demoApp: Application;
  allApps: Application[];
} {
  return initializeDemoSession(existingApps);
}
