import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EvidenceModal } from './components/EvidenceModal';

import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';

import { DashboardView } from './views/DashboardView';
import { ApplicationsPortfolioView } from './views/ApplicationsPortfolioView';
import { NewApplicationView } from './views/NewApplicationView';
import { ChecklistView } from './views/ChecklistView';
import { UploadProcessingView } from './views/UploadProcessingView';
import { ValidationResultsView } from './views/ValidationResultsView';
import { RectifyReuploadView } from './views/RectifyReuploadView';
import { OfficerReviewView } from './views/OfficerReviewView';
import { ReportsView } from './views/ReportsView';
import { EntityGraphView } from './views/EntityGraphView';
import { DuplicateDetectionView } from './views/DuplicateDetectionView';
import { AdminRuleBuilderView } from './views/AdminRuleBuilderView';
import { AuditLogView } from './views/AuditLogView';
import { HelpSupportView } from './views/HelpSupportView';
import { ShieldAlert } from 'lucide-react';

const AccessDeniedNotice: React.FC<{ message: string; requiredRole: string }> = ({
  message,
  requiredRole,
}) => {
  const { setActiveTab } = useApp();
  return (
    <div className="bg-white border border-rose-200 rounded-lg p-8 text-center max-w-lg mx-auto my-12 space-y-3 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-base text-slate-900">Restricted Access Control</h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        {message} This section requires an authorized <strong className="text-slate-800">{requiredRole}</strong> credential.
      </p>
      <button
        onClick={() => setActiveTab('dashboard')}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
      >
        Return to My Dashboard
      </button>
    </div>
  );
};

const AuthenticatedPortal: React.FC = () => {
  const { activeTab, userRole } = useApp();

  const renderActiveView = () => {
    // Role protection enforcement
    if (activeTab === 'officer_review' && userRole === 'institution') {
      return (
        <AccessDeniedNotice
          message="Institutional applicants cannot access or record official statutory scrutiny determinations."
          requiredRole="AICTE Scrutiny Officer"
        />
      );
    }

    if (activeTab === 'admin_rules' && userRole === 'institution') {
      return (
        <AccessDeniedNotice
          message="Institutional applicants cannot configure regulatory validation rules or modify penalty thresholds."
          requiredRole="System Administrator"
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'applications':
        return <ApplicationsPortfolioView />;
      case 'new_application':
        return <NewApplicationView />;
      case 'checklist':
        return <ChecklistView />;
      case 'upload_processing':
        return <UploadProcessingView />;
      case 'validation_results':
        return <ValidationResultsView />;
      case 'rectify_reupload':
        return <RectifyReuploadView />;
      case 'officer_review':
        return <OfficerReviewView />;
      case 'reports':
        return <ReportsView />;
      case 'entity_graph':
        return <EntityGraphView />;
      case 'duplicate_detection':
        return <DuplicateDetectionView />;
      case 'admin_rules':
        return <AdminRuleBuilderView />;
      case 'audit_log':
        return <AuditLogView />;
      case 'help_support':
        return <HelpSupportView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Executive Dark Navy Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Click-to-Evidence Inspection Modal */}
      <EvidenceModal />
    </div>
  );
};

const RootRouter: React.FC = () => {
  const { activePage, isAuthenticated } = useApp();

  if (activePage === 'landing') {
    return <LandingPageView />;
  }

  if (activePage === 'login') {
    return <LoginView />;
  }

  if (activePage === 'register') {
    return <RegisterView />;
  }

  // Protected application portal: if user is not authenticated, redirect to LoginView
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <AuthenticatedPortal />;
};

export default function App() {
  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}
