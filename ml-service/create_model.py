import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# Load dataset
df = pd.read_csv("food_expiry_data.csv")

# Encode categorical column
le = LabelEncoder()
df['foodType'] = le.fit_transform(df['foodType'])
df['expiry'] = le.fit_transform(df['expiry'])  # Save label mapping if needed

# Features and labels
X = df.drop("expiry", axis=1)
y = df["expiry"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model
os.makedirs("model", exist_ok=True)
with open("model/expiry_model.pkl", "wb") as f:
    pickle.dump(model, f)
