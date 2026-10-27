import React, { useState } from 'react';
import {
  FileText,
  Landmark,
  GraduationCap,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface ApplicationCategoryItem {
  id: string;
  name: string;
  badge?: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  iconBorder: string;
}

export const APPLICATION_CATEGORIES: ApplicationCategoryItem[] = [
  {
    id: 'eoa',
    name: 'Extension of Approval (EoA)',
    badge: 'Based on Self-Disclosure',
    description: 'For existing technical Institutions (7 documents)',
    icon: FileText,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    iconBorder: 'border-blue-200',
  },
  {
    id: 'new_institution',
    name: 'New Technical Institution',
    description: 'For new institutions at all levels',
    icon: Landmark,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    iconBorder: 'border-amber-200',
  },
  {
    id: 'odl_online',
    name: 'ODL / Online Program',
    description: 'For standalone institutions or universities',
    icon: GraduationCap,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    iconBorder: 'border-emerald-200',
  },
  {
    id: 'other_types',
    name: 'Other Application Types',
    description: '(17 types as per APH)',
    icon: Layers,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    iconBorder: 'border-teal-200',
  },
];

export const NewApplicationView: React.FC = () => {
  const { createNewApplication, setActiveTab, currentUser } = useApp();

  const [step, setStep] = useState<'category' | 'details'>('category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('eoa');

  const [institutionName, setInstitutionName] = useState(
    currentUser?.institutionName || 'ABC College of Engineering'
  );
  const [instituteId, setInstituteId] = useState(
    currentUser?.instituteId || '1-9876543210'
  );
  const [academicYear, setAcademicYear] = useState('2026-27');

  const selectedCategory =
    APPLICATION_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
    APPLICATION_CATEGORIES[0];

  const handleContinueFromCategory = () => {
    setStep('details');
  };

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim()) {
      alert('Please enter an institution name.');
      return;
    }
    createNewApplication(
      institutionName.trim(),
      instituteId.trim() || '1-XXXXXXXXXX',
      academicYear,
      selectedCategory.name
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 4-Step Stepper Wizard */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Step 1: Category */}
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'category'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step === 'details' ? <Check className="w-4 h-4 stroke-[2.5]" /> : '1'}
            </div>
            <span
              className={`text-xs font-semibold ${
                step === 'category' ? 'text-blue-600' : 'text-slate-700'
              }`}
            >
              Category
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-3 ${
              step === 'details' ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          />

          {/* Step 2: Details */}
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'details'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 border border-slate-300'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-medium ${
                step === 'details' ? 'text-blue-600 font-semibold' : 'text-slate-500'
              }`}
            >
              Details
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200" />

          {/* Step 3: Checklist */}
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center text-xs font-medium">
              3
            </div>
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Checklist
            </span>
          </div>

          <div className="flex-1 h-0.5 mx-3 bg-slate-200 hidden sm:block" />

          {/* Step 4: Upload */}
          <div className="flex items-center gap-2 opacity-60 hidden sm:flex">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center text-xs font-medium">
              4
            </div>
            <span className="text-xs font-medium text-slate-500">
              Upload
            </span>
          </div>
        </div>
      </div>

      {/* Main Card View */}
      {step === 'category' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
          {/* Section Title */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0A192F] tracking-tight">
              Select Application Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the regulatory application stream aligned with the AICTE Approval Process Handbook (APH).
            </p>
          </div>

          {/* 4 Application Categories matching screenshot 4 */}
          <div className="space-y-3.5">
            {APPLICATION_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-2 border-blue-600 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left: Icon & Title & Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-lg ${cat.iconBg} ${cat.iconColor} ${cat.iconBorder} border flex items-center justify-center flex-shrink-0 shadow-2xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#0A192F] leading-snug">
                          {cat.name}
                        </span>
                        {cat.badge && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Radio Selection Indicator */}
                  <div className="flex-shrink-0 pr-1">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 fill-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button: Continue */}
          <div className="pt-2">
            <button
              onClick={handleContinueFromCategory}
              className="w-full py-2.5 px-6 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Application Details Form */
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
                Step 2 of 4 · Application Details
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0A192F] tracking-tight">
                Enter Institutional Information
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setStep('category')}
              className="text-xs text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Category</span>
            </button>
          </div>

          {/* Selected Category Summary Card */}
          <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-md ${selectedCategory.iconBg} ${selectedCategory.iconColor} flex items-center justify-center flex-shrink-0 border ${selectedCategory.iconBorder}`}>
                <selectedCategory.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-950">
                  {selectedCategory.name}
                </div>
                <div className="text-[11px] text-blue-700">
                  {selectedCategory.description}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
              Selected
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateApplication} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">
                Institution Name (as approved by AICTE) *
              </label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g., ABC College of Engineering"
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  Permanent Institute ID (PID)
                </label>
                <input
                  type="text"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  placeholder="e.g., 1-9876543210"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  Academic Session Year
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-900"
                >
                  <option value="2026-27">2026-27 (Active Session)</option>
                  <option value="2027-28">2027-28</option>
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed">
              <strong>Checklist & Validation Auto-Setup:</strong> Registering this application provisions the statutory compliance ledger for <span className="font-semibold text-slate-800">{selectedCategory.name}</span>. You can inspect documents, cross-reconcile identities, or perform automated compliance audits.
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('category')}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Create Application Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
