import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, AlertTriangle, FileQuestion } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EOA_DOCUMENT_CATEGORIES } from '../types';

export const ReadinessPanel: React.FC = () => {
  const { currentApp, setActiveTab } = useApp();

  const score = Math.max(0, Math.min(100, currentApp?.readinessScore ?? 0));
  const status = currentApp?.status ?? 'Not Ready';

  // SVG circular calculations
  const size = 130;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const validCount = currentApp?.documents.filter((d) => d.status === 'verified').length ?? 0;
  const flaggedCount = currentApp?.findings.filter((f) => !f.resolved).length ?? 0;
  const uploadedCategories = new Set(currentApp?.documents.map((d) => d.category) || []);
  const missingCount = EOA_DOCUMENT_CATEGORIES.filter(
    (c) => c.mandatory && !uploadedCategories.has(c.id)
  ).length;

  const getStatusColor = () => {
    switch (status) {
      case 'Ready':
      case 'Approved':
        return {
          stroke: '#059669', // Emerald
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
        };
      case 'Needs Attention':
      case 'Rectification Requested':
        return {
          stroke: '#D97706', // Amber
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        };
      default:
        return {
          stroke: '#DC2626', // Red
          text: 'text-rose-700',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
            Preliminary Readiness
          </h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {status}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Automated evaluation against AICTE Approval Process Handbook (APH 2025-26).
        </p>
      </div>

      {/* SVG Circular Progress Track */}
      <div className="my-5 flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-3xl font-extrabold text-[#0A192F] tracking-tight font-mono">
              {score}%
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
              Readiness
            </span>
          </div>
        </div>

        {/* Short explanation */}
        <p className="text-xs text-slate-600 text-center mt-3 max-w-[260px] leading-relaxed">
          {score >= 85
            ? 'Statutory checklist complete and high-severity checks passed.'
            : score >= 50
            ? 'Minor discrepancies detected. Resolve flagged findings to improve readiness.'
            : 'Critical requirements missing or cross-document mismatches present.'}
        </p>
      </div>

      {/* Compact Metrics Breakdown */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-center">
        <div className="p-1">
          <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Valid</span>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
            {validCount}
          </div>
        </div>
        <div className="p-1 border-l border-r border-slate-100">
          <div className="flex items-center justify-center gap-1 text-[11px] text-amber-700 font-semibold">
            <AlertTriangle className="w-3 h-3" />
            <span>Flagged</span>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
            {flaggedCount}
          </div>
        </div>
        <div className="p-1">
          <div className="flex items-center justify-center gap-1 text-[11px] text-rose-700 font-semibold">
            <FileQuestion className="w-3 h-3" />
            <span>Missing</span>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
            {missingCount}
          </div>
        </div>
      </div>

      {/* Action & Disclaimer */}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => setActiveTab('validation_results')}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>View Detailed Findings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="text-[10px] text-slate-400 text-center leading-tight">
          Preliminary prototype indicator · Not an official AICTE statutory approval.
        </p>
      </div>
    </div>
  );
};
