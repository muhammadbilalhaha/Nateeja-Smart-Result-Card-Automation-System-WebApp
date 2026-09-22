"use client";

// ********************************** Library Imports ******************************************
import React from "react";

export default function ProgressBar({ percentage, timeRemaining }) {
    // ********************************** Theme & Status Configuration ******************************************
    const primaryColor = "#0256b1";
    const isComplete = percentage >= 100;

    // ********************************** Component Render ******************************************
    return (
        <div className="w-full mb-6">
            {/* ********************************** Metadata Label Header ****************************************** */}
            <div className="flex justify-between items-center text-xs font-semibold tracking-wide mb-2.5">
                {/* Status Label */}
                <span className={isComplete ? "text-emerald-600 transition-colors" : "text-slate-700"}>
                    {isComplete ? "Processing Complete" : "Generating Result Cards"}
                </span>
                
                {/* Percentage & Time Display */}
                <span 
                    className="font-bold transition-all duration-300"
                    style={{ color: isComplete ? '#10b981' : primaryColor }}
                >
                    {isComplete 
                        ? "100%" 
                        : timeRemaining 
                            ? `Remaining: ~${timeRemaining}s (${percentage}%)` 
                            : `${percentage}%`
                    }
                </span>
            </div>

            {/* ********************************** Progress Track Bar ****************************************** */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/30">
                
                {/* ********************************** Dynamic Progress Fill ****************************************** */}
                <div 
                    className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                    style={{ 
                        width: `${percentage}%`,
                        backgroundColor: isComplete ? '#10b981' : primaryColor,
                        boxShadow: isComplete ? 'none' : '0 1px 4px rgba(2, 86, 177, 0.25)'
                    }}
                >
                    {/* ********************************** Shimmer Animation Effect ****************************************** */}
                    {!isComplete && (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
                    )}
                </div>

            </div>
        </div>
    );
}