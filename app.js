const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./config/db');    
const initDb = require('./config/initDb');    

const app = express();
const productosRoutes = require('./routes/productos');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', productosRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;

// Inicializar la base de datos y luego levantar el servidor
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo iniciar el servidor por error en BD:', err);
    process.exit(1);
  });