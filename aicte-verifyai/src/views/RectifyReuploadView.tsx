import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  FileText,
  UploadCloud,
  History,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { diffSnapshots } from '../validation/rules';

export const RectifyReuploadView: React.FC = () => {
  const { currentApp, rectifyDocument, setActiveTab, resetDemo } = useApp();
  const [selectedReplacement, setSelectedReplacement] = useState<string>('ter-receipt-matching.pdf');

  if (!currentApp) {
    return <div>No active application selected.</div>;
  }

  const previousSnapshot = currentApp.previousSnapshot;
  const currentFindings = currentApp.findings;
  const previousFindings = previousSnapshot?.findings || [];

  const { resolved, unresolved, newlyDetected } = diffSnapshots(previousFindings, currentFindings);

  const terDoc = currentApp.documents.find((d) => d.category === 'ter_receipt');
  const isCurrentlyMismatch = terDoc?.filename === 'ter-receipt-mismatch.pdf';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Remediation & Compliance
          </div>
          <h2 className="text-xl font-bold text-[#0A192F]">
            Rectification & Before-and-After Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Replace flagged documents, re-run automated extraction, and verify resolved regulatory anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('validation_results')}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded transition-colors"
          >
            Back to Results
          </button>
        </div>
      </div>

      {/* Before / After Snapshot Matrix */}
      {previousSnapshot ? (
        <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
                Audit Snapshot Comparison
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Re-validation verified at {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Previous Snapshot */}
            <div className="p-4 rounded border border-slate-200 bg-slate-50/60 text-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Before Rectification
              </div>
              <div className="text-2xl font-bold text-slate-700 font-mono">
                {previousSnapshot.readinessScore}%
              </div>
              <div className="text-slate-500 text-[11px] mt-1">
                Status: <strong className="text-amber-800">{previousSnapshot.status}</strong>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                {previousSnapshot.findingsCount} active finding(s) flagged
              </div>
            </div>

            {/* Current Snapshot */}
            <div className="p-4 rounded border border-emerald-300 bg-emerald-50/50 text-xs">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase mb-1 flex items-center justify-between">
                <span>After Rectification</span>
                <span className="text-emerald-700 font-bold">
                  +{currentApp.readinessScore - previousSnapshot.readinessScore}% Improved
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-700 font-mono">
                {currentApp.readinessScore}%
              </div>
              <div className="text-slate-600 text-[11px] mt-1">
                Status: <strong className="text-emerald-800">{currentApp.status}</strong>
              </div>
              <div className="text-slate-600 text-[11px] mt-0.5">
                {currentApp.findings.length} active finding(s) remaining
              </div>
            </div>

            {/* Resolved Delta Summary */}
            <div className="p-4 rounded border border-blue-200 bg-blue-50/40 text-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold text-blue-900 uppercase mb-1">
                  Delta Resolution
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{resolved.length} Finding(s) Successfully Resolved</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  TER fee receipt institution name matches application profile.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('officer_review')}
                className="w-full mt-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
              >
                <span>Proceed to Officer Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List of resolved items */}
          {resolved.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-tight mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resolved Discrepancies</span>
              </h4>
              <div className="space-y-2">
                {resolved.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded border border-emerald-200 bg-emerald-50/30 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-emerald-900">
                        {res.ruleId} — {res.ruleName}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {res.description}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-mono mt-1">
                        Resolution verified: Attached matching TER receipt "ter-receipt-matching.pdf" for "ABC College of Engineering".
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex-shrink-0">
                      RESOLVED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Interactive Document Replacement Console */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
            Remediate Flagged Document (Interactive Replacement)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrate real-time rectification by replacing the conflicting TER receipt with the verified matching version.
          </p>
        </div>

        <div className="p-4 rounded border border-slate-200 bg-slate-50/70 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <span className="font-semibold text-slate-800">Current Attached File:</span>
              <span className="font-mono ml-2 text-slate-900 font-bold">{terDoc?.filename || 'None'}</span>
            </div>
            <div>
              {isCurrentlyMismatch ? (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  CONFLICTING INSTITUTION NAME ("XYZ Institute")
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  MATCHING INSTITUTION ("ABC College")
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-800 block">
              Select Verified Rectification Sample PDF:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                  selectedReplacement === 'ter-receipt-matching.pdf'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="replacement"
                  value="ter-receipt-matching.pdf"
                  checked={selectedReplacement === 'ter-receipt-matching.pdf'}
                  onChange={() => setSelectedReplacement('ter-receipt-matching.pdf')}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    ter-receipt-matching.pdf (Recommended)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Institution: "ABC College of Engineering" · Rs. 2,00,000/- Bharatkosh Cleared.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                  selectedReplacement === 'ter-receipt-mismatch.pdf'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="replacement"
                  value="ter-receipt-mismatch.pdf"
                  checked={selectedReplacement === 'ter-receipt-mismatch.pdf'}
                  onChange={() => setSelectedReplacement('ter-receipt-mismatch.pdf')}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    ter-receipt-mismatch.pdf (Test Anomaly)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Institution: "XYZ Institute of Technology" · Triggers RULE DEMO-EoA-002.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => rectifyDocument('ter_receipt', selectedReplacement)}
              className="px-4 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply Rectification & Re-Extract Text</span>
            </button>

            <button
              onClick={resetDemo}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Initial Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
