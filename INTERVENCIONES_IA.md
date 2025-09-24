# Catálogo de Intervenciones de Inteligencia Artificial en SISMAC

Este documento detalla todas las funcionalidades dentro del sistema SISMAC que son impulsadas por Inteligencia Artificial (IA), utilizando la API de Google Gemini. Cada intervención está diseñada para transformar datos en decisiones estratégicas, optimizar costos y mitigar riesgos.

---

### 1. SISMAC Copilot: Asistente Conversacional

-   **Módulo:** Global (Toda la aplicación)
-   **Componente:** `Copilot.tsx`
-   **Objetivo:** Democratizar el acceso a los datos, permitiendo a cualquier usuario obtener respuestas complejas de forma instantánea mediante lenguaje natural, sin necesidad de navegar por múltiples pantallas o filtros.
-   **Funcionamiento:**
    1.  El usuario activa el Copilot a través de un botón de acción flotante (FAB).
    2.  Al enviar una pregunta, el sistema recopila el **estado completo y actual de la aplicación** (inventarios, órdenes de compra, órdenes de producción, usuarios, etc.).
    3.  Este masivo objeto de datos se envía como **contexto** junto con la pregunta del usuario al modelo `gemini-2.5-flash` a través de una sesión de chat.
    4.  El *prompt* del sistema instruye a la IA para que actúe como un analista experto y base sus respuestas **exclusivamente** en los datos proporcionados.
    5.  La respuesta se recibe en modo *streaming*, mostrando el texto en tiempo real en la interfaz de chat para una experiencia de usuario fluida.
-   **Impacto:** Transforma radicalmente la interacción con el ERP. Pasa de ser un sistema donde se buscan datos a un sistema con el que se **conversa** sobre los datos, aumentando la velocidad y la eficiencia en la toma de decisiones.

---

### 2. Ingeniería: Sugerencia de Materiales Sustitutos

-   **Módulo:** Ingeniería
-   **Componente:** `ProductModelModal.tsx`, `SubstituteSuggestionsModal.tsx`
-   **Objetivo:** Aumentar la agilidad y resiliencia de la cadena de suministro, permitiendo a los ingenieros reaccionar rápidamente a la escasez de materiales o a la volatilidad de precios.
-   **Funcionamiento:**
    1.  En la edición de una Ficha Técnica (BOM), el ingeniero hace clic en un botón de IA junto a un material específico.
    2.  El sistema envía a `gemini-2.5-flash` el material original y la **lista completa del inventario actual**.
    3.  El *prompt* instruye a la IA para que actúe como un ingeniero de materiales, buscando en el inventario alternativas viables basadas en categoría, nombre y características.
    4.  Se solicita a la IA que devuelva una respuesta JSON estructurada con: el SKU del sustituto, una justificación de la elección y el **cálculo del impacto en el costo por par**.
    5.  Las sugerencias se presentan en un modal, donde el ingeniero puede revisar el análisis y aplicar el cambio al BOM con un solo clic.
-   **Impacto:** Convierte la reingeniería de producto de un proceso lento y manual a una tarea rápida y asistida por datos, optimizando costos y evitando retrasos en producción.

---

### 3. Dashboard Gerencial: Perspectivas Estratégicas Clave

-   **Módulo:** Dashboard
-   **Componente:** `AiAnalytics.tsx`
-   **Objetivo:** Proporcionar a la alta dirección un resumen ejecutivo con análisis y recomendaciones que van más allá de los datos brutos.
-   **Funcionamiento:**
    1.  Al cargar el dashboard, el sistema recopila datos clave en tiempo real: rendimiento de proveedores (OTD, calidad), evolución del costo por par, alertas de riesgo activas, y datos de desperdicio.
    2.  Esta información se estructura en un *prompt* y se envía al modelo `gemini-2.5-flash`.
    3.  La IA analiza las correlaciones, tendencias y anomalías en los datos.
    4.  El modelo devuelve 3 insights concisos y accionables, clasificados por categoría (Ahorro de Costos, Predicción de Riesgos, Eficiencia Operativa), que se muestran en un panel dedicado.
-   **Impacto:** Convierte el dashboard de un simple monitor a un consejero estratégico, ayudando a los gerentes a enfocarse en lo que realmente importa.

---

### 4. Dashboard Gerencial: Monitoreo Predictivo de Riesgos

