# Documentación Técnica de SISMAC

Este documento está dirigido a los desarrolladores y describe la arquitectura, las decisiones técnicas y los patrones de diseño utilizados en la aplicación SISMAC.

## 1. Arquitectura General

SISMAC es una Single-Page Application (SPA) construida con **React** y **TypeScript**. La arquitectura se centra en una estructura modular, donde cada área funcional principal (Abastecimiento, Almacén, etc.) corresponde a un "módulo" o ruta principal en la aplicación.

### Estructura de Archivos

```
/
├── components/          # Componentes reutilizables y específicos de cada módulo
├── types.ts             # Definiciones de tipos de TypeScript para todo el proyecto
├── App.tsx              # Componente raíz, gestiona autenticación y enrutamiento principal
├── index.html           # Punto de entrada HTML
├── index.tsx            # Renderiza la aplicación en el DOM
├── metadata.json        # Metadatos de la aplicación
├── *.md                 # Archivos de documentación
```

-   **`App.tsx`**: Contiene la lógica de autenticación (`AuthProvider`) y el enrutador principal que distingue entre la página de login y el layout principal de la aplicación.
-   **`MainLayout` (dentro de `App.tsx`)**: Es el componente "shell" que envuelve toda la aplicación una vez que el usuario ha iniciado sesión. Contiene el `Sidebar`, el `Header` y el área de contenido principal donde se renderizan los módulos. Es el punto central de la gestión del estado de la aplicación.
-   **`components/`**: Alberga los componentes de cada módulo (ej. `Abastecimiento.tsx`, `Almacen.tsx`) y componentes reutilizables (ej. `KpiCard.tsx`, `ChartCard.tsx`, modales genéricos como `Copilot.tsx` o `SubstituteSuggestionsModal.tsx`).

## 2. Gestión del Estado (State Management)

SISMAC utiliza una combinación de **React Context** y estado local (`useState`, `useMemo`) para la gestión de datos.

### a. Contexto de Autenticación (`AuthContext`)

-   **Definido en:** `App.tsx`
-   **Propósito:** Gestionar el estado del usuario actual, la lista de todos los usuarios y las funciones de `login`, `logout` y CRUD de usuarios.
-   **Alcance:** Envuelve toda la aplicación, por lo que la información del usuario está disponible en cualquier componente a través del hook `useAuth()`.

### b. Contexto de Datos de la Aplicación (vía `Outlet Context`)

-   **Definido en:** `MainLayout` (componente dentro de `App.tsx`).
-   **Propósito:** Mantener el estado "global" de la aplicación, como la lista de órdenes de compra, órdenes de producción, inventario, etc.
-   **Mecanismo:** El estado principal se define en `MainLayout`. En lugar de usar un `React.Provider` tradicional, se pasa este estado y sus funciones de actualización a los componentes hijos (los módulos) a través del `context` de `Outlet` de React Router. El componente `Copilot` también recibe este estado como una prop directa (`appData`).
-   **Acceso:** Los componentes de los módulos (ej. `Planificacion.tsx`) acceden a estos datos usando el hook `useOutletContext<OutletContextType>()`.
-   **Flujo de Datos:** Este enfoque centraliza la lógica de negocio. Por ejemplo, cuando el módulo de `Planificacion` genera una sugerencia de compra, llama a la función `addPurchaseSuggestions` del contexto, que actualiza el estado centralizado. El módulo de `Abastecimiento`, al renderizarse, leerá este estado actualizado y mostrará la nueva sugerencia.

## 3. Flujo de Datos y Comunicación entre Módulos

La comunicación entre módulos es indirecta y se gestiona a través del estado central en `MainLayout`.

**Ejemplo de Flujo:**
1.  **Planificación:** Un usuario crea una Orden de Producción (`OP-5512`) que requiere un material con déficit.
2.  **Acción:** El usuario presiona "Generar Sugerencias". La función `handleGenerateSuggestions` en `Planificacion.tsx` se ejecuta.
3.  **Llamada al Contexto:** Esta función llama a `addPurchaseSuggestions(newSuggestions)`, que es una prop recibida del `Outlet Context`.
4.  **Actualización de Estado:** La función, definida en `MainLayout`, actualiza el estado `purchaseSuggestions`.
5.  **Re-renderizado:** React detecta el cambio de estado. El componente `Abastecimiento.tsx`, que también consume `purchaseSuggestions` del contexto, se vuelve a renderizar.
6.  **Resultado:** La nueva sugerencia de compra, vinculada a `OP-5512`, aparece ahora en la "Bandeja de Sugerencias" del módulo de Abastecimiento, lista para que un comprador la procese.

