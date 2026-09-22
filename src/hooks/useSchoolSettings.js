// ********************************** Library Imports ******************************************
import { useState, useEffect } from 'react';

// ********************************** Default Settings Configuration ******************************************
const defaultSettings = {
    schoolName: "The Ideal Educational Academy",
    academicYear: "2023-2024",
    schoolAddress: "Karachi Landhi",
    selectedTemplate: "standard",
    gradeSystem: "alpha",
    showGPA: true,
    logo: null,
    logoPosition: "center",
    passingPercentage: 33,
    subjectsToFail: 1,
    examType: "Final Examination",
    stamps: [],
    principalSign: null,
    teacherSign: null,
    schoolEmail: "",
    schoolPhone: "",
    schoolWebsite: "",
};

// ********************************** useSchoolSettings Hook ******************************************
export function useSchoolSettings() {
    // ********************************** State Management ******************************************
    const [settings, setSettings] = useState(defaultSettings);

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        const savedSettings = localStorage.getItem('schoolSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (e) {
                console.error('Failed to parse settings:', e);
            }
        }
    }, []);

    // ********************************** Update Settings Function ******************************************
    const updateSettings = (newSettings) => {
        const mergedSettings = { ...defaultSettings, ...newSettings };
        setSettings(mergedSettings);
        localStorage.setItem('schoolSettings', JSON.stringify(mergedSettings));
    };

    // ********************************** Reset Settings Function ******************************************
    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.setItem('schoolSettings', JSON.stringify(defaultSettings));
    };

    // ********************************** Hook Return ******************************************
    return { settings, updateSettings, resetSettings };
}