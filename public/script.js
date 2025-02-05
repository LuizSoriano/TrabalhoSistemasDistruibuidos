const chatContainer = document.querySelector("#chat-container");
const inputBox = document.querySelector("#input-box");
const sendButton = document.querySelector("#send-button");
const title = document.querySelector("h1");

let primeiraMensagem = true;

function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    const messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.textContent = message;
    messageDiv.appendChild(messageText);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener("click", async (e) => {
    e.preventDefault();

    if(primeiraMensagem) {
        primeiraMensagem = false;
        title.innerText = "";
    }

    const prompt = inputBox.value.trim();

    if (!prompt) {
        alert("Por favor, digite um prompt.");
        return;
    }

    // Adiciona a mensagem do usuário no chat
    appendMessage(prompt, "user");
    inputBox.value = "";

    try {
        const response = await fetch("/api/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar o prompt.");
        }

        const data = await response.json();
        appendMessage(data.response || "Resposta vazia do servidor.", "bot");
    } catch (error) {
        console.error(error);
        appendMessage("Erro ao se conectar ao servidor.", "bot");
    }
});

// Permitir envio com a tecla Enter
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendButton.click();
    }
});
