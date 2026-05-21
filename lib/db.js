// 1. Cargar la herramienta Dotenv para que Node lea el archivo .env
import 'dotenv/config';
// 2. Importar el conector oficial de Neon
import { neon } from '@neondatabase/serverless';

// 3. Comprobación de seguridad: Si te has olvidado de configurar la URL, el código te avisará antes de romperse
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR CRÍTICO: No se encuentra la variable DATABASE_URL en el archivo .env");
  process.exit(1);
}

// 4. Crear la instancia de conexión segura inyectándole la URL del .env
export const sql = neon(process.env.DATABASE_URL);