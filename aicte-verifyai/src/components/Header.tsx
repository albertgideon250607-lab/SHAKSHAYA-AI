import React, { useState } from 'react';
import {
  ChevronDown,
  ShieldCheck,
  User,
  LogOut,
  Building2,
  UserCheck,
  ShieldAlert,
  RotateCcw,
  Play,
  Home,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    applications,
    currentAppId,
    setCurrentAppId,
    currentApp,
    currentUser,
    userRole,
    logout,
    setActivePage,
    resetDemo,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return userRole === 'admin'
          ? 'System Administration Dashboard'
          : 'Institution Approval Readiness Dashboard';
      case 'applications':
        return 'Regulatory Applications Portfolio';
      case 'new_application':
        return 'Application Category Selection';
      case 'checklist':
        return 'Statutory 7-Document Checklist';
      case 'upload_processing':
        return 'Document Ingestion & Automated Extraction';
      case 'validation_results':
        return 'Regulatory Validation & Anomaly Findings';
      case 'rectify_reupload':
        return 'Rectification & Before/After Diff Verification';
      case 'officer_review':
        return 'Authorized Scrutiny Officer Determination';
      case 'reports':
        return 'Statutory Compliance Audit Reports';
      case 'entity_graph':
        return 'Institutional Entity Knowledge Graph';
      case 'duplicate_detection':
        return 'Cross-Application Land & Title Duplicate Detection';
      case 'admin_rules':
        return 'Compliance Rule Engine Configuration';
      case 'audit_log':
        return 'Statutory Activity & Audit Trail';
      case 'help_support':
        return 'AICTE APH 2025-26 Regulatory Guide';
      default:
        return 'Dashboard';
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'officer':
        return 'Scrutiny Officer';
      case 'admin':
        return 'Administrator';
      default:
        return 'Institution';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Shakshya AI</span>
          <span aria-hidden="true">·</span>
          <span>{getRoleLabel()} Portal</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-800 font-medium">{currentApp?.academicYear || '2026-2027'}</span>
        </div>
        <h2 className="text-base font-bold text-[#0A192F] tracking-tight leading-snug">
          {getTitle()}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Application Selector */}
        <div className="relative hidden sm:block">
          <select
            value={currentAppId}
            onChange={(e) => setCurrentAppId(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-3 py-1.5 pr-8 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.institutionName.slice(0, 22)}...
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Home Link */}
        <button
          onClick={() => setActivePage('landing')}
          title="Back to Public Landing Page"
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            <div className="w-7 h-7 rounded-full bg-[#102B5C] text-white flex items-center justify-center font-bold text-xs">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <div className="font-bold text-slate-900 truncate max-w-[130px]">
                {currentUser?.name || 'User'}
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">
                {getRoleLabel()}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser?.email}</div>
                <div className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-1.5 inline-block">
                  {currentUser?.designation || getRoleLabel()}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setActivePage('landing');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Public Portal</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    resetDemo();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Application</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
