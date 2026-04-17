\c inventario_tienda;

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

CREATE OR REPLACE FUNCTION update_actualizado_en_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.actualizado_en = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_productos_actualizado_en ON productos;
CREATE TRIGGER update_productos_actualizado_en
BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION update_actualizado_en_column();

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);

INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock, imagen_url) VALUES
(1, 'Laptop ASUS VivoBook 15',   'Procesador Intel Core i5, 8GB RAM, 512GB SSD, pantalla FHD 15.6"',  'Laptops',     2499.90, 12, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'),
(2, 'Monitor LG 24" IPS',        'Resolución Full HD 1920x1080, frecuencia 75Hz, panel IPS',           'Monitores',    699.00,  8, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'),
(3, 'Teclado Mecánico Redragon', 'Switches Blue, retroiluminación RGB, layout español',                'Periféricos',  189.90, 25, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400'),
(4, 'Mouse Logitech G502',       'Sensor HERO 25K, 11 botones programables, peso ajustable',           'Periféricos',  249.00,  3, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'),
(5, 'Audífonos Sony WH-1000XM5', 'Cancelación de ruido activa, 30h batería, Bluetooth 5.2',           'Audio',        899.00,  0, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
(6, 'SSD Kingston 1TB NVMe',     'Velocidad lectura 3500 MB/s, interfaz PCIe 3.0 M.2',                'Almacenamiento',279.90, 18, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'),
(7, 'Webcam Logitech C920',      'Full HD 1080p 30fps, micrófono estéreo incorporado',                 'Periféricos',  299.00,  5, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
(8, 'Tablet Samsung Galaxy A8',  'Pantalla 10.5" TFT, 64GB almacenamiento, Android 13',               'Tablets',      899.00,  7, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400')
ON CONFLICT (id) DO NOTHING;

SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));