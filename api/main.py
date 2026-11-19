# python3 -m flask --app main --debug run
# python3 -m pip install flask-cors
import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# Absolute path to api/stats.json, based on where this file lives rather than the
# directory Flask was started from. Handlers read this global at request time, so
# tests can swap it out with monkeypatch.setattr(main, "STATS_FILE", tmp_path / "stats.json").
STATS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stats.json")

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    response = {
        "message": "Hello DND!"
    }
    return response

@app.route("/save", methods=["POST"])
def SaveStats():
    # silent=True returns None instead of raising Flask's own HTML 400/415 when the
    # body is missing, isn't JSON, or has the wrong Content-Type. That lets us send
    # back our own JSON error below.
    content = request.get_json(silent=True)

    # A JSON body of null, a list, a number, etc. isn't a character
    if not isinstance(content, dict):
        return jsonify({"error": "Request body must be a JSON object describing a character."}), 400

    # CACName is the key we upsert by, so it must be a non-blank string.
    # Whitespace-only names count as empty (they'd be invisible in any character list).
    name = content.get("CACName")
    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "CACName is required and must be a non-empty string."}), 400

    print(f'content: {content}')

    # Load whatever's already saved; start fresh if the file is missing or unparseable
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE, "r") as file:
            try:
                characters = json.load(file)
            except json.JSONDecodeError:
                characters = []
    else:
        characters = []
    # Valid JSON that isn't a list (e.g. {} or "x") is just as unusable as a corrupt file
    if not isinstance(characters, list):
        characters = []

    # Upsert: overwrite the entry with a matching CACName, or append as new
    updated = False
    for i, character in enumerate(characters):
        if character.get("CACName") == name:
            characters[i] = content
            updated = True
            break
    if not updated:
        characters.append(content)

    with open(STATS_FILE, "w") as file:
        json.dump(characters, file, indent=2)

    response = {
        "message": "Stats saved successfully!"
    }
    return response


if (__name__) == '__main__':
    app.run(debug = True)
