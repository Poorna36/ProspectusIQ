"""
ProspectusIQ - Script 02: Production Training Pipeline for SQLi Detector Model
==============================================================================
File: ml/scripts/02_train_sqli_model.py
Platform: Windows Native (pathlib, UTF-8, OpenBLAS memory optimized)

Objective:
Trains a character-level TF-IDF + Logistic Regression model on the SEBI-enriched security dataset
(train.csv, val.csv, test.csv) to classify input queries as Safe (0) vs. Malicious SQLi (1).

Workflow:
1. Environment Setup: Sets thread caps for OpenBLAS / OMP to prevent Windows memory contention
2. Dataset Loading & Validation: Loads and validates train/val/test split columns against nulls
3. Scikit-Learn Pipeline: TfidfVectorizer(analyzer='char', ngram_range=(2,4), max_features=5000)
   + LogisticRegression(C=10.0, solver='liblinear', random_state=42)
4. Evaluation & Sanity Report: Prints Accuracy, Classification Report, and Confusion Matrix
5. Model Serialization: Saves artifact to models/sqli_detector_sebi.pkl using joblib
6. Live Inference Verification: Evaluates mandatory test sample queries
"""

import os
# Prevent OpenBLAS thread allocation issues on Windows Python
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'

import sys
import json
import joblib
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ==============================================================================
# 1. DIRECTORY RESOLUTION & SETUP
# ==============================================================================

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent if SCRIPT_DIR.name in ["scripts", "ml"] else SCRIPT_DIR
if PROJECT_ROOT.name == "ml":
    PROJECT_ROOT = PROJECT_ROOT.parent

DATASET_CANDIDATE_DIRS = [
    PROJECT_ROOT / "data" / "security_cleaned",
    PROJECT_ROOT / "ml" / "data" / "security_cleaned",
    PROJECT_ROOT / "data" / "security" / "processed",
    PROJECT_ROOT / "ml" / "data" / "security" / "processed"
]

MODEL_TARGET_DIRS = [
    PROJECT_ROOT / "models",
    PROJECT_ROOT / "ml" / "models"
]

for m_dir in MODEL_TARGET_DIRS:
    m_dir.mkdir(parents=True, exist_ok=True)


# ==============================================================================
# 2. DATASET LOADING & INTEGRITY VALIDATION
# ==============================================================================

def locate_dataset_directory() -> Path:
    """Finds the dataset directory containing train.csv, val.csv, test.csv."""
    for cand in DATASET_CANDIDATE_DIRS:
        if (cand / "train.csv").exists() and (cand / "val.csv").exists() and (cand / "test.csv").exists():
            return cand
            
    print("   [!] Dataset files missing. Running Script 01 to generate security dataset...")
    try:
        import subprocess
        script_01 = SCRIPT_DIR / "01_prepare_sebi_security_dataset.py"
        subprocess.run([sys.executable, str(script_01)], check=True)
    except Exception as err:
        print(f"   [!] Failed auto-running Script 01: {err}")
        
    for cand in DATASET_CANDIDATE_DIRS:
        if (cand / "train.csv").exists():
            return cand
            
    raise FileNotFoundError("CRITICAL ERROR: Could not locate train.csv, val.csv, test.csv.")


def load_and_validate_split(file_path: Path) -> tuple[pd.Series, pd.Series]:
    """Loads a dataset split and validates query text and label columns."""
    df = pd.read_csv(file_path, encoding="utf-8")
    
    text_col = "cleaned_query" if "cleaned_query" in df.columns else "Query"
    label_col = "label" if "label" in df.columns else "Label"
    
    if text_col not in df.columns or label_col not in df.columns:
        raise KeyError(f"Expected query/label columns in {file_path}. Found: {df.columns.tolist()}")

    initial_len = len(df)
    df = df.dropna(subset=[text_col, label_col]).copy()
    df[text_col] = df[text_col].astype(str)
    df[label_col] = df[label_col].astype(int)
    
    if len(df) < initial_len:
        print(f"   Notice: Removed {initial_len - len(df)} null rows from {file_path.name}")
        
    return df[text_col], df[label_col]


# ==============================================================================
# 3. MODEL PIPELINE DEFINITION & TRAINING
# ==============================================================================

def train_sqli_detector_pipeline(x_train: pd.Series, y_train: pd.Series) -> Pipeline:
    """
    Constructs and fits character n-gram TF-IDF + Logistic Regression pipeline.
    - Vectorizer: char analyzer, n-grams (2,4), max 5,000 features
    - Classifier: LogisticRegression C=10.0, solver='liblinear'
    """
    print("\n[STEP 1/3] Training Character N-Gram TF-IDF + Logistic Regression Model...")
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            analyzer='char',
            ngram_range=(2, 4),
            max_features=5000,
            sublinear_tf=True
        )),
        ('clf', LogisticRegression(
            C=10.0,
            solver='liblinear',
            random_state=42,
            max_iter=1000
        ))
    ])
    
    pipeline.fit(x_train, y_train)
    print("   [OK] Scikit-Learn Model Pipeline trained successfully!")
    return pipeline


# ==============================================================================
# 4. EVALUATION & SANITY REPORTING
# ==============================================================================

