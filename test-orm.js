import { db } from './lib/db.js';
import { products, categories } from './lib/schema.js';
import { eq } from 'drizzle-orm';

async function probarDrizzle() {
  try {
    console.log("⏳ Consultando Neon de forma segura a través de Drizzle ORM...");
    
    // Consulta directa mapeando los nombres SQL a propiedades de un objeto
    const listadoProductos = await db
      .select({
        id: products.id,
        producto: products.name,
        precio: products.price,
        stock: products.stock,
        categoria: categories.name,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id));

    console.log("✅ ¡CONEXIÓN CON DRIZZLE ORM EXITOSA!");
    console.log("📦 Objetos mapeados recuperados desde la nube:");
    console.dir(listadoProductos, { depth: null });
    
  } catch (error) {
    console.error("❌ Error en el test de Drizzle:", error.message);
  }
}

probarDrizzle();