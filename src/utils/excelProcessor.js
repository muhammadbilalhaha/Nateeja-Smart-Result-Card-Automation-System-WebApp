// ********************************** Library Imports ******************************************
import * as XLSX from 'xlsx';

// ********************************** Main Export - Process Excel File ******************************************
export function processExcelFile(fileBuffer, options = {}) {
    const { passingPercentage = 33, subjectsToFail = 1 } = options;

    return new Promise((resolve, reject) => {
        try {
            const workbook = XLSX.read(fileBuffer, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

            console.log('Raw data rows:', jsonData.length);
            const processedData = processStudentData(jsonData, passingPercentage, subjectsToFail);
            resolve(processedData);
        } catch (error) {
            console.error('Excel processing error:', error);
            reject(new Error('Failed to process Excel file: ' + error.message));
        }
    });
}

// ********************************** Header Row Keywords ******************************************
// Used only to SCORE candidate rows, not to hard-require any specific column.
const HEADER_HINT_WORDS = [
    'name', 'roll', 'class', 'grade', 'section', 'sec', 'father', 'parent',
    'guardian', 'subject', 'marks', 'obtained', 'total', 'percentage',
    'result', 'remarks', 'dob', 'status'
];

// ********************************** Row Emptiness Helper ******************************************
function isRowEmpty(row) {
    if (!row || row.length === 0) return true;
    return !row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
}

// ********************************** Detect Header Row ******************************************
// Scans the first N rows and scores each one on how "header-like" it looks.
function detectHeaderRow(rawData, scanLimit = 15) {
    let bestIndex = -1;
    let bestScore = -Infinity;

    const limit = Math.min(scanLimit, rawData.length);
    for (let i = 0; i < limit; i++) {
        const row = rawData[i];
        if (isRowEmpty(row)) continue;

        let nonEmptyTextCells = 0;
        let numericCells = 0;
        let hintMatches = 0;

        row.forEach(cell => {
            if (cell === null || cell === undefined || String(cell).trim() === '') return;
            const val = String(cell).trim();
            const isNumeric = val !== '' && !isNaN(Number(val));

            if (isNumeric) {
                numericCells++;
            } else {
                nonEmptyTextCells++;
                const lower = val.toLowerCase();
                if (HEADER_HINT_WORDS.some(hint => lower.includes(hint))) {
                    hintMatches++;
                }
            }
        });

        const totalNonEmpty = nonEmptyTextCells + numericCells;
        if (totalNonEmpty < 2) continue;

        const textRatio = nonEmptyTextCells / totalNonEmpty;

        let score = nonEmptyTextCells * 2 + hintMatches * 5;
        score -= numericCells * 1.5;
        if (textRatio < 0.5) score -= 10;

        const next = rawData[i + 1];
        if (next && !isRowEmpty(next)) {
            score += 1;
        }

        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }

    return bestIndex;
}

// ********************************** Non-Subject Column Patterns ******************************************
// Columns that are administrative/computed fields, never actual subject marks.
// NOTE: avoid bare 'sr' and '#' here — they falsely match subject names like "Sri".
const NON_SUBJECT_PATTERNS = {
    serial: ['sno', 's.no', 's no', 'sr.no', 'sr no', 'serial', 'sl.no', 'sl no', 'sr#', 's#'],
    rank: ['rank', 'position', 'pos'],
    total: ['total', 'grand total', 'total marks', 'total obtained'],
    average: ['percentage', 'percent', '%', 'average', 'avg'],
    status: ['status', 'result', 'pass/fail', 'remarks', 'grade', 'division'],
    attendance: ['attendance', 'present', 'absent'],
};

// ********************************** Content-Based Helpers ******************************************

// Marks columns: plain numbers ("85"), fraction-style ("85/100"), decimals.
function looksLikeMarksColumn(rawData, headerRowIndex, colIndex, sampleSize = 10) {
    let checked = 0;
    let numericLike = 0;

    for (let i = headerRowIndex + 1; i < rawData.length && checked < sampleSize; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;
        const raw = row[colIndex];
        if (raw === undefined || raw === null || String(raw).trim() === '') continue;

        checked++;
        const val = String(raw).trim();
        const isMarkLike = /^-?\d+(\.\d+)?(\s*\/\s*\d+(\.\d+)?)?$/.test(val);
        if (isMarkLike) numericLike++;
    }

    if (checked === 0) return true;
    return (numericLike / checked) >= 0.6;
}

// Serial columns are always exactly 1, 2, 3, ... in order — much more reliable
// than matching header text (which causes false positives on "Sri", etc.).
function looksLikeSerialColumn(rawData, headerRowIndex, colIndex) {
    let expected = 1, checked = 0;
    for (let i = headerRowIndex + 1; i < rawData.length && checked < 20; i++) {
        const v = rawData[i]?.[colIndex];
        if (v === '' || v == null) continue;
        if (Number(v) !== expected) return false;
        expected++;
        checked++;
    }
    return checked >= 3;
}

// Infer max marks for a subject column.
// 1) Parse from header text like "Math (50)", "Math /50", "Math 50M".
// 2) Otherwise use the observed maximum in the column, rounded up.
function inferMaxMarks(rawData, headerRowIndex, colIndex) {
    const header = String(rawData[headerRowIndex]?.[colIndex] ?? '');
    const m = header.match(/[\(\/\s](\d{2,3})\s*(?:marks?|m)?\s*[\)]?/i);
    if (m) {
        const v = parseInt(m[1], 10);
        if (v >= 10 && v <= 500) return v;
    }

    let max = 0;
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
        const v = parseFloat(rawData[i]?.[colIndex]);
        if (!isNaN(v) && v > max) max = v;
    }
    if (max <= 25) return 25;
    if (max <= 50) return 50;
    if (max <= 100) return 100;
    if (max <= 150) return 150;
    return 200;
}

