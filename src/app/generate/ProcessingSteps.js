"use client";

// ********************************** Library Imports ******************************************
import React from "react";
import { Check, Loader2 } from "lucide-react";

export default function ProcessingSteps({ steps }) {
    // ********************************** Theme Color ******************************************
    const primaryColor = "#0256b1";

    // ********************************** Component Render ******************************************
    return (
        <div className="w-full">
            {/* ********************************** Component Header ****************************************** */}
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-5">
                Execution Pipeline
            </h3>
            
            {/* ********************************** Steps Flow Container ****************************************** */}
            <div className="relative flex flex-col gap-6 pl-2">
                {steps.map((step, idx) => {
                    const isCompleted = step.status === "completed";
                    const isProcessing = step.status === "processing";
                    const isPending = step.status === "pending";

                    return (
                        <div key={idx} className="relative flex items-center gap-4 group">
                            
                            {/* ********************************** Timeline Connector Line ****************************************** */}
                            {idx !== steps.length - 1 && (
                                <div 
                                    className={`absolute left-[11px] top-7 bottom-[-19px] w-0.5 transition-colors duration-300 ${
                                        isCompleted ? "bg-emerald-200" : "bg-slate-100"
                                    }`} 
                                />
                            )}

                            {/* ********************************** Status Indicator Icon ****************************************** */}
                            <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300">
                                {/* Completed State */}
                                {isCompleted ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm animate-fade-in">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                ) : isProcessing ? (
                                    // ********************************** Processing State ******************************************
                                    <div 
                                        className="w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-sm relative"
                                        style={{ borderColor: primaryColor }}
                                    >
                                        <Loader2 
                                            size={12} 
                                            className="animate-spin" 
                                            style={{ color: primaryColor }} 
                                            strokeWidth={2.5}
                                        />
                                        {/* Pulsing Glow Effect */}
                                        <div 
                                            className="absolute -inset-1 rounded-full opacity-20 animate-ping"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                    </div>
                                ) : (
                                    // ********************************** Pending State ******************************************
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 bg-white" />
                                )}
                            </div>

                            {/* ********************************** Step Description Text ****************************************** */}
                            <div className="flex flex-col">
                                <span 
                                    className={`text-sm font-semibold transition-colors duration-200 ${
                                        isCompleted 
                                            ? "text-slate-500 decoration-slate-300" 
                                            : isProcessing 
                                                ? "text-slate-900" 
                                                : "text-slate-400"
                                    }`}
                                >
                                    {step.text}
                                </span>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}