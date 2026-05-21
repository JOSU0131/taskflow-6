import { sql } from './lib/db.js';

async function probarConexion() {
  try {
    console.log("⏳ Conectando con Neon en la nube...");
    
    // Le pedimos a Postgres que haga un cruce rápido (INNER JOIN) de tus productos para probar
    const productos = await sql`
      SELECT p.name AS producto, c.name AS categoria 
      FROM products p 
      INNER JOIN categories c ON p.category_id = c.id
    `;
    
    console.log("✅ ¡CONEXIÓN EXITOSA CON NEON!");
    console.log("📦 Datos recuperados desde la nube:");
    console.table(productos); // Esto te pintará una bonita tabla en la consola local
    
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
  }
}

probarConexion();