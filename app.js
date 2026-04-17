const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const productosRoutes = require('./routes/productos');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir frontend (mover index.html a public/)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', productosRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));