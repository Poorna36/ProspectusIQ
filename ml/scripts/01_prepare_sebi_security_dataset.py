import os
import re
import json
import urllib.parse
from pathlib import Path
import requests
from bs4 import BeautifulSoup
import fitz  # PyMuPDF
import pdfplumber
import pandas as pd
from sklearn.model_selection import train_test_split

# 1. SETUP PATHS
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "sebi_official_raw"
CLEANED_SEBI_DIR = BASE_DIR / "data" / "sebi_cleaned"
CLEANED_SEC_DIR = BASE_DIR / "data" / "security_cleaned"

for directory in [RAW_DIR, CLEANED_SEBI_DIR, CLEANED_SEC_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
}

# 2. SEBI SCRAPER USING SEARCH QUERIES
def scrape_sebi_documents():
    print("Initiating SEBI official document scraper via targeted search queries...")
    
    download_targets = [
        ("DRHP", 20, "DRHP"),
        ("Regulations", 5, "Regulations"),
        ("Letter", 20, "Observation letters")
    ]
    
    downloaded_files = []
    
    for query, limit, doc_type in download_targets:
        print(f"\nQuerying SEBI for: '{query}' (Targeting {limit} downloads as '{doc_type}')")
        url = f"https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListingAll=yes&searchBoardId=3&searchCategoryId=16&search={query}"
        
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, 'html.parser')
            table = soup.find('table')
            if not table:
                print(f"No table found for query '{query}'")
                continue
                
            rows = table.find_all('tr')[1:]
            count = 0
            for row in rows:
                if count >= limit:
                    break
                    
                cells = row.find_all('td')
                if len(cells) >= 3:
                    row_type = cells[1].text.strip()
                    title_cell = cells[-1] # Title is always the last column
                    
                    a = title_cell.find('a', href=True)
                    if not a:
                        continue
                        
                    detail_url = urllib.parse.urljoin("https://www.sebi.gov.in", a['href'])
                    print(f"Resolving detail page: {detail_url}")
                    
                    try:
                        detail_resp = requests.get(detail_url, headers=HEADERS, timeout=20)
                        detail_resp.raise_for_status()
                        detail_soup = BeautifulSoup(detail_resp.text, 'html.parser')
                        
                        pdf_url = None
                        
                        # Find PDF URL in detail page
                        for iframe in detail_soup.find_all("iframe"):
                            src = iframe.get("src", "")
                            if "pdf-viewer" in src and "docUrl=" in src:
                                match = re.search(r"docUrl=([^&]+)", src)
                                if match:
                                    pdf_url = urllib.parse.unquote(match.group(1))
                                    break
                            elif "file=" in src:
                                parsed_qs = urllib.parse.parse_qs(urllib.parse.urlparse(src).query)
                                if "file" in parsed_qs:
                                    pdf_url = parsed_qs["file"][0]
                                    break
                            elif ".pdf" in src:
                                pdf_url = src
                                break
                                
                        if not pdf_url:
                            for a_tag in detail_soup.find_all("a", href=True):
                                href = a_tag["href"]
                                if "file=" in href:
                                    parsed_qs = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
                                    if "file" in parsed_qs:
                                        pdf_url = parsed_qs["file"][0]
                                        break
                                elif ".pdf" in href.lower():
                                    pdf_url = href
                                    break
                                elif "doDownloadFile" in href:
                                    pdf_url = href
                                    break
                                    
                        if pdf_url:
                            if not pdf_url.startswith("http"):
                                pdf_url = urllib.parse.urljoin("https://www.sebi.gov.in", pdf_url)
                            
                            filename = os.path.basename(urllib.parse.urlparse(pdf_url).path)
                            if not filename or not filename.endswith(".pdf"):
                                filename = f"{doc_type.lower().replace(' ', '_')}_{count+1}.pdf"
                                
                            filename = re.sub(r'[\\/*?:"<>|]', "_", filename)
                            output_path = RAW_DIR / filename
                            
                            print(f"Downloading PDF: {pdf_url} -> {output_path}")
                            pdf_data = requests.get(pdf_url, headers=HEADERS, timeout=45)
                            pdf_data.raise_for_status()
                            
                            with open(output_path, "wb") as f:
                                f.write(pdf_data.content)
                                
                            downloaded_files.append((output_path, doc_type))
                            print(f"Successfully downloaded {filename} ({doc_type})")
                            count += 1
                        else:
                            print("PDF link not found on detail page.")
                    except Exception as e:
                        print(f"Failed to process detail page {detail_url}: {e}")
                        
        except Exception as e:
            print(f"Failed to complete search query '{query}': {e}")
            
    return downloaded_files

