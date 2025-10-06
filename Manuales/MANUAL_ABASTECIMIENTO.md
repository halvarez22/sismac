# 🛒 MANUAL DE USUARIO: MÓDULO DE ABASTECIMIENTO
## Guía Paso a Paso para Personal No Técnico

---

## 🎯 **¿QUÉ ES EL MÓDULO DE ABASTECIMIENTO?**

El Abastecimiento es como la **"tienda inteligente"** de SISMAC. Aquí es donde se compran todos los materiales necesarios para producir zapatos. Imagínalo como ir de compras pero con un asistente que te dice exactamente qué comprar, cuánto, de dónde y cuándo.

**Propósito:** Gestionar todas las compras de manera eficiente, desde la sugerencia automática hasta el seguimiento de entregas.

---

## 🚀 **CÓMO ACCEDER AL MÓDULO DE ABASTECIMIENTO**

### **Paso 1: Iniciar Sesión**
1. Abre tu navegador web
2. Ve a: `http://localhost:3000`
3. **Ingresa tus credenciales** (ver al final del manual)
4. Haz clic en **"Iniciar Sesión"**

### **Paso 2: Ir a Abastecimiento**
1. En el menú lateral izquierdo, busca el ícono de **carrito de compras** 🛒
2. Haz clic en **"Abastecimiento"**
3. Llegarás a la pantalla principal de Abastecimiento

---

## 📋 **CÓMO VER LAS SUGERENCIAS DE COMPRA (MRP)**

### **¿Qué es el MRP?**
MRP significa "Material Requirements Planning" (Planificación de Requerimientos de Materiales). Es como una lista inteligente de compras que el sistema genera automáticamente.

### **La Bandeja de Sugerencias**

Al entrar verás la sección **"Bandeja de Sugerencias"**:

#### **Qué verás en cada sugerencia:**
- **Material:** Nombre del material que se necesita
- **Cantidad Necesaria:** Cuánto hay que comprar
- **Proveedor Sugerido:** De dónde comprarlo (basado en histórico)
- **Precio Estimado:** Cuánto costará aproximadamente
- **Orden Relacionada:** De cuál orden de producción viene la necesidad
- **Fecha Límite:** Cuándo se necesita el material

#### **Estados de las Sugerencias:**
- **🟡 Pendiente:** Esperando que la proceses
- **🟢 Procesada:** Ya se convirtió en orden de compra
- **🔴 Expirada:** Pasó la fecha límite

---

## 🆕 **CÓMO CREAR UNA ORDEN DE COMPRA DESDE UNA SUGERENCIA**

### **Paso 1: Seleccionar una Sugerencia**
1. En la bandeja de sugerencias, haz clic en la sugerencia que quieres procesar
2. Se expandirá para mostrar más detalles

### **Paso 2: Crear la Orden de Compra**
1. Haz clic en **"Crear Orden de Compra"**
2. Se abrirá un formulario con la información pre-llenada

### **Paso 3: Revisar y Completar Información**

#### **Información Automática (ya llena):**
- **Material:** Ya seleccionado
- **Cantidad:** Calculada por el sistema
- **Orden Relacionada:** Vinculada automáticamente

#### **Información que debes completar:**
1. **Proveedor:** Selecciona de la lista desplegable
   - El sistema sugiere el proveedor habitual
   - Puedes cambiarlo si encuentras mejor precio

2. **Precio Unitario:** Escribe cuánto cuesta cada unidad
   - **Ejemplo:** $5.00 por metro de tela
   - **Consejo:** Incluye todos los costos (material + envío + impuestos)

3. **Fecha de Entrega Esperada:** Cuándo llegará el material
   - Usa el calendario
   - **Consejo:** Considera tiempos de envío del proveedor

### **Paso 4: Sistema de Alerta de Costos**

#### **¿Qué hace la IA aquí?**
El sistema revisa si el precio que pusiste es mucho más alto de lo normal.

1. **Si el precio está OK:** Continúa normal
2. **Si el precio es alto:** Aparece una alerta amarilla
   - **Mensaje:** "El precio es 25% más alto que el promedio"
   - **Opciones:**
     - **Confirmar de todos modos:** Si sabes por qué es más caro
     - **Buscar otro proveedor:** Cambiar proveedor
     - **Negociar precio:** Contactar al proveedor

