const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

router.post('/', (req, res) => {
    const { prompt, csvPath } = req.body;
    const ollamaHost = req.ollamaHost;  // Recebe a URL do Ollama do server.js

    if (!prompt) return res.status(400).json({ error: 'Prompt é obrigatório' });
    if (!csvPath) return res.status(400).json({ error: 'Nenhum arquivo CSV foi enviado para o LLM.' });

    console.log(`Enviando prompt ao LLM: "${prompt}" com CSV: ${csvPath}`);
    console.log(`Ollama host: ${ollamaHost}`);

    const pythonProcess = spawn('python3', ['../agents/llama_preprocessamento.py', prompt, csvPath, ollamaHost]);

    let pythonOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro no LLM: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            const response = pythonOutput.trim();
            res.json({ response });
        } else {
            res.status(500).json({ error: 'Erro ao processar a resposta do LLM' });
        }
    });
});

module.exports = router;
