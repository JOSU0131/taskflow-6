import express from 'express';
import { sql } from './lib/db.js';

const app = express();
const PORT = 3000;

// Permitir que el servidor entienda datos en formato JSON que le envíe el Frontend
app.use(express.json());

// -------------------------------------------------------------------------
// RUTA 1: GET - Obtener productos con su categoría (Para pintar la tabla)
// -------------------------------------------------------------------------

// Ruta de bienvenida en la raíz
app.get('/', (req, res) => {
  res.send('🌌 ¡Servidor de HammerFlow Forge operando con éxito en la nube de Vercel!');
});
app.get('/api/products', async (req, res) => {
  try {
    const productos = await sql`
      SELECT p.id, p.name AS producto, p.price AS precio, p.stock, c.name AS categoria
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
    `;
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos de la nube' });
  }
});

// -------------------------------------------------------------------------
// RUTA 2: POST - Insertar un producto de forma SEGURA (Consulta parametrizada)
// -------------------------------------------------------------------------
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category_id } = req.body;

  // Validación rápida
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // 🛡️ CONSULTA PARAMETRIZADA: Los datos van por un canal separado ($1, $2...)
    // Esto neutraliza por completo cualquier ataque de Inyección SQL.
    const nuevoProducto = await sql`
      INSERT INTO products (name, price, stock, category_id)
      VALUES (${name}, ${price}, ${stock || 0}, ${category_id})
      RETURNING *
    `;
    
    res.status(201).json({ 
      mensaje: '¡Producto creado con éxito en Neon!', 
      producto: nuevoProducto[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error de base de datos al insertar el producto' });
  }
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});