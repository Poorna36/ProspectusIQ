"""
ProspectusIQ - Script 02: Data Cleaner and Preprocessor
======================================================
Processes and sanitizes datasets downloaded by Script 01:
1. SQLi Dataset Normalization & Stratified Train/Val/Test Split (70/15/15)
   -> data/security/processed/ [train.csv, val.csv, test.csv]
2. SEBI PDF Text & Financial Table Extraction (PyMuPDF + pdfplumber)
   -> data/prospectuses/processed/{filename}_chunks.json

Platform: Windows compatible (pathlib, UTF-8, robust exception handling)
"""

import os
import re
import json
import urllib.parse
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
import fitz  # PyMuPDF
import pdfplumber

# Define Base Directories (Relative to ProspectusIQ Project Root)
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent if SCRIPT_DIR.name in ["scripts", "ml"] else SCRIPT_DIR
DATA_DIR = PROJECT_ROOT / "data"

SECURITY_RAW_CSV = DATA_DIR / "security" / "sqli_raw.csv"
SECURITY_PROCESSED_DIR = DATA_DIR / "security" / "processed"

PROSPECTUS_RAW_DIR = DATA_DIR / "prospectuses" / "raw"
PROSPECTUS_PROCESSED_DIR = DATA_DIR / "prospectuses" / "processed"

SECURITY_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
PROSPECTUS_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# ==============================================================================
# PART 1: SQL INJECTION DATA CLEANING & STRATIFIED SPLIT
# ==============================================================================

def clean_sqli_query(query: str) -> str:
    """Sanitizes and normalizes an input SQLi or search query."""
    if not isinstance(query, str):
        return ""
    
    # 1. URL Decode (unquote multiple times if needed)
    decoded = urllib.parse.unquote(query)
    if "%" in decoded:
        try:
            decoded = urllib.parse.unquote(decoded)
        except Exception:
            pass
            
    # 2. Lowercase conversion
    lowered = decoded.lower()
    
    # 3. Strip null bytes and non-printable control characters
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', lowered)
    
    # 4. Standardize whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return cleaned


def clean_and_split_sqli_dataset():
    """Reads raw SQLi dataset, normalizes, deduplicates, and creates stratified train/val/test splits."""
    print("\n[1/2] Processing SQL Injection Dataset...")
    
    if not SECURITY_RAW_CSV.exists():
        print(f"   [!] File not found: {SECURITY_RAW_CSV}. Please run Script 01 first.")
        return

    try:
        df = pd.read_csv(SECURITY_RAW_CSV, encoding="utf-8")
        print(f"   - Loaded raw samples: {len(df)}")
        
        # 1. Clean & Normalize Queries
        df["Cleaned_Query"] = df["Query"].astype(str).apply(clean_sqli_query)
        
        # Remove empty queries
        df = df[df["Cleaned_Query"].str.len() > 0].copy()
        
        # 2. Remove Duplicate Queries to prevent data leakage
        initial_count = len(df)
        df = df.drop_duplicates(subset=["Cleaned_Query"]).reset_index(drop=True)
        dedup_count = len(df)
        print(f"   - Deduplicated samples: {dedup_count} (Removed {initial_count - dedup_count} duplicates)")
        
        # Use Cleaned_Query as the main Query column
        final_df = df[["Cleaned_Query", "Label"]].rename(columns={"Cleaned_Query": "Query"})
        
        # 3. Stratified Train (70%), Validation (15%), Test (15%) Split
        train_df, temp_df = train_test_split(
            final_df, test_size=0.30, random_state=42, stratify=final_df["Label"]
        )
        val_df, test_df = train_test_split(
            temp_df, test_size=0.50, random_state=42, stratify=temp_df["Label"]
        )
        
        # 4. Save Processed Splits
        train_path = SECURITY_PROCESSED_DIR / "train.csv"
        val_path = SECURITY_PROCESSED_DIR / "val.csv"
        test_path = SECURITY_PROCESSED_DIR / "test.csv"
        
        train_df.to_csv(train_path, index=False, encoding="utf-8")
        val_df.to_csv(val_path, index=False, encoding="utf-8")
        test_df.to_csv(test_path, index=False, encoding="utf-8")
        
        print(f"   [OK] Processed SQLi datasets saved to: {SECURITY_PROCESSED_DIR}")
        print(f"        - Train (70%): {len(train_df)} samples (Benign: {sum(train_df['Label']==0)}, SQLi: {sum(train_df['Label']==1)})")
        print(f"        - Val   (15%): {len(val_df)} samples (Benign: {sum(val_df['Label']==0)}, SQLi: {sum(val_df['Label']==1)})")
        print(f"        - Test  (15%): {len(test_df)} samples (Benign: {sum(test_df['Label']==0)}, SQLi: {sum(test_df['Label']==1)})")
        
    except Exception as e:
        print(f"   [!] Error processing SQLi dataset: {e}")


# ==============================================================================
# PART 2: SEBI DRHP PDF TEXT & TABLE EXTRACTION
# ==============================================================================

# Target SEBI Chapters for ProspectusIQ
CHAPTER_PATTERNS = {
    "RISK FACTORS": r"(?:RISK\s+FACTORS|SECTION\s+III\s*:\s*RISK\s+FACTORS)",
    "OBJECTS OF THE ISSUE": r"(?:OBJECTS\s+OF\s+THE\s+ISSUE|PURPOSE\s+OF\s+THE\s+ISSUE)",
    "BUSINESS OVERVIEW": r"(?:OUR\s+BUSINESS|BUSINESS\0\s+OVERVIEW|ABOUT\s+OUR\s+COMPANY)",
    "FINANCIAL INFORMATION": r"(?:FINANCIAL\s+INFORMATION|FINANCIAL\s+STATEMENTS|RESTATED\s+FINANCIAL)",
    "PROMOTERS AND PROMOTER GROUP": r"(?:OUR\s+PROMOTERS|PROMOTER\s+GROUP)",
    "PEER GROUP COMPARISON": r"(?:PEER\s+GROUP|COMPARISON\s+WITH\s+LISTED\s+PEERS)"
}


