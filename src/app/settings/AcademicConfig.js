"use client";

// ********************************** Library Imports ******************************************
import React from "react";
import { LayoutTemplate, GraduationCap, Percent, AlertTriangle } from "lucide-react";

const AcademicConfig = ({ 
    selectedTemplate, setSelectedTemplate, templates,
    passingPercentage, setPassingPercentage,
    examType, setExamType,
    subjectsToFail, setSubjectsToFail
}) => {
    // ********************************** Theme Color ******************************************
    const primaryColor = "#0256b1";
    
    // ********************************** Constants ******************************************
    const quickOptions = [33, 40, 50];
    const examTypes = ["Final Examination", "Mid Term", "Pre-Board", "Unit Test", "Annual Exam"];

    // ********************************** Passing Percentage Handler ******************************************
    const handlePassingChange = (value) => {
        setPassingPercentage(value);
        try {
            const currentSettings = JSON.parse(localStorage.getItem('schoolSettings') || '{}');
            currentSettings.passingPercentage = value;
            localStorage.setItem('schoolSettings', JSON.stringify(currentSettings));
        } catch (e) {}
    };

    // ********************************** Component Render ******************************************
    return (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-1">
            <div className="divide-y divide-slate-100/80">
                
                {/* ********************************** Template Selection ****************************************** */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 transition-colors rounded-t-2xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <LayoutTemplate className="w-4 h-4" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800">Report Template</label>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Visual layout for grading grids</p>
                        </div>
                    </div>
                    
                    <div className="flex p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl overflow-x-auto hide-scrollbar">
                        {templates.map((template) => {
                            const isSelected = selectedTemplate === template.id;
                            return (
                                <button key={template.id} type="button" onClick={() => setSelectedTemplate(template.id)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                                        isSelected 
                                            ? "bg-white text-[#0256b1] shadow-sm border border-slate-200/50" 
                                            : "text-slate-500 hover:text-slate-700 border border-transparent"
                                    }`}>
                                    {template.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ********************************** Exam Type Selection ****************************************** */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-3 shrink-0">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800">Exam Type</label>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Header title for result cards</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-end gap-1.5">
                        {examTypes.map((type) => (
                            <button key={type} onClick={() => setExamType(type)}
                                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md transition-all border ${
                                    examType === type 
                                        ? "bg-[#0256b1] border-[#0256b1] text-white shadow-sm shadow-blue-500/20" 
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                                }`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ********************************** Passing Criteria ****************************************** */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-3 shrink-0">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                            <Percent className="w-4 h-4" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800">Passing Criteria</label>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Minimum score required</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Slider Control */}
                        <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                            <span className="text-sm font-extrabold text-[#0256b1] w-8 text-right">{passingPercentage}%</span>
                            <div className="w-px h-4 bg-slate-200" />
                            <input type="range" min="25" max="50" value={passingPercentage}
                                onChange={(e) => handlePassingChange(parseInt(e.target.value))}
                                className="w-24 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
                                style={{ accentColor: primaryColor }} />
                        </div>
                        
                        {/* Quick Select Buttons */}
                        <div className="hidden sm:flex gap-1">
                            {quickOptions.map((value) => (
                                <button key={value} onClick={() => handlePassingChange(value)}
                                    className={`w-9 h-8 text-[11px] font-bold rounded-lg transition-all border ${
                                        passingPercentage === value 
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                    }`}>
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ********************************** Promotion Rules ****************************************** */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50/50 transition-colors rounded-b-2xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-800">Promotion Rules</label>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                Fails overall if 
                                <span className="font-bold text-slate-600 mx-1">{subjectsToFail}</span> 
                                or more subjects failed
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex p-1 bg-slate-100/80 border border-slate-200/60 rounded-xl w-fit">
                        {[1, 2, 3].map((num) => (
                            <button key={num} onClick={() => setSubjectsToFail(num)}
                                className={`w-10 h-7 text-xs font-bold rounded-lg transition-all ${
                                    subjectsToFail === num
                                        ? "bg-white text-rose-600 shadow-sm border border-slate-200/50"
                                        : "text-slate-500 hover:text-slate-700 border border-transparent"
                                }`}>
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AcademicConfig;