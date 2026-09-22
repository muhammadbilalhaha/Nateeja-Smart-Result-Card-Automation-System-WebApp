// ********************************** Main Export - Generate Result Card HTML ******************************************
export function generateResultCardHTML(student, schoolInfo = {}) {
  // ********************************** Destructure School Info with Defaults ******************************************
  const {
    selectedTemplate = 'standard',
    schoolName = 'Your School Name',
    schoolAddress = 'School Address',
    schoolLogo = null,
    logoPosition = 'center',
    academicYear = '2024-2025',
    examType = 'Final Examination'
  } = schoolInfo;

  // ********************************** Template Selection ******************************************
  switch (selectedTemplate) {
    case 'narrative':
      return generateNarrativeTemplate(student, schoolInfo);
    case 'modern':
      return generateModernTemplate(student, schoolInfo);
    case 'colorful':
      return generateColorfulTemplate(student, schoolInfo);
    default:
      return generateStandardTemplate(student, schoolInfo);
  }
}

// ********************************** Helper - Get Logo Alignment Style ******************************************
function getLogoAlignment(position) {
  switch (position) {
    case 'left': return 'text-align: left;';
    case 'right': return 'text-align: right;';
    default: return 'text-align: center;';
  }
}

// ********************************** Helper - Generate Logo HTML ******************************************
function getLogoHTML(logo, position) {
  return logo ? `
        <div style="${getLogoAlignment(position)} ">
            <img src="${logo}" alt="School Logo" 
                 style="max-width: 110px; max-height: 110px; display: inline-block; vertical-align: middle;" />
        </div>` : '';
}

