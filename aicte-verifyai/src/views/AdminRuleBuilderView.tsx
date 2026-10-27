import React from 'react';
import { Sliders, CheckCircle2, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminRuleBuilderView: React.FC = () => {
  const { adminRules, toggleAdminRule } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs">
        <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
          Policy & Rule Administration
        </div>
        <h2 className="text-xl font-bold text-[#0A192F]">
          Compliance Rule Engine & Weight Configuration
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enable or disable statutory rules. Modifications take effect immediately across all active validation runs.
        </p>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {adminRules.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`p-4 rounded border bg-white shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                rule.enabled ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-900">{rule.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-bold text-slate-800 text-sm">{rule.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.2 rounded border uppercase ${
                      rule.severity === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : rule.severity === 'HIGH'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                  <span>Mandate: {rule.aphClause}</span>
                  <span>·</span>
                  <span>Penalty: -{rule.penaltyPoints} pts</span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                <span className="text-[11px] font-semibold text-slate-500">
                  {rule.enabled ? 'Active / Enforced' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleAdminRule(rule.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-xs ${
                      rule.enabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
