"""
ProspectusIQ — Data Quality Fixup & FAISS Re-Index Script
==========================================================
File: ml/scripts/05_fixup_data_and_reindex.py

Fixes identified data quality issues:
1. Re-downloads real SEBI ICDR Regulations, NSE Emerge Guidelines, BSE SME Regulations
   from authentic SEBI sources (no synthetic generation)
2. Parses all real PDFs with correct doc_type tagging:
   - "Regulations" for ICDR/Emerge/BSE
   - "Observation letters" for SEBI observation letters
   - "DRHP" for all draft red herring prospectuses
3. Includes Informal Guidance Letters from ml/data root as "Observation letters"
4. Rebuilds sebi_parsed_chunks.json with clean data
5. Re-generates FAISS index with updated embeddings
"""

import os
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
os.environ['TOKENIZERS_PARALLELISM'] = 'false'

import re
import json
import urllib.parse
from pathlib import Path

import fitz  # PyMuPDF
import numpy as np
import requests

# ─── PATH RESOLUTION ─────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent if SCRIPT_DIR.name in ["scripts", "ml"] else SCRIPT_DIR
if PROJECT_ROOT.name == "ml":
    PROJECT_ROOT = PROJECT_ROOT.parent

RAW_PDF_DIR = PROJECT_ROOT / "ml" / "data" / "sebi_official_raw"
SEBI_CLEANED_DIR = PROJECT_ROOT / "ml" / "data" / "sebi_cleaned"
VECTOR_DB_DIR = PROJECT_ROOT / "ml" / "data" / "vector_db"
EXTRA_DATA_DIR = PROJECT_ROOT / "ml" / "data"  # Informal guidance letters live here

for d in [RAW_PDF_DIR, SEBI_CLEANED_DIR, VECTOR_DB_DIR]:
    d.mkdir(parents=True, exist_ok=True)

HTTP_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 1: Download Real Regulation PDFs (No Synthetic Generation)
# ═══════════════════════════════════════════════════════════════════════════════

# Authentic SEBI portal URLs for regulatory documents
REAL_REGULATION_SOURCES = [
    {
        "name": "SEBI_ICDR_Regulations_2018",
        "urls": [
            "https://www.sebi.gov.in/legal/regulations/sep-2018/securities-and-exchange-board-of-india-issue-of-capital-and-disclosure-requirements-regulations-2018-last-amended-on-june-20-2024-_40328.html",
            "https://www.sebi.gov.in/sebi_data/attachdocs/jan-2024/1705570384448.pdf",
            "https://www.sebi.gov.in/sebi_data/attachdocs/sep-2023/1695903671498.pdf",
        ],
        "doc_type": "Regulations",
    },
    {
        "name": "NSE_Emerge_SME_Guidelines",
        "urls": [
            "https://www.nseindia.com/emerge",
            "https://archives.nseindia.com/content/equities/EMERGE_listing.pdf",
        ],
        "doc_type": "Regulations",
    },
    {
        "name": "BSE_SME_Regulations",
        "urls": [
            "https://www.bseindia.com/static/about/bse_sme.aspx",
        ],
        "doc_type": "Regulations",
    },
]


def download_regulation_pdf(name: str, urls: list[str], target_dir: Path) -> Path | None:
    """
    Attempt to download a real regulation PDF from multiple candidate URLs.
    Returns the downloaded path or None if all URLs fail.
    """
    dest = target_dir / f"{name}.pdf"

    # If we already have a valid multi-page PDF, skip download
    if dest.exists() and dest.stat().st_size > 50000:
        try:
            doc = fitz.open(str(dest))
            if len(doc) > 5:  # Real regulations have many pages
                print(f"   [OK] Already have real {name}: {len(doc)} pages, {dest.stat().st_size // 1024} KB")
                doc.close()
                return dest
            doc.close()
        except Exception:
            pass

    for url in urls:
        if not url.endswith(".pdf"):
            continue
        try:
            print(f"   -> Downloading {name} from {url}...")
            resp = requests.get(url, headers=HTTP_HEADERS, timeout=30, stream=True)
            if resp.status_code == 200 and int(resp.headers.get('content-length', 0)) > 10000:
                with open(dest, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=65536):
                        f.write(chunk)
                if dest.stat().st_size > 50000:
                    doc = fitz.open(str(dest))
                    pages = len(doc)
                    doc.close()
                    if pages > 5:
                        print(f"   [OK] Downloaded real {name}: {pages} pages, {dest.stat().st_size // 1024} KB")
                        return dest
        except Exception as e:
            print(f"   [!] Failed {url}: {e}")

    print(f"   [WARN] Could not download authentic {name} from any URL")
    return None


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 2: PDF Parsing with Correct doc_type Classification
# ═══════════════════════════════════════════════════════════════════════════════