def evaluate_model_performance(pipeline: Pipeline, x_val: pd.Series, y_val: pd.Series, x_test: pd.Series, y_test: pd.Series):
    """Evaluates trained pipeline on Validation and Test sets."""
    print("\n[STEP 2/3] Evaluating Performance Metrics...")
    
    val_preds = pipeline.predict(x_val)
    val_acc = accuracy_score(y_val, val_preds) * 100
    
    test_preds = pipeline.predict(x_test)
    test_acc = accuracy_score(y_test, test_preds) * 100
    
    print("\n==================================================================")
    print("          PROSPECTUSIQ SQLi DETECTOR EVALUATION REPORT            ")
    print("==================================================================")
    print(f"1. Validation Accuracy: {val_acc:.2f}%")
    print(f"2. Test Accuracy:       {test_acc:.2f}%")
    
    print("\n--- [TEST SET CLASSIFICATION REPORT] ---")
    print(classification_report(y_test, test_preds, target_names=["Class 0 (Safe)", "Class 1 (SQLi)"], digits=4))
    
    print("--- [TEST SET CONFUSION MATRIX] ---")
    cm = confusion_matrix(y_test, test_preds)
    print(f"   True Negatives (Safe correctly passed):  {cm[0][0]}")
    print(f"   False Positives (Safe falsely blocked): {cm[0][1]}")
    print(f"   False Negatives (SQLi falsely passed):   {cm[1][0]}")
    print(f"   True Positives (SQLi correctly blocked): {cm[1][1]}")
    print("==================================================================\n")


# ==============================================================================
# 5. MODEL SERIALIZATION & EXPORT
# ==============================================================================

def export_model_artifacts(pipeline: Pipeline) -> list[Path]:
    """Serializes trained model pipeline to models/sqli_detector_sebi.pkl using joblib."""
    print("[STEP 3/3] Exporting Serialized Model Artifacts...")
    saved_paths = []
    
    for m_dir in MODEL_TARGET_DIRS:
        artifact_path = m_dir / "sqli_detector_sebi.pkl"
        joblib.dump(pipeline, artifact_path)
        saved_paths.append(artifact_path)
        print(f"   [OK] Model artifact saved -> {artifact_path}")
        
    return saved_paths


# ==============================================================================
# 6. INFERENCE VERIFICATION FUNCTION
# ==============================================================================

import urllib.parse
import re

def normalize_security_query(query: str) -> str:
    """Normalizes input query (unquotes URL encoding, lowercases, removes control characters)."""
    if not isinstance(query, str):
        return ""
    decoded = urllib.parse.unquote(query)
    if "%" in decoded:
        try:
            decoded = urllib.parse.unquote(decoded)
        except Exception:
            pass
    lowered = decoded.lower()
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', lowered)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def verify_live_inference(model_path: Path):
    """Loads serialized model artifact and evaluates live test queries."""
    print("\n==================================================================")
    print("               LIVE INFERENCE VERIFICATION TEST                   ")
    print("==================================================================")
    print(f"Loading Serialized Model Artifact: {model_path}")
    
    model = joblib.load(model_path)
    
    test_cases = [
        ("What are the major risk factors in Cult.fit DRHP?", 0),
        ("SELECT * FROM users WHERE username = 'admin' --", 1),
        ("%27%20OR%201%3D1%20--", 1),
        ("Show revenue breakdown for financial year 2025", 0),
        ("' UNION SELECT credit_card_num FROM accounts--", 1),
        ("Search objects of the issue for TechNova Solutions SME IPO", 0),
        ("1; DROP TABLE filings; --", 1)
    ]
    
    for idx, (query, expected_label) in enumerate(test_cases, 1):
        cleaned = normalize_security_query(query)
        probs = model.predict_proba([cleaned])[0]
        pred_label = int(model.predict([cleaned])[0])
        
        status_str = "BLOCKED (1)" if pred_label == 1 else "SAFE (0)"
        confidence = probs[pred_label] * 100
        match_symbol = "[MATCH]" if pred_label == expected_label else "[MISMATCH]"
        
        print(f"{idx}. Raw Query : \"{query}\"")
        print(f"   Normalized: \"{cleaned}\"")
        print(f"   Prediction: {status_str} (Confidence: {confidence:.1f}%) {match_symbol}\n")
        
    print("==================================================================\n")


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    print("==================================================================")
    print(" ProspectusIQ - 02_train_sqli_model.py (Production Training)")
    print("==================================================================")
    
    dataset_dir = locate_dataset_directory()
    print(f"Loading datasets from: {dataset_dir}")
    
    X_train, y_train = load_and_validate_split(dataset_dir / "train.csv")
    X_val, y_val = load_and_validate_split(dataset_dir / "val.csv")
    X_test, y_test = load_and_validate_split(dataset_dir / "test.csv")
    
    print(f"   - Train Split: {len(X_train)} samples")
    print(f"   - Val Split:   {len(X_val)} samples")
    print(f"   - Test Split:  {len(X_test)} samples")
    
    sqli_pipeline = train_sqli_detector_pipeline(X_train, y_train)
    evaluate_model_performance(sqli_pipeline, X_val, y_val, X_test, y_test)
    saved_artifacts = export_model_artifacts(sqli_pipeline)
    verify_live_inference(saved_artifacts[0])
    
    print("[SUCCESS] Model training and live inference verification completed!")
