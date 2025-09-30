# 📚 ÍNDICE DE MANUALES DE USUARIO SISMAC
## Guías Paso a Paso para Personal No Técnico

---

## 🎯 **¿QUÉ SON ESTOS MANUALES?**

Esta colección de manuales está diseñada específicamente para **personal no técnico** que necesita usar el sistema SISMAC en su trabajo diario. Cada manual explica paso a paso cómo usar cada módulo del sistema, asumiendo que el usuario no tiene conocimientos técnicos de computación.

**Características de los manuales:**
- ✅ Lenguaje simple y claro
- ✅ Explicaciones detalladas paso a paso
- ✅ Ejemplos prácticos
- ✅ Capturas de pantalla conceptuales
- ✅ Solución de problemas comunes
- ✅ Credenciales específicas para probar

---

## 📋 **MANUALES DISPONIBLES**

### **1. 📊 Dashboard Gerencial**
**Archivo:** `MANUAL_DASHBOARD.md`
**Para quién:** Todos los usuarios del sistema
**Qué aprenderás:**
- Interpretar KPIs principales (ingresos, costos, rotación)
- Leer perspectivas de IA
- Entender gráficos de rendimiento
- Exportar datos a Excel

### **2. 🛠️ Módulo de Ingeniería**
**Archivo:** `MANUAL_INGENIERIA.md`
**Para quién:** Ingenieros de Producto y Gerentes
**Qué aprenderás:**
- Crear y editar modelos de producto
- Gestionar listas de materiales (BOM)
- Cargar archivos Excel de proveedores (VAZZA)
- Validar materiales automáticamente

### **3. 📅 Módulo de Planificación**
**Archivo:** `MANUAL_PLANIFICACION.md`
**Para quién:** Planificadores y Gerentes
**Qué aprenderás:**
- Crear órdenes de producción
- Validar disponibilidad de materiales
- Generar sugerencias de compra automáticas
- Gestionar el flujo MRP (Material Requirements Planning)

### **4. 🛒 Módulo de Abastecimiento**
**Archivo:** `MANUAL_ABASTECIMIENTO.md`
**Para quién:** Compradores y Gerentes
**Qué aprenderás:**
- Gestionar sugerencias de compra
- Crear y editar órdenes de compra
- Usar alertas de IA para costos
- Seguimiento de proveedores y entregas

### **5. 📦 Módulo de Almacén**
**Archivo:** `MANUAL_ALMACEN.md`
**Para quién:** Almacenistas y Gerentes
**Qué aprenderás:**
- Controlar inventario en tiempo real
- Registrar movimientos de stock
- Interpretar alertas de IA
- Gestionar ubicaciones físicas

### **6. 💰 Módulo de Contabilidad**
**Archivo:** `MANUAL_CONTABILIDAD.md`
**Para quién:** Gerentes
**Qué aprenderás:**
- Interpretar estados financieros
- Leer gráficos de rendimiento
- Gestionar cuentas por cobrar/pagar
- Identificar problemas financieros

---

## 🔐 **ACCESOS POR ROL**

### **Administrador**
- **Usuario:** `admin`
- **Contraseña:** `password`
- **Acceso:** Todos los módulos + gestión de usuarios
- **Nota:** Rol técnico, no cubierto en estos manuales

### **Gerente**
- **Usuario:** `gerente`
- **Contraseña:** `password`
- **Acceso:** Todos los módulos operativos
- **Manuales aplicables:** Todos (excepto Administración)

### **Ingeniero de Producto**
- **Usuario:** `jgarcia`
- **Contraseña:** `sismac123`
- **Acceso:** Dashboard + Ingeniería
- **Manuales aplicables:** Dashboard, Ingeniería

### **Planificador**
- **Usuario:** `plan`
- **Contraseña:** `sismac123`
- **Acceso:** Dashboard + Planificación
- **Manuales aplicables:** Dashboard, Planificación

### **Comprador**
- **Usuario:** `ana.c`
- **Contraseña:** `password`
- **Acceso:** Dashboard + Abastecimiento
- **Manuales aplicables:** Dashboard, Abastecimiento