## 4. Integración con la IA (Google Gemini)

La integración con la IA se realiza de forma asíncrona en componentes específicos para no bloquear la interfaz de usuario.

-   **Inicialización:** Se instancia el cliente de la API con `new GoogleGenAI({ apiKey: process.env.API_KEY })`. **Importante:** La `API_KEY` debe estar definida como una variable de entorno en el entorno de ejecución. El código no debe manejar la clave directamente. En caso de no estar presente, las funcionalidades de IA entran en un "modo demo" con respuestas estáticas.
-   **Manejo de Carga y Errores:** Todos los componentes de IA manejan un estado de `loading` para mostrar esqueletos o indicadores de carga. También gestionan un estado de `error` para informar al usuario si la llamada a la API falla.

### a. SISMAC Copilot (`Copilot.tsx`)

-   **Técnica:** Utiliza el método `ai.chats.create()` para establecer una sesión de conversación persistente.
-   **Contexto:** Para cada pregunta del usuario, se construye un *prompt* que incluye el **estado completo de la aplicación** (`appData`) serializado en JSON. Esto proporciona a la IA todo el contexto necesario para dar respuestas precisas.
-   **Streaming:** La respuesta se maneja con `chat.sendMessageStream()`. El componente itera sobre los *chunks* de la respuesta a medida que llegan, actualizando el estado de la UI para mostrar el texto palabra por palabra, lo que resulta en una experiencia de usuario fluida.
-   **System Prompt:** Se utiliza un `systemInstruction` al crear el chat para definir el rol y las directrices de la IA ("Eres SISMAC Copilot, un asistente experto...").

### b. Sugerencia de Materiales Sustitutos (`ProductModelModal.tsx`)

-   **Técnica:** Utiliza el método `ai.models.generateContent()` para solicitudes de una sola vez.
-   **Respuesta Estructurada (JSON):** Se utiliza la configuración `responseMimeType: "application/json"` y `responseSchema` en la llamada. Esto obliga al modelo de Gemini a devolver una respuesta en formato JSON que se adhiere a un esquema predefinido (`{ suggestions: [{ substituteSku, justification, costImpactPerPair }] }`), garantizando que la respuesta pueda ser parseada de forma segura.
-   **Prompting:** El *prompt* es altamente específico. Incluye el material original que se desea sustituir y la lista completa del inventario actual para que la IA realice su análisis.

## 5. Estilos y UI

-   **Framework:** **Tailwind CSS exclusivamente**, cargado a través de un script CDN en `index.html`. No se utilizan archivos CSS tradicionales ni preprocesadores.
-   **Diseño:** Se sigue un sistema de diseño consistente (colores, espaciado, tipografía) definido por las clases de Tailwind. La paleta de colores se basa en la escala de grises (`slate`) de Tailwind, con colores de acento (`sky`, `emerald`, `rose`, etc.) para estados, alertas y elementos interactivos.
-   **Componentes:** La UI está construida con componentes reutilizables (`KpiCard`, `ChartCard`, modales) para mantener la consistencia y facilitar el mantenimiento.
-   **Responsividad:** Se utilizan las utilidades responsivas de Tailwind (ej. `md:`, `lg:`) para asegurar que la aplicación se adapte a diferentes tamaños de pantalla.

## 6. Visualización de Datos

-   **Librería:** **Recharts**.
-   **Uso:** Se emplea para todos los gráficos de la aplicación (líneas, barras, pastel, compuestos).
-   **Componente `ChartCard`:** Se utiliza un componente contenedor (`ChartCard`) para estandarizar la apariencia de todos los gráficos (título, padding, bordes).
-   **Responsividad:** Los gráficos están envueltos en `ResponsiveContainer` de Recharts para que se ajusten automáticamente al tamaño de su contenedor.