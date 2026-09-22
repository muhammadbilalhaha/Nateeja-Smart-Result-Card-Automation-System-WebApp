// lib/sampleExcel.js
import * as XLSX from 'xlsx';

// ********************************** Sample Data ******************************************
// Realistic Pakistani middle-school result sheet.
//  • 11 subjects (mixed out-of-100 and out-of-50)
//  • Section variety (A / B / C)
//  • One absent student (empty cell for a subject)
//  • Realistic performance spread: toppers, average, borderline, and fail cases
//  • Includes admin columns (Sr. No., Rank, Total, %, Status, Remarks) that the
//    parser should auto-ignore so the sample exercises the full detection pipeline.

const SAMPLE_STUDENTS = [
    {
        'Sr. No.': 1,
        'Roll No': 101, 'Name': 'Ayesha Khan', 'Father Name': 'Imran Khan',
        'Class': 5, 'Section': 'A', 'DOB': '2015-03-12',
        'English (100)': 95, 'Urdu (100)': 90, 'Mathematics (100)': 92,
        'Science (100)': 88, 'Islamiat (100)': 87, 'Social Studies (100)': 91,
        'Computer (50)': 48, 'Physical Education (50)': 45,
        'Art (50)': 47, 'Arabic (50)': 42, 'General Knowledge (50)': 46,
        'Remarks': 'Outstanding',
    },
    {
        'Sr. No.': 2,
        'Roll No': 102, 'Name': 'Bilal Ahmed', 'Father Name': 'Rashid Ahmed',
        'Class': 5, 'Section': 'A', 'DOB': '2015-06-24',
        'English (100)': 69, 'Urdu (100)': 74, 'Mathematics (100)': 78,
        'Science (100)': 82, 'Islamiat (100)': 80, 'Social Studies (100)': 76,
        'Computer (50)': 41, 'Physical Education (50)': 44,
        'Art (50)': 38, 'Arabic (50)': 35, 'General Knowledge (50)': 40,
        'Remarks': 'Good',
    },
    {
        'Sr. No.': 3,
        'Roll No': 103, 'Name': 'Chandni Fatima', 'Father Name': 'Ali Raza',
        'Class': 5, 'Section': 'A', 'DOB': '2015-09-08',
        'English (100)': 58, 'Urdu (100)': 66, 'Mathematics (100)': 55,
        'Science (100)': 61, 'Islamiat (100)': 72, 'Social Studies (100)': 63,
        'Computer (50)': 31, 'Physical Education (50)': 38,
        'Art (50)': 42, 'Arabic (50)': 29, 'General Knowledge (50)': 34,
        'Remarks': 'Average',
    },
    {
        'Sr. No.': 4,
        'Roll No': 104, 'Name': 'Danish Iqbal', 'Father Name': 'Zafar Iqbal',
        'Class': 5, 'Section': 'A', 'DOB': '2015-11-19',
        'English (100)': 52, 'Urdu (100)': 60, 'Mathematics (100)': 30,
        'Science (100)': 45, 'Islamiat (100)': 55, 'Social Studies (100)': 42,
        'Computer (50)': 22, 'Physical Education (50)': 30,
        'Art (50)': 35, 'Arabic (50)': 18, 'General Knowledge (50)': 25,
        'Remarks': 'Needs Improvement',
    },
    {
        'Sr. No.': 5,
        'Roll No': 105, 'Name': 'Eman Noor', 'Father Name': 'Salman Noor',
        'Class': 5, 'Section': 'A', 'DOB': '2015-01-30',
        'English (100)': 85, 'Urdu (100)': 79, 'Mathematics (100)': 88,
        'Science (100)': 91, 'Islamiat (100)': 92, 'Social Studies (100)': 84,
        'Computer (50)': 44, 'Physical Education (50)': 47,
        'Art (50)': 41, 'Arabic (50)': 39, 'General Knowledge (50)': 43,
        'Remarks': 'Excellent',
    },
    {
        'Sr. No.': 6,
        'Roll No': 106, 'Name': 'Farhan Malik', 'Father Name': 'Nadeem Malik',
        'Class': 5, 'Section': 'A', 'DOB': '2015-07-14',
        'English (100)': 75, 'Urdu (100)': 70, 'Mathematics (100)': 72,
        'Science (100)': 68, 'Islamiat (100)': 66, 'Social Studies (100)': 73,
        'Computer (50)': 37, 'Physical Education (50)': 40,
        'Art (50)': 33, 'Arabic (50)': 30, 'General Knowledge (50)': 36,
        'Remarks': 'Good',
    },
    {
        'Sr. No.': 7,
        'Roll No': 107, 'Name': 'Gul Nawaz', 'Father Name': 'Akbar Nawaz',
        'Class': 5, 'Section': 'A', 'DOB': '2015-04-02',
        'English (100)': 48, 'Urdu (100)': 42, 'Mathematics (100)': 40,
        'Science (100)': 35, 'Islamiat (100)': 50, 'Social Studies (100)': 38,
        'Computer (50)': 19, 'Physical Education (50)': 28,
        'Art (50)': 30, 'Arabic (50)': 22, 'General Knowledge (50)': 27,
        'Remarks': 'Weak',
    },
    {
        'Sr. No.': 8,
        'Roll No': 108, 'Name': 'Hina Tariq', 'Father Name': 'Tariq Mehmood',
        'Class': 5, 'Section': 'A', 'DOB': '2015-12-05',
        'English (100)': 98, 'Urdu (100)': 91, 'Mathematics (100)': 96,
        'Science (100)': 94, 'Islamiat (100)': 95, 'Social Studies (100)': 97,
        'Computer (50)': 49, 'Physical Education (50)': 48,
        'Art (50)': 46, 'Arabic (50)': 47, 'General Knowledge (50)': 49,
        'Remarks': 'Topper',
    },
    {
        'Sr. No.': 9,
        'Roll No': 109, 'Name': 'Imad Hussain', 'Father Name': 'Mazhar Hussain',
        'Class': 5, 'Section': 'A', 'DOB': '2015-08-21',
        'English (100)': 62, 'Urdu (100)': 68, 'Mathematics (100)': 65,
        'Science (100)': 70, 'Islamiat (100)': 71, 'Social Studies (100)': 64,
        'Computer (50)': 34, 'Physical Education (50)': 41,
        'Art (50)': 36, 'Arabic (50)': 32, 'General Knowledge (50)': 38,
        'Remarks': 'Satisfactory',
    },
    {
        // Student absent on "Art" — one empty cell to test missing-marks handling
        'Sr. No.': 10,
        'Roll No': 110, 'Name': 'Javeria Sohail', 'Father Name': 'Sohail Anwar',
        'Class': 5, 'Section': 'A', 'DOB': '2015-05-17',
        'English (100)': 33, 'Urdu (100)': 45, 'Mathematics (100)': 25,
        'Science (100)': 28, 'Islamiat (100)': 38, 'Social Studies (100)': 31,
        'Computer (50)': 14, 'Physical Education (50)': 22,
        'Art (50)': '', 'Arabic (50)': 12, 'General Knowledge (50)': 18,
        'Remarks': 'Absent in Art',
    },
];

// ********************************** Download Helper ******************************************
export function downloadSampleExcel() {
    const worksheet = XLSX.utils.json_to_sheet(SAMPLE_STUDENTS);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // ********************************** Column Widths ******************************************
    const headers = Object.keys(SAMPLE_STUDENTS[0]);
    worksheet['!cols'] = headers.map(h => {
        if (h === 'Name' || h === 'Father Name') return { wch: 20 };
        if (h === 'Remarks') return { wch: 18 };
        if (h === 'DOB') return { wch: 12 };
        if (h === 'Sr. No.') return { wch: 8 };
        return { wch: Math.max(h.length + 2, 12) };
    });

    // ********************************** Freeze Header Row ******************************************
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    XLSX.writeFile(workbook, 'students-sample.xlsx');
}