// ********************************** Find Column Index Helper ******************************************
function findColumnIndex(headers, patterns, excludePatterns = [], usedIndices = null) {
    const isExcluded = (h) => excludePatterns.some(e => h.includes(e));
    const isUsed = (i) => usedIndices ? usedIndices.has(i) : false;

    // Exact match first
    for (let i = 0; i < headers.length; i++) {
        if (isUsed(i)) continue;
        const header = headers[i];
        if (header === undefined || header === null || header === '') continue;
        const h = String(header).toLowerCase().trim();
        if (isExcluded(h)) continue;
        for (const pattern of patterns) {
            if (h === pattern) return i;
        }
    }

    // Fallback: whole-token match (not raw substring), to avoid
    // "Class Roll" matching "roll" while "roll" is intended for another column.
    for (let i = 0; i < headers.length; i++) {
        if (isUsed(i)) continue;
        const header = headers[i];
        if (header === undefined || header === null || header === '') continue;
        const h = String(header).toLowerCase().trim();
        if (isExcluded(h)) continue;

        const tokens = h.split(/[^a-z0-9]+/).filter(Boolean);

        for (const pattern of patterns) {
            const pTokens = pattern.split(/[^a-z0-9]+/).filter(Boolean);
            if (pTokens.length === 0) continue;

            // Every token of the pattern must appear as a whole token
            // in the header (avoids partial substring false positives).
            if (pTokens.every(pt => tokens.includes(pt))) {
                return i;
            }
        }
    }
    return -1;
}

