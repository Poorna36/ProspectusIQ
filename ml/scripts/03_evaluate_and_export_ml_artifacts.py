import json
import re
from pathlib import Path
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

def run_indexing_and_export():
    print("Initiating FAISS Indexing and ML Handoff Artifact Export...")
    
    # 1. SETUP PATHS
    BASE_DIR = Path(__file__).resolve().parent.parent
    CLEANED_SEBI_DIR = BASE_DIR / "data" / "sebi_cleaned"
    REPORTS_DIR = BASE_DIR / "data" / "reports"
    DOCS_DIR = BASE_DIR.parent / "docs"
    
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    
    chunks_path = CLEANED_SEBI_DIR / "sebi_parsed_chunks.json"
    if not chunks_path.exists():
        raise FileNotFoundError("Parsed SEBI chunks not found. Run SCRIPT 1 first.")
        
    # 2. LOAD SEBI CHUNKS
    print("Loading SEBI parsed chunks...")
    with open(chunks_path, "r", encoding="utf-8") as f:
        parsed_docs = json.load(f)
        
    # Flatten pages into indexable chunks
    flat_chunks = []
    for doc in parsed_docs:
        doc_name = doc["document"]
        doc_type = doc.get("doc_type", "DRHP")
        for page in doc["pages"]:
            page_num = page["page_number"]
            text = page["text"].strip()
            if len(text) > 50:  # skip empty or tiny pages
                flat_chunks.append({
                    "document": doc_name,
                    "doc_type": doc_type,
                    "page_number": page_num,
                    "text": text,
                    "tables": page.get("tables", [])
                })
                
    total_chunks = len(flat_chunks)
    print(f"Prepared {total_chunks} pages/chunks for vector indexing.")
    
    # 3. GENERATE EMBEDDINGS
    print("Loading SentenceTransformer model ('all-MiniLM-L6-v2')...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    texts = [c["text"] for c in flat_chunks]
    print("Encoding text chunks into dense vectors...")
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
    
    # 4. BUILD FAISS INDEX
    print("Building FAISS index...")
    dimension = embeddings.shape[1]  # Should be 384
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    
    index_path = BASE_DIR / "sebi_faiss.index"
    faiss.write_index(index, str(index_path))
    print(f"Exported FAISS vector database to {index_path}")
    
    # Save companion metadata map
    metadata_path = BASE_DIR / "sebi_faiss_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        clean_metadata = [
            {
                "document": c["document"], 
                "doc_type": c["doc_type"], 
                "page_number": c["page_number"], 
                "text": c["text"]
            }
            for c in flat_chunks
        ]
        json.dump(clean_metadata, f, indent=2, ensure_ascii=False)
    print(f"Exported FAISS companion metadata to {metadata_path}")
    
    # 5. METRIC EXTRACTION
    print("Extracting key financial indicators from SEBI texts...")
    extracted_metrics = []
    
    revenue_pat = re.compile(r"(?:revenue|income|turnover).*?(\d+(?:\.\d+)?\s*(?:million|crore|billion|percent|%))", re.IGNORECASE)
    profit_pat = re.compile(r"(?:net profit|profit after tax|pat).*?(\d+(?:\.\d+)?\s*(?:million|crore|billion|percent|%))", re.IGNORECASE)
    debt_pat = re.compile(r"(?:debt to equity|debt-to-equity|debt equity).*?(\d+(?:\.\d+)?\s*(?:ratio|times|:|\s))", re.IGNORECASE)
    
    for c in flat_chunks:
        text = c["text"]
        
        risk_sentences = []
        for sentence in re.split(r'(?<=[.!?])\s+', text):
            if "risk factor" in sentence.lower() or "internal risk" in sentence.lower():
                clean_s = sentence.strip().replace("\n", " ")
                if 20 < len(clean_s) < 200:
                    risk_sentences.append(clean_s)
                    
        rev_match = revenue_pat.search(text)
        profit_match = profit_pat.search(text)
        debt_match = debt_pat.search(text)
        
        if rev_match or profit_match or debt_match or risk_sentences:
            extracted_metrics.append({
                "document": c["document"],
                "doc_type": c["doc_type"],
                "page": c["page_number"],
                "indicators": {
                    "revenue": rev_match.group(0).strip().replace("\n", " ") if rev_match else None,
                    "net_profit": profit_match.group(0).strip().replace("\n", " ") if profit_match else None,
                    "debt_to_equity": debt_match.group(0).strip().replace("\n", " ") if debt_match else None
                },
                "identified_risks": risk_sentences[:3]
            })
            
    metrics_path = REPORTS_DIR / "sebi_extracted_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(extracted_metrics, f, indent=2, ensure_ascii=False)
    print(f"Exported key metrics report to {metrics_path}")
    
    # 6. WRITE ML HANDOFF GUIDE
    guide_path = DOCS_DIR / "ML_HANDOFF_GUIDE.md"
    guide_content = """# ProspectusIQ ML & Security Handoff Guide

This document describes the interface specifications, normalization, and invocation details for the machine learning artifacts generated in the ProspectusIQ pipeline.

---

## 1. SQL Injection (SQLi) Payload Detector

### Model Details
- **Type:** Character-level TF-IDF + Logistic Regression
- **Artifact:** `ml/models/sqli_detector_sebi.pkl` (Serialized Scikit-Learn Pipeline)
- **Features:** 10,000 sub-string features (char n-grams from 2 to 4)
- **Threshold:** Lowered to `0.01` to guarantee high security recall.

### Inference & Normalization Contract
To invoke the model in Python (e.g. backend integration):

```python
import re
import urllib.parse
import joblib

# Load pipeline
pipeline = joblib.load("ml/models/sqli_detector_sebi.pkl")

# Deterministic SQLi regex patterns for 100% recall fallback
SQLI_PATTERNS = [
    r"union\\s+select",
    r"select\\s+.*\\s+from",
    r"insert\\s+into",
    r"delete\\s+from",
    r"drop\\s+table",
    r"update\\s+.*\\s+set",
    r"or\\s+\\d+\\s*=\\s*\\d+",
    r"and\\s+\\d+\\s*=\\s*\\d+",
    r"or\\s+['\"].*['\"]\\s*=\\s*['\"].*['\"]",
    r"and\\s+['\"].*['\"]\\s*=\\s*['\"].*['\"]",
    r"/\\*.*\\*/",
    r"--;",
    r"xp_cmdshell"
]

def clean_input(text: str) -> str:
    # 1. URL Decode input
    decoded = urllib.parse.unquote(text)
    # 2. Lowercase conversion
    lowered = decoded.lower()
    # 3. Collapse multiple whitespaces
    collapsed = re.sub(r'\\s+', ' ', lowered)
    return collapsed.strip()

def is_malicious(text: str) -> bool:
    cleaned = clean_input(text)
    
    # Stage 1: Deterministic check
    for pattern in SQLI_PATTERNS:
        if re.search(pattern, cleaned):
            return True
            
    # Stage 2: ML Model prediction with low threshold (0.01)
    probs = pipeline.predict_proba([text])[0]
    return probs[1] > 0.01
```

---

## 2. FAISS Vector Database (RAG Retrieval)

### Embedding Details
- **Model:** `sentence-transformers/all-MiniLM-L6-v2` (dimension = 384)
- **Index:** `ml/sebi_faiss.index` (Flat L2 index)
- **Metadata Map:** `ml/sebi_faiss_metadata.json` (Maps index offset `i` to `{document, doc_type, page_number, text}`)

### Search Contract
```python
import faiss
import json
from sentence_transformers import SentenceTransformer

# Load models and index
model = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("ml/sebi_faiss.index")
with open("ml/sebi_faiss_metadata.json", "r") as f:
    metadata = json.load(f)

def retrieve_context(query: str, top_k: int = 3):
    query_vector = model.encode([query])[0].reshape(1, -1)
    distances, indices = index.search(query_vector, top_k)
    
    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < len(metadata):
            item = metadata[idx]
            results.append({
                "document": item["document"],
                "doc_type": item["doc_type"],
                "page": item["page_number"],
                "text": item["text"],
                "score": float(dist)
            })
    return results
```
"""
    with open(guide_path, "w", encoding="utf-8") as f:
        f.write(guide_content)
    print(f"Exported Handoff Guide to {guide_path}")
    print("FAISS indexing and export pipeline successfully completed.")

if __name__ == "__main__":
    run_indexing_and_export()
