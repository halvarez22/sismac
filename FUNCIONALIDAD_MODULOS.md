# Manual de Funcionalidad por Módulo de SISMAC

Este documento describe en detalle el propósito, las funcionalidades clave y los flujos de trabajo de cada módulo dentro del sistema SISMAC.

---

## 1. Dashboard Gerencial

-   **Propósito:** Proporcionar a la alta dirección una vista consolidada y estratégica del rendimiento del negocio.
-   **Funcionalidades Clave:**
    -   **KPIs Principales:** Visualización de métricas críticas como Ingresos, Ahorro por IA, Costo por Par, Índice de Desperdicio, Rotación de Inventario, Valor Total del Inventario y Número de Modelos Activos.
    -   **Perspectivas de IA Detalladas:** Panel inteligente que muestra análisis avanzados y recomendaciones generadas por IA sobre:
        -   **Oportunidades de Ahorro:** Optimizaciones identificadas en costos de materiales y procesos.
        -   **Riesgos de Suministro:** Alertas sobre posibles problemas en la cadena de suministro.
        -   **Mejoras Operativas:** Sugerencias para optimizar procesos de producción y logística.
        -   **Análisis Predictivo:** Pronósticos de demanda y tendencias de mercado.
        -   **Optimización de Inventario:** Recomendaciones sobre niveles de stock y rotación.
    -   **Monitoreo de Riesgos:** Alertas predictivas sobre posibles problemas en la cadena de suministro (ej. congestión portuaria, volatilidad de precios, escasez de materiales) con sugerencias específicas de mitigación.
    -   **Gráficos de Rendimiento:** Visualización avanzada de tendencias históricas y pronósticos de ventas, costos, desperdicio y eficiencia operativa.
    -   **Rendimiento de Proveedores:** Tabla comparativa detallada del desempeño de proveedores clave con métricas de puntualidad, calidad y costo.
    -   **Exportación de Datos:** Permite descargar un resumen ejecutivo completo del dashboard en formato CSV para análisis externos.

---

## 2. Módulo de Ingeniería

-   **Propósito:** Gestionar la información maestra de los productos. Es el corazón donde se define "qué se va a fabricar".
-   **Funcionalidades Clave:**
    -   **Gestión Completa de Fichas Técnicas (CRUD):** Crear, ver, editar y eliminar modelos de producto (calzado) con confirmación de eliminación.
    -   **Bill of Materials (BOM):** Para cada modelo, se define la lista exacta de materiales requeridos y la cantidad necesaria por cada par de zapatos.
    -   **Carga Automática de BOM Vazza:** Importación inteligente de archivos Excel VAZZA con parsing automático, validación de datos y filtrado inteligente de fechas, códigos administrativos y texto no válido.
    -   **Selector de Material Inteligente:** Un campo de búsqueda autocompletable que facilita la selección de materiales desde el inventario existente, mostrando nombre y SKU para evitar errores.
    -   **Validación Inteligente de Materiales:** Sistema automático que filtra y descarta fechas (MM/DD/YY, DD/MM/YY), códigos administrativos (KARLA, CSC, NOM 020), palabras clave administrativas (CLIENTE:, FECHA, PEDIDO), texto muy corto, códigos numéricos puros y códigos técnicos.
    -   **Sugerencia de Sustitutos con IA:** Junto a cada material del BOM, un botón de IA permite solicitar alternativas. El sistema analiza el inventario actual y sugiere sustitutos viables, calculando y mostrando el impacto exacto en el costo por par. Esto aumenta la agilidad ante escasez o volatilidad de precios.

---

## 3. Módulo de Planificación

-   **Propósito:** Orquestar la producción de la fábrica, asegurando que se cuente con los recursos necesarios.
-   **Funcionalidades Clave:**
    -   **Gestión de Órdenes de Producción (OP):** Crear y editar órdenes, especificando el modelo, la cantidad y la fecha de entrega requerida.
    -   **Cálculo Automático de BOM:** Al crear una OP, el sistema calcula automáticamente la lista y cantidad total de materiales necesarios basándose en la Ficha Técnica del modelo.
    -   **Validación de Inventario en Tiempo Real:** El sistema verifica instantáneamente si hay suficiente stock para cumplir con la OP.
        -   Si hay déficit, muestra una alerta detallada con los materiales faltantes.
    -   **Generación de Sugerencias de Compra:** Desde la alerta de déficit, el planificador puede:
        -   **Generar Sugerencias y Guardar:** El sistema crea automáticamente las solicitudes de compra en el módulo de Abastecimiento y guarda la OP.
        -   **Guardar de Todos Modos:** Permite registrar la OP para planificación futura, manteniendo la visibilidad de la demanda.

---

## 4. Módulo de Abastecimiento

