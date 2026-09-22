"use client";

// ********************************** Library Imports ******************************************
import React from "react";
import { CheckCircle, Lightbulb } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function SidebarCards() {
    // ********************************** Router Hook ******************************************
    const router = useRouter();

    // ********************************** Component Render ******************************************
    return (
        <>
            {/* ********************************** Report Template Card ****************************************** */}
            <div className="bg-[#004282] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                <div>
                    <span className="text-[11px] font-bold tracking-widest text-blue-200 uppercase opacity-80">Report Template</span>
                    <div className="flex items-center gap-2 mt-2 mb-2">
                        <h3 className="text-3xl font-bold tracking-tight">Standard</h3>
                        <CheckCircle className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
                    </div>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                        Optimized for regional Ministry of Education requirements.
                    </p>
                </div>

                {/* ********************************** Change Template Button ****************************************** */}
                <button
                    onClick={() => router.push('/settings')}
                    className="w-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm py-3 rounded-xl transition-colors border border-white/10 mt-4"
                >
                    Change Template
                </button>
            </div>

            {/* ********************************** Pro Tip Card ****************************************** */}
            <div className="bg-[#eefcf3] border border-[#d1f4dc] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 bg-[#22c55e] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
                    <Lightbulb className="w-4 h-4" />
                </div>
                <div className="text-xs text-emerald-800 leading-relaxed">
                    <span className="font-bold block text-sm text-emerald-900 mb-1">Pro Tip</span>
                    Ensure your Excel file has columns for <strong>Name, Roll No, Class</strong> and subject marks for best results.
                </div>
            </div>
        </>
    );
}