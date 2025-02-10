# Dockerfile
FROM node:16-bullseye

# Instalar Python e pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Definir o diretório de trabalho para /app (contexto raiz do projeto)
WORKDIR /app

# Copiar arquivos de configuração e instalar dependências do Node.js e Python
COPY package.json requirements.txt ./
RUN npm install
RUN pip3 install --no-cache-dir -r requirements.txt

# Copiar todo o código do projeto (incluindo agents, backend, frontend, etc.)
COPY . .

# Alterar o diretório de trabalho para /app/backend
# Dessa forma, comandos relativos como "../agents/…" serão resolvidos como /app/agents/…
WORKDIR /app/backend

# Expor a porta do servidor (assumindo que seu server.js escuta na porta 3000)
EXPOSE 3000

# Comando de entrada: executa o server.js
CMD ["node", "server.js"]
