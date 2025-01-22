from transformers import AutoModelForCausalLM, AutoTokenizer
from celery import Celery
import pandas as pd

app = Celery('agente1', broker='pyamqp://guest@localhost//')

# Carregar modelo LLama
model_name = "Qwen/Qwen1.5-0.5B-Chat"  # Troque pelo modelo desejado
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.task
def preprocessar_dados(dados_raw):
    # # Converter dados para DataFrame
    # df = pd.DataFrame(dados_raw)
    df = dados_raw
    
    # Criação do prompt
    prompt = (
        "Você é um assistente que ajuda a limpar e normalizar dados de amostras químicas. "
        "Aqui estão os dados brutos: "
        f"{df.to_dict()}. "
        "Identifique e corrija valores ausentes e normalize os dados."
    )
    
    inputs = tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True)
    outputs = model.generate(**inputs, max_length=2048)
    
    # Processar resposta do modelo
    resposta = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("Resposta do modelo:", resposta)
    
    return df.to_dict()

data_raw = pd.read_csv('TrabalhoComputacao - Planilha1.csv')

preprocessar_dados(data_raw)
