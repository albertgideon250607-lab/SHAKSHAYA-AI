import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileDown,
  Eye,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateVerificationPdfReport } from '../utils/reportGenerator';
import { FindingSeverity, EOA_DOCUMENT_CATEGORIES } from '../types';

export const ValidationResultsView: React.FC = () => {
  const { currentApp, openEvidenceViewer, rectifyDocument, setActiveTab, startOneClickDemo } = useApp();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  if (!currentApp) {
    return <div>No active application selected.</div>;
  }

  const validDocsCount = currentApp.documents.filter((d) => d.status === 'verified').length;
  const flaggedCount = currentApp.findings.filter((f) => !f.resolved).length;
  const uploadedCategories = new Set(currentApp.documents.map((d) => d.category));
  const missingDocsCount = EOA_DOCUMENT_CATEGORIES.filter(
    (c) => c.mandatory && !uploadedCategories.has(c.id)
  ).length;

  const filteredFindings = currentApp.findings.filter((f) => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header Summary */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Application ID: <strong className="text-slate-800 font-mono">{currentApp.id}</strong></span>
            <span>·</span>
            <span>Academic Year: <strong className="text-slate-800">{currentApp.academicYear}</strong></span>
            <span>·</span>
            <span>{currentApp.applicationCategory}</span>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F] tracking-tight">
            Validation & Regulatory Compliance Findings
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Institution: <span className="font-semibold text-slate-900">{currentApp.institutionName}</span>
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('rectify_reupload')}
            className="px-3 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rectify Documents</span>
          </button>
          <button
            onClick={() => generateVerificationPdfReport(currentApp)}
            className="px-4 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-[#E2E8F0] p-4 rounded shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Readiness Indicator</span>
          <div className="text-2xl font-bold text-[#0A192F] font-mono mt-1">
            {currentApp.readinessScore}%
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block truncate">
            Status: {currentApp.status}
          </span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-4 rounded shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Valid Documents</span>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            {validDocsCount} / {currentApp.documents.length}
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block truncate">
            Text streams verified
          </span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-4 rounded shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Findings</span>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1">
            {flaggedCount}
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block truncate">
            Flagged for inspection
          </span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-4 rounded shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Missing Categories</span>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1">
            {missingDocsCount}
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block truncate">
            Mandatory APH gaps
          </span>
        </div>
      </div>

      {/* Filter Tabs & Findings Count */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
              Regulatory Findings & Evidence Trail ({filteredFindings.length})
            </h3>
            <p className="text-xs text-slate-500">
              Each finding is derived from actual extracted document text and configured AICTE rules.
            </p>
          </div>

          {/* Interactive Severity Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded text-xs font-medium self-start sm:self-auto">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  severityFilter === sev
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Findings List */}
        {filteredFindings.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded p-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">No findings matching active filter</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              All statutory rules in this scope are satisfied or no flags were raised.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFindings.map((finding) => {
              const isHighOrCrit = finding.severity === 'CRITICAL' || finding.severity === 'HIGH';
              const isMismatchRule = finding.ruleId.includes('002');

              return (
                <div
                  key={finding.id}
                  className={`p-4 rounded border text-xs transition-colors ${
                    isHighOrCrit
                      ? 'border-amber-300/80 bg-amber-50/30 hover:border-amber-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Top Tag Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase ${
                            finding.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : finding.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {finding.severity}
                        </span>
                        <span className="font-mono font-semibold text-slate-800">
                          {finding.ruleId}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-700">
                          {finding.ruleName}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        {finding.description}
                      </p>

                      {/* Extracted Evidence Snippet */}
                      <div className="bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-[11px] leading-snug">
                        <span className="text-slate-400 text-[10px] block mb-0.5">
                          EVIDENCE SNIPPET (Page {finding.pageNumber || 1}):
                        </span>
                        <span className="text-amber-300">{finding.evidenceSnippet}</span>
                      </div>

                      {/* Footer Metadata */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">
                        <span>Source: <strong className="text-slate-700">{finding.filename}</strong></span>
                        {finding.aphClause && (
                          <>
                            <span>·</span>
                            <span>Clause: <strong className="text-slate-700">{finding.aphClause}</strong></span>
                          </>
                        )}
                        <span>·</span>
                        <span className="text-slate-600">Action: {finding.recommendedAction}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center sm:flex-col gap-2 flex-shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => openEvidenceViewer(finding)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Evidence</span>
                      </button>

                      {isMismatchRule && (
                        <button
                          onClick={() => rectifyDocument('ter_receipt', 'ter-receipt-matching.pdf')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                          title="Replace mismatching TER receipt with matching receipt"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Rectify TER</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scrutiny Next Steps */}
      <div className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <h4 className="font-bold text-slate-900">Next Step: Statutory Officer Scrutiny</h4>
          <p className="text-slate-600 mt-0.5">
            Authorized scrutiny officers review automated AI findings and record formal recommendations.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('officer_review')}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Open Officer Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
