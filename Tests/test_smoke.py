"""Smoke test: the Flask app imports and answers GET / (no file I/O involved)."""
from main import app


def test_get_root_returns_hello_message():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json() == {"message": "Hello DND!"}
