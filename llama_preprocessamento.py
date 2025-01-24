from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import OllamaLLM
import os
import pandas as pd

def get_llm_response(prompt):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "Você é um assistente que ajuda com arquivos csv. Por favor, forneça respostas suscintas e corretas de acordo com a vontade usuário."),
            ("user", "Question: {question}")
        ]
    )

    # Ollama LLama2
    llm = OllamaLLM(model="llama3.2:1b")
    chain = prompt | llm

    print(chain.invoke({"question": f"{prompt}"}))