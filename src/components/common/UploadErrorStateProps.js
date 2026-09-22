"use client";

// ********************************** Library Imports ******************************************
import React from "react";
import { Check, FileUp, Settings, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

// ********************************** Steps Configuration ******************************************
const steps = [
    {
        id: 1,
        title: "Upload Excel File",
        description: "Select your student marks data file (.xlsx or .xls)",
        icon: FileUp,
        route: "/",
    },
    {
        id: 2,
        title: "Configure Settings",
        description: "Customize school info, logo, template & grading",
        icon: Settings,
        route: "/settings",
    },
    {
        id: 3,
        title: "Preview & Verify",
        description: "Review student data before generating cards",
        icon: Eye,
        route: "/preview",
    },
    {
        id: 4,
        title: "Generate Results",
        description: "Create professional result cards in PDF",
        icon: FileText,
        route: "/generate",
    }
];

export default function CenterStepGuide({ currentStep, onStepClick }) {
    // ********************************** Router Hook ******************************************
    const router = useRouter();

    // ********************************** Step Click Handler ******************************************
    const handleStepClick = (step) => {
        if (step.route) {
            router.push(step.route);
        }
        if (onStepClick) onStepClick(step);
    };

    // ********************************** Progress Height Calculation ******************************************
    const getProgressHeight = () => {
        if (currentStep === 1) return '0%';
        if (currentStep === 2) return '33%';
        if (currentStep === 3) return '66%';
        return '100%';
    };

    // ********************************** Component Render ******************************************
    return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8 sm:p-12 bg-gradient-to-b from-white to-slate-50/40 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/40">
            
            {/* ********************************** Header Section ****************************************** */}
            <div className="text-center mb-16 max-w-xl mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50/60 px-3 py-1 rounded-full mb-3 inline-block">
                    Workflow Architecture
                </span>
                <h2 className="text-3xl font-semibold text-slate-900 tracking-tight sm:text-4xl">
                    How it works
                </h2>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-sm mx-auto">
                    Follow our streamlined process to configure, verify, and generate executive-ready student portfolios.
                </p>
            </div>

            {/* ********************************** Timeline Container ****************************************** */}
            <div className="relative w-full max-w-2xl flex flex-col items-center">
                
                {/* ********************************** Background Line Track ****************************************** */}
                <div className="absolute left-[28px] sm:left-1/2 top-6 bottom-6 w-[1px] bg-slate-200/80 -translate-x-1/2 z-0" />
                
                {/* ********************************** Progress Filler Line ****************************************** */}
                <div 
                    className="absolute left-[28px] sm:left-1/2 top-6 w-[1px] bg-gradient-to-b from-emerald-500 via-indigo-600 to-indigo-400 -translate-x-1/2 z-0 transition-all duration-700 ease-in-out"
                    style={{ height: getProgressHeight() }}
                />

                {/* ********************************** Step Items ****************************************** */}
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const Icon = step.icon;

                    return (
                        <div 
                            key={step.id} 
                            className={`relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between mb-12 last:mb-0 transition-all duration-500 ${
                                isActive ? "scale-[1.01]" : "opacity-70 hover:opacity-100"
                            }`}
                        >
                            {/* ********************************** Desktop - Left Phase Details ****************************************** */}
                            <div className="hidden sm:block w-[40%] text-right pr-8 transition-colors duration-300">
                                <span 
                                    className={`text-[10px] font-bold uppercase tracking-[0.15em] block transition-colors duration-300 ${
                                        isCompleted ? "text-emerald-600" : isActive ? "text-indigo-600" : "text-slate-400"
                                    }`}
                                >
                                    Phase 0{step.id}
                                </span>
                                <h4 className={`text-base font-medium mt-1 transition-colors duration-300 ${
                                    isActive ? "text-slate-950 font-semibold" : "text-slate-600"
                                }`}>
                                    {step.title}
                                </h4>
                            </div>

                            {/* ********************************** Center - Interactive Badge Node ****************************************** */}
                            <button
                                onClick={() => handleStepClick(step)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 z-10 active:scale-95 border cursor-pointer focus:outline-none ${
                                    isCompleted
                                        ? "bg-white text-emerald-600 border-emerald-200 shadow-md shadow-emerald-100/40 hover:border-emerald-300"
                                        : isActive
                                        ? "bg-slate-950 text-white border-slate-900 shadow-xl shadow-slate-950/20 ring-4 ring-slate-950/10"
                                        : "bg-white text-slate-400 border-slate-200/80 hover:border-slate-300 hover:text-slate-700 shadow-sm"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check size={18} strokeWidth={3} className="animate-fade-in" />
                                ) : (
                                    <Icon 
                                        size={18} 
                                        strokeWidth={isActive ? 2.25 : 1.75} 
                                    />
                                )}
                            </button>

                            {/* ********************************** Right - Step Description ****************************************** */}
                            <div className="w-full sm:w-[40%] pl-16 sm:pl-8 pt-2 sm:pt-0">
                                {/* Mobile-only Phase Tag */}
                                <span 
                                    className={`text-[9px] font-bold uppercase tracking-[0.15em] inline-flex items-center gap-1.5 sm:hidden px-2 py-0.5 rounded mb-1 transition-colors duration-300 ${
                                        isCompleted ? "text-emerald-600 bg-emerald-50" : isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-400 bg-slate-50"
                                    }`}
                                >
                                    Phase 0{step.id} {isActive && <span className="w-1 h-1 rounded-full bg-indigo-600 animate-pulse" />}
                                </span>
                                {/* Mobile-only Title */}
                                <h4 className={`text-base font-medium sm:hidden transition-colors duration-300 ${
                                    isActive ? "text-slate-950 font-semibold" : "text-slate-700"
                                }`}>
                                    {step.title}
                                </h4>
                                
                                {/* Description */}
                                <p className={`text-sm mt-1 sm:mt-0 leading-relaxed transition-colors duration-300 ${
                                    isActive ? "text-slate-600" : "text-slate-400"
                                }`}>
                                    {step.description}
                                </p>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}