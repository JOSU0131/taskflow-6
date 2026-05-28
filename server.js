import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // 1. Importar CORS
import { db } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON en el cuerpo de las peticiones (POST)
// 2. Permir que cualquier aplicación Frontend consulte tu API de forma segura
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json());

// 🌌 Ruta de bienvenida en la raíz para evitar el "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🌌 ¡Servidor de API de HammerFlow Forge operando con éxito en la nube!');
});

// 📦 ENDPOINT GET: Recuperar productos con sus categorías (INNER JOIN seguro con Drizzle)
app.get('/api/products', async (req, res) => {
  try {
    // Usamos el método .execute() nativo de Drizzle pero asegurando la extracción correcta del resultado
    const result = await db.execute(
      'SELECT p.id, p.name AS producto, p.price AS precio, p.stock, c.name AS categoria ' +
      'FROM products p ' +
      'INNER JOIN categories c ON p.category_id = c.id'
    );

    // En el conector serverless de Neon, las filas pueden venir directamente en el objeto result 
    // o bajo result.rows dependiendo de la versión interna. Aseguramos ambos casos:
    const rows = result.rows ? result.rows : result;
    
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error.message);
    res.status(500).json({ error: "Error interno del servidor al consultar la base de datos." });
  }
});

// 🛡️ ENDPOINT POST: Insertar un producto de forma segura (Evita Inyección SQL - SQLi)
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category_id } = req.body;

  // Validación básica de campos obligatorios
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios: name, price o category_id" });
  }

  try {
    // 🔑 CONSULTA PARAMETRIZADA: Los datos ($1, $2...) viajan separados de las órdenes SQL
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

// Arrancar el servidor local
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});