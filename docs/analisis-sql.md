# Análisis de Consultas Relacionales (SQL Avanzado)

## Diferencia Funcional: INNER JOIN vs LEFT JOIN

### 1. INNER JOIN (Cruce Estricto)
* **Definición:** Devuelve registros únicamente cuando existe una coincidencia matemática exacta en ambas tablas unidas por la condición del `ON`.
* **Escenario del Mundo Real:** El listado del catálogo público de la tienda. Solo queremos mostrar productos que ya estén completamente clasificados y listos para la venta con una categoría asignada. Si un producto no tiene categoría válida, queda excluido para evitar errores visuales en el escaparate.

### 2. LEFT JOIN (Inclusión de la Izquierda)
* **Definición:** Devuelve absolutamente todas las filas de la tabla izquierda (`FROM`), y acopla los datos de la derecha si coinciden. Si no hay correspondencia, rellena los campos de la derecha con valores `NULL`.
* **Escenario del Mundo Real:** Un reporte de auditoría de inventario por categorías. Queremos listar **todas** las categorías registradas en el sistema (por ejemplo, "Herramientas de Escenografía"), incluso aquellas que acabamos de crear y todavía no tienen ningún producto asignado en stock, mostrando un conteo de 0.