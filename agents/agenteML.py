import sys
import pandas as pd
import numpy as np
import json
from pickle import load
from sklearn.preprocessing import StandardScaler

if len(sys.argv) < 2:
    print(json.dumps({"error": "Erro: Caminho do CSV não fornecido."}))
    sys.exit(1)

csv_path = sys.argv[1]

with open("../agents/models/rf_reg_sistemas_distribuidos.pkl", "rb") as f:
    random_forest_reg = load(f)

csv = pd.read_csv(csv_path)
id_column = csv["ID"]
csv.drop(["ID", "Argila", "Silte", "Areia Total"], axis=1, inplace=True)

log_columns = ["CaO", "Cr", "Cu", "K2O", "Ni", "Sr", "V"]
for col in log_columns:
    csv[col] = np.log1p(csv[col])

scaler = StandardScaler()
X_ts_scaled = scaler.fit_transform(csv)

labels = ["Argila", "Silte", "Areia Total"]
predictions = random_forest_reg.predict(X_ts_scaled)

results = []
for id, preds in zip(id_column.tolist(), predictions):
    results.append({label: round(float(prediction), 2) for label, prediction in zip(labels, list(preds))})

print(json.dumps(results))