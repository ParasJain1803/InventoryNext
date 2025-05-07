from flask import Flask, request, jsonify
import joblib
import pandas as pd
from model_utils import preprocess_input
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


app = Flask(__name__)
model = joblib.load("demand_model.pkl")

@app.route("/predict-demand", methods=["POST"])
def predict_demand():
    data = request.json
    df = pd.DataFrame([data])
    df = preprocess_input(df)
    prediction = model.predict(df)[0]
    return jsonify({"predicted_demand": int(prediction)})

if __name__ == "__main__":
    app.run(debug=True)
