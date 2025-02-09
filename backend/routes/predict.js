const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const csvPath = req.file.path;
    console.log(`Enviando CSV para predição: ${csvPath}`);

    const pythonProcess = spawn('python3', ['../agents/agenteML.py', csvPath]);

    let pythonOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro no ML: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const predictions = JSON.parse(pythonOutput.trim());
                res.json({ prediction: predictions });

            } catch (error) {
                res.status(500).json({ error: "Erro ao processar a resposta do modelo." });
            }
        } else {
            res.status(500).json({ error: 'Erro ao processar a predição' });
        }
    });
});

module.exports = router;