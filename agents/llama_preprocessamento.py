import os
from langchain_ollama import OllamaLLM
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
import sys

def get_llm_response(prompt, csv_path, ollama_host):
    llm = OllamaLLM(model="llama3.2:3b", base_url=ollama_host)  # Use o host correto
    data = pd.read_csv(csv_path)
    agent = create_pandas_dataframe_agent(
        llm,
        data,
        verbose=False,
        allow_dangerous_code=True,
        agent_executor_kwargs={"handle_parsing_errors": True}
    )
    response = agent.invoke({"input": prompt})
    return response["output"]

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Erro: O prompt e o caminho do arquivo são obrigatórios")
        sys.exit(1)

    prompt = sys.argv[1]
    csv_path = sys.argv[2]
    ollama_host = os.getenv("OLLAMA_URL", "http://localhost:11434")  # Garantir que usa a variável de ambiente correta
    
    response = get_llm_response(prompt, csv_path, ollama_host)
    print(response)
