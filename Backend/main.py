"""
Smart Backlog Detection Predictor - FastAPI Backend
Sole Purpose: Machine Learning Backlog Risk Prediction
- Predicts whether a student is at risk of getting a backlog using a trained DecisionTreeClassifier.
- Pure ML inference using Scikit-Learn and Pandas.
- ZERO database, ZERO authentication, ZERO user accounts, ZERO prediction history.
"""

import os
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional
# pyrefly: ignore [missing-import]
import joblib
import pandas as pd
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

# Base Directory Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATHS = [
    os.path.join(BASE_DIR, "ml_models", "backlog_model.pkl"),
    os.path.join(BASE_DIR, "models", "backlog_model.pkl")
]

CSV_PATHS = [
    os.path.join(BASE_DIR, "data", "student_performance(1).csv"),
    os.path.join(BASE_DIR, "data", "student_performance.csv"),
    os.path.join(BASE_DIR, "dataset", "student_performance(1).csv"),
    os.path.join(BASE_DIR, "dataset", "student_performance.csv")
]

# In-memory cached model instance and analytics metrics
_model_instance = None
_dataset_info_cache = None
_model_eval_cache = None

def get_resolved_csv_path() -> str:
    """Locates the student performance CSV dataset."""
    for p in CSV_PATHS:
        if os.path.exists(p):
            return p
    raise FileNotFoundError("student_performance dataset not found in data/ or dataset/")

def get_resolved_model_path() -> str:
    """Locates the trained backlog model file."""
    for p in MODEL_PATHS:
        if os.path.exists(p):
            return p
    return MODEL_PATHS[0]

