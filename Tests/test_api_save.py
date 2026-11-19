"""Backend tests for api/main.py: GET / and POST /save (Sprint 1, S1-T9).

Every test that can reach /save points main.STATS_FILE at a temp file, and an autouse
fixture checks that the real api/stats.json has the same sha256 after each test.
"""
import hashlib
import json
from pathlib import Path

import pytest

import main

REAL_STATS = Path(main.__file__).resolve().parent / "stats.json"


def _sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


@pytest.fixture(autouse=True)
def real_stats_untouched():
    """Fail if a test changes (or creates) the real api/stats.json."""
    existed = REAL_STATS.exists()
    before = _sha256(REAL_STATS) if existed else None
    yield
    if existed:
        assert REAL_STATS.exists(), "real api/stats.json was deleted"
        assert _sha256(REAL_STATS) == before, "real api/stats.json was modified"
    else:
        assert not REAL_STATS.exists(), "real api/stats.json was created"


@pytest.fixture
def stats_file(tmp_path, monkeypatch):
    path = tmp_path / "stats.json"
    monkeypatch.setattr(main, "STATS_FILE", path)
    return path


@pytest.fixture
def client(stats_file):
    main.app.config["TESTING"] = True
    return main.app.test_client()


def _char(name, **extra):
    data = {"CACName": name, "CACClass": "Fighter", "Level": "1", "Str": "16"}
    data.update(extra)
    return data


def _saved(path):
    return json.loads(path.read_text())


# --- GET / -----------------------------------------------------------------

def test_root_returns_hello_message(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.get_json() == {"message": "Hello DND!"}


# --- happy path ------------------------------------------------------------

def test_first_save_creates_file_and_returns_success(client, stats_file):
    assert not stats_file.exists()
    res = client.post("/save", json=_char("Thorin"))
    assert res.status_code == 200
    assert res.get_json() == {"message": "Stats saved successfully!"}
    assert _saved(stats_file) == [_char("Thorin")]


def test_save_same_name_replaces_entry(client, stats_file):
    client.post("/save", json=_char("Thorin", Level="1"))
    res = client.post("/save", json=_char("Thorin", Level="5"))
    assert res.status_code == 200
    saved = _saved(stats_file)
    assert len(saved) == 1
    assert saved[0]["Level"] == "5"


def test_save_replace_drops_fields_missing_from_new_payload(client, stats_file):
    client.post("/save", json=_char("Thorin", Extra="old"))
    client.post("/save", json={"CACName": "Thorin"})
    assert _saved(stats_file) == [{"CACName": "Thorin"}]


def test_save_different_name_appends(client, stats_file):
    client.post("/save", json=_char("Thorin"))
    client.post("/save", json=_char("Gimli"))
    assert [c["CACName"] for c in _saved(stats_file)] == ["Thorin", "Gimli"]


def test_save_replace_preserves_order(client, stats_file):
    for name in ("A", "B", "C"):
        client.post("/save", json=_char(name))
    client.post("/save", json=_char("B", Level="9"))
    saved = _saved(stats_file)
    assert [c["CACName"] for c in saved] == ["A", "B", "C"]
    assert saved[1]["Level"] == "9"


def test_save_name_match_is_exact(client, stats_file):
    client.post("/save", json=_char("Thorin"))
    client.post("/save", json=_char("thorin"))
    assert [c["CACName"] for c in _saved(stats_file)] == ["Thorin", "thorin"]


def test_save_loads_existing_file(client, stats_file):
    stats_file.write_text(json.dumps([_char("Existing")]))
    client.post("/save", json=_char("New"))
    assert [c["CACName"] for c in _saved(stats_file)] == ["Existing", "New"]


# --- bad stats.json contents ------------------------------------------------

def test_save_corrupt_file_is_reset(client, stats_file):
    stats_file.write_text("{not valid json")
    res = client.post("/save", json=_char("Thorin"))
    assert res.status_code == 200
    assert _saved(stats_file) == [_char("Thorin")]


def test_save_empty_file_is_reset(client, stats_file):
    stats_file.write_text("")
    res = client.post("/save", json=_char("Thorin"))
    assert res.status_code == 200
    assert _saved(stats_file) == [_char("Thorin")]


@pytest.mark.parametrize("content", ["{}", '"x"', "42", "null"])
def test_save_non_list_json_file_is_treated_as_empty(client, stats_file, content):
    stats_file.write_text(content)
    res = client.post("/save", json=_char("Thorin"))
    assert res.status_code == 200
    assert _saved(stats_file) == [_char("Thorin")]


# --- 400 cases --------------------------------------------------------------

BAD_REQUESTS = {
    "no_body": dict(),
    "text_body": dict(data="hello", content_type="text/plain"),
    "json_text_wrong_content_type": dict(data='{"CACName": "Thorin"}', content_type="text/plain"),
    "malformed_json": dict(data='{"CACName": ', content_type="application/json"),
    "null": dict(data="null", content_type="application/json"),
    "list": dict(json=[_char("Thorin")]),
    "number": dict(json=5),
    "missing_name": dict(json={"CACClass": "Fighter"}),
    "empty_name": dict(json=_char("")),
    "whitespace_name": dict(json=_char("   ")),
    "int_name": dict(json=_char(5)),
    "null_name": dict(json=_char(None)),
}


@pytest.mark.parametrize("kwargs", BAD_REQUESTS.values(), ids=BAD_REQUESTS.keys())
def test_save_bad_request_returns_400_json_error(client, kwargs):
    res = client.post("/save", **kwargs)
    assert res.status_code == 400
    body = res.get_json()
    assert isinstance(body, dict)
    assert isinstance(body.get("error"), str) and body["error"]


@pytest.mark.parametrize("kwargs", BAD_REQUESTS.values(), ids=BAD_REQUESTS.keys())
def test_save_bad_request_does_not_create_file(client, stats_file, kwargs):
    client.post("/save", **kwargs)
    assert not stats_file.exists()


@pytest.mark.parametrize("kwargs", BAD_REQUESTS.values(), ids=BAD_REQUESTS.keys())
def test_save_bad_request_does_not_change_existing_file(client, stats_file, kwargs):
    original = json.dumps([_char("Existing")], indent=2)
    stats_file.write_text(original)
    client.post("/save", **kwargs)
    assert stats_file.read_text() == original
