import pandas as pd
import sys
from langchain_ollama import OllamaLLM
from langchain_experimental.agents import create_pandas_dataframe_agent

def get_llm_response(prompt, csv_path):
    llm = OllamaLLM(model="gemma:2b")
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
    
    response = get_llm_response(prompt, csv_path)
    print(response)