-   **Módulo:** Dashboard
-   **Componente:** `SupplierRiskAlerts.tsx`
-   **Objetivo:** Anticipar problemas en la cadena de suministro antes de que impacten la producción.
-   **Funcionamiento:**
    1.  Aunque en la versión actual los datos son simulados, la funcionalidad está diseñada para que la IA analice fuentes de datos externas (noticias, reportes logísticos, indicadores económicos) y datos internos (historial de proveedores).
    2.  La IA identifica eventos de riesgo (ej. congestión en un puerto, volatilidad de divisas, problemas geopolíticos) y su impacto potencial en proveedores específicos.
    3.  Para cada riesgo, genera una alerta que incluye: el proveedor afectado, el impacto esperado en métricas clave (ej. OTD, costo) y una serie de **sugerencias de mitigación** detalladas y priorizadas.
-   **Impacto:** Permite una gestión de riesgos proactiva en lugar de reactiva, dando tiempo a la empresa para prepararse y tomar contramedidas.

---

### 5. Abastecimiento: Inteligencia de Costos en Órdenes de Compra

-   **Módulo:** Abastecimiento
-   **Componente:** `CreatePurchaseOrderModal.tsx`
-   **Objetivo:** Prevenir sobrecostos y compras a precios no competitivos.
-   **Funcionamiento:**
    1.  Cuando un comprador está creando o editando una Orden de Compra (OC) e introduce el costo unitario de un material, se activa una validación inteligente.
    2.  El sistema (simulando una consulta a una base de datos de costos históricos) compara el precio ingresado con el costo promedio histórico para ese material.
    3.  Si el nuevo costo supera un umbral predefinido (ej. 15% por encima del promedio), la IA genera una **alerta contextual** junto al campo de costo.
    4.  La alerta informa al usuario sobre la desviación y le recomienda verificar el precio o negociar con el proveedor.
-   **Impacto:** Actúa como un asistente para el comprador, proporcionando un control de costos en tiempo real y fortaleciendo el poder de negociación.

---

### 6. Almacén: Optimización y Alertas de Inventario

-   **Módulo:** Almacén
-   **Componente:** `AiWarehouseInsights.tsx`
-   **Objetivo:** Mejorar la eficiencia del almacén, reducir el capital inmovilizado y prevenir roturas de stock.
-   **Funcionamiento:**
    1.  El sistema analiza continuamente el estado del inventario, enfocándose en la fecha del último movimiento y los niveles de stock en relación con los puntos de pedido (ROP).
    2.  La IA identifica y genera insights sobre:
        -   **Lento Movimiento:** Detecta materiales que no han rotado en un período prolongado (ej. 90 días) y calcula el valor del capital inmovilizado, sugiriendo acciones.
        -   **Riesgo de Rotura de Stock:** Identifica los materiales en estado "Crítico" con mayor valor o impacto en la producción y los prioriza como alertas de acción urgente.
        -   **Oportunidades de Optimización:** Puede sugerir ajustes en los puntos de pedido basándose en la rotación histórica de una categoría de productos.
-   **Impacto:** Ayuda al jefe de almacén a gestionar el inventario de manera más estratégica, enfocándose en los artículos que representan mayor riesgo u oportunidad.

---

### 7. Planificación: Generación de Sugerencias de Compra (MRP)

-   **Módulo:** Planificación
-   **Componente:** `Planificacion.tsx` y `ProductionOrderModal.tsx`
-   **Objetivo:** Automatizar y optimizar la respuesta a los déficits de material.
-   **Funcionamiento:**
    1.  Cuando un planificador crea una Orden de Producción (OP) y el sistema detecta un faltante de materiales, se activa el proceso.
    2.  El sistema calcula con precisión la cantidad de cada material que se necesita comprar.
    3.  La IA interviene para **recomendar el proveedor más adecuado** para cada material faltante. Esta recomendación se basa en un análisis del rendimiento histórico de los proveedores (OTD, calidad, costo), seleccionando al más óptimo.
    4.  Con un solo clic, se generan las "Sugerencias de Compra" que aparecen en el módulo de Abastecimiento, listas para ser convertidas en Órdenes de Compra.
-   **Impacto:** Conecta de forma inteligente la planificación con las compras, acelera el proceso de abastecimiento y asegura que las decisiones de compra se basen en datos de rendimiento.