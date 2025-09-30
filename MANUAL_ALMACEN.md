# 📦 MANUAL DE USUARIO: MÓDULO DE ALMACÉN
## Guía Paso a Paso para Personal No Técnico

---

## 🎯 **¿QUÉ ES EL MÓDULO DE ALMACÉN?**

El Almacén es como la **"despensa organizada"** de SISMAC. Aquí es donde se controla todo lo que entra, sale y se queda en el inventario. Imagínalo como un supermercado donde sabes exactamente qué tienes, cuánto tienes y dónde está cada cosa.

**Propósito:** Mantener un control preciso de todos los materiales para que nunca falten ni sobren.

---

## 🚀 **CÓMO ACCEDER AL MÓDULO DE ALMACÉN**

### **Paso 1: Iniciar Sesión**
1. Abre tu navegador web
2. Ve a: `http://localhost:3000`
3. **Ingresa tus credenciales** (ver al final del manual)
4. Haz clic en **"Iniciar Sesión"**

### **Paso 2: Ir a Almacén**
1. En el menú lateral izquierdo, busca el ícono de **caja/paquete** 📦
2. Haz clic en **"Almacén"**
3. Llegarás a la pantalla principal de Almacén

---

## 📊 **CÓMO VER EL DASHBOARD DE INVENTARIO**

### **Los Números Principales**

En la parte superior verás **estadísticas importantes**:

#### **Valor Total del Inventario**
- **Qué significa:**Cuánto dinero hay invertido en materiales
- **Ejemplo:** $50,000 significa que tienes materiales por valor de 50 mil pesos
- **Para qué sirve:** Saber cuánto tienes "atado" en stock

#### **Ocupación del Almacén**
- **Qué significa:**Porcentaje del espacio que estás usando
- **Ejemplo:** 75% significa que tienes espacio para más materiales
- **Para qué sirve:** Planificar si necesitas más espacio

#### **Alertas de Stock**
- **🟢 OK:** Suficiente stock (verde)
- **🟡 Bajo:** Queda poco, comprar pronto (amarillo)
- **🔴 Crítico:** Muy poco, comprar urgentemente (rojo)
- **⚫ Exceso:** Demasiado, considerar vender (negro)

---

## 📋 **CÓMO VER TODOS LOS MATERIALES**

### **La Tabla de Inventario**

Es la lista completa de todos los materiales que tienes:

#### **Columnas importantes:**
- **Nombre:** Nombre descriptivo del material
- **SKU/Código:** Código único del material
- **Categoría:** Tipo de material (Telas, Pegamentos, Herrajes, etc.)
- **Stock Actual:** Cuánto tienes disponible
- **Unidad:** Cómo se mide (metros, litros, piezas, etc.)
- **Precio Unitario:** Costo de cada unidad
- **Valor Total:** Stock × Precio Unitario
- **Estado:** OK, Bajo, Crítico, Exceso
- **Ubicación:** Dónde está guardado físicamente

#### **Cómo navegar:**
1. **Desplázate** con la barra lateral si hay muchos materiales
2. **Ordena** haciendo clic en los títulos de columna
3. **Busca** escribiendo en el campo de búsqueda

---

## 🔍 **CÓMO BUSCAR Y FILTRAR MATERIALES**

### **Búsqueda por Nombre:**
1. Escribe el nombre en el campo **"Buscar materiales..."**
2. La tabla se filtra automáticamente
3. **Ejemplo:** Escribe "tela" para ver todas las telas

### **Filtro por Categoría:**
1. Haz clic en **"Todas las categorías"**
2. Selecciona la categoría que quieres ver
3. Opciones: Telas, Pegamentos, Herrajes, Químicos, Suelas, etc.

### **Filtro por Estado:**
1. Haz clic en **"Todos los estados"**
2. Selecciona: OK, Bajo, Crítico, Exceso
3. Verás solo materiales con ese estado

### **Filtro por Ubicación:**
1. Campo **"Filtrar por ubicación"**
2. Escribe dónde está guardado
3. **Ejemplo:** "Pasillo A" o "Estante 5"

---

## ➕ **CÓMO AGREGAR UN NUEVO MATERIAL**

### **Paso 1: Abrir el Formulario**
1. Busca el botón azul **"Agregar Material"**
2. Haz clic en ese botón
3. Se abrirá una ventana emergente

### **Paso 2: Llenar Información Básica**
1. **Nombre del Material:** Nombre descriptivo
   - **Ejemplo:** "Tela Roja Algodón"
   - **Consejo:** Sé específico para encontrar después

2. **SKU/Código:** Código único
   - **Ejemplo:** MAT-001
   - **Nota:** No puede repetirse

