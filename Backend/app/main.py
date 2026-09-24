"""
Smart Backlog Detection Predictor - App Module Wrapper
Re-exports `app` from `Backend/main.py` so that:
`python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`
works seamlessly alongside:
`python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload`
"""

import sys
import os

# Add parent directory to path so `import main` resolves reliably
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from main import app

__all__ = ["app"]
