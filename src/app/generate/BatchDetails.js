"use client";

// ********************************** Library Imports ******************************************
import React from "react";

export default function BatchDetails({ details }) {
    // ********************************** Theme Color ******************************************
    const primaryColor = "#0256b1";

    // ********************************** Component Render ******************************************
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm w-full">
            {/* ********************************** Component Header ****************************************** */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                    Batch Executive Summary
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Overview of the processed institutional records dataset.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {/* ********************************** Hero Metric - Total Students ****************************************** */}
                <div 
                    className="p-5 rounded-xl flex flex-col justify-center border transition-all duration-200"
                    style={{ 
                        backgroundColor: 'rgba(2, 86, 177, 0.03)', 
                        borderColor: 'rgba(2, 86, 177, 0.12)' 
                    }}
                >
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Total Students Enrolled
                    </span>
                    <span 
                        className="text-3xl font-black mt-1 tracking-tight"
                        style={{ color: primaryColor }}
                    >
                        {details.totalStudents}
                    </span>
                </div>

                {/* ********************************** Secondary Metadata Grid ****************************************** */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-slate-100">
                    
                    {/* ********************************** Academic Term ****************************************** */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Academic Term
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                            {details.academicTerm}
                        </span>
                    </div>

                    {/* ********************************** Class Records ****************************************** */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Class Records
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                            {details.classRecords}
                        </span>
                    </div>

                    {/* ********************************** Output Format ****************************************** */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Output Format
                        </span>
                        <span className="text-sm font-semibold text-slate-700 capitalize">
                            {details.format}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}