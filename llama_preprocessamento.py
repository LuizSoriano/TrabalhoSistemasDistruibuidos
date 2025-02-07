from langchain_ollama import OllamaLLM
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
from langchain_experimental.tools import PythonREPLTool
import sys

def get_llm_response(prompt):
    # Define o template para o prompt
    # chat_prompt = ChatPromptTemplate.from_messages(
    #     [
    #         ("system", "Você é um assistente que ajuda o usuário com perguntas. Por favor, forneça respostas suscintas e corretas de acordo com a vontade do usuário."),
    #         ("user", "Question: {question}")
    #     ]
    # )

    # Carrega o modelo Ollama (certifique-se de que o modelo esteja disponível)
    # ollama pull llama3.2:3b-instruct-q4_K_S 
    # É preciso usar o llama3.2:3b -> para funcionar direito.
    llm = OllamaLLM(model="llama3.2:1b")
    data = pd.read_csv("CSVs/TrabalhoComputacao.csv")
    agent = create_pandas_dataframe_agent(llm, data, verbose=True, tools=[PythonREPLTool()], allow_dangerous_code=True, agent_executor_kwargs={"handle_parsing_errors": True})

    response = agent.run(prompt)
    
    # Executa o modelo e retorna a resposta
    return response

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No prompt provided")
        sys.exit(1)

    prompt = sys.argv[1]  # Recebe o prompt a partir dos argumentos de linha de comando
    response = get_llm_response(prompt)
