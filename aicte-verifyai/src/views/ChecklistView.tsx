import React from 'react';
import { CheckSquare, FileText, Download, CheckCircle2, AlertTriangle, FileQuestion, ArrowRight, UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EOA_DOCUMENT_CATEGORIES } from '../types';

export const ChecklistView: React.FC = () => {
  const { currentApp, setActiveTab, openEvidenceViewer } = useApp();

  if (!currentApp) {
    return <div>No active application selected.</div>;
  }

  const uploadedCategories = new Set(currentApp.documents.map((d) => d.category));
  const completedCount = EOA_DOCUMENT_CATEGORIES.filter((c) => uploadedCategories.has(c.id)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Mandatory Statutory Checklist
          </div>
          <h2 className="text-xl font-bold text-[#0A192F]">
            7-Document Extension of Approval (EoA) Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescribed pursuant to AICTE Approval Process Handbook (APH 2025-26) Chapter II.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Checklist Completion:</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {completedCount} / 7 Categories Present
            </span>
          </div>
          <button
            onClick={() => setActiveTab('upload_processing')}
            className="px-3.5 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* 7 Categories Cards */}
      <div className="space-y-3">
        {EOA_DOCUMENT_CATEGORIES.map((cat, idx) => {
          const doc = currentApp.documents.find((d) => d.category === cat.id);
          const isUploaded = Boolean(doc);
          const hasFinding = currentApp.findings.some((f) => f.category === cat.id && !f.resolved);
          const relatedFinding = currentApp.findings.find((f) => f.category === cat.id && !f.resolved);
          const isOcr = doc?.status === 'ocr_required';

          return (
            <div
              key={cat.id}
              className={`bg-white border rounded p-4 shadow-xs transition-colors ${
                isUploaded
                  ? hasFinding
                    ? 'border-amber-300 bg-amber-50/15'
                    : isOcr
                    ? 'border-amber-200 bg-amber-50/10'
                    : 'border-emerald-200/80 bg-white'
                  : 'border-slate-200 bg-slate-50/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-bold font-mono flex-shrink-0 mt-0.5 ${
                      isUploaded
                        ? hasFinding
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isOcr
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    0{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                      {cat.mandatory && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 uppercase">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{cat.description}</p>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Statutory Reference: {cat.aphClause}
                    </div>

                    {doc && (
                      <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200/80 font-mono">
                        Attached: <strong className="text-slate-800">{doc.filename}</strong> · Size: {doc.fileSize || '6 KB'} · Text Layer: {doc.hasTextLayer ? 'Searchable' : 'Scanned Image (OCR Req.)'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Status & Actions */}
                <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                  {isUploaded ? (
                    hasFinding ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Flagged Finding</span>
                      </span>
                    ) : isOcr ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        <span>OCR Required</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Valid</span>
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                      <FileQuestion className="w-3.5 h-3.5" />
                      <span>Missing Document</span>
                    </span>
                  )}

                  {relatedFinding && (
                    <button
                      onClick={() => openEvidenceViewer(relatedFinding)}
                      className="px-2.5 py-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
                    >
                      View Flag
                    </button>
                  )}

                  <a
                    href={`/sample-documents/${cat.sampleFileName}`}
                    download={cat.sampleFileName}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                    title={`Download sample ${cat.sampleFileName}`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
