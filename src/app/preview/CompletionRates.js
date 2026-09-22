"use client";

// ********************************** Library Imports ******************************************
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CompletionRates({ subjects, totalStudents }) {
    // ********************************** State Management ******************************************
    const [showAll, setShowAll] = useState(false);
    
    // ********************************** Theme Color ******************************************
    const primaryColor = "#0256b1";

    // ********************************** Empty State ******************************************
    if (!subjects || subjects.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
                <div className="text-center py-6">
                    <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">No Analytics Available</p>
                    <p className="text-slate-300 text-xs mt-1">Populate institutional records to display metrics.</p>
                </div>
            </div>
        );
    }

    // ********************************** Calculations ******************************************
    const studentTotal = totalStudents || (subjects.length > 0 ? subjects[0].totalStudents : 0);
    const avgStudentsPerSubject = subjects.length > 0 
        ? (subjects.reduce((sum, s) => sum + (s.totalStudents || studentTotal), 0) / subjects.length).toFixed(0)
        : 0;

    const displayedSubjects = showAll ? subjects : subjects.slice(0, 5);

    // ********************************** Component Render ******************************************
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm w-full">
            {/* ********************************** Header Section ****************************************** */}
            <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm tracking-tight">Subject Enrollment Matrices</h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Distribution allocation parameters per discipline track.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg self-start sm:self-center">
                        <span className="text-[11px] font-bold text-slate-500">{subjects.length} Course Fields</span>
                    </div>
                </div>
            </div>

            {/* ********************************** Subject List ****************************************** */}
            <div className="px-6 py-4 space-y-4">
                {displayedSubjects.map((subject, index) => {
                    const studentCount = subject.totalStudents || studentTotal;
                    const percentage = studentTotal > 0 ? (studentCount / studentTotal) * 100 : 0;
                    const average = subject.average || 0;

                    return (
                        <div key={index} className="group flex flex-col gap-1.5">
                            {/* ********************************** Subject Info Row ****************************************** */}
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-700 truncate max-w-[160px] group-hover:text-slate-900 transition-colors">
                                    {subject.name}
                                </span>
                                <div className="flex items-center gap-3 text-slate-400 font-medium">
                                    <span className="text-[11px]">
                                        {studentCount} / {studentTotal}
                                    </span>
                                    <span 
                                        className="w-10 text-right font-bold transition-colors"
                                        style={{ color: primaryColor }}
                                    >
                                        {average}%
                                    </span>
                                </div>
                            </div>

                            {/* ********************************** Progress Bar ****************************************** */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-90"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: primaryColor,
                                        boxShadow: '0 1px 2px rgba(2, 86, 177, 0.1)',
                                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
                
                {/* ********************************** Toggle Button ****************************************** */}
                {subjects.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 text-xs font-semibold rounded-xl border transition-all active:scale-[0.99]"
                        style={{
                            borderColor: 'rgba(2, 86, 177, 0.25)',
                            color: primaryColor,
                            backgroundColor: '#ffffff'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(2, 86, 177, 0.03)';
                            e.currentTarget.style.borderColor = primaryColor;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = 'rgba(2, 86, 177, 0.25)';
                        }}
                    >
                        {showAll ? (
                            <>
                                <ChevronUp size={13} strokeWidth={2.5} />
                                View Less Records
                            </>
                        ) : (
                            <>
                                <ChevronDown size={13} strokeWidth={2.5} />
                                View All ({subjects.length} Subjects)
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* ********************************** Footer Metrics ****************************************** */}
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col text-center sm:text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Class</span>
                        <span className="text-base font-black text-slate-800 mt-0.5">{studentTotal}</span>
                    </div>
                    <div className="flex flex-col text-center border-x border-slate-200/60 px-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disciplines</span>
                        <span className="text-base font-black text-slate-800 mt-0.5">{subjects.length}</span>
                    </div>
                    <div className="flex flex-col text-center sm:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mean Density</span>
                        <span className="text-base font-black text-slate-800 mt-0.5">{avgStudentsPerSubject}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}