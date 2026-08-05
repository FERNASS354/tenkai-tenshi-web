# Reporte Oficial de Pruebas y Evidencias — Tenkai POS (v0.2.2+49)

## 1. Entorno de Hardware Evaluado
Todas las pruebas de rendimiento comparativo fueron ejecutadas en el mismo equipo y bajo las mismas condiciones de sistema operativo y almacenamiento:

- **Procesador**: AMD Ryzen 7 5700X
- **Memoria RAM**: 64 GB DDR4
- **Almacenamiento**: M.2 NVMe PCIe 4.0 (Velocidad de lectura/escritura de hasta ~7,300 MB/s)
- **Tarjeta Gráfica**: AMD Radeon RX 7800 XT

---

## 2. Tabla Oficial de Resultados Comparativos

| Métrica | Eleventa directo | Tenkai importando XLSX | Tenkai nativo sin existencias | Tenkai nativo con existencias |
|---|---:|---:|---:|---:|
| **Productos procesados** | 9,623 antes del colapso | 40,000 | 44,000 | 39,987 |
| **Tiempo registrado** | 11 min 17 s (747 s) | 2.3 min (138 s) | 14.6 s | 25.9 s |
| **Velocidad media** | 14 prod/s | 290 prod/s | 3,013 prod/s | 1,543 prod/s |
| **RAM inicial** | ~85 MB | ~85 MB | ~85 MB | 87.8 MB |
| **Pico de RAM** | 1,854 MB | ~257 MB | ~150 MB | 169.8 MB |
| **RAM después de carga** | ~250 MB | ~200 MB | ~109 MB | 105.9–107 MB |
| **RAM después de reinicio** | ~250 MB | 98 MB | 93–94 MB | ~98 MB |
| **Resultado** | Colapso y cierre | 100% procesado | 100% procesado | 100% procesado |
| **Historial generado** | Sin historial | Registro de importación | Movimiento general | Kardex individual |

---

## 3. Desglose Metodológico de los Escenarios

### Escenario 1: Eleventa ejecutando la importación directamente
- **Aplicación**: `Abarrotes.exe`.
- **Resultado**: Al intentar procesar 40,000 registros, la aplicación sufrió saturación de memoria alcanzando un pico de **1,854 MB de RAM** a los 11 minutos y 17 segundos, colapsando tras procesar solo 9,623 productos. Al reiniciar, conservó ~13,000 registros de forma inestable.

### Escenario 2: Tenkai POS importando un catálogo de Eleventa (.XLSX)
- **Resultado**: Tenkai POS procesó la totalidad de los 40,000 productos del archivo Excel de Eleventa en **138 segundos** (2.3 minutos), manteniendo la memoria RAM bajo control (pico de 257 MB y 98 MB fijos tras reiniciar).

### Escenario 3: Catálogo nativo de Tenkai POS sin existencias (.TKC)
- **Resultado**: Importación masiva de **44,000 productos** en formato nativo limpio en tan solo **14.6 segundos**, a una velocidad promedio de **3,013 productos por segundo** con un consumo pico de 150 MB de RAM.

### Escenario 4: Catálogo nativo de Tenkai POS con existencias y Kardex (.TKC)
- **Resultado**: Importación de **39,987 productos** generando el Kardex individual de inventario por cada uno en **25.9 segundos** (1,543 prod/s) con un consumo pico de **169.8 MB de RAM** y 105.9 MB fijos tras completar la operación.

---

## 4. Proceso de Evolución y Corrección de Bugs (v0.2.2+49)
Durante las primeras fases de desarrollo, las importaciones masivas generaban picos de memoria considerables. Mediante supervisión activa y pruebas de esfuerzo, se optimizaron las consultas de SQLite y Drift, liberando recursos en tiempo real. Los resultados publicados corresponden a la versión estable **v0.2.2+49** tras aplicar dichas correcciones.