3. **Categoría:** Selecciona del menú
   - Opciones: Telas, Pegamentos, Herrajes, Químicos, Suelas, etc.

4. **Unidad de Medida:** Cómo se cuenta
   - Opciones: Metro (MT), Litro (LT), Pieza (PZ), Kilo (KG), etc.

### **Paso 3: Información de Inventario**
1. **Stock Inicial:** Cuánto tienes ahora
   - **Ejemplo:** 100 (si son metros)

2. **Precio Unitario:** Costo de cada unidad
   - **Ejemplo:** 5.00 (5 pesos por metro)

3. **Punto de Reorden:** Cuándo avisar que queda poco
   - **Ejemplo:** 50 (avisar cuando queden 50 metros)
   - **Consejo:** Generalmente la mitad del stock normal

### **Paso 4: Ubicación Física**
1. **Ubicación:** Dónde está guardado
   - **Ejemplo:** "Pasillo A, Estante 3, Caja Roja"
   - **Consejo:** Sé específico para encontrar físicamente

### **Paso 5: Guardar**
1. Revisa toda la información
2. Haz clic en **"Agregar Material"**
3. El material aparecerá en la tabla

---

## 📥📤 **CÓMO REGISTRAR MOVIMIENTOS DE STOCK**

### **¿Qué son los movimientos?**
Cada vez que entra o sale material del almacén.

### **Tipos de Movimientos:**
- **📥 Entrada:** Cuando llega material de compras
- **📤 Salida:** Cuando se usa en producción
- **🔄 Ajuste:** Correcciones o mermas
- **📦 Transferencia:** Mover entre ubicaciones

### **Paso 1: Abrir el Registro**
1. En la tabla de materiales, encuentra el material
2. Haz clic en el **botón "Movimiento"** (ícono de flecha)

### **Paso 2: Seleccionar Tipo de Movimiento**

#### **Para Entrada (de compras):**
1. Selecciona **"Entrada"**
2. El sistema preguntará de cuál orden de compra viene
3. Selecciona la orden correspondiente
4. La cantidad se llena automáticamente
5. Agrega una nota si es necesario

#### **Para Salida (a producción):**
1. Selecciona **"Salida"**
2. Elige la orden de producción que lo necesita
3. Especifica cantidad exacta
4. **Nota:** Solo puedes sacar lo que tienes disponible

#### **Para Ajuste (corrección):**
1. Selecciona **"Ajuste"**
2. Elige si es **"Aumento"** o **"Disminución"**
3. Escribe la cantidad y razón
4. **Ejemplo:** "-5 metros - Merma en corte"

### **Paso 3: Confirmar Movimiento**
1. Revisa que todo esté correcto
2. Haz clic en **"Registrar Movimiento"**
3. El stock se actualiza automáticamente
4. Se crea un registro en el historial

---

## 📈 **CÓMO VER EL HISTORIAL DE MOVIMIENTOS**

### **Paso 1: Ver Historial General**
1. Busca la sección **"Movimientos Recientes"**
2. Verás una lista de los últimos movimientos
3. Cada entrada muestra:
   - Fecha y hora
   - Material
   - Tipo de movimiento
   - Cantidad
   - Usuario que lo hizo

### **Paso 2: Ver Historial de un Material Específico**
1. En la tabla de materiales, haz clic en el material
2. Busca la pestaña **"Historial"** o **"Movimientos"**
3. Verás todos los movimientos de ese material
4. **Útil para:** Ver cuándo entró, cuándo salió, quién lo movió

---

## 🤖 **CÓMO INTERPRETAR LAS PERSPECTIVAS DE IA**

### **¿Qué hace la IA en Almacén?**

Es como tener un **analista inteligente** que estudia tu inventario.

### **Alertas que verás:**

#### **Material de Lento Movimiento:**
- **Qué significa:** Materiales que no se usan hace mucho tiempo
- **Por qué importa:** Dinero atado que no genera valor
- **Qué hacer:** Considerar vender, donar o desechar

#### **Material en Estado Crítico:**
- **Qué significa:** Muy poco stock, riesgo de faltar
- **Por qué importa:** Puede parar la producción
- **Qué hacer:** Comprar urgentemente

#### **Patrones de Consumo:**
- **Qué significa:** Cómo se usa el material normalmente
- **Por qué importa:** Predecir cuándo necesitarás más
- **Qué hacer:** Ajustar puntos de reorden

#### **Sugerencias de Niveles Óptimos:**
- **Qué significa:** Cuánto stock deberías tener
- **Por qué importa:** Evitar faltantes o excesos
- **Qué hacer:** Ajustar puntos de reorden

