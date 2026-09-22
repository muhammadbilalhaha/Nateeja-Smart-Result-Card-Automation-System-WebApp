"use client";

// ********************************** Library Imports ******************************************
import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  Download,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Settings,
  Building2,
  PenTool,
  Sliders,
  ArrowRight,
  FileSpreadsheet,
  Check
} from "lucide-react";

// ********************************** Local Storage Key ******************************************
const GUIDE_SEEN_KEY = "formatGuideSeen_v1";

export default function FileUploadSection({
  getRootProps,
  getInputProps,
  isDragActive,
  isFileLoaded,
  fileName,
  error,
  isProcessing,
  onPreview,
  onGenerate,
  onClear,
  onDownloadSample,
}) {
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("branding"); // 'branding' or 'format'
  const [pulse, setPulse] = useState(false);
  const guideButtonRef = useRef(null);

  // ********************************** First-Visit Detection ******************************************
  useEffect(() => {
    try {
      const seen = localStorage.getItem(GUIDE_SEEN_KEY);
      if (!seen) setPulse(true);
    } catch {
      // localStorage blocked (private mode etc.)
    }
  }, []);

  // ********************************** Mark Guide As Seen ******************************************
  const markGuideSeen = () => {
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, "1");
    } catch {}
    setPulse(false);
  };

  // ********************************** Open Guide ******************************************
  const openGuide = (tab = "format") => {
    setActiveTab(tab);
    setShowGuide(true);
    markGuideSeen();
  };

  // ********************************** Close Guide ******************************************
  const closeGuide = () => setShowGuide(false);

  // ********************************** Esc Key to Close + Scroll Lock ******************************************
  useEffect(() => {
    if (!showGuide) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeGuide();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showGuide]);

  return (
    <>
      <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[520px]">
        
        {/* ********************************** First-Time Quick Tip Banner ****************************************** */}
        <div className="mb-6 bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-[#0256b1] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">First time generating report cards?</p>
              <p className="text-xs text-slate-500">
                Configure your school name, logo, and signatures before creating PDFs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openGuide("branding")}
            className="text-xs font-semibold text-[#0256b1] hover:text-[#01448e] bg-white hover:bg-blue-50/50 border border-blue-200 px-3 py-1.5 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            Setup Guide <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ********************************** Upload Header ****************************************** */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-6 bg-[#0256b1] rounded-full" />
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Data</h2>
            </div>
            <span className="text-xs font-bold tracking-wider text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full uppercase">
              Step 1 of 3
            </span>
          </div>

          {/* ********************************** Dropzone Area ****************************************** */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${
              isDragActive
                ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
                : "border-slate-200 hover:border-blue-400 bg-gradient-to-b from-slate-50/60 to-white hover:bg-slate-50"
            } min-h-[320px]`}
          >
            <input {...getInputProps()} />
            
            {/* Background Decorative Gradient Ring */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/60 mb-5 group-hover:scale-110 transition-transform border border-slate-100">
              <Upload className="w-7 h-7 text-[#0256b1]" />
            </div>

            {isDragActive ? (
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-1">Drop your Excel file here</h3>
                <p className="text-xs text-blue-500 font-medium">Release to attach your spreadsheet</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Drag & Drop your Excel file here</h3>
                <p className="text-xs text-slate-400 mb-6">Supports standard <code className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">.xlsx</code> and <code className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">.xls</code> workbooks</p>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-[#0256b1] hover:bg-[#01448e] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-900/10 hover:shadow-lg transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Import Excel File
                </button>
              </>
            )}
          </div>

          {/* ********************************** Sample + Guide Row ****************************************** */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onDownloadSample}
              className="flex items-center gap-2 text-[#0256b1] hover:text-[#01448e] text-sm font-semibold px-3 py-2 rounded-xl hover:bg-blue-50/80 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Sample File (10 students)
            </button>

            {/* Guide button — pulses on first visit */}
            <div className="relative">
              {pulse && (
                <span className="absolute inset-0 rounded-xl pointer-events-none animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] bg-blue-400/30" />
              )}
              <button
                ref={guideButtonRef}
                type="button"
                onClick={() => openGuide("format")}
                className={`relative flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all ${
                  pulse
                    ? "text-white bg-[#0256b1] hover:bg-[#01448e] shadow-md shadow-blue-500/30"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
                }`}
              >
                {pulse ? <Sparkles className="w-4 h-4" /> : <Info className="w-4 h-4 text-blue-600" />}
                Excel & Setup Guide
              </button>
            </div>
          </div>
        </div>

        {/* ********************************** File Status Section ****************************************** */}
        <div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold p-3 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {isFileLoaded && !error && (
              <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-900 truncate max-w-[280px]">
                    Loaded: {fileName}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Ready
                </span>
              </div>
            )}
            {!isFileLoaded && !error && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium px-1">
                <span className="w-2 h-2 rounded-full bg-slate-300" /> No file loaded yet
              </div>
            )}
          </div>

          {/* ********************************** Action Buttons ****************************************** */}
          {isFileLoaded && !error && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={onPreview}
                disabled={isProcessing}
                className="flex-1 bg-[#0256b1] hover:bg-[#01448e] text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-blue-900/10 text-sm disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Preview Data"}
              </button>
              <button
                onClick={onGenerate}
                disabled={isProcessing}
                className="flex-1 border-2 border-[#0256b1] text-[#0256b1] hover:bg-[#0256b1] hover:text-white font-semibold px-4 py-3 rounded-xl transition-all text-sm disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Generate PDF"}
              </button>
              <button
                onClick={onClear}
                className="text-slate-400 hover:text-red-600 text-sm px-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ********************************** Premium Format & Setup Guide Modal ****************************************** */}
      {showGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="format-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_150ms_ease-out]"
        >
          {/* Backdrop with backdrop blur */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
            onClick={closeGuide}
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-[popIn_180ms_ease-out]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 id="format-guide-title" className="text-base font-bold tracking-tight">
                    Quick Start & Setup Guide
                  </h4>
                  <p className="text-xs text-slate-400">Configure your system and Excel format for optimal results</p>
                </div>
              </div>
              <button
                onClick={closeGuide}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 pt-3 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("branding")}
                className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all ${
                  activeTab === "branding"
                    ? "bg-white text-[#0256b1] border-t-2 border-[#0256b1] shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                }`}
              >
                <Building2 className="w-4 h-4" />
                1. School Setup & Branding
                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold ml-1">
                  Start Here
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("format")}
                className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all ${
                  activeTab === "format"
                    ? "bg-white text-[#0256b1] border-t-2 border-[#0256b1] shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                2. Excel File Rules
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="px-6 py-6 overflow-y-auto space-y-6 text-xs text-slate-600">
              
              {/* TAB 1: SCHOOL SETUP & BRANDING */}
              {activeTab === "branding" && (
                <div className="space-y-5 animate-[fadeIn_150ms_ease-out]">
                  
                  {/* Callout Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 rounded-2xl p-4 flex gap-3 items-start">
                    <Info className="w-5 h-5 text-[#0256b1] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-xs">Where do I set my school logo and details?</p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Navigate to the <strong className="text-slate-900">Settings Page</strong> using the sidebar menu. All customization settings are automatically embedded into your generated PDF report cards.
                      </p>
                    </div>
                  </div>

                  {/* Settings Breakdown Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Card 1: School Identity */}
                    <div className="border border-slate-200/80 bg-white rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0256b1] flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        School Identity Tab
                      </div>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">School Name & Address:</strong> Displayed on header.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">School Logo:</strong> Upload PNG/JPG image & pick alignment (Left/Center/Right).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Signatures:</strong> Upload Principal & Teacher digital signatures.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Card 2: Academic Configuration */}
                    <div className="border border-slate-200/80 bg-white rounded-2xl p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Sliders className="w-4 h-4" />
                        </div>
                        Academic Config Tab
                      </div>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Passing Threshold %:</strong> Default is set to 33%.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Exam Title:</strong> E.g., "Final Examination 2024".</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-800">Template Layout:</strong> Pick from Standard, Modern, Narrative, or Colorful.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Visual Roadmap */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <p className="font-bold text-slate-800">3-Step Quick Setup Process:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                      <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0256b1] font-bold mx-auto mb-1 flex items-center justify-center text-xs">1</div>
                        <p className="font-bold text-slate-800">Go to Settings</p>
                        <p className="text-[11px] text-slate-400">Click Settings in left sidebar</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0256b1] font-bold mx-auto mb-1 flex items-center justify-center text-xs">2</div>
                        <p className="font-bold text-slate-800">Upload Assets</p>
                        <p className="text-[11px] text-slate-400">Add Logo & Signatures</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0256b1] font-bold mx-auto mb-1 flex items-center justify-center text-xs">3</div>
                        <p className="font-bold text-slate-800">Click Save</p>
                        <p className="text-[11px] text-slate-400">Save preferences permanently</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EXCEL FORMAT RULES */}
              {activeTab === "format" && (
                <div className="space-y-5 animate-[fadeIn_150ms_ease-out]">
                  <p className="text-slate-600">
                    Your file needs a simple header row with column titles and one row per student. The system automatically detects marks and calculates totals.
                  </p>

                  {/* Column Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
                      <div className="flex items-center gap-2 font-bold text-slate-800 mb-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Recommended Columns
                      </div>
                      <ul className="space-y-1.5 text-slate-700">
                        <li>• <code className="text-[#0256b1] font-bold">Name</code> — Student full name</li>
                        <li>• <code className="text-[#0256b1] font-bold">Roll No</code> — Roll/Registration ID</li>
                        <li>• <code className="text-[#0256b1] font-bold">Class</code> — Class/Grade</li>
                        <li>• <code className="text-[#0256b1] font-bold">Section</code> — Section (Optional)</li>
                        <li>• <code className="text-[#0256b1] font-bold">Father Name</code> — Parent name (Optional)</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4">
                      <div className="flex items-center gap-2 font-bold text-slate-800 mb-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Auto-Detected Calculations
                      </div>
                      <ul className="space-y-1.5 text-slate-700">
                        <li>• <strong>Subject Columns:</strong> Any numeric column becomes a subject</li>
                        <li>• <strong>Ignored Columns:</strong> Sr No, Rank, Total, %, Status (we recalculate these)</li>
                        <li>• <strong>Max Marks:</strong> Parsed from header e.g. <code className="bg-emerald-100/80 px-1 rounded">Math (100)</code></li>
                      </ul>
                    </div>
                  </div>

                  {/* Rules list */}
                  <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
                    <p className="font-bold text-slate-800">Formatting Rules</p>
                    <ul className="space-y-1.5 text-slate-600">
                      <li>• Header row can start at any row; title rows above it are completely fine.</li>
                      <li>• First student record must come <strong>immediately</strong> after the header row.</li>
                      <li>• Marks must be numeric (e.g. <code>85</code> or <code>85/100</code>). Empty cells are treated as N/A.</li>
                    </ul>
                  </div>

                  {/* Sample Table */}
                  <div>
                    <p className="font-bold text-slate-800 mb-2">Example Spreadsheet Layout</p>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                      <table className="text-xs w-full text-left border-collapse">
                        <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2.5">Roll No</th>
                            <th className="px-3 py-2.5">Name</th>
                            <th className="px-3 py-2.5">Class</th>
                            <th className="px-3 py-2.5">Math (100)</th>
                            <th className="px-3 py-2.5">Science (100)</th>
                            <th className="px-3 py-2.5">English (100)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="px-3 py-2">101</td>
                            <td className="px-3 py-2 font-medium text-slate-900">Ayesha Khan</td>
                            <td className="px-3 py-2">Class 5</td>
                            <td className="px-3 py-2 text-emerald-600 font-medium">92</td>
                            <td className="px-3 py-2 text-emerald-600 font-medium">88</td>
                            <td className="px-3 py-2 text-emerald-600 font-medium">95</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2">102</td>
                            <td className="px-3 py-2 font-medium text-slate-900">Bilal Ahmed</td>
                            <td className="px-3 py-2">Class 5</td>
                            <td className="px-3 py-2 text-slate-600">78</td>
                            <td className="px-3 py-2 text-slate-600">82</td>
                            <td className="px-3 py-2 text-slate-600">69</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onDownloadSample?.();
                }}
                className="flex items-center gap-2 text-[#0256b1] hover:text-[#01448e] text-xs font-bold"
              >
                <Download className="w-4 h-4" />
                Download Sample Excel
              </button>
              
              <button
                type="button"
                onClick={closeGuide}
                className="bg-[#0256b1] hover:bg-[#01448e] text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-900/10"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
      `}</style>
    </>
  );
}