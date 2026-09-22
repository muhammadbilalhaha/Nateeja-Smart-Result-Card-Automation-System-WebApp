// ********************************** Library Imports ******************************************
import { useState } from 'react';

// ********************************** Utility Imports ******************************************
import { processExcelFile } from '@/utils/excelProcessor';
import { generateResultCardHTML } from '@/utils/resultCardTemplate';
import { generateCombinedPDF, printAllResultCards } from '@/utils/pdfGenerator';

// ********************************** useResultGenerator Hook ******************************************
export function useResultGenerator() {
    // ********************************** State Management ******************************************
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [processingStep, setProcessingStep] = useState(0);

    // ********************************** School Info Configuration ******************************************
    const schoolInfo = {
        schoolName: 'Your School Name',
        schoolAddress: '123 Education Street, City',
        academicYear: '2024-2025',
        examType: 'Final Examination'
    };

    // ********************************** Process and Generate Function ******************************************
    const processAndGenerate = async (file, method = 'pdf') => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: Process Excel
            setProcessingStep(1);
            const data = await processExcelFile(file);
            setStudents(data.students);

            // Step 2: Generate Cards
            setProcessingStep(2);
            if (method === 'pdf') {
                await generateCombinedPDF(data.students, schoolInfo, generateResultCardHTML);
            } else if (method === 'print') {
                printAllResultCards(data.students, schoolInfo, generateResultCardHTML);
            }

            // Step 3: Complete
            setProcessingStep(3);
            return { success: true, studentCount: data.totalStudents };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // ********************************** Hook Return ******************************************
    return {
        loading,
        error,
        students,
        processingStep,
        processAndGenerate
    };
}