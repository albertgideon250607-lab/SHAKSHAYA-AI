import React from 'react';
import { HelpCircle, BookOpen, ShieldCheck, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EOA_DOCUMENT_CATEGORIES } from '../types';

export const HelpSupportView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 shadow-xs">
        <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
          AICTE Approval Process Handbook (APH 2025-26)
        </div>
        <h2 className="text-xl font-bold text-[#0A192F]">
          Shakshya AI — Evaluation & Handbook Reference Guide
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive documentation of regulatory rules, automated extraction architecture, and prototype demonstration workflows.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4 text-xs text-slate-700">
        {/* Section 1: Demonstration Flow */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>1. How to Evaluate the One-Click Demonstration</span>
          </h3>
          <p className="leading-relaxed">
            Click the <strong className="text-blue-600">Try Demo</strong> button in the top navigation or sidebar. The system automatically executes:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-600">
            <li>Initializes synthetic application <span className="font-mono font-semibold text-slate-900">DEMO-EOA-001</span> for "ABC College of Engineering".</li>
            <li>Attaches all 7 mandatory statutory sample PDFs from <span className="font-mono text-slate-800">public/sample-documents/</span>.</li>
            <li>Executes native text stream extraction across all documents.</li>
            <li>Detects the deliberate cross-document mismatch: <strong className="text-amber-800">ter-receipt-mismatch.pdf</strong> contains "XYZ Institute of Technology".</li>
            <li>Computes honest preliminary readiness score (e.g. 71%) and flags <span className="font-mono font-semibold text-slate-800">RULE DEMO-EoA-002</span>.</li>
            <li>Enables immediate before-and-after rectification in the <strong className="text-slate-800">Rectify & Re-upload</strong> workspace.</li>
          </ol>
        </div>

        {/* Section 2: Statutory 7-Document Matrix */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>2. Statutory 7-Document Checklist Categories (APH 2025-26)</span>
          </h3>
          <div className="space-y-2">
            {EOA_DOCUMENT_CATEGORIES.map((cat, idx) => (
              <div key={cat.id} className="p-2.5 rounded bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>0{idx + 1}. {cat.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">{cat.aphClause}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Honest Scanned OCR Fallback */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>3. Honest Fallbacks & Anti-Slop Discipline</span>
          </h3>
          <p className="leading-relaxed">
            Shakshya AI maintains strict anti-hallucination and integrity standards:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
            <li><strong>Scanned Documents:</strong> Scanned image-only PDFs without a native text layer (e.g., <span className="font-mono text-slate-800">scanned-ocr-sample.pdf</span>) are honestly flagged as <em>"OCR Required — text extraction unavailable"</em> rather than fabricating extracted text.</li>
            <li><strong>No Fake Official Approvals:</strong> AI findings are clearly designated as preliminary assistance; final statutory grant requires authorized scrutiny officer review.</li>
            <li><strong>Tamper-Evident Hashing:</strong> SHA-256 hashes generated on PDF reports verify the integrity of the generated report file without falsely claiming source document verification.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
