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

# Paso 4

Notas sobre Drizzle ORM
    Drizzle es una capa que se pone encima de la base de datos y te permite:

        1. Definir la estructura de tus tablas usando código JavaScript/TypeScript.

        2. Hacer consultas usando funciones de código (como .select(), .insert()) en lugar de strings de texto plano.

        3. Tener autocompletado en VS Code. Si empiezas a escribir un campo, el editor te sugiere las columnas reales de tu base de datos.

## Paso 4.1: Instalar Drizzle y sus herramientas
    Vamos a instalar el ORM y su kit de desarrollo (Drizzle Kit), que sirve para leer archivos y sincronizarlos con Neon automáticamente.
        1. Ejecuta comando para instalar dependencias del ORM:
            Bash
            npm install drizzle-orm

        2. Ahora instalamos las herramientas de desarrollo (las que nos ayudarán a gestionar las migraciones):
            Bash
            npm install -D drizzle-kit
            - - -

## **NOTA IMPORTANTE**:  Para entender exactamente qué significa el aviso técnico (tras npm install -D drizzle-kit)
    - ¿Qué paso?
    Cuando instalas herramientas de desarrollo pesadas como drizzle-kit, estas dependen a su vez de decenas de minilibrerías escritas por otros desarrolladores (por eso te dice que ha añadido 16 paquetes).

    De vez en cuando, en alguna de esas sublibrerías secundarias se descubre un fallo menor. El equipo de seguridad de npm lo registra y te avisa con ese mensaje flotante.

        1. Son de severidad moderada ("moderate severity"): No son fallos críticos que permitan que te hackeen el sistema. Suelen ser cosas tontas como que una función de formatear texto puede ir un poco lenta si le metes un archivo de 5 gigas

        2. Es una herramienta de desarrollo (-D): drizzle-kit solo se ejecuta en tu máquina local mientras diseñas las tablas. Ese código nunca viaja al servidor web final de producción en Vercel, por lo que el usuario final jamás estará expuesto.

        3. Error de Drizzle: Paquetes obsoletos advertidos (deprecated): Las advertencias amarillas de arriba simplemente avisan de que un par de complementos internos de Drizzle.

    - Cómo solucionarlo (La buena práctica de seguridad)
    Como el propio npm te sugiere en la consola, puedes intentar que el gestor corrija de forma automática esas sublibrerías buscando parches que no rompan tu código.
        Bash
        npm audit fix

        ¿Qué hace esto? Va a los servidores de npm, busca si los creadores de esos subpaquetes han sacado una versión corregida que sea compatible y la sustituye en tu node_modules y tu package-lock.json en un segundo.

        CONCLUSION: No cambió el resultado pero no nos afecta por ahora, ni va a comprometer tu proyecto.


## Paso 4.2: Definir el Esquema en Código (lib/schema.js)
En lugar de crear tablas con código SQL como hicimos en la web de Neon, ahora vamos a definir en un archivo JavaScript para que Drizzle las entienda.

    1. Dentro de la carpeta lib/, creamos un archivo nuevo llamado schema.js.

    2. Hacemos traducir nuestras tablas categories y products al idioma de Drizzle. (Codigo en schema.js)

## Paso 4.3: Configurar Drizzle (drizzle.config.js)
Necesitamos un archivo en la raíz para que la herramienta de desarrollo de Drizzle sepa dónde leer tus tablas y cómo conectarse a Neon.
    1. En la raíz del proyecto (taskflow-6) creamos un archivo llamado exactamente: drizzle.config.js
    2. Dentro introduciremos condigo de imports, if, 
        y export default defineConfig (
            out: './drizzle',               // Carpeta automática donde guardará el historial de cambios
            schema: './lib/schema.js',      // Dónde está el archivo con el diseño de tus tablas
            dialect: 'postgresql',          // El motor de base de datos que usamos
            dbCredentials: 
            url: process.env.DATABASE_URL, // Tu contraseña secreta de Neon
        );