SECTION_PATTERNS = {
    "RISK FACTORS": r"(?:RISK\s+FACTORS|SECTION\s+[I|V|X]+\s*:\s*RISK\s+FACTORS)",
    "OBJECTS OF THE ISSUE": r"(?:OBJECTS\s+OF\s+THE\s+ISSUE|PURPOSE\s+OF\s+THE\s+ISSUE)",
    "BUSINESS OVERVIEW": r"(?:OUR\s+BUSINESS|BUSINESS\s+OVERVIEW|ABOUT\s+OUR\s+COMPANY)",
    "FINANCIAL INFORMATION": r"(?:FINANCIAL\s+INFORMATION|FINANCIAL\s+STATEMENTS|RESTATED\s+FINANCIAL|BALANCE\s+SHEET)",
    "PROMOTERS AND PROMOTER GROUP": r"(?:OUR\s+PROMOTERS|PROMOTER\s+GROUP)",
    "PEER GROUP COMPARISON": r"(?:PEER\s+GROUP|COMPARISON\s+WITH\s+LISTED\s+PEERS)",
}


def classify_doc_type(filename: str) -> str:
    """
    Classify PDF document type from filename.
    Uses strict pattern matching — NO synthetic fallback.
    """
    upper = filename.upper()
    if any(k in upper for k in ["ICDR", "EMERGE", "BSE_SME", "REGULATIONS", "RULES", "GUIDELINES"]):
        return "Regulations"
    if any(k in upper for k in ["OBSERVATION", "INFORMAL", "GUIDANCE", "LETTER"]):
        return "Observation letters"
    return "DRHP"


