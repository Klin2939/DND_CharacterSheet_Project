# python3 -m flask --app main --debug run
# python3 -m pip install flask-cors
import json
import os
from flask import Flask, request
from flask_cors import CORS

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
    content = request.json
    print(f'content: {content}')

    filename = "stats.json"

    # Load whatever's already saved; start fresh if the file is missing or unparseable
    if os.path.exists(filename):
        with open(filename, "r") as file:
            try:
                characters = json.load(file)
            except json.JSONDecodeError:
                characters = []
    else:
        characters = []

    # Upsert: overwrite the entry with a matching CACName, or append as new
    updated = False
    for i, character in enumerate(characters):
        if character.get("CACName") == content.get("CACName"):
            characters[i] = content
            updated = True
            break
    if not updated:
        characters.append(content)

    with open(filename, "w") as file:
        json.dump(characters, file, indent=2)

    response = {
        "message": "Stats saved successfully!"
    }
    return response











if (__name__) == '__main__':
    app.run(debug = True)