"use client";

import React from "react";

export default function Loader({
    title = "Processing File...",
    subtitle = "Analyzing structural integrity and compiling student data matrices."
}) {
    const brandColor = "#0256b1";

    return (
        <div className="w-full p-6 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-center min-h-[450px] bg-gradient-to-b from-white to-slate-50/50 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/40">
                <div className="text-center max-w-sm mx-auto p-8 flex flex-col items-center animate-fade-in">

                    {/* Premium Minimalist Brand Color Spinner */}
                    <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                        {/* Outer structural ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />

                        {/* Dynamic spinning accent using theme #0256b1 */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                            style={{
                                borderTopColor: brandColor,
                                borderRightColor: "rgba(2, 86, 177, 0.25)"
                            }}
                        />

                        {/* Center core glow using theme #0256b1 */}
                        <div
                            className="w-2 h-2 rounded-full shadow-lg"
                            style={{
                                backgroundColor: brandColor,
                                boxShadow: "0 4px 12px rgba(2, 86, 177, 0.5)"
                            }}
                        />
                    </div>

                    {/* Sophisticated Micro-Copy mapped to theme colors */}
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block"
                        style={{ color: brandColor }}
                    >
                        System Pipeline
                    </span>

                    <h3 className="text-lg font-medium text-slate-900 tracking-tight">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed font-light">
                        {subtitle}
                    </p>

                </div>
            </div>
        </div>
    );
}