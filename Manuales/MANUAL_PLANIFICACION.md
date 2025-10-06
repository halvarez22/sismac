# 📅 MANUAL DE USUARIO: MÓDULO DE PLANIFICACIÓN
## Guía Paso a Paso para Personal No Técnico

---

## 🎯 **¿QUÉ ES EL MÓDULO DE PLANIFICACIÓN?**

La Planificación es como el **"director de orquesta"** de SISMAC. Aquí es donde se decide qué, cuánto y cuándo se va a producir. Imagínalo como planificar un viaje: decides el destino (qué modelo), cuánta gente va (cuántos pares), y cuándo salen (fecha de entrega).

**Propósito:** Crear órdenes de producción que aseguren que se fabricarán los zapatos correctos en el momento correcto.

---

## 🚀 **CÓMO ACCEDER AL MÓDULO DE PLANIFICACIÓN**

### **Paso 1: Iniciar Sesión**
1. Abre tu navegador web
2. Ve a: `http://localhost:3000`
3. **Ingresa tus credenciales** (ver al final del manual)
4. Haz clic en **"Iniciar Sesión"**

### **Paso 2: Ir a Planificación**
1. En el menú lateral izquierdo, busca el ícono de **calendario** 📅
2. Haz clic en **"Planificación"**
3. Llegarás a la pantalla principal de Planificación

---

## 📋 **CÓMO VER ÓRDENES DE PRODUCCIÓN EXISTENTES**

### **La Tabla de Órdenes**

Al entrar verás una **tabla con todas las órdenes** de producción:

#### **Columnas que verás:**
- **ID Orden:** Código único (ej: OP-001)
- **Modelo:** Qué tipo de zapato se va a hacer
- **Cantidad:** Número total de pares a producir
- **Estado:** Pendiente, En Progreso, Completada, etc.
- **Fecha Creación:** Cuándo se creó la orden
- **Fecha Entrega:** Cuándo debe estar lista
- **Acciones:** Ver detalles o editar

#### **Estados de las Órdenes:**
- **🟡 Pendiente:** Esperando materiales o aprobación
- **🟢 En Progreso:** Se está produciendo
- **✅ Completada:** Terminada y lista
- **🔴 Cancelada:** Se detuvo la producción
- **⏸️ Pausada:** Producción detenida temporalmente

---

## 🆕 **CÓMO CREAR UNA NUEVA ORDEN DE PRODUCCIÓN**

### **Paso 1: Abrir el Formulario**
1. En la pantalla de Planificación, busca el botón azul que dice **"Crear Nueva Orden"**
2. Haz clic en ese botón
3. Se abrirá una ventana emergente para crear la orden

### **Paso 2: Seleccionar el Modelo**
1. **Buscar el modelo:** Escribe el nombre del modelo que quieres producir
   - **Ejemplo:** "Zapato Deportivo Blanco"
   - El sistema te mostrará opciones disponibles

2. **Seleccionar de la lista:** Haz clic en el modelo correcto
   - Verás una descripción breve del modelo
   - Si no encuentras el modelo, significa que no existe en Ingeniería

### **Paso 3: Definir la Cantidad**
1. **Campo "Cantidad":** Escribe cuántos pares quieres producir
   - **Ejemplo:** 500 (quinientos pares)
   - **Consejo:** Considera la capacidad de producción y demanda

2. **Campo "Fecha de Entrega":** Selecciona cuándo debe estar lista
   - Usa el calendario emergente
   - **Consejo:** Considera tiempos de producción y transporte

### **Paso 4: Revisar Disponibilidad de Materiales**

#### **¿Qué es la "Validación de Inventario"?**
Es como chequear si tienes todos los ingredientes antes de cocinar.

1. Después de seleccionar modelo y cantidad, el sistema **automáticamente verifica:**
   - ✅ **Material suficiente:** Verde, todo OK
   - ⚠️ **Material faltante:** Amarillo, necesitas comprar
   - ❌ **Material agotado:** Rojo, no se puede producir

2. **Si hay problemas:**
   - Verás una lista de materiales faltantes
   - Cada material mostrará cuánto tienes vs cuánto necesitas
   - **Ejemplo:** "Tela Roja: Tienes 100m, Necesitas 250m"

