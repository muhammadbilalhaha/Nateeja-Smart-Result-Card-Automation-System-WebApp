"use client";

// ********************************** Library Imports ******************************************
import { useState, useMemo } from "react";

// ********************************** Component & Icon Imports ******************************************
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, AlertCircle, Copy } from "@/components/ui/Icons";
import StudentDetailModal from "./StudentDetailModal";

// ********************************** Settings Helper ******************************************
const getSettingsFromStorage = () => {
    try {
        return JSON.parse(localStorage.getItem('schoolSettings') || '{}');
    } catch {
        return {};
    }
};

const StudentTable = ({ students, passingPercentage = 40 }) => {
    // ********************************** State Management ******************************************
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ********************************** Constants ******************************************
    const studentsPerPage = 10;

    // ********************************** Settings Memoization ******************************************
    const settings = useMemo(() => getSettingsFromStorage(), []);
    const subjectsToFail = settings.subjectsToFail || 1;

    // ********************************** Father Name Detection ******************************************
    const hasFatherName = useMemo(() => {
        return students?.some(s => s.fatherName && String(s.fatherName).trim() !== "");
    }, [students]);

    // ********************************** Empty State ******************************************
    if (!students || students.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No student data available</p>
            </div>
        );
    }

    // ********************************** Duplicate Detection ******************************************
    const duplicateRollNos = useMemo(() => {
        const seen = new Map();
        const dupes = new Set();
        students.forEach(s => {
            if (s.rollNo) {
                if (seen.has(s.rollNo)) {
                    dupes.add(s.rollNo);
                } else {
                    seen.set(s.rollNo, true);
                }
            }
        });
        return dupes;
    }, [students]);

    // ********************************** Active Subjects Filtering ******************************************
    const activeSubjectNames = useMemo(() => {
        const allSubjects = new Set();
        students.forEach(student => {
            student.subjects?.forEach(sub => {
                if (sub?.name) allSubjects.add(sub.name);
            });
        });

        return Array.from(allSubjects).filter(subjectName => {
            return students.some(student => {
                const sub = student.subjects?.find(s => s.name === subjectName);
                return sub &&
                    sub.obtainedMarks !== null &&
                    sub.obtainedMarks !== undefined &&
                    sub.obtainedMarks !== "" &&
                    sub.isEmpty !== true;
            });
        });
    }, [students]);

    // ********************************** Pagination Calculations ******************************************
    const totalPages = Math.ceil(students.length / studentsPerPage);
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const currentStudents = students.slice(startIndex, endIndex);

    // ********************************** Validation Helpers ******************************************
    const isCellMissing = (subject) => {
        if (!subject) return true;
        return subject.obtainedMarks === null ||
            subject.obtainedMarks === undefined ||
            subject.obtainedMarks === "" ||
            subject.isEmpty === true;
    };

    const isDuplicate = (student) => {
        return student.rollNo && duplicateRollNos.has(student.rollNo);
    };

    const hasRowError = (student) => {
        if (!student.name || !student.rollNo || !student.className) return true;
        if (isDuplicate(student)) return true;
        return activeSubjectNames.some(subName => {
            const sub = student.subjects?.find(s => s.name === subName);
            return isCellMissing(sub);
        });
    };

    const getRowErrorType = (student) => {
        const errors = [];
        if (!student.name || !student.rollNo || !student.className) errors.push('incomplete');
        if (isDuplicate(student)) errors.push('duplicate');
        if (activeSubjectNames.some(subName => isCellMissing(student.subjects?.find(s => s.name === subName)))) {
            errors.push('missing');
        }
        return errors;
    };

    // ********************************** Grade & Status Helpers ******************************************
    const getFailedSubjectCount = (student) => {
        return student.subjects?.filter(s => {
            if (isCellMissing(s) || s.maxMarks === 0) return false;
            return parseFloat(s.percentage) < passingPercentage;
        }).length || 0;
    };

    const isSubjectPassed = (percentage) => parseFloat(percentage) >= passingPercentage;

    const getSubjectColor = (subject) => {
        if (!subject) return "text-slate-600";
        if (isCellMissing(subject)) return "text-red-600";
        return isSubjectPassed(parseFloat(subject.percentage)) ? "text-slate-600" : "text-red-600";
    };

    // ********************************** Rank Indicator Component ******************************************
    const RankIndicator = ({ rank }) => {
        if (!rank) return <span className="text-gray-300 font-medium">—</span>;

        if (rank === 1) return <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200 text-amber-700 border border-amber-500 text-[11px] font-bold" title="1st Position">1</div>;
        if (rank === 2) return <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-bold" title="2nd Position">2</div>;
        if (rank === 3) return <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-orange-900 border border-orange-400 text-[11px] font-bold" title="3rd Position">3</div>;

        return <span className="text-gray-600 font-medium text-[13px]">{rank}</span>;
    };

    // ********************************** Event Handlers ******************************************
    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handleStudentClick = (student) => { setSelectedStudent(student); setShowModal(true); };
    const handleCloseModal = () => { setShowModal(false); setSelectedStudent(null); };

    // ********************************** Error & Duplicate Counts ******************************************
    const errorCount = students.filter(s => hasRowError(s)).length;
    const duplicateCount = duplicateRollNos.size;

    // ********************************** Component Render ******************************************
    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* ********************************** Table Header Bar ****************************************** */}
                <div className="px-4 py-2 bg-slate-50 border-b border-gray-200 flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500">
                            Passing: <span className="font-bold text-slate-700">{passingPercentage}%</span>
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">
                            Fail if <span className="font-bold text-slate-700">{subjectsToFail}</span> subject(s) failed
                        </span>
                        {errorCount > 0 && (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                <AlertCircle size={12} />
                                {errorCount} record(s) with errors
                            </span>
                        )}
                        {duplicateCount > 0 && (
                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <Copy size={12} />
                                {duplicateCount} duplicate(s)
                            </span>
                        )}
                    </div>
                    <span className="text-slate-400">
                        {students.filter(s => s.status === 'PASS').length} Passed / {students.filter(s => s.status === 'FAIL').length} Failed
                    </span>
                </div>

                {/* ********************************** Data Table ****************************************** */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Table Header */}
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">#</th>
                                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                {hasFatherName && (
                                    <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Father Name</th>
                                )}
                                <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">Rank</th>
                                {activeSubjectNames.map((subject, idx) => (
                                    <th key={idx} className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {subject.length > 4 ? subject.substring(0, 4) : subject}
                                    </th>
                                ))}
                                <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg</th>
                                <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {currentStudents.map((student, idx) => {
                                const errorTypes = getRowErrorType(student);
                                const isDup = isDuplicate(student);
                                const failedCount = getFailedSubjectCount(student);

                                let borderColor = '';
                                if (errorTypes.includes('duplicate')) borderColor = 'border-l-2 border-l-amber-400 bg-amber-50/30';
                                else if (errorTypes.includes('missing') || errorTypes.includes('incomplete')) borderColor = 'border-l-2 border-l-red-400';

                                return (
                                    <tr
                                        key={student.rollNo || startIndex + idx}
                                        onClick={() => handleStudentClick(student)}
                                        className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer ${borderColor}`}
                                    >
                                        {/* ********************************** Row Number & Error Indicators ****************************************** */}
                                        <td className="p-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-400 text-[13px] font-medium">{startIndex + idx + 1}</span>
                                                {isDup && <Copy size={14} className="text-amber-500" title="Duplicate roll number" />}
                                                {!isDup && errorTypes.includes('missing') && <AlertCircle size={14} className="text-red-500" title="Missing data" />}
                                                {!isDup && errorTypes.includes('incomplete') && <AlertCircle size={14} className="text-orange-500" title="Incomplete record" />}
                                            </div>
                                        </td>

                                        {/* ********************************** Roll Number ****************************************** */}
                                        <td className={`p-3 text-[13px] font-mono font-medium ${isDup ? 'text-amber-600 font-bold' : !student.rollNo ? 'text-red-500' : 'text-gray-600'
                                            }`}>
                                            <div className="flex items-center gap-1.5">
                                                {student.rollNo || 'Missing'}
                                                {isDup && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">DUP</span>}
                                            </div>
                                        </td>

                                        {/* ********************************** Student Name *********************************** */}
                                        <td className="p-3 text-[13px]">
                                            <div className="flex items-center">
                                                <span className={`font-semibold ${!student.name ? 'text-red-500' : 'text-gray-800'}`}>
                                                    {student.name || 'Missing'}
                                                </span>
                                            </div>
                                        </td>
                                        {/* ********************************** Rank ****************************************** */}


                                        {/* ********************************** Father Name (Conditional) ****************************************** */}
                                        {hasFatherName && (
                                            <td className="p-3 text-[13px] text-gray-600 truncate max-w-[150px]">
                                                {student.fatherName || '—'}
                                            </td>
                                        )}

                                        <td className="p-3 text-center">
                                            <RankIndicator rank={student.position || student.rank} />
                                        </td>

                                        {/* ********************************** Subject Marks ****************************************** */}
                                        {activeSubjectNames.map((subjectName, subIdx) => {
                                            const subject = student.subjects?.find(s => s.name === subjectName);
                                            const cellMissing = isCellMissing(subject);
                                            const marks = subject && !cellMissing ? `${subject.obtainedMarks}/${subject.maxMarks}` : '—';

                                            return (
                                                <td key={subIdx} className={`p-3 text-[13px] text-center ${cellMissing ? 'bg-red-50 border border-red-400 rounded' : ''}`}>
                                                    {cellMissing ? (
                                                        <div className="flex justify-center items-center gap-1">
                                                            <AlertCircle size={14} className="text-red-500" />
                                                        </div>
                                                    ) : (
                                                        <div className={`font-medium ${getSubjectColor(subject)}`}>
                                                            {marks}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* ********************************** Total Marks ****************************************** */}
                                        <td className="p-3 text-[13px] text-center font-semibold text-gray-700">
                                            {student.totalObtained}/{student.totalMarks}
                                        </td>

                                        {/* ********************************** Average Percentage ****************************************** */}
                                        <td className="p-3 text-[13px] text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${student.status === "PASS"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-700"
                                                }`}>
                                                {student.percentage}%
                                            </span>
                                        </td>

                                        {/* ********************************** Pass/Fail Status ****************************************** */}
                                        <td className="p-3 text-center">
                                            {student.status === "PASS" ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <CheckCircle size={16} className="text-green-600" />
                                                    <span className="text-xs text-green-700 font-medium">Passed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1">
                                                    <XCircle size={16} className="text-red-600" />
                                                    <span className="text-xs text-red-700 font-medium">Failed</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ********************************** Pagination Footer ****************************************** */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        {/* Page Info */}
                        <p className="text-[13px] text-gray-500">
                            {startIndex + 1}-{Math.min(endIndex, students.length)} of {students.length}
                        </p>

                        {/* Summary Stats */}
                        <div className="flex gap-4 text-[13px]">
                            <span className="flex items-center gap-1">
                                <CheckCircle size={14} className="text-green-600" />
                                <span className="text-gray-600">{students.filter(s => s.status === 'PASS').length} Passed</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <XCircle size={14} className="text-red-600" />
                                <span className="text-gray-600">{students.filter(s => s.status === 'FAIL').length} Failed</span>
                            </span>
                            {duplicateCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <Copy size={14} className="text-amber-500" />
                                    <span className="text-amber-600">{duplicateCount} Duplicates</span>
                                </span>
                            )}
                            {errorCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <AlertCircle size={14} className="text-red-500" />
                                    <span className="text-red-600">{errorCount} Errors</span>
                                </span>
                            )}
                        </div>

                        {/* ********************************** Pagination Controls ****************************************** */}
                        <div className="flex items-center gap-3">
                            <button onClick={handlePrevPage} disabled={currentPage === 1}
                                className={`flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-lg transition-colors ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"}`}>
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                                    <button key={page} onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 text-[13px] rounded-lg transition-colors ${currentPage === page ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-200"}`}>
                                        {page}
                                    </button>
                                ))}
                                {totalPages > 5 && <span className="text-gray-400">...</span>}
                            </div>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}
                                className={`flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-lg transition-colors ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"}`}>
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ********************************** Student Detail Modal ****************************************** */}
            <StudentDetailModal
                student={selectedStudent}
                isOpen={showModal}
                onClose={handleCloseModal}
                passingPercentage={passingPercentage}
                subjectsToFail={subjectsToFail}
            />
        </>
    );
};

export default StudentTable;