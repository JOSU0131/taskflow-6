# Taskflow 6 - Persistencia Relacional y Arquitectura en la Nube

## 🔨 HammerFlow Forge: Marketplace & Hobby Hub (Capa de Almacenamiento)

Bienvenido a la evolución de HammerFlow Forge. En esta Fase 6, transformamos nuestra aplicación en un ecosistema robusto, seguro y preparado para producción migrando todo el almacenamiento de información a una base de datos relacional PostgreSQL serverless en la nube (Neon).

Hemos sustituido las estructuras volátiles e inseguras en memoria por un esquema de datos relacional estricto, blindado contra fallos de integridad mediante identificadores únicos UUID, e introducido capas de persistencia avanzadas tanto en SQL puro como mediante la abstracción moderna de Drizzle ORM para garantizar el tipado unificado de los datos de nuestro inventario.

## 🚀 Enlaces del Proyecto
   
    - Despliegue Frontend (Vercel): https://taskflow-6.vercel.app/api/products
    - Tablero de Organización (Trello): [https://trello.com/b/LeLvBjuK/my-trello-board]


## 🛠️ Tecnologías Utilizadas

Base de Datos e Infraestructura Cloud
    - PostgreSQL 16 / Neon DB: Motor de base de datos relacional cloud con arquitectura de almacenamiento serverless y aislamiento de entornos.

    - UUID Extension (uuid-ossp): Generación segura y descentralizada de claves primarias a través de gen_random_uuid().

    - SQL Nativo (DDL/DML): Scripts estructurados para la inicialización del esquema y la siembra de semillas de prueba.

Backend y Capa de Persistencia
    - Node.js & Express: Servidor de API REST para exponer los recursos del catálogo y procesar transacciones seguras.

    - Drizzle ORM: Object-Relational Mapping (ORM) moderno y ligero para la consulta tipada y orientada a objetos de la base de datos.

    - Dotenv: Gestión e inyección de variables de entorno ocultas para resguardar las credenciales del clúster cloud.

Frontend
    - React 18 (Vite): Interfaz SPA optimizada para el renderizado y consumo de datos relacionales en tiempo real.

    - Tailwind CSS: Diseño de componentes e interfaces administrativas totalmente adaptables y estilizadas.


## 📋 Metodología y Organización

Para el desarrollo de la arquitectura de datos y el aprovisionamiento de infraestructura hemos aplicado principios de la metodología Agile, asegurando una separación clara entre el diseño del esquema y la lógica de consumo del servidor. Puedes consultar el diario de desarrollo paso a paso y la evolución completa del sistema en: 👉 doc_bitacorafull.md

## 📐 Arquitectura de la Aplicación y Seguridad

El backend de la aplicación ha sido rediseñado para interactuar con un almacenamiento persistente y normalizado, enfocado en resolver las siguientes directrices de ingeniería:

    Garantía ACID e Integridad: Estructuración de datos en tablas normalizadas unidas mediante claves foráneas con restricciones estrictas (ON DELETE RESTRICT) para mitigar cualquier anomalía de borrado o registros huérfanos.

    Blindaje contra Inyección SQL (SQLi): Implementación de Consultas Parametrizadas (parámetros preparados) tanto en el driver nativo de Neon como en la capa de Drizzle ORM. Los inputs del usuario viajan de forma aislada a las instrucciones del motor, neutralizando por completo el riesgo de alteración de queries.

    Abstracción mediante ORM Tipado: Integración de Drizzle ORM en la capa de persistencia. Esto traslada la validación del esquema directamente al tiempo de compilación en el backend, ofreciendo autocompletado inteligente en el editor y previniendo errores de discrepancia de nombres o tipos antes de que las consultas impacten en producción.


## Estructura de Documentación (Paso a Paso)

El proceso completo de diseño relacional, análisis y despliegue backend está documentado al detalle en la carpeta docs/:

    Paso 1: Diseño de esquema e infraestructura: docs/arquitectura-datos.md

    Paso 2: Semillas y análisis de datos: docs/analisis-sql.md

    Paso 3: Capa de persistencia segura: docs/seguridad-db.md


## 💻 Instalación y Uso

    1. Instalar el ecosistema de dependencias del servidor, ORM y cliente web:
        Bash
        npm install

    2. Configurar el entorno secreto:
        Crea un archivo .env en la raíz del proyecto e inserta tu variable string de conexión privada proporcionada por Neon:
        DATABASE_URL="postgresql://neondb_owner ......"

    3. Ejecutar el proyecto en entorno de desarrollo:
        Bash
        # Ejecutar los scripts de prueba de persistencia
            node test.js       # Test con SQL Nativo
            node test-orm.js   # Test con Drizzle ORM

        # Iniciar el servidor backend de Express
            node server.js
            - - -

## 🧠 Reflexión Final

Este proyecto ha marcado un hito en la madurez de nuestra arquitectura fullstack al consolidar una capa de persistencia real y blindada en la nube. Al delegar la consistencia en el motor PostgreSQL y mapear nuestras tablas de manera unificada mediante Drizzle ORM, aseguramos un contrato de datos robusto de extremo a extremo, cerrando el ciclo completo entre las transacciones del backend y la renderización en el frontend.

Puedes leer la bitácora completa del proceso en doc_bitacorafull.md