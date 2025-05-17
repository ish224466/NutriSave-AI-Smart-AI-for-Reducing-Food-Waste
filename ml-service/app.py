from flask import Flask, request, jsonify
from flask_cors import CORS
from expiry_model import predict_expiry

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    required_fields = ['foodType', 'cookingTime', 'storageTemp', 'humidity']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields'}), 400

    result = predict_expiry(
        data['foodType'],
        data['cookingTime'],
        data['storageTemp'],
        data['humidity']
    )
    return jsonify({'expiry': result})

if __name__ == "__main__":
    app.run(port=5002)
