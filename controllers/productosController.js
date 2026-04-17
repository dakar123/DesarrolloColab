const pool = require('../config/db');

exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, categoria, precio, stock, imagen_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, categoria, precio, stock, imagen_url]
    );
    res.status(201).json({ ok: true, message: 'Producto creado', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al crear producto' });
  }
};

exports.listarProductos = async (req, res) => {
  const { search, categoria } = req.query;
  let query = 'SELECT * FROM productos';
  const values = [];
  if (search) {
    query += ` WHERE nombre ILIKE $1 OR descripcion ILIKE $1`;
    values.push(`%${search}%`);
  }
  if (categoria) {
    query += search ? ' AND categoria = $2' : ' WHERE categoria = $1';
    values.push(categoria);
  }
  try {
    const result = await pool.query(query, values);
    res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al listar productos' });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al obtener producto' });
  }
};

exports.actualizarProducto = async (req, res) => {
  const { nombre, descripcion, categoria, precio, stock, imagen_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE productos SET 
        nombre = $1, descripcion = $2, categoria = $3, precio = $4, stock = $5, imagen_url = $6,
        actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [nombre, descripcion, categoria, precio, stock, imagen_url, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, message: 'Producto actualizado', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al actualizar producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }
    res.json({ ok: true, message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al eliminar producto' });
  }
};