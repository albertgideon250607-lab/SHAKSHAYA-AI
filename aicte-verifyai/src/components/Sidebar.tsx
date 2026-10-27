import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  CheckSquare,
  UploadCloud,
  AlertTriangle,
  RefreshCw,
  FileCheck2,
  FileDown,
  GitBranch,
  Copy,
  Sliders,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Building2,
  UserCheck,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    userRole,
    logout,
    startOneClickDemo,
    resetDemo,
    isProcessingDemo,
  } = useApp();

  // Role-based navigation items
  const getNavItems = () => {
    if (userRole === 'officer') {
      return [
        { id: 'officer_review', label: 'Officer Review Queue', icon: FileCheck2 },
        { id: 'validation_results', label: 'Findings & Anomalies', icon: AlertTriangle },
        { id: 'entity_graph', label: 'Entity Knowledge Graph', icon: GitBranch },
        { id: 'duplicate_detection', label: 'Duplicate Detection', icon: Copy },
        { id: 'reports', label: 'Statutory PDF Reports', icon: FileDown },
        { id: 'audit_log', label: 'Audit Trail Ledger', icon: ShieldCheck },
        { id: 'help_support', label: 'APH 2025-26 Guide', icon: HelpCircle },
      ];
    }

    if (userRole === 'admin') {
      return [
        { id: 'admin_rules', label: 'Admin Rule Builder', icon: Sliders },
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'applications', label: 'Applications Ledger', icon: FileText },
        { id: 'duplicate_detection', label: 'Duplicate Detection', icon: Copy },
        { id: 'audit_log', label: 'Audit Log & History', icon: ShieldCheck },
        { id: 'help_support', label: 'APH 2025-26 Guide', icon: HelpCircle },
      ];
    }

    // Default Institution navigation
    return [
      { id: 'dashboard', label: 'Institution Dashboard', icon: LayoutDashboard },
      { id: 'applications', label: 'Applications Portfolio', icon: FileText },
      { id: 'new_application', label: 'New Application', icon: PlusCircle },
      { id: 'checklist', label: '7-Document Checklist', icon: CheckSquare },
      { id: 'upload_processing', label: 'Upload & Processing', icon: UploadCloud },
      { id: 'validation_results', label: 'Validation Results', icon: AlertTriangle },
      { id: 'rectify_reupload', label: 'Rectify & Re-upload', icon: RefreshCw },
      { id: 'reports', label: 'PDF Compliance Reports', icon: FileDown },
      { id: 'entity_graph', label: 'Entity Knowledge Graph', icon: GitBranch },
      { id: 'duplicate_detection', label: 'Duplicate Detection', icon: Copy },
      { id: 'audit_log', label: 'Audit Log', icon: ShieldCheck },
      { id: 'help_support', label: 'APH Help & Reference', icon: HelpCircle },
    ];
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (userRole) {
      case 'officer':
        return {
          title: 'Scrutiny Officer',
          icon: UserCheck,
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        };
      case 'admin':
        return {
          title: 'System Administrator',
          icon: ShieldAlert,
          bg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
        };
      default:
        return {
          title: 'Institution Representative',
          icon: Building2,
          bg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <aside className="w-64 bg-[#102B5C] text-white flex flex-col flex-shrink-0 h-screen border-r border-[#0d234b] select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-blue-900/60">
        <div className="flex items-center gap-3">
          <img
            src="/aicte-logo.png"
            alt="AICTE Official Emblem"
            className="w-10 h-10 object-contain flex-shrink-0 bg-white/10 p-0.5 rounded"
          />
          <div className="min-w-0">
            <h1 className="font-bold text-base tracking-tight text-white leading-tight truncate">
              Shakshya AI
            </h1>
            <p className="text-xs text-blue-200/80 truncate">
              Approval Readiness Portal
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div className={`mt-3 px-2.5 py-1.5 rounded border text-[11px] flex items-center justify-between ${badge.bg}`}>
          <div className="flex items-center gap-1.5 truncate">
            <BadgeIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold tracking-wide truncate">{badge.title}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        </div>
      </div>

      {/* User Identity Info */}
      <div className="px-4 py-3 bg-[#0c234a]/70 border-b border-blue-900/40 text-xs">
        <div className="font-bold text-white truncate">
          {currentUser?.name || 'Authorized User'}
        </div>
        <div className="text-[11px] text-blue-200/70 truncate">
          {currentUser?.institutionName || currentUser?.designation || currentUser?.email || 'Portal User'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600/30 text-white font-semibold border-l-2 border-blue-400'
                  : 'text-blue-100/75 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-300' : 'text-blue-200/60'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions with Logout */}
      <div className="p-3 border-t border-blue-900/60 bg-[#0c234a]/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-blue-200/70">
          <span>Active Session:</span>
          <span className="font-mono text-white text-[11px]">DEMO-EOA-001</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 text-xs font-medium rounded border border-rose-800/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