### **Paso 5: Guardar la Orden**
1. Revisa toda la información
2. Haz clic en **"Crear Orden de Compra"**
3. La orden se guardará y aparecerá en la tabla de órdenes

---

## ➕ **CÓMO CREAR UNA ORDEN DE COMPRA DESDE CERO**

### **Cuando no hay sugerencia automática:**

#### **Paso 1: Abrir el Formulario**
1. Busca el botón verde **"Crear Nueva Orden"**
2. Haz clic en ese botón

#### **Paso 2: Seleccionar Material**
1. En el campo **"Material"**, escribe el nombre
2. El sistema mostrará opciones disponibles
3. Selecciona el material correcto

#### **Paso 3: Especificar Detalles**
1. **Cantidad:** Cuánto necesitas comprar
2. **Proveedor:** Elige de la lista
3. **Precio Unitario:** Costo por unidad
4. **Fecha de Entrega:** Cuándo llegará

#### **Paso 4: Guardar**
1. Haz clic en **"Crear Orden de Compra"**
2. La orden se creará desde cero

---

## 📊 **CÓMO VER Y GESTIONAR ÓRDENES DE COMPRA**

### **La Tabla de Órdenes de Compra**

Debajo de las sugerencias verás todas las órdenes de compra:

#### **Columnas importantes:**
- **ID Orden:** Código único (ej: OC-001)
- **Estado:** Pendiente, Enviada, Recibida, etc.
- **Proveedor:** Quién vende el material
- **Material:** Qué se está comprando
- **Cantidad:** Cuánto se pidió
- **Costo Total:** Precio total de la orden
- **Fecha Creación:** Cuándo se creó
- **Fecha Entrega:** Cuándo debe llegar

#### **Estados de las Órdenes:**
- **📝 Borrador:** Acabada de crear, se puede editar
- **📤 Enviada:** Ya se envió al proveedor
- **🚚 En Tránsito:** El proveedor lo envió
- **✅ Recibida:** Llegó y se verificó
- **❌ Cancelada:** Se canceló la compra
- **⏰ En Revisión:** Esperando aprobación

---

## ✏️ **CÓMO EDITAR UNA ORDEN DE COMPRA**

### **¡Solo se pueden editar órdenes en estado "Borrador"!**

#### **Paso 1: Encontrar la Orden**
1. En la tabla de órdenes, busca una con estado **"Borrador"**
2. Haz clic en el **botón de editar** (ícono de lápiz)

#### **Paso 2: Modificar Información**
1. **Cambiar proveedor:** Seleccionar otro de la lista
2. **Cambiar precio:** Actualizar si negociaste mejor
3. **Cambiar cantidad:** Aumentar o reducir
4. **Cambiar fecha:** Ajustar fecha de entrega

#### **Paso 3: Guardar Cambios**
1. Haz clic en **"Guardar Cambios"**
2. La orden se actualizará

---

## 🔍 **CÓMO FILTRAR Y BUSCAR ÓRDENES**

### **Por Estado:**
1. Busca los botones de filtro en la parte superior
2. Opciones: **Todas**, **Pendientes**, **Enviadas**, **Recibidas**
3. Haz clic para ver solo ese tipo

### **Por Proveedor:**
1. Busca el campo **"Filtrar por Proveedor"**
2. Escribe el nombre del proveedor
3. La tabla se filtrará automáticamente

### **Por Material:**
1. Campo **"Filtrar por Material"**
2. Escribe el nombre del material
3. Verás solo órdenes de ese material

### **Por Fecha:**
1. Campos **"Desde"** y **"Hasta"**
2. Selecciona el rango de fechas
3. Verás órdenes de ese período

---

## ✅ **CÓMO MARCAR UNA ORDEN COMO RECIBIDA**

### **Cuando llega el material:**

#### **Paso 1: Encontrar la Orden**
1. Busca la orden con estado **"Enviada"** o **"En Tránsito"**
2. Haz clic en el **botón de check** ✅ o **"Marcar como Recibida"**

#### **Paso 2: Confirmar Recepción**
1. Aparecerá una ventana de confirmación
2. Verifica que llegó la cantidad correcta
3. Haz clic en **"Confirmar Recepción"**

#### **Paso 3: Actualización Automática**
- La orden cambia a estado **"Recibida"**
- El material se agrega automáticamente al inventario
- La cantidad en Almacén aumenta

---

## 📈 **CÓMO INTERPRETAR LOS COSTOS Y ESTADÍSTICAS**

