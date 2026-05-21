
# Auditoría de Seguridad - Persistencia Segura

## ¿Qué es la Inyección SQL (SQLi)?
Es una vulnerabilidad crítica que ocurre cuando las entradas de un usuario se concatenan directamente dentro de una cadena de texto que se va a ejecutar como comando SQL en el motor. Si un atacante escribe código malicioso en un input de formulario (por ejemplo: `' OR '1'='1`), puede alterar la lógica de la query, saltarse sistemas de login o incluso borrar bases de datos enteras (`'; DROP TABLE products;--`).

## Mitigación: Consultas Parametrizadas
En nuestro backend hemos neutralizado este vector de ataque utilizando **consultas parametrizadas (o marcadores de posición)** provistos de forma nativa por el driver `@neondatabase/serverless`.

Al escribir:
```javascript
await sql`INSERT INTO products (name) VALUES (${name})`;