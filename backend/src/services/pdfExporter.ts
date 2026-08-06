import PDFDocument from 'pdfkit';
import { db } from '../db/connection';
import { sections } from '../db/schema/sections';
import { aiDrafts } from '../db/schema/aiDrafts';
import { filings } from '../db/schema/filings';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';
import { SECTION_KEYS, SectionKey, SECTION_LABELS } from '../types/api';

const EXPORTS_DIR = path.resolve(__dirname, '..', '..', 'exports');

export async function generateFilingPDF(filingId: string): Promise<string> {
  if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });

  const filing = db.select().from(filings).where(eq(filings.filing_id, filingId)).get();
  if (!filing) throw new Error('Filing not found');

  const allSections = db.select().from(sections).where(eq(sections.filing_id, filingId)).all();
  const allDrafts = db.select().from(aiDrafts).all(); // small DB for hackathon

  const outputPath = path.join(EXPORTS_DIR, `${filingId}-${Date.now()}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Watermark for prototype
  doc.fontSize(40)
     .fillColor('#FF0000', 0.1)
     .text('PROSPECTUSIQ DEMO', 50, 400, { angle: -45, align: 'center' });

  // Title Page
  doc.fillColor('black', 1).fontSize(24).text('DRAFT RED HERRING PROSPECTUS', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(filing.company_name, { align: 'center' });
  doc.fontSize(12).text(`CIN: ${filing.cin}`, { align: 'center' });
  doc.moveDown(2);
  doc.text(`Status: ${filing.status}`, { align: 'center' });
  doc.text(`Generated: ${new Date().toISOString()}`, { align: 'center' });

  // If locked, add Bronze Seal indicator
  if (filing.status === 'CERTIFIED_LOCKED' && filing.locked_hash) {
    doc.moveDown(2);
    doc.fillColor('#A9762F').fontSize(16).text('CERTIFIED & SEALED', { align: 'center' });
    doc.fontSize(10).text(`Integrity Hash: ${filing.locked_hash}`, { align: 'center' });
  }

  // Iterate sections
  for (const key of SECTION_KEYS) {
    doc.addPage();
    doc.fillColor('black', 1).fontSize(16).text(`${key}: ${SECTION_LABELS[key as SectionKey]}`, { underline: true });
    doc.moveDown();

    const sec = allSections.find(s => s.section_key === key);
    if (!sec) {
      doc.fontSize(12).text('Section not initialized.');
      continue;
    }

    const draft = allDrafts.filter(d => d.section_id === sec.section_id).pop();
    if (!draft) {
      doc.fontSize(12).text(`Status: ${sec.status} - No draft text available yet.`);
      continue;
    }

    doc.fontSize(11).text(`Status: ${sec.status}`);
    if (draft.human_edited_text) {
      doc.fontSize(10).fillColor('blue').text('(Includes Human Edits)', { align: 'right' });
      doc.fillColor('black');
      doc.moveDown();
      doc.fontSize(11).text(draft.human_edited_text, { align: 'justify' });
    } else {
      doc.moveDown();
      doc.fontSize(11).text(draft.drafted_text, { align: 'justify' });
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}
