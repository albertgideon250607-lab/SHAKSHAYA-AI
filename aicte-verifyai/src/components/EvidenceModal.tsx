import React from 'react';
import { X, FileText, Download, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EvidenceModal: React.FC = () => {
  const { evidenceModalOpen, selectedEvidenceFinding, closeEvidenceViewer, currentApp } = useApp();

  if (!evidenceModalOpen || !selectedEvidenceFinding) return null;

  const finding = selectedEvidenceFinding;
  const doc = currentApp?.documents.find((d) => d.category === finding.category);
  const pdfUrl = doc?.url || `/sample-documents/${finding.filename}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Regulatory Evidence Inspector
              </h3>
              <p className="text-xs text-slate-500">
                Rule ID: <span className="font-mono font-semibold text-slate-700">{finding.ruleId}</span> · {finding.ruleName}
              </p>
            </div>
          </div>
          <button
            onClick={closeEvidenceViewer}
            className="w-7 h-7 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Document & Page info banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Category</span>
              <span className="font-semibold text-slate-800 capitalize truncate block">
                {finding.category.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Source File</span>
              <span className="font-semibold text-slate-800 truncate block" title={finding.filename}>
                {finding.filename}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Source Page</span>
              <span className="font-semibold text-slate-800 font-mono block">
                Page {finding.pageNumber || 1}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Severity</span>
              <span
                className={`font-semibold block ${
                  finding.severity === 'CRITICAL' || finding.severity === 'HIGH'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {finding.severity}
              </span>
            </div>
          </div>

          {/* Finding Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Anomaly Analysis
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed bg-amber-50/60 border border-amber-200/70 p-3 rounded">
              {finding.description}
            </p>
          </div>

          {/* Extracted Evidence Snippet with Text Highlight */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Extracted Text Evidence Snippet
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">
                Verified from Document Stream
              </span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto">
              <div className="text-slate-400 text-[10px] uppercase mb-1 border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>[STREAM_PAGE_{finding.pageNumber || 1}]</span>
                <span>STATUS: EXTRACTED</span>
              </div>
              <div className="bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded inline-block border border-amber-400/30">
                {finding.evidenceSnippet}
              </div>
            </div>
          </div>

          {/* Regulatory Handbook Reference */}
          {finding.aphClause && (
            <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-semibold mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Statutory Mandate: {finding.aphClause}</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                AICTE Approval Process Handbook (APH) clause mandate governing this requirement.
              </p>
            </div>
          )}

          {/* Action Recommendation */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Recommended Remediation
            </h4>
            <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-2.5 rounded">
              {finding.recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={finding.filename}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Source PDF ({finding.filename})</span>
          </a>

          <button
            onClick={closeEvidenceViewer}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
