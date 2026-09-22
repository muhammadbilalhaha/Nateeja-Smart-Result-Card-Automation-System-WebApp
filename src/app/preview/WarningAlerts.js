"use client";

// ********************************** Library Imports ******************************************
import { useState } from "react";

// ********************************** Icon Imports ******************************************
import { AlertCircle, Eye, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Copy } from "@/components/ui/Icons";

// ********************************** Preview Mode Alert Component ******************************************
export const PreviewModeAlert = () => {
    return (
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center gap-2">
                <Eye className="text-blue-600 w-4 h-4 flex-shrink-0" />
                <p className="text-xs text-blue-700 font-medium">
                    Preview Mode — Verify all data before generating
                </p>
            </div>
        </div>
    );
};

// ********************************** All Clear Status Component ******************************************
const AllClearStatus = () => {
    return (
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-emerald-800 text-sm">Data Quality Check Passed</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">
                        No duplicate, missing, or incomplete records found
                    </p>
                </div>
                <div className="ml-auto">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Ready
                    </span>
                </div>
            </div>
        </div>
    );
};

// ********************************** Issue Summary Component ******************************************
const IssueSummary = ({ duplicates, duplicateList, missingData, incompleteRecords, missingSubjects }) => {
    // ********************************** State Management ******************************************
    const [expanded, setExpanded] = useState(false);
    
    // ********************************** Calculations ******************************************
    const totalIssues = duplicates + missingData + incompleteRecords;

    // ********************************** Component Render ******************************************
    return (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            {/* ********************************** Summary Header ****************************************** */}
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-amber-800 text-sm">Data Issues Found</h4>
                        <p className="text-xs text-amber-600 mt-0.5 truncate">
                            {duplicates > 0 && `${duplicates} duplicate(s)`}
                            {duplicates > 0 && missingData > 0 && ' • '}
                            {missingData > 0 && `${missingData} missing value(s) in ${missingSubjects.length} subject(s)`}
                            {(duplicates > 0 || missingData > 0) && incompleteRecords > 0 && ' • '}
                            {incompleteRecords > 0 && `${incompleteRecords} incomplete record(s)`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                            {totalIssues} issues
                        </span>
                        {totalIssues > 0 && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="p-1 hover:bg-amber-50 rounded transition-colors"
                            >
                                {expanded ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ********************************** Expandable Details ****************************************** */}
            {expanded && (
                <div className="border-t border-amber-100 bg-amber-50/30 p-4 space-y-3">
                    {/* ********************************** Duplicate Roll Numbers ****************************************** */}
                    {duplicates > 0 && duplicateList.length > 0 && (
                        <div className="flex items-start gap-2 text-xs">
                            <Copy size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-amber-800">Duplicate Roll Numbers: </span>
                                <span className="text-amber-700">
                                    {duplicateList.map((rollNo, i) => (
                                        <span key={rollNo} className="inline-flex items-center">
                                            <code className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[11px] font-mono">{rollNo}</code>
                                            {i < duplicateList.length - 1 && <span className="mx-0.5">,</span>}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ********************************** Missing Values ****************************************** */}
                    {missingSubjects.length > 0 && (
                        <div className="flex items-start gap-2 text-xs">
                            <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-red-800">Missing Values: </span>
                                <span className="text-red-700">
                                    {missingSubjects.map((s, i) => (
                                        <span key={s.subject}>
                                            {s.subject} ({s.count}){i < missingSubjects.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ********************************** Incomplete Records ****************************************** */}
                    {incompleteRecords > 0 && (
                        <div className="flex items-start gap-2 text-xs">
                            <AlertTriangle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-orange-800">Incomplete Records: </span>
                                <span className="text-orange-700">{incompleteRecords} record(s) missing name, roll no, or class.</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ********************************** Main WarningAlerts Component ******************************************
export default function WarningAlerts({ students }) {
    // ********************************** Early Return - Empty State ******************************************
    if (!students || students.length === 0) {
        return null;
    }

    // ********************************** Data Quality Analysis ******************************************
    const issues = analyzeDataQuality(students);
    const hasIssues = issues.duplicates.length > 0 || issues.missingData.length > 0 || issues.incompleteRecords.length > 0;
    const totalMissing = issues.missingData.reduce((sum, m) => sum + m.count, 0);

    // ********************************** Component Render ******************************************
    return (
        <div className="space-y-3">
            {hasIssues ? (
                <IssueSummary
                    duplicates={issues.duplicates.length}
                    duplicateList={issues.duplicates}
                    missingData={totalMissing}
                    incompleteRecords={issues.incompleteRecords.length}
                    missingSubjects={issues.missingData}
                />
            ) : (
                <AllClearStatus />
            )}

            <PreviewModeAlert />
        </div>
    );
}

// ********************************** Data Quality Analysis Function ******************************************
function analyzeDataQuality(students) {
    const duplicates = [];
    const subjectMissingMap = {};
    const incompleteRecords = [];
    const seenRollNos = new Map();

    students.forEach((student, index) => {
        // ********************************** Duplicate Detection ******************************************
        if (student.rollNo) {
            if (seenRollNos.has(student.rollNo)) {
                if (!duplicates.includes(student.rollNo)) {
                    duplicates.push(student.rollNo);
                }
            } else {
                seenRollNos.set(student.rollNo, index);
            }
        }

        // ********************************** Incomplete Record Detection ******************************************
        if (!student.name || !student.rollNo || !student.className) {
            incompleteRecords.push(student.name || `Row ${index + 1}`);
        }

        // ********************************** Missing Subject Data Detection ******************************************
        student.subjects.forEach(subject => {
            const isMissing = subject.obtainedMarks === null ||
                subject.obtainedMarks === undefined ||
                subject.isEmpty === true;

            if (isMissing || subject.maxMarks === 0) {
                if (!subjectMissingMap[subject.name]) {
                    subjectMissingMap[subject.name] = [];
                }
                subjectMissingMap[subject.name].push(student.name || `Row ${index + 1}`);
            }
        });
    });

    // ********************************** Format Missing Data Results ******************************************
    const missingData = Object.keys(subjectMissingMap).map(subjectName => ({
        subject: subjectName,
        count: subjectMissingMap[subjectName].length,
        students: subjectMissingMap[subjectName]
    }));

    return { duplicates, missingData, incompleteRecords };
}