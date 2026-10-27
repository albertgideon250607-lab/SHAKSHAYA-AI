import React from 'react';
import { Files, CheckCircle2, AlertTriangle, FileQuestion } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EOA_DOCUMENT_CATEGORIES } from '../types';

export const MetricCards: React.FC = () => {
  const { applications, currentApp } = useApp();

  // 1. Total Applications
  const totalAppsCount = applications.length;

  // 2. Valid / Passed Documents (for current app)
  const validDocsCount = currentApp
    ? currentApp.documents.filter((d) => d.status === 'verified').length
    : 0;
  const totalUploadedDocs = currentApp ? currentApp.documents.length : 0;

  // 3. Findings Flagged (active unresolved anomalies)
  const flaggedFindingsCount = currentApp
    ? currentApp.findings.filter((f) => !f.resolved).length
    : 0;

  // 4. Documents Missing (mandatory categories without an attached document)
  const uploadedCategories = new Set(currentApp?.documents.map((d) => d.category) || []);
  const missingDocsCount = EOA_DOCUMENT_CATEGORIES.filter(
    (c) => c.mandatory && !uploadedCategories.has(c.id)
  ).length;

  const metrics = [
    {
      title: 'Total Applications',
      value: totalAppsCount.toString().padStart(2, '0'),
      supporting: 'Active EoA submissions',
      caption: 'Tracked in local compliance database',
      icon: Files,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      title: 'Valid / Passed Documents',
      value: validDocsCount.toString().padStart(2, '0'),
      supporting: `${totalUploadedDocs} documents uploaded`,
      caption: 'Passed text layer & field validation',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      title: 'Findings Flagged',
      value: flaggedFindingsCount.toString().padStart(2, '0'),
      supporting: flaggedFindingsCount > 0 ? 'Requires human/officer review' : 'No active anomalies',
      caption: 'Cross-document or rule discrepancies',
      icon: AlertTriangle,
      iconColor: flaggedFindingsCount > 0 ? 'text-amber-600' : 'text-slate-400',
      iconBg: flaggedFindingsCount > 0 ? 'bg-amber-50' : 'bg-slate-50',
    },
    {
      title: 'Documents Missing',
      value: missingDocsCount.toString().padStart(2, '0'),
      supporting: missingDocsCount > 0 ? 'Statutory checklist gap' : '7/7 categories fulfilled',
      caption: 'Mandatory categories awaiting upload',
      icon: FileQuestion,
      iconColor: missingDocsCount > 0 ? 'text-rose-600' : 'text-emerald-600',
      iconBg: missingDocsCount > 0 ? 'bg-rose-50' : 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-[#E2E8F0] rounded p-4 shadow-xs flex flex-col justify-between min-h-[140px] hover:border-slate-300 transition-colors"
          >
            {/* Top Row: Title & Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#1E293B] tracking-tight uppercase">
                {m.title}
              </span>
              <div className={`w-7 h-7 rounded flex items-center justify-center ${m.iconBg} ${m.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Large Value Row */}
            <div className="my-2">
              <div className="text-2xl font-bold text-[#0A192F] tracking-tight font-mono">
                {m.value}
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                {m.supporting}
              </div>
            </div>

            {/* Caption Row with subtle top border */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 truncate">
              {m.caption}
            </div>
          </div>
        );
      })}
    </div>
  );
};
