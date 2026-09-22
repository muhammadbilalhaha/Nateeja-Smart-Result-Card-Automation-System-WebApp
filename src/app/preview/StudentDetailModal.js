"use client";

// ********************************** Library Imports ******************************************
import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Download, Printer } from "lucide-react";
import { generateResultCardHTML } from "@/utils/resultCardTemplate";
import { generateCombinedPDF } from "@/utils/pdfGenerator";

// ********************************** Read Settings Helper ******************************************
const getSettingsFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem('schoolSettings') || '{}');
    } catch {
        return {};
    }
};

export default function StudentDetailModal({ student, isOpen, onClose, passingPercentage = 33 }) {
    // ********************************** State ******************************************
    const [isDownloading, setIsDownloading] = useState(false);

    // ********************************** Early Return - Modal Closed ******************************************
    if (!isOpen || !student) return null;

    // ********************************** Status Check ******************************************
    const isPassed = student.status === "PASS";

    // ********************************** Rank Indicator Component ******************************************
    const RankIndicator = ({ rank }) => {
        if (!rank) return null;
        
        if (rank === 1) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">1st Place</span>;
        if (rank === 2) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300">2nd Place</span>;
        if (rank === 3) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">3rd Place</span>;
        
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Rank {rank}</span>;
    };

    // ********************************** Handle Individual PDF Download ******************************************
    const handleDownloadSinglePDF = async () => {
        setIsDownloading(true);
        try {
            const settings = getSettingsFromStorage();
            const schoolInfo = {
                selectedTemplate: settings.selectedTemplate || "standard",
                schoolName: settings.schoolName || "Your School Name",
                schoolAddress: settings.schoolAddress || "School Address",
                schoolLogo: settings.logo || null,
                logoPosition: settings.logoPosition || "center",
                academicYear: settings.academicYear || "2024-2025",
                examType: settings.examType || "Final Examination",
                passingPercentage: settings.passingPercentage || 33,
                subjectsToFail: settings.subjectsToFail || 1,
                principalSign: settings.principalSign || null,
                teacherSign: settings.teacherSign || null,
                schoolEmail: settings.schoolEmail || "",
                schoolPhone: settings.schoolPhone || "",
                schoolWebsite: settings.schoolWebsite || "",
            };
            
            // Generate PDF for single student
            await generateCombinedPDF([student], schoolInfo, generateResultCardHTML);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // ********************************** Handle Individual Print ******************************************
    const handlePrintSingle = () => {
        const settings = getSettingsFromStorage();
        const schoolInfo = {
            selectedTemplate: settings.selectedTemplate || "standard",
            schoolName: settings.schoolName || "Your School Name",
            schoolAddress: settings.schoolAddress || "School Address",
            schoolLogo: settings.logo || null,
            logoPosition: settings.logoPosition || "center",
            academicYear: settings.academicYear || "2024-2025",
            examType: settings.examType || "Final Examination",
            passingPercentage: settings.passingPercentage || 33,
            subjectsToFail: settings.subjectsToFail || 1,
            principalSign: settings.principalSign || null,
            teacherSign: settings.teacherSign || null,
            schoolEmail: settings.schoolEmail || "",
            schoolPhone: settings.schoolPhone || "",
            schoolWebsite: settings.schoolWebsite || "",
        };
        
        // Open print window with single student's card
        const cardHTML = generateResultCardHTML(student, schoolInfo);
        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Result Card - ${student.name}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; background: white; }
                    @media print { @page { size: A4; margin: 0; } }
                </style>
            </head>
            <body>${cardHTML}</body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    // ********************************** Component Render ******************************************
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Wider, ultra-compact container */}
            <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl shadow-slate-900/20 flex flex-col border border-slate-200">
                
                {/* ********************************** Modal Header ****************************************** */}
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Compact Status Icon */}
                        {isPassed ? (
                            <CheckCircle2 size={24} className="text-emerald-500 stroke-[2.5]" />
                        ) : (
                            <AlertCircle size={24} className="text-rose-500 stroke-[2.5]" />
                        )}
                        
                        {/* ********************************** Student Info ****************************************** */}
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-slate-900 leading-tight">{student.name}</h3>
                                <RankIndicator rank={student.position || student.rank} />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                {student.fatherName && (
                                    <>
                                        <span className="font-medium">D/O, S/O: <span className="text-slate-800">{student.fatherName}</span></span>
                                        <span className="text-slate-300">•</span>
                                    </>
                                )}
                                <span className="font-medium">Roll No: <span className="text-slate-800">{student.rollNo}</span></span>
                                <span className="text-slate-300">•</span>
                                <span className="font-medium">Class: <span className="text-slate-800">{student.className || 'N/A'}</span></span>
                            </div>
                        </div>
                    </div>
                    
                    {/* ********************************** Action Buttons + Close ****************************************** */}
                    <div className="flex items-center gap-2">
                        {/* Download Single PDF Button */}
                        <button
                            onClick={handleDownloadSinglePDF}
                            disabled={isDownloading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                            title="Download PDF"
                        >
                            <Download size={14} />
                            {isDownloading ? '...' : 'PDF'}
                        </button>
                        
                        {/* Print Single Card Button */}
                        <button
                            onClick={handlePrintSingle}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 text-[11px] font-medium rounded border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                            title="Print"
                        >
                            <Printer size={14} />
                            Print
                        </button>
                        
                        <div className="w-px h-5 bg-slate-200 mx-1"></div>

                        {/* Close Button */}
                        <button 
                            onClick={onClose} 
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        >
                            <X size={16} className="stroke-[2.5]" />
                        </button>
                    </div>
                </div>

                {/* ********************************** Modal Content Body ****************************************** */}
                <div className="p-0 flex flex-col">
                    
                    {/* ********************************** Micro-Stats Grid (Inline Strip) ****************************************** */}
                    <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-slate-100 text-sm">
                        <div className="flex gap-6">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-2">Marks</span>
                                <span className="font-bold text-slate-800">{student.totalObtained} <span className="text-slate-400 text-xs">/ {student.totalMarks}</span></span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-2">Percentage</span>
                                <span className={`font-bold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>{student.percentage}%</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mr-2">Grade</span>
                                <span className="font-bold text-slate-800">{student.grade}</span>
                            </div>
                        </div>
                        <div>
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border ${
                                isPassed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {isPassed ? 'PASSED' : 'FAILED'}
                            </span>
                        </div>
                    </div>

                    {/* ********************************** Subject Breakdown Table ****************************************** */}
                    <div className="bg-white overflow-hidden rounded-b-xl">
                        <table className="w-full text-left border-collapse">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="py-2 px-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-1/3">Subject</th>
                                    <th className="py-2 px-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Max Marks</th>
                                    <th className="py-2 px-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Obtained</th>
                                    <th className="py-2 px-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Percent</th>
                                    <th className="py-2 px-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right w-24">Status</th>
                                </tr>
                            </thead>
                            {/* Table Body - Dense rows to prevent scrolling */}
                            <tbody className="divide-y divide-slate-100 text-[13px]">
                                {student.subjects.map((subject, idx) => {
                                    const subPassed = parseFloat(subject.percentage) >= passingPercentage;
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-1.5 px-5 font-medium text-slate-800">{subject.name}</td>
                                            <td className="py-1.5 px-5 text-center text-slate-500">{subject.maxMarks}</td>
                                            <td className={`py-1.5 px-5 text-center font-semibold ${subPassed ? 'text-slate-800' : 'text-rose-600'}`}>
                                                {subject.obtainedMarks}
                                            </td>
                                            <td className="py-1.5 px-5 text-center">
                                                <span className={`${subPassed ? 'text-slate-600' : 'text-rose-600'}`}>
                                                    {subject.percentage}%
                                                </span>
                                            </td>
                                            <td className="py-1.5 px-5 text-right">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    subPassed ? 'text-emerald-600 bg-emerald-50/50' : 'text-rose-600 bg-rose-50/50'
                                                }`}>
                                                    {subPassed ? 'Passed' : 'Failed'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}