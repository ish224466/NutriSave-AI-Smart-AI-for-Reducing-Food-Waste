import pandas as pd
import pickle
import os

MODEL_PATH = os.path.join("model", "expiry_model.pkl")

def load_model():
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

def predict_expiry(foodType, cookingTime, storageTemp, humidity):
    # Manual encoding — must match the training phase
    food_type_map = {'Milk': 0, 'Rice': 1, 'Chicken': 2, 'Bread': 3, 'Vegetables': 4}
    model = load_model()

    features = [[
        food_type_map.get(foodType, -1),
        cookingTime,
        storageTemp,
        humidity
    ]]
    
    prediction = model.predict(features)
    
    # Decode output
    expiry_map = {0: '2 days', 1: '4 days', 2: '7 days'}
    return expiry_map.get(prediction[0], 'Unknown')
