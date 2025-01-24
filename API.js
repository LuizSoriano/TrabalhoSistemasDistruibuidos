const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = 5500;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Endpoint para processar o prompt
app.post('http://127.0.0.1:5500/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }

  try {
    // Executa o script Python
    const pythonProcess = spawn('python3', ['seu_script.py', prompt]);

    let response = '';
    pythonProcess.stdout.on('data', (data) => {
      response += data.toString();
    });

    pythonProcess.stderr.on('data', (error) => {
      console.error(`Erro no script Python: ${error}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json({ response: response.trim() });
      } else {
        res.status(500).json({ error: 'Erro ao executar o script Python.' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/index.html`);
});
