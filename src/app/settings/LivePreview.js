"use client";

// ********************************** Library Imports ******************************************
import { useState, useEffect, useMemo } from "react";
import { Eye } from "lucide-react";

// ********************************** Utility Imports ******************************************
import { generateResultCardHTML } from "@/utils/resultCardTemplate";

const LivePreview = ({ schoolName, academicYear, selectedTemplate, schoolAddress, logo, logoPosition, passingPercentage, examType }) => {
    // ********************************** State Management ******************************************
    const [principalSign, setPrincipalSign] = useState(null);
    const [teacherSign, setTeacherSign] = useState(null);
    const [schoolEmail, setSchoolEmail] = useState("");
    const [schoolPhone, setSchoolPhone] = useState("");
    const [schoolWebsite, setSchoolWebsite] = useState("");
    const [mounted, setMounted] = useState(false);

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('schoolSettings') || '{}');
            setPrincipalSign(saved.principalSign || null);
            setTeacherSign(saved.teacherSign || null);
            setSchoolEmail(saved.schoolEmail || "");
            setSchoolPhone(saved.schoolPhone || "");
            setSchoolWebsite(saved.schoolWebsite || "");
        } catch {
            setPrincipalSign(null);
            setTeacherSign(null);
        }
        setMounted(true);
    }, []);

    // ********************************** Sample Student Data ******************************************
    const sampleStudent = {
        name: "Sample Student",
        rollNo: "2024-001",
        className: "Grade 10-A",
        fatherName: "Mr. Sample Father",
        subjects: [
            { name: "Mathematics", obtainedMarks: 85, maxMarks: 100, percentage: "85.00" },
            { name: "Science", obtainedMarks: 78, maxMarks: 100, percentage: "78.00" },
            { name: "English", obtainedMarks: 92, maxMarks: 100, percentage: "92.00" },
        ],
        totalObtained: 255,
        totalMarks: 300,
        percentage: "85.00",
        grade: "A",
        status: "PASS",
        rank: 1,
        position: 1,
        totalStudents: 35
    };

    // ********************************** Preview HTML Generation ******************************************
    const previewHTML = useMemo(() => {
        if (!mounted) return '<div style="padding:20px;text-align:center;color:#94a3b8;">Loading preview...</div>';
        return generateResultCardHTML(sampleStudent, {
            selectedTemplate: selectedTemplate || "standard",
            schoolName: schoolName || "Your School Name",
            schoolAddress: schoolAddress || "School Address",
            schoolLogo: logo || null,
            logoPosition: logoPosition || "center",
            academicYear: academicYear || "2024-2025",
            examType: examType || "Final Examination",
            passingPercentage: passingPercentage || 33,
            principalSign: principalSign,
            teacherSign: teacherSign,
            schoolEmail: schoolEmail,
            schoolPhone: schoolPhone,
            schoolWebsite: schoolWebsite,
            subjectsToFail: 1,
        });
    }, [mounted, schoolName, academicYear, selectedTemplate, schoolAddress, logo, logoPosition, passingPercentage, examType, principalSign, teacherSign, schoolEmail, schoolPhone, schoolWebsite]);

    // ********************************** Template Name Mapping ******************************************
    const templateNames = {
        standard: "Standard Academic",
        narrative: "Narrative Format",
        modern: "Modern Grid",
        colorful: "Colorful Kids",
    };

    // ********************************** Signature Check ******************************************
    const hasSignatures = principalSign || teacherSign;

    // ********************************** Component Render ******************************************
    return (
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col max-h-[calc(100vh-8rem)]">
            {/* ********************************** Header ****************************************** */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 flex-shrink-0">
                <Eye size={16} className="text-slate-500" />
                <h3 className="font-semibold text-slate-800 text-sm">Live Preview</h3>
                <span className="text-[10px] text-slate-400 ml-auto bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                    {templateNames[selectedTemplate] || "Standard"}
                </span>
            </div>

            {/* ********************************** Preview Content ****************************************** */}
            <div className="flex-1 overflow-hidden bg-slate-50/50 p-3">
                <div className="transform scale-[0.60] origin-top-left" style={{ width: '250%', height: '250%' }}>
                    <div className="bg-white shadow-sm" style={{ width: '794px' }}
                        dangerouslySetInnerHTML={{ __html: previewHTML }} />
                </div>
            </div>

            {/* ********************************** Footer Info ****************************************** */}
            <div className="px-5 py-2.5 border-t border-slate-100 flex-shrink-0 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-1">
                <span>Template: <span className="font-medium text-slate-600 capitalize">{selectedTemplate}</span></span>
                {logo && <span>Logo: <span className="font-medium text-slate-600 capitalize">{logoPosition}</span></span>}
                {hasSignatures && <span className="text-[#0256b1] font-medium">Signatures added</span>}
            </div>
        </div>
    );
};

export default LivePreview;