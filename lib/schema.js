import { pgTable, uuid, varchar, text, numeric, integer } from 'drizzle-orm/pg-core';

// 1. Tabla Categorías
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
});

// 2. Tabla Productos
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 150 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0),
  // 🔑 Forzamos a que en la query SQL escriba "category_id" tal cual existe en Neon
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
});