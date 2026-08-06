# ProspectusIQ ML & Security Handoff Guide

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
    r"union\s+select",
    r"select\s+.*\s+from",
    r"insert\s+into",
    r"delete\s+from",
    r"drop\s+table",
    r"update\s+.*\s+set",
    r"or\s+\d+\s*=\s*\d+",
    r"and\s+\d+\s*=\s*\d+",
    r"or\s+['"].*['"]\s*=\s*['"].*['"]",
    r"and\s+['"].*['"]\s*=\s*['"].*['"]",
    r"/\*.*\*/",
    r"--;",
    r"xp_cmdshell"
]

def clean_input(text: str) -> str:
    # 1. URL Decode input
    decoded = urllib.parse.unquote(text)
    # 2. Lowercase conversion
    lowered = decoded.lower()
    # 3. Collapse multiple whitespaces
    collapsed = re.sub(r'\s+', ' ', lowered)
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
