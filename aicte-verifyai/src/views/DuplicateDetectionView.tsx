import React from 'react';
import { Copy, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DuplicateDetectionView: React.FC = () => {
  const { currentApp } = useApp();
  const duplicateFindings = currentApp?.findings.filter((finding) => finding.ruleId === 'RULE-DOCUMENT-DUPLICATE-HASH') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs">
        <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
          Anti-Plagiarism & Asset Verification
        </div>
        <h2 className="text-xl font-bold text-[#0A192F]">
          Cross-Application Asset & Land Duplicate Detection
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Checks uploaded files for byte-identical SHA-256 hashes within this application. Cross-application and issuer checks require an official backend integration.
        </p>
      </div>

      {/* Verification Matrix */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
            Nationwide Multi-Institution Asset De-duplication Scan
          </h3>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
            duplicateFindings.length
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
          {duplicateFindings.length} Local Hash Match{duplicateFindings.length === 1 ? '' : 'es'}
          </span>
        </div>

        <div className="space-y-3">
          {duplicateFindings.length ? duplicateFindings.map((finding) => (
            <div
              key={finding.id}
              className="p-3.5 rounded border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900">{finding.filename}</div>
                <div className="font-mono text-slate-700 font-medium text-[11px] mt-0.5">{finding.evidenceSnippet}</div>
                <p className="text-slate-500 text-[11px] mt-0.5">{finding.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-100/80 px-2.5 py-1 rounded border border-amber-300 self-start sm:self-center flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>REVIEW REQUIRED</span>
              </div>
            </div>
          )) : (
            <div className="p-4 rounded border border-slate-200 bg-slate-50/50 text-xs text-slate-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>No byte-identical files were detected in this application. This does not verify uniqueness across other applications.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
