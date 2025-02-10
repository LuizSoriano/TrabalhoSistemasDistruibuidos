require('dotenv').config();  // Carrega as variáveis do arquivo .env
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const predictRoute = require('./routes/predict');
const uploadRoute = require('./routes/upload');
const llmRoute = require('./routes/llm');

app.use('/api/predict', predictRoute);
app.use('/api/upload', uploadRoute);

// Passe a variável de ambiente para a rota LLM
app.use('/api/llm', (req, res, next) => {
    req.ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    next();
}, llmRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