// ********************************** Helper - Get Formatted Date ******************************************
function getFormattedDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// ********************************** Helper - Get Next Class Name ******************************************
function getNextClassFromName(className) {
  if (!className) return "Next Class";

  // Looks for a number in the string (e.g., "Class 5") and increments it to "Class 6"
  const match = className.match(/\d+/);
  if (match) {
    const nextNum = parseInt(match[0], 10) + 1;
    return className.replace(/\d+/, nextNum);
  }

  // Fallback if the class name doesn't contain a number (e.g., "Kindergarten")
  return `${className} (Promoted)`;
}
function generateStandardTemplate(student, schoolInfo) {
  const {
    schoolName, schoolAddress, schoolLogo, logoPosition,
    academicYear, examType, passingPercentage = 33,
    principalSign = null, teacherSign = null,
    subjectsToFail = 1,
    schoolEmail = "", schoolPhone = "", schoolWebsite = "",
  } = schoolInfo;

  const formattedDate = getFormattedDate();
  const formattedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const logoHTML = getLogoHTML(schoolLogo, logoPosition);

  const isPassed = student.status === "PASS";
  const statusText = isPassed ? "Passed" : "Failed";

  // Premium, print-safe semantic colors
  const statusColor = isPassed ? "#059669" : "#dc2626";
  const statusBg = isPassed ? "#f0fdf4" : "#fef2f2";
  const brandColor = "#0256b1";

  // Promotion Status
  const nextClass = getNextClassFromName(student.className);
  const promotionText = isPassed ? `PROMOTED TO ${nextClass}` : `RETAINED IN ${(student.className || 'Current Class').toUpperCase()}`;
  const promotionColor = isPassed ? brandColor : "#dc2626";
  const promotionBg = isPassed ? "#f8fafc" : "#fef2f2";
  const promotionBorder = isPassed ? "#cbd5e1" : "#fecaca";

  // Result ID / Certificate No
  const yearCode = academicYear?.replace(/[^0-9]/g, '').slice(0, 4) || '2026';
  const classCode = (student.className || 'NA').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const resultID = `RES-${yearCode}-${classCode}-${student.rollNo}`;
  const certificateNo = `ACD-${yearCode}-${String(Math.floor(Math.random() * 900000) + 100000)}`;

  // Premium SVG Icons
  const icons = {
    medal: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
    check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${promotionColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    refresh: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${promotionColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    warning: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
  };

  // Position / Rank Logic
  const getPositionBadge = () => {
    if (!student.position) return ''; // Only returns 1, 2, 3 if in top 3
    const badges = {
      1: { bg: '#f8fafc', border: brandColor, color: brandColor, text: '1st Position' },
      2: { bg: '#f8fafc', border: '#475569', color: '#475569', text: '2nd Position' },
      3: { bg: '#f8fafc', border: '#64748b', color: '#64748b', text: '3rd Position' },
    };
    const badge = badges[student.position];
    if (!badge) return '';
    return `
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
        background: ${badge.bg}; border: 1px solid ${badge.border}; border-radius: 4px;
        font-size: 10px; font-weight: 700; color: ${badge.color};">
        <span style="display: flex; align-items: center;">${icons.medal}</span>
        <span style="text-transform: uppercase; letter-spacing: 0.5px;">${badge.text}</span>
      </div>`;
  };

  // Standard Rank Display for All other students
  const getRankDisplay = () => {
    const topThreeBadge = getPositionBadge();
    if (topThreeBadge) return topThreeBadge;

    if (student.rank) {
      return `
        <div style="display: inline-flex; align-items: baseline; gap: 2px;">
          <span style="font-size: 15px; font-weight: 800; color: #334155;">${student.rank}</span>
          <span style="font-size: 10px; font-weight: 700; color: #94a3b8;">/ ${student.totalStudents || '-'}</span>
        </div>`;
    }
    return '<p style="margin: 0; font-size: 14px; color: #94a3b8; font-weight: 700;">—</p>';
  };

  // School contact info
  const contactParts = [];
  if (schoolEmail) contactParts.push(schoolEmail);
  if (schoolPhone) contactParts.push(schoolPhone);
  if (schoolWebsite) contactParts.push(schoolWebsite);
  const contactHTML = contactParts.length > 0
    ? `<p style="font-size: 9px; color: #64748b; margin: 2px 0 0 0; font-weight: 500;">${contactParts.join(' &nbsp;|&nbsp; ')}</p>` : '';

  const failedSubjects = student.subjects.filter(s => parseFloat(s.percentage) < passingPercentage);

  return `
    <div class="result-card" style="width: 210mm; height: 297mm; padding: 10mm 12mm; margin: 0 auto;
      background: white; font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; color: #0f172a; position: relative;">
      
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: ${brandColor};"></div>
      <div style="position: absolute; top: 6px; left: 0; right: 0; height: 1px; background: #e2e8f0;"></div>
      
      <div style=" margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; margin-top: 4px;">
          <p style="margin: 0; font-size: 7px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;"><b>Result ID: ${resultID}</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0;">
        <div >${logoHTML}</div>
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin: 0; letter-spacing: -0.5px; line-height: 1.1;">${schoolName}</h1>
        <p style="font-size: 10px; color: #475569;font-weight: 500;">${schoolAddress}</p>
        ${contactHTML}
        <div style="margin-top: 6px;">
          <span style="font-size: 9px; font-weight: 700; color: #ffffff; background: ${brandColor}; padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #014691;">
            ${examType} — ${academicYear}
          </span>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: stretch; margin-bottom: 10px; gap: 8px;">
        <div style="flex: 1; display: flex; flex-wrap: wrap; gap: 14px; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fafafa;">
          <div>
            <p style="margin: 0; font-size: 7px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Student Name</p>
            <p style="margin: 1px 0 0 0; font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase;">${student.name}</p>
          </div>
          ${student.fatherName ? `
          <div>
            <p style="margin: 0; font-size: 7px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Father's Name</p>
            <p style="margin: 1px 0 0 0; font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase;">${student.fatherName}</p>
          </div>` : ''}
          <div>
            <p style="margin: 0; font-size: 7px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Roll Number</p>
            <p style="margin: 1px 0 0 0; font-size: 11px; font-weight: 800; color: #334155;">${student.rollNo}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 7px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Class / Grade</p>
            <p style="margin: 1px 0 0 0; font-size: 11px; font-weight: 800; color: #334155;">${student.className || "N/A"}</p>
          </div>
          ${student.section ? `
          <div>
            <p style="margin: 0; font-size: 7px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Section</p>
            <p style="margin: 1px 0 0 0; font-size: 11px; font-weight: 800; color: #334155;">${student.section}</p>
          </div>` : ''}
        </div>
        
        <div style="flex-shrink: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff; min-width: 80px;">
          <p style="margin: 0 0 4px 0; font-size: 7px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Class Rank</p>
          ${getRankDisplay()}
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 6px 8px; text-align: left; font-size: 9px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">Subject</th>
            <th style="padding: 6px 8px; text-align: center; font-size: 9px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; width: 12%;">Max Marks</th>
            <th style="padding: 6px 8px; text-align: center; font-size: 9px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; width: 14%;">Obtained</th>
            <th style="padding: 6px 8px; text-align: center; font-size: 9px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; width: 12%;">Percentage</th>
            <th style="padding: 6px 8px; text-align: center; font-size: 9px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; width: 12%;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${student.subjects.map((s, i) => {
    const subPct = parseFloat(s.percentage);
    const subFailed = subPct < passingPercentage;
    return `
              <tr style="background: ${i % 2 === 0 ? "#ffffff" : "#f8fafc"}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 5px 8px; font-size: 10px; font-weight: 700; color: #0f172a; text-transform: uppercase;">${s.name}</td>
                <td style="padding: 5px 8px; text-align: center; font-size: 10px; color: #475569; font-weight: 600;">${s.maxMarks}</td>
                <td style="padding: 5px 8px; text-align: center; font-size: 10px; color: ${subFailed ? '#dc2626' : '#0f172a'}; font-weight: 800;">${s.obtainedMarks}</td>
                <td style="padding: 5px 8px; text-align: center; font-size: 10px; color: ${subFailed ? '#dc2626' : '#0f172a'}; font-weight: 800;">${s.percentage}%</td>
                <td style="padding: 5px 8px; text-align: center; font-size: 9px;">
                  <span style="display: inline-block; padding: 2px 6px; font-weight: 800; border-radius: 2px; text-transform: uppercase; font-size: 8px; letter-spacing: 0.5px;
                    border: 1px solid ${subFailed ? '#fecaca' : '#cbd5e1'};
                    background: ${subFailed ? '#fef2f2' : '#ffffff'}; 
                    color: ${subFailed ? '#dc2626' : '#334155'};">
                    ${subFailed ? 'Failed' : 'Passed'}
                  </span>
                </td>
              </tr>`;
  }).join("")}
        </tbody>
        <tfoot>
          <tr style="background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1;">
            <td style="padding: 6px 8px; font-size: 10px; color: #0f172a; text-transform: uppercase;">Grand Total</td>
            <td style="padding: 6px 8px; text-align: center; font-size: 10px; color: #0f172a;">${student.totalMarks}</td>
            <td style="padding: 6px 8px; text-align: center; font-size: 11px; color: ${brandColor};">${student.totalObtained}</td>
            <td style="padding: 6px 8px; text-align: center; font-size: 11px; color: ${brandColor};">${student.percentage}%</td>
            <td style="padding: 6px 8px; text-align: center; font-size: 10px; color: ${statusColor}; text-transform: uppercase;">${statusText}</td>
          </tr>
        </tfoot>
      </table>

      ${!isPassed && failedSubjects.length > 0 ? `
      <div style="margin: 4px 0 8px 0; padding: 6px 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: 9px; color: #b91c1c; display: flex; align-items: center; gap: 6px;">
        <span style="display: flex; align-items: center;">${icons.warning}</span>
        <span><strong style="text-transform: uppercase; letter-spacing: 0.5px;">Attention Required:</strong> Scored below ${passingPercentage}% threshold in: ${failedSubjects.map(s => s.name).join(', ')}</span>
      </div>` : ''}

      <div style="margin: 4px 0 8px 0; font-size: 8px; color: #64748b; text-align: right; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Minimum Passing: ${passingPercentage}% &nbsp;|&nbsp; Retention Trigger: &ge; ${subjectsToFail} Failed Subject(s)
      </div>

      <div style="display: flex; align-items: center; justify-content: center; padding: 10px 12px; background: ${promotionBg}; border: 1px solid ${promotionBorder}; border-radius: 6px; margin-bottom: 10px; gap: 10px;">
        <span style="display: flex; align-items: center; padding: 4px; background: #ffffff; border: 1px solid ${promotionBorder}; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          ${isPassed ? icons.check : icons.refresh}
        </span>
        <div style="text-align: left;">
          <p style="margin: 0; font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Official Academic Status</p>
          <p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 800; color: ${promotionColor}; letter-spacing: 0.5px;">${promotionText}</p>
        </div>
      </div>

      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <div style="flex: 1; text-align: center; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff;">
          <p style="margin: 0; font-size: 7px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Aggregate Score</p>
          <p style="margin: 2px 0 0 0; font-size: 14px; font-weight: 800; color: ${brandColor};">${student.percentage}%</p>
        </div>
        <div style="flex: 1; text-align: center; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff;">
          <p style="margin: 0; font-size: 7px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Final Grade</p>
          <p style="margin: 2px 0 0 0; font-size: 14px; font-weight: 800; color: #0f172a;">${student.grade || "—"}</p>
        </div>
        <div style="flex: 1; text-align: center; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #ffffff;">
          <p style="margin: 0; font-size: 7px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Overall Standing</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; font-weight: 800; color: ${statusColor}; text-transform: uppercase; letter-spacing: 0.5px;">${statusText}</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc;">
        <div style="flex: 1; padding-right: 10px;">
          <h4 style="margin: 0 0 2px 0; font-size: 8px; font-weight: 800; text-transform: uppercase; color: #334155; letter-spacing: 0.5px;">Principal / Teacher Remarks</h4>
          <p style="color: #0f172a; font-size: 10px; margin: 0; font-weight: 600; line-height: 1.4;">
            ${isPassed
      ? `Congratulations on a successful academic term. Passed with an aggregate of ${student.percentage}%. Keep up the excellent effort.`
      : `Academic intervention required. Did not meet the threshold in ${failedSubjects.length} subject(s). Sustained effort is necessary for improvement.`}
          </p>
        </div>
      </div>

      <div style="position: absolute; bottom: 12mm; left: 12mm; right: 12mm; display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #e2e8f0; padding-top: 12px;">
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="/logo.png" style="height: 24px; width: auto; object-fit: contain; opacity: 0.9;" alt="System Logo" />
          <div style="font-size: 8px; color: #64748b; line-height: 1.4;">
            <div style="font-weight: 600;">Issue Date: <span style="color: #0f172a; font-weight: 700;">${formattedDate}</span></div>
            <div style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-size: 7px;">Authenticated Document</div>
          </div>
        </div>

        <div style="display: flex; gap: 40px; align-items: flex-end;">
          <div style="text-align: center; width: 100px;">
            ${teacherSign ? `<img src="${teacherSign}" alt="Teacher Sign" style="max-width: 140px; max-height: 70px; display: block; margin: 0 auto 4px; object-fit: contain;" />` : `<div style="height: 24px; border-bottom: 1px solid #cbd5e1; margin-bottom: 4px;"></div>`}
            <p style="margin: 0; font-size: 8px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">Class Teacher</p>
          </div>
          <div style="text-align: center; width: 100px;">
            ${principalSign ? `<img src="${principalSign}" alt="Principal Sign" style="max-width: 140px; max-height: 70px; display: block; margin: 0 auto 4px; object-fit: contain;" />` : `<div style="height: 24px; border-bottom: 1px solid #cbd5e1; margin-bottom: 4px;"></div>`}
            <p style="margin: 0; font-size: 8px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">Principal</p>
          </div>
        </div>

      </div>
    </div>`;
}

function generateNarrativeTemplate(student, schoolInfo) {
  const {
    schoolName,
    schoolAddress,
    schoolLogo,
    logoPosition,
    academicYear,
    examType,
    principalSign = null,
    teacherSign = null,
    passingPercentage = 33,
    subjectsToFail = 1,
    schoolEmail = "",
    schoolPhone = "",
    schoolWebsite = "",
  } = schoolInfo;

  const formattedDate = getFormattedDate();
  const logoHTML = getLogoHTML(schoolLogo, logoPosition);

  const isPassed = student.status === "PASS";
  const statusColor = isPassed ? "#166534" : "#991b1b";
  const statusText = isPassed ? "Satisfactory / Passed" : "Requires Improvement / Failed";

  const yearCode = academicYear?.replace(/[^0-9]/g, '').slice(0, 4) || new Date().getFullYear().toString();
  const classCode = (student.className || 'NA').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const resultID = `RES-${yearCode}-${classCode}-${student.rollNo}`;

  const nextClass = getNextClassFromName(student.className);
  const promotionText = isPassed ? `PROMOTED TO ${nextClass}` : `RETAINED IN ${(student.className || 'Current Class').toUpperCase()}`;

  const failedSubjects = student.subjects.filter(s => parseFloat(s.percentage) < passingPercentage);

  const position = student.position || null;
  const getPositionBadge = () => {
    if (!position) return '';
    const text = position === 1 ? 'First' : position === 2 ? 'Second' : position === 3 ? 'Third' : `${position}th`;
    return `
      <div style="display: inline-block; padding: 2px 8px; border: 1px solid #b45309; background: #fffbeb; color: #92400e; font-family: system-ui, sans-serif; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px;">
        Awarded ${text} Honors
      </div>`;
  };

  const contactParts = [];
  if (schoolEmail) contactParts.push(schoolEmail);
  if (schoolPhone) contactParts.push(schoolPhone);
  if (schoolWebsite) contactParts.push(schoolWebsite);
  const contactHTML = contactParts.length > 0
    ? `<p style="font-family: system-ui, sans-serif; font-size: 8px; color: #64748b; margin: 2px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">${contactParts.join(' &nbsp;|&nbsp; ')}</p>` : '';

  return `
    <div class="result-card" style="width: 210mm; height: 297mm; padding: 8mm 10mm; margin: 0 auto;
      background: white; font-family: 'Georgia', 'Times New Roman', serif; box-sizing: border-box; color: #1e293b; position: relative;">
      
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #0f172a; border-bottom: 2px solid #b45309;"></div>
      
      <div style="margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; margin-top: 2px; font-family: system-ui, sans-serif;">
          <p style="margin: 0; font-size: 7px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;"><b>Result ID:</b> ${resultID}</p>
      </div>

      <div style="text-align: center; margin-bottom: 10px;">
        <div style="margin-bottom: 4px;">${logoHTML}</div>
        <h1 style="font-size: 20px; font-weight: 400; color: #0f172a; text-transform: uppercase; letter-spacing: 2px; margin: 0; line-height: 1.1;">${schoolName}</h1>
        <p style="font-family: system-ui, sans-serif; font-size: 9px; color: #64748b; margin: 2px 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">${schoolAddress}</p>
        ${contactHTML}
        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 6px;">
          <h2 style="font-size: 13px; font-weight: 400; font-style: italic; color: #334155; margin: 0;">Official Statement of Academic Record</h2>
          <p style="font-family: system-ui, sans-serif; font-size: 9px; color: #b45309; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin: 1px 0 0 0;">${examType} — ${academicYear}</p>
        </div>
      </div>

      <hr style="border: 0; height: 1px; background: #cbd5e1; margin-bottom: 10px;" />

      <div style="margin-bottom: 12px; padding: 0 4px;">
        <p style="margin: 0; font-size: 11.5px; color: #334155; line-height: 1.5; text-align: justify;">
          This official document serves to certify that <strong style="color: #0f172a; text-transform: uppercase;">${student.name}</strong>${student.fatherName ? `, son/daughter of <strong>${student.fatherName}</strong>` : ''}, 
          holding Registered Identification <span style="font-family: system-ui, sans-serif; font-weight: 600; font-size: 10px;">${student.rollNo}</span>, 
          enrolled in Class <strong style="color: #0f172a;">${student.className || 'N/A'}</strong>${student.section ? ` (Section <strong>${student.section}</strong>)` : ''}, has completed the academic evaluation for the 
          <strong>${academicYear}</strong> session. ${student.rank ? `The student achieved a class rank of <strong>${student.rank}</strong> out of <strong>${student.totalStudents || '-'}</strong> total candidates.` : ''} The following tabulation represents a true and accurate record of their performance across examined disciplines.
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 6px; font-family: system-ui, sans-serif;">
        <thead>
          <tr style="border-bottom: 1.5px solid #0f172a;">
            <th style="padding: 5px 6px; text-align: left; font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Course / Discipline</th>
            <th style="padding: 5px 6px; text-align: center; font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: 22%;">Score (Obt / Max)</th>
            <th style="padding: 5px 6px; text-align: center; font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: 15%;">Percentage</th>
            <th style="padding: 5px 6px; text-align: center; font-size: 8.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; width: 15%;">Letter Grade</th>
          </tr>
        </thead>
        <tbody>
          ${student.subjects.map((s) => {
    const subPct = parseFloat(s.percentage);
    const isF = subPct < passingPercentage;
    const grade = subPct >= 90 ? 'A+' : subPct >= 80 ? 'A' : subPct >= 70 ? 'B' : subPct >= 60 ? 'C' : subPct >= passingPercentage ? 'D' : 'F';

    return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 5px 6px; font-size: 10px; font-weight: 600; color: #1e293b; text-transform: uppercase;">${s.name}</td>
              <td style="padding: 5px 6px; text-align: center; font-size: 10px; color: #475569;">
                <span style="font-weight: 700; color: ${isF ? '#991b1b' : '#0f172a'};">${s.obtainedMarks}</span> <span style="color: #94a3b8; font-size: 9px; margin: 0 1px;">/</span> ${s.maxMarks}
              </td>
              <td style="padding: 5px 6px; text-align: center; font-size: 10px; font-weight: 600; color: ${isF ? '#991b1b' : '#334155'};">${s.percentage}%</td>
              <td style="padding: 5px 6px; text-align: center; font-size: 11px; font-weight: 700; font-family: 'Georgia', serif; color: ${isF ? '#991b1b' : '#0f172a'};">${grade}</td>
            </tr>
          `}).join('')}
        </tbody>
        <tfoot>
          <tr style="border-top: 1.5px solid #0f172a; background: #f8fafc;">
            <td style="padding: 6px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">Cumulative Aggregate</td>
            <td style="padding: 6px; text-align: center; font-size: 11px; font-weight: 700; color: #0f172a;">${student.totalObtained} <span style="color: #94a3b8; font-size: 9px; font-weight: 500;">/ ${student.totalMarks}</span></td>
            <td style="padding: 6px; text-align: center; font-size: 11px; font-weight: 700; color: #0f172a;">${student.percentage}%</td>
            <td style="padding: 6px; text-align: center; font-size: 12px; font-weight: 700; font-family: 'Georgia', serif; color: #0f172a;">${student.grade || '-'}</td>
          </tr>
        </tfoot>
      </table>

      ${!isPassed && failedSubjects.length > 0 ? `
      <div style="margin: 0 0 8px 0; padding: 4px 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 2px; font-family: system-ui, sans-serif; font-size: 8.5px; color: #991b1b;">
        <strong style="text-transform: uppercase; letter-spacing: 0.5px;">Academic Notice:</strong> Did not meet ${passingPercentage}% threshold in: ${failedSubjects.map(s => s.name).join(', ')}.
      </div>` : ''}

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 10px; gap: 12px;">
        <div>
          <p style="margin: 0; font-family: system-ui, sans-serif; font-size: 8px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Final Percentage</p>
          <p style="margin: 2px 0 0 0; font-size: 16px; font-family: system-ui, sans-serif; font-weight: 800; color: #0f172a;">${student.percentage}%</p>
        </div>
        <div style="width: 1px; height: 22px; background: #cbd5e1;"></div>
        <div style="text-align: center;">
          <p style="margin: 0; font-family: system-ui, sans-serif; font-size: 8px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Academic Standing</p>
          <p style="margin: 2px 0 0 0; font-size: 10.5px; font-family: system-ui, sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: ${statusColor};">${statusText}</p>
        </div>
        <div style="width: 1px; height: 22px; background: #cbd5e1;"></div>
        <div style="text-align: right;">
          <p style="margin: 0; font-family: system-ui, sans-serif; font-size: 8px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Official Committee Resolution</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-family: system-ui, sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${isPassed ? '#0f172a' : '#991b1b'};">${promotionText}</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 4px; margin-bottom: 4px;">
        <p style="margin: 0; font-style: italic; color: #475569; font-size: 11px;">
          ${isPassed
      ? 'The faculty extends its commendations on the successful completion of these requirements.'
      : 'The student is advised to consult with their academic counselor regarding probationary measures.'}
        </p>
        <div>${getPositionBadge()}</div>
      </div>

      <div style="position: absolute; bottom: 8mm; left: 10mm; right: 10mm; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #cbd5e1; padding-top: 8px;">
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="/logo.png" style="height: 22px; width: auto; object-fit: contain; opacity: 0.8;" alt="System Logo" />
          <div style="font-family: system-ui, sans-serif; font-size: 8px; color: #64748b; line-height: 1.3;">
            <div style="font-weight: 500;">Issued: <span style="color: #0f172a; font-weight: 600;">${formattedDate}</span></div>
            <div style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; font-size: 6.5px; margin-top: 1px;">Official Document via Nateeja</div>
          </div>
        </div>

        <div style="display: flex; gap: 30px; font-family: 'Georgia', serif;">
          <div style="text-align: center; width: 100px;">
            ${teacherSign ? `<img src="${teacherSign}" alt="Teacher Sign" style="max-width: 120px; max-height: 45px; display: block; margin: 0 auto 2px; object-fit: contain;" />` : `<div style="height: 22px; border-bottom: 1px solid #94a3b8; margin-bottom: 4px;"></div>`}
            <p style="margin: 0; font-size: 10px; font-style: italic; color: #334155;">Instructor Signature</p>
          </div>
          <div style="text-align: center; width: 100px;">
            ${principalSign ? `<img src="${principalSign}" alt="Principal Sign" style="max-width: 120px; max-height: 45px; display: block; margin: 0 auto 2px; object-fit: contain;" />` : `<div style="height: 22px; border-bottom: 1px solid #94a3b8; margin-bottom: 4px;"></div>`}
            <p style="margin: 0; font-size: 10px; font-style: italic; color: #334155;">Principal Signature</p>
          </div>
        </div>

      </div>
    </div>`;
}

function generateModernTemplate(student, schoolInfo) {
  const { schoolName, schoolAddress, schoolLogo, logoPosition, academicYear, examType, passingPercentage: pPct = 33, subjectsToFail = 1, principalSign: pSign = null, teacherSign: tSign = null, schoolEmail: sEmail = "", schoolPhone: sPhone = "", schoolWebsite: sWeb = "" } = schoolInfo;
  const fDate = getFormattedDate(), logoHTML = getLogoHTML(schoolLogo, logoPosition);
  const isP = student.status === "PASS", sColor = isP ? "#10b981" : "#e11d48", sBg = isP ? "#ecfdf5" : "#fff1f2", sBrd = isP ? "#a7f3d0" : "#fecdd3";
  const yCode = academicYear?.replace(/[^0-9]/g, '').slice(0, 4) || new Date().getFullYear();
  const cCode = (student.className || 'NA').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const resID = `RES-${yCode}-${cCode}-${student.rollNo}`, failed = student.subjects.filter(s => parseFloat(s.percentage) < pPct);
  const promoText = isP ? `PROMOTED TO ${getNextClassFromName(student.className)}` : `RETAINED IN ${(student.className || 'Current Class').toUpperCase()}`;
  const contacts = [sEmail, sPhone, sWeb].filter(Boolean).join(' &nbsp;•&nbsp; ');

  const getBadge = () => {
    const pos = student.position || student.rank;
    if (!pos) return '';
    const bMap = { 1: ['#fef3c7', '#b45309', '#fde68a'], 2: ['#f1f5f9', '#475569', '#e2e8f0'], 3: ['#ffedd5', '#c2410c', '#fed7aa'] };
    const [bg, txt, brd] = bMap[pos] || ['#f8fafc', '#475569', '#e2e8f0'];
    return `<span style="display:inline-block;background:${bg};color:${txt};border:1px solid ${brd};padding:3px 8px;border-radius:4px;font-size:9px;font-weight:800;text-transform:uppercase;">Rank: ${pos}${student.totalStudents ? ` / ${student.totalStudents}` : ''}</span>`;
  };

  return `<div style="width:210mm;height:297mm;padding:0;margin:0 auto;background:#fff;font-family:'Inter',system-ui,sans-serif;box-sizing:border-box;color:#1e293b;position:relative;">
    <div style="background:#0f172a;color:#fff;padding:6mm 12mm 5mm;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-50px;left:50%;transform:translateX(-50%);width:300px;height:100px;background:rgba(233,69,96,0.25);filter:blur(50px);border-radius:50%;"></div>
      <div style="position:relative;z-index:1;">
        ${logoHTML ? logoHTML.replace('margin-bottom: 8px', 'margin-bottom:6px') : ''}
        <h1 style="font-size:18px;margin:0;font-weight:800;text-transform:uppercase;color:#f8fafc;line-height:1.2;">${schoolName}</h1>
        <p style="font-size:10px;margin:3px 0 0;color:#94a3b8;font-weight:500;">${schoolAddress}</p>
        ${contacts ? `<p style="font-size:9px;margin:3px 0 0;color:#cbd5e1;">${contacts}</p>` : ''}
        <div style="width:30px;height:2px;background:#e94560;margin:6px auto;border-radius:2px;"></div>
        <p style="font-size:10px;margin:0;color:#cbd5e1;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${examType} <span style="color:#475569;margin:0 4px;">|</span> ${academicYear}</p>
      </div>
    </div>
    <div style="padding:5mm 10mm;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding:0 2px;">
        <p style="margin:0;font-size:8px;color:#64748b;text-transform:uppercase;font-weight:700;">System ID: <span style="color:#0f172a;">${resID}</span></p>
        <div>${getBadge()}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;">
        <div style="background:#f8fafc;padding:6px 8px;border-radius:4px;border:1px solid #e2e8f0;grid-column:span ${student.fatherName ? 1 : 2};">
          <p style="margin:0 0 2px;font-size:7px;color:#64748b;font-weight:700;text-transform:uppercase;">Student Name</p>
          <p style="margin:0;font-size:11px;font-weight:700;color:#0f172a;text-transform:uppercase;">${student.name}</p>
        </div>
        ${student.fatherName ? `<div style="background:#f8fafc;padding:6px 8px;border-radius:4px;border:1px solid #e2e8f0;"><p style="margin:0 0 2px;font-size:7px;color:#64748b;font-weight:700;text-transform:uppercase;">Father's Name</p><p style="margin:0;font-size:11px;font-weight:700;color:#0f172a;text-transform:uppercase;">${student.fatherName}</p></div>` : ''}
        <div style="background:#f8fafc;padding:6px 8px;border-radius:4px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 2px;font-size:7px;color:#64748b;font-weight:700;text-transform:uppercase;">Roll / Class / Sec</p>
          <p style="margin:0;font-size:11px;font-weight:700;color:#0f172a;">${student.rollNo} <span style="color:#cbd5e1;margin:0 1px;">•</span> ${student.className || 'N/A'}${student.section ? ` <span style="color:#cbd5e1;margin:0 1px;">•</span> ${student.section}` : ''}</p>
        </div>
        <div style="background:${sBg};padding:6px 8px;border-radius:4px;border:1px solid ${sBrd};">
          <p style="margin:0 0 2px;font-size:7px;color:${sColor};font-weight:800;text-transform:uppercase;">Status</p>
          <p style="margin:0;font-size:11px;font-weight:800;color:${sColor};">${student.status}</p>
        </div>
      </div>
      <div style="border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;margin-bottom:8px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f1f5f9;border-bottom:2px solid #e2e8f0;">
              <th style="padding:5px 8px;text-align:left;font-size:8px;font-weight:700;text-transform:uppercase;color:#475569;">Subject</th>
              <th style="padding:5px 8px;text-align:center;font-size:8px;font-weight:700;text-transform:uppercase;color:#475569;width:15%;">Max</th>
              <th style="padding:5px 8px;text-align:center;font-size:8px;font-weight:700;text-transform:uppercase;color:#475569;width:15%;">Obtained</th>
              <th style="padding:5px 8px;text-align:center;font-size:8px;font-weight:700;text-transform:uppercase;color:#475569;width:18%;">Score (%)</th>
            </tr>
          </thead>
          <tbody>
            ${student.subjects.map((s, i) => {
    const pass = parseFloat(s.percentage) >= pPct;
    return `<tr style="border-bottom:1px solid #f1f5f9;background:${i % 2 === 0 ? '#fff' : '#fafafa'};">
                <td style="padding:4px 8px;font-size:10px;font-weight:600;color:#1e293b;text-transform:uppercase;">${s.name}</td>
                <td style="padding:4px 8px;text-align:center;font-size:10px;color:#64748b;">${s.maxMarks}</td>
                <td style="padding:4px 8px;text-align:center;font-size:10px;font-weight:700;color:${pass ? '#0f172a' : '#e11d48'};">${s.obtainedMarks}</td>
                <td style="padding:4px 8px;text-align:center;">
                  <span style="display:inline-block;background:${pass ? '#ecfdf5' : '#fff1f2'};color:${pass ? '#059669' : '#e11d48'};padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700;min-width:35px;">${s.percentage}%</span>
                </td>
              </tr>`;
  }).join('')}
          </tbody>
          <tfoot>
            <tr style="background:#f8fafc;font-weight:800;border-top:2px solid #e2e8f0;">
              <td style="padding:6px 8px;font-size:9px;text-transform:uppercase;">Grand Total</td>
              <td style="padding:6px 8px;text-align:center;font-size:9px;color:#64748b;">${student.totalMarks}</td>
              <td style="padding:6px 8px;text-align:center;font-size:10px;">${student.totalObtained}</td>
              <td style="padding:6px 8px;text-align:center;"><span style="display:inline-block;background:#f1f5f9;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:800;">${student.percentage}%</span></td>
            </tr>
          </tfoot>
        </table>
      </div>
      ${!isP && failed.length > 0 ? `<div style="margin-bottom:8px;padding:4px 8px;background:#fff1f2;border-left:3px solid #e11d48;border-radius:3px;font-size:9px;color:#be123c;"><strong>Attention:</strong> Metric minimums missed in: <span style="font-weight:700;">${failed.map(s => s.name).join(', ')}</span>.</div>` : ''}
      <div style="margin:-2px 0 8px;font-size:7px;color:#94a3b8;text-align:right;font-weight:600;text-transform:uppercase;">Passing Cutoff: ${pPct}% &nbsp;|&nbsp; Limit Rule: &ge; ${subjectsToFail} Failed Course(s)</div>
      <div style="display:flex;justify-content:space-between;align-items:stretch;gap:8px;margin-bottom:8px;">
        <div style="flex:1;background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:6px;text-align:center;">
          <p style="font-size:7px;color:#64748b;font-weight:700;margin:0 0 2px;text-transform:uppercase;">Aggregate Summary</p>
          <p style="font-size:13px;font-weight:800;margin:0;">${student.totalObtained} <span style="font-size:9px;color:#94a3b8;font-weight:500;">/ ${student.totalMarks}</span></p>
        </div>
        <div style="flex:1.2;background:#0f172a;border-radius:4px;padding:6px;text-align:center;display:flex;flex-direction:column;justify-content:center;">
          <p style="font-size:7px;color:#94a3b8;font-weight:700;margin:0 0 2px;text-transform:uppercase;">Promotional Status</p>
          <p style="font-size:9px;font-weight:800;margin:0;color:#fff;text-transform:uppercase;line-height:1.2;">${promoText}</p>
        </div>
        <div style="flex:1;background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:6px;text-align:center;">
          <p style="font-size:7px;color:#64748b;font-weight:700;margin:0 0 2px;text-transform:uppercase;">Awarded Grade</p>
          <p style="font-size:14px;font-weight:800;margin:0;color:#e94560;">${student.grade || '—'}</p>
        </div>
      </div>
      <div style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;">
        <p style="margin:0 0 1px;font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;">System Verdict Remarks</p>
        <p style="margin:0;font-size:10px;font-weight:600;color:#334155;line-height:1.3;">${isP ? `Congratulations! Maintained an aggregate performance of ${student.percentage}%.` : `Academic thresholds unmet. Deficit registered in ${failed.length} core subject area(s).`}</p>
      </div>
    </div>
    <div style="position:absolute;bottom:6mm;left:10mm;right:10mm;display:flex;justify-content:space-between;align-items:flex-end;border-top:2px solid #f1f5f9;padding-top:8px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="background:#f8fafc;padding:3px;border-radius:3px;border:1px solid #e2e8f0;"><img src="/logo.png" style="height:18px;width:auto;display:block;opacity:0.9;" alt="Logo" /></div>
        <div style="line-height:1.2;">
          <div style="font-size:8px;color:#64748b;font-weight:500;">Generated: <span style="color:#0f172a;font-weight:700;">${fDate}</span></div>
          <div style="font-size:6px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Nateeja Portal Authenticated</div>
        </div>
      </div>
      <div style="display:flex;gap:20px;">
        <div style="text-align:center;width:90px;">
          ${tSign ? `<img src="${tSign}" alt="Sign" style="max-width:110px;max-height:45px;display:block;margin:0 auto 2px;object-fit:contain;" />` : `<div style="height:18px;border-bottom:1px dashed #cbd5e1;margin-bottom:3px;"></div>`}
          <p style="margin:0;font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;">Class Advisor</p>
        </div>
        <div style="text-align:center;width:90px;">
          ${pSign ? `<img src="${pSign}" alt="Sign" style="max-width:110px;max-height:45px;display:block;margin:0 auto 2px;object-fit:contain;" />` : `<div style="height:18px;border-bottom:1px dashed #cbd5e1;margin-bottom:3px;"></div>`}
          <p style="margin:0;font-size:7px;font-weight:700;color:#64748b;text-transform:uppercase;">Head of Institution</p>
        </div>
      </div>
    </div>
  </div>`;
}

function generateColorfulTemplate(student, schoolInfo) {
  const {
    schoolName,
    schoolAddress,
    schoolLogo,
    logoPosition,
    academicYear,
    examType,
    passingPercentage = 33,
    principalSign = null,
    teacherSign = null,
  } = schoolInfo;

  const formattedDate = getFormattedDate();
  const logoHTML = getLogoHTML(schoolLogo, logoPosition);

  const isPassed = student.status === "PASS";
  const statusBg = isPassed ? "#dcfce7" : "#ffe4e6";
  const statusColor = isPassed ? "#16a34a" : "#e11d48";
  const statusText = isPassed ? "Super Star! (Passed)" : "Keep Trying! (Failed)";

  const position = student.position || null;
  const getPositionBadge = () => {
    if (!position) return '';
    const badges = {
      1: { bg: '#fef08a', color: '#854d0e', icon: '1st', text: '1st Place' },
      2: { bg: '#e2e8f0', color: '#475569', icon: '2nd', text: '2nd Place' },
      3: { bg: '#fed7aa', color: '#9a3412', icon: '3rd', text: '3rd Place' },
    };
    const badge = badges[position] || { bg: '#fef9c3', color: '#ca8a04', icon: `${position}th`, text: `${position}th Place` };
    return `
      <div style="display: inline-flex; align-items: center; gap: 3px; padding: 3px 10px;
        background: ${badge.bg}; border-radius: 15px; font-size: 10px; font-weight: 800; color: ${badge.color}; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <span style="font-size: 12px;">${badge.icon}</span>
        <span style="text-transform: uppercase; letter-spacing: 0.3px;">${badge.text}</span>
      </div>`;
  };

  const failedSubjects = student.subjects.filter(s => parseFloat(s.percentage) < passingPercentage);

  return `
    <div class="result-card" style="width: 210mm; height: 297mm; padding: 8mm 12mm; margin: 0 auto;
      background: #fafaf9; font-family: 'Quicksand', 'Nunito', 'Comic Sans MS', 'Segoe UI', sans-serif; box-sizing: border-box; color: #334155; position: relative; overflow: hidden;">
      
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #ff9a9e, #fecfef, #a1c4fd, #c2e9fb, #d4fc79, #96e6a1);"></div>
      
      <div style="position: absolute; top: -30px; left: -30px; width: 100px; height: 100px; background: #fef08a; border-radius: 50%; opacity: 0.4; pointer-events: none;"></div>
      <div style="position: absolute; top: 40px; right: -40px; width: 120px; height: 120px; background: #a7f3d0; border-radius: 50%; opacity: 0.3; pointer-events: none;"></div>
      
      <div style="text-align: center; margin-bottom: 12px; position: relative; z-index: 1;">
        <div style="margin-bottom: 6px;">${logoHTML}</div>
        <h1 style="font-size: 22px; font-weight: 900; color: #6366f1; margin: 0; letter-spacing: -0.5px; text-shadow: 1px 1px 0px rgba(99, 102, 241, 0.1);">${schoolName}</h1>
        <p style="font-size: 10px; color: #64748b; margin: 3px 0 8px 0; font-weight: 600;">${schoolAddress}</p>
        <div style="display: inline-flex; align-items: center; gap: 6px; background: #fff; padding: 3px 12px; border-radius: 15px; border: 2px dashed #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <span style="font-size: 11px; font-weight: 800; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">${examType}</span>
          <span style="color: #cbd5e1;">|</span>
          <span style="font-size: 11px; color: #14b8a6; font-weight: 800; text-transform: uppercase;">${academicYear}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; position: relative; z-index: 1;">
        <div style="background: #e0f2fe; padding: 8px 10px; border-radius: 8px; border: 2px solid #bae6fd;">
          <p style="margin: 0 0 1px 0; font-size: 9px; font-weight: 800; color: #0284c7; text-transform: uppercase;">Student</p>
          <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a;">${student.name}</p>
        </div>
        <div style="background: #ffedd5; padding: 8px 10px; border-radius: 8px; border: 2px solid #fed7aa;">
          <p style="margin: 0 0 1px 0; font-size: 9px; font-weight: 800; color: #c2410c; text-transform: uppercase;">Roll Number</p>
          <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a;">${student.rollNo}</p>
        </div>
        <div style="background: #fce7f3; padding: 8px 10px; border-radius: 8px; border: 2px solid #fbcfe8;">
          <p style="margin: 0 0 1px 0; font-size: 9px; font-weight: 800; color: #be185d; text-transform: uppercase;">Class</p>
          <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a;">${student.className || "N/A"}</p>
        </div>
      </div>

      <div style="background: white; border-radius: 8px; padding: 3px; border: 2px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); margin-bottom: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #8b5cf6; color: white;">
              <th style="padding: 6px 10px; text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; border-top-left-radius: 6px;">Subject</th>
              <th style="padding: 6px 10px; text-align: center; font-size: 10px; font-weight: 800; text-transform: uppercase; width: 18%;">Total</th>
              <th style="padding: 6px 10px; text-align: center; font-size: 10px; font-weight: 800; text-transform: uppercase; width: 18%;">Score</th>
              <th style="padding: 6px 10px; text-align: center; font-size: 10px; font-weight: 800; text-transform: uppercase; width: 18%; border-top-right-radius: 6px;">Grade %</th>
            </tr>
          </thead>
          <tbody>
            ${student.subjects.map((s, i) => {
    const subPct = parseFloat(s.percentage);
    const subFailed = subPct < passingPercentage;
    const rowBg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
    return `
                <tr style="background: ${rowBg}; border-bottom: 1px dashed #e2e8f0;">
                  <td style="padding: 5px 10px; font-size: 11px; font-weight: 700; color: #475569;">${s.name}</td>
                  <td style="padding: 5px 10px; text-align: center; font-size: 11px; font-weight: 600; color: #94a3b8;">${s.maxMarks}</td>
                  <td style="padding: 5px 10px; text-align: center; font-size: 12px; font-weight: 800; color: ${subFailed ? '#e11d48' : '#334155'};">${s.obtainedMarks}</td>
                  <td style="padding: 5px 10px; text-align: center;">
                    <span style="display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 10px; font-weight: 800;
                      background: ${subFailed ? '#ffe4e6' : '#f0fdf4'}; color: ${subFailed ? '#e11d48' : '#16a34a'};">
                      ${s.percentage}%
                    </span>
                  </td>
                </tr>`;
  }).join("")}
          </tbody>
        </table>
      </div>

      ${!isPassed && failedSubjects.length > 0 ? `
      <div style="margin-bottom: 12px; padding: 6px 10px; background: #fff1f2; border: 2px dashed #fda4af; border-radius: 8px; font-size: 11px; color: #be123c; font-weight: 600;">
        Let's practice more on: <strong>${failedSubjects.map(s => s.name).join(', ')}</strong>. You can do it!
      </div>` : ''}

      <div style="display: flex; gap: 10px; margin-bottom: 12px;">
        <div style="flex: 1; text-align: center; padding: 8px; border-radius: 8px; background: #f0fdf4; border: 2px solid #bbf7d0;">
          <p style="margin: 0 0 2px 0; font-size: 10px; font-weight: 800; color: #16a34a; text-transform: uppercase;">Total Score</p>
          <p style="margin: 0; font-size: 16px; font-weight: 900; color: #14532d;">${student.totalObtained} <span style="font-size: 11px; color: #22c55e;">/ ${student.totalMarks}</span></p>
        </div>
        <div style="flex: 1; text-align: center; padding: 8px; border-radius: 8px; background: #eff6ff; border: 2px solid #bfdbfe;">
          <p style="margin: 0 0 2px 0; font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase;">Percentage</p>
          <p style="margin: 0; font-size: 16px; font-weight: 900; color: #1e3a8a;">${student.percentage}%</p>
        </div>
        <div style="flex: 1; text-align: center; padding: 8px; border-radius: 8px; background: #fdf4ff; border: 2px solid #fbcfe8;">
          <p style="margin: 0 0 2px 0; font-size: 10px; font-weight: 800; color: #c026d3; text-transform: uppercase;">Grade</p>
          <p style="margin: 0; font-size: 16px; font-weight: 900; color: #701a75;">${student.grade || "—"}</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: ${statusBg}; border: 2px dashed ${isPassed ? '#86efac' : '#fecdd3'}; border-radius: 12px;">
        <div>
          <p style="margin: 0 0 2px 0; font-size: 10px; font-weight: 800; color: ${statusColor}; text-transform: uppercase;">Teacher's Note</p>
          <p style="margin: 0; font-size: 12px; font-weight: 800; color: ${isPassed ? '#14532d' : '#881337'};">${statusText}</p>
        </div>
        <div>${getPositionBadge()}</div>
      </div>

      <div style="position: absolute; bottom: 8mm; left: 12mm; right: 12mm; display: flex; justify-content: space-between; align-items: flex-end; border-top: 3px dotted #cbd5e1; padding-top: 10px;">
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="/logo.png" style="height: 22px; width: auto; object-fit: contain;" alt="System Logo" />
          <div style="line-height: 1.2;">
            <div style="font-size: 9px; font-weight: 700; color: #64748b;">Printed: <span style="color: #334155;">${formattedDate}</span></div>
            <div style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 1px;">Verified by Nateeja</div>
          </div>
        </div>

        <div style="display: flex; gap: 30px;">
          <div style="text-align: center; width: 90px;">
            ${teacherSign ? `<img src="${teacherSign}" alt="Teacher Sign" style="max-width: 100px; max-height: 45px; display: block; margin: 0 auto 3px; object-fit: contain;" />` : `<div style="height: 20px; border-bottom: 2px solid #94a3b8; margin-bottom: 4px;"></div>`}
            <p style="margin: 0; font-size: 9px; font-weight: 800; color: #475569; text-transform: uppercase;">Teacher</p>
          </div>
          <div style="text-align: center; width: 90px;">
            ${principalSign ? `<img src="${principalSign}" alt="Principal Sign" style="max-width: 100px; max-height: 45px; display: block; margin: 0 auto 3px; object-fit: contain;" />` : `<div style="height: 20px; border-bottom: 2px solid #94a3b8; margin-bottom: 4px;"></div>`}
            <p style="margin: 0; font-size: 9px; font-weight: 800; color: #475569; text-transform: uppercase;">Principal</p>
          </div>
        </div>

      </div>
    </div>`;
}