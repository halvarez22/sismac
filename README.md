# SISMAC: Sistema Inteligente de Suministro y Materiales para Calzado

## 1. Descripción General

SISMAC es una aplicación web integral de tipo ERP/MRP (Enterprise Resource Planning / Material Requirements Planning) diseñada específicamente para optimizar la cadena de suministro en la industria del calzado. El sistema centraliza la gestión de inventarios, planificación de la producción, abastecimiento y finanzas, potenciando la toma de decisiones a través de análisis y sugerencias generadas por inteligencia artificial.

El objetivo principal de SISMAC es proporcionar una visibilidad completa y en tiempo real de toda la operación, desde la ingeniería del producto hasta la contabilidad, permitiendo a las empresas ser más ágiles, reducir costos y minimizar riesgos en su cadena de suministro.

## 2. Módulos Principales

La aplicación se estructura en los siguientes módulos, cada uno enfocado en un área clave del negocio:

-   **Dashboard Gerencial:** Ofrece una vista de alto nivel con los KPIs (Key Performance Indicators) más importantes del negocio, alertas de riesgo, pronósticos de ventas y perspectivas estratégicas generadas por IA.
-   **Ingeniería:** Permite la gestión de las "Fichas Técnicas" o catálogos de productos. Aquí se definen los modelos de calzado y sus listas de materiales (BOM - Bill of Materials).
-   **Planificación:** Centrado en la creación y gestión de Órdenes de Producción (OP). El sistema valida la disponibilidad de materiales en tiempo real y genera sugerencias de compra para cubrir déficits.
-   **Abastecimiento:** Gestiona todo el ciclo de compras. Recibe sugerencias del módulo de planificación, permite crear y dar seguimiento a Órdenes de Compra (OC) y evalúa el rendimiento de los proveedores.
-   **Almacén:** Controla el inventario de materiales. Ofrece una vista detallada del stock, permite registrar movimientos (entradas, salidas, ajustes) y utiliza IA para identificar inventario de lento movimiento o en niveles críticos.
-   **Contabilidad:** Proporciona un resumen financiero, incluyendo la gestión de cuentas por cobrar y por pagar, análisis de gastos y rendimiento financiero mensual.
-   **Administración:** Módulo dedicado a la gestión de usuarios, roles y permisos dentro del sistema.

## 3. Características Clave

-   **Visibilidad 360°:** Todos los módulos están interconectados, permitiendo un flujo de datos coherente y en tiempo real.
-   **Inteligencia Artificial Integrada:** SISMAC utiliza el poder de la API de Groq para:
    -   **SISMAC Copilot:** Un asistente conversacional que permite a los usuarios preguntar sobre los datos de la aplicación en lenguaje natural.
    -   **Sugerencia de Materiales Sustitutos:** Analiza el inventario para proponer alternativas a materiales en el BOM, calculando el impacto en costo.
    -   **Análisis Estratégico:** Genera insights accionables en el Dashboard Gerencial.
    -   **Predicción de Riesgos:** Anticipa problemas en la cadena de suministro.
    -   **Optimización de Costos:** Alerta sobre precios elevados en órdenes de compra.
    -   **Automatización Inteligente:** Genera sugerencias de compra basadas en el rendimiento de proveedores.
-   **Planificación Proactiva:** El sistema detecta automáticamente los faltantes de material para las órdenes de producción, evitando paros en la línea.
-   **Interfaz Moderna e Intuitiva:** Diseñada para ser fácil de usar, con visualizaciones de datos claras y flujos de trabajo lógicos.
-   **Seguridad Basada en Roles:** Cada usuario tiene acceso únicamente a los módulos y funcionalidades que corresponden a su perfil.

## 4. Pila Tecnológica

-   **Frontend:** React con TypeScript
-   **Estilos:** Tailwind CSS
-   **Visualización de Datos:** Recharts
-   **Inteligencia Artificial:** Groq API
-   **Enrutamiento:** React Router