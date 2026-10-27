/**
 * Shakshya AI — Global Application Context & State Management
 * Institutional Approval Readiness Portal
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Application,
  AdminRule,
  AuditLogEntry,
  AuthUser,
  DocumentCategory,
  DocumentFile,
  EOA_DOCUMENT_CATEGORIES,
  UserRole,
  ValidationFinding,
} from '../types';
import {
  DEFAULT_ADMIN_RULES,
  getPersistedAdminRules,
  saveAdminRules,
  initializeDemoSession,
  resetDemoSession,
  loadSampleMatchingSetIntoApp,
  loadSampleMismatchSetIntoApp,
  runApplicationValidation,
} from '../validation/rules';
import { extractFieldsFromOcrText, extractTextWithOcr, type OcrProgress } from '../utils/ocr';

export type ActivePage = 'landing' | 'login' | 'register' | 'app';

export interface AppContextType {
  // Authentication & Role
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  login: (role: UserRole, email: string, name?: string, institutionName?: string) => void;
  logout: () => void;

  // Application Data & Tab Navigation
  applications: Application[];
  currentApp: Application | null;
  currentAppId: string;
  activeTab: string;
  adminRules: AdminRule[];
  auditLogs: AuditLogEntry[];
  isProcessingDemo: boolean;
  processingStage: number;
  processingStatusText: string;
  processingError: string | null;
  selectedEvidenceFinding: ValidationFinding | null;
  evidenceModalOpen: boolean;
  setActiveTab: (tab: string) => void;
  setCurrentAppId: (id: string) => void;
  startOneClickDemo: () => Promise<void>;
  resetDemo: () => void;
  rectifyDocument: (category: DocumentCategory, replacementFile: string) => void;
  recordOfficerDecision: (
    decision: 'RECOMMENDED_FOR_APPROVAL' | 'NEEDS_RECTIFICATION' | 'REJECTED',
    notes: string,
    checklist: {
      landTitleVerified: boolean;
      fireSafetyValid: boolean;
      terChargesCleared: boolean;
      affidavitDulyNotarized: boolean;
    }
  ) => void;
  toggleAdminRule: (ruleId: string) => void;
  openEvidenceViewer: (finding: ValidationFinding) => void;
  closeEvidenceViewer: () => void;
  createNewApplication: (name: string, instituteId: string, year: string, category?: string) => void;
  uploadDocument: (category: DocumentCategory, file: File) => Promise<void>;
  startOcr: (documentId: string) => Promise<void>;
  cancelOcr: () => void;
  ocrProgress: OcrProgress | null;
  updateDocumentFields: (documentId: string, fields: DocumentFile['extractedFields'], text?: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_USER = 'aicte_verifyai_current_user';
const STORAGE_KEY_PAGE = 'aicte_verifyai_active_page';
const STORAGE_KEY_APPS = 'aicte_verifyai_applications';
const STORAGE_KEY_ACTIVE_ID = 'aicte_verifyai_active_app_id';
const STORAGE_KEY_AUDIT = 'aicte_verifyai_audit_logs';

function sanitizeStoredApplications(applications: Application[]): Application[] {
  return applications.map((application) => ({
    ...application,
    documents: application.documents.map((document) => ({
      ...document,
      url: document.source === 'uploaded' ? '' : document.url,
      extractedText: document.source === 'uploaded' ? '' : document.extractedText,
      extractedFields: document.source === 'uploaded' ? {} : document.extractedFields,
    })),
  }));
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State (default null -> Landing Page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY_USER);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.role) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [activePage, setActivePage] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedPage = window.localStorage.getItem(STORAGE_KEY_PAGE) as ActivePage | null;
      if (savedPage) return savedPage;
    }
    return 'landing';
  });

  const [adminRules, setAdminRules] = useState<AdminRule[]>(() => getPersistedAdminRules());
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY_APPS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return sanitizeStoredApplications(parsed);
        }
      } catch {
        // fallback
      }
    }
    const { allApps } = initializeDemoSession([]);
    return allApps;
  });

  const [currentAppId, setCurrentAppId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (stored) return stored;
    }
    return 'DEMO-EOA-001';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isProcessingDemo, setIsProcessingDemo] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [processingStatusText, setProcessingStatusText] = useState<string>('Ready');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [selectedEvidenceFinding, setSelectedEvidenceFinding] = useState<ValidationFinding | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const ocrFiles = useRef(new Map<string, File>());
  const ocrAbortController = useRef<AbortController | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY_AUDIT);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'audit-1',
        timestamp: new Date().toISOString(),
        applicationId: 'DEMO-EOA-001',
        eventType: 'SCAN_INITIATED',
        actor: 'AICTE-SYSTEM-SCANNER',
        summary: 'Application compliance profile initialized for ABC College of Engineering.',
      },
    ];
  });

  // Save user session
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (currentUser) {
        window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
  }, [currentUser]);

  // Save active page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_PAGE, activePage);
    }
  }, [activePage]);

  // Save applications to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(sanitizeStoredApplications(applications)));
    }
  }, [applications]);

  // Save active ID
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_ACTIVE_ID, currentAppId);
    }
  }, [currentAppId]);

  // Save audit logs
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
    }
  }, [auditLogs]);

  const currentApp = applications.find((a) => a.id === currentAppId) || applications[0] || null;

  const logAudit = useCallback((eventType: AuditLogEntry['eventType'], summary: string, metadata?: Record<string, unknown>) => {
    const actorName =
      currentUser?.role === 'officer'
        ? currentUser.officerId || 'AICTE-SCRUTINY-OFFICER-4412'
        : currentUser?.role === 'admin'
        ? 'AICTE-ADMIN-SUPER'
        : currentUser?.name || 'INSTITUTION-REPRESENTATIVE';

    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      applicationId: currentAppId,
      eventType,
      actor: actorName,
      summary,
      metadata,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  }, [currentAppId, currentUser]);

  /**
   * User Authentication: Login
   */
  const login = useCallback((role: UserRole, email: string, name?: string, institutionName?: string) => {
    let user: AuthUser;

    if (role === 'officer') {
      user = {
        id: 'usr-off-4412',
        name: name || 'Sh. Rajesh Kumar',
        email: email || 'officer.4412@aicte.gov.in',
        role: 'officer',
        officerId: 'AICTE-SCRUTINY-OFFICER-4412',
        designation: 'Senior Scrutiny Officer (Northern Regional Office)',
      };
      setActiveTab('officer_review');
    } else if (role === 'admin') {
      user = {
        id: 'usr-adm-01',
        name: name || 'Smt. Neha Verma',
        email: email || 'admin.compliance@aicte.gov.in',
        role: 'admin',
        designation: 'Director (Approval & Regulatory Policy)',
      };
      setActiveTab('admin_rules');
    } else {
      user = {
        id: 'usr-inst-101',
        name: name || 'Dr. Arvind S. Sharma',
        email: email || 'principal@abccollege.edu.in',
        role: 'institution',
        institutionName: institutionName || 'ABC College of Engineering',
        instituteId: '1-9876543210',
        designation: 'Authorized Principal / Head of Institution',
      };
      setActiveTab('dashboard');
    }

    setCurrentUser(user);
    setActivePage('app');
    logAudit('SCAN_INITIATED', `User ${user.name} logged in with role [${role.toUpperCase()}].`);
  }, [logAudit]);

  /**
   * User Authentication: Logout
   */
  const logout = useCallback(() => {
    if (currentUser) {
      logAudit('SCAN_INITIATED', `User ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
    setActivePage('landing');
    setActiveTab('dashboard');
  }, [currentUser, logAudit]);

  /**
   * One-Click Automatic Demo Workflow (optional secondary action)
   */
  const startOneClickDemo = useCallback(async () => {
    // 1. Prevent duplicate concurrent demo runs
    if (isProcessingDemo) {
      console.warn('Demo already processing, ignoring duplicate click.');
      return;
    }

    // Auto log in as institutional representative for the demo session if not already logged in
    if (!currentUser) {
      setCurrentUser({
        id: 'usr-demo-inst',
        name: 'Dr. Arvind S. Sharma (Demo)',
        email: 'demo@abccollege.edu.in',
        role: 'institution',
        institutionName: 'ABC College of Engineering',
        instituteId: '1-9876543210',
        designation: 'Authorized Representative (Demo Mode)',
      });
    }

    setIsProcessingDemo(true);
    setProcessingError(null);
    setProcessingStage(1);
    setProcessingStatusText('Initializing synthetic sample application (DEMO-EOA-001)...');
    setActivePage('app');
    setActiveTab('upload_processing');

    try {
      // Safely reset demo session
      const { demoApp, allApps } = resetDemoSession(applications);
      setApplications(allApps);
      setCurrentAppId('DEMO-EOA-001');

      logAudit('SCAN_INITIATED', 'Automatic document validation initiated for DEMO-EOA-001.');

      // Stage 1 -> 2: Classify documents
      await new Promise((r) => setTimeout(r, 650));
      setProcessingStage(2);
      setProcessingStatusText('Classifying 7 statutory EoA checklist categories against AICTE APH...');

      // Stage 2 -> 3: PDF text extraction
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStage(3);
      setProcessingStatusText('Extracting searchable text layers from PDFs & checking readability...');

      // Stage 3 -> 4: Validate document fields
      await new Promise((r) => setTimeout(r, 750));
      setProcessingStage(4);
      setProcessingStatusText('Executing rule validators on Affidavit 2, TER receipt, and Fire Safety NOC...');

      // Stage 4 -> 5: Cross-document consistency checks
      await new Promise((r) => setTimeout(r, 800));
      setProcessingStage(5);
      setProcessingStatusText('Reconciling cross-document institution names and payment records...');

      // Stage 5 -> 6: Prepare results & score
      await new Promise((r) => setTimeout(r, 650));
      setProcessingStage(6);
      setProcessingStatusText('Synthesizing evidence snippets, calculating preliminary readiness score...');

      // Finalize
      await new Promise((r) => setTimeout(r, 500));
      setIsProcessingDemo(false);
      logAudit('VALIDATION_COMPLETED', `Validation completed with preliminary readiness score: ${demoApp.readinessScore}%.`);
      setActiveTab('validation_results');
    } catch (err: unknown) {
      console.error('Error during automatic demo:', err);
      setProcessingError(err instanceof Error ? err.message : 'Validation workflow encountered an unexpected failure.');
      setIsProcessingDemo(false);
    }
  }, [isProcessingDemo, currentUser, applications, logAudit]);

  /**
   * Reset Demo application safely
   */
  const resetDemo = useCallback(() => {
    const { allApps } = resetDemoSession(applications);
    setApplications(allApps);
    setCurrentAppId('DEMO-EOA-001');
    logAudit('SCAN_INITIATED', 'Reset DEMO-EOA-001 session to default test scenario.');
  }, [applications, logAudit]);

  /**
   * Rectify Document Workflow (Before/After snapshot diffing)
   */
  const rectifyDocument = useCallback((category: DocumentCategory, replacementFile: string) => {
    if (!currentApp) return;

    // Preserve previous snapshot
    const previousSnapshot = {
      readinessScore: currentApp.readinessScore,
      findingsCount: currentApp.findings.length,
      timestamp: currentApp.lastUpdated,
      findings: [...currentApp.findings],
      status: currentApp.status,
    };

    // Load matching / rectified dataset
    const updatedAppBase = {
      ...currentApp,
      previousSnapshot,
      lastUpdated: new Date().toISOString(),
    };

    const rectifiedApp = loadSampleMatchingSetIntoApp(updatedAppBase);

    setApplications((prev) =>
      prev.map((a) => (a.id === rectifiedApp.id ? rectifiedApp : a))
    );

    logAudit(
      'RECTIFICATION_APPLIED',
      `Rectified ${category} with verified file "${replacementFile}". Readiness improved from ${previousSnapshot.readinessScore}% to ${rectifiedApp.readinessScore}%.`
    );

    setActiveTab('rectify_reupload');
  }, [currentApp, logAudit]);

  /**
   * Officer Scrutiny Determination
   */
  const recordOfficerDecision = useCallback(
    (
      decision: 'RECOMMENDED_FOR_APPROVAL' | 'NEEDS_RECTIFICATION' | 'REJECTED',
      notes: string,
      checklist: {
        landTitleVerified: boolean;
        fireSafetyValid: boolean;
        terChargesCleared: boolean;
        affidavitDulyNotarized: boolean;
      }
    ) => {
      if (!currentApp) return;

      const newStatus =
        decision === 'RECOMMENDED_FOR_APPROVAL'
          ? 'Approved'
          : decision === 'NEEDS_RECTIFICATION'
          ? 'Rectification Requested'
          : 'Not Ready';

      const updatedApp: Application = {
        ...currentApp,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        officerReview: {
          officerId: currentUser?.officerId || 'AICTE-SCRUTINY-OFFICER-4412',
          decision,
          decisionTimestamp: new Date().toISOString(),
          notes,
          scrutinyChecklist: checklist,
        },
      };

      setApplications((prev) =>
        prev.map((a) => (a.id === updatedApp.id ? updatedApp : a))
      );

      logAudit(
        'OFFICER_DECISION',
        `Scrutiny officer recorded decision "${decision.replace(/_/g, ' ')}" with status "${newStatus}". Remarks: "${notes.slice(0, 60)}..."`
      );
    },
    [currentApp, currentUser, logAudit]
  );

  /**
   * Toggle Admin Rules
   */
  const toggleAdminRule = useCallback(
    (ruleId: string) => {
      const updatedRules = adminRules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      );
      setAdminRules(updatedRules);
      saveAdminRules(updatedRules);

      // Re-run validation on all applications
      setApplications((prevApps) =>
        prevApps.map((app) => {
          const { findings, readinessScore, status } = runApplicationValidation(app, updatedRules);
          return {
            ...app,
            findings,
            readinessScore,
            status,
            lastUpdated: new Date().toISOString(),
          };
        })
      );

      logAudit('RULE_TOGGLED', `Admin toggled rule "${ruleId}". Re-validation executed across applications.`);
    },
    [adminRules, logAudit]
  );

  const openEvidenceViewer = useCallback((finding: ValidationFinding) => {
    setSelectedEvidenceFinding(finding);
    setEvidenceModalOpen(true);
  }, []);

  const closeEvidenceViewer = useCallback(() => {
    setEvidenceModalOpen(false);
    setSelectedEvidenceFinding(null);
  }, []);

  const createNewApplication = useCallback(
    (name: string, instituteId: string, year: string, category?: string) => {
      const newId = `APP-${year.slice(2, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newApp: Application = {
        id: newId,
        institutionName: name,
        instituteId: instituteId || '1-XXXXXXXXXX',
        academicYear: year,
        applicationCategory: category || 'Extension of Approval (EoA)',
        documents: [],
        findings: [],
        readinessScore: 0,
        status: 'Not Ready',
        lastUpdated: new Date().toISOString(),
      };

      const { findings, readinessScore, status } = runApplicationValidation(newApp, adminRules);
      const appWithValidation = { ...newApp, findings, readinessScore, status };

      setApplications((prev) => [appWithValidation, ...prev]);
      setCurrentAppId(newId);
      setActiveTab('checklist');
      logAudit('SCAN_INITIATED', `Created new application ${newId} for ${name}.`);
    },
    [adminRules, logAudit]
  );

  const uploadDocument = useCallback(
    async (category: DocumentCategory, file: File) => {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
      const maxFileSize = 10 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only PDF, PNG, JPEG, and WebP documents are supported.');
      }
      if (file.size > maxFileSize) {
        throw new Error('Documents must be 10 MB or smaller.');
      }
      if (!currentApp) {
        throw new Error('Select or create an application before uploading a document.');
      }

      const buffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buffer);
      const sha256 = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
      const existingDuplicate = currentApp.documents.find((doc) => doc.sha256 === sha256);
      const categoryMetadata = EOA_DOCUMENT_CATEGORIES.find((item) => item.id === category);
      if (!categoryMetadata) {
        throw new Error('Unsupported document category.');
      }

      const isPdf = file.type === 'application/pdf';
      const document: DocumentFile = {
        id: `doc-upload-${Date.now()}`,
        category,
        categoryName: categoryMetadata.name,
        filename: file.name,
        url: URL.createObjectURL(file),
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        uploadTimestamp: new Date().toISOString(),
        pageCount: 1,
        hasTextLayer: false,
        status: existingDuplicate ? 'flagged' : isPdf ? 'ocr_required' : 'pending',
        source: 'uploaded',
        sha256,
        extractedText: '',
        extractedFields: {},
      };
      ocrFiles.current.set(document.id, file);

      const updatedApp = {
        ...currentApp,
        documents: [
          ...currentApp.documents.filter((doc) => doc.category !== category),
          document,
        ],
        lastUpdated: new Date().toISOString(),
      };
      const replacedDocument = currentApp.documents.find((doc) => doc.category === category);
      if (replacedDocument?.source === 'uploaded' && replacedDocument.url) {
        URL.revokeObjectURL(replacedDocument.url);
        ocrFiles.current.delete(replacedDocument.id);
      }
      const { findings, readinessScore, status } = runApplicationValidation(updatedApp, adminRules);
      setApplications((previous) =>
        previous.map((app) =>
          app.id === currentApp.id
            ? { ...updatedApp, findings, readinessScore, status }
            : app
        )
      );
      logAudit('SCAN_INITIATED', `Uploaded ${file.name} for ${categoryMetadata.name}.`, {
        sha256,
        source: 'uploaded',
      });
    },
    [adminRules, currentApp, logAudit]
  );

      const startOcr = useCallback(
        async (documentId: string) => {
          const document = currentApp?.documents.find((item) => item.id === documentId);
          const file = ocrFiles.current.get(documentId);
          if (!document || !file) {
            throw new Error('The original file is no longer available in this browser session. Please upload it again.');
          }
          if (ocrAbortController.current) {
            throw new Error('Another OCR job is already running.');
          }

          const controller = new AbortController();
          ocrAbortController.current = controller;
          setOcrProgress({
            documentId,
            page: 1,
            totalPages: 1,
            percent: 0,
            status: 'loading',
            message: 'Loading local OCR worker...',
          });
          setApplications((previous) =>
            previous.map((app) =>
              app.id === currentApp.id
                ? {
                    ...app,
                    documents: app.documents.map((item) =>
                      item.id === documentId
                        ? { ...item, status: 'processing', ocrError: undefined }
                        : item
                    ),
                  }
                : app
            )
          );

          try {
            const result = await extractTextWithOcr(
              file,
              documentId,
              (progress) => setOcrProgress(progress),
              controller.signal
            );
            const extractedFields = extractFieldsFromOcrText(result.text);
            const updatedApp = {
              ...currentApp,
              documents: currentApp.documents.map((item) =>
                item.id === documentId
                  ? {
                      ...item,
                      extractedText: result.text,
                      extractedFields: {
                        ...item.extractedFields,
                        ...extractedFields,
                      },
                      pageCount: result.pageCount,
                      ocrPageCount: result.pageCount,
                      hasTextLayer: result.hasTextLayer,
                      status: 'ocr_complete' as const,
                      ocrError: undefined,
                    }
                  : item
              ),
              lastUpdated: new Date().toISOString(),
            };
            const validation = runApplicationValidation(updatedApp, adminRules);
            setApplications((previous) =>
              previous.map((app) =>
                app.id === currentApp.id
                  ? { ...updatedApp, ...validation }
                  : app
              )
            );
            setOcrProgress({
              documentId,
              page: result.pageCount,
              totalPages: result.pageCount,
              percent: 100,
              status: 'completed',
              message: 'OCR completed. Review the extracted text and fields before relying on validation results.',
            });
            logAudit('VALIDATION_COMPLETED', `Local OCR completed for ${document.filename}.`, {
              documentId,
              pageCount: result.pageCount,
            });
          } catch (error) {
            const isCancelled = error instanceof DOMException && error.name === 'AbortError';
            setApplications((previous) =>
              previous.map((app) =>
                app.id === currentApp.id
                  ? {
                      ...app,
                      documents: app.documents.map((item) =>
                        item.id === documentId
                          ? {
                              ...item,
                              status: isCancelled ? 'ocr_required' : 'ocr_failed',
                              ocrError: isCancelled
                                ? 'OCR cancelled. You can retry when ready.'
                                : error instanceof Error
                                ? error.message
                                : 'OCR failed unexpectedly.',
                            }
                          : item
                      ),
                    }
                  : app
              )
            );
            setOcrProgress({
              documentId,
              page: 1,
              totalPages: 1,
              percent: 0,
              status: isCancelled ? 'cancelled' : 'failed',
              message: isCancelled
                ? 'OCR cancelled.'
                : error instanceof Error
                ? error.message
                : 'OCR failed unexpectedly.',
            });
            if (!isCancelled) throw error;
          } finally {
            ocrAbortController.current = null;
          }
        },
        [adminRules, currentApp, logAudit]
      );

      const cancelOcr = useCallback(() => {
        ocrAbortController.current?.abort();
      }, []);

      const updateDocumentFields = useCallback(
        (documentId: string, fields: DocumentFile['extractedFields'], text?: string) => {
          if (!currentApp) return;
          const updatedApp = {
            ...currentApp,
            documents: currentApp.documents.map((item) =>
              item.id === documentId
                ? {
                    ...item,
                    extractedFields: fields,
                    extractedText: text ?? item.extractedText,
                  }
                : item
            ),
            lastUpdated: new Date().toISOString(),
          };
          const validation = runApplicationValidation(updatedApp, adminRules);
          setApplications((previous) =>
            previous.map((app) => (app.id === currentApp.id ? { ...updatedApp, ...validation } : app))
          );
          logAudit('VALIDATION_COMPLETED', `Manually corrected extracted fields for ${documentId}.`);
        },
        [adminRules, currentApp, logAudit]
      );
  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        userRole: currentUser?.role || null,
        activePage,
        setActivePage,
        login,
        logout,
        applications,
        currentApp,
        currentAppId,
        activeTab,
        adminRules,
        auditLogs,
        isProcessingDemo,
        processingStage,
        processingStatusText,
        processingError,
        selectedEvidenceFinding,
        evidenceModalOpen,
        setActiveTab,
        setCurrentAppId,
        startOneClickDemo,
        resetDemo,
        rectifyDocument,
        recordOfficerDecision,
        toggleAdminRule,
        openEvidenceViewer,
        closeEvidenceViewer,
        createNewApplication,
        uploadDocument,
        startOcr,
        cancelOcr,
        ocrProgress,
        updateDocumentFields,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