# 3. PDF TEXT & TABLE EXTRACTION
def extract_pdf_data(pdf_infos):
    print("Extracting text and tables from downloaded PDFs...")
    all_chunks = []
    
    for pdf_path, doc_type in pdf_infos:
        print(f"Parsing: {pdf_path.name} as {doc_type}")
        doc_chunks = {
            "document": pdf_path.name,
            "doc_type": doc_type,
            "pages": []
        }
        
        try:
            doc = fitz.open(pdf_path)
            with pdfplumber.open(pdf_path) as pdf_plumb:
                max_pages = min(len(doc), 100 if doc_type == "Regulations" else 50)
                for idx in range(max_pages):
                    page_fitz = doc[idx]
                    text = page_fitz.get_text()
                    
                    page_plumb = pdf_plumb.pages[idx]
                    tables = page_plumb.extract_tables()
                    
                    doc_chunks["pages"].append({
                        "page_number": idx + 1,
                        "text": text,
                        "tables": tables
                    })
            all_chunks.append(doc_chunks)
        except Exception as e:
            print(f"Error parsing PDF {pdf_path.name}: {e}")
            
    output_json = CLEANED_SEBI_DIR / "sebi_parsed_chunks.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)
    print(f"Exported parsed chunks to {output_json}")
    return all_chunks

# 4. DATASET PREPARATION & PREPROCESSING
def clean_string(s):
    s = urllib.parse.unquote(s)
    s = s.lower()
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def prepare_security_dataset(parsed_sebi):
    print("Preparing security dataset (Class 0: Safe, Class 1: Malicious)...")
    
    safe_samples = set()
    for doc in parsed_sebi:
        for page in doc["pages"]:
            sentences = re.split(r'(?<=[.!?])\s+', page["text"])
            for s in sentences:
                cleaned = clean_string(s)
                if 15 < len(cleaned) < 300 and not any(ch in cleaned for ch in ["{", "}", "<", ">", ";", "select ", "union "]):
                    safe_samples.add(cleaned)
                    
    print(f"Extracted {len(safe_samples)} candidate safe sentences from SEBI texts.")
    
    # Class 1: Fetch SQL Injection payloads
    sqli_sources = [
        "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/Generic-SQLi.txt",
        "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/quick-SQLi.txt",
        "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/Generic-BlindSQLi.fuzzdb.txt",
        "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/SQLi-Polyglots.txt"
    ]
    
    malicious_samples = set()
    for url in sqli_sources:
        try:
            print(f"Fetching payloads from: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=20)
            resp.raise_for_status()
            lines = resp.text.splitlines()
            for line in lines:
                if line and not line.startswith("#") and not line.startswith("--"):
                    cleaned = clean_string(line)
                    if cleaned:
                        malicious_samples.add(cleaned)
        except Exception as e:
            print(f"Failed to fetch payloads from {url}: {e}")
            
    print(f"Fetched {len(malicious_samples)} candidate malicious payloads.")
    
    safe_list = list(safe_samples)
    total_pool = len(safe_list) + len(malicious_samples)
    print(f"Total pool size: {total_pool} (Safe: {len(safe_list)}, Malicious: {len(malicious_samples)})")
    
    if total_pool < 3800:
        print("Warning: Pool size is below 3800. Adjusting safe sentences constraints.")
        for doc in parsed_sebi:
            for page in doc["pages"]:
                phrases = re.split(r'[,;\n]', page["text"])
                for p in phrases:
                    cleaned = clean_string(p)
                    if 10 < len(cleaned) < 150:
                        safe_samples.add(cleaned)
        safe_list = list(safe_samples)
        total_pool = len(safe_list) + len(malicious_samples)
        
    print(f"Final pool - Safe: {len(safe_list)}, Malicious: {len(malicious_samples)}")
    
    safe_df = pd.DataFrame({"text": safe_list, "label": 0})
    mal_df = pd.DataFrame({"text": list(malicious_samples), "label": 1})
    
    df = pd.concat([safe_df, mal_df]).drop_duplicates(subset=["text"])
    print(f"Total deduplicated dataset records: {len(df)}")
    
    # Stratified split: 70% Train, 15% Val, 15% Test
    train_df, temp_df = train_test_split(df, test_size=0.30, stratify=df["label"], random_state=42)
    val_df, test_df = train_test_split(temp_df, test_size=0.50, stratify=temp_df["label"], random_state=42)
    
    # Export CSVs
    df.to_csv(CLEANED_SEC_DIR / "data.csv", index=False, encoding="utf-8")
    train_df.to_csv(CLEANED_SEC_DIR / "train.csv", index=False, encoding="utf-8")
    val_df.to_csv(CLEANED_SEC_DIR / "val.csv", index=False, encoding="utf-8")
    test_df.to_csv(CLEANED_SEC_DIR / "test.csv", index=False, encoding="utf-8")
    
    # Export JSON
    full_json = {
        "metadata": {
            "total_records": len(df),
            "train_size": len(train_df),
            "val_size": len(val_df),
            "test_size": len(test_df),
            "safe_count": int((df["label"] == 0).sum()),
            "malicious_count": int((df["label"] == 1).sum())
        },
        "records": df.to_dict(orient="records")
    }
    
    with open(CLEANED_SEC_DIR / "full_dataset.json", "w", encoding="utf-8") as f:
        json.dump(full_json, f, indent=2, ensure_ascii=False)
        
    print("Dataset generation complete!")
    print(f"Train: {len(train_df)} | Val: {len(val_df)} | Test: {len(test_df)}")

if __name__ == "__main__":
    downloaded = scrape_sebi_documents()
    if not downloaded:
        print("Error: No documents downloaded.")
    parsed = extract_pdf_data(downloaded)
    prepare_security_dataset(parsed)
