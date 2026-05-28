import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import { db } from './lib/db.js';
import { products, categories } from './schema.js'; 
import { eq } from 'drizzle-orm'; 

const app = express();

// Configuración estricta de CORS para admitir las peticiones locales y de producción
app.use(cors());
app.use(express.json());

// Ruta de diagnóstico
app.get('/', (req, res) => {
  res.send('🌌 ¡Servidor de API de HammerFlow Forge operando con éxito en la nube!');
});

// Endpoint GET optimizado para las funciones asíncronas HTTP de Vercel y Neon
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

// Endpoint POST seguro
app.post('/api/products', async (req, res) => {
  const { name, price, stock, category_id } = req.body;
  if (!name || !price || !category_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  try {
    const result = await db.insert(products).values({
      name,
      price,
      stock: stock || 0,
      categoryId: category_id
    }).returning();
    
    res.status(201).json({ message: "✅ Producto creado con éxito", product: result[0] });
  } catch (error) {
    console.error("❌ Error al insertar producto:", error.message);
    res.status(500).json({ error: "Error de persistencia al guardar el producto." });
  }
});

// Solo levantamos el puerto si NO estamos en el entorno de producción de Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend local escuchando en http://localhost:${PORT}`);
  });
}

// Exportamos la app para que el motor serverless de Vercel la controle
export default app;