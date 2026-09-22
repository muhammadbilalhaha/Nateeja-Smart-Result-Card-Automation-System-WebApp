"use client";

// ********************************** Library Imports ******************************************
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileDown, Eye, Printer, RefreshCw } from "lucide-react";

// ********************************** Utility Imports ******************************************
import { processExcelFile } from "@/utils/excelProcessor";
import { generateResultCardHTML } from "@/utils/resultCardTemplate";
import { generateCombinedPDF, printAllResultCards, previewResultCards } from "@/utils/pdfGenerator";
import { getSettingsFromStorage } from "./generateHelpers";

// ********************************** Component Imports ******************************************
import ProgressBar from "./ProgressBar";
import ProcessingSteps from "./ProcessingSteps";
import BatchDetails from "./BatchDetails";
import OptimizationTip from "./OptimizationTip";
import SuccessMessage from "./SuccessMessage";
import UploadErrorState from "@/components/common/UploadErrorStateProps";

export default function GeneratePage() {
    // ********************************** Router Hook ******************************************
    const router = useRouter();

    // ********************************** State Management ******************************************
    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");
    const [studentData, setStudentData] = useState(null);
    const [steps, setSteps] = useState([
        { text: "Reading Excel file...", status: "pending" },
        { text: "Processing student data...", status: "pending" },
        { text: "Calculating results...", status: "pending" },
        { text: "Generating result cards...", status: "pending" },
        { text: "Creating PDF file...", status: "pending" },
    ]);

    // ********************************** Refs ******************************************
    const hasGenerated = useRef(false);

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        const alreadyGenerated = sessionStorage.getItem('generationComplete');
        if (alreadyGenerated === 'true') {
            const savedData = sessionStorage.getItem('studentData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    setStudentData(parsedData);
                    setIsComplete(true);
                    setProgress(100);
                    setSteps(prev => prev.map(step => ({ ...step, status: "completed" })));
                    return;
                } catch (e) {
                    sessionStorage.removeItem('generationComplete');
                    sessionStorage.removeItem('studentData');
                }
            }
        }
        if (!hasGenerated.current) {
            const base64Data = sessionStorage.getItem('uploadedFileData');
            if (!base64Data) {
                setError("No file found. Please upload an Excel file first.");
                return;
            }
            hasGenerated.current = true;
            processFileAndGenerate();
        }
    }, []);

    // ********************************** Step Update Helper ******************************************
    const updateStep = (index, status) => {
        setSteps(prev => prev.map((step, i) => i === index ? { ...step, status } : step));
    };

    // ********************************** Base64 to ArrayBuffer Converter ******************************************
    const base64ToArrayBuffer = (base64) => {
        const binaryString = window.atob(base64.split(',')[1] || base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        return bytes.buffer;
    };

    // ********************************** School Info Getter ******************************************
    const getSchoolInfo = () => {
        const s = getSettingsFromStorage();
        console.log('Settings loaded:', s); // Debug
        return {
            selectedTemplate: s.selectedTemplate || "standard",
            schoolName: s.schoolName || "Your School Name",
            schoolAddress: s.schoolAddress || "123 Education Street, City",
            schoolLogo: s.logo || null,
            logoPosition: s.logoPosition || "center",
            academicYear: s.academicYear || "2024-2025",
            examType: s.examType || "Final Examination",
            passingPercentage: s.passingPercentage || 33,
            subjectsToFail: s.subjectsToFail || 1,
            principalSign: s.principalSign || null,
            teacherSign: s.teacherSign || null,
            schoolEmail: s.schoolEmail || "",
            schoolPhone: s.schoolPhone || "",
            schoolWebsite: s.schoolWebsite || "",
            stamps: s.stamps || [],
        };
    };

    // ********************************** Main Processing Function ******************************************
    const processFileAndGenerate = async () => {
        try {
            const base64Data = sessionStorage.getItem('uploadedFileData');
            if (!base64Data) { setError("No file found. Please upload an Excel file first."); return; }

            const savedSettings = getSettingsFromStorage();
            const schoolInfo = getSchoolInfo();

            updateStep(0, "processing"); setProgress(10); setCurrentStep(1);
            const arrayBuffer = base64ToArrayBuffer(base64Data);
            await new Promise(r => setTimeout(r, 500));
            updateStep(0, "completed"); setProgress(20);

            updateStep(1, "processing"); setCurrentStep(2);
            const passingPercentage = savedSettings.passingPercentage || 33;
            const subjectsToFail = savedSettings.subjectsToFail || 1;
            const data = await processExcelFile(arrayBuffer, { passingPercentage, subjectsToFail });
            setStudentData(data);
            updateStep(1, "completed"); setProgress(40);

            updateStep(2, "processing");
            await new Promise(r => setTimeout(r, 300));
            updateStep(2, "completed"); setProgress(60);

            updateStep(3, "processing"); setCurrentStep(4);
            await new Promise(r => setTimeout(r, 500));
            updateStep(3, "completed"); setProgress(80);

            updateStep(4, "processing"); setCurrentStep(5); setProgress(90);
            await generateCombinedPDF(data.students, schoolInfo, generateResultCardHTML);

            sessionStorage.setItem('generationComplete', 'true');
            sessionStorage.setItem('studentData', JSON.stringify(data));
            updateStep(4, "completed"); setProgress(100); setIsComplete(true); setCurrentStep(6);

        } catch (err) { setError(err.message); }
    };

    // ********************************** Navigation Handlers ******************************************
    const handleGoBack = () => router.push('/');

    const handleGenerateAgain = () => {
        sessionStorage.removeItem('uploadedFileData');
        sessionStorage.removeItem('uploadedFileName');
        sessionStorage.removeItem('generationComplete');
        sessionStorage.removeItem('studentData');
        hasGenerated.current = false;
        router.push('/');
    };

    // ********************************** Action Handlers ******************************************
    const handleDownloadAgain = async () => {
        if (studentData) {
            await generateCombinedPDF(studentData.students, getSchoolInfo(), generateResultCardHTML);
        }
    };

    const handlePreview = () => {
        if (studentData) previewResultCards(studentData.students, getSchoolInfo(), generateResultCardHTML);
    };

    // ********************************** Error State ******************************************
    if (error) return <UploadErrorState error={error} onReset={handleGoBack} />;

    // ********************************** Batch Details Configuration ******************************************
    const batchDetails = studentData ? {
        academicTerm: "2024-2025",
        classRecords: studentData.students[0]?.className || "N/A",
        totalStudents: studentData.totalStudents,
        format: "Digital PDF",
    } : {
        academicTerm: "Loading...", classRecords: "Processing...", totalStudents: 0, format: "Digital PDF",
    };

    // ********************************** Component Render ******************************************
    return (
        <div className="p-8">
            {/* ********************************** Header Section ****************************************** */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Generation Progress</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {isComplete ? "Generation Complete!" : "Processing your result cards..."}
                </p>
            </div>

            {/* ********************************** Main Content Grid ****************************************** */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ********************************** Sidebar Section ****************************************** */}
                <div className="lg:col-span-1 space-y-4">
                    <BatchDetails details={batchDetails} />
                    <OptimizationTip totalStudents={batchDetails.totalStudents} estimatedTime={Math.ceil(batchDetails.totalStudents * 0.5)} />
                </div>

                {/* ********************************** Main Processing Section ****************************************** */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        {/* ********************************** Progress Indicators ****************************************** */}
                        <ProgressBar percentage={progress} timeRemaining={!isComplete ? Math.ceil((100 - progress) / 10) : null} />
                        <ProcessingSteps steps={steps} />

                        {/* ********************************** Completion Section ****************************************** */}
                        {isComplete && (
                            <div className="mt-8 max-w-xl mx-auto w-full">
                                <div className="mb-6">
                                    <SuccessMessage totalStudents={batchDetails.totalStudents} />
                                </div>

                                {/* ********************************** Action Buttons ****************************************** */}
                                <div className="space-y-3">
                                    {/* Primary actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                        <button onClick={handleDownloadAgain}
                                            className="flex-1 px-6 py-3.5 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
                                            style={{ backgroundColor: '#0256b1', boxShadow: '0 4px 12px rgba(2, 86, 177, 0.15)' }}>
                                            <FileDown size={18} />
                                            Download Again
                                        </button>
                                        <button onClick={handlePreview}
                                            className="flex-1 px-6 py-3.5 font-semibold text-sm rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
                                            style={{ borderColor: '#0256b1', color: '#0256b1', backgroundColor: 'rgba(2, 86, 177, 0.04)' }}>
                                            <Eye size={18} />
                                            Preview Cards
                                        </button>
                                    </div>

                                    {/* Secondary actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                        <button onClick={handleGenerateAgain}
                                            className="flex-1 px-5 py-3 text-slate-500 font-medium text-sm rounded-xl border border-black transition-all duration-200 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99]">
                                            <RefreshCw size={16} />
                                            Start New Batch
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}