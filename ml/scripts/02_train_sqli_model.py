import os
from pathlib import Path

# Set environment variables for thread optimization before importing libraries
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def train_model():
    print("Initializing model training pipeline...")
    
    # 1. SETUP PATHS
    BASE_DIR = Path(__file__).resolve().parent.parent
    CLEANED_SEC_DIR = BASE_DIR / "data" / "security_cleaned"
    MODELS_DIR = BASE_DIR / "models"
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    train_path = CLEANED_SEC_DIR / "train.csv"
    val_path = CLEANED_SEC_DIR / "val.csv"
    test_path = CLEANED_SEC_DIR / "test.csv"
    
    if not (train_path.exists() and val_path.exists() and test_path.exists()):
        raise FileNotFoundError("Cleaned dataset files not found. Run SCRIPT 1 first.")
        
    # 2. LOAD DATA
    print("Loading datasets...")
    train_df = pd.read_csv(train_path, encoding="utf-8").dropna()
    val_df = pd.read_csv(val_path, encoding="utf-8").dropna()
    test_df = pd.read_csv(test_path, encoding="utf-8").dropna()
    
    X_train, y_train = train_df["text"], train_df["label"]
    X_val, y_val = val_df["text"], val_df["label"]
    X_test, y_test = test_df["text"], test_df["label"]
    
    # 3. DEFINE PIPELINE
    print("Building Scikit-Learn Pipeline...")
    pipeline = Pipeline([
        ('vectorizer', TfidfVectorizer(
            analyzer='char', 
            ngram_range=(2, 4), 
            max_features=10000
        )),
        ('classifier', LogisticRegression(
            C=10.0, 
            max_iter=1000, 
            solver='saga', 
            random_state=42
        ))
    ])
    
    # 4. TRAINING
    print("Fitting model (Logistic Regression with SAGA solver)...")
    pipeline.fit(X_train, y_train)
    print("Model training complete.")
    
    # 5. VALIDATION EVALUATION
    print("Evaluating on Validation Set:")
    val_preds = pipeline.predict(X_val)
    print(f"Validation Accuracy: {accuracy_score(y_val, val_preds):.4f}")
    print("\nClassification Report (Val):")
    print(classification_report(y_val, val_preds))
    print("Confusion Matrix (Val):")
    print(confusion_matrix(y_val, val_preds))
    
    # 6. TEST EVALUATION
    print("\nEvaluating on Test Set:")
    test_preds = pipeline.predict(X_test)
    print(f"Test Accuracy: {accuracy_score(y_test, test_preds):.4f}")
    print("\nClassification Report (Test):")
    print(classification_report(y_test, test_preds))
    print("Confusion Matrix (Test):")
    print(confusion_matrix(y_test, test_preds))
    
    # 7. EXPORT ARTIFACT
    model_path = MODELS_DIR / "sqli_detector_sebi.pkl"
    print(f"Saving trained model to {model_path}...")
    joblib.dump(pipeline, model_path)
    print("Model serialization complete!")

if __name__ == "__main__":
    train_model()
