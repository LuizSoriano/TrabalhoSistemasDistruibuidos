const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

router.post('/', (req, res) => {
    const { prompt, file } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt é obrigatório' });
    if (!file) return res.status(400).json({ error: 'Nenhum arquivo CSV foi enviado para o LLM.' });

    console.log(`Enviando prompt ao LLM: "${prompt}" com CSV: ${file}`);

    const pythonScript = path.join(__dirname, '../agents/llama_preprocessamento.py');

    const pythonProcess = spawn('python3', [pythonScript, prompt, file]);

    let pythonOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro no LLM: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ response: pythonOutput.trim() });
        } else {
            res.status(500).json({ error: 'Erro ao processar a resposta do LLM' });
        }
    });
});

module.exports = router;
