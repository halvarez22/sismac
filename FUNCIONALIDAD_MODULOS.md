# Manual de Funcionalidad por Módulo de SISMAC

Este documento describe en detalle el propósito, las funcionalidades clave y los flujos de trabajo de cada módulo dentro del sistema SISMAC.

---

## 1. Dashboard Gerencial

-   **Propósito:** Proporcionar a la alta dirección una vista consolidada y estratégica del rendimiento del negocio.
-   **Funcionalidades Clave:**
    -   **KPIs Principales:** Visualización de métricas críticas como Ingresos, Ahorro por IA, Costo por Par, Índice de Desperdicio y Rotación de Inventario.
    -   **Perspectivas de IA:** Un panel que muestra análisis y recomendaciones generadas por IA sobre oportunidades de ahorro, riesgos y mejoras operativas.
    -   **Monitoreo de Riesgos:** Alertas predictivas sobre posibles problemas en la cadena de suministro (ej. congestión portuaria, volatilidad de precios) con sugerencias de mitigación.
    -   **Gráficos de Rendimiento:** Visualización de tendencias históricas y pronósticos de ventas, costos y desperdicio.
    -   **Rendimiento de Proveedores:** Tabla comparativa del desempeño de proveedores clave.
    -   **Exportación de Datos:** Permite descargar un resumen del dashboard en formato CSV.

---

## 2. Módulo de Ingeniería

-   **Propósito:** Gestionar la información maestra de los productos. Es el corazón donde se define "qué se va a fabricar".
-   **Funcionalidades Clave:**
    -   **Gestión de Fichas Técnicas:** Crear, ver y editar los modelos de producto (calzado).
    -   **Bill of Materials (BOM):** Para cada modelo, se define la lista exacta de materiales requeridos y la cantidad necesaria por cada par de zapatos.
    -   **Selector de Material Inteligente:** Un campo de búsqueda autocompletable que facilita la selección de materiales desde el inventario existente, mostrando nombre y SKU para evitar errores.
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
    -   **Bandeja de Sugerencias (MRP):** Muestra las necesidades de material generadas automáticamente desde el módulo de Planificación.
    -   **Creación de Órdenes de Compra (OC):** Permite convertir una sugerencia en una OC con un solo clic o crear OCs desde cero.
    -   **Inteligencia de Costos (IA):** Durante la creación de la OC, si se introduce un costo unitario significativamente mayor al histórico, el sistema muestra una alerta para prevenir sobrecostos.
    -   **Seguimiento de Órdenes:** Permite visualizar y filtrar todas las OCs por estado (Borrador, Enviada, Recibida, etc.), proveedor o material.

---

## 5. Módulo de Almacén

-   **Propósito:** Mantener un control preciso y en tiempo real del inventario de materiales.
-   **Funcionalidades Clave:**
    -   **Dashboard de Inventario:** KPIs sobre el valor total del inventario, ocupación y alertas de stock bajo.
    -   **Gestión de Materiales:** Tabla completa de todos los materiales con filtros y ordenamiento. Permite añadir nuevos materiales al catálogo.
    -   **Registro de Movimientos:** Un modal para registrar entradas (ej. recepción de OC), salidas (ej. entrega a producción) y ajustes (ej. merma), actualizando el stock automáticamente.
    -   **Análisis de Inventario:** Gráficos que muestran la distribución del stock por estado (OK, Bajo, Crítico, Exceso) y la rotación por categoría.
    -   **Perspectivas de IA:** El sistema analiza el inventario para identificar y alertar sobre:
        -   Material de lento movimiento (capital inmovilizado).
        -   Artículos en estado crítico que podrían detener la producción.

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

## 8. SISMAC Copilot (Asistente de IA)

-   **Propósito:** Democratizar el acceso a los datos y acelerar la obtención de respuestas a través de una interfaz conversacional.
-   **Funcionalidades Clave:**
    -   **Acceso Universal:** Se accede a través de un botón de acción flotante (FAB) disponible en todas las pantallas principales del sistema.
    -   **Interfaz de Chat:** Abre un modal de chat intuitivo donde los usuarios pueden escribir preguntas en lenguaje natural (español).
    -   **Conocimiento en Tiempo Real:** En cada pregunta, el Copilot recibe un contexto completo de los datos actuales de la aplicación (inventario, órdenes, usuarios, etc.) para formular respuestas precisas y relevantes.
    -   **Capacidad de Análisis:** Puede responder preguntas directas ("¿Cuál es el stock de Piel Nappa Negra?"), realizar cálculos ("¿Cuál es el valor total del inventario?") y conectar información entre módulos ("¿Qué órdenes de producción necesitan material del proveedor X?").
    -   **Respuestas en Streaming:** El texto de la respuesta aparece en tiempo real, creando una experiencia de conversación fluida y natural.