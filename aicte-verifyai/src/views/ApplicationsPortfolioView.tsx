import React from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationsTable } from '../components/ApplicationsTable';
import { PlusCircle, Play, RotateCcw } from 'lucide-react';

export const ApplicationsPortfolioView: React.FC = () => {
  const { setActiveTab, startOneClickDemo, resetDemo, isProcessingDemo } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Applications Portfolio
          </div>
          <h2 className="text-xl font-bold text-[#0A192F]">
            Extension of Approval (EoA) Submissions Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, inspect, and evaluate statutory compliance across all registered institutional applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new_application')}
            className="px-3.5 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>
          <button
            onClick={() => void startOneClickDemo()}
            disabled={isProcessingDemo}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Load Demo Application</span>
          </button>
        </div>
      </div>

      <ApplicationsTable />
    </div>
  );
};
