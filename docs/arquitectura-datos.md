# Arquitectura de Datos - Learning Inventory

## 1. Significado de `category_id` como Foreign Key
La columna `category_id` en la tabla `products` actúa como una **Clave Foránea (Foreign Key)**. Esto significa que es un campo relacional cuyo valor está estrictamente vinculado al `id` (Primary Key) de la tabla `categories`. 

Su función principal es garantizar la **integridad referencial**: el motor de la base de datos impedirá que se inserte un producto con un `category_id` que no exista previamente en la tabla de categorías.

## 2. Análisis de Borrado: ON DELETE CASCADE vs ON DELETE RESTRICT

Para un inventario de productos, el comportamiento más seguro y correcto es **ON DELETE RESTRICT**.

### Diferencias fundamentales:
* **ON DELETE CASCADE:** Si eliminas una categoría (por ejemplo, "Electrónica"), el motor borrará automáticamente de forma masiva todos los productos asociados a ella.
* **ON DELETE RESTRICT:** Si intentas eliminar una categoría que aún tiene productos asociados, el motor bloqueará la operación y lanzará un error, impidiendo el borrado.

### Justificación de seguridad:
En un sistema de inventario real, usar `CASCADE` es extremadamente peligroso. Si un administrador borra una categoría por error, podría destruir miles de registros de productos, alterando el stock, el histórico de inventario y provocando una pérdida catastrófica de datos operativos. 

Al usar `RESTRICT`, obligamos al sistema a vaciar o reasignar primero esos productos a otra categoría de forma consciente antes de permitir la eliminación de la categoría padre.