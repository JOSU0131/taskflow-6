# LA FASE 6:

## Visión General: Lo que haremos en esta fase
El objetivo de esta fase es construir un sistema de inventario de aprendizaje (learning-inventory) conectado a una base de datos PostgreSQL serverless en Neon. El flujo de trabajo se divide en 4 bloques:

1. Diseño del Cerebro (SQL y Neon): Crearemos la base de datos en la nube y definiremos las tablas (categories y products) usando código SQL puro (DDL).

2. Pruebas de Datos (Queries Avanzadas): Meteremos datos de prueba (semillas) y aprenderemos a cruzarlos usando JOINs y agrupaciones (GROUP BY).

3. El Puente Seguro (Backend Node/Next.js): Conectaremos el servidor a Neon usando variables de entorno y consultas parametrizadas para evitar que nos hackeen (Inyección SQL).

4. El Escaparate (Frontend React): Pintaremos esos datos reales en una interfaz limpia y lo desplegaremos todo en Vercel.

# PASO 1: Diseño de esquema e infraestructura
    Vamos a arrancar con la infraestructura en la nube y el diseño de las tablas. No tocaremos nada de código de servidor aún.

    1.1. Configuración en Neon (La Nube)
    
    Entra en neon.tech y regístrate (podemos usar tu cuenta de GitHub).

##  Nota
    "npx neonctl@latest init"

    Es el Comando oficial para usar la CLI de Neon (interfaz de línea de comandos) asistida por IA.
    Básicamente, te está invitando a configurar herramientas avanzadas en tu ordenador local para enlazar tu entorno con su nube.

    ¿A qué se refiere exactamente?
    Te ofrece instalar neonctl, una herramienta de terminal que automatiza la configuración de tu entorno de desarrollo. Entre sus ventajas se incluyen la vinculación automática de extensiones para tu IDE (como VS Code) o la creación de servidores que permitan a agentes externos de IA interactuar directamente con tu base de datos para autogenerarte código o esquemas.

    NOTA IMPORTANTE: CLAVE "Connection string" en doc notas: "FASE 6"

# Paso 2:

## Paso 2.1. Ejecutarlo todo en la Web de Neon
    Ahora vuelve a tu navegador, a la pestaña de Neon que tenías abierta. En el menú de la izquierda, entra en SQL Editor. Vamos a ejecutar el Esquema y luego la Semilla.

    Paso A: Crear las tablas (Esquema)
    Si no lo habías ejecutado antes, pega primero el código para estructurar las tablas:
    
        SQL:
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT
        );

        CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
        stock INTEGER DEFAULT 0 CHECK (stock >= 0),
        category_id UUID NOT NULL,
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
        );
        - - -

## Paso 2.2
    Ahora vamos a ejecutar las consultas de cruce de datos (los JOINs y GROUP BY) que te pide la Fase 6 directamente aquí para comprobar que todo responde como debe.

    Borraremos todo el texto en neon SQL Editor y ejecutamos estas tres pruebas una a una (pones la primera, le das a Run, miras el resultado, borras y pones la siguiente):

    1. Consulta 1: El INNER JOIN (Cruzar Producto y Categoría)
        Esta consulta te va a cambiar los códigos UUID raros por los nombres legibles de cada categoría al lado de su producto.

        SELECT p.name AS producto, p.price AS precio, c.name AS categoria
        FROM products p
        INNER JOIN categories c ON p.category_id = c.id;

    2. Consulta 2: El GROUP BY + COUNT (Contador por categoría)
        Esta query le pide a Postgres que agrupe todo tu catálogo y te diga cuántos productos diferentes tiene asignada cada categoría en el inventario.

        SQL:
        SELECT c.name AS categoria, COUNT(p.id) AS total_productos
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.name;

    3. Consulta 3: Modificación simulando una venta (UPDATE)
        Vamos a restarle una unidad de stock al "Pincel de Detalle Pro 00" simulando que un usuario acaba de comprarlo en la tienda.

        UPDATE products 
        SET stock = stock - 1 
        WHERE name = 'Pincel de Detalle Pro 00';

