import React, { useState } from 'react';
import { Building2, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterView: React.FC = () => {
  const { login, setActivePage } = useApp();

  const [institutionName, setInstitutionName] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [repName, setRepName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!institutionName.trim() || !email.trim() || !repName.trim()) {
      setError('Please fill in all mandatory institutional registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the AICTE APH terms and compliance declaration.');
      return;
    }

    setRegistered(true);
    setTimeout(() => {
      login('institution', email, repName, institutionName);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 text-[#0A192F]">
      {/* Top Header */}
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

      {/* Main Registration Card */}
      <div className="max-w-lg w-full mx-auto my-6 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional Applicant Registration</span>
          </div>
          <h2 className="text-2xl font-bold text-[#0A192F] tracking-tight">
            Create Institution Account
          </h2>
          <p className="text-xs text-slate-500">
            For technical institutes applying for AICTE Extension of Approval (EoA)
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        {registered ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded text-center space-y-2 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Account Provisioned Successfully!</h4>
            <p className="text-emerald-700">
              Onboarding {institutionName}. Redirecting to your institutional compliance dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Institution Full Name (as registered with AICTE) *
              </label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g., National Institute of Technology & Engineering"
                className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Permanent Institute ID (PID) *
                </label>
                <input
                  type="text"
                  required
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  placeholder="e.g., 1-1234567890"
                  className="w-full p-2.5 rounded border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Authorized Head / Representative *
                </label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder="Dr. S. K. Verma (Principal)"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Official Institutional Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="principal@institute.edu.in"
                className="w-full p-2.5 rounded border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded border border-slate-300 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-slate-600 leading-relaxed">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <span className="text-[11px]">
                  I affirm that I am the authorized representative of this institution and declare that all uploaded certificates comply with AICTE Approval Process Handbook (APH 2025-26) norms.
                </span>
              </label>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 leading-tight">
              Notice: Public registration provisions institutional applicant access only. Official AICTE scrutiny officer credentials and administrator roles are statutory government assignments.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2463EB] hover:bg-blue-600 text-white font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Register & Open Application Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Already registered? </span>
          <button
            onClick={() => setActivePage('login')}
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            Sign in to existing account
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 py-2">
        Shakshya AI · Institutional Approval Readiness Portal · APH 2025-26
      </div>
    </div>
  );
};
