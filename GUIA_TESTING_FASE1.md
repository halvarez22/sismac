# 🧪 GUÍA DE TESTING - FASE 1
## Sistema de Control de Producción de Calzado

---

## 🎯 **OBJETIVO**
Esta guía proporciona un checklist completo para probar todas las funcionalidades de la **Fase 1** antes de liberar el sistema para uso en producción.

---

## 📋 **PREPARACIÓN PARA TESTING**

### **Datos de Prueba Recomendados**

#### **Modelo de Ejemplo:**
- **Código Molde**: ZM001-TEST
- **Cliente**: COPPEL
- **Color**: NEGRO
- **Pares**: 1000
- **Categoría**: Mujer
- **Estilo**: Zapato
- **Temporada**: Primavera
- **Precio Objetivo**: $450.00

#### **Materiales de Ejemplo:**
1. **Cuero para upper**
   - Tipo: upper
   - Proveedor: Proveedora XYZ
   - Precio s/IVA: $25.00
   - Consumo/Par: 0.8 m²
   - Pedido Mín: 500 m²

2. **Suela de goma**
   - Tipo: sole
   - Proveedor: Suelas ABC
   - Precio s/IVA: $8.50
   - Consumo/Par: 1 par
   - Tiempo entrega: 7 días

3. **Plantilla EVA**
   - Tipo: insole
   - Proveedor: Espumas Plus
   - Precio s/IVA: $2.20
   - Consumo/Par: 1 par
   - Pedido Mín: 1000 pares

---

## 🏗️ **TESTING MÓDULO DE INGENIERÍA**

### **✅ 1.1 Creación de Modelo**
- [ ] Crear nuevo modelo
- [ ] Verificar que aparece en la lista
- [ ] Verificar versión inicial (1.0)
- [ ] Verificar estado inicial (Borrador)

### **✅ 1.2 Configuración de Encabezado**
- [ ] Completar todos los campos básicos
- [ ] Seleccionar categoría, estilo, temporada
- [ ] Verificar cambio automático de estado
- [ ] Probar validaciones de campos requeridos

### **✅ 1.3 Gestión de Materiales**
- [ ] Agregar 3 materiales diferentes
- [ ] Seleccionar tipos de material correctos
- [ ] Verificar cálculos automáticos de costo
- [ ] Probar eliminación de materiales
- [ ] Verificar actualización del resumen de costos

### **✅ 1.4 Ruta de Producción**
- [ ] Configurar nombre y eficiencia de ruta
- [ ] Agregar 4 operaciones en secuencia
- [ ] Verificar cálculo automático de tiempo total
- [ ] Probar eliminación de operaciones
- [ ] Verificar ordenamiento por secuencia

### **✅ 1.5 Especificaciones Técnicas**
- [ ] Configurar dimensiones (largo, ancho, alto)
- [ ] Establecer peso objetivo y tolerancia
- [ ] Agregar estándares de calidad
- [ ] Configurar requisitos de pruebas
- [ ] Completar especificaciones de empaque
- [ ] Agregar instrucciones de cuidado
- [ ] Configurar certificaciones

### **✅ 1.6 Gestión de Imágenes**
- [ ] Subir múltiples imágenes (JPG, PNG)
- [ ] Verificar vista en galería
- [ ] Probar eliminación de imágenes
- [ ] Verificar límite de tamaño de archivos

### **✅ 1.7 Cálculos Financieros**
- [ ] Verificar cálculo automático de materiales directos
- [ ] Modificar mano de obra directa
- [ ] Cambiar gastos de fabricación
- [ ] Verificar cálculo de costo total
- [ ] Modificar precio al cliente
- [ ] Confirmar cálculo de utilidad/pérdida
- [ ] Probar escenarios con pérdida (rojo) y ganancia (verde)

### **✅ 1.8 Control de Versiones**
- [ ] Verificar versión inicial (1.0)
- [ ] Crear nueva versión con cambios
- [ ] Verificar incremento automático (1.1)
- [ ] Confirmar actualización de "Última modificación"

---

## 🏭 **TESTING MÓDULO DE PRODUCCIÓN**

### **✅ 2.1 Dashboard Ejecutivo**
- [ ] Verificar carga inicial (todos en 0)
- [ ] Confirmar actualización automática de KPIs
- [ ] Probar navegación entre pestañas

### **✅ 2.2 Órdenes de Producción**
- [ ] Crear nueva orden de producción
- [ ] Verificar generación automática de número
- [ ] Completar cantidad y fecha de inicio
- [ ] Verificar estado inicial (Planificada)
- [ ] Probar cambio de estado a "En progreso"
- [ ] Verificar barra de progreso (0%)
- [ ] Probar pausa de orden
- [ ] Completar orden y verificar progreso (100%)
- [ ] Confirmar actualización de dashboard

### **✅ 2.3 Líneas de Producción**
- [ ] Crear nueva línea de producción
- [ ] Configurar nombre y capacidad
- [ ] Verificar estado inicial (Activa)
- [ ] Confirmar eficiencia inicial (85%)
- [ ] Verificar actualización de dashboard
- [ ] Probar cambio de estado de línea

### **✅ 2.4 Lotes de Producción**
- [ ] Crear lote desde orden existente
- [ ] Verificar generación automática de número de lote
- [ ] Confirmar estado inicial (Pendiente)
- [ ] Probar cambio a "En progreso"
- [ ] Completar lote y verificar estado
- [ ] Verificar actualización en tabla
- [ ] Confirmar relación con orden de producción

### **✅ 2.5 Control de Calidad**
- [ ] Registrar inspección en lote
- [ ] Completar datos del inspector
- [ ] Probar aprobación de lote
- [ ] Probar rechazo de lote
- [ ] Verificar registro de defectos
- [ ] Confirmar actualización en tabla de calidad
- [ ] Verificar actualización de dashboard (defectos)

