import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { COMPANY_INFO } from './constants';
import { formatISTDate } from './date-utils';

export interface OfferLetterData {
  documentId: string;
  studentName: string;
  studentEmail: string;
  domainName: string;
  enrollmentDateISO: string;
  startDateISO: string;
  deadlineDateISO: string;
}

export type EnrollmentLetterData = OfferLetterData;

export interface CertificateData {
  certificateId: string;
  studentName: string;
  domainName: string;
  startDateISO: string;
  endDateISO: string;
  issueDateISO: string;
}

/**
 * Generates an official Enrollment Letter as a PDF document
 */
export async function generateEnrollmentLetterPdf(data: EnrollmentLetterData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 in points
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Palette
  const navy = rgb(0.06, 0.09, 0.16); // #0f172a
  const blue = rgb(0.14, 0.38, 0.92); // #2563eb
  const grayDark = rgb(0.2, 0.25, 0.33); // #334155
  const grayLight = rgb(0.55, 0.6, 0.68); // #8c99ae
  const borderNavy = rgb(0.85, 0.9, 0.96);

  // Top accent bar
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width: width,
    height: 8,
    color: blue,
  });

  // Border frame
  page.drawRectangle({
    x: 35,
    y: 35,
    width: width - 70,
    height: height - 70,
    borderColor: borderNavy,
    borderWidth: 1.5,
    color: rgb(1, 1, 1),
  });

  let currentY = height - 70;

  // Header: INTERN-UP
  page.drawText(COMPANY_INFO.websiteName, {
    x: 55,
    y: currentY,
    size: 24,
    font: fontBold,
    color: navy,
  });

  page.drawText('LEARNING & SKILL ACCELERATION PROGRAM', {
    x: 55,
    y: currentY - 14,
    size: 8,
    font: fontBold,
    color: blue,
  });

  // Document Reference & Date in top right
  page.drawText(`Ref: ${data.documentId}`, {
    x: width - 220,
    y: currentY,
    size: 9,
    font: fontBold,
    color: grayDark,
  });

  page.drawText(`Issued: ${formatISTDate(data.enrollmentDateISO)}`, {
    x: width - 220,
    y: currentY - 14,
    size: 9,
    font: fontRegular,
    color: grayLight,
  });

  currentY -= 35;

  // Divider line
  page.drawLine({
    start: { x: 55, y: currentY },
    end: { x: width - 55, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.92, 0.95),
  });

  currentY -= 35;

  // Document Title
  page.drawText('OFFICIAL INTERNSHIP OFFER & ENROLLMENT CONFIRMATION', {
    x: 55,
    y: currentY,
    size: 13,
    font: fontBold,
    color: blue,
  });

  currentY -= 25;

  // Recipient info
  page.drawText('Dear ', {
    x: 55,
    y: currentY,
    size: 11,
    font: fontRegular,
    color: grayDark,
  });

  page.drawText(`${data.studentName},`, {
    x: 85,
    y: currentY,
    size: 11,
    font: fontBold,
    color: navy,
  });

  currentY -= 20;

  // Opening Paragraph
  const p1 =
    `We are delighted to confirm your enrollment in the ${COMPANY_INFO.websiteName} structured task-based ` +
    `internship program. This program is intentionally crafted to assist students and aspiring technologists ` +
    `in developing practical competency through hands-on project milestones.`;
  
  drawWrappedText(page, p1, 55, currentY, width - 110, 10, fontRegular, grayDark, 15);
  currentY -= 48;

  // Program details card
  const cardHeight = 115;
  page.drawRectangle({
    x: 55,
    y: currentY - cardHeight,
    width: width - 110,
    height: cardHeight,
    color: rgb(0.97, 0.98, 1.0),
    borderColor: rgb(0.88, 0.92, 0.98),
    borderWidth: 1,
  });

  const detailStartY = currentY - 20;
  const leftColX = 75;
  const rightColX = 310;
  const rowSpacing = 22;

  // Detail rows
  page.drawText('Internship Domain:', { x: leftColX, y: detailStartY, size: 9, font: fontRegular, color: grayLight });
  page.drawText(data.domainName, { x: leftColX, y: detailStartY - 10, size: 10, font: fontBold, color: navy });

  page.drawText('Program Duration:', { x: rightColX, y: detailStartY, size: 9, font: fontRegular, color: grayLight });
  page.drawText(`${COMPANY_INFO.programDurationDays} Calendar Days`, { x: rightColX, y: detailStartY - 10, size: 10, font: fontBold, color: navy });

  page.drawText('Commencement Date:', { x: leftColX, y: detailStartY - rowSpacing * 1.8, size: 9, font: fontRegular, color: grayLight });
  page.drawText(formatISTDate(data.startDateISO), { x: leftColX, y: detailStartY - rowSpacing * 1.8 - 10, size: 10, font: fontBold, color: navy });

  page.drawText('Submission Deadline:', { x: rightColX, y: detailStartY - rowSpacing * 1.8, size: 9, font: fontRegular, color: grayLight });
  page.drawText(formatISTDate(data.deadlineDateISO), { x: rightColX, y: detailStartY - rowSpacing * 1.8 - 10, size: 10, font: fontBold, color: navy });

  currentY -= cardHeight + 25;

  // Section: Program Requirements
  page.drawText('PROGRAM REQUIREMENTS & MILESTONES', {
    x: 55,
    y: currentY,
    size: 11,
    font: fontBold,
    color: navy,
  });
  currentY -= 18;

  const milestones = [
    '1. Announcement: Publish your offer letter on LinkedIn and submit the public post URL for review.',
    '2. Practical Execution: Complete all five (5) practical tasks assigned to your domain.',
    '3. GitHub Verification: Submit a valid, public GitHub repository link for every completed task.',
    '4. Administrative Fee: Fulfill the one-time INR 100 direct UPI program administration fee.',
    '5. Certification: Upon admin verification of submissions and fee, your Completion Certificate unlocks.',
  ];

  for (const item of milestones) {
    page.drawText(item, {
      x: 65,
      y: currentY,
      size: 9,
      font: fontRegular,
      color: grayDark,
    });
    currentY -= 17;
  }

  currentY -= 10;

  // Disclaimer / Scope note
  const disclaimer =
    `Terms & Scope: This document confirms enrollment in INTERN-UP's self-paced, task-based program. ` +
    `Participation does not constitute regular corporate employment or guarantee external hiring. ` +
    `Submissions are tracked via GitHub repositories and verified according to INTERN-UP guidelines.`;
  drawWrappedText(page, disclaimer, 55, currentY, width - 110, 8, fontOblique, grayLight, 12);
  currentY -= 40;

  // Signatory & Support Info
  const sigY = 90;
  page.drawLine({
    start: { x: 55, y: sigY + 45 },
    end: { x: 200, y: sigY + 45 },
    thickness: 1,
    color: grayDark,
  });

  page.drawText(COMPANY_INFO.founderName, {
    x: 55,
    y: sigY + 30,
    size: 11,
    font: fontBold,
    color: navy,
  });

  page.drawText(COMPANY_INFO.founderTitle, {
    x: 55,
    y: sigY + 18,
    size: 9,
    font: fontRegular,
    color: grayDark,
  });

  page.drawText(`Email: ${COMPANY_INFO.supportEmail}`, {
    x: 55,
    y: sigY + 6,
    size: 8,
    font: fontRegular,
    color: grayLight,
  });

  // Security seal badge on bottom right with verification QR code
  page.drawRectangle({
    x: width - 210,
    y: sigY,
    width: 155,
    height: 48,
    color: rgb(0.95, 0.97, 1.0),
    borderColor: blue,
    borderWidth: 1,
  });

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intern-up.com';
    const qrBuffer = await QRCode.toBuffer(`${appUrl}/verify`, {
      type: 'png',
      margin: 0,
      width: 100,
    });
    const qrImage = await doc.embedPng(qrBuffer);
    page.drawImage(qrImage, {
      x: width - 204,
      y: sigY + 4,
      width: 40,
      height: 40,
    });
  } catch {
    // Fallback if QR fails
  }

  page.drawText('DIGITALLY ISSUED', {
    x: width - 158,
    y: sigY + 30,
    size: 8,
    font: fontBold,
    color: blue,
  });
  page.drawText(`ID: ${data.documentId}`, {
    x: width - 158,
    y: sigY + 18,
    size: 7,
    font: fontRegular,
    color: grayDark,
  });
  page.drawText('INTERN-UP REGISTRY', {
    x: width - 158,
    y: sigY + 7,
    size: 7,
    font: fontBold,
    color: grayLight,
  });

  return await doc.save();
}

