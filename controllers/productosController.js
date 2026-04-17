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
  const conditions = [];

  if (search) {
    conditions.push(`(nombre ILIKE $${values.length + 1} OR descripcion ILIKE $${values.length + 1})`);
    values.push(`%${search}%`);
  }
  if (categoria) {
    conditions.push(`categoria = $${values.length + 1}`);
    values.push(categoria);
  }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY id DESC';

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
    if (result.rows.length === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
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
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        categoria = COALESCE($3, categoria),
        precio = COALESCE($4, precio),
        stock = COALESCE($5, stock),
        imagen_url = COALESCE($6, imagen_url)
       WHERE id = $7 RETURNING *`,
      [nombre, descripcion, categoria, precio, stock, imagen_url, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, message: 'Producto actualizado', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al actualizar producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al eliminar producto' });
  }
};

exports.obtenerStats = async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM productos');
    const stockTotal = await pool.query('SELECT COALESCE(SUM(stock),0) FROM productos');
    const valorInventario = await pool.query('SELECT COALESCE(SUM(precio * stock),0) FROM productos');
    const sinStock = await pool.query('SELECT COUNT(*) FROM productos WHERE stock = 0');
    const bajoStock = await pool.query('SELECT COUNT(*) FROM productos WHERE stock > 0 AND stock <= 5');
    
    res.json({
      ok: true,
      data: {
        total_productos: parseInt(total.rows[0].count),
        stock_total: parseInt(stockTotal.rows[0].coalesce),
        valor_inventario: parseFloat(valorInventario.rows[0].coalesce),
        sin_stock: parseInt(sinStock.rows[0].count),
        bajo_stock: parseInt(bajoStock.rows[0].count)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al obtener estadísticas' });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT categoria FROM productos WHERE categoria IS NOT NULL ORDER BY categoria');
    res.json({ ok: true, data: result.rows.map(row => row.categoria) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al obtener categorías' });
  }
};  