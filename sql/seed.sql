-- 1. Limpiar datos previos por si acaso 
-- (en orden inverso por las Foreign Keys)

TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- 2. Insertar Categorías y rellenar productos usando subconsultas para capturar los UUIDs
INSERT INTO categories (name, description) VALUES 
('Impresión 3D', 'Miniaturas de resina y filamento listas para pintar'),
('Pinturas y Pinceles', 'Acrílicos de alta pigmentación y herramientas de modelismo'),
('Escenografía', 'Elementos de terreno para juegos de mesa y dioramas');

-- 3. Insertar Productos enlazándolos dinámicamente con sus categorías correspondientes
INSERT INTO products (name, price, stock, category_id) VALUES 
('Guerrero del Caos (Resina)', 14.50, 20, (SELECT id FROM categories WHERE name = 'Impresión 3D')),
('Dragón Ancestral Gigante', 45.00, 5, (SELECT id FROM categories WHERE name = 'Impresión 3D')),
('Pack Pintura Básica (12 colores)', 29.99, 15, (SELECT id FROM categories WHERE name = 'Pinturas y Pinceles')),
('Pincel de Detalle Pro 00', 6.50, 50, (SELECT id FROM categories WHERE name = 'Pinturas y Pinceles')),
('Ruinas Góticas de Plástico', 34.95, 8, (SELECT id FROM categories WHERE name = 'Escenografía'));