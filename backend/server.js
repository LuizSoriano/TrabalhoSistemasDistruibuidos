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
app.use('/api/llm', llmRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});