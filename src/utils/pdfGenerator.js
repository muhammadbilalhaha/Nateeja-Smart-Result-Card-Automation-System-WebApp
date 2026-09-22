// ********************************** Generate Date/Time String ******************************************
function getDateTimeString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// ********************************** Generate Combined PDF Function ******************************************
export async function generateCombinedPDF(students, schoolInfo, templateFunction) {
    // ********************************** Get Date/Time ******************************************
    const dateTime = getDateTimeString();
    const pageTitle = `Result Cards - ${dateTime}`;
    
    // ********************************** Open Print Window ******************************************
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    
    // ********************************** Build HTML Document ******************************************
    let html = `<!DOCTYPE html><html><head><title>${pageTitle}</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:Arial,sans-serif;background:white}
            .result-card{background:white;width:210mm;margin:0 auto;padding:15mm;page-break-after:always}
            .result-card:last-child{page-break-after:auto}
            img{max-width:70px;max-height:70px}
            table{border-collapse:collapse;width:100%}
            @media print{@page{size:A4;margin:0}.result-card{margin:0}}
        </style></head><body>`;
    
    // ********************************** Generate Cards HTML ******************************************
    students.forEach(s => html += templateFunction(s, schoolInfo));
    html += '</body></html>';
    
    // ********************************** Write & Trigger Print ******************************************
    printWindow.document.write(html);
    printWindow.document.close();
    
    // ********************************** Auto-trigger Print ******************************************
    setTimeout(() => {
        printWindow.print();
    }, 800);
    
    return true;
}

// ********************************** Print All Result Cards Function ******************************************
export function printAllResultCards(students, schoolInfo, templateFunction) {
    // ********************************** Get Date/Time ******************************************
    const dateTime = getDateTimeString();
    const pageTitle = `Result Cards - ${dateTime}`;
    
    // ********************************** Open Print Window ******************************************
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    
    // ********************************** Build HTML Document ******************************************
    let html = `<!DOCTYPE html><html><head><title>${pageTitle}</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:Arial,sans-serif;background:white}
            .result-card{background:white;width:210mm;margin:0 auto;padding:15mm;page-break-after:always}
            .result-card:last-child{page-break-after:auto}
            img{max-width:70px;max-height:70px}
            table{border-collapse:collapse;width:100%}
            @media print{@page{size:A4;margin:0}.result-card{margin:0}}
        </style></head><body>`;
    
    // ********************************** Generate Cards HTML ******************************************
    students.forEach(s => html += templateFunction(s, schoolInfo));
    html += '</body></html>';
    
    // ********************************** Write Document ******************************************
    printWindow.document.write(html);
    printWindow.document.close();
}

// ********************************** Preview Result Cards Function ******************************************
export function previewResultCards(students, schoolInfo, templateFunction) {
    // ********************************** Get Date/Time ******************************************
    const dateTime = getDateTimeString();
    const pageTitle = `Result Cards Preview - ${dateTime}`;
    
    // ********************************** Open Preview Window ******************************************
    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    
    // ********************************** Build HTML Document ******************************************
    let html = `<!DOCTYPE html><html><head><title>${pageTitle}</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:Arial,sans-serif;background:#f5f5f5;padding:20px}
            .result-card{background:white;width:210mm;margin:0 auto 20px;padding:20mm;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
            img{max-width:70px;max-height:70px}
            table{border-collapse:collapse;width:100%}
        </style></head><body>`;
    
    // ********************************** Generate Cards HTML ******************************************
    students.forEach(s => html += templateFunction(s, schoolInfo));
    html += '</body></html>';
    
    // ********************************** Write Document ******************************************
    previewWindow.document.write(html);
    previewWindow.document.close();
}