### **En la sección de estadísticas:**

1. **Total de Órdenes:** Número total de compras
2. **Costo Total:** Suma de todas las órdenes
3. **Órdenes Pendientes:** Cuántas están esperando
4. **Proveedores Activos:** Número de proveedores usados

### **Por cada orden:**
- **Costo Total = Cantidad × Precio Unitario**
- **Ejemplo:** 100 metros × $5.00 = $500.00

---

## 🤖 **CÓMO USAR LAS ALERTAS DE IA**

### **Alertas de Costos Elevados:**

1. **Cuando aparece:** Al crear una orden con precio alto
2. **Qué significa:** El precio está por encima del promedio
3. **Qué hacer:**
   - **Revisar:** ¿Es un error de tipeo?
   - **Negociar:** Llamar al proveedor
   - **Buscar alternativo:** Cambiar proveedor
   - **Confirmar:** Si sabes que debe costar más

### **Ejemplo de Alerta:**
```
⚠️ ALERTA: El precio de "Tela Roja" ($6.50) es 30% más alto que el promedio ($5.00)

¿Deseas continuar de todos modos?
```

---

## 💡 **CONSEJOS PARA COMPRAR MEJOR**

### **Consejo #1: Revisa Sugerencias Diariamente**
- **Por qué:** Las necesidades cambian constantemente
- **Cómo:** Empieza tu día revisando la bandeja de sugerencias

### **Consejo #2: Compara Precios**
- **Por qué:** Un pequeño ahorro se multiplica en grandes cantidades
- **Cómo:** Siempre pregunta precios a múltiples proveedores

### **Consejo #3: Anticipa Necesidades**
- **Por qué:** Los materiales tardan en llegar
- **Cómo:** No esperes a que falten, compra con anticipación

### **Consejo #4: Verifica Fechas de Entrega**
- **Por qué:** Un atraso puede parar la producción
- **Cómo:** Confirma con proveedores antes de guardar la orden

### **Consejo #5: Mantén Contactos con Proveedores**
- **Por qué:** Relaciones buenas = mejores precios y servicios
- **Cómo:** Llama regularmente, paga a tiempo, comunica claramente

---

## ⚠️ **ERRORES COMUNES Y SOLUCIONES**

### **Error: "Proveedor no encontrado"**
- **Causa:** El proveedor no existe en el sistema
- **Solución:** Crear el proveedor primero o usar uno existente

### **Error: "Material no disponible"**
- **Causa:** El material no existe en inventario
- **Solución:** Crear el material en Almacén primero

### **Problema: Sugerencia no aparece**
- **Causa:** La orden de producción no generó sugerencias
- **Solución:** Verificar que la orden se creó correctamente en Planificación

### **Advertencia: Cantidad insuficiente**
- **Causa:** Pediste menos de lo sugerido
- **Solución:** Considerar si necesitas más para tener stock de seguridad

---

## 🎓 **PREGUNTAS FRECUENTES**

### **¿Puedo cancelar una orden enviada?**
- **Respuesta:** Sí, pero informa al proveedor inmediatamente

### **¿Qué pasa si llega material defectuoso?**
- **Respuesta:** Marca como recibido pero reporta en Almacén para ajuste de calidad

### **¿Cómo veo el historial de compras de un material?**
- **Respuesta:** Filtra por material para ver todas las órdenes anteriores

### **¿Las órdenes se envían automáticamente al proveedor?**
- **Respuesta:** No, debes contactar al proveedor manualmente después de crear la orden

### **¿Puedo cambiar el precio después de enviar?**
- **Respuesta:** Sí, edita la orden y marca como "En Revisión" si hay cambios

---

## 🧪 **CREDENCIALES PARA PROBAR**

Para probar este manual, usa estos usuarios:

### **Comprador (Acceso completo recomendado):**
- **Usuario:** `ana.c`
- **Contraseña:** `password`

### **Gerente (Vista completa alternativa):**
- **Usuario:** `gerente`
- **Contraseña:** `password`

**Nota:** Solo estos dos roles tienen acceso a Abastecimiento. Los demás usuarios no verán este módulo en el menú.

---

**¡Excelente!** Ahora eres un experto en gestionar compras. Recuerda que una buena compra ahorra dinero y evita paros en producción. Cada orden de compra bien hecha es una inversión en el éxito de tu empresa. 💰📦
