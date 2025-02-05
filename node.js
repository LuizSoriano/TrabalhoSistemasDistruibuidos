const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Rota para receber o prompt
app.post('/api/prompt', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Chama o script Python
  const pythonProcess = spawn('python3', ['llama_preprocessamento.py', prompt]);

  let pythonOutput = '';

  // Coleta a saída do script Python
  pythonProcess.stdout.on('data', (data) => {
    pythonOutput += data.toString();
  });

  // Captura erros do script Python
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  // Envia a resposta quando o script terminar
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ response: pythonOutput.trim() });
    } else {
      res.status(500).json({ error: 'Failed to execute Python script' });
    }
  });
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