---

## 🔧 **TESTING FUNCIONALIDADES CRUZADAS**

### **✅ 3.1 Integración Ingeniería → Producción**
- [ ] Crear modelo completo en ingeniería
- [ ] Verificar disponibilidad en módulo de producción
- [ ] Crear orden basada en modelo
- [ ] Confirmar transferencia de datos (materiales, costos)

### **✅ 3.2 Navegación y UX**
- [ ] Probar cambio entre módulos
- [ ] Verificar responsive design (móvil, tablet, desktop)
- [ ] Probar modo oscuro/claro
- [ ] Confirmar persistencia de datos al recargar
- [ ] Verificar navegación con teclado

### **✅ 3.3 Validaciones y Errores**
- [ ] Probar campos requeridos
- [ ] Verificar validación de números
- [ ] Probar límites de archivos
- [ ] Confirmar mensajes de error claros
- [ ] Verificar recuperación de errores

---

## 📱 **TESTING EN DIFERENTES DISPOSITIVOS**

### **✅ 4.1 Desktop (1920x1080)**
- [ ] Todas las funcionalidades arriba listadas
- [ ] Verificar layout completo
- [ ] Probar múltiples ventanas/tabs

### **✅ 4.2 Tablet (768x1024)**
- [ ] Navegación por pestañas
- [ ] Formularios responsive
- [ ] Tablas desplazables
- [ ] Botones accesibles

### **✅ 4.3 Mobile (375x667)**
- [ ] Menú colapsable
- [ ] Formularios verticales
- [ ] Texto legible
- [ ] Funcionalidad completa

---

## 🚀 **TESTING DE PERFORMANCE**

### **✅ 5.1 Velocidad de Carga**
- [ ] Primera carga < 3 segundos
- [ ] Navegación entre pestañas < 1 segundo
- [ ] Cálculos automáticos < 500ms
- [ ] Guardado de datos < 1 segundo

### **✅ 5.2 Uso de Memoria**
- [ ] Sin memory leaks al cambiar módulos
- [ ] Cierre correcto de componentes
- [ ] Liberación de imágenes no utilizadas

---

## 🔍 **TESTING DE DATOS**

### **✅ 6.1 Persistencia**
- [ ] Datos se mantienen al recargar página
- [ ] Información correcta al navegar
- [ ] No pérdida de datos en crashes

### **✅ 6.2 Backup/Restore**
- [ ] Exportar datos (JSON en consola)
- [ ] Posibilidad de importar datos
- [ ] Validación de integridad de datos

---

## 👥 **TESTING CON USUARIOS**

### **✅ 7.1 Usuarios Técnicos (Ingenieros)**
- [ ] Crear modelo desde cero
- [ ] Completar todas las especificaciones
- [ ] Verificar cálculos automáticos
- [ ] Aprobar versiones

### **✅ 7.2 Usuarios de Producción**
- [ ] Crear órdenes de producción
- [ ] Gestionar líneas y lotes
- [ ] Registrar controles de calidad
- [ ] Seguir progreso en dashboard

### **✅ 7.3 Usuarios Administrativos**
- [ ] Revisar todos los módulos
- [ ] Verificar reportes y estadísticas
- [ ] Gestionar configuración general

---

## 📊 **RESULTADOS ESPERADOS**

### **Funcionalidades que DEBEN funcionar:**
- ✅ Creación completa de modelos
- ✅ Todos los cálculos automáticos
- ✅ Navegación fluida entre módulos
- ✅ Persistencia de datos
- ✅ Interfaz responsive

### **Problemas aceptables (con workaround):**
- ⚠️ Exportación PDF (pendiente)
- ⚠️ Backup avanzado (básico disponible)
- ⚠️ Notificaciones (consola por ahora)

### **Problemas críticos (bloquean release):**
- ❌ Pérdida de datos
- ❌ Cálculos incorrectos
- ❌ Navegación rota
- ❌ Errores que impiden continuar

---

## 📋 **REGISTRO DE BUGS**

### **Formato de Reporte:**
```
**ID:** BUG-001
**Módulo:** Ingeniería - Materiales
**Severidad:** Alta/Media/Baja
**Descripción:** [Descripción clara del problema]
**Pasos para reproducir:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]
**Resultado esperado:** [Qué debería pasar]
**Resultado actual:** [Qué pasa realmente]
**Navegador/OS:** Chrome 120 / Windows 11
**Captura de pantalla:** [Adjuntar si aplica]
```

---

## 🎯 **CRITERIOS DE APROBACIÓN**

### **Para liberar Fase 1:**
- [ ] ✅ **90%** de funcionalidades probadas exitosamente
- [ ] ✅ **0 bugs críticos** abiertos
- [ ] ✅ **Performance** dentro de parámetros
- [ ] ✅ **UX aceptable** por usuarios finales
- [ ] ✅ **Documentación** completa y actualizada

### **Métricas de Éxito:**
- **Tiempo promedio de creación de modelo:** < 15 minutos
- **Tasa de error en cálculos:** < 1%
- **Satisfacción del usuario:** > 4/5

---

## 📞 **SOPORTE DURANTE TESTING**

### **Equipo de Desarrollo:**
- **Issues en GitHub:** Crear issues detallados
- **Slack/Discord:** Comunicación en tiempo real
- **Email:** bugs@sistema.com

### **Horarios de Soporte:**
- **Lunes - Viernes:** 9:00 - 18:00
- **Respuesta máxima:** 4 horas para bugs críticos
- **Respuesta máxima:** 24 horas para bugs menores

---

*Guía de Testing actualizada: $(date)*
*Versión: 1.0*
*Fase: Testing Fase 1*

