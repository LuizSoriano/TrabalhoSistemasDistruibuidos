from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
import sys

def get_llm_response(prompt):
    # Define o template para o prompt
    chat_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "Você é um assistente que ajuda o usuário com perguntas. Por favor, forneça respostas suscintas e corretas de acordo com a vontade do usuário."),
            ("user", "Question: {question}")
        ]
    )

    # Carrega o modelo Ollama (certifique-se de que o modelo esteja disponível)
    llm = OllamaLLM(model="llama3.2:1b")
    chain = chat_prompt | llm

    # Executa o modelo e retorna a resposta
    return chain.invoke({"question": prompt})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No prompt provided")
        sys.exit(1)

    prompt = sys.argv[1]  # Recebe o prompt a partir dos argumentos de linha de comando
    response = get_llm_response(prompt)
    
    # Exibe a resposta do modelo
    print(response)
