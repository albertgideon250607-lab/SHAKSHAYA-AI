import React from 'react';
import { ShieldCheck, History, UserCheck, RefreshCw, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs">
        <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
          Statutory Compliance Trail
        </div>
        <h2 className="text-xl font-bold text-[#0A192F]">
          Immutable Audit Log & Chain of Custody
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tamper-evident record of document scans, extraction results, rectifications, and officer scrutiny determinations.
        </p>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Event Log ({auditLogs.length} Entries)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Cryptographic Sequence Validated
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.map((log) => {
            const isOfficer = log.eventType === 'OFFICER_DECISION';
            const isRect = log.eventType === 'RECTIFICATION_APPLIED';

            return (
              <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${
                        isOfficer
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : isRect
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      {log.eventType}
                    </span>
                    <span className="font-mono text-slate-600 font-semibold">{log.applicationId}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">Actor: <strong className="text-slate-700">{log.actor}</strong></span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-normal pt-0.5">
                    {log.summary}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 font-mono flex-shrink-0 self-start sm:self-center">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
