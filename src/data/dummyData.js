// Previous dummy data remains...
export const dummyUploadState = {
  isFileLoaded: false,
  fileName: null,
  studentCount: 0,
};

export const dummyProjects = [
  { id: 1, name: "Grade 10 Final", students: 240, timeAgo: "2h ago" },
  { id: 2, name: "Mid-term Results", students: 185, timeAgo: "Yesterday" },
];

export const dummyTemplate = {
  id: "standard",
  name: "Standard",
  description: "Optimized for regional Ministry of Education requirements.",
};

export const dummyStudents = [
  { rollNo: "2024-001", name: "Alex Thompson", math: 92, science: 88, english: 95, history: 90, avg: 91.2, status: "pass" },
  { rollNo: "2024-002", name: "Sarah Mitchell", math: 76, science: 82, english: 79, history: 85, avg: 80.5, status: "pass" },
  { rollNo: "2024-003", name: "Jordan Rivera", math: 45, science: 52, english: 48, history: 50, avg: 48.7, status: "fail" },
  { rollNo: "2024-004", name: "Elena Rodriguez", math: 88, science: 94, english: 91, history: 93, avg: 91.5, status: "pass" },
  { rollNo: "2024-005", name: "Liam Watson", math: 67, science: 70, english: 72, history: 65, avg: 68.5, status: "pass" },
  { rollNo: "2024-006", name: "Sophie Zhang", math: 98, science: 96, english: 99, history: 97, avg: 97.5, status: "pass" },
  { rollNo: "2024-007", name: "Daniel Choi", math: 55, science: 58, english: 60, history: 52, avg: 56.2, status: "pass" },
  { rollNo: "2024-008", name: "Maya Patel", math: 84, science: 81, english: 86, history: 89, avg: 85.0, status: "pass" },
];

export const dummySubjects = [
  { name: "Mathematics", percentage: 100 },
  { name: "Science", percentage: 94 },
  { name: "English", percentage: 100 },
  { name: "History", percentage: 88 },
];

// ADD THIS FOR GENERATE PAGE
export const dummyBatchDetails = {
  academicTerm: "Fall 2023",
  classRecords: "Grade 10-A, 10-B",
  totalStudents: 142,
  format: "Digital PDF + Printed",
};

export const dummyProcessingSteps = [
  { text: "Processed: Student #88 - Amara Okafor", status: "completed" },
  { text: "Validated: Grade 10 Mathematics results", status: "completed" },
  { text: "Encrypting: Batch #1024-PDF", status: "processing" },
  { text: "Generating PDF files", status: "pending" },
  { text: "Archiving to cloud storage", status: "pending" },
];