/**
 * Backward compatibility alias for generateOfferLetterPdf
 */
export const generateOfferLetterPdf = generateEnrollmentLetterPdf;

/**
 * Generates an official Completion Certificate as a PDF document (Landscape)
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  // Landscape A4: 841.89 x 595.28
  const page = doc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fontSerif = await doc.embedFont(StandardFonts.TimesRomanBold);

  const navy = rgb(0.06, 0.09, 0.16); // #0f172a
  const blue = rgb(0.14, 0.38, 0.92); // #2563eb
  const gold = rgb(0.85, 0.65, 0.13); // #d9a721
  const grayDark = rgb(0.25, 0.3, 0.38);
  const grayLight = rgb(0.5, 0.55, 0.65);

  // Outer Decorative Borders
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: navy,
    borderWidth: 3,
    color: rgb(0.99, 0.99, 1.0),
  });

  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: gold,
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  // Top header banner
  page.drawText(COMPANY_INFO.websiteName, {
    x: width / 2 - 80,
    y: height - 75,
    size: 28,
    font: fontBold,
    color: navy,
  });

  page.drawText('PROGRAM COMPLETION CERTIFICATE', {
    x: width / 2 - 125,
    y: height - 95,
    size: 10,
    font: fontBold,
    color: blue,
  });

  // Certificate Heading
  page.drawText('CERTIFICATE OF ACCOMPLISHMENT', {
    x: width / 2 - 160,
    y: height - 145,
    size: 18,
    font: fontSerif,
    color: gold,
  });

  page.drawText('This certificate is proudly awarded to', {
    x: width / 2 - 105,
    y: height - 175,
    size: 11,
    font: fontRegular,
    color: grayDark,
  });

  // Student Name
  const studentNameText = data.studentName.toUpperCase();
  const studentNameWidth = fontBold.widthOfTextAtSize(studentNameText, 24);
  page.drawText(studentNameText, {
    x: width / 2 - studentNameWidth / 2,
    y: height - 215,
    size: 24,
    font: fontBold,
    color: navy,
  });

  // Line below name
  page.drawLine({
    start: { x: width / 2 - 180, y: height - 225 },
    end: { x: width / 2 + 180, y: height - 225 },
    thickness: 1.5,
    color: blue,
  });

  // Body text
  const bodyText =
    `for successfully satisfying all program requirements in the 7-calendar-day structured internship track in`;
  const bodyWidth = fontRegular.widthOfTextAtSize(bodyText, 11);
  page.drawText(bodyText, {
    x: width / 2 - bodyWidth / 2,
    y: height - 255,
    size: 11,
    font: fontRegular,
    color: grayDark,
  });

  // Domain Name
  const domainText = data.domainName;
  const domainWidth = fontBold.widthOfTextAtSize(domainText, 16);
  page.drawText(domainText, {
    x: width / 2 - domainWidth / 2,
    y: height - 280,
    size: 16,
    font: fontBold,
    color: blue,
  });

  // Description
  const pDesc =
    `The participant completed five domain-specific milestones, submitted verified GitHub project repositories, ` +
    `completed their public learning announcement, and satisfied the evaluated criteria of the INTERN-UP curriculum.`;
  drawWrappedText(page, pDesc, 140, height - 315, width - 280, 10, fontRegular, grayDark, 16);

  // Dates row
  const datesText = `Program Period: ${formatISTDate(data.startDateISO)} to ${formatISTDate(data.endDateISO)}   |   Issued: ${formatISTDate(data.issueDateISO)}`;
  const datesWidth = fontRegular.widthOfTextAtSize(datesText, 9.5);
  page.drawText(datesText, {
    x: width / 2 - datesWidth / 2,
    y: height - 365,
    size: 9.5,
    font: fontRegular,
    color: grayLight,
  });

  // Bottom Signatures & Verification Area
  const bottomY = 70;

  // Embedded Verifiable QR Code linking directly to /verify/[certificateId]
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intern-up.com';
    const verifyUrl = `${appUrl}/verify/${encodeURIComponent(data.certificateId)}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      type: 'png',
      margin: 1,
      width: 140,
      errorCorrectionLevel: 'M',
    });
    const qrImage = await doc.embedPng(qrBuffer);
    page.drawImage(qrImage, {
      x: 60,
      y: bottomY - 14,
      width: 56,
      height: 56,
    });

    // Verification details text next to QR code
    page.drawText('OFFICIAL VERIFICATION QR', {
      x: 126,
      y: bottomY + 32,
      size: 7.5,
      font: fontBold,
      color: grayDark,
    });
    page.drawText(data.certificateId, {
      x: 126,
      y: bottomY + 18,
      size: 11,
      font: fontBold,
      color: blue,
    });
    page.drawText('Scan QR or verify online at:', {
      x: 126,
      y: bottomY + 6,
      size: 7.5,
      font: fontRegular,
      color: grayLight,
    });
    page.drawText(`${appUrl}/verify/${data.certificateId}`, {
      x: 126,
      y: bottomY - 5,
      size: 7,
      font: fontOblique,
      color: blue,
    });
  } catch {
    // Fallback if QR generation fails
    page.drawText('Certificate Identifier:', {
      x: 60,
      y: bottomY + 30,
      size: 8.5,
      font: fontBold,
      color: grayDark,
    });
    page.drawText(data.certificateId, {
      x: 60,
      y: bottomY + 16,
      size: 11,
      font: fontBold,
      color: blue,
    });
    page.drawText(`Verify at intern-up /verify/${data.certificateId}`, {
      x: 60,
      y: bottomY + 4,
      size: 7.5,
      font: fontOblique,
      color: grayLight,
    });
  }

  // Right: Founder Signature
  page.drawLine({
    start: { x: width - 260, y: bottomY + 35 },
    end: { x: width - 60, y: bottomY + 35 },
    thickness: 1,
    color: navy,
  });
  page.drawText(COMPANY_INFO.founderName, {
    x: width - 260,
    y: bottomY + 20,
    size: 12,
    font: fontBold,
    color: navy,
  });
  page.drawText(COMPANY_INFO.founderTitle, {
    x: width - 260,
    y: bottomY + 8,
    size: 9,
    font: fontRegular,
    color: grayDark,
  });
  page.drawText(COMPANY_INFO.supportEmail, {
    x: width - 260,
    y: bottomY - 3,
    size: 8,
    font: fontRegular,
    color: grayLight,
  });

  return await doc.save();
}

/**
 * Helper to draw wrapped text within maxWidth
 */
function drawWrappedText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any,
  text: string,
  startX: number,
  startY: number,
  maxWidth: number,
  fontSize: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  font: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  color: any,
  lineHeight: number
) {
  const words = text.split(' ');
  let currentLine = '';
  let y = startY;

  for (const word of words) {
    const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine.length > 0) {
      page.drawText(currentLine, {
        x: startX,
        y: y,
        size: fontSize,
        font: font,
        color: color,
      });
      currentLine = word;
      y -= lineHeight;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine.length > 0) {
    page.drawText(currentLine, {
      x: startX,
      y: y,
      size: fontSize,
      font: font,
      color: color,
    });
  }
}
