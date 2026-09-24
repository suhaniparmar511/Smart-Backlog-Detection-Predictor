"""
Verification script for Smart Backlog Detection Predictor Backend.
Tests:
- GET /api/health
- POST /api/predict (Backlog Risk)
- POST /api/predict (Safe / No Backlog)
- POST /api/predict (Input validation)
- GET /api/dataset-info
- GET /api/model-evaluation
- GET /api/dashboard
"""

import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

def run_tests():
    print("==================================================")
    print("TESTING SIMPLIFIED ML PREDICTION BACKEND")
    print("==================================================")

    with TestClient(app) as client:
        # 1. Health Endpoint
        print("\n[TEST 1] GET /api/health")
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        data = res.json()
        print("Response:", data)
        assert data["status"] == "ok"
        assert data["model_loaded"] is True
        print(">>> PASS: Health check OK, ML model loaded.")

        # 2. Backlog Prediction (Row 544 from CSV: study=0.0, att=75.7, part=6.8 -> Grade F)
        print("\n[TEST 2] POST /api/predict (Backlog Case)")
        payload_backlog = {
            "weekly_self_study_hours": 0.0,
            "attendance_percentage": 75.7,
            "class_participation": 6.8
        }
        res = client.post("/api/predict", json=payload_backlog)
        assert res.status_code == 200, f"Predict failed: {res.text}"
        res_backlog = res.json()
        print("Backlog response:", res_backlog)
        assert res_backlog["prediction"] == 1
        assert res_backlog["result"] == "Backlog"
        assert res_backlog["backlog"] is True
        assert res_backlog["probability"] > 0.5
        print(">>> PASS: Backlog student correctly identified as 1 (Backlog).")

        # 3. Safe Prediction (Row 0 from CSV: study=18.5, att=95.6, part=3.8 -> Grade A)
        print("\n[TEST 3] POST /api/predict (Safe Case)")
        payload_safe = {
            "weekly_self_study_hours": 18.5,
            "attendance_percentage": 95.6,
            "class_participation": 3.8
        }
        res = client.post("/api/predict", json=payload_safe)
        assert res.status_code == 200, f"Predict failed: {res.text}"
        res_safe = res.json()
        print("Safe response:", res_safe)
        assert res_safe["prediction"] == 0
        assert res_safe["result"] == "No Backlog"
        assert res_safe["backlog"] is False
        assert res_safe["probability"] < 0.5
        print(">>> PASS: Safe student correctly identified as 0 (No Backlog).")

        # 4. Validation Check (invalid attendance > 100)
        print("\n[TEST 4] Input Validation (attendance > 100)")
        res_invalid = client.post("/api/predict", json={
            "weekly_self_study_hours": 10,
            "attendance_percentage": 150,
            "class_participation": 5
        })
        assert res_invalid.status_code == 422, f"Expected 422 for invalid attendance: {res_invalid.text}"
        print("Validation error response:", res_invalid.json()["detail"][0]["msg"])
        print(">>> PASS: FastAPI validation correctly rejected invalid attendance.")

        # 5. Dataset Info Endpoint
        print("\n[TEST 5] GET /api/dataset-info")
        res_dataset = client.get("/api/dataset-info")
        assert res_dataset.status_code == 200
        dataset_meta = res_dataset.json()
        print(f"Total students in dataset: {dataset_meta['total_students']}")
        print(f"Backlog percentage: {dataset_meta['backlog_percentage']}%")
        assert dataset_meta["total_students"] == 1000000
        print(">>> PASS: Dataset metadata returned correctly.")

        # 6. Model Evaluation Endpoint
        print("\n[TEST 6] GET /api/model-evaluation")
        res_eval = client.get("/api/model-evaluation")
        assert res_eval.status_code == 200
        eval_meta = res_eval.json()
        print(f"Model testing accuracy: {eval_meta['testing_accuracy']}%")
        print(f"Recall for backlog: {eval_meta['recall']}")
        assert eval_meta["testing_accuracy"] > 85.0
        print(">>> PASS: Model evaluation metrics returned correctly.")

        # 7. Dashboard Endpoint
        print("\n[TEST 7] GET /api/dashboard")
        res_dash = client.get("/api/dashboard")
        assert res_dash.status_code == 200
        dash_data = res_dash.json()
        print("Dashboard summary:", dash_data)
        assert dash_data["total_students"] == 1000000
        print(">>> PASS: Dashboard endpoint works with zero database.")

    print("\n==================================================")
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
