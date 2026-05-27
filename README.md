# Taskflow 6 - Persistencia Relacional y Arquitectura en la Nube

## 🔨 HammerFlow Forge: Marketplace & Hobby Hub (Capa de Almacenamiento)

Bienvenido a la evolución de HammerFlow Forge. En esta Fase 6, transformamos nuestra aplicación en un ecosistema robusto, seguro y preparado para producción migrando todo el almacenamiento de información a una base de datos relacional PostgreSQL serverless en la nube (Neon).

Hemos s# 🌌 HammerFlow Forge - Gestión de Inventario Relacional

> **Fase 6:** Modelado de datos, SQL avanzado y persistencia serverless con PostgreSQL, Neon y Drizzle ORM.

---

## 🚀 Despliegue en la Nube
| Componente | Plataforma | URL de Producción |
| :--- | :--- | :--- |
| **Backend API** | Vercel | [https://taskflow-6.vercel.app](https://taskflow-6.vercel.app) |
| **Frontend Web** | Vercel | *(Próximamente)* |
| **Base de Datos**| Neon DB | PostgreSQL Cloud Serverless |

---

## 📋 Características de la Fase 6
* **Infraestructura Cloud:** Base de datos PostgreSQL serverless alojada en Neon con separación de cómputo y almacenamiento.
* **Integridad Referencial:** Diseño estricto de tablas (`categories` y `products`) mediante identificadores universales `UUID` y restricciones de clave foránea.
* **Persistencia Segura (Anti-SQLi):** Implementación de endpoints REST en Node/Express utilizando consultas parametrizadas (parámetros preparados) para neutralizar ataques de inyección de código.
* **Arquitectura de Abstracción:** Configuración de **Drizzle ORM** y generación de migraciones automatizadas para el control de versiones del esquema de base de datos.

---

## 🛠️ Tecnologías Utilizadas

### Backend & Persistencia
* **Node.js & Express:** Motor de servicios de la API REST.
* **PostgreSQL (Neon DB):** Motor de base de datos relacional serverless.
* **Drizzle ORM & Drizzle-Kit:** Mapeo objeto-relacional y herramientas de migración de esquema.
* **CORS & Dotenv:** Middleware de seguridad de orígenes y gestión de variables de entorno seguras.

### Frontend (En Desarrollo)
* **React + Vite:** Entorno cliente SPA de alta velocidad.
* **TypeScript:** Tipado estricto de datos en el cliente para el consumo de la API.
* **Tailwind CSS:** Diseño de interfaz responsiva y estilizada.

---

## 🧠 Ventajas de Usar un ORM Tipado (Drizzle ORM)

En cumplimiento con los requerimientos de la fase, se detallan las ventajas de implementar un ORM tipado en el ecosistema empresarial frente al uso exclusivo de SQL nativo en texto plano:

1. **Seguridad en Tiempo de Compilación (Type Safety):** Al acoplar Drizzle ORM con TypeScript, el esquema de la base de datos se convierte en contratos de tipo de código reales. Si cambiamos el nombre de una columna de `category_id` a `categoryId` en el esquema, el compilador e IDE marcarán instantáneamente un error en cualquier línea del proyecto que intente consultar la columna antigua antes de desplegar a producción.
2. **Autocompletado e Inteligencia en el IDE:** Al consultar registros utilizando programación orientada a objetos (`db.select().from(products)...`), el editor de código expone mediante Intellisense las columnas exactas disponibles de la tabla, minimizando los errores humanos por erratas de escritura (como equivocarse en una letra de un campo).
3. **Control de Versiones de la Infraestructura (Migraciones):** Herramientas como `drizzle-kit generate` y `push` permiten rastrear los cambios del modelo de datos en archivos `.sql` cronológicos (Git para datos). Esto garantiza que todo el equipo de ingenieros trabaje sobre la misma estructura de tablas exacta sin necesidad de ejecutar scripts manuales en las consolas de base de datos.
4. **Prevención Nativa de Inyecciones SQL (SQLi):** Los ORMs procesan las consultas abstrayendo las entradas del usuario directamente en parámetros preparados por defecto. Esto elimina la concatenación accidental de texto dinámico en las queries, blindando la capa de datos de forma pasiva y automatizada.

---

## 📂 Estructura del Proyecto

```text
taskflow-6/
├── docs/                      # Documentación de ingeniería requerida
│   ├── arquitectura-datos.md  # Análisis de Claves Foráneas y ON DELETE RESTRICT
│   ├── analisis-sql.md        # Diferencias operacionales entre INNER y LEFT JOIN
│   └── seguridad-db.md        # Auditoría contra ataques SQLi y uso de parámetros
├── drizzle/                   # Historial de migraciones autogeneradas por el ORM
├── lib/
│   ├── db.js                  # Inicialización y enchufe del cliente Drizzle-Neon
│   └── schema.js              # Planos de las tablas y puentes relacionales del ORM
├── sql/                       # Scripts de inicialización nativos en base de datos
│   ├── schema.sql             # Sentencias DDL de creación de tablas
│   └── seed.sql               # Semillas INSERT de población de datos
├── frontend/                  # Aplicación Cliente (Vite + React + TypeScript)
├── server.js                  # Servidor API de producción (Express)
├── vercel.json                # Configuración de enrutamiento moderno en Vercel
└── README.md                  # El documento que estás leyendo ahoraustituido las estructuras volátiles e inseguras en memoria por un esquema de datos relacional estricto, blindado contra fallos de integridad mediante identificadores únicos UUID, e introducido capas de persistencia avanzadas tanto en SQL puro como mediante la abstracción moderna de Drizzle ORM para garantizar el tipado unificado de los datos de nuestro inventario.

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