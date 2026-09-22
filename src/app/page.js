"use client";

// ********************************** Library Imports ******************************************
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

// ********************************** Utility Imports ******************************************
import { addRecentProject, updateRecentProjectTimeAgo } from './dashboard/recentProjects';

// ********************************** Component Imports ******************************************
import FileUploadSection from './dashboard/FileUploadSection';
import RecentProjectsCard from './dashboard/RecentProjectsCard';
import SidebarCards from './dashboard/SidebarCards';
import Footer from "./dashboard/Footer";
import { downloadSampleExcel} from './dashboard/sampleExcel';

export default function DashboardPage() {
    const router = useRouter();

    // ********************************** State Management ******************************************
    const [isFileLoaded, setIsFileLoaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileData, setFileData] = useState(null);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [recentProjects, setRecentProjects] = useState([]);

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        setRecentProjects(updateRecentProjectTimeAgo());
    }, []);

    // ********************************** File Drop Handler ******************************************
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0].code === 'file-invalid-type') {
                setError("Please upload an Excel file (.xlsx or .xls)");
            } else {
                setError("Invalid file. Please upload an Excel file.");
            }
            setIsFileLoaded(false);
            setFileName("");
            return;
        }

        const file = acceptedFiles[0];
        if (!file) return;

        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            setError("Please upload an Excel file (.xlsx or .xls)");
            setIsFileLoaded(false);
            setFileName("");
            return;
        }

        setFileName(file.name);
        setIsFileLoaded(true);
        setFileData(file);
        setError("");
    }, []);

    // ********************************** Dropzone Configuration ******************************************
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        multiple: false
    });

    // ********************************** File Storage Function ******************************************
    const saveFileToStorage = () => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                sessionStorage.removeItem('generationComplete');
                sessionStorage.removeItem('studentData');
                sessionStorage.setItem('uploadedFileData', base64Data);
                sessionStorage.setItem('uploadedFileName', fileName);
                resolve();
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(fileData);
        });
    };

    // ********************************** Navigation Handlers ******************************************
    const handlePreview = async () => {
        if (!fileData) { setError("Please select a file first"); return; }
        setIsProcessing(true);
        try {
            await saveFileToStorage();
            router.push('/preview');
        } catch (err) {
            setError("Failed to process file. Please try again.");
        } finally { setIsProcessing(false); }
    };

    const handleGenerate = async () => {
        if (!fileData) { setError("Please select a file first"); return; }
        setIsProcessing(true);
        try {
            await saveFileToStorage();
            addRecentProject(fileName, 0);
            setRecentProjects(updateRecentProjectTimeAgo());
            router.push('/generate');
        } catch (err) {
            setError("Failed to process file. Please try again.");
        } finally { setIsProcessing(false); }
    };

    const handleOpenRecentProject = (project) => {
        router.push('/preview');
    };

    // ********************************** File Clear Handler ******************************************
    const handleClearFile = () => {
        setIsFileLoaded(false);
        setFileName("");
        setFileData(null);
        setError("");
        sessionStorage.removeItem('uploadedFileData');
        sessionStorage.removeItem('uploadedFileName');
    };

    // ********************************** Component Render ******************************************
    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans antialiased flex flex-col justify-between p-6 md:p-6">
            {/* ********************************** Header Section ****************************************** */}
            <header className="text-center mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] mb-2">Nateeja</h1>
                <p className="text-base text-slate-500 font-medium">Smart Report Card Generator</p>
            </header>

            {/* ********************************** Main Content ****************************************** */}
            <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start grow">
                {/* ********************************** File Upload Section ****************************************** */}
                <FileUploadSection
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    isDragActive={isDragActive}
                    isFileLoaded={isFileLoaded}
                    fileName={fileName}
                    error={error}
                    isProcessing={isProcessing}
                    onPreview={handlePreview}
                    onGenerate={handleGenerate}
                    onClear={handleClearFile}
                    onDownloadSample={downloadSampleExcel}
                />

                {/* ********************************** Sidebar Section ****************************************** */}
                <aside className="space-y-6 flex flex-col h-full justify-between lg:justify-start">
                    <RecentProjectsCard
                        projects={recentProjects}
                        onOpenProject={handleOpenRecentProject}
                    />
                    <SidebarCards />
                </aside>
            </main>

            {/* ********************************** Footer Section ****************************************** */}
            <Footer />
        </div>
    );
}