from pickle import load
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

with open("models/rf_reg_sistemas_distribuidos.pkl", "rb") as f:
    random_forest_reg = load(f)

csv = pd.read_csv("CSVs/TrabalhoComputacao.csv")
csv.drop(["ID", "Argila" ,"Silte", "Areia Total"], axis=1, inplace=True)

log_columns = [
    "CaO",
    "Cr",
    "Cu",
    "K2O",
    "Ni",
    "Sr",
    "V"
]

for col in log_columns:
    csv[col] = np.log1p(csv[col])

scaler = StandardScaler()
X_ts_scaled = scaler.fit_transform(csv)

labels = [
    "Argila",
    "Silte",
    "Areia Total"
]

predictions = random_forest_reg.predict(X_ts_scaled[:1])

for label, prediction in zip(labels, predictions[0]):
    print(f"{label} = {prediction}")