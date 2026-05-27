import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: Falta DATABASE_URL en el archivo .env");
}

export default defineConfig({
  out: './drizzle',               // Carpeta automática donde guardará el historial de cambios
  schema: './lib/schema.js',      // Dónde está el archivo con el diseño de tus tablas
  dialect: 'postgresql',          // El motor de base de datos que usamos
  dbCredentials: {
    url: process.env.DATABASE_URL,  // La contraseña secreta de Neon
  },
});