"use client";

// ********************************** Library Imports ******************************************
import React, { useState } from "react";
import { Save, RotateCcw, Info, X, Heart, Code, Sparkles, CheckCircle2 } from "lucide-react";

// ********************************** About Modal Component ******************************************
const AboutModal = ({ isOpen, onClose }) => {
    // ********************************** Early Return - Modal Closed ******************************************
    if (!isOpen) return null;

    // ********************************** Feature List ******************************************
    const features = [
        "Excel automatic processing",
        "Adaptive result card generation",
        "Multiple customizable templates",
        "Professional PDF export",
        "Configurable passing criteria"
    ];

    // ********************************** Component Render ******************************************
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-[380px] overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-100 relative">
                
                {/* ********************************** Close Button ****************************************** */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-10 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <X size={16} className="stroke-[2.5]" />
                </button>

                {/* ********************************** Brand Header ****************************************** */}
                <div className="relative bg-gradient-to-br from-[#0256b1] to-[#013a7a] px-6 pt-8 pb-12 text-center overflow-hidden">
                    {/* Background glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">Nateeja</h2>
                        <p className="text-[11px] font-medium text-blue-200 uppercase tracking-widest">Smart Report Cards</p>
                    </div>
                </div>

                {/* ********************************** Content Area ****************************************** */}
                <div className="px-6 pb-6 relative -mt-8">
                    
                    {/* ********************************** Floating Logo Icon ****************************************** */}
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-lg shadow-slate-900/10 border border-slate-100 flex items-center justify-center mb-4 transform transition-transform hover:scale-105">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Sparkles size={24} className="text-[#0256b1] stroke-[2]" />
                        </div>
                    </div>

                    {/* ********************************** Description ****************************************** */}
                    <p className="text-xs text-slate-500 text-center leading-relaxed mb-6 px-2">
                        A modern, web-based automation system designed to instantly transform raw spreadsheet data into beautiful, printable student result cards.
                    </p>

                    {/* ********************************** Tech & Love Badges ****************************************** */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center">
                            <Code size={16} className="text-indigo-500 mb-1.5" />
                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">Built With</p>
                            <p className="text-[10px] text-slate-500">Next.js & Tailwind</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center">
                            <Heart size={16} className="text-rose-500 mb-1.5" />
                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">Made For</p>
                            <p className="text-[10px] text-slate-500">Modern Educators</p>
                        </div>
                    </div>

                    {/* ********************************** Feature List ****************************************** */}
                    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm shadow-slate-100/50">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Core Features</h3>
                        <ul className="space-y-2">
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2.5">
                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                    <span className="text-[11px] font-semibold text-slate-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ********************************** Footer ****************************************** */}
                    <div className="mt-5 text-center">
                        <p className="text-[10px] font-semibold text-slate-400">Made by Muhammad Bilal</p>
                        <p className="text-[10px] font-semibold text-slate-400">
                            Version 1.0 <span className="mx-1.5 text-slate-200">•</span> &copy; {new Date().getFullYear()} Nateeja
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ********************************** SaveSettings Component ******************************************
const SaveSettings = ({ onSave, onReset }) => {
    // ********************************** State Management ******************************************
    const [showAbout, setShowAbout] = useState(false);

    // ********************************** Component Render ******************************************
    return (
        <>
            {/* ********************************** Action Bar ****************************************** */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-5 mt-2 border-t border-slate-100">
                
                {/* ********************************** Left - About Link & Info ****************************************** */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAbout(true)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#0256b1] transition-colors bg-slate-50 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-slate-100 hover:border-blue-200"
                    >
                        <Info className="w-3.5 h-3.5" />
                        About Nateeja
                    </button>
                    <span className="hidden sm:block text-slate-200">|</span>
                    <p className="hidden sm:block text-[11px] font-medium text-slate-400">
                        Changes apply to all future report cards.
                    </p>
                </div>

                {/* ********************************** Right - Action Buttons ****************************************** */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {/* Reset Button */}
                    <button
                        onClick={onReset}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all border border-blue-200/80 text-[#0256b1] bg-blue-50/30 hover:bg-blue-50 hover:border-blue-300 active:scale-[0.98]"
                    >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        Reset
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={onSave}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 text-xs font-bold rounded-xl transition-all text-white bg-[#0256b1] hover:bg-[#01448e] shadow-sm shadow-blue-500/20 active:scale-[0.98]"
                    >
                        <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                        Save Settings
                    </button>
                </div>
            </div>

            {/* ********************************** About Modal ****************************************** */}
            <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
        </>
    );
};

export default SaveSettings;