def clean_pdf_text(raw_text: str) -> str:
    """Strip null bytes, HTML tags, normalize whitespace."""
    if not raw_text:
        return ""
    text = raw_text.replace("\x00", "").replace("\ufffd", "")
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def parse_single_pdf(pdf_path: Path, doc_type: str) -> dict:
    """
    Parse a single PDF into structured chunks with tables.
    Returns document dict with chunks, tables, and metadata.
    """
    pdf_chunks = []
    pdf_tables = []
    current_section = "GENERAL DISCLOSURES"

    try:
        doc = fitz.open(str(pdf_path))
        num_pages = len(doc)
        if num_pages == 0:
            doc.close()
            return {"pdf_name": pdf_path.name, "chunks_count": 0, "tables_count": 0,
                    "doc_type": doc_type, "chunks": [], "tables": []}

        for page_idx in range(num_pages):
            page = doc.load_page(page_idx)
            raw_text = page.get_text("text")
            clean_text = clean_pdf_text(raw_text)

            if not clean_text or len(clean_text) < 20:
                continue

            # Detect section transitions
            for sec_name, pattern in SECTION_PATTERNS.items():
                if re.search(pattern, clean_text, re.IGNORECASE):
                    current_section = sec_name
                    break

            # Chunk text into 250–500 char blocks for FAISS indexing
            raw_lines = [l.strip() for l in clean_text.split("\n") if len(l.strip()) > 20]
            paragraphs = []
            buf = []
            for line in raw_lines:
                buf.append(line)
                if sum(len(x) for x in buf) >= 250:
                    paragraphs.append(" ".join(buf))
                    buf = []
            if buf:
                paragraphs.append(" ".join(buf))
            if not paragraphs and len(clean_text) > 20:
                paragraphs = [clean_text]

            for p_idx, para in enumerate(paragraphs):
                chunk_id = f"{pdf_path.stem}_p{page_idx + 1}_c{p_idx + 1}"
                pdf_chunks.append({
                    "chunk_id": chunk_id,
                    "pdf_source": pdf_path.name,
                    "page": page_idx + 1,
                    "section": current_section,
                    "doc_type": doc_type,
                    "text": para,
                })

            # Extract tables
            try:
                tabs = page.find_tables()
                for t_idx, tab in enumerate(tabs.tables):
                    grid = tab.extract()
                    if grid and len(grid) >= 2:
                        pdf_tables.append({
                            "table_id": f"{pdf_path.stem}_tbl_p{page_idx + 1}_{t_idx + 1}",
                            "pdf_source": pdf_path.name,
                            "page": page_idx + 1,
                            "grid": grid,
                        })
            except Exception:
                pass

        doc.close()
    except Exception as e:
        print(f"   [!] Error parsing {pdf_path.name}: {e}")

    return {
        "pdf_name": pdf_path.name,
        "chunks_count": len(pdf_chunks),
        "tables_count": len(pdf_tables),
        "doc_type": doc_type,
        "chunks": pdf_chunks,
        "tables": pdf_tables,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 3: Parse All Real PDFs & Rebuild Chunks JSON
# ═══════════════════════════════════════════════════════════════════════════════

def rebuild_parsed_chunks() -> dict:
    """
    Parse all real PDFs (>10KB) from sebi_official_raw + informal guidance letters.
    Skips synthetic placeholder PDFs (<10KB).
    Tags doc_type strictly from filename patterns.
    """
    print("\n[STEP 2/3] Parsing All Real PDFs with Correct doc_type Tagging...")

    all_pdfs: list[tuple[Path, str]] = []

    # 1. All PDFs in sebi_official_raw (skip synthetic <10KB)
    for pdf in sorted(RAW_PDF_DIR.glob("*.pdf")):
        if pdf.stat().st_size < 10000:
            print(f"   [SKIP] Synthetic placeholder: {pdf.name} ({pdf.stat().st_size} bytes)")
            continue
        dt = classify_doc_type(pdf.name)
        all_pdfs.append((pdf, dt))

    # 2. Informal guidance letters from ml/data root
    for pdf in sorted(EXTRA_DATA_DIR.glob("*.pdf")):
        if pdf.stat().st_size < 5000:
            continue
        upper = pdf.name.upper()
        if any(k in upper for k in ["INFORMAL", "GUIDANCE", "LETTER", "OBSERVATION"]):
            all_pdfs.append((pdf, "Observation letters"))

    print(f"   Total real PDFs to parse: {len(all_pdfs)}")

    # Count by type
    type_counts = {}
    for _, dt in all_pdfs:
        type_counts[dt] = type_counts.get(dt, 0) + 1
    for dt, count in sorted(type_counts.items()):
        print(f"   - {dt}: {count} PDFs")

    # Parse all
    parsed_docs = []
    total_chunks = 0
    total_tables = 0

    for pdf_path, doc_type in all_pdfs:
        result = parse_single_pdf(pdf_path, doc_type)
        if result["chunks_count"] > 0:
            parsed_docs.append(result)
            total_chunks += result["chunks_count"]
            total_tables += result["tables_count"]
            print(f"   [OK] {pdf_path.name}: {result['chunks_count']} chunks, {result['tables_count']} tables [{doc_type}]")
        else:
            print(f"   [SKIP] {pdf_path.name}: 0 chunks (empty/unreadable)")

    export_data = {
        "total_official_pdfs": len(parsed_docs),
        "total_extracted_chunks": total_chunks,
        "total_extracted_tables": total_tables,
        "documents": parsed_docs,
    }

    # Save
    out_path = SEBI_CLEANED_DIR / "sebi_parsed_chunks.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    print(f"\n   [OK] Saved {out_path} ({total_chunks} chunks from {len(parsed_docs)} PDFs)")

    return export_data


# ═══════════════════════════════════════════════════════════════════════════════
# STEP 4: Rebuild FAISS Index with Correct Embeddings
# ═══════════════════════════════════════════════════════════════════════════════

def rebuild_faiss_index(parsed_data: dict) -> dict:
    """
    Re-generate sentence embeddings (all-MiniLM-L6-v2) and build FAISS index.
    """
    print("\n[STEP 3/3] Rebuilding FAISS Vector Index...")

    import faiss
    from sentence_transformers import SentenceTransformer

    chunks_list = []
    for doc in parsed_data.get("documents", []):
        for chunk in doc.get("chunks", []):
            text = chunk.get("text", "").strip()
            if text and len(text) > 20:
                chunks_list.append({
                    "chunk_id": chunk["chunk_id"],
                    "pdf_source": chunk["pdf_source"],
                    "page": chunk["page"],
                    "section": chunk["section"],
                    "doc_type": chunk["doc_type"],
                    "text": text,
                })

    print(f"   Total chunks for indexing: {len(chunks_list)}")

    # doc_type distribution
    dt_counts = {}
    for c in chunks_list:
        dt = c["doc_type"]
        dt_counts[dt] = dt_counts.get(dt, 0) + 1
    for dt, count in sorted(dt_counts.items()):
        print(f"   - {dt}: {count} chunks")

    # Load embedding model
    model_name = "all-MiniLM-L6-v2"
    print(f"   Loading embedding model: {model_name}...")
    embedder = SentenceTransformer(model_name)

    texts = [c["text"] for c in chunks_list]
    print(f"   Encoding {len(texts)} chunks into 384-d dense vectors...")
    raw_embeddings = embedder.encode(texts, convert_to_numpy=True, show_progress_bar=True, batch_size=256)

    # L2 normalize for cosine similarity via Inner Product
    norms = np.linalg.norm(raw_embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    normalized = (raw_embeddings / norms).astype(np.float32)

    dimension = normalized.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(normalized)

    print(f"   [OK] Built FAISS index: {index.ntotal} vectors, dim={dimension}")

    # Save
    faiss_file = VECTOR_DB_DIR / "sebi_faiss.index"
    meta_file = VECTOR_DB_DIR / "vector_db_metadata.json"

    faiss.write_index(index, str(faiss_file))

    metadata = {
        "embedding_model": model_name,
        "dimension": dimension,
        "total_vectors": index.ntotal,
        "metric": "Cosine Similarity (Inner Product Normalized)",
        "doc_type_distribution": dt_counts,
        "chunks": chunks_list,
    }
    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"   [OK] Saved FAISS index -> {faiss_file}")
    print(f"   [OK] Saved metadata    -> {meta_file}")

    return {
        "total_indexed_chunks": index.ntotal,
        "embedding_dimension": dimension,
        "doc_type_distribution": dt_counts,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 70)
    print("  ProspectusIQ: Data Quality Fixup & FAISS Re-Index")
    print("=" * 70)

    # Step 1: Try to download real regulation PDFs
    print("\n[STEP 1/3] Checking/Downloading Real Regulation PDFs...")
    for reg in REAL_REGULATION_SOURCES:
        download_regulation_pdf(reg["name"], reg["urls"], RAW_PDF_DIR)

    # Step 2: Parse all real PDFs with correct doc_type tagging
    parsed_data = rebuild_parsed_chunks()

    # Step 3: Rebuild FAISS index
    vec_stats = rebuild_faiss_index(parsed_data)

    # Summary
    print("\n" + "=" * 70)
    print("  FIXUP SUMMARY")
    print("=" * 70)
    print(f"  Total PDFs parsed: {parsed_data['total_official_pdfs']}")
    print(f"  Total chunks: {parsed_data['total_extracted_chunks']}")
    print(f"  Total tables: {parsed_data['total_extracted_tables']}")
    print(f"  FAISS index vectors: {vec_stats['total_indexed_chunks']}")
    print(f"  Doc type distribution:")
    for dt, count in sorted(vec_stats['doc_type_distribution'].items()):
        print(f"    - {dt}: {count} chunks")
    print("=" * 70)
    print("[SUCCESS] Data quality fixup and re-indexing complete!")
