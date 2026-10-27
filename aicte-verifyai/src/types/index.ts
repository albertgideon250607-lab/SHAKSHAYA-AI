/**
 * Shakshya AI — Institutional Approval Readiness Portal
 * Regulatory Compliance & Automated Document Verification Engine
 */

export type UserRole = 'institution' | 'officer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionName?: string;
  instituteId?: string;
  designation?: string;
  officerId?: string;
}

export type DocumentCategory =
  | 'affidavit_2'
  | 'ter_receipt'
  | 'occupancy_certificate'
  | 'structural_stability'
  | 'fire_safety'
  | 'satellite_map'
  | 'audited_accounts';

export interface CategoryMetadata {
  id: DocumentCategory;
  name: string;
  mandatory: boolean;
  aphClause: string;
  description: string;
  sampleFileName: string;
  sampleMismatchFileName?: string;
}

export const EOA_DOCUMENT_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'affidavit_2',
    name: 'Affidavit 2',
    mandatory: true,
    aphClause: 'APH 2025-26 Chapter II, Affidavit 2',
    description: 'Statutory affidavit on Rs. 100/- non-judicial stamp paper affirming land, built-up area and legal compliance.',
    sampleFileName: 'affidavit-2-matching.pdf',
  },
  {
    id: 'ter_receipt',
    name: 'TER Payment Receipt',
    mandatory: true,
    aphClause: 'APH 2025-26 Clause 2.4.1',
    description: 'Technical Education Regulatory (TER) charges processing fee receipt cleared via Bharatkosh.',
    sampleFileName: 'ter-receipt-matching.pdf',
    sampleMismatchFileName: 'ter-receipt-mismatch.pdf',
  },
  {
    id: 'occupancy_certificate',
    name: 'Occupancy Certificate / Building License',
    mandatory: true,
    aphClause: 'APH 2025-26 Clause 2.14.3',
    description: 'Competent local authority occupancy/completion permit confirming educational building approval.',
    sampleFileName: 'building-license-matching.pdf',
  },
  {
    id: 'structural_stability',
    name: 'Structural Stability Certificate',
    mandatory: true,
    aphClause: 'APH 2025-26 Clause 2.14.4',
    description: 'Certificate issued by registered structural engineer certifying seismic zone IV stability.',
    sampleFileName: 'building-license-matching.pdf', // Can be combined or covered in occupancy
  },
  {
    id: 'fire_safety',
    name: 'Fire Safety Certificate',
    mandatory: true,
    aphClause: 'APH 2025-26 Clause 2.14.5',
    description: 'No Objection Certificate (NOC) from State Fire and Emergency Services Department.',
    sampleFileName: 'fire-safety-matching.pdf',
  },
  {
    id: 'satellite_map',
    name: 'Satellite Map with Coordinates',
    mandatory: true,
    aphClause: 'APH 2025-26 Clause 2.14.8',
    description: 'Bhuvan/Google Earth satellite imagery showing boundary coordinates and geo-tagged plot area.',
    sampleFileName: 'satellite-map-sample.pdf',
  },
  {
    id: 'audited_accounts',
    name: 'Previous-Year Audited Accounts',
    mandatory: true,
    aphClause: 'APH 2025-26 Clause 2.14.9',
    description: 'Chartered Accountant audited balance sheet, income/expenditure statement, and receipt/payment sheet.',
    sampleFileName: 'scanned-ocr-sample.pdf',
  },
];

export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface ValidationFinding {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: FindingSeverity;
  category: DocumentCategory | 'checklist' | 'cross_document';
  filename: string;
  pageNumber?: number;
  evidenceSnippet: string;
  aphClause?: string;
  recommendedAction: string;
  description: string;
  resolved?: boolean;
}

export interface DocumentFile {
  id: string;
  category: DocumentCategory;
  categoryName: string;
  filename: string;
  url: string;
  fileSize?: string;
  uploadTimestamp: string;
  extractedText: string;
  pageCount: number;
  hasTextLayer: boolean;
  status: 'verified' | 'flagged' | 'ocr_required' | 'pending' | 'processing' | 'ocr_failed' | 'ocr_complete';
  source?: 'uploaded' | 'synthetic';
  sha256?: string;
  ocrError?: string;
  ocrPageCount?: number;
  extractedFields: {
    institutionName?: string;
    applicationId?: string;
    academicYear?: string;
    amountPaid?: string;
    validityPeriod?: string;
    builtUpArea?: string;
    gpsCoordinates?: string;
    deponentName?: string;
    nocNumber?: string;
    [key: string]: string | undefined;
  };
}

export interface OfficerReview {
  officerId: string;
  decision: 'RECOMMENDED_FOR_APPROVAL' | 'NEEDS_RECTIFICATION' | 'REJECTED';
  decisionTimestamp: string;
  notes: string;
  scrutinyChecklist: {
    landTitleVerified: boolean;
    fireSafetyValid: boolean;
    terChargesCleared: boolean;
    affidavitDulyNotarized: boolean;
  };
}

export interface ValidationSnapshot {
  readinessScore: number;
  findingsCount: number;
  timestamp: string;
  findings: ValidationFinding[];
  status: string;
}

export interface Application {
  id: string;
  institutionName: string;
  instituteId: string;
  academicYear: string;
  applicationCategory: string;
  documents: DocumentFile[];
  findings: ValidationFinding[];
  readinessScore: number;
  status: 'Ready' | 'Needs Attention' | 'Not Ready' | 'Approved' | 'Rectification Requested';
  lastUpdated: string;
  isDemo?: boolean;
  officerReview?: OfficerReview;
  previousSnapshot?: ValidationSnapshot;
}

export interface AdminRule {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory | 'cross_document' | 'checklist';
  severity: FindingSeverity;
  enabled: boolean;
  aphClause: string;
  penaltyPoints: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  applicationId: string;
  eventType: 'SCAN_INITIATED' | 'VALIDATION_COMPLETED' | 'RECTIFICATION_APPLIED' | 'OFFICER_DECISION' | 'REPORT_GENERATED' | 'RULE_TOGGLED';
  actor: string;
  summary: string;
  metadata?: Record<string, unknown>;
}
