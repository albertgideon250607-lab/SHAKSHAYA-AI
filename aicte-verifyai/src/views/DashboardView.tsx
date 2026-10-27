import React from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, FileText, ArrowRight, Download, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCards } from '../components/MetricCards';
import { ReadinessPanel } from '../components/ReadinessPanel';
import { ApplicationsTable } from '../components/ApplicationsTable';
import { EOA_DOCUMENT_CATEGORIES } from '../types';

export const DashboardView: React.FC = () => {
  const { currentApp, startOneClickDemo, resetDemo, isProcessingDemo, setActiveTab, auditLogs } = useApp();

  const uploadedCategories = new Set(currentApp?.documents.map((d) => d.category) || []);

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Demo Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              AICTE APH 2025-26 · STATUTORY COMPLIANCE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Extension of Approval (EoA) Evaluation</span>
          </div>
          <h1 className="text-xl font-bold text-[#0A192F] tracking-tight">
            {currentApp?.institutionName || 'AICTE Regulatory Application Verification'}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Automated verification engine cross-referencing statutory affidavits, municipal building licenses, fire safety certificates, and TER bank clearances.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab('new_application')}
            className="px-4 py-2 border border-blue-300 hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start Manual Verification</span>
          </button>
          <button
            onClick={() => void startOneClickDemo()}
            disabled={isProcessingDemo}
            className="px-4 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try One-Click Demo</span>
          </button>
          <button
            onClick={resetDemo}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Responsive Metric Cards */}
      <MetricCards />

      {/* Main Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (lg:col-span-8): Main Applications Table & Activity */}
        <div className="lg:col-span-8 space-y-5">
          <ApplicationsTable />

          {/* Statutory 7-Document Verification Matrix Quick Status */}
          <div className="bg-white border border-[#E2E8F0] rounded p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
                  Mandatory EoA Document Status
                </h3>
                <p className="text-xs text-slate-500">
                  Application: <span className="font-mono font-semibold text-slate-800">{currentApp?.id}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveTab('checklist')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Full Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {EOA_DOCUMENT_CATEGORIES.map((cat) => {
                const doc = currentApp?.documents.find((d) => d.category === cat.id);
                const isUploaded = Boolean(doc);
                const isFlagged = doc?.status === 'flagged';
                const isOcr = doc?.status === 'ocr_required';

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-800 truncate">{cat.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{cat.aphClause}</div>
                    </div>
                    <div>
                      {isUploaded ? (
                        isFlagged ? (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                            FLAGGED
                          </span>
                        ) : isOcr ? (
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            OCR REQ
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                            PASSED
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          MISSING
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-4): Preliminary Readiness Panel & Audit Snippet */}
        <div className="lg:col-span-4 space-y-5">
          <ReadinessPanel />

          {/* Quick Audit Trail Feed */}
          <div className="bg-white border border-[#E2E8F0] rounded p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#0A192F] uppercase tracking-tight">
                Recent Scrutiny Trail
              </h4>
              <button
                onClick={() => setActiveTab('audit_log')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View Log
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="pt-2 first:pt-0 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-mono">{log.eventType}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-700 mt-0.5 line-clamp-2 leading-snug">
                    {log.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
