import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'public', 'sample-documents');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createPdf(filename, title, metadata, bodyLines, syntheticDisclaimer = true) {
  const doc = new jsPDF();
  
  // Header banner
  doc.setFillColor(16, 43, 92); // Navy #102B5C
  doc.rect(0, 0, 210, 24, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Shakshya AI — Institutional Compliance Document', 15, 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Approval Process Handbook (APH 2025-26) · Verification Test Dataset', 15, 18);
  
  // Title
  doc.setTextColor(10, 25, 47);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 15, 36);
  
  // Metadata box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 42, 180, 26, 2, 2, 'FD');
  
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  let metaY = 48;
  for (const [k, v] of Object.entries(metadata)) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${k}:`, 20, metaY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${v}`, 70, metaY);
    metaY += 6;
  }
  
  // Body text
  let bodyY = 76;
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  
  for (const line of bodyLines) {
    if (line.startsWith('### ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(16, 43, 92);
      bodyY += 4;
      doc.text(line.replace('### ', ''), 15, bodyY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      bodyY += 6;
    } else if (line === '') {
      bodyY += 3;
    } else {
      const splitLines = doc.splitTextToSize(line, 180);
      doc.text(splitLines, 15, bodyY);
      bodyY += splitLines.length * 5 + 2;
    }
  }
  
  // Footer disclaimer
  if (syntheticDisclaimer) {
    doc.setDrawColor(203, 213, 225);
    doc.line(15, 270, 195, 270);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('COMPLIANCE NOTICE: This is a synthetic computer-generated document created for institutional verification testing.', 15, 276);
    doc.text('Subject to statutory verification against official Council records by authorized Scrutiny Officers.', 15, 281);
    doc.text('Shakshya AI · Page 1 of 1 · Verification Hash: SHA256-DOC-' + Buffer.from(filename).toString('hex').slice(0, 12), 15, 286);
  }
  
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log(`Generated: ${filePath}`);
}

// 1. Affidavit 2 (Matching)
createPdf(
  'affidavit-2-matching.pdf',
  'AFFIDAVIT 2 — MANDATORY COMPLIANCE DECLARATION',
  {
    'Document Type': 'AICTE Statutory Affidavit 2 (APH 2025-26)',
    'Institution Name': 'ABC College of Engineering',
    'Application ID': 'DEMO-EOA-2026-001',
    'Academic Year': '2026-2027'
  },
  [
    '### 1. Deponent Declaration',
    'I, Dr. Arvind S. Sharma, Chairman of ABC Educational & Research Foundation, solemnly affirm and state on oath that the institution "ABC College of Engineering" situated at Plot No 42, Knowledge Park III, Greater Noida, Uttar Pradesh 201306 has complied with all mandatory regulatory norms outlined in the AICTE Approval Process Handbook (APH) 2025-26.',
    '',
    '### 2. Infrastructure & Land Title Certification',
    'The land measuring 10.5 Acres is unencumbered and registered in the name of the Trust for continuous educational use. All built-up area amounting to 18,450 sq. meters adheres to AICTE Schedule 1 standard space specifications.',
    '',
    '### 3. Verification & Authenticity Undertaking',
    'All certificates attached including the Building License, Fire Safety NOC, and audited balance sheets are genuine and verified against statutory authority registers.'
  ]
);

// 2. TER Receipt (Matching)
createPdf(
  'ter-receipt-matching.pdf',
  'TER CHARGES PAYMENT RECEIPT (OFFICIAL EOA CHALLAN)',
  {
    'Document Type': 'Technical Education Regulatory (TER) Receipt',
    'Institution Name': 'ABC College of Engineering',
    'Application ID': 'DEMO-EOA-2026-001',
    'Challan Reference': 'AICTE-TER-2026-889143'
  },
  [
    '### Payment Confirmation Details',
    'Payment for AICTE Extension of Approval (EoA) fee for academic year 2026-2027 was processed successfully through the Bharatkosh national payment portal.',
    '',
    'Institution Name: ABC College of Engineering',
    'Application ID: DEMO-EOA-2026-001',
    'Fee Head: AICTE Technical Education Regulatory (TER) Processing Charges',
    'Transaction Amount: Rs. 2,00,000/- (Rupees Two Lakh Only)',
    'Payment Gateway Reference: BKN-TXN-998412850',
    'Transaction Status: SUCCESSFUL / CLEARED',
    'Payment Timestamp: 12-Feb-2026 14:32:10 IST'
  ]
);

// 3. TER Receipt (Mismatch - deliberate institutional conflict for validation testing)
createPdf(
  'ter-receipt-mismatch.pdf',
  'TER CHARGES PAYMENT RECEIPT (SAMPLE MISMATCH DATASET)',
  {
    'Document Type': 'Technical Education Regulatory (TER) Receipt',
    'Institution Name': 'XYZ Institute of Technology',
    'Application ID': 'DEMO-EOA-2026-001',
    'Challan Reference': 'AICTE-TER-2026-990145'
  },
  [
    '### Payment Confirmation Details (MISMATCH TEST SCENARIO)',
    'ATTENTION: This receipt has been synthesized to test cross-document institution name mismatch detection (RULE DEMO-EoA-002).',
    '',
    'Institution Name: XYZ Institute of Technology',
    'Application ID: DEMO-EOA-2026-001',
    'Fee Head: AICTE Technical Education Regulatory (TER) Processing Charges',
    'Transaction Amount: Rs. 2,00,000/- (Rupees Two Lakh Only)',
    'Payment Gateway Reference: BKN-TXN-441098231',
    'Transaction Status: SUCCESSFUL / CLEARED',
    'Payment Timestamp: 14-Feb-2026 11:15:44 IST'
  ]
);

// 4. Fire Safety Certificate (Matching)
createPdf(
  'fire-safety-matching.pdf',
  'FIRE SAFETY CERTIFICATE / NO OBJECTION CERTIFICATE',
  {
    'Document Type': 'State Fire Safety NOC (NBC Part IV Compliance)',
    'Institution Name': 'ABC College of Engineering',
    'NOC Reference': 'UPFS/NOC/2025/1109',
    'Validity Period': '01-Jan-2025 to 31-Dec-2027'
  },
  [
    '### Fire & Emergency Services Certification',
    'Certified that the educational premises occupied by "ABC College of Engineering" comprising Administrative Block, Instructional Wing A & B, Laboratories, and Auditorium has been inspected by the Divisional Fire Officer.',
    '',
    'All fire fighting installations including wet risers, automatic smoke detectors, dry chemical powder extinguishers, and emergency evacuation exits are in full operational readiness and conform to National Building Code (NBC) 2016 Part 4.'
  ]
);

// 5. Building License / Occupancy (Matching)
createPdf(
  'building-license-matching.pdf',
  'BUILDING LICENSE & OCCUPANCY CERTIFICATE',
  {
    'Document Type': 'Municipal Authority Occupancy Certificate',
    'Institution Name': 'ABC College of Engineering',
    'Permit Reference': 'GNIDA/PLN/BDO/2024/774',
    'Built-up Area': '18,450 sq. meters'
  },
  [
    '### Urban Development Authority Approval',
    'Sanction is hereby accorded for complete occupancy and educational use of the buildings constructed on Plot No 42, Knowledge Park III, Greater Noida, in the name of ABC College of Engineering.',
    '',
    'The structure has been inspected by authorized chartered civil engineers and certified compliant with seismic zone IV structural safety codes and municipal bylaws.'
  ]
);

// 6. Satellite Map Sample
createPdf(
  'satellite-map-sample.pdf',
  'SATELLITE MAP & GIS GEOLOCATION RECORD',
  {
    'Document Type': 'Bhuvan / GIS Geo-Spatial Land Survey',
    'Institution Name': 'ABC College of Engineering',
    'GPS Center Point': '28.4682 N, 77.4984 E',
    'Survey Plot': 'Plot No 42, Revenue Village Kasna'
  },
  [
    '### Geo-Spatial Coordinates & Perimeter Survey',
    'Perimeter Coordinates:',
    '· Boundary Point A (North-West): 28.4685 N, 77.4981 E',
    '· Boundary Point B (North-East): 28.4687 N, 77.4990 E',
    '· Boundary Point C (South-East): 28.4678 N, 77.4988 E',
    '· Boundary Point D (South-West): 28.4679 N, 77.4979 E',
    '',
    'Total Enclosed Land Area: 10.5 Acres (42,492 sq. meters) in continuous single parcel.',
    'Geo-tagging certified through AICTE Inspection mobile app coordinates synchronization.'
  ]
);

// 7. Scanned OCR Sample
createPdf(
  'scanned-ocr-sample.pdf',
  'SCANNED DOCUMENT SAMPLE (IMAGE ONLY - NO TEXT LAYER)',
  {
    'Document Type': 'Historical Archival Record (Legacy Scan)',
    'Institution Name': 'ABC College of Engineering',
    'Notice': 'Text Extraction Unavailable'
  },
  [
    '### OCR Required Notice',
    'This test document represents an unsearchable scanned bitmap or low-DPI archival image.',
    'Shakshya AI honest fallback rule: When no extractable text layer is detected, the document is categorized as "OCR Required — Text layer unavailable for automated rule extraction" rather than pretending successful text parsing.'
  ]
);

console.log('All 7 synthetic sample PDFs refreshed with official Shakshya AI compliance branding.');
