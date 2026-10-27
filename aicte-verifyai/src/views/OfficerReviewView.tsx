import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileDown,
  UserCheck,
  History,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateVerificationPdfReport } from '../utils/reportGenerator';

export const OfficerReviewView: React.FC = () => {
  const { currentApp, recordOfficerDecision } = useApp();

  const [decision, setDecision] = useState<'RECOMMENDED_FOR_APPROVAL' | 'NEEDS_RECTIFICATION' | 'REJECTED'>(
    currentApp?.officerReview?.decision || 'RECOMMENDED_FOR_APPROVAL'
  );
  const [notes, setNotes] = useState<string>(
    currentApp?.officerReview?.notes ||
      'Documents examined against AICTE Approval Process Handbook (APH 2025-26) norms. Physical/legal verification completed.'
  );

  const [checklist, setChecklist] = useState({
    landTitleVerified: currentApp?.officerReview?.scrutinyChecklist?.landTitleVerified ?? true,
    fireSafetyValid: currentApp?.officerReview?.scrutinyChecklist?.fireSafetyValid ?? true,
    terChargesCleared: currentApp?.officerReview?.scrutinyChecklist?.terChargesCleared ?? true,
    affidavitDulyNotarized: currentApp?.officerReview?.scrutinyChecklist?.affidavitDulyNotarized ?? true,
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!currentApp) {
    return <div>No active application selected.</div>;
  }

  const handleSaveDecision = () => {
    if (!notes.trim()) {
      alert('Please enter mandatory scrutiny remarks before recording officer decision.');
      return;
    }
    recordOfficerDecision(decision, notes, checklist);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              OFFICER SCRUTINY PORTAL
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">Officer ID: AICTE-SCRUTINY-OFFICER-4412</span>
          </div>
          <h2 className="text-xl font-bold text-[#0A192F]">
            Statutory Scrutiny & Approval Determination
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Application: <strong className="text-slate-800">{currentApp.id}</strong> · {currentApp.institutionName}
          </p>
        </div>

        <button
          onClick={() => generateVerificationPdfReport(currentApp)}
          className="px-4 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Scrutiny Report (PDF)</span>
        </button>
      </div>

      {/* Statutory Mandate Notice */}
      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-sm">Human-in-the-Loop Regulatory Scrutiny Protocol</div>
          <p className="mt-0.5 text-blue-800/80 leading-relaxed text-[11px]">
            Shakshya AI automated flags are preliminary assistive recommendations. Official statutory grant or refusal of Extension of Approval (EoA) requires discretionary evaluation and signed determination by an authorized Scrutiny Committee officer.
          </p>
        </div>
      </div>

      {/* Main Split: AI Summary vs Officer Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (lg:col-span-5): Automated AI Findings Overview */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0A192F] uppercase tracking-tight">
              AI Ingestion & Anomaly Summary
            </h3>
            <span className="text-xs font-mono font-semibold text-slate-700">
              Score: {currentApp.readinessScore}%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Total Mandatory Categories:</span>
              <span className="font-bold text-slate-900">7 / 7</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Attached Documents:</span>
              <span className="font-bold text-slate-900">{currentApp.documents.length}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Active Unresolved Flags:</span>
              <span className={`font-bold ${currentApp.findings.length ? 'text-amber-700' : 'text-emerald-700'}`}>
                {currentApp.findings.length}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detected Anomalies for Human Verification
            </h4>
            {currentApp.findings.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero regulatory anomalies flagged. Documents match institutional records.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {currentApp.findings.map((f) => (
                  <div key={f.id} className="p-2.5 rounded border border-amber-200 bg-amber-50/50 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{f.ruleId}</span>
                      <span className="text-[10px] text-amber-800 uppercase px-1.5 py-0.2 rounded bg-amber-100">
                        {f.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {f.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (lg:col-span-7): Officer Determination Form */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded p-5 shadow-xs space-y-5">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-tight">
              Record Statutory Committee Determination
            </h3>
            <p className="text-xs text-slate-500">
              Enter formal review notes and record determination into immutable audit trail.
            </p>
          </div>

          {/* Statutory Verification Checklist */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Officer Verification Checklist (Physical & Legal Review)
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.landTitleVerified}
                  onChange={(e) => setChecklist((p) => ({ ...p, landTitleVerified: e.target.checked }))}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800 font-medium">
                  Land Title, survey coordinates, and continuous campus area verified (10.5 Acres).
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.fireSafetyValid}
                  onChange={(e) => setChecklist((p) => ({ ...p, fireSafetyValid: e.target.checked }))}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800 font-medium">
                  State Fire Safety NOC unexpired and covers active academic period (2026-2027).
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.terChargesCleared}
                  onChange={(e) => setChecklist((p) => ({ ...p, terChargesCleared: e.target.checked }))}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800 font-medium">
                  TER processing fee receipt reconciled against Bharatkosh payment gateway.
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.affidavitDulyNotarized}
                  onChange={(e) => setChecklist((p) => ({ ...p, affidavitDulyNotarized: e.target.checked }))}
                  className="rounded text-blue-600"
                />
                <span className="text-slate-800 font-medium">
                  Affidavit 2 notarized on Rs. 100/- stamp paper with authorized deponent declaration.
                </span>
              </label>
            </div>
          </div>

          {/* Statutory Determination Option */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Statutory Committee Recommendation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label
                className={`p-3 rounded border cursor-pointer flex flex-col justify-between transition-colors ${
                  decision === 'RECOMMENDED_FOR_APPROVAL'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-800">Recommend Approval</span>
                  <input
                    type="radio"
                    name="decision"
                    value="RECOMMENDED_FOR_APPROVAL"
                    checked={decision === 'RECOMMENDED_FOR_APPROVAL'}
                    onChange={() => setDecision('RECOMMENDED_FOR_APPROVAL')}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Full compliance with AICTE APH norms established.
                </p>
              </label>

              <label
                className={`p-3 rounded border cursor-pointer flex flex-col justify-between transition-colors ${
                  decision === 'NEEDS_RECTIFICATION'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-800">Show Cause / Rectify</span>
                  <input
                    type="radio"
                    name="decision"
                    value="NEEDS_RECTIFICATION"
                    checked={decision === 'NEEDS_RECTIFICATION'}
                    onChange={() => setDecision('NEEDS_RECTIFICATION')}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Deficiencies flagged; 15 days cure notice issued.
                </p>
              </label>

              <label
                className={`p-3 rounded border cursor-pointer flex flex-col justify-between transition-colors ${
                  decision === 'REJECTED'
                    ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-500'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-rose-800">Reject Application</span>
                  <input
                    type="radio"
                    name="decision"
                    value="REJECTED"
                    checked={decision === 'REJECTED'}
                    onChange={() => setDecision('REJECTED')}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Substantial non-compliance or fraudulent documents.
                </p>
              </label>
            </div>
          </div>

          {/* Mandatory Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Officer Scrutiny Remarks & Statutory Findings (Mandatory)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              placeholder="Enter official scrutiny notes and reason for determination..."
            />
          </div>

          {/* Save Decision Action */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Determination recorded into official audit log!</span>
                </span>
              )}
            </div>

            <button
              onClick={handleSaveDecision}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Record Officer Decision</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