// ********************************** Process Student Data Function ******************************************
function processStudentData(rawData, passingPercentage = 33, subjectsToFail = 1) {
    // ********************************** Validation ******************************************
    if (!rawData || rawData.length < 2) {
        throw new Error('Excel file must contain headers and at least one student');
    }

    // ********************************** Adaptive Header Row Detection ******************************************
    const headerRowIndex = detectHeaderRow(rawData);
    if (headerRowIndex === -1) {
        throw new Error(
            'Could not find a header row in the first rows of the sheet. ' +
            'Make sure the file has a row with column titles like Name, Roll No, Class, and subject names.'
        );
    }
    console.log('Detected header row at index:', headerRowIndex);

    const headers = rawData[headerRowIndex].map(h => h?.toString().trim() || '');
    console.log('Headers:', headers);
    console.log('Header count:', headers.length);

    // ********************************** Column Detection (with collision guard) ******************************************
    // `used` prevents two roles from claiming the same column.
    const used = new Set();

    // Content-based serial detection first — more reliable than header text.
    const serialByContentIdx = (() => {
        for (let i = 0; i < headers.length; i++) {
            if (looksLikeSerialColumn(rawData, headerRowIndex, i)) return i;
        }
        return -1;
    })();

    const detect = (patterns, exclude = []) => {
        const idx = findColumnIndex(headers, patterns, exclude, used);
        if (idx >= 0) used.add(idx);
        return idx;
    };

    const fatherNameIdx = detect(['father', "father's name", 'father name', 'parent', 'guardian']);
    const nameIdx       = detect(['name', 'student name', 'student'], ['father', 'parent', 'guardian']);
    const rollNoIdx     = detect(['roll', 'roll no', 'roll number', 'rollno', 'r.no', 'roll #']);
    const classIdx      = detect(['class', 'grade', 'class/grade']);
    const sectionIdx    = detect(['section', 'sec']);

    // Non-subject columns
    const serialIdx = (() => {
        const byHeader = detect(NON_SUBJECT_PATTERNS.serial);
        if (byHeader >= 0) return byHeader;
        if (serialByContentIdx >= 0 && !used.has(serialByContentIdx)) {
            used.add(serialByContentIdx);
            return serialByContentIdx;
        }
        return -1;
    })();

    const providedRankIdx    = detect(NON_SUBJECT_PATTERNS.rank);
    const providedTotalIdx   = detect(NON_SUBJECT_PATTERNS.total);
    const providedAverageIdx = detect(NON_SUBJECT_PATTERNS.average);
    const providedStatusIdx  = detect(NON_SUBJECT_PATTERNS.status);
    const attendanceIdx      = detect(NON_SUBJECT_PATTERNS.attendance);

    console.log('Column indices:', { nameIdx, rollNoIdx, classIdx, fatherNameIdx, sectionIdx });
    console.log('Non-subject columns:', { serialIdx, providedRankIdx, providedTotalIdx, providedAverageIdx, providedStatusIdx, attendanceIdx });

    // ********************************** Name Fallback ******************************************
    let finalNameIdx = nameIdx;
    if (finalNameIdx < 0) {
        // Pick the first non-used column whose sample values are non-numeric text.
        for (let i = 0; i < headers.length; i++) {
            if (used.has(i)) continue;
            if (looksLikeMarksColumn(rawData, headerRowIndex, i)) continue;
            const sample = rawData
                .slice(headerRowIndex + 1, headerRowIndex + 6)
                .map(r => String(r[i] ?? '').trim())
                .filter(Boolean);
            if (sample.length && sample.every(v => isNaN(Number(v)))) {
                finalNameIdx = i;
                used.add(i);
                break;
            }
        }
        if (finalNameIdx < 0) {
            console.warn('No name column detected; falling back to column 0');
            finalNameIdx = 0;
            used.add(0);
        }
    }

    // ********************************** Fixed Column Indices ******************************************
    const fixedIndices = new Set();
    [finalNameIdx, rollNoIdx, classIdx, fatherNameIdx, sectionIdx,
     serialIdx, providedRankIdx, providedTotalIdx, providedAverageIdx,
     providedStatusIdx, attendanceIdx].forEach(i => { if (i >= 0) fixedIndices.add(i); });

    // ********************************** Subject Columns Detection ******************************************
    const subjectColumns = [];
    headers.forEach((header, index) => {
        if (fixedIndices.has(index)) return;

        // Must look like marks.
        if (!looksLikeMarksColumn(rawData, headerRowIndex, index)) {
            console.log(`Excluding "${header}" from subjects — values don't look like marks`);
            return;
        }

        // A header-less numeric column is still allowed as a subject.
        subjectColumns.push({
            name: (header && header.trim()) || `Subject ${subjectColumns.length + 1}`,
            index,
            maxMarks: inferMaxMarks(rawData, headerRowIndex, index),
        });
    });

    console.log('Subject columns:', subjectColumns.map(s => s.name));
    console.log('Total subjects:', subjectColumns.length);

    if (subjectColumns.length === 0) {
        throw new Error('No subject columns found in the Excel file. Headers: ' + headers.join(', '));
    }

    // ********************************** Cell Value Getter ******************************************
    const getCell = (row, index) => {
        if (index < 0 || index >= row.length) return '';
        const val = row[index];
        if (val === undefined || val === null) return '';
        return String(val).trim();
    };

    // ********************************** Student Data Processing ******************************************
    const students = [];
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (isRowEmpty(row)) continue;

        try {
            const student = {
                name: getCell(row, finalNameIdx),
                rollNo: rollNoIdx >= 0 ? getCell(row, rollNoIdx) : '',
                className: classIdx >= 0 ? getCell(row, classIdx) : '',
                fatherName: fatherNameIdx >= 0 ? getCell(row, fatherNameIdx) : '',
                section: sectionIdx >= 0 ? getCell(row, sectionIdx) : '',
                providedRank: providedRankIdx >= 0 ? getCell(row, providedRankIdx) : '',
                providedTotal: providedTotalIdx >= 0 ? getCell(row, providedTotalIdx) : '',
                providedStatus: providedStatusIdx >= 0 ? getCell(row, providedStatusIdx) : '',
                subjects: [],
                totalObtained: 0,
                totalMarks: 0,
                percentage: 0,
                grade: '',
                status: 'PASS',
                position: null,
                rank: null,
                totalStudents: 0,
            };

            const hasAnySubjectValue = subjectColumns.some(col => {
                const v = row[col.index];
                return v !== undefined && v !== null && String(v).trim() !== '';
            });
            if (!student.name && !hasAnySubjectValue) continue;

            // ********************************** Subject Marks Processing ******************************************
            subjectColumns.forEach((subjectCol) => {
                const rawValue = row[subjectCol.index];
                const isEmpty = rawValue === undefined || rawValue === null ||
                    (typeof rawValue === 'string' && rawValue.trim() === '') ||
                    (typeof rawValue === 'number' && isNaN(rawValue));

                const obtainedMarks = isEmpty ? null : (parseFloat(rawValue) || 0);
                const maxMarks = subjectCol.maxMarks;

                student.subjects.push({
                    name: subjectCol.name,
                    obtainedMarks,
                    maxMarks,
                    isEmpty,
                    percentage: maxMarks > 0 && obtainedMarks !== null
                        ? ((obtainedMarks / maxMarks) * 100).toFixed(2)
                        : 0,
                });

                if (obtainedMarks !== null) {
                    student.totalObtained += obtainedMarks;
                    student.totalMarks += maxMarks;
                }
            });

            // ********************************** Calculate Overall Results ******************************************
            student.percentage = student.totalMarks > 0
                ? ((student.totalObtained / student.totalMarks) * 100).toFixed(2)
                : 0;

            student.grade = calculateGrade(student.percentage);
            student.status = checkPassFail(student.subjects, passingPercentage, subjectsToFail);

            students.push(student);
        } catch (rowError) {
            console.error(`Error processing row ${i}:`, rowError);
        }
    }

    console.log('Processed students:', students.length);
    if (students.length > 0) {
        console.log('First student:', JSON.stringify({
            name: students[0]?.name,
            fatherName: students[0]?.fatherName,
            rollNo: students[0]?.rollNo,
            className: students[0]?.className,
            subjectCount: students[0]?.subjects.length,
            firstSubject: students[0]?.subjects[0]?.name,
            percentage: students[0]?.percentage,
        }));
    }

    const passCount = students.filter(s => s.status === 'PASS').length;
    const failCount = students.filter(s => s.status === 'FAIL').length;
    console.log(`Pass: ${passCount}, Fail: ${failCount}`);

    if (students.length === 0) {
        throw new Error(
            'Header row was detected, but no student rows with data were found below it. ' +
            'Check that the data starts immediately after the header row.'
        );
    }

    // ********************************** Assign Class Positions ******************************************
    try {
        assignPositions(students);
    } catch (posError) {
        console.error('Position assignment error:', posError);
    }

    // ********************************** Return Processed Data ******************************************
    return {
        students,
        totalStudents: students.length,
        subjects: subjectColumns.map(s => s.name),
        subjectCount: subjectColumns.length,
        passingPercentage,
        subjectsToFail,
        hasFatherName: fatherNameIdx >= 0,
        headerRowIndex,
    };
}

