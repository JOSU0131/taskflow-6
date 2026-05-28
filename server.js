import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import { db } from './lib/db.js';
// 🛠️ FIX 1: Quitamos los dos puntos (../). Como server.js está en la raíz, busca schema.js a su lado con un solo punto (./)
import { products, categories } from './schema.js'; 
import { eq } from 'drizzle-orm'; 

const app = express();

app.use(cors()); 
app.use(express.json());

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('🌌 ¡Servidor de API de HammerFlow Forge operando con éxito en la nube!');
});

// Endpoint GET (Tu Query Builder de Drizzle que ya estaba perfecto)
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db
      .select({
        id: products.id,
        producto: products.name,
        precio: products.price,
        stock: products.stock,
        categoria: categories.name
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id));

    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error interno del servidor al consultar la base de datos." });
  }
});

// Endpoint POST 
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category_id } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios: name, price o category_id" });
  }
  try {
    const query = `
      INSERT INTO products (name, price, stock, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [name, price, stock || 0, category_id];
    const result = await db.execute(query, values);
    res.status(201).json({ 
      message: "✅ Producto creado con éxito de forma segura", 
      product: result.rows ? result.rows[0] : result 
    });
  } catch (error) {
    console.error("❌ Error al insertar producto:", error.message);
    res.status(500).json({ error: "Error de persistencia al guardar el producto." });
  }
});

// 🛠️ FIX 2: Para Serverless en Vercel exportamos la app en vez de dejar el proceso colgado en app.listen()
export default app;