-   **Propósito:** Gestionar el proceso de compras, desde la necesidad hasta la orden de compra.
-   **Funcionalidades Clave:**
    -   **Bandeja de Sugerencias (MRP):** Muestra las necesidades de material generadas automáticamente desde el módulo de Planificación, con cálculo preciso de cantidades requeridas por modelo y fecha de entrega.
    -   **Creación de Órdenes de Compra (OC):** Permite convertir una sugerencia en una OC con un solo clic o crear OCs desde cero con selección inteligente de proveedores.
    -   **Inteligencia de Costos Avanzada (IA):** Sistema inteligente que monitorea y alerta sobre costos:
        -   **Alertas Automáticas:** Detecta cuando un costo unitario excede significativamente el histórico del proveedor o material (+20% del promedio).
        -   **Análisis Comparativo:** Muestra costos históricos, precios de mercado y sugerencias de optimización.
        -   **Prevención de Sobrecostos:** Requiere confirmación explícita para precios elevados, previniendo compras impulsivas.
        -   **Recomendaciones IA:** Sugiere proveedores alternativos con mejores precios o condiciones.
    -   **Seguimiento Avanzado de Órdenes:** Permite visualizar y filtrar todas las OCs por múltiples criterios:
        -   **Estados:** Borrador, Enviada, Recibida, Cancelada, En Revisión.
        -   **Proveedores:** Historial completo por proveedor con métricas de desempeño.
        -   **Materiales:** Seguimiento por tipo de material y categoría.
        -   **Fechas:** Rango de fechas con indicadores de puntualidad.

---

## 5. Módulo de Almacén

-   **Propósito:** Mantener un control preciso y en tiempo real del inventario de materiales.
-   **Funcionalidades Clave:**
    -   **Dashboard de Inventario Avanzado:** KPIs completos incluyendo:
        -   **Valor Total del Inventario:** Costo total de todos los materiales en stock.
        -   **Ocupación y Eficiencia:** Porcentaje de capacidad utilizada y métricas de rotación.
        -   **Alertas Inteligentes:** Stock bajo, crítico, exceso y lento movimiento.
        -   **Distribución por Categorías:** Análisis de inventario por tipo de material (Textiles, Químicos, Suelas, etc.).
    -   **Gestión Completa de Materiales:** Tabla interactiva con funcionalidades avanzadas:
        -   **Filtros Inteligentes:** Por categoría, estado, proveedor y rango de precios.
        -   **Ordenamiento Dinámico:** Por nombre, stock, valor, fecha de último movimiento.
        -   **Búsqueda Avanzada:** Autocompletado con SKU y nombre de material.
        -   **Adición de Nuevos Materiales:** Formulario completo con validación de datos.
    -   **Registro de Movimientos Completo:** Modal inteligente para todas las operaciones:
        -   **Entradas:** Recepción de órdenes de compra con verificación automática.
        -   **Salidas:** Entrega a producción con cálculo de consumo por modelo.
        -   **Ajustes:** Merma, correcciones y regularizaciones con justificación obligatoria.
        -   **Transferencias:** Movimientos entre ubicaciones con trazabilidad completa.
        -   **Actualización Automática:** Recálculo inmediato de valores y estados.
    -   **Análisis de Inventario con IA:** Visualizaciones avanzadas y análisis inteligente:
        -   **Gráficos Interactivos:** Distribución por estado (OK, Bajo, Crítico, Exceso) con drill-down.
        -   **Análisis de Rotación:** Métricas ABC de inventario por categoría y material.
        -   **Tendencias Históricas:** Evolución del inventario por períodos.
    -   **Perspectivas de IA Avanzadas:** Sistema de análisis predictivo que identifica:
        -   **Material de Lento Movimiento:** Capital inmovilizado con recomendaciones de desinversión.
        -   **Artículos en Estado Crítico:** Alertas preventivas que podrían detener la producción.
        -   **Patrones de Consumo:** Predicciones de demanda basadas en histórico.
        -   **Optimización de Niveles:** Sugerencias automáticas de puntos de reorden.
        -   **Análisis de Proveedores:** Rendimiento por proveedor y recomendaciones de diversificación.

---

## 6. Módulo de Contabilidad

-   **Propósito:** Ofrecer una visión general de la salud financiera de la empresa.
-   **Funcionalidades Clave:**
    -   **Gestión de Facturas:** Tabla para visualizar y filtrar cuentas por cobrar y por pagar, con indicadores de estado (Pendiente, Pagada, Vencida).
    -   **KPIs Financieros:** Métricas clave como flujo de caja neto y margen de beneficio.
    -   **Análisis de Rendimiento:** Gráficos que muestran la evolución mensual de ingresos, gastos y beneficios.
    -   **Distribución de Gastos:** Gráfico de pastel que desglosa los gastos por categoría (materia prima, nómina, etc.).

---

## 7. Módulo de Administración