// ********************************** Assign Class Positions Function ******************************************
function assignPositions(students) {
    if (students.length === 0) return;
    const sorted = [...students].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    let currentRank = 1, prevPercentage = null, sameCount = 0;

    sorted.forEach((student, index) => {
        const currentPct = parseFloat(student.percentage);
        if (index === 0) { student.position = currentRank; }
        else if (currentPct === prevPercentage) { sameCount++; student.position = currentRank; }
        else { currentRank = currentRank + sameCount + 1; sameCount = 0; student.position = currentRank; }

        student.rank = student.position;
        student.totalStudents = students.length;

        if (student.position > 3) student.position = null;
        prevPercentage = currentPct;
    });
}

// ********************************** Calculate Grade Function ******************************************
function calculateGrade(percentage) {
    const percent = parseFloat(percentage);
    if (percent >= 90) return 'A+';
    if (percent >= 80) return 'A';
    if (percent >= 70) return 'B+';
    if (percent >= 60) return 'B';
    if (percent >= 50) return 'C';
    if (percent >= 40) return 'D';
    return 'F';
}

// ********************************** Check Pass/Fail Function ******************************************
function checkPassFail(subjects, passingPercentage = 33, subjectsToFail = 1) {
    const failedSubjects = subjects.filter(subject => {
        if (subject.maxMarks === 0 || subject.obtainedMarks === null) return false;
        const passPercentage = (subject.obtainedMarks / subject.maxMarks) * 100;
        return passPercentage < passingPercentage;
    });
    return failedSubjects.length >= subjectsToFail ? 'FAIL' : 'PASS';
}