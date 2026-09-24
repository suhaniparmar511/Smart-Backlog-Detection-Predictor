# Smart Backlog Detection Predictor - Backend

A clean, lightweight Python FastAPI backend for predicting student backlog risk using a trained Machine Learning model.

## 🎯 Project Architecture
```
React / Vite Frontend
        ↓ (HTTP POST /api/predict)
FastAPI Python Backend
        ↓ (Input Features)
Trained Scikit-Learn Model (DecisionTreeClassifier)
        ↓ (Inference)
Instant Prediction Result (0: No Backlog / 1: Backlog + Risk %)
```

**Key Characteristic:** Pure ML Inference Application.
- **NO Database** (No MongoDB, No SQLite, No external DB)
- **NO Authentication** (No login, No registration, No JWT)
- **NO History Storage** (Predictions are calculated dynamically on-demand)

---

## 📂 Project Structure
```
Backend/
│
├── main.py                     # FastAPI application with prediction API
├── train_model.py              # Script to train & save Decision Tree model
├── test_prediction.py          # Automated verification test suite
├── requirements.txt            # Minimal Python dependencies
├── .env                        # Server host & port configuration
├── .env.example
│
├── ml_models/
│   └── backlog_model.pkl       # Saved trained DecisionTreeClassifier
│
└── data/
    └── student_performance(1).csv # Training dataset
```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

Required packages:
- `fastapi`
- `uvicorn`
- `pydantic`
- `joblib`
- `pandas`
- `numpy`
- `scikit-learn`

### 2. Train or Verify ML Model (Optional)
The model `ml_models/backlog_model.pkl` is pre-trained. If you wish to retrain it from the dataset:
```bash
python train_model.py
```

### 3. Start the FastAPI Server
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive Swagger API Documentation:
- **URL**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "model_loaded": true
}
```

### 2. Student Backlog Prediction
- **Endpoint**: `POST /api/predict`
- **Request Body**:
```json
{
  "weekly_self_study_hours": 10.0,
  "attendance_percentage": 85.0,
  "class_participation": 8.0
}
```
- **Response (Safe)**:
```json
{
  "prediction": 0,
  "result": "No Backlog",
  "backlog": false,
  "message": "Student is currently predicted to be at low backlog risk.",
  "probability": 0.0,
  "risk_percentage": 0.0,
  "inputs": {
    "weekly_self_study_hours": 10.0,
    "attendance_percentage": 85.0,
    "class_participation": 8.0
  }
}
```
- **Response (Backlog Risk)**:
```json
{
  "prediction": 1,
  "result": "Backlog",
  "backlog": true,
  "message": "Student is predicted to be at backlog risk.",
  "probability": 0.9684,
  "risk_percentage": 96.84,
  "inputs": {
    "weekly_self_study_hours": 0.0,
    "attendance_percentage": 75.7,
    "class_participation": 6.8
  }
}
```

### 3. Dataset & Analytics (For UI Dashboards)
- `GET /api/dataset-info`: Academic dataset statistics and grade distributions
- `GET /api/model-evaluation`: Confusion matrix, accuracy (88.76%), precision, recall (0.9686), and F1
- `GET /api/dashboard`: Summary statistics of student dataset

---

## 🎓 Viva Explanation

> "FastAPI is used to create the Python backend APIs. The trained machine learning model (`DecisionTreeClassifier` with `max_depth=5` and balanced class weights) is loaded once into memory on startup using joblib. It predicts whether a student is at risk of academic backlog based on three key features: weekly self-study hours, attendance percentage, and class participation. To keep the project focused, lightweight, and production-clean, there is zero database dependency, no authentication barriers, and no prediction history storage."
