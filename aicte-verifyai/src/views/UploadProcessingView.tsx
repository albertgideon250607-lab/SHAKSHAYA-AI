import React from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Eye,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EOA_DOCUMENT_CATEGORIES, type DocumentFile } from '../types';

export const UploadProcessingView: React.FC = () => {
  const {
    currentApp,
    isProcessingDemo,
    processingStage,
    processingStatusText,
    processingError,
    startOneClickDemo,
    resetDemo,
    setActiveTab,
    openEvidenceViewer,
    uploadDocument,
    startOcr,
    cancelOcr,
    ocrProgress,
    updateDocumentFields,
  } = useApp();
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [expandedDocumentId, setExpandedDocumentId] = React.useState<string | null>(null);
  const [editingFields, setEditingFields] = React.useState<DocumentFile['extractedFields']>({});
  const [editingText, setEditingText] = React.useState('');
  const [ocrError, setOcrError] = React.useState<string | null>(null);

  const handleUpload = async (category: (typeof EOA_DOCUMENT_CATEGORIES)[number]['id'], file?: File) => {
    if (!file) return;
    setUploadError(null);
    try {
      await uploadDocument(category, file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Document upload failed.');
    }
  };

  const beginDocumentReview = (document: DocumentFile) => {
    setExpandedDocumentId(document.id);
    setEditingFields({ ...document.extractedFields });
    setEditingText(document.extractedText);
  };

  const saveDocumentReview = (document: DocumentFile) => {
    updateDocumentFields(document.id, editingFields, editingText);
  };

  const runOcr = async (documentId: string) => {
    setOcrError(null);
    try {
      await startOcr(documentId);
    } catch (error) {
      setOcrError(error instanceof Error ? error.message : 'OCR failed unexpectedly.');
    }
  };

  const stages = [
    { num: 1, label: 'Load Application', desc: 'Initialize DEMO-EOA-001 profile & academic metadata' },
    { num: 2, label: 'Classify Documents', desc: 'Match 7 uploaded files to statutory EoA categories' },
    { num: 3, label: 'Extract PDF Text', desc: 'Read text streams and check scanned bitmap readability' },
    { num: 4, label: 'Validate Fields', desc: 'Verify required stamps, payment challans, and NOC validity' },
    { num: 5, label: 'Cross-Document Reconciliation', desc: 'Reconcile institution names across TER receipt & affidavit' },
    { num: 6, label: 'Synthesize Findings', desc: 'Compute preliminary readiness score and generate audit flags' },
  ];

  const sampleFiles = [
    { name: 'affidavit-2-matching.pdf', category: 'Affidavit 2', size: '6.5 KB' },
    { name: 'ter-receipt-mismatch.pdf', category: 'TER Receipt (Mismatch Test)', size: '6.4 KB', highlighted: true },
    { name: 'ter-receipt-matching.pdf', category: 'TER Receipt (Rectified Match)', size: '6.4 KB' },
    { name: 'fire-safety-matching.pdf', category: 'Fire Safety NOC', size: '6.3 KB' },
    { name: 'building-license-matching.pdf', category: 'Occupancy / Building Permit', size: '6.2 KB' },
    { name: 'satellite-map-sample.pdf', category: 'Satellite GIS Map', size: '5.9 KB' },
    { name: 'scanned-ocr-sample.pdf', category: 'Audited Accounts (OCR Sample)', size: '3.9 KB' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Processing Workspace
          </div>
          <h2 className="text-xl font-bold text-[#0A192F]">
            Document Ingestion & Automated Extraction Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Extracts native text streams, evaluates AICTE APH clauses, and reconciles institutional identities.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => void startOneClickDemo()}
            disabled={isProcessingDemo}
            className="px-4 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            {isProcessingDemo ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Automatic Processing</span>
              </>
            )}
          </button>
          <button
            onClick={resetDemo}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Error state if any */}
      {processingError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded flex items-start justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Processing Workflow Error</div>
              <p className="mt-0.5">{processingError}</p>
            </div>
          </div>
          <button
            onClick={() => void startOneClickDemo()}
            className="px-2.5 py-1 bg-rose-600 text-white text-xs font-medium rounded hover:bg-rose-700 flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
          {uploadError}
        </div>
      )}

      {ocrError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
          {ocrError}
        </div>
      )}

      {ocrProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-900">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="font-semibold">{ocrProgress.message}</span>
            {ocrProgress.status === 'loading' || ocrProgress.status === 'processing' ? (
              <button
                onClick={cancelOcr}
                className="px-2.5 py-1 border border-blue-300 rounded text-blue-700 hover:bg-blue-100"
              >
                Cancel OCR
              </button>
            ) : null}
          </div>
          <div className="h-2 bg-blue-100 rounded overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${ocrProgress.percent}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-blue-700">
            {ocrProgress.percent}% · Page {ocrProgress.page} of {ocrProgress.totalPages}
          </div>
        </div>
      )}

      {/* 6-Stage Processing Progress Stepper */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0A192F] uppercase tracking-tight">
              Automated Pipeline Stages
            </span>
            {isProcessingDemo && (
              <span className="text-[11px] text-blue-600 font-medium animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Active</span>
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {processingStatusText}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((st) => {
            const isDone = processingStage > st.num || (!isProcessingDemo && processingStage === 0 && currentApp?.documents.length);
            const isCurrent = isProcessingDemo && processingStage === st.num;
            const isPending = !isDone && !isCurrent;

            return (
              <div
                key={st.num}
                className={`p-3 rounded border text-xs transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                    : 'border-slate-200 bg-slate-50/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-[11px]">
                    STAGE 0{st.num}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="font-semibold text-slate-800 text-[11px] leading-snug">
                  {st.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {st.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split: Uploaded Files & Sample PDF Download Centre */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (lg:col-span-8): Uploaded Files & Extraction Status */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
                Ingested Documents ({currentApp?.documents.length || 0})
              </h3>
              <p className="text-xs text-slate-500">
                Extracted metadata and statutory field presence for {currentApp?.id}
              </p>
            </div>
            {currentApp?.findings.length ? (
              <button
                onClick={() => setActiveTab('validation_results')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>View Findings ({currentApp.findings.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {currentApp?.documents.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded p-6">
              <UploadCloud className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">No documents attached yet</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Upload a PDF or image below, or use the synthetic demo only for testing.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentApp?.documents.map((doc) => {
                const hasFinding = currentApp.findings.some((f) => f.category === doc.category && !f.resolved);
                const relatedFinding = currentApp.findings.find((f) => f.category === doc.category && !f.resolved);

                return (
                  <div
                    key={doc.id}
                    className="p-3 rounded border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 truncate">
                            {doc.filename}
                          </span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 font-medium truncate">
                            {doc.categoryName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span>{doc.fileSize || '6 KB'}</span>
                          <span>·</span>
                          <span>{doc.hasTextLayer ? 'Text Layer Extractable' : 'Scanned Image (OCR Req.)'}</span>
                          {doc.extractedFields.institutionName && (
                            <>
                              <span>·</span>
                              <span className="text-slate-700 font-medium truncate max-w-[200px]">
                                Extracted: {doc.extractedFields.institutionName}
                              </span>
                            </>
                          )}
                        </div>

                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      {hasFinding ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Needs Review</span>
                        </span>
                      ) : doc.status === 'ocr_complete' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>OCR Complete</span>
                        </span>
                      ) : !doc.hasTextLayer ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <span>OCR Required</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}

                      {doc.source === 'uploaded' && doc.status !== 'processing' && doc.status !== 'ocr_complete' ? (
                        <button
                          onClick={() => void runOcr(doc.id)}
                          disabled={Boolean(ocrProgress && ['loading', 'processing'].includes(ocrProgress.status))}
                          className="px-2.5 py-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{doc.status === 'ocr_failed' ? 'Retry OCR' : 'Extract Text (OCR)'}</span>
                        </button>
                      ) : null}

                      {doc.extractedText ? (
                        <button
                          onClick={() => beginDocumentReview(doc)}
                          className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium"
                        >
                          Review OCR
                        </button>
                      ) : null}

                      {relatedFinding ? (
                        <button
                          onClick={() => openEvidenceViewer(relatedFinding)}
                          className="px-2.5 py-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Evidence</span>
                        </button>
                      ) : (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={doc.filename}
                          className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {expandedDocumentId && currentApp?.documents.find((doc) => doc.id === expandedDocumentId) && (
            (() => {
              const document = currentApp.documents.find((doc) => doc.id === expandedDocumentId) as DocumentFile;
              const editableFields = [
                ['institutionName', 'Institution name'],
                ['applicationId', 'Application/reference number'],
                ['academicYear', 'Academic year'],
                ['amountPaid', 'Amount paid'],
                ['validityPeriod', 'Validity period'],
                ['builtUpArea', 'Built-up area'],
                ['gpsCoordinates', 'GPS coordinates'],
                ['deponentName', 'Deponent name'],
                ['nocNumber', 'NOC/certificate number'],
              ] as const;
              return (
                <div className="mt-4 p-4 border border-blue-200 bg-blue-50/40 rounded space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">OCR Review: {document.filename}</h4>
                      <p className="text-[11px] text-slate-500">OCR can make mistakes. Review and correct fields before using validation findings.</p>
                    </div>
                    <button onClick={() => setExpandedDocumentId(null)} className="text-xs text-slate-600 hover:text-slate-900">Close</button>
                  </div>
                  <textarea
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    className="w-full min-h-32 p-2 rounded border border-slate-300 bg-white text-[11px] font-mono"
                    aria-label="Extracted OCR text"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {editableFields.map(([key, label]) => (
                      <label key={key} className="text-[11px] text-slate-700">
                        <span className="block font-semibold mb-1">{label}</span>
                        <input
                          value={editingFields[key] || ''}
                          onChange={(event) => setEditingFields((current) => ({ ...current, [key]: event.target.value }))}
                          placeholder="Not detected"
                          className="w-full p-2 rounded border border-slate-300 bg-white"
                        />
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => saveDocumentReview(document)}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                  >
                    Save Corrections & Revalidate
                  </button>
                </div>
              );
            })()
          )}
        </div>

        {/* Right Column (lg:col-span-4): Sample PDFs Download Centre */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded p-4 shadow-xs">
            <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-tight mb-1">
              Manual Document Upload
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Files are checked locally for type, size, and SHA-256 duplicates. OCR runs locally in your browser.
            </p>
            <div className="space-y-2">
              {EOA_DOCUMENT_CATEGORIES.map((category) => (
                <label key={category.id} className="block p-2.5 rounded border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer">
                  <span className="block text-[11px] font-semibold text-slate-800">{category.name}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">PDF, PNG, JPEG, or WebP · max 10 MB</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
                    className="mt-2 block w-full text-[11px] text-slate-600"
                    onChange={(event) => void handleUpload(category.id, event.target.files?.[0])}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded p-4 shadow-xs">
            <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-tight mb-1">
              Synthetic Sample PDF Downloads
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Real text-extractable PDFs generated for institutional verification testing:
            </p>

            <div className="space-y-2">
              {sampleFiles.map((sf, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border text-xs flex items-center justify-between gap-2 transition-colors ${
                    sf.highlighted
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="font-mono text-[11px] font-semibold text-slate-800 truncate">
                      {sf.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {sf.category} · {sf.size}
                    </div>
                  </div>
                  <a
                    href={`/sample-documents/${sf.name}`}
                    download={sf.name}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
                    title={`Download ${sf.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
              Document Specifications
            </div>
            <p className="text-[11px] leading-relaxed">
              · Supported Formats: Searchable PDF (text streams), scanned single-page PDF.
            </p>
            <p className="text-[11px] leading-relaxed">
              · Size Limit: 10 MB per statutory submission file.
            </p>
            <p className="text-[11px] leading-relaxed">
              · Mismatch scenario: <span className="font-semibold text-amber-800">ter-receipt-mismatch.pdf</span> contains "XYZ Institute of Technology" against expected "ABC College of Engineering".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
