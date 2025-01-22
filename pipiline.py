import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# 1. Carregar os dados
data = pd.read_excel("TrabalhoComputacao.xlsx", header = 1)  # Substituir pelo caminho do arquivo

print(data.columns)

# 2. Dividir variáveis preditoras (X) e alvo (y)
X = data.drop(columns=["ID", "Argila", "Areia Total", "Silte"])  # Exclua as colunas-alvo
y = data[["Argila", "Areia Total", "Silte"]]

# 3. Dividir em treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Treinar o modelo
rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# 5. Fazer predições
y_pred = rf.predict(X_test)

# 6. Avaliar o modelo
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print(f"RMSE: {rmse:.2f}")
print(f"MAE: {mse:.2f}")
print(f"R²: {r2:.2f}")

# 7. Importância das variáveis
importances = rf.feature_importances_
feature_names = X.columns
importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
importance_df = importance_df.sort_values(by='Importance', ascending=False)

print("\nImportância das variáveis:")
print(importance_df)
