const pool = require('./db');

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id             SERIAL PRIMARY KEY,
        nombre         VARCHAR(150)   NOT NULL,
        descripcion    TEXT,
        categoria      VARCHAR(80),
        precio         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
        stock          INT            NOT NULL DEFAULT 0,
        imagen_url     VARCHAR(500),
        creado_en      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_categoria ON productos(categoria);
      CREATE INDEX IF NOT EXISTS idx_stock ON productos(stock);
      
      -- Función y trigger para actualizado_en
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.actualizado_en = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
      CREATE TRIGGER update_productos_updated_at
          BEFORE UPDATE ON productos
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('Tablas inicializadas correctamente');
  } catch (err) {
    console.error('Error al inicializar tablas:', err);
  } finally {
    client.release();
  }
};

module.exports = { createTables };