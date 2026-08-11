import React, { useState, useEffect, useRef } from 'react';
import { SectionData } from '../../types';
import { FileText, Save, Info, CheckCircle2, Upload, ScanLine, ChevronRight, FileCheck, Layers } from 'lucide-react';

interface PhaseNotepadProps {
  section: SectionData;
  onSaveNotes: (notes: string) => void;
  onToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const OCR_STEPS = [
  'Ingesting Document Image Bounds…',
  'Running OCR Text Extraction Engine…',
  'Named Entity Recognition (NER) Pass…',
  'Validating Vendor GSTIN Against Rules Engine…',
  'Cross-referencing with MCA21 Registry…',
  'Injecting Extracted Variables Into Phase Context…',
];

const MOCK_EXTRACTED = `Vendor Name: Lakshmi Machine Works Ltd
Vendor GSTIN: 27AAACL1234F1Z9 (Status: ACTIVE ✅)
Quoted Equipment Total: ₹ 14,500,000 (₹ 1.45 Crore)
Quotation Date: June 14, 2026
PAN: AAACL1234F
Payment Terms: 30% Advance, 70% Against Delivery`;

export const PhaseNotepad: React.FC<PhaseNotepadProps> = ({
  section,
  onSaveNotes,
  onToast,
}) => {
  const [notes, setNotes] = useState<string>(() => (section.inputs?.rawNotes as string) || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [scannedFileName, setScannedFileName] = useState('');
  const [showSplitView, setShowSplitView] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNotes((section.inputs?.rawNotes as string) || '');
    setScanState('idle');
    setShowSplitView(false);
  }, [section.key]);

