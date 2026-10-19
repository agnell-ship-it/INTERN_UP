import { describe, it, expect } from 'vitest';
import { generateOfferLetterPdf, generateCertificatePdf } from '@/lib/pdf-generator';
import { PDFDocument } from 'pdf-lib';

describe('PDF Document Generation Tests', () => {
  it('generates a valid, readable Offer Letter PDF with student details', async () => {
    const offerData = {
      documentId: 'INUP-OFF-2026-TEST01',
      studentName: 'Rahul Sharma',
      studentEmail: 'rahul@example.com',
      domainName: 'Web Development',
      enrollmentDateISO: '2026-10-19T10:00:00.000Z',
      startDateISO: '2026-10-19T10:00:00.000Z',
      deadlineDateISO: '2026-10-26T10:00:00.000Z',
    };

    const pdfBytes = await generateOfferLetterPdf(offerData);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);

    // Verify it is a parseable PDF document
    const parsed = await PDFDocument.load(pdfBytes);
    expect(parsed.getPageCount()).toBe(1);

    const page = parsed.getPage(0);
    const { width, height } = page.getSize();
    // A4 Portrait standard points: ~595 x ~841
    expect(width).toBeCloseTo(595.28, 1);
    expect(height).toBeCloseTo(841.89, 1);
  });

  it('generates a valid, landscape Completion Certificate PDF with unique ID', async () => {
    const certData = {
      certificateId: 'INUP-2026-X7K2-M9L4',
      studentName: 'Rahul Sharma',
      domainName: 'Artificial Intelligence',
      startDateISO: '2026-10-19T10:00:00.000Z',
      endDateISO: '2026-10-26T10:00:00.000Z',
      issueDateISO: '2026-10-26T12:00:00.000Z',
    };

    const pdfBytes = await generateCertificatePdf(certData);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);

    // Verify it is parseable landscape A4
    const parsed = await PDFDocument.load(pdfBytes);
    expect(parsed.getPageCount()).toBe(1);

    const page = parsed.getPage(0);
    const { width, height } = page.getSize();
    // A4 Landscape standard points: ~841 x ~595
    expect(width).toBeCloseTo(841.89, 1);
    expect(height).toBeCloseTo(595.28, 1);
  });
});