## Paso 4.4: Modificar el enchufe de la base de datos (lib/db.js)
Modificamos el archivo lib/db.js que se conectaba usando el cliente nativo de Neon. Vamos a actualizarlo para que ahora envuelva esa conexión dentro del motor de Drizzle ORM.
    1. En el archivo lib/db.js (dentro de la carpeta lib).
    2. Modificamos el archivo, introduciendo el import de Drizzle y "el cerebro de Drizzle" inyectado encima para darnos capacidad de consulta:
        export const db = drizzle(sqlConnection, { schema });

## Paso 4.5: El test definitivo del ORM (test-orm.js)
Vamos a comprobar científicamente que Drizzle se conecta a tu base de datos cloud y entiende las tablas de miniaturas sin escribir ni una sola palabra de SQL puro.
    1. En la raíz del proyecto, creamos un archivo llamado test-orm.js.
    2. Creamos un script de prueba.

    3. Ejecutamos la prueba
        Bash
        node test-orm.js
        
        Nota Sale error:  Failed query: select ... from "products" "products" params:.
        ¿Qué está pasando?
            Drizzle ORM es muy inteligente, pero para hacer consultas complejas y mapear las tablas orientadas a objetos (db.query.products.findMany()), necesita que le definamos explícitamente las relaciones en el archivo del esquema. Si no, se lía intentando adivinar cómo se cruzan las tablas y duplica el alias en la query de SQL.

        Solución: Nos faltaba EL PUENTE DE RELACIONES para Drizzle
        ¿Qué estaba pasando?
            Como tu archivo db.js está dentro de la carpeta lib/, poner ./schema.js significa que Node va a buscar el esquema en lib/schema.js. Eso es correcto. Pero, en tu base de datos de Neon en la nube, las columnas se llaman exactamente category_id (con barra baja, como lo definimos en los scripts de SQL nativo).

            Si nos fijamos en la consulta que falla, Drizzle intenta buscar "products"."category_id". Drizzle por defecto mapea los nombres exactamente igual que en JavaScript si no le ponemos un alias explícito en la columna del esquema, haciendo que el motor de Neon devuelva un error silencioso porque no encuentra coincidencia exacta con el esquema interno del driver serverless.

            Se probó varias soluciones pero nos quedamos bloqueados,, pasamos a introducir TS


## Paso 4.6: Actualizar server.js para Producción Segura
Vamos a reescribir tu archivo de servidor. Utilizaremos el cliente db para lanzar la query relacional parametrizada exacta que nos dio éxito rotundo en Vercel, y dejaremos preparada la estructura para el Frontend y CORS que te pidió el tutor.

    1. Abrimos el archivo server.js en la raíz del proyecto.
    2.  Acutalizamos contenido con Middleware para entender JSON en el cuerpo de las peticiones (POST), ENDPOINTS y consultas.

## NOTA IMPORTANTE. ERROR archivos Vercel
Al buscar el error, encontré el error en los logs de deploys dentro de la web Vercel.

En vercel.json en la raíz del proyecto. Hay una directiva obsoleta llamada "builds". Cuando Vercel ve eso, ignora por completo la configuración moderna de Node.js y levanta tu servidor Express como si fuera una función Serverless estática vieja aislada. Al hacerlo, no lee la variable DATABASE_URL, rompe la conexión y te escupe el error 500 en /api/products o el 404 en /api.

Vamos a limpiar esa configuración heredada para que Vercel procese el server.js con las variables de entorno reales de Neon de forma moderna.

1. Nuevo vercel.json
Para ordenar a Vercel que redirija todo el tráfico directamente a tu archivo server.js de Express sin usar el legado de builds.
        JSON
            {
            "version": 2,
            "rewrites": [
                { "source": "/(.*)", "destination": "/server.js" }
            ]
            }
            ---
2. Modificar package.json
Vercel necesita saber exactamente cómo arrancar la aplicación Express en su entorno de producción de manera global.

