const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const csvPath = req.file.path;
    console.log(`CSV salvo para LLM: ${csvPath}`);

    res.json({ message: 'Arquivo recebido. Agora você pode perguntar ao LLM.', csvPath });
});

module.exports = router;