### **Almacenista**
- **Usuario:** `juan.a`
- **Contraseña:** `password`
- **Acceso:** Dashboard + Almacén
- **Nota:** Usuario inactivo por defecto
- **Manuales aplicables:** Dashboard, Almacén

---

## 🚀 **CÓMO EMPEZAR A USAR LOS MANUALES**

### **Paso 1: Identifica tu Rol**
1. Revisa la tabla anterior para ver qué rol tienes
2. Identifica cuáles manuales te aplican

### **Paso 2: Inicia Sesión en el Sistema**
1. Ve a: `http://localhost:3000`
2. Usa las credenciales de tu rol
3. Familiarízate con el menú lateral

### **Paso 3: Lee los Manuales en Orden**
1. **Empieza por Dashboard** (todos lo necesitan)
2. **Luego tu módulo principal** (ej: Ingeniería si eres ingeniero)
3. **Finalmente módulos relacionados** (ej: Abastecimiento si trabajas con compras)

### **Paso 4: Practica Paso a Paso**
1. Lee una sección del manual
2. Intenta hacer lo mismo en el sistema
3. Usa las credenciales de prueba mencionadas
4. Repite hasta sentirte cómodo

---

## 💡 **CONSEJOS PARA USAR LOS MANUALES**

### **Consejo #1: Lee con el Sistema Abierto**
- Abre el manual en una ventana
- El sistema SISMAC en otra
- Practica mientras lees

### **Consejo #2: Empieza por lo Básico**
- No intentes aprender todo de una vez
- Concéntrate en tareas diarias primero
- Avanza gradualmente a funciones avanzadas

### **Consejo #3: Usa los Ejemplos**
- Todos los manuales tienen ejemplos prácticos
- Intenta recrear los ejemplos en el sistema
- Los ejemplos usan datos reales del sistema

### **Consejo #4: Pregunta Dudas**
- Si algo no queda claro, pregunta a un compañero
- O contacta al administrador del sistema
- Los manuales están diseñados para ser intuitivos

### **Consejo #5: Practica Regularmente**
- Usa el sistema diariamente
- Consulta los manuales cuando olvides algo
- Con el tiempo te volverás un experto

---

## ⚠️ **INFORMACIÓN IMPORTANTE**

### **Sobre los Datos de Prueba**
- El sistema incluye datos de ejemplo del modelo **VAZZA 13501 BLANCO**
- Estos datos sirven para practicar sin afectar operaciones reales
- Incluyen 5 materiales reales con precios y proveedores

### **Sobre la IA y Funciones Avanzadas**
- Algunos módulos tienen funciones de IA (Copilot, sugerencias inteligentes)
- Si la API de IA no está configurada, verás mensajes de "modo demo"
- Las funciones básicas funcionan igual con o sin IA

### **Sobre Actualizaciones**
- Estos manuales están basados en la versión actual del sistema
- Si el sistema se actualiza, algunos pasos pueden cambiar ligeramente
- Revisa periódicamente si hay nuevas versiones de los manuales

---

## 🆘 **¿PROBLEMAS O DUDAS?**

### **Si algo no funciona:**
1. Verifica que usas las credenciales correctas
2. Revisa que tu usuario esté activo (solo para Almacenista)
3. Actualiza la página (F5) si los datos no aparecen
4. Consulta la consola del navegador (F12) para mensajes de error

### **Si necesitas ayuda:**
1. Pregunta a un compañero que ya use el sistema
2. Contacta al administrador del sistema
3. Revisa las secciones de "Preguntas Frecuentes" en cada manual
4. Consulta la sección de "Errores Comunes" para soluciones

---

## 📞 **SOPORTE TÉCNICO**

- **Administrador del Sistema:** Contacta a la persona responsable de SISMAC
- **Documentación Técnica:** Disponible en `DOCUMENTACION_TECNICA.md`
- **Actualizaciones:** Los manuales se actualizan con nuevas versiones del sistema

---

**¡Bienvenido a SISMAC!** Estos manuales te convertirán en un usuario experto del sistema. Recuerda que la práctica hace al maestro. ¡Éxito en tu trabajo diario! 🚀✨

**Fecha de creación:** Septiembre 2025
**Versión del Sistema:** SISMAC v1.0
**Última actualización:** Septiembre 2025