def clean_extracted_text(text: str) -> str:
    """Strips null bytes, replacement characters, and cleans text formatting."""
    if not text:
        return ""
    cleaned = text.replace("\x00", "").replace("\ufffd", "")
    cleaned = re.sub(r'\r\n|\r', '\n', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned.strip()


def convert_table_to_markdown(table_data: list) -> str:
    """Converts a 2D list table extracted by pdfplumber into Markdown table format."""
    if not table_data or len(table_data) < 2:
        return ""
    
    md_lines = []
    headers = [str(cell or "").strip().replace("\n", " ") for cell in table_data[0]]
    md_lines.append("| " + " | ".join(headers) + " |")
    md_lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
    
    for row in table_data[1:]:
        row_cells = [str(cell or "").strip().replace("\n", " ") for cell in row]
        md_lines.append("| " + " | ".join(row_cells) + " |")
        
    return "\n".join(md_lines)


def process_single_pdf(pdf_path: Path) -> dict:
    """
    Parses page text using PyMuPDF (fitz) and financial tables using pdfplumber.
    Returns structured chunks JSON dict.
    """
    pdf_name = pdf_path.stem
    print(f"\n   -> Processing PDF: {pdf_path.name}")
    
    document_chunks = []
    extracted_tables = []
    
    current_chapter = "GENERAL INFORMATION"
    
    # 1. Page-by-page text & section extraction with PyMuPDF
    try:
        doc = fitz.open(str(pdf_path))
        num_pages = len(doc)
        print(f"      - PyMuPDF: Extracting text across {num_pages} pages...")
        
        for page_num in range(num_pages):
            page = doc.load_page(page_num)
            page_text = clean_extracted_text(page.get_text("text"))
            
            if not page_text:
                continue
                
            # Check for chapter heading transitions
            for chapter_name, pattern in CHAPTER_PATTERNS.items():
                if re.search(pattern, page_text, re.IGNORECASE):
                    current_chapter = chapter_name
                    break
            
            # Split page text into semantic paragraphs/chunks (~500 words)
            paragraphs = [p.strip() for p in page_text.split("\n\n") if len(p.strip()) > 30]
            
            for idx, p in enumerate(paragraphs):
                chunk_id = f"{pdf_name}_p{page_num + 1}_c{idx + 1}"
                document_chunks.append({
                    "chunk_id": chunk_id,
                    "pdf_source": pdf_path.name,
                    "page_number": page_num + 1,
                    "chapter": current_chapter,
                    "text": p,
                    "char_count": len(p),
                    "word_count": len(p.split())
                })
                
        doc.close()
    except Exception as err:
        print(f"      [!] PyMuPDF extraction warning: {err}")

    # 2. Table extraction with pdfplumber
    try:
        print(f"      - pdfplumber: Extracting financial tables...")
        with pdfplumber.open(str(pdf_path)) as plumber_pdf:
            for p_idx, page in enumerate(plumber_pdf.pages):
                tables = page.extract_tables()
                for t_idx, table in enumerate(tables):
                    if not table or len(table) < 2:
                        continue
                    
                    md_table = convert_table_to_markdown(table)
                    table_meta = {
                        "table_id": f"{pdf_name}_tbl_p{p_idx + 1}_{t_idx + 1}",
                        "pdf_source": pdf_path.name,
                        "page_number": p_idx + 1,
                        "raw_table": table,
                        "markdown_table": md_table
                    }
                    extracted_tables.append(table_meta)
    except Exception as err:
        print(f"      [!] pdfplumber table extraction warning: {err}")

    result_data = {
        "pdf_name": pdf_path.name,
        "total_chunks": len(document_chunks),
        "total_tables": len(extracted_tables),
        "chapters_detected": list(set(c["chapter"] for c in document_chunks)),
        "chunks": document_chunks,
        "tables": extracted_tables
    }
    
    return result_data


def process_sebi_pdfs():
    """Iterates through raw PDFs and outputs structured JSON chunks."""
    print("\n[2/2] Processing SEBI DRHP PDFs...")
    
    pdf_files = list(PROSPECTUS_RAW_DIR.glob("*.pdf"))
    if not pdf_files:
        print(f"   [!] No PDF files found in {PROSPECTUS_RAW_DIR}. Run Script 01 first.")
        return

    print(f"   Found {len(pdf_files)} PDF files in raw directory.")
    
    for pdf_path in pdf_files:
        try:
            processed_data = process_single_pdf(pdf_path)
            
            output_json_name = f"{pdf_path.stem}_chunks.json"
            output_json_path = PROSPECTUS_PROCESSED_DIR / output_json_name
            
            with open(output_json_path, "w", encoding="utf-8") as f:
                json.dump(processed_data, f, indent=2, ensure_ascii=False)
                
            print(f"      [OK] Saved processed chunks ({processed_data['total_chunks']} text chunks, {processed_data['total_tables']} tables) -> {output_json_path}")
            
        except Exception as e:
            print(f"   [!] Failed to process PDF {pdf_path.name}: {e}")

    print(f"\nSEBI PDF Processing Complete: Processed data saved to {PROSPECTUS_PROCESSED_DIR}")


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    print("==================================================================")
    print(" ProspectusIQ - Data Cleaning & Preprocessing Pipeline")
    print("==================================================================")
    
    clean_and_split_sqli_dataset()
    process_sebi_pdfs()
    
    print("\n[SUCCESS] Script 02 Execution Finished cleanly!")