  const handleSave = () => {
    onSaveNotes(notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const triggerScan = (fileName: string) => {
    setScannedFileName(fileName);
    setScanState('scanning');
    setScanProgress(0);

    OCR_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setScanStep(step);
        setScanProgress(Math.round(((i + 1) / OCR_STEPS.length) * 100));
        if (i === OCR_STEPS.length - 1) {
          setTimeout(() => {
            setScanState('done');
            setShowSplitView(true);
            onToast?.('OCR Complete', 'Variables extracted and injected into phase context.', 'success');
          }, 500);
        }
      }, i * 600);
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) triggerScan(file.name);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) triggerScan(file.name);
  };

  return (
    <div style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #253550', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', color: '#F5F5F4' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #1E2D45', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            STEP 2 OF 5 — PROMOTER NOTEPAD &amp; DOCUMENT SCANNER
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FAFAF9', fontFamily: 'var(--font-sans)', margin: 0 }}>
            {section.title}: Scratchpad &amp; OCR Ingestion
          </h3>
          <p style={{ fontSize: '13px', color: '#A8A29E', marginTop: '6px', maxWidth: '780px' }}>
            Enter raw notes, paste auditor remarks, or drag &amp; drop a vendor quote / financial PDF to extract variables automatically via OCR.
          </p>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#F97316', backgroundColor: 'rgba(249,115,22,0.12)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ScanLine size={14} /> OCR-Ready
        </div>
      </div>

      {isSaved && (
        <div style={{ backgroundColor: 'rgba(52,211,153,0.12)', border: '1px solid #34D399', color: '#34D399', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700 }}>
          <CheckCircle2 size={18} /> Notepad Saved! Content appended to AI Context Pipeline.
        </div>
      )}

      {/* OCR Drop Zone */}
      {scanState === 'idle' && (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            marginBottom: '24px',
            border: `2px dashed ${isDragging ? '#F97316' : '#374151'}`,
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? 'rgba(249,115,22,0.06)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.2s ease',
          }}
        >
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileInput} />
          <Upload size={32} color="#4B5563" style={{ margin: '0 auto 12px', display: 'block' }} />
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#9CA3AF', marginBottom: '6px' }}>
            📄 Drag &amp; Drop Vendor Quote, Auditor PDF, or Financial Statement
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            Supports .png, .jpg, .pdf — Scans &amp; extracts GSTIN, Vendor, Amounts automatically
          </div>
          <button
            style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: 'transparent', color: '#F97316', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ScanLine size={14} /> Browse &amp; Scan Document
          </button>
        </div>
      )}

      {/* Scanner Progress */}
      {scanState === 'scanning' && (
        <div style={{ marginBottom: '24px', backgroundColor: '#0D1421', border: '1px solid #253550', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ScanLine size={18} color="#F97316" style={{ animation: 'spin 1.2s linear infinite' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAF9' }}>Scanning: {scannedFileName}</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#1F2937', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ height: '100%', width: `${scanProgress}%`, background: 'linear-gradient(90deg, #F97316, #FB923C)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{scanStep}</div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
            {OCR_STEPS.slice(0, Math.floor(scanProgress / (100 / OCR_STEPS.length))).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#34D399' }}>
                <CheckCircle2 size={11} /> {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split View After Scan */}
      {showSplitView && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Layers size={16} color="#34D399" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '1px' }}>
              OCR Complete — Split View Active
            </span>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>({scannedFileName})</span>
            <button onClick={() => { setScanState('idle'); setShowSplitView(false); }} style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: '11px', cursor: 'pointer' }}>
              Clear
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', border: '1px solid #253550', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Left: Mock scanned document */}
            <div style={{ backgroundColor: '#0D1421', padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                📄 Scanned Document
              </div>
              <div style={{ backgroundColor: '#1A2235', border: '1px solid #253550', borderRadius: '8px', padding: '16px', fontSize: '12px', color: '#9CA3AF', lineHeight: '1.9', fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: '#6B7280', marginBottom: '8px' }}>— {scannedFileName} —</div>
                <div style={{ color: '#D1D5DB' }}>LAKSHMI MACHINE WORKS LTD.</div>
                <div>GSTIN: 27AAACL1234F1Z9</div>
                <div>PAN: AAACL1234F</div>
                <div style={{ marginTop: '8px' }}>QUOTATION — WEAVING LOOMS</div>
                <div>Date: June 14, 2026</div>
                <div style={{ marginTop: '8px' }}>Total Amount: Rs. 14,50,000/-</div>
                <div>(Rupees Fourteen Lakhs &amp; Fifty Thousand)</div>
                <div style={{ marginTop: '8px' }}>Terms: 30% Advance, 70% on Delivery</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', backgroundColor: '#253550', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} color="#F97316" style={{ backgroundColor: '#111827', padding: '2px', borderRadius: '50%' }} />
            </div>

            {/* Right: Extracted Variables */}
            <div style={{ backgroundColor: '#111827', padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCheck size={12} /> Extracted Variables — AUTO-POPULATED
              </div>
              <pre style={{ fontSize: '12px', color: '#D1FAE5', backgroundColor: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '8px', padding: '14px', fontFamily: 'var(--font-mono)', lineHeight: '1.9', margin: 0, whiteSpace: 'pre-wrap' }}>
                {MOCK_EXTRACTED}
              </pre>
              <button
                onClick={() => {
                  setNotes(prev => (prev ? prev + '\n\n' : '') + MOCK_EXTRACTED);
                  onToast?.('Variables Inserted', 'Extracted data appended to notepad context.', 'success');
                }}
                style={{ marginTop: '14px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#059669,#34D399)', color: '#fff', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <FileCheck size={14} /> Confirm &amp; Insert Into DRHP Phase Context
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notepad Textarea */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAF9', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Promoter Corporate Notes &amp; Scratchpad</span>
          <span style={{ fontSize: '11px', color: '#F97316', fontWeight: 600 }}>Type or paste notes — appended to AI Generation context</span>
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={10}
          style={{ width: '100%', minHeight: '240px', padding: '20px', borderRadius: '12px', border: '1.5px solid #F97316', backgroundColor: '#0D1421', color: '#F5F5F4', fontSize: '15px', lineHeight: '1.8', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)' }}
          placeholder="Type or paste company background details, board decisions, raw financial figures, or custom clauses here…"
        />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #1E2D45', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ fontSize: '13px', color: '#A8A29E', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="#F97316" />
          Clicking Save stores these notes for AI generation in Step 3 (Generator).
        </div>
        <button
          onClick={handleSave}
          style={{ padding: '13px 28px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#F97316 0%,#EA580C 100%)', color: '#FFFFFF', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 18px rgba(249,115,22,0.35)', transition: 'all 0.2s' }}
        >
          <Save size={16} /> Save Notepad Content
        </button>
      </div>
    </div>
  );
};
