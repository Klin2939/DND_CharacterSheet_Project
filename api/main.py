# python3 -m flask --app main --debug run
# python3 -m pip install flask-cors
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    response = {
        "message": "Hello DND!"
    }
    return response

if (__name__) == '__main__':
    app.run(debug = True)