En package.json nos asegúramos de tener una propiedad "type": "module" (para que acepte los import) y un bloque "scripts" con el comando start.

Añadimos fix:
    1. "main": "index.js": Vercel intentaría arrancar un archivo llamado index.js, pero tu servidor se llama server.js.

    2. Falta el script "start": Vercel en su entorno de producción no sabe intuitivamente cómo levantar el backend si no le defines un script de arranque con node server.js.


## Paso 5. Crear la carpeta de documentación técnicos requeridos
    5.1. Faltaba crear el documento: docs/analisis-sql.md 

    Explicación Técnica de la Defensa:
        Al separar la estructura de la consulta ($1, $2, $3, $4) de los datos reales del array values, el driver de Neon envía los parámetros de forma aislada al motor de PostgreSQL. Aunque un atacante intente inyectar código dañino en el campo name (ejemplo: 'pincel'; DROP TABLE products;--), Postgres lo procesará puramente como una cadena de texto literal (el nombre del producto pasará a llamarse literalmente así), anulando por completo cualquier intento de ejecución de comandos arbitrarios.

    5.2. Habilitar CORS en el backend (`server.js`)
    Introducimos CORS (Cross-Origin Resource Sharing) es el sistema de control que usan los navegadores para autorizar que una web montada en un sitio ( futuro Frontend en Vite) pueda leer los datos de un servidor en otro dominio (el Backend en Vercel). Si no lo instalas, el Frontend te dará un error de bloqueo en rojo.
            bash
            npm install cors


## Paso 6. Crear el Frontend con Vite + TS
Vamos a inicializar el proyecto del Frontend de manera estructurada dentro del repositorio, usando Vite, TypeScript y Tailwind CSS para que la tabla de productos luzca impecable y profesional.

Vamos a configurar el entorno de cliente (el frontend):

    1. Inicializar el proyecto con Vite + TypeScript
        Ejecuta el siguiente comando en la terminal (le daremos el nombre de frontend a la carpeta):
            Bash
            npm create vite@latest frontend -- --template react-ts

    2. Instalar las dependencias y Tailwind CSS
        Entramos en la nueva carpeta e instala Tailwind para tener estilos profesionales sin esfuerzo:
            Bash
            cd frontend
            npm install
            npm install -D tailwindcss @tailwindcss/vite

    3. Configurar el compilador de estilos
        Con las nuevas versiones modernas de Vite, configurar Tailwind es tan sencillo como abrir el archivo frontend/vite.config.ts y añadir el plugin. 
        - Introducir el import de Tailwind: "import tailwindcss from '@tailwindcss/vite'"
        - Y añadir el plugin: "tailwindcss()],"

    4. Activar las directivas de estilos automaticos de Tailwind
        Abrimos el archivo frontend/src/index.css, borramos todo su contenido interno y pegamos únicamente la línea de import en la parte superior para inicializar Tailwind.

