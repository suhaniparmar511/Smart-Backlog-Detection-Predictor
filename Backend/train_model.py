"""
Smart Backlog Detection Predictor - Model Training Script
Trains a DecisionTreeClassifier using scikit-learn on student_performance dataset.

Methodology:
- Features: weekly_self_study_hours, attendance_percentage, class_participation
- Target: Backlog (Grade F = 1, Other Grades A-D = 0)
- Model: DecisionTreeClassifier(max_depth=5, random_state=42, class_weight="balanced")
- Split: 80% Train, 20% Test (stratified by target)
- Output: ml_models/backlog_model.pkl and models/backlog_model.pkl
"""

import os
import joblib
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def find_csv_dataset():
    candidates = [
        os.path.join(BASE_DIR, "data", "student_performance(1).csv"),
        os.path.join(BASE_DIR, "data", "student_performance.csv"),
        os.path.join(BASE_DIR, "dataset", "student_performance(1).csv"),
        os.path.join(BASE_DIR, "dataset", "student_performance.csv"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError("Could not find student_performance(1).csv or student_performance.csv in data/ or dataset/")

def train():
    csv_path = find_csv_dataset()
    print(f"Loading dataset from: {csv_path}...")
    df = pd.read_csv(csv_path)

    print(f"Dataset loaded: {len(df)} records, columns: {df.columns.tolist()}")

    # Preprocessing
    df["backlog"] = (df["grade"] == "F").astype(int)
    feature_cols = ["weekly_self_study_hours", "attendance_percentage", "class_participation"]
    X = df[feature_cols]
    y = df["backlog"]

    backlog_count = int(y.sum())
    total_count = len(y)
    print(f"Class distribution: {backlog_count} Backlog ({round(backlog_count/total_count*100, 2)}%), {total_count - backlog_count} Non-Backlog")

    # 80/20 train/test stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training DecisionTreeClassifier(max_depth=5, random_state=42, class_weight='balanced')...")
    model = DecisionTreeClassifier(
        max_depth=5,
        random_state=42,
        class_weight="balanced"
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)

    train_acc = accuracy_score(y_train, y_train_pred) * 100
    test_acc = accuracy_score(y_test, y_test_pred) * 100
    precision = precision_score(y_test, y_test_pred, pos_label=1, zero_division=0)
    recall = recall_score(y_test, y_test_pred, pos_label=1, zero_division=0)
    f1 = f1_score(y_test, y_test_pred, pos_label=1, zero_division=0)
    cm = confusion_matrix(y_test, y_test_pred)

    print("\n--- Model Evaluation Results ---")
    print(f"Training Accuracy : {train_acc:.2f}%")
    print(f"Testing Accuracy  : {test_acc:.2f}%")
    print(f"Backlog Recall    : {recall:.4f}")
    print(f"Backlog Precision : {precision:.4f}")
    print(f"Backlog F1-Score  : {f1:.4f}")
    print(f"Confusion Matrix  :\n{cm}")

    # Save model to ml_models/ and models/
    out_dirs = [
        os.path.join(BASE_DIR, "ml_models"),
        os.path.join(BASE_DIR, "models")
    ]
    for d in out_dirs:
        os.makedirs(d, exist_ok=True)
        model_file = os.path.join(d, "backlog_model.pkl")
        joblib.dump(model, model_file)
        print(f"Model successfully saved to: {model_file}")

    print("\nModel training and persistence complete!")

if __name__ == "__main__":
    train()
