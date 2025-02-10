const chatContainer = document.querySelector("#chat-container");
const inputBox = document.querySelector("#input-box");
const sendButton = document.querySelector("#send-button");
const fileInput = document.querySelector("#insert-button");
const agentSelector = document.querySelector("#agent-selector");
const title = document.querySelector("h1");

let primeiraMensagem = true;
let llmFileUploaded = false;
let currentCSV = null;

// ================================================
//             FUNÇÕES DE INTERFACE
// ================================================

// Adiciona mensagens ao chat
function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    const messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.innerHTML = message;
    messageDiv.appendChild(messageText);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Atualiza a interface ao trocar de agente
function updateUI() {
    if (agentSelector.value === "predict") {
        inputBox.disabled = true;
        inputBox.placeholder = "Selecione um arquivo CSV...";
    } else {
        inputBox.disabled = false;
        inputBox.placeholder = "Envie uma mensagem...";
    }
}

// ================================================
//                     EVENTOS
// ================================================

// Recupera a seleção do agente ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const savedAgent = localStorage.getItem("selectedAgent");
    if (savedAgent) {
        agentSelector.value = savedAgent;
    }
    updateUI();
});

// Atualiza a interface ao trocar de agente
agentSelector.addEventListener("change", () => {
    localStorage.setItem("selectedAgent", agentSelector.value);
    location.reload();
});

// Envio de mensagem ou arquivo ao clicar no botão
sendButton.addEventListener("click", async (e) => {
    e.preventDefault();

    if (primeiraMensagem) {
        primeiraMensagem = false;
        title.innerText = "";
    }

    if (agentSelector.value === "llm") {
        if (!llmFileUploaded) {
            return alert("Por favor, selecione um arquivo CSV antes de perguntar ao LLM.");
        }
        await sendPromptToLLM();
    } else {
        await sendCSVToServer();
    }
});

// Permite envio de mensagens com "Enter"
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && agentSelector.value === "llm") {
        sendButton.click();
    }
});

// Enviar arquivo imediatamente após seleção
fileInput.addEventListener("change", async (e) => {
    e.preventDefault();
    await sendCSVToServer();
});

document.querySelector("#input-container").addEventListener("submit", (e) => {
    e.preventDefault();
});

// ================================================
//            COMUNICAÇÃO COM O BACKEND
// ================================================

// Envia um prompt para o LLM
async function sendPromptToLLM() {
    const prompt = inputBox.value.trim();
    if (!prompt) return alert("Por favor, digite uma mensagem.");

    appendMessage(prompt, "user");
    inputBox.value = "";

    try {
        const response = await fetch("/api/llm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, csvPath: currentCSV }),
        });

        if (!response.ok) throw new Error("Erro ao enviar o prompt.");

        const data = await response.json();
        appendMessage(data.response || "❌ Resposta vazia do servidor.", "bot");
    } catch (error) {
        appendMessage("❌ Erro ao se conectar ao servidor.", "bot");
    }
}

// Envia um arquivo CSV para o backend (ML ou LLM)
async function sendCSVToServer() {
    if (!fileInput.files.length) return alert("Por favor, selecione um arquivo CSV.");

    const file = fileInput.files[0];
    appendMessage(`📤 Enviando arquivo: ${file.name}...`, "user");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const endpoint = agentSelector.value === "predict" ? "/api/predict" : "/api/upload";

        const response = await fetch(endpoint, { method: "POST", body: formData });

        if (!response.ok) throw new Error("Erro ao enviar o arquivo.");

        const data = await response.json();

        if (agentSelector.value === "predict") {
            let cont = 0
            if (data.prediction) {
                data.prediction.forEach((pred) => {
                    cont++
                    const predictionMessage = `✅ Predição ${cont}:
                    Argila: ${pred.Argila}%
                    Silte: ${pred.Silte}%
                    Areia Total: ${pred["Areia Total"]}%`;
                    appendMessage(`<pre>${predictionMessage}</pre>`, "bot");
                });
                
            } else {
                appendMessage("❌ Erro na predição.", "bot");
            }
        } else {
            llmFileUploaded = true;
            currentCSV = data.csvPath;
        }
    } catch (error) {
        appendMessage("❌ Erro ao se conectar ao servidor.", "bot");
    }
}