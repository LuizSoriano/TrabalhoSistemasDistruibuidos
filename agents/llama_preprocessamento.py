from langchain_ollama import OllamaLLM
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
import sys

llm = OllamaLLM(model="llama3.2:1b")

def get_llm_response(prompt):
    data = pd.read_csv("CSVs/TrabalhoComputacao.csv")
    agent = create_pandas_dataframe_agent(llm, data, verbose=True)

    response = agent.run(prompt)
    return response

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No prompt provided")
        sys.exit(1)

    prompt = sys.argv[1]
    response = get_llm_response(prompt)
    print(response)