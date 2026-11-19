"""Shared pytest setup: make `api/` importable so tests can do `from main import app`."""
import os
import sys

API_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "api"))
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)
