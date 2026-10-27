import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkDocumentRequiredFields,
  checkCrossDocumentInstitutionNames,
  checkDuplicateDocuments,
  validateChecklistCompleteness,
  validateDocumentFields,
  calculateReadinessScore,
  statusFromFindings,
  diffSnapshots,
  loadSampleMatchingSetIntoApp,
  loadSampleMismatchSetIntoApp,
  initializeDemoSession,
  resetDemoSession,
  DEFAULT_ADMIN_RULES,
  getPersistedAdminRules,
  saveAdminRules,
} from './rules';
import { Application, DocumentFile } from '../types';

describe('Shakshya AI — Institutional Regulatory Compliance Suite', () => {
  let sampleApp: Application;

  beforeEach(() => {
    sampleApp = {
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
  });

  // Test 1
  it('passes a synthetic document containing all configured required fields', () => {
    const doc: DocumentFile = {
      id: 'doc-affidavit',
      category: 'affidavit_2',
      categoryName: 'Affidavit 2',
      filename: 'affidavit-2-matching.pdf',
      url: '/sample-documents/affidavit-2-matching.pdf',
      uploadTimestamp: '2026-10-25T10:00:00Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText: 'Affidavit 2. Institution: ABC College of Engineering. Land: 10.5 Acres. Built-up: 18450 sq.m.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
        academicYear: '2026-2027',
        landArea: '10.5 Acres',
      },
    };

    const result = checkDocumentRequiredFields(doc, ['institutionName', 'academicYear', 'landArea']);
    expect(result.passed).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  // Test 2
  it('returns a failed check when a synthetic document misses a configured field', () => {
    const doc: DocumentFile = {
      id: 'doc-incomplete',
      category: 'ter_receipt',
      categoryName: 'TER Payment Receipt',
      filename: 'ter-incomplete.pdf',
      url: '/sample-documents/ter-incomplete.pdf',
      uploadTimestamp: '2026-10-25T10:00:00Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'flagged',
      extractedText: 'Challan without transaction ref or amount.',
      extractedFields: {
        institutionName: 'ABC College of Engineering',
      },
    };

    const result = checkDocumentRequiredFields(doc, ['institutionName', 'amountPaid', 'challanReference']);
    expect(result.passed).toBe(false);
    expect(result.missingFields).toContain('amountPaid');
    expect(result.missingFields).toContain('challanReference');
  });

  // Test 3
  it('flags conflicting institution names across synthetic documents for human review', () => {
    const appWithMismatch: Application = {
      ...sampleApp,
      institutionName: 'ABC College of Engineering',
      documents: [
        {
          id: 'doc-ter-mismatch',
          category: 'ter_receipt',
          categoryName: 'TER Payment Receipt',
          filename: 'ter-receipt-mismatch.pdf',
          url: '/sample-documents/ter-receipt-mismatch.pdf',
          uploadTimestamp: '2026-10-25T10:00:00Z',
          pageCount: 1,
          hasTextLayer: true,
          status: 'flagged',
          extractedText: 'TER Receipt for XYZ Institute of Technology.',
          extractedFields: {
            institutionName: 'XYZ Institute of Technology', // Conflicting
          },
        },
      ],
    };

    const findings = checkCrossDocumentInstitutionNames(appWithMismatch, DEFAULT_ADMIN_RULES);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].ruleId).toBe('RULE DEMO-EoA-002');
    expect(findings[0].evidenceSnippet).toContain('XYZ Institute of Technology');
    expect(findings[0].severity).toBe('HIGH');
  });

  // Test 4
  it('does not flag cross-document mismatches when institution names match', () => {
    const appWithMatch: Application = {
      ...sampleApp,
      institutionName: 'ABC College of Engineering',
      documents: [
        {
          id: 'doc-ter-match',
          category: 'ter_receipt',
          categoryName: 'TER Payment Receipt',
          filename: 'ter-receipt-matching.pdf',
          url: '/sample-documents/ter-receipt-matching.pdf',
          uploadTimestamp: '2026-10-25T10:00:00Z',
          pageCount: 1,
          hasTextLayer: true,
          status: 'verified',
          extractedText: 'TER Receipt for ABC College of Engineering.',
          extractedFields: {
            institutionName: 'ABC College of Engineering',
          },
        },
      ],
    };

    const findings = checkCrossDocumentInstitutionNames(appWithMatch, DEFAULT_ADMIN_RULES);
    expect(findings).toHaveLength(0);
  });

  it('flags byte-identical uploaded documents by SHA-256 hash', () => {
    const documents: DocumentFile[] = [
      {
        id: 'doc-one',
        category: 'occupancy_certificate',
        categoryName: 'Occupancy Certificate / Building License',
        filename: 'building-license.pdf',
        url: 'blob:one',
        uploadTimestamp: new Date().toISOString(),
        pageCount: 1,
        hasTextLayer: false,
        status: 'ocr_required',
        source: 'uploaded',
        sha256: 'same-file-hash',
        extractedText: '',
        extractedFields: {},
      },
      {
        id: 'doc-two',
        category: 'structural_stability',
        categoryName: 'Structural Stability Certificate',
        filename: 'structural-certificate.pdf',
        url: 'blob:two',
        uploadTimestamp: new Date().toISOString(),
        pageCount: 1,
        hasTextLayer: false,
        status: 'ocr_required',
        source: 'uploaded',
        sha256: 'same-file-hash',
        extractedText: '',
        extractedFields: {},
      },
    ];

    const findings = checkDuplicateDocuments(documents);
    expect(findings).toHaveLength(2);
    expect(findings[0].ruleId).toBe('RULE-DOCUMENT-DUPLICATE-HASH');
    expect(findings[0].recommendedAction).toContain('Confirm');
  });

  // Test 5
  it('RULE DEMO-EoA-001: flags missing mandatory category in document checklist', () => {
    // Only upload 1 document out of 7 mandatory categories
    const documents: DocumentFile[] = [
      {
        id: 'doc-1',
        category: 'affidavit_2',
        categoryName: 'Affidavit 2',
        filename: 'affidavit-2-matching.pdf',
        url: '/sample-documents/affidavit-2-matching.pdf',
        uploadTimestamp: '2026-10-25T10:00:00Z',
        pageCount: 1,
        hasTextLayer: true,
        status: 'verified',
        extractedText: 'Affidavit text',
        extractedFields: { institutionName: 'ABC College of Engineering' },
      },
    ];

    const findings = validateChecklistCompleteness(documents, DEFAULT_ADMIN_RULES);
    expect(findings.length).toBe(6); // 6 missing mandatory categories
    expect(findings[0].ruleId).toBe('RULE DEMO-EoA-001');
    expect(findings[0].severity).toBe('CRITICAL');
  });

  // Test 6
  it('returns Not verified honest status when document has no extractable text layer', () => {
    const scannedDoc: DocumentFile = {
      id: 'doc-scanned',
      category: 'audited_accounts',
      categoryName: 'Previous-Year Audited Accounts',
      filename: 'scanned-ocr-sample.pdf',
      url: '/sample-documents/scanned-ocr-sample.pdf',
      uploadTimestamp: '2026-10-25T10:00:00Z',
      pageCount: 1,
      hasTextLayer: false, // Scanned without text layer
      status: 'ocr_required',
      extractedText: '',
      extractedFields: {},
    };

    const findings = validateDocumentFields(scannedDoc, DEFAULT_ADMIN_RULES);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].ruleId).toBe('RULE-DEMO-EOA-004');
    expect(findings[0].description).toContain('OCR');
  });

  // Test 7
  it('persists and enforces custom admin rules by enabling/disabling', () => {
    const modifiedRules = DEFAULT_ADMIN_RULES.map((r) =>
      r.id === 'RULE-DEMO-EOA-002' ? { ...r, enabled: false } : r
    );
    saveAdminRules(modifiedRules);

    const appWithMismatch: Application = {
      ...sampleApp,
      institutionName: 'ABC College of Engineering',
      documents: [
        {
          id: 'doc-ter-mismatch',
          category: 'ter_receipt',
          categoryName: 'TER Payment Receipt',
          filename: 'ter-receipt-mismatch.pdf',
          url: '/sample-documents/ter-receipt-mismatch.pdf',
          uploadTimestamp: '2026-10-25T10:00:00Z',
          pageCount: 1,
          hasTextLayer: true,
          status: 'flagged',
          extractedText: 'TER Receipt for XYZ Institute of Technology.',
          extractedFields: {
            institutionName: 'XYZ Institute of Technology',
          },
        },
      ],
    };

    // When disabled, no finding is produced
    const findingsWhenDisabled = checkCrossDocumentInstitutionNames(appWithMismatch, modifiedRules);
    expect(findingsWhenDisabled).toHaveLength(0);

    // Re-enable
    const reenabledRules = DEFAULT_ADMIN_RULES.map((r) =>
      r.id === 'RULE-DEMO-EOA-002' ? { ...r, enabled: true } : r
    );
    saveAdminRules(reenabledRules);
    const findingsWhenEnabled = checkCrossDocumentInstitutionNames(appWithMismatch, reenabledRules);
    expect(findingsWhenEnabled.length).toBe(1);
  });

  // Test 8
  it('calculates honest prototype readiness score based on documented formula', () => {
    // 7 documents with all categories present, 0 findings
    const mockDocs: DocumentFile[] = [
      'affidavit_2',
      'ter_receipt',
      'occupancy_certificate',
      'structural_stability',
      'fire_safety',
      'satellite_map',
      'audited_accounts',
    ].map((cat, idx) => ({
      id: `doc-${idx}`,
      category: cat as any,
      categoryName: cat,
      filename: `${cat}.pdf`,
      url: `/sample-documents/${cat}.pdf`,
      uploadTimestamp: '2026-10-25T10:00:00Z',
      pageCount: 1,
      hasTextLayer: true,
      status: 'verified',
      extractedText: 'valid content',
      extractedFields: { institutionName: 'ABC College of Engineering' },
    }));

    const perfectScore = calculateReadinessScore(mockDocs, []);
    expect(perfectScore).toBe(100);

    // Add 1 HIGH finding (-14 points)
    const withHighFinding = calculateReadinessScore(mockDocs, [
      {
        id: 'f1',
        ruleId: 'RULE DEMO-EoA-002',
        ruleName: 'Mismatch',
        severity: 'HIGH',
        category: 'ter_receipt',
        filename: 'ter-receipt-mismatch.pdf',
        evidenceSnippet: 'XYZ',
        recommendedAction: 'Rectify',
        description: 'Institution mismatch',
      },
    ]);
    expect(withHighFinding).toBe(86);
  });

  // Test 9
  it('correctly maps statusFromFindings', () => {
    expect(statusFromFindings(95, [], 0)).toBe('Ready');
    expect(
      statusFromFindings(
        70,
        [
          {
            id: 'f1',
            ruleId: 'RULE DEMO-EoA-002',
            ruleName: 'Mismatch',
            severity: 'HIGH',
            category: 'ter_receipt',
            filename: 'ter.pdf',
            evidenceSnippet: 'XYZ',
            recommendedAction: 'Check',
            description: 'Mismatch',
          },
        ],
        0
      )
    ).toBe('Needs Attention');
    expect(statusFromFindings(40, [], 3)).toBe('Not Ready');
  });

  // Test 10
  it('demo initialisation and reset preserves unrelated applications while resetting DEMO-EOA-001', () => {
    const userApp: Application = {
      id: 'USER-CUSTOM-999',
      institutionName: 'Stanford Engineering Academy',
      instituteId: '1-1111111111',
      academicYear: '2026-2027',
      applicationCategory: 'New Institute Approval',
      documents: [],
      findings: [],
      readinessScore: 88,
      status: 'Ready',
      lastUpdated: '2026-10-25T08:00:00Z',
    };

    const initialResult = initializeDemoSession([userApp]);
    expect(initialResult.allApps).toHaveLength(2);
    expect(initialResult.allApps.some((a) => a.id === 'USER-CUSTOM-999')).toBe(true);
    expect(initialResult.demoApp.id).toBe('DEMO-EOA-001');

    // Resetting preserves userApp
    const resetResult = resetDemoSession(initialResult.allApps);
    expect(resetResult.allApps.some((a) => a.id === 'USER-CUSTOM-999')).toBe(true);
    expect(resetResult.demoApp.id).toBe('DEMO-EOA-001');
  });

  // Test 11
  it('loadSampleMatchingSetIntoApp loads matching sample PDFs and produces valid findings', () => {
    const app = loadSampleMatchingSetIntoApp(sampleApp);
    expect(app.documents).toHaveLength(7);

    // In matching set, no institution mismatch finding is flagged
    const mismatchFindings = app.findings.filter((f) => f.ruleId === 'RULE DEMO-EoA-002');
    expect(mismatchFindings).toHaveLength(0);
  });

  // Test 12
  it('loadSampleMismatchSetIntoApp flags RULE DEMO-EoA-002 for differing institution names', () => {
    const app = loadSampleMismatchSetIntoApp(sampleApp);
    expect(app.documents).toHaveLength(7);

    // Mismatch set contains ter-receipt-mismatch.pdf with XYZ Institute of Technology
    const mismatchFindings = app.findings.filter(
      (f) => f.ruleId === 'RULE DEMO-EoA-002' || f.ruleId === 'RULE-DEMO-EOA-002'
    );
    expect(mismatchFindings.length).toBeGreaterThan(0);
    expect(mismatchFindings[0].evidenceSnippet).toContain('XYZ Institute of Technology');
    expect(app.status).toBe('Needs Attention');
  });
});
