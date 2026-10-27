import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, setActivePage } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('institution');
  const [email, setEmail] = useState('principal@abccollege.edu.in');
  const [password, setPassword] = useState('Shakshya@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Set default credentials when switching role tab
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'officer') {
      setEmail('officer.4412@aicte.gov.in');
      setPassword('Officer@Scrutiny4412');
    } else if (role === 'admin') {
      setEmail('admin.compliance@aicte.gov.in');
      setPassword('Admin@ComplianceSuper');
    } else {
      setEmail('principal@abccollege.edu.in');
      setPassword('Shakshya@2026');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both official email address and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(selectedRole, email);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 text-[#0A192F]">
      {/* Top Header with Back to Home */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/aicte-logo.png"
            alt="AICTE Emblem"
            className="w-7 h-7 object-contain"
          />
          <span className="font-bold text-sm text-[#102B5C]">Shakshya AI</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Welcome Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#0A192F] tracking-tight">
            Sign In to Shakshya AI
          </h2>
          <p className="text-xs text-slate-500">
            Institutional Approval Readiness & Regulatory Compliance
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block text-center">
            Select Authorized Access Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => handleRoleChange('institution')}
              className={`py-2 px-1 rounded flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'institution'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[11px] truncate">Institution</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('officer')}
              className={`py-2 px-1 rounded flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'officer'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-[11px] truncate">Scrutiny Officer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-1 rounded flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] truncate">Administrator</span>
            </button>
          </div>
        </div>

        {/* Role Description Note */}
        <div
          className={`p-3 rounded text-[11px] leading-relaxed border ${
            selectedRole === 'institution'
              ? 'bg-blue-50/70 text-blue-900 border-blue-200'
              : selectedRole === 'officer'
              ? 'bg-emerald-50/70 text-emerald-900 border-emerald-200'
              : 'bg-purple-50/70 text-purple-900 border-purple-200'
          }`}
        >
          {selectedRole === 'institution' && (
            <span>
              <strong>College / Institutional Access:</strong> Manage EoA applications, upload 7-document checklist, review automated validation findings, and apply document rectifications.
            </span>
          )}
          {selectedRole === 'officer' && (
            <span>
              <strong>Authorized Scrutiny Officer:</strong> Access regional review queue, inspect cross-document findings, verify evidence snippets, and record statutory scrutiny determinations.
            </span>
          )}
          {selectedRole === 'admin' && (
            <span>
              <strong>System Administrator:</strong> Configure regulatory rule weights, penalty thresholds, and inspect immutable audit trail ledgers.
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu.in"
                className="w-full p-2.5 pl-9 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 pl-9 pr-9 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-[11px]">Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#2463EB] hover:bg-blue-600 text-white font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>New institutional applicant? </span>
          <button
            onClick={() => setActivePage('register')}
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            Register Institution
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400 py-2">
        Shakshya AI · Institutional Approval Readiness Portal · APH 2025-26
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Password Recovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For institutional security, password resets are coordinated via your institution's registered AICTE nodal officer or regional officer.
            </p>
            <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-xs text-blue-900">
              Demonstration prototype: default credentials are automatically populated in the sign-in form for each role.
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
