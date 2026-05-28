// Cargar la herramienta Dotenv para que Node lea el archivo .env
import 'dotenv/config';
// Importar el conector oficial de Neon
import { neon } from '@neondatabase/serverless';
// Importar el conector oficial de Drizzle 
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema.js';

if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR CRÍTICO: No se encuentra DATABASE_URL en el archivo .env");
  process.exit(1);
}

// 1. El cable de conexión física con Neon (el de ayer)
const sqlConnection = neon(process.env.DATABASE_URL);

// 2. El cerebro de Drizzle inyectado encima para darnos superpoderes de consulta
export const db = drizzle(sqlConnection, { schema });