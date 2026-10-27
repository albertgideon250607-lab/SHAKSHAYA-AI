import React, { useState } from 'react';
import {
  FileText,
  Search,
  Gauge,
  AlertTriangle,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPageView: React.FC = () => {
  const { setActivePage } = useApp();
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    items?: string[];
  } | null>(null);

  const handleNavClick = (section: string) => {
    switch (section) {
      case 'features':
        setModalContent({
          title: 'Shakshya AI Capabilities',
          description:
            'AI-assisted statutory compliance verification aligned directly with the official AICTE Approval Process Handbook (APH 2024-27).',
          items: [
            'Automated 7-category statutory document validation and OCR readability analysis.',
            'Cross-document reconciliation of institution name, trust details, and fee payment IDs.',
            'Click-to-Evidence viewer mapping highlighted clauses to official APH mandates.',
            'Real-time Readiness Score calculation with penalty weights for non-compliance.',
          ],
        });
        break;
      case 'how-it-works':
        setModalContent({
          title: 'How Shakshya AI Works',
          description: 'A 4-step streamlined audit workflow before institutional submission:',
          items: [
            '1. Select Institutional Category (Extension of Approval / New Institution / ODL).',
            '2. Upload statutory PDFs (Affidavit, TER Receipt, Fire NOC, Land Title, etc.).',
            '3. AI Scrutiny Engine scans, extracts OCR text layers, and cross-reconciles records.',
            '4. Review preliminary readiness score, pinpoint discrepancies, and re-upload before official submission.',
          ],
        });
        break;
      case 'about':
        setModalContent({
          title: 'About AICTE Approval Readiness Portal',
          description:
            'A prototype regulatory assistive intelligence portal designed to help technical colleges, engineering institutes, and universities verify statutory readiness before the formal AICTE scrutiny window.',
          items: [
            'Aligned with Approval Process Handbook (APH 2024-25 to 2026-27).',
            'Transparent rule configurations and tamper detection.',
            'Assistive intelligence for both institutional applicants and scrutiny officers.',
          ],
        });
        break;
      case 'contact':
        setModalContent({
          title: 'Helpdesk & Support',
          description:
            'For institutional inquiries, handbook clarifications, or technical support regarding the readiness verification portal:',
          items: [
            'Email: support-shakshya@aicte-india.org',
            'Toll-Free Helpline: 1800-11-22-33 (09:30 AM to 05:30 PM IST)',
            'AICTE Headquarters: Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070',
          ],
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] font-sans flex flex-col justify-between selection:bg-blue-100">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('landing')}>
            <img
              src="/aicte-logo.png"
              alt="AICTE Official Emblem"
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div>
              <div className="font-extrabold text-[15px] sm:text-base text-[#0B1528] tracking-tight leading-tight">
                Shakshya AI
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-tight">
                Intelligent Verification Platform
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => setActivePage('landing')}
              className="text-[#2563EB] font-semibold transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="text-slate-600 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-slate-600 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-slate-600 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-slate-600 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action: Get Started */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('login')}
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 w-full flex-1 flex flex-col justify-center">
        {/* 2. Hero Card */}
        <section className="relative bg-[#06122C] rounded-xl overflow-hidden border border-[#16274E] shadow-xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-5 z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-[43px] font-extrabold text-white tracking-tight leading-[1.12]">
                Shakshya AI <br />
                Intelligent Document <br />
                <span className="text-[#C084FC]">Verification Platform</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Every Document. Verified with Intelligence. Validate institution documents against the official AICTE Approval Process Handbook (2024-25 to 2026-27) with AI-assisted checks and evidence-based verification.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="px-5 py-2.5 bg-[#0C1A38] hover:bg-[#13254E] text-white border border-[#213768] text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Image: AICTE HQ Building */}
            <div className="lg:col-span-5 relative h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] p-4 sm:p-5 flex items-center justify-center">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-700/60 shadow-lg">
                <img
                  src="/assets/aicte-building.jpg"
                  alt="AICTE Headquarters"
                  className="w-full h-full object-cover object-center max-h-[320px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06122C]/40 via-transparent to-transparent pointer-events-none" />

              </div>
            </div>
          </div>
        </section>

        {/* 3. Four Feature Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-5 sm:mt-6">
          {/* Card 1: Document Validation */}
          <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-[13px] sm:text-sm leading-tight">
                Document Validation
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                compliance checks with AI
              </div>
            </div>
          </div>

          {/* Card 2: Click-to-Evidence */}
          <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-[13px] sm:text-sm leading-tight">
                Click-to-Evidence
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                View source proof in your documents
              </div>
            </div>
          </div>

          {/* Card 3: Readiness Score */}
          <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-[13px] sm:text-sm leading-tight">
                Readiness Score
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                Know what's missing before you apply
              </div>
            </div>
          </div>

          {/* Card 4: Risk Insights */}
          <div className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-[13px] sm:text-sm leading-tight">
                Risk Insights
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                Identify high-risk issues early
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 5. Global Bottom Footer Bar */}
      <footer className="bg-[#0B1528] text-slate-400 py-3.5 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-center sm:text-left text-slate-400">
            <strong className="text-slate-200 font-medium">Shakshya AI · AICTE Approval Readiness Portal</strong>{' '}
            | Prototype for demonstration purposes only. Not an official AICTE product.
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() =>
                setModalContent({
                  title: 'Privacy Policy',
                  description:
                    'All uploaded sample documents are processed locally within the browser session context and are never stored on external third-party public cloud servers.',
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() =>
                setModalContent({
                  title: 'Statutory Disclaimer',
                  description:
                    'Shakshya AI is an automated readiness assessment aid. It does not replace or override statutory scrutiny by the All India Council for Technical Education (AICTE) Regional Committees.',
                })
              }
              className="hover:text-white transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Information Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{modalContent.description}</p>
            {modalContent.items && (
              <div className="space-y-2 pt-1">
                {modalContent.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