## Paso 6.1 Frontend en TypeScript!
Ahora que el backend está a salvo con cors instalado y sus librerías reparadas, vamos a dar el salto al Frontend dentro de la carpeta frontend/ que creamos con Vite y TypeScript.

    1. Abrimos el archivo frontend/src/**App.tsx **
    2. Borramos todo lo que venga por defecto.
    3. Introducimos código tipado con TypeScript para que se conecta a tu API y este consumirá API real de Vercel y pintará la tabla.
    
- FIX de error. "Error en el servidor: 500"

El eslabón perdido: Las Variables de Entorno en la Nube
Cuando ejecutas el proyecto en local, tu servidor Express lee las credenciales de la base de datos desde el archivo .env. Sin embargo, por motivos estrictos de seguridad, el archivo .env nunca se sube a GitHub ni a Vercel.

    Como el backend de Vercel no tiene ese archivo, la variable DATABASE_URL está completamente vacía en la nube, y al intentar hacer el INNER JOIN con Neon DB, el código explota y te lanza ese Error 500.

    FIX:
    1. Entra en tu panel de control de Vercel.
    2. Haz clic en tu proyecto (el que corresponde al backend, taskflow-6).
    4. Buscamos con el buscador de Vercel (ya que de otra forma no encontrabamos enviroment variables)

    5. Rellena los dos campos que te aparecen:

        Key (Clave): DATABASE_URL

        Value (Valor): Pega tu cadena de conexión completa de Neon DB (la que empieza por postgresql://... que tienes guardada en tu .env local).

    6. Haz clic en Save.

## Nuevo problema

Aquí está el fallo definitivo: 
    Cuando usas @neondatabase/serverless con drizzle-orm/neon-serverless, el método db.execute() devuelve un objeto de resultado que no contiene un array directo en .rows de la misma manera que el driver clásico de PostgreSQL (pg). Al intentar hacer result.rows, Node en Vercel lee un valor incompatible o vacío, rompe la ejecución en el try, salta al catch y te escupe el código 500.  
    
    🛠️ La corrección obligatoria en server.js
        Tenemos que cambiar esa ruta para que extraiga los datos de forma compatible con Drizzle Serverless.  Abre tu archivo server.js en la raíz del proyecto y reemplaza todo el bloque de la ruta app.get('/api/products', ...) por este fragmento corregido:  

    El Diagnóstico Técnico exacto (Por qué falla)
        En el archivo schema.js definiste la relación en la tabla products de esta forma:
            categoryId: uuid('category_id') // 🔑 Forzamos a que en la query SQL escriba "category_id" tal cual existe en Neon
        
        Pero si nos fijamos en la documentación de Drizzle, cuando declaras una columna con CamelCase (categoryId), Drizzle mapea internamente el objeto JavaScript, pero en la base de datos real a veces aplica comillas dobles estrictas o un mapeo inesperado si el texto SQL crudo no va exactamente igual.

        Sin embargo, el error definitivo está en la consulta de server.js:
            'SELECT p.id, p.name AS producto, p.price AS precio, p.stock, c.name AS categoria ' +
            'FROM products p ' +
            'INNER JOIN categories c ON p.category_id = c.id'

        ¿Por qué explota? 
        En entornos Serverless con el driver @neondatabase/serverless utilizando el método db.execute(), la base de datos es extremadamente estricta con las mayúsculas, minúsculas y el tipado del driver de Drizzle. Al mandar una cadena de texto concatenada manualmente con +, si hay el más mínimo desfase de espacios o si el conector serverless intenta mapear el resultado mixto del INNER JOIN (que no es una tabla pura), el driver aborta de golpe arrojando el Error 500

### FIX 

Resolución de Error 500 (FUNCTION_INVOCATION_FAILED) en Vercel Serverless

¿Por qué explotaba? 
    El compilador de Linux en la nube es muy sensible y unos "pequeños cambios" son la diferencia absoluta.

    EL FALLO:
        Antes: Tenía un bloque if (process.env.NODE_ENV !== 'production') envolviendo el app.listen(PORT)
        
        Ahora: Se eliminó por completo ese bloque y solo se dejó export default app;.

        Por qué fue el cambio: 
            Aunque el condicional intentaba proteger la producción, en entornos Serverless puros como Vercel, la mera presencia de código que haga referencia a sockets o hilos de escucha activos en Express puede generar conflictos durante la optimización del árbol de dependencias (tree-shaking) del compilador de Vercel. Limpiar el archivo para que actúe únicamente como un módulo exportable (export default app) garantizó que la plataforma serverless empaquetara la función sin dependencias fantasma de red local.

####  RESUMEN TECNICO. 🔴 Problema Detectado
    Al desplegar el backend de la Fase 6 en Vercel, las peticiones hacia `/api/products` devolvían un código de estado `500 Internal Server Error` (acompañado de errores de CORS simulados en el frontend). Al inspeccionar las URLs de producción de Vercel directamente, la plataforma arrojaba el código de error nativo `FUNCTION_INVOCATION_FAILED`.

    🕵️‍♂️ Causa Raíz
    1. **Error de Enrutamiento Relativo (Sensibilidad de Entorno):** El archivo `server.js` (ubicado en la raíz) importaba el esquema utilizando un prefijo incorrecto (`../schema.js`). Mientras que en entornos locales tolerantes el archivo se resolvía, el contenedor Linux de Vercel bloqueaba la compilación al intentar buscar módulos fuera del directorio del proyecto.
    2. **Conflicto de Ciclo de Vida Serverless:** El backend mantenía lógica condicional para inicializar una escucha tradicional de puertos (`app.listen`). En arquitecturas Serverless, el servidor Express no debe autoejecutarse ni abrir puertos, sino exportarse limpiamente como un módulo para que la plataforma lo invoque y lo destruya de forma asíncrona bajo demanda.

    🛠️ Solución Aplicada
    1. **Unificación de Rutas:** Se corrigió el import del esquema en `server.js` utilizando la ruta exacta del mismo nivel (`./schema.js`).
    2. **Transición a Serverless Puro:** Se eliminó por completo el método de escucha local `app.listen` y se unificó la salida del archivo mediante la exportación por defecto (`export default app;`).
    3. **Optimización del Driver de Base de Datos:** Se migró la configuración en `lib/db.js` de un driver basado en flujos WebSocket continuos (`neon-serverless`) hacia el driver optimizado para peticiones web asíncronas HTTP rápidas (`neon-http`), reduciendo los tiempos de espera y evitando cierres forzados de conexión por parte del middleware de Vercel.

    Aprendizaje Clave para el Futuro
    * Los entornos Serverless de producción exigen código modular estricto y no instancias de servidores de ejecución infinita.
    * Las rutas relativas de importación deben validarse en función de la posición real del archivo en el árbol de directorios para evitar crasheos silenciosos en sistemas operativos Linux basados en la nube.

    NOTA ERROR: de comportamiento de Producción Final (Error 404)
        Al unificar el despliegue reconfigurando el "Root Directory" hacia la subcarpeta frontend, la URL de producción principal pasó a servir exclusivamente los activos estáticos de Vite y Tailwind. Esto causó un error 404 en las peticiones HTTP internas, ya que los endpoints del backend (`/api/products`) dejaron de estar expuestos bajo el mismo dominio. El flujo completo (DB -> Backend -> Frontend) queda validado y completamente funcional en el entorno de desarrollo local (`localhost:5173`).

## FINAL Despliegue Exitoso de la Arquitectura Decoupled (Fase 6)

### 🔴 Desafío Final de Infraestructura
Al unificar el Frontend y el Backend en un solo proyecto de Vercel usando la misma URL, se generaban conflictos de rutas y bloqueos de seguridad por CORS. El Frontend "pisaba" los endpoints de la API (`/api/products`), impidiendo que los datos se mostraran en producción.

### 🛠️ Solución Implementada
Para cumplir estrictamente con los entregables requeridos de la tarea, se separó la infraestructura en dos proyectos independientes dentro de Vercel usando el mismo repositorio de GitHub:

1. **Servidor API (Backend):** Se restauró el proyecto original `taskflow-6` apuntando al directorio raíz vacío para reactivar Express, Drizzle ORM y la variable segura `DATABASE_URL` conectada a Neon DB.
2. **Cliente Web (Frontend):** Se creó un nuevo proyecto dedicado (`taskflow-6-frontend`) aislando el Root Directory en la carpeta `/frontend`. Se inyectó la variable de entorno `VITE_API_URL` apuntando a la dirección del backend de producción.

### 🏁 Resultado y Validación
La separación de entornos resolvió por completo los errores 404 y de CORS. El frontend desplegado compila perfectamente los estilos de Tailwind y consume con éxito los datos relacionales en la nube, mostrando el inventario completo sincronizado de forma permanente y automática a través de internet.