-   **Propósito:** Gestionar la seguridad y el acceso al sistema.
-   **Funcionalidades Clave:**
    -   **Gestión de Usuarios:** Permite a los administradores crear, editar y eliminar perfiles de usuario.
    -   **Asignación de Roles:** Asigna roles específicos (Gerente, Comprador, Planificador, etc.) a cada usuario para controlar su nivel de acceso.
    -   **Control de Estado:** Permite activar o desactivar cuentas de usuario.

---

## 8. SISMAC Copilot (Asistente de IA Avanzado)

-   **Propósito:** Democratizar el acceso a los datos y acelerar la obtención de respuestas a través de una interfaz conversacional inteligente.
-   **Funcionalidades Clave:**
    -   **Acceso Universal:** Se accede a través de un botón de acción flotante (FAB) disponible en todas las pantallas principales del sistema, con indicador visual de disponibilidad.
    -   **Interfaz de Chat Avanzada:** Modal de chat intuitivo con funcionalidades premium:
        -   **Entrada Multilínea:** Soporte para preguntas complejas y consultas detalladas.
        -   **Historial de Conversación:** Mantiene el contexto de la conversación para consultas relacionadas.
        -   **Sugerencias Automáticas:** Propone preguntas comunes basadas en el módulo actual.
    -   **Conocimiento en Tiempo Real Completo:** Recibe contexto actualizado de todos los módulos:
        -   **Inventario:** Stocks, precios, proveedores y estados en tiempo real.
        -   **Órdenes de Producción:** Estados, cantidades, modelos y fechas de entrega.
        -   **Órdenes de Compra:** Historial, proveedores y estados de aprobación.
        -   **Modelos de Producto:** BOM completo, costos y especificaciones técnicas.
        -   **Usuarios y Roles:** Información contextual según el perfil del usuario.
    -   **Capacidad de Análisis Avanzada:** Responde a múltiples tipos de consultas:
        -   **Preguntas Directas:** "¿Cuál es el stock de Piel Nappa Negra?"
        -   **Cálculos Complejos:** "¿Cuál es el costo total de producción del modelo X?"
        -   **Análisis Comparativo:** "¿Qué proveedor tiene los mejores precios para telas?"
        -   **Consultas Cruzadas:** "¿Qué órdenes de producción necesitan material del proveedor X?"
        -   **Recomendaciones:** "¿Qué materiales puedo usar como sustituto del Y?"
        -   **Predicciones:** "¿Cuánto material necesito para producir Z pares?"
    -   **Respuestas en Streaming Inteligente:** Experiencia de conversación natural con:
        -   **Texto Progresivo:** Las respuestas aparecen en tiempo real para mayor fluidez.
        -   **Formato Estructurado:** Tablas, listas y resaltados para mejor legibilidad.
        -   **Enlaces Interactivos:** Permite navegar directamente a registros específicos.
        -   **Cálculos Transparente:** Muestra la metodología de cálculo cuando aplica.
    -   **Modo Demo Inteligente:** Cuando la API de IA no está configurada, proporciona respuestas de ejemplo realistas con datos simulados para demostrar funcionalidades.

---

## 9. NUEVAS FUNCIONALIDADES IMPLEMENTADAS

### **Mejoras Recientes al Sistema SISMAC:**

-   **Carga Automática de BOM VAZZA:** Sistema inteligente de importación de archivos Excel con parsing automático y validación avanzada.
-   **Validación Inteligente de Materiales:** Filtro automático que descarta fechas, códigos administrativos y texto no válido durante la carga de BOM.
-   **Funcionalidades CRUD Completas:** Crear, leer, actualizar y eliminar modelos de producto con confirmación de seguridad.
-   **Alertas de Costos con IA:** Sistema que detecta precios elevados en órdenes de compra y sugiere optimizaciones.
-   **Análisis Predictivo de Inventario:** IA que identifica patrones de consumo y sugiere niveles óptimos de stock.
-   **Dashboard Ejecutivo Mejorado:** KPIs adicionales y perspectivas de IA más detalladas.
-   **Copilot de IA Avanzado:** Interfaz conversacional con capacidades de análisis cruzado entre módulos.

### **Notas de Seguridad y Acceso:**
-   **Control de Roles Estrictos:** Cada usuario tiene acceso únicamente a los módulos autorizados según su rol.
-   **Persistencia Automática:** Todos los datos se guardan automáticamente en localStorage del navegador.
-   **Validación de Datos:** El sistema valida toda la información antes de guardarla.
-   **Copias de Seguridad:** Los datos críticos se respaldan automáticamente.

### **Recomendaciones de Uso:**
1.  **Inicio de Sesión:** Use las credenciales específicas de cada rol para probar funcionalidades.
2.  **Navegación:** El menú lateral se adapta automáticamente según el rol del usuario.
3.  **Copilot:** Disponible en todas las pantallas para consultas inteligentes.
4.  **Datos de Prueba:** El sistema incluye datos de ejemplo del modelo VAZZA 13501 BLANCO.
5.  **Soporte:** En caso de problemas, revise la consola del navegador (F12) para logs detallados.