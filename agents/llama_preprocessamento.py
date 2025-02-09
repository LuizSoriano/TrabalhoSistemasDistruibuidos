from langchain_ollama import OllamaLLM
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
import sys

llm = OllamaLLM(model="llama3.2:1b")

def get_llm_response(prompt, csv_path):
    data = pd.read_csv(csv_path) 
    agent = create_pandas_dataframe_agent(llm, data, verbose=True, allow_dangerous_code=True)
    response = agent.run(prompt)
    return response

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Erro: O prompt e o caminho do arquivo são obrigatórios")
        sys.exit(1)

    prompt = sys.argv[1]
    csv_path = sys.argv[2]
    
    response = get_llm_response(prompt, csv_path)
    print(response)