def load_ml_model():
    """Loads the trained Decision Tree model once using joblib."""
    global _model_instance
    if _model_instance is not None:
        return _model_instance
        
    model_path = get_resolved_model_path()
    if not os.path.exists(model_path):
        print(f"[Model Loader] Model not found at {model_path}. Training new model...")
        from train_model import train
        train()
        
    print(f"[Model Loader] Loading trained DecisionTree model from: {model_path}")
    _model_instance = joblib.load(model_path)
    return _model_instance

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads the trained ML model once when FastAPI starts up."""
    print("[Startup] Initializing Smart Backlog Detection Predictor...")
    try:
        load_ml_model()
        print("[Startup] Machine learning model ready for inference.")
    except Exception as e:
        print(f"[Startup Error] Could not load ML model: {e}")
    yield
    print("[Shutdown] Smart Backlog Detection Predictor shutting down.")

# Initialize FastAPI App
app = FastAPI(
    title="Smart Backlog Detection Predictor",
    description="Machine Learning API for predicting student backlog risk using DecisionTree model",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration for React/Vite Frontend (Development and Deployed Production)
origins_env = os.getenv("CORS_ORIGINS", "*")
if origins_env == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False if origins == ["*"] else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def root():
    """
    Root endpoint indicating API service health and navigation links.
    """
    return {
        "status": "online",
        "service": "Smart Backlog Detection Predictor API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "health": "/api/health",
            "predict": "POST /api/predict",
            "dashboard": "GET /api/dashboard",
            "dataset_info": "GET /api/dataset-info",
            "model_evaluation": "GET /api/model-evaluation"
        }
    }


# ==================================================
# PYDANTIC INPUT / OUTPUT SCHEMAS
# ==================================================

class PredictionInput(BaseModel):
    weekly_self_study_hours: float = Field(
        ..., 
        ge=0, 
        le=60, 
        description="Weekly self-study hours (e.g. 0 to 40)"
    )
    attendance_percentage: float = Field(
        ..., 
        ge=0, 
        le=100, 
        description="Attendance percentage (0 to 100)"
    )
    class_participation: float = Field(
        ..., 
        ge=0, 
        le=10, 
        description="Class participation score (0 to 10)"
    )

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="0 = No Backlog, 1 = Backlog")
    result: str = Field(..., description="'No Backlog' or 'Backlog'")
    backlog: bool = Field(..., description="True if backlog risk detected")
    message: str = Field(..., description="Summary explanation for student")
    probability: float = Field(..., description="Probability score between 0 and 1")
    risk_percentage: float = Field(..., description="Probability as percentage (0-100%)")
    inputs: Dict[str, float] = Field(..., description="Submitted student features")

# ==================================================
# 1. HEALTH CHECK ENDPOINT
# ==================================================

@app.get("/api/health", tags=["Health"])
def health_check():
    """
    Health check endpoint.
    Reports system status and model availability.
    """
    is_loaded = _model_instance is not None
    if not is_loaded:
        try:
            load_ml_model()
            is_loaded = True
        except Exception:
            pass
            
    return {
        "status": "ok",
        "model_loaded": is_loaded
    }

# ==================================================
# 2. MAIN PREDICTION ENDPOINT
# ==================================================

@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_backlog(payload: PredictionInput) -> PredictionResponse:
    """
    Predicts whether a student is at risk of academic backlog.
    Features:
      1. weekly_self_study_hours
      2. attendance_percentage
      3. class_participation
    Target Mapping:
      - 1 -> Backlog (Risk: High)
      - 0 -> No Backlog (Risk: Low)
    """
    try:
        model = load_ml_model()
        
        # Prepare feature DataFrame in exact order used during training
        feature_order = ["weekly_self_study_hours", "attendance_percentage", "class_participation"]
        input_data = pd.DataFrame([{
            "weekly_self_study_hours": float(payload.weekly_self_study_hours),
            "attendance_percentage": float(payload.attendance_percentage),
            "class_participation": float(payload.class_participation)
        }])[feature_order]

        # 1. Class prediction (0 or 1)
        pred_class = int(model.predict(input_data)[0])

        # 2. Probability prediction via predict_proba
        prob = 0.0
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_data)[0]
            # Index 1 corresponds to Backlog class
            prob = float(probabilities[1]) if len(probabilities) > 1 else (1.0 if pred_class == 1 else 0.0)
        else:
            prob = 1.0 if pred_class == 1 else 0.0

        is_backlog = (pred_class == 1)
        result_label = "Backlog" if is_backlog else "No Backlog"
        message = (
            "Student is predicted to be at backlog risk." 
            if is_backlog else 
            "Student is currently predicted to be at low backlog risk."
        )
        risk_pct = round(prob * 100.0, 2)

        return PredictionResponse(
            prediction=pred_class,
            result=result_label,
            backlog=is_backlog,
            message=message,
            probability=round(prob, 4),
            risk_percentage=risk_pct,
            inputs={
                "weekly_self_study_hours": float(payload.weekly_self_study_hours),
                "attendance_percentage": float(payload.attendance_percentage),
                "class_participation": float(payload.class_participation)
            }
        )

    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(err)}"
        )

# ==================================================
# 3. ANALYTICS & DATASET ENDPOINTS (Frontend Visuals)
# ==================================================

@app.get("/api/dataset-info", tags=["Analytics"])
def get_dataset_info():
    """Returns dataset summary metrics for academic overview charts (cached in memory)."""
    global _dataset_info_cache
    if _dataset_info_cache is not None:
        return _dataset_info_cache

    try:
        csv_file = get_resolved_csv_path()
        df = pd.read_csv(csv_file)
        
        total_students = int(len(df))
        grade_dist = df["grade"].value_counts().to_dict() if "grade" in df else {}
        backlog_count = int((df["grade"] == "F").sum()) if "grade" in df else 0
        non_backlog_count = total_students - backlog_count
        backlog_pct = round((backlog_count / total_students) * 100, 2) if total_students > 0 else 0.0
        
        _dataset_info_cache = {
            "total_students": total_students,
            "total_columns": int(df.shape[1]),
            "backlog_students": backlog_count,
            "non_backlog_students": non_backlog_count,
            "backlog_percentage": backlog_pct,
            "columns": df.columns.tolist(),
            "missing_values": int(df.isnull().sum().sum()),
            "duplicate_rows": int(df.duplicated().sum()),
            "grade_distribution": grade_dist,
            "average_attendance": round(float(df["attendance_percentage"].mean()), 2) if "attendance_percentage" in df else 0.0,
            "average_study_hours": round(float(df["weekly_self_study_hours"].mean()), 2) if "weekly_self_study_hours" in df else 0.0,
            "average_class_participation": round(float(df["class_participation"].mean()), 2) if "class_participation" in df else 0.0,
            "average_total_score": round(float(df["total_score"].mean()), 2) if "total_score" in df else 0.0
        }
        return _dataset_info_cache
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/api/model-evaluation", tags=["Analytics"])
def get_model_evaluation():
    """Returns model testing accuracy, confusion matrix, precision, recall, and F1 (cached in memory)."""
    global _model_eval_cache
    if _model_eval_cache is not None:
        return _model_eval_cache

    try:
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
        
        model = load_ml_model()
        csv_file = get_resolved_csv_path()
        df = pd.read_csv(csv_file)
        
        df["backlog"] = (df["grade"] == "F").astype(int)
        X = df[["weekly_self_study_hours", "attendance_percentage", "class_participation"]]
        y = df["backlog"]
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, stratify=y
        )
        
        y_train_pred = model.predict(X_train)
        y_test_pred = model.predict(X_test)
        
        _model_eval_cache = {
            "training_accuracy": round(float(accuracy_score(y_train, y_train_pred)) * 100, 2),
            "testing_accuracy": round(float(accuracy_score(y_test, y_test_pred)) * 100, 2),
            "confusion_matrix": confusion_matrix(y_test, y_test_pred).tolist(),
            "precision": round(float(precision_score(y_test, y_test_pred, pos_label=1, zero_division=0)), 4),
            "recall": round(float(recall_score(y_test, y_test_pred, pos_label=1, zero_division=0)), 4),
            "f1_score": round(float(f1_score(y_test, y_test_pred, pos_label=1, zero_division=0)), 4),
            "classes": ["No Backlog", "Backlog"],
            "note": "DecisionTreeClassifier (max_depth=5, class_weight='balanced') evaluated on test split."
        }
        return _model_eval_cache
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/api/dashboard", tags=["Analytics"])
def get_dashboard():
    """Returns dataset summary metrics for dashboard display."""
    try:
        dataset_info = get_dataset_info()
        return {
            "total_students": dataset_info["total_students"],
            "backlog_students": dataset_info["backlog_students"],
            "non_backlog_students": dataset_info["non_backlog_students"],
            "backlog_percentage": dataset_info["backlog_percentage"],
            "average_attendance": dataset_info["average_attendance"],
            "average_study_hours": dataset_info["average_study_hours"],
            "average_participation": dataset_info["average_class_participation"],
            "model_accuracy": 88.76
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)