---

## 📊 **CÓMO INTERPRETAR LOS GRÁFICOS**

### **Gráfico de Distribución por Estados:**
- **Es un pastel circular**
- **Cada color:** Un estado diferente (OK, Bajo, Crítico, Exceso)
- **Tamaño del pedazo:** Porcentaje de materiales en ese estado
- **Ideal:** La mayoría en verde (OK)

### **Gráfico de Rotación por Categoría:**
- **Barras verticales** para cada categoría
- **Altura:** Qué tan rápido se vende esa categoría
- **Útil para:** Ver qué categorías se mueven más

### **Tendencias de Inventario:**
- **Línea en el tiempo**
- **Sube:** Compraste más de lo que vendiste
- **Baja:** Vendiste más de lo que compraste
- **Recta:** Balanceado

---

## ⚙️ **CÓMO EDITAR INFORMACIÓN DE MATERIALES**

### **Paso 1: Encontrar el Material**
1. En la tabla, busca el material que quieres cambiar
2. Haz clic en el **botón de editar** (lápiz)

### **Paso 2: Modificar Información**
1. **Precio:** Si cambió el costo
2. **Punto de reorden:** Si quieres cambiar cuándo avisar
3. **Ubicación:** Si se movió físicamente
4. **Categoría:** Si estaba mal clasificado

### **Paso 3: Guardar Cambios**
1. Haz clic en **"Guardar Cambios"**
2. La información se actualiza

---

## 💡 **CONSEJOS PARA GESTIONAR EL INVENTARIO**

### **Consejo #1: Revisa Alertas Diariamente**
- **Por qué:** Las cosas cambian rápido
- **Cómo:** Empieza tu día verificando materiales críticos

### **Consejo #2: Mantén Ubicaciones Actualizadas**
- **Por qué:** Tiempo perdido buscando materiales
- **Cómo:** Actualiza ubicación cada vez que muevas algo

### **Consejo #3: Registra Movimientos Inmediatamente**
- **Por qué:** Evita confusiones y pérdidas
- **Cómo:** Registra salidas y entradas en cuanto ocurran

### **Consejo #4: Revisa Puntos de Reorden**
- **Por qué:** Evita faltantes o compras innecesarias
- **Cómo:** Ajusta basado en consumo real

### **Consejo #5: Clasifica Correctamente**
- **Por qué:** Facilita buscar y analizar
- **Cómo:** Usa categorías consistentes

---

## ⚠️ **ERRORES COMUNES Y SOLUCIONES**

### **Error: "Stock insuficiente"**
- **Causa:** Intentaste sacar más de lo que tienes
- **Solución:** Verifica stock disponible antes de registrar

### **Error: "SKU duplicado"**
- **Causa:** Intentaste usar un código que ya existe
- **Solución:** Agrega un número (ej: MAT-001-B)

### **Problema: Material no aparece en búsquedas**
- **Causa:** Error de tipeo en nombre o categoría
- **Solución:** Verifica ortografía y categorización

### **Advertencia: Punto de reorden muy bajo**
- **Causa:** Número demasiado pequeño
- **Solución:** Considera tiempo de entrega del proveedor

---

## 🎓 **PREGUNTAS FRECUENTES**

### **¿Puedo tener stock negativo?**
- **Respuesta:** No, el sistema no permite stock negativo

### **¿Qué pasa si se daña material?**
- **Respuesta:** Registra como "Ajuste - Disminución" con razón "Daño/Merma"

### **¿Cómo veo cuánto vale mi inventario total?**
- **Respuesta:** Mira el "Valor Total del Inventario" en el dashboard

### **¿Los movimientos afectan otras áreas?**
- **Respuesta:** Sí, actualizar stock afecta órdenes de producción y compras

### **¿Puedo exportar la lista de inventario?**
- **Respuesta:** Por ahora no, pero puedes copiar de la tabla

---

## 🧪 **CREDENCIALES PARA PROBAR**

Para probar este manual, usa estos usuarios:

### **Almacenista (Acceso completo recomendado):**
- **Usuario:** `juan.a`
- **Contraseña:** `password`

### **Gerente (Vista completa alternativa):**
- **Usuario:** `gerente`
- **Contraseña:** `password`

**Nota:** Solo estos dos roles tienen acceso a Almacén. Los demás usuarios no verán este módulo en el menú.

---

**¡Fantástico!** Ahora eres un experto en gestionar inventario. Recuerda que un buen control de almacén es la base de una producción eficiente. Cada material en su lugar es un paso hacia zapatos perfectos. 📦✅