### **Paso 5: Decidir qué hacer con la orden**

#### **Opción A: Generar Sugerencias de Compra (Recomendado)**
1. Si hay materiales faltantes, haz clic en **"Generar Sugerencias de Compra"**
2. El sistema creará automáticamente:
   - ✅ La orden de producción (guardada)
   - ✅ Sugerencias de compra en Abastecimiento
   - ✅ Vincula todo automáticamente

3. **Resultado:** La orden se crea Y se generan las compras necesarias

#### **Opción B: Guardar de Todos Modos**
1. Si quieres planificar para el futuro, haz clic en **"Guardar de Todos Modos"**
2. Se crea la orden aunque falten materiales
3. **Nota:** La producción no podrá empezar hasta tener todos los materiales

### **Paso 6: Confirmación**
1. Verás un mensaje de éxito
2. La ventana se cerrará automáticamente
3. La nueva orden aparecerá en la tabla principal

---

## 📊 **CÓMO VER DETALLES DE UNA ORDEN**

### **Paso 1: Encontrar la Orden**
1. En la tabla principal, busca la orden que te interesa
2. Mira la columna **"Estado"** para ver el progreso

### **Paso 2: Ver Información Detallada**
1. **Información básica:** Modelo, cantidad, fechas, estado
2. **Materiales requeridos:** Lista completa de qué se necesita
3. **Materiales disponibles:** Qué tienes en stock
4. **Costos estimados:** Cuánto costará producir esta orden

### **Paso 3: Ver Costos por Material**
- **Cada material muestra:**
  - Nombre del material
  - Cantidad total necesaria
  - Costo unitario
  - Costo total para esta orden
  - **Ejemplo:** "Tela Roja: 250m × $5.00 = $1,250.00"

---

## ✏️ **CÓMO EDITAR UNA ORDEN EXISTENTE**

### **¡Importante!** Solo puedes editar órdenes pendientes.

#### **Paso 1: Abrir la Orden**
1. En la tabla, encuentra la orden con estado **"Pendiente"**
2. Haz clic en el **ícono de editar** (lápiz)

#### **Paso 2: Modificar**
1. **Cambiar cantidad:** Aumenta o reduce la cantidad
2. **Cambiar fecha:** Modifica la fecha de entrega
3. **Nota:** No puedes cambiar el modelo una vez creada la orden

#### **Paso 3: Guardar**
1. Haz clic en **"Guardar Cambios"**
2. El sistema recalculará automáticamente los materiales necesarios

---

## 🔍 **CÓMO FILTRAR Y BUSCAR ÓRDENES**

### **Por Estado:**
1. Busca los botones de filtro en la parte superior
2. Opciones: **Todas**, **Pendientes**, **En Progreso**, **Completadas**
3. Haz clic en el estado que quieres ver

### **Por Fecha:**
1. Busca controles de calendario
2. Selecciona **"Desde"** y **"Hasta"**
3. Elige el rango de fechas que quieres ver

### **Por Modelo:**
1. Si hay un campo de búsqueda, escribe el nombre del modelo
2. La tabla se filtrará automáticamente

---

## 📈 **CÓMO INTERPRETAR LOS COSTOS**

### **Costo Total de la Orden:**
- **Suma de todos los materiales** necesarios
- **Ejemplo:** Si produces 100 pares que cuestan $50 cada uno = $5,000 total

### **Costo por Par:**
- **Costo total ÷ cantidad de pares**
- **Ejemplo:** $5,000 ÷ 100 pares = $50 por par

### **Costos por Categoría:**
- **Materiales:** Costo de telas, pegamentos, etc.
- **Mano de obra:** Costo de producción (si está configurado)
- **Otros:** Transportes, empaques, etc.

---

## ⚠️ **CÓMO MANEJAR MATERIALES FALTANTES**

### **Cuando el Sistema Detecta Faltantes:**

1. **Aparece alerta amarilla** con lista de materiales faltantes
2. **Cada material muestra:**
   - Cuánto tienes actualmente
   - Cuánto necesitas para esta orden
   - Cuánto te falta

3. **Opciones:**
   - **Generar compras:** Crea sugerencias automáticamente
   - **Reducir cantidad:** Produce menos para usar lo que tienes
   - **Cambiar modelo:** Usa un modelo que no necesite ese material

