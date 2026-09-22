"use client";

// ********************************** Library Imports ******************************************
import { useState, useEffect } from "react";

// ********************************** Component Imports ******************************************
import SchoolIdentity from "./SchoolIdentity";
import AcademicConfig from "./AcademicConfig";
import SaveSettings from "./SaveSettings";
import LivePreview from "./LivePreview";

// ********************************** Hook Imports ******************************************
import { useSchoolSettings } from "@/hooks/useSchoolSettings";

export default function SettingsPage() {
    // ********************************** Custom Hook ******************************************
    const { settings, updateSettings, resetSettings } = useSchoolSettings();

    // ********************************** State Management ******************************************
    const [schoolName, setSchoolName] = useState("The Ideal Educational Academy");
    const [academicYear, setAcademicYear] = useState("2023-2024");
    const [schoolAddress, setSchoolAddress] = useState("Karachi Landhi");
    const [selectedTemplate, setSelectedTemplate] = useState("standard");
    const [logo, setLogo] = useState(null);
    const [logoPosition, setLogoPosition] = useState("center");
    const [passingPercentage, setPassingPercentage] = useState(33);
    const [examType, setExamType] = useState("Final Examination");
    const [subjectsToFail, setSubjectsToFail] = useState(1);
    const [principalSign, setPrincipalSign] = useState(null);
    const [teacherSign, setTeacherSign] = useState(null);
    const [schoolEmail, setSchoolEmail] = useState("");
    const [schoolPhone, setSchoolPhone] = useState("");
    const [schoolWebsite, setSchoolWebsite] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        setSchoolName(settings.schoolName || "The Ideal Educational Academy");
        setAcademicYear(settings.academicYear || "2023-2024");
        setSchoolAddress(settings.schoolAddress || "Karachi Landhi");
        setSelectedTemplate(settings.selectedTemplate || "standard");
        setLogo(settings.logo || null);
        setLogoPosition(settings.logoPosition || "center");
        setPassingPercentage(settings.passingPercentage || 33);
        setExamType(settings.examType || "Final Examination");
        setSubjectsToFail(settings.subjectsToFail || 1);
        setPrincipalSign(settings.principalSign || null);
        setTeacherSign(settings.teacherSign || null);
        setSchoolEmail(settings.schoolEmail || "");
        setSchoolPhone(settings.schoolPhone || "");
        setSchoolWebsite(settings.schoolWebsite || "");
    }, [settings]);

    // ********************************** Template Options ******************************************
    const templates = [
        { id: "standard", name: "Standard Academic" },
        { id: "narrative", name: "Narrative Format" },
        { id: "modern", name: "Modern Grid" },
        { id: "colorful", name: "Colorful Kids" },
    ];

    // ********************************** Save Settings Handler ******************************************
    const handleSaveSettings = () => {
        updateSettings({
            schoolName, academicYear, schoolAddress,
            selectedTemplate, logo, logoPosition,
            passingPercentage, examType, subjectsToFail,
            principalSign, teacherSign,
            schoolEmail, schoolPhone, schoolWebsite,
        });
        setSaveMessage("Settings saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
    };

    // ********************************** Reset Settings Handler ******************************************
    const handleResetToDefault = () => {
        resetSettings();
        setLogo(null); setLogoPosition("center");
        setPassingPercentage(33); setExamType("Final Examination"); setSubjectsToFail(1);
        setPrincipalSign(null); setTeacherSign(null);
        setSchoolEmail(""); setSchoolPhone(""); setSchoolWebsite("");
        setSaveMessage("Settings reset to default!");
        setTimeout(() => setSaveMessage(""), 3000);
    };

    // ********************************** Component Render ******************************************
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#f8fafc]">
            {/* ********************************** Save Confirmation Toast ****************************************** */}
            {saveMessage && (
                <div className="fixed top-4 right-4 z-50 bg-white border border-emerald-200 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">{saveMessage}</span>
                </div>
            )}
            
            {/* ********************************** Main Content ****************************************** */}
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto px-6 py-6">
                    {/* ********************************** Page Header ****************************************** */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Settings</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Configure school identity and report preferences</p>
                        </div>
                    </div>
                    
                    {/* ********************************** Settings Grid ****************************************** */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ********************************** Left Column - Forms ****************************************** */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* School Identity Section */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">School Identity</h3>
                                <SchoolIdentity 
                                    schoolName={schoolName} setSchoolName={setSchoolName}
                                    academicYear={academicYear} setAcademicYear={setAcademicYear}
                                    schoolAddress={schoolAddress} setSchoolAddress={setSchoolAddress}
                                    logo={logo} setLogo={setLogo} logoPosition={logoPosition} setLogoPosition={setLogoPosition}
                                    principalSign={principalSign} setPrincipalSign={setPrincipalSign}
                                    teacherSign={teacherSign} setTeacherSign={setTeacherSign}
                                    schoolEmail={schoolEmail} setSchoolEmail={setSchoolEmail}
                                    schoolPhone={schoolPhone} setSchoolPhone={setSchoolPhone}
                                    schoolWebsite={schoolWebsite} setSchoolWebsite={setSchoolWebsite}
                                />
                            </div>
                            
                            {/* Academic Configuration Section */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Academic Configuration</h3>
                                <AcademicConfig 
                                    selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                                    templates={templates} passingPercentage={passingPercentage} setPassingPercentage={setPassingPercentage}
                                    examType={examType} setExamType={setExamType} subjectsToFail={subjectsToFail} setSubjectsToFail={setSubjectsToFail} 
                                />
                            </div>
                            
                            {/* Save/Reset Buttons */}
                            <SaveSettings onSave={handleSaveSettings} onReset={handleResetToDefault} />
                        </div>
                        
                        {/* ********************************** Right Column - Live Preview ****************************************** */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-6">
                                <LivePreview 
                                    schoolName={schoolName} academicYear={academicYear}
                                    selectedTemplate={selectedTemplate} schoolAddress={schoolAddress}
                                    logo={logo} logoPosition={logoPosition} passingPercentage={passingPercentage} examType={examType} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}