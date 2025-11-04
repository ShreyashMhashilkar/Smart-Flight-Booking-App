import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load dataset
df = pd.read_csv("flight_price.csv")

# Drop unnecessary or identifier columns
if 'flight' in df.columns:
    df.drop(columns=['flight'], inplace=True)

# Handle rare categories to reduce one-hot explosion
categorical_cols = ['airline', 'source_city', 'destination_city', 'stops', 'class', 'departure_time', 'arrival_time']

for col in categorical_cols:
    top_categories = df[col].value_counts().nlargest(10).index  # keep only top 10
    df[col] = df[col].apply(lambda x: x if x in top_categories else 'Other')

# One-hot encode categorical columns
df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

# Features and target
X = df_encoded.drop('price', axis=1)
y = df_encoded['price']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = RandomForestRegressor(
    n_estimators=50,     
    max_depth=12,        
    n_jobs=-1,          
    random_state=42
)
model.fit(X_train, y_train)

# Ensure folder exists
os.makedirs("flights/ml", exist_ok=True)

# Save model and encoded columns (with compression)
joblib.dump(model, "flights/ml/model.pkl", compress=3)
joblib.dump(list(X.columns), "flights/ml/encoded_columns.pkl", compress=3)

# Display final model size
model_size = os.path.getsize("flights/ml/model.pkl") / (1024 * 1024)
print(f"Model and columns saved successfully \nModel size: {model_size:.2f} MB")
