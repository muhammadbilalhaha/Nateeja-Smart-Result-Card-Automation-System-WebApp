"use client";

// ********************************** Library Imports ******************************************
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// ********************************** Component Imports ******************************************
import { Plus } from "@/components/ui/Icons";
import Button from "@/components/common/Button";
import CompletionRates from "./CompletionRates";
import StudentTable from "./StudentTable";
import WarningAlerts from "./WarningAlerts";

// ********************************** Utility & Hook Imports ******************************************
import { processExcelFile } from "@/utils/excelProcessor";
import UploadErrorState from "@/components/common/UploadErrorStateProps";
import Loader from "@/components/common/Loader";

export default function PreviewPage() {
    // ********************************** Router Hook ******************************************
    const router = useRouter();

    // ********************************** State Management ******************************************
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [summary, setSummary] = useState({
        totalStudents: 0,
        averagePercentage: 0,
        passCount: 0,
        failCount: 0
    });

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        const base64Data = sessionStorage.getItem("uploadedFileData");

        if (!base64Data) {
            setError("No file found. Please upload an Excel file first.");
            setLoading(false);
            return;
        }

        loadAndProcessFile();
    }, []);

    // ********************************** Base64 to ArrayBuffer Converter ******************************************
    const base64ToArrayBuffer = (base64) => {
        const binaryString = window.atob(base64.split(",")[1] || base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    // ********************************** Settings Helpers ******************************************
    const getSettingsFromStorage = () => {
        try {
            return JSON.parse(localStorage.getItem('schoolSettings') || '{}');
        } catch {
            return {};
        }
    };

    const getPassingFromStorage = () => {
        return getSettingsFromStorage().passingPercentage || 33;
    };

    // ********************************** File Processing Function ******************************************
    const loadAndProcessFile = async () => {
        try {
            const base64Data = sessionStorage.getItem("uploadedFileData");
            const storedFileName = sessionStorage.getItem("uploadedFileName");

            if (!base64Data) {
                setError("No file found. Please upload an Excel file first.");
                setLoading(false);
                return;
            }

            setFileName(storedFileName || "Uploaded File");
            const arrayBuffer = base64ToArrayBuffer(base64Data);

            // Read settings from localStorage
            const savedSettings = getSettingsFromStorage();
            const passingPercentage = savedSettings.passingPercentage || 33;
            const subjectsToFail = savedSettings.subjectsToFail || 1;

            console.log('Processing with - Passing:', passingPercentage + '%', 'Fail threshold:', subjectsToFail, 'subject(s)');

            const data = await processExcelFile(arrayBuffer, { passingPercentage, subjectsToFail });

            setStudents(data.students);

            // ********************************** Subject Statistics Calculation ******************************************
            const subjectStats = data.subjects.map((subjectName) => {
                const studentsWithSubject = data.students.filter((student) =>
                    student.subjects.some((s) => s.name === subjectName && s.maxMarks > 0)
                ).length;

                const subjectMarks = data.students
                    .map((student) => {
                        const subject = student.subjects.find((s) => s.name === subjectName);
                        return subject && subject.maxMarks > 0 ? parseFloat(subject.percentage) : null;
                    })
                    .filter((mark) => mark !== null);

                const totalMarks = subjectMarks.reduce((sum, mark) => sum + mark, 0);
                const average = subjectMarks.length > 0 ? (totalMarks / subjectMarks.length).toFixed(1) : 0;

                return { name: subjectName, average: parseFloat(average), totalStudents: studentsWithSubject };
            });

            setSubjects(subjectStats);

            // ********************************** Summary Calculation ******************************************
            const totalAvg = data.students.length > 0
                ? data.students.reduce((sum, student) => sum + parseFloat(student.percentage), 0) / data.students.length
                : 0;

            const passCount = data.students.filter((s) => s.status === "PASS").length;

            setSummary({
                totalStudents: data.totalStudents,
                averagePercentage: totalAvg.toFixed(2),
                passCount,
                failCount: data.totalStudents - passCount,
                passingPercentage: passingPercentage
            });

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // ********************************** Filtered Students Memoization ******************************************
    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return students;
        return students.filter((student) => {
            const term = searchTerm.toLowerCase();
            return (
                student.name?.toLowerCase().includes(term) ||
                student.rollNo?.toString().toLowerCase().includes(term) ||
                student.status?.toLowerCase().includes(term)
            );
        });
    }, [students, searchTerm]);

    // ********************************** Navigation Handlers ******************************************
    const handleGenerateCards = () => {
        router.push("/generate");
    };

    const handleUploadNew = () => {
        sessionStorage.removeItem('uploadedFileData');
        sessionStorage.removeItem('uploadedFileName');
        sessionStorage.removeItem('generationComplete');
        sessionStorage.removeItem('studentData');
        router.push('/');
    };

    // ********************************** Loading State ******************************************
    if (loading) {
        return <Loader />;
    }

    // ********************************** Error State ******************************************
    if (error) {
        return <UploadErrorState error={error} onReset={handleUploadNew} />;
    }

    // ********************************** Component Render ******************************************
    return (
        <div className="w-full p-6">
            {/* ********************************** Header Section ****************************************** */}
            <div className="mb-4 border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
                {/* Left: Title & Source File (Tighter layout) */}
                <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Data Verification Preview
                        {/* Moved the file name up next to the title to save a line of vertical space */}
                        <span className="font-mono text-[10px] font-normal bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 tracking-normal mt-0.5">
                            {fileName}
                        </span>
                    </h2>
                </div>

                {/* Right: Unified, Segmented Statistics Bar */}
                <div className="flex bg-white border border-slate-200 rounded-md shadow-sm text-xs font-medium overflow-hidden self-start md:self-auto">

                    {/* Total Students */}
                    <div className="px-3 py-1.5 border-r border-slate-200 flex items-center gap-1.5">
                        <span className="text-slate-500">Students</span>
                        <span className="text-slate-900 font-bold">{summary.totalStudents}</span>
                    </div>

                    {/* Passed (Subtle background tint) */}
                    <div className="px-3 py-1.5 border-r border-slate-200 flex items-center gap-1.5 bg-emerald-50/50">
                        <span className="text-emerald-600">Passed</span>
                        <span className="text-emerald-700 font-bold">{summary.passCount}</span>
                    </div>

                    {/* Failed (Subtle background tint) */}
                    <div className="px-3 py-1.5 border-r border-slate-200 flex items-center gap-1.5 bg-rose-50/50">
                        <span className="text-rose-600">Failed</span>
                        <span className="text-rose-700 font-bold">{summary.failCount}</span>
                    </div>

                    {/* Overall Average (Dark contrasting section for emphasis) */}
                    <div className="px-3 py-1.5 bg-slate-900 flex items-center gap-1.5">
                        <span className="text-slate-300">Class Avg</span>
                        <span className="text-white font-bold">{summary.averagePercentage}%</span>
                    </div>

                </div>
            </div>

            {/* ********************************** Search & Actions Bar ****************************************** */}
            <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search Input */}
                <div className="w-full lg:max-w-md flex gap-3">
                    <input
                        type="text"
                        placeholder="Search by name, roll no, status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        Showing{" "}
                        <span className="font-semibold text-gray-800">{filteredStudents.length}</span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-800">{students.length}</span>{" "}
                        students
                    </div>
                </div>

                {/* ********************************** Action Buttons ****************************************** */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        icon={Plus}
                        className="justify-center bg-[#0256b1]"
                        onClick={handleGenerateCards}
                    >
                        Generate Result Cards
                    </Button>
                    <Button
                        variant="secondary"
                        className="justify-center"
                        onClick={handleUploadNew}
                    >
                        Upload New File
                    </Button>
                </div>
            </div>

            {/* ********************************** Student Table Section ****************************************** */}
            <div className="w-full">
                <StudentTable students={filteredStudents} passingPercentage={getPassingFromStorage()} />
            </div>

            {/* ********************************** Bottom Grid Section ****************************************** */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <CompletionRates subjects={subjects} totalStudents={summary.totalStudents} />
                <WarningAlerts students={students} />
            </div>
        </div>
    );
}