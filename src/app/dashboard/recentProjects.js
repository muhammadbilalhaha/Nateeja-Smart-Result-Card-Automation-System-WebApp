// ********************************** Constants ******************************************
const RECENT_PROJECTS_KEY = 'recentProjects';
const MAX_RECENT_PROJECTS = 3;

// ********************************** Get Recent Projects ******************************************
export function getRecentProjects() {
    try {
        const saved = localStorage.getItem(RECENT_PROJECTS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

// ********************************** Add Recent Project ******************************************
export function addRecentProject(fileName, studentCount) {
    const projects = getRecentProjects();
    const newProject = {
        id: Date.now(),
        name: fileName.replace(/\.(xlsx|xls)$/i, ''),
        students: studentCount,
        timeAgo: 'Just now',
        timestamp: new Date().toISOString()
    };

    const filtered = projects.filter(p => p.name !== newProject.name);
    const updated = [newProject, ...filtered].slice(0, MAX_RECENT_PROJECTS);

    localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
    return updated;
}

// ********************************** Update Recent Project Time Ago ******************************************
export function updateRecentProjectTimeAgo() {
    const projects = getRecentProjects();
    const updated = projects.map(p => {
        const diff = Date.now() - new Date(p.timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        let timeAgo;
        if (minutes < 1) timeAgo = 'Just now';
        else if (minutes < 60) timeAgo = `${minutes}m ago`;
        else if (hours < 24) timeAgo = `${hours}h ago`;
        else if (days === 1) timeAgo = 'Yesterday';
        else timeAgo = `${days}d ago`;

        return { ...p, timeAgo };
    });
    localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
    return updated;
}