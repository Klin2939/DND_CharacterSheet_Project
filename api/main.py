# python3 -m flask --app main --debug run
# python3 -m pip install flask-cors
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
    with open(filename, "w") as file:
        file.write(str(content))
    response = {
        "message": "Stats saved successfully!"
    }
    return response











if (__name__) == '__main__':
    app.run(debug = True)