import React from 'react';
import { Eye, ArrowUpRight, CheckCircle2, AlertTriangle, FileText, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApplicationsTable: React.FC = () => {
  const { applications, currentAppId, setCurrentAppId, setActiveTab, startOneClickDemo } = useApp();

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded p-8 text-center shadow-xs">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-800">No applications registered</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Start by loading the synthetic demo dataset or create a new regulatory application.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => void startOneClickDemo()}
            className="px-3 py-1.5 bg-[#2463EB] text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
          >
            Load Sample Demo
          </button>
          <button
            onClick={() => setActiveTab('new_application')}
            className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 transition-colors"
          >
            New Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
            Applications In Scope
          </h3>
          <p className="text-xs text-slate-500">
            {applications.length} regulatory applications currently registered
          </p>
        </div>

        <button
          onClick={() => setActiveTab('new_application')}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Application</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">Application ID</th>
              <th className="py-3 px-4">Institution Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Academic Year</th>
              <th className="py-3 px-4">Readiness</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => {
              const isSelected = app.id === currentAppId;
              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                      <span>{app.id}</span>
                      {app.isDemo && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-sans">
                          DEMO
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate" title={app.institutionName}>
                    {app.institutionName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {app.applicationCategory}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {app.academicYear}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900">
                        {app.readinessScore}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            app.readinessScore >= 80
                              ? 'bg-emerald-500'
                              : app.readinessScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${app.readinessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        app.status === 'Ready' || app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Needs Attention' || app.status === 'Rectification Requested'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {app.status === 'Ready' || app.status === 'Approved' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{app.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setCurrentAppId(app.id);
                          setActiveTab('validation_results');
                        }}
                        className="px-2 py-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded text-xs font-medium transition-colors"
                        title="View Validation Results"
                      >
                        Results
                      </button>
                      <button
                        onClick={() => {
                          setCurrentAppId(app.id);
                          setActiveTab('officer_review');
                        }}
                        className="px-2 py-1 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded text-xs font-medium transition-colors"
                        title="Officer Review"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
