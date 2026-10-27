import React from 'react';
import { FileDown, ShieldCheck, Printer, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateVerificationPdfReport } from '../utils/reportGenerator';
import { EOA_DOCUMENT_CATEGORIES } from '../types';

export const ReportsView: React.FC = () => {
  const { currentApp } = useApp();

  if (!currentApp) {
    return <div>No active application selected.</div>;
  }

  const uploadedHashes = currentApp.documents
    .map((document) => document.sha256)
    .filter((sha256): sha256 is string => Boolean(sha256));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Compliance Documentation
          </div>
          <h2 className="text-xl font-bold text-[#0A192F]">
            AICTE Regulatory Verification Audit Report
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generates a tamper-evident compliance audit dossier suitable for Scrutiny Committees and statutory records.
          </p>
        </div>

        <button
          onClick={() => generateVerificationPdfReport(currentApp)}
          className="px-4 py-2 bg-[#2463EB] hover:bg-blue-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Download Official PDF</span>
        </button>
      </div>

      {/* Report Preview Document Canvas */}
      <div className="bg-white border border-slate-300 rounded shadow-md max-w-4xl mx-auto overflow-hidden">
        {/* PDF Header Stripe */}
        <div className="bg-[#102B5C] text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                All India Council for Technical Education · Government of India
              </div>
              <h3 className="text-lg font-bold mt-1">
                Extension of Approval (EoA) Compliance Verification Dossier
              </h3>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Shakshya AI Automated Regulatory Engine · Approval Readiness Portal
              </p>
            </div>
            <div className="text-right text-xs text-blue-200">
              <div>Session: {currentApp.academicYear}</div>
              <div className="font-mono text-[11px]">{new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-8 space-y-6 text-xs text-slate-800">
          {/* Metadata Block */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Application ID</span>
              <span className="font-bold font-mono text-slate-900">{currentApp.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Institution</span>
              <span className="font-semibold text-slate-900 truncate block">{currentApp.institutionName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Permanent ID</span>
              <span className="font-mono text-slate-800">{currentApp.instituteId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Category</span>
              <span className="text-slate-800">{currentApp.applicationCategory}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Preliminary Readiness</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{currentApp.readinessScore}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Evaluation Status</span>
              <span className="font-semibold text-slate-900">{currentApp.status}</span>
            </div>
          </div>

          {/* 7-Document Checklist Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-tight text-xs mb-2">
              1. Statutory Checklist Verification Matrix
            </h4>
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Attached File</th>
                    <th className="py-2 px-3">Text Layer</th>
                    <th className="py-2 px-3">Compliance Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {EOA_DOCUMENT_CATEGORIES.map((cat) => {
                    const doc = currentApp.documents.find((d) => d.category === cat.id);
                    return (
                      <tr key={cat.id}>
                        <td className="py-2 px-3 font-medium text-slate-800">{cat.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                          {doc ? doc.filename : 'Not Attached'}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {doc ? (doc.hasTextLayer ? 'Searchable' : 'OCR Required') : '—'}
                        </td>
                        <td className="py-2 px-3 font-semibold">
                          {doc ? (
                            doc.status === 'verified' ? (
                              <span className="text-emerald-700">PASSED</span>
                            ) : doc.status === 'ocr_required' ? (
                              <span className="text-amber-700">OCR REQUIRED</span>
                            ) : (
                              <span className="text-rose-700">FLAGGED</span>
                            )
                          ) : (
                            <span className="text-rose-700">MISSING</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulatory Findings Table */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-tight text-xs mb-2">
              2. Detailed Finding Log & Evidence Snippets ({currentApp.findings.length})
            </h4>
            {currentApp.findings.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">
                Zero regulatory findings flagged. All configured rules passed.
              </div>
            ) : (
              <div className="space-y-2">
                {currentApp.findings.map((f) => (
                  <div key={f.id} className="p-3 rounded border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>[{f.severity}] {f.ruleId} — {f.ruleName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">Page {f.pageNumber || 1}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{f.description}</p>
                    <div className="bg-slate-900 text-amber-300 font-mono text-[11px] p-2 rounded mt-1.5">
                      Evidence: {f.evidenceSnippet}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Officer Scrutiny Determination */}
          <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-tight text-xs">
              3. Officer Scrutiny Determination & Signature Block
            </h4>
            {currentApp.officerReview ? (
              <div className="space-y-1 text-slate-700">
                <div>Officer ID: <strong className="font-mono text-slate-900">{currentApp.officerReview.officerId}</strong></div>
                <div>Statutory Decision: <strong className="text-emerald-800">{currentApp.officerReview.decision.replace(/_/g, ' ')}</strong></div>
                <div>Timestamp: {new Date(currentApp.officerReview.decisionTimestamp).toLocaleString('en-IN')}</div>
                <div>Remarks: <span className="italic">{currentApp.officerReview.notes}</span></div>
              </div>
            ) : (
              <div className="text-slate-500 italic">
                Awaiting final determination by authorized Scrutiny Committee officer.
              </div>
            )}
          </div>

          {/* Footer & Integrity Fingerprint */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-mono">
                {uploadedHashes.length
                  ? `${uploadedHashes.length} uploaded document hash${uploadedHashes.length === 1 ? '' : 'es'} available`
                  : 'No uploaded document hashes available'}
              </span>
              <p className="mt-0.5">
                Hashes identify uploaded file bytes in this browser session; they do not authenticate issuers or prove document integrity.
              </p>
            </div>
            <button
              onClick={() => generateVerificationPdfReport(currentApp)}
              className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-900 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
