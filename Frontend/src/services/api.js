import axios from 'axios';

// Backend URL from environment variable or default to http://127.0.0.1:8000
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Health Check API
 * Checks whether FastAPI backend and ML model are ready.
 */
export const getHealth = async () => {
  const response = await apiClient.get('/api/health');
  return response.data;
};

/**
 * Backlog Risk Prediction API
 * Submits student metrics (weekly study hours, attendance, participation)
 * to the trained Decision Tree model.
 */
export const predictBacklog = async (data) => {
  const response = await apiClient.post('/api/predict', data);
  return response.data;
};

/**
 * Dashboard Summary API
 * Returns academic overview statistics from the student dataset.
 */
export const getDashboard = async () => {
  const response = await apiClient.get('/api/dashboard');
  return response.data;
};

/**
 * Dataset Information API
 * Returns CSV dataset statistics and grade distributions.
 */
export const getDatasetInfo = async () => {
  const response = await apiClient.get('/api/dataset-info');
  return response.data;
};

/**
 * Model Evaluation Metrics API
 * Returns testing accuracy, confusion matrix, precision, recall, and F1.
 */
export const getModelEvaluation = async () => {
  const response = await apiClient.get('/api/model-evaluation');
  return response.data;
};

/**
 * Retrain Model API
 */
export const trainModel = async () => {
  const response = await apiClient.post('/api/train');
  return response.data;
};

export default apiClient;