### Nota 1. Comprobar que el Stock bajó (Verificación del UPDATE)
    Para ver cómo quedó el producto después de restarle stock, ejecuta esta consulta:

    SQL
    SELECT name, price, stock 
    FROM products 
    WHERE name = 'Pincel de Detalle Pro 00';
    
    ¿Qué deberías ver? En la tabla de resultados de abajo, verás que el stock del pincel ahora marca 49 (ya que la semilla inicial le había puesto 50). ¡El estado de tu tienda acaba de cambiar de verdad!

## Paso 2.3
    1. Simular un borrado real (DELETE)
    El enunciado también te pide escribir un borrado transaccional. Vamos a eliminar por completo un producto del inventario, por ejemplo, las "Ruinas Góticas de Plástico". Ejecuta esto en Neon:

        SQL
        DELETE FROM products 
        WHERE name = 'Ruinas Góticas de Plástico';

    2. Comprobar que se ha borrado (Verificación del DELETE)
    Para demostrar científicamente que el producto ya no existe en tu base de datos, ejecuta un listado general de todos tus productos:

        SQL
        SELECT * FROM products;


## Resumen Repaso del Paso 1: Configuración e Infraestructura
    En el Paso 1, lo que hicimos fue diseñar los planos de nuestra base de datos.

    1. Creamos la infraestructura: Nos fuimos a Neon y levantamos una base de datos PostgreSQL en la nube de forma serverless (sin pelearnos con instalaciones locales complejas ni terminales de Linux/ASIR).

    2. Definimos la estructura (DDL): Creamos el archivo schema.sql en VS Code. Aquí le dijimos a Postgres: "Quiero dos tablas bien estructuradas, donde los productos no puedan existir si no tienen una categoría válida asignada a través de su UUID" (Integridad referencial).
    
Fin paso 2*
siguiente paso

# Paso 3
El siguiente gran bloque es el Paso 3: Integración en backend y seguridad

Pasamos a VS code y vamos a transformar la carpeta actual en un servidor de Node.js capaz de hablar con internet.

## Paso 3.1: Inicializar el proyecto con Node.js
Necesitamos decirle a tu ordenador que la carpeta taskflow-6 ahora es un proyecto de desarrollo.

    Abre la terminal integrada de VS Code (si no la tienes abierta, ve al menú superior: Terminal -> New Terminal).

    Asegúrate de que la terminal está situada en la raíz de tu carpeta (taskflow-6).

    Escribe el siguiente comando y pulsa Enter:
        Bash
        npm init -y

    nota: ¿Qué hace esto? 
    Creará automáticamente un archivo llamado "package.json" en tu explorador de archivos. Es la "tarjeta de identidad" de tu proyecto backend, donde se anotará qué herramientas vamos a descargar.

## Paso 3.2: Instalar las herramientas necesarias
Ahora vamos a descargar los paquetes que necesitaremos para conectarnos a Neon de forma segura y moderna.

    En la misma terminal de VS Code, escribe este comando y dale a Enter:
        Bash
        npm install @neondatabase/serverless dotenv
    
    Nota: ¿Qué acabamos de instalar?
    @neondatabase/serverless: El cable conductor oficial de Neon para poder enviarle sentencias SQL desde nuestro código de JavaScript/TypeScript.

    dotenv: Una herramienta vital que permite a Node.js leer contraseñas secretas desde un archivo oculto sin que se queden expuestas en el código fuente.

    Y se crea "package-lock.json"