### **Ejemplo Práctico:**
```
Material faltante: Tela Roja
- Tienes: 100 metros
- Necesitas: 250 metros
- Te faltan: 150 metros

¿Generar sugerencia de compra de 150 metros de Tela Roja?
```

---

## 📋 **FLUJO DE TRABAJO RECOMENDADO**

### **Paso a Paso para Planificar Producción:**

1. **📊 Revisar demanda:** ¿Cuántos zapatos se vendieron la semana pasada?
2. **📅 Ver inventario:** ¿Qué materiales tienes disponibles?
3. **🎯 Crear orden:** Seleccionar modelo y cantidad necesaria
4. **🔍 Validar materiales:** Dejar que SISMAC verifique disponibilidad
5. **🛒 Generar compras:** Si faltan materiales, crear sugerencias
6. **✅ Confirmar orden:** Guardar y comenzar producción
7. **👀 Monitorear:** Seguir el progreso hasta completar

---

## 💡 **CONSEJOS PARA PLANIFICAR MEJOR**

### **Consejo #1: Planifica con Anticipación**
- **Por qué:** Los materiales tardan en llegar
- **Cómo:** Crea órdenes 2-3 semanas antes de necesitar los zapatos

### **Consejo #2: Considera la Capacidad de Producción**
- **Por qué:** No puedes producir más de lo que tu fábrica permite
- **Cómo:** Pregunta a producción cuántos pares pueden hacer por día

### **Consejo #3: Revisa Costos Antes de Confirmar**
- **Por qué:** Un cambio en precio puede afectar rentabilidad
- **Cómo:** Siempre mira el costo total antes de guardar

### **Consejo #4: Usa Fechas Realistas**
- **Por qué:** Fechas imposibles causan estrés y atrasos
- **Cómo:** Considera tiempos de producción + transporte + imprevistos

### **Consejo #5: Monitorea Órdenes Activas**
- **Por qué:** Saber qué está pasando en tiempo real
- **Cómo:** Revisa diariamente las órdenes en progreso

---

## ⚠️ **ERRORES COMUNES Y SOLUCIONES**

### **Error: "Material insuficiente"**
- **Causa:** No tienes suficiente material para la cantidad solicitada
- **Solución:** Reduce la cantidad o genera sugerencias de compra

### **Error: "Modelo no encontrado"**
- **Causa:** El modelo no existe en Ingeniería
- **Solución:** Primero crea el modelo en el módulo de Ingeniería

### **Problema: Orden no aparece**
- **Causa:** Error al guardar o actualizar la página
- **Solución:** Actualiza la página (F5) o verifica en otras pestañas

### **Advertencia: Costo elevado**
- **Causa:** El costo por par está por encima del promedio
- **Solución:** Revisa si los precios están actualizados o busca alternativas

---

## 🎓 **PREGUNTAS FRECUENTES**

### **¿Puedo cancelar una orden en progreso?**
- **Respuesta:** Sí, pero puede generar desperdicio de materiales ya cortados

### **¿Qué pasa si cambia el precio de un material?**
- **Respuesta:** El costo de la orden se recalcula automáticamente

### **¿Cómo sé si una orden está atrasada?**
- **Respuesta:** Mira la fecha de entrega vs fecha actual en la tabla

### **¿Puedo cambiar el modelo después de crear la orden?**
- **Respuesta:** No, tendrías que cancelar y crear una nueva orden

### **¿Las órdenes se procesan automáticamente?**
- **Respuesta:** No, requieren confirmación manual para evitar errores

---

## 🧪 **CREDENCIALES PARA PROBAR**

Para probar este manual, usa estos usuarios:

### **Planificador (Acceso completo recomendado):**
- **Usuario:** `plan`
- **Contraseña:** `sismac123`

### **Gerente (Vista completa alternativa):**
- **Usuario:** `gerente`
- **Contraseña:** `password`

**Nota:** Solo estos dos roles tienen acceso a Planificación. Los demás usuarios no verán este módulo en el menú.

---

**¡Perfecto!** Ahora eres un maestro planificando producción. Recuerda que una buena planificación es la diferencia entre el éxito y el caos. Cada orden bien planificada es un paso hacia zapatos perfectos. 🎯👟
