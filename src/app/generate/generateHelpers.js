export const getSettingsFromStorage = () => {
    try {
        const saved = localStorage.getItem('schoolSettings');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to read settings:', e);
    }
    return {};
};