## Paso 3.3: Ocultar la contraseña maestra (.env)
Tu cadena de conexión a Neon contiene tu usuario y tu contraseña real. Si subes eso a GitHub, cualquiera podría borrarte la base de datos. Vamos a blindarla.

    1. En el explorador de archivos de VS Code, haz clic derecho en la zona vacía y crea un nuevo archivo llamado exactamente:
    .env 

    2. Abre ese archivo .env y pega tu cadena de conexión (la URL larga que guardamos al principio del todo o que viste en tu primera captura) siguiendo esta estructura:
        Bash
        DATABASE_URL="postgresql: "aqui ira la cadena de conexion de neon"

    3. Adicionalmente creamos archivo .gitignore y escribimos dentro una sola línea:
        node_modules
        .env

    ¿Qué hace esto? Le dice a Git que ignore por completo tu archivo de contraseñas. Cuando subas el proyecto a GitHub, el archivo .env se quedará a salvo únicamente en tu ordenador.

Ahora vamos a fabricar el "enchufe" en tu código para que el servidor use esa llave y abra el canal de comunicación con Neon.
NOTA: Evitamos introducir Typescript (para simplificar tarea y dolores de cabeza)

## Paso 3.4: Crear la carpeta y el archivo de conexión y Paso 3.5: Escribir el código del enchufe (lib/db.js)

En el explorador de archivos de VS Code (a la izquierda), haz clic derecho en la zona vacía de la raíz del proyecto (taskflow-6).

    1. Creamos carpeta lib. Y creamos archivo  "db.js"
    2. Dentro escribimos el comando de carga de las herramienta Dotenv y una comprobación de seguridad

## Paso 3.6: Probar si el cable funciona (test.js)
Para asegurarnos al 100% de que nuestro PC habla con Neon sin tener que montar todavía toda la API de Express o Next.js, vamos a hacer una prueba.

    1. Creamos el archivo en raiz "test.js" , "Pidiendo": a Postgres que haga un cruce rápido (INNER JOIN) de tus productos para probar.
    2. Lanzamos la prueba:
        Abrimos la terminal VS code en la raiz del proyecto y escribimos el comando:
            Bash
            node test.js 

        NOTA: Si todo está bien configurado, LA terminal local parpadeará un segundo y mostrara los productos de modelismo (el Guerrero del Caos, el Dragón, etc.) traídos directamente desde los servidores de Neon.

        "El puente construido y funcionando! El cable es 100% operativo." 

## Paso 3.7: Desarrollo de los endpoints seguros
El enunciado pide crear la estructura para que un cliente pueda consumir esto. Como estamos haciendo un backend desacoplado con Node/Express (para luego conectarlo al Frontend de React con Vite), vamos a crear los dos endpoints (las rutas de la API) necesarios:

1. GET /api/products: Una ruta que devuelva exactamente esa tabla de productos con sus categorías en formato JSON.
2. POST /api/products: Una ruta para poder añadir nuevos productos desde un formulario de forma segura usando consultas parametrizadas para evitar hackeos (Inyección SQL).

Montaremos servidor Express rápido. Siguiendo estos pasos:

1. Instalar Express
    En la terminal de VS Code, escribe el comando para instalar la herramienta (install express) que maneja las rutas web:
        Bash
        npm install express
    Nota: ¿Qué hace esto?
    Creará la carpeta node_modules   (recuerda añadirla a .gitignore para evitar subirla a github)
    Creará "package-lock.json"
    Modificará el package.json con dependencia "express"
    

2. Crear el archivo del servidor (server.js)
    Creamos un archivo llamado "server.js" en la raíz del proyecto (taskflow-6), para permitir que el servidor entienda datos en formato JSON que le envíe el Frontend

3. Encedemos el servidor
    En terminal escribimos:
        node server.js
    nota: Debería poner: 🚀 Servidor backend escuchando en http://localhost:3000.

4. Creamos la última documentación de seguridad (docs/seguridad-db.md)
    Mientras el servidor corre, creamos el archivo docs/seguridad-db.md

    Nota: ¿Qué hicimos?
    El driver separa estrictamente las instrucciones SQL de los datos proporcionados por el usuario. El motor de PostgreSQL compila primero la estructura del comando de forma segura y luego trata la entrada del usuario estrictamente como un texto plano (un string de datos), impidiendo que cualquier comando infiltrado sea ejecutado por el procesador.

¡Ya tenemos el Backend blindado y listo para entregar