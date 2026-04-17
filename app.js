const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const productosRoutes = require('./routes/productos');
const { createTables } = require('./config/dbInit');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', productosRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  await createTables(); 
});