# 📖 MANUAL DE USUARIO - FASE 1
## Sistema de Control de Producción de Calzado

---

## 🎯 **INTRODUCCIÓN**

Este manual describe el funcionamiento de la **Fase 1** del Sistema de Control de Producción de Calzado. Incluye dos módulos principales:

1. **🏗️ Módulo de Ingeniería de Producto**: Diseño y especificación de modelos
2. **🏭 Módulo de Control de Producción**: Gestión de órdenes y procesos productivos

---

## 🚀 **PRIMEROS PASOS**

### **Acceso al Sistema**
1. Abra su navegador web
2. Vaya a: `http://localhost:3000`
3. El sistema se carga automáticamente

### **Interfaz Principal**
- **Header**: Navegación entre módulos y controles generales
- **Pestañas Principales**: "Ingeniería de Producto" y "Control de Producción"
- **Botón Tema**: Cambiar entre modo claro/oscuro

---

# 🏗️ **MÓDULO 1: INGENIERÍA DE PRODUCTO**

## **1.1 Navegación**
- Haga clic en **"Ingeniería de Producto"** en la barra superior
- Verá la lista de modelos disponibles

## **1.2 Crear un Nuevo Modelo**

### **Paso 1: Crear Modelo**
1. Haga clic en **"Nuevo Modelo"**
2. Se crea automáticamente un modelo vacío

### **Paso 2: Configurar Encabezado**
1. Seleccione la pestaña **"Encabezado"**
2. Complete los campos obligatorios:
   - **Código Molde**: Identificador único (ej: "ZM001")
   - **Cliente**: Nombre del cliente (ej: "COPPEL")
   - **Color**: Color del calzado (ej: "NEGRO")
   - **Pares Solicitados**: Cantidad a producir (ej: "1448")
   - **Diseñadora**: Nombre de la diseñadora
   - **Semana**: Semana de producción
   - **Fecha**: Fecha de creación

3. Complete los campos técnicos:
   - **Categoría**: Mujer, Hombre, Niño, Unisex
   - **Estilo**: Sandalia, Zapato, Bota, Zapatilla, Mocasín, Botín
   - **Temporada**: Primavera, Verano, Otoño, Invierno
   - **Precio Objetivo**: Precio de venta deseado
   - **Estado**: Borrador → En Revisión → Aprobado → En Producción

### **Paso 3: Configurar Materiales**

#### **Agregar Materiales**
1. Seleccione la pestaña **"Materiales"**
2. Haga clic en **"Agregar Material"** en la parte inferior

#### **Campos por Material**
- **Tipo**: Seleccione el tipo de material
  - `upper`: Parte superior del calzado
  - `sole`: Suela
  - `lining`: Forro interior
  - `insole`: Plantilla
  - `heel`: Tacón
  - `accessory`: Accesorios
  - `packaging`: Empaque

- **Descripción**: Nombre del material (ej: "Cuero vacuno negro")
- **Nombre Técnico**: Especificación técnica (ej: "Cuero bovino curtido vegetal")
- **Proveedor**: Nombre del proveedor
- **Precio s/IVA**: Costo unitario sin impuestos
- **Precio Neto**: Costo final con descuentos
- **Un. Compra**: Unidad de compra (metros, kg, pares, etc.)
- **Ancho**: Ancho del material (para telas)
- **Consumo/Par**: Cantidad necesaria por par
- **Un. Consumo**: Unidad de consumo
- **Pedido Mín.**: Cantidad mínima de pedido
- **Tiempo Entrega**: Días para recibir el material

#### **Cálculos Automáticos**
- **Costo/Par**: Se calcula automáticamente
- **Presupuesto Total**: Costo total para todos los pares

### **Paso 4: Definir Ruta de Producción**

#### **Información General**
1. Seleccione la pestaña **"Ruta Producción"**
2. Configure:
   - **Nombre**: Nombre descriptivo de la ruta
   - **Eficiencia Esperada**: Porcentaje de eficiencia (%)
   - **Notas**: Información adicional

#### **Agregar Operaciones**
1. Haga clic en **"Agregar Operación"**
2. Complete por cada operación:
   - **Nombre**: Nombre de la operación (ej: "Corte de material")
   - **Descripción**: Detalles del proceso
   - **Secuencia**: Orden de ejecución (1, 2, 3...)
   - **Departamento**: Área responsable
   - **Máquina**: Equipo necesario
   - **Tiempo Estándar**: Minutos por par
   - **Tiempo de Setup**: Minutos de preparación
   - **Nivel de Habilidad**: Básico, Intermedio, Avanzado

### **Paso 5: Especificaciones Técnicas**

#### **Dimensiones**
1. Seleccione la pestaña **"Especificaciones"**
2. Configure dimensiones:
   - **Largo, Ancho, Alto**: Medidas del calzado
   - **Unidad**: cm, mm, pulgadas

#### **Peso**
- **Peso Objetivo**: Peso deseado por par
- **Tolerancia**: Margen aceptable
- **Unidad**: g, kg, oz, lb

#### **Estándares de Calidad**
- Haga clic en **"Agregar"** para cada estándar
- Ejemplos: ISO 9001, ASTM D-1000, estándares internos

#### **Requisitos de Pruebas**
- Ejemplos: Prueba de flexión, resistencia al desgaste, impermeabilidad

#### **Empaque y Cuidado**
- **Especificaciones de Empaque**: Detalles de caja, etiquetado
- **Instrucciones de Cuidado**: Lavado, mantenimiento

#### **Certificaciones**
- Certificaciones requeridas (ecológicas, de calidad, etc.)

### **Paso 6: Agregar Imágenes**
1. Seleccione la pestaña **"Imágenes"**
2. Arrastre imágenes o haga clic para seleccionar
3. Las imágenes se muestran en galería

### **Paso 7: Revisar Costos**
- En la pestaña **"Materiales"** verifique el **"Resumen de Costos"**
- Incluye: Materiales directos, Mano de obra, Gastos de fabricación, Costo total, Utilidad/pérdida

### **Paso 8: Guardar Modelo**
1. Haga clic en **"Guardar"** en la barra superior
2. El modelo se guarda en el sistema

---

# 🏭 **MÓDULO 2: CONTROL DE PRODUCCIÓN**

## **2.1 Navegación**
- Haga clic en **"Control de Producción"** en la barra superior
- Verá el dashboard con estadísticas generales

## **2.2 Dashboard Ejecutivo**
- **Órdenes Activas**: Número de órdenes en producción
- **Líneas Activas**: Número de líneas de producción operativas
- **Lotes Hoy**: Número de lotes procesados hoy
- **Defectos**: Número total de defectos encontrados

## **2.3 Gestionar Órdenes de Producción**

### **Crear Nueva Orden**
1. Seleccione la pestaña **"Órdenes"**
2. Haga clic en **"Nueva Orden"**
3. Se genera automáticamente un número de orden
4. Complete:
   - **Modelo**: Seleccione de la lista de modelos
   - **Cantidad**: Número de pares a producir
   - **Fecha Inicio**: Fecha de inicio planificada

### **Seguimiento de Órdenes**
- **Estado**: Visualice el estado actual
  - `planned`: Planificada
  - `in_progress`: En progreso
  - `completed`: Completada
  - `cancelled`: Cancelada
  - `on_hold`: En pausa

- **Prioridad**: Baja, Media, Alta, Urgente
- **Progreso**: Barra de progreso visual
- **Controles**:
  - ▶️ **Iniciar**: Cambia estado a "En progreso"
  - ⏸️ **Pausar**: Cambia estado a "En pausa"
  - ✅ **Completar**: Finaliza la orden

## **2.4 Configurar Líneas de Producción**

### **Crear Nueva Línea**
1. Seleccione la pestaña **"Líneas"**
2. Haga clic en **"Nueva Línea"**
3. Complete:
   - **Nombre**: Nombre identificativo (ej: "Línea A")
   - **Descripción**: Detalles de la línea
   - **Capacidad**: Pares por día

### **Información de Líneas**
- **Estado**: Activa, Mantenimiento, Inactiva
- **Eficiencia**: Porcentaje de eficiencia promedio
- **Modelo Asignado**: Modelo actualmente en producción

## **2.5 Gestionar Lotes de Producción**

### **Crear Nuevo Lote**
1. Seleccione la pestaña **"Lotes"**
2. Haga clic en **"Nuevo Lote"**
3. Seleccione una **Orden de Producción**
4. Especifique la **cantidad** del lote

### **Seguimiento de Lotes**
- **Número de Lote**: Identificador único
- **Estado**: Pendiente, En progreso, Completado, Rechazado
- **Estado de Calidad**: Pendiente, Aprobado, Rechazado
- **Controles**:
  - ✅ **Completar**: Marca como terminado
  - 🔍 **Control de Calidad**: Registra inspección

### **Vista de Tabla**
- Lista completa de todos los lotes
- Información: Número, Orden, Cantidad, Estado, Calidad, Acciones

## **2.6 Control de Calidad**

### **Registrar Inspecciones**
1. Seleccione la pestaña **"Calidad"**
2. En un lote, haga clic en el ícono de **"Control de Calidad"**
3. Complete:
   - **Inspector**: Nombre del inspector
   - **Estado**: Aprobado o Rechazado
   - **Defectos**: Número de defectos encontrados

### **Historial de Calidad**
- **Vista de Tabla**: Lista de todas las inspecciones
- **Información**: Lote, Inspector, Fecha, Resultado, Defectos
- **Estados**: Aprobado (verde), Rechazado (rojo)

---

## 📊 **REPORTES Y CONSULTAS**

### **Filtros Disponibles**
- Por fecha
- Por modelo
- Por estado
- Por línea de producción

### **Exportación**
- Botón **"Exportar PDF"** (pendiente de implementar)
- Datos en formato JSON (consola del navegador)

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes**

#### **No se guardan los cambios**
- **Solución**: Verifique conexión a internet
- **Verificación**: Los datos se almacenan localmente en el navegador

#### **Cálculos no se actualizan**
- **Solución**: Actualice la página (F5)
- **Verificación**: Los cálculos se hacen automáticamente al cambiar valores

#### **Imágenes no se cargan**
- **Solución**: Verifique tamaño del archivo (< 5MB)
- **Formatos**: JPG, PNG, GIF soportados

#### **No se puede crear orden**
- **Solución**: Asegúrese de tener modelos creados
- **Verificación**: Ir a "Ingeniería de Producto" y crear modelo

### **Soporte Técnico**
- **Email**: soporte@empresa.com
- **Teléfono**: (55) 1234-5678
- **Horario**: Lunes a Viernes, 9:00 - 18:00

---

## 📋 **GLOSARIO**

- **BOM**: Bill of Materials - Lista de materiales
- **Orden de Producción**: Documento que autoriza la fabricación
- **Lote**: Grupo de productos fabricados juntos
- **Ruta de Producción**: Secuencia de operaciones
- **Tiempo Estándar**: Tiempo promedio para completar una operación
- **Eficiencia**: Porcentaje de tiempo productivo vs tiempo disponible

---

## 🎯 **SIGUIENTES PASOS**

Después de completar las pruebas de la **Fase 1**, el sistema incluirá:

### **Fase 2 (Próximamente)**
- 📦 **Módulo de Inventario**: Control de stock
- 🔗 **API Gateway**: Integración con backend
- 📊 **Dashboard Avanzado**: Gráficos y reportes

### **Fase 3 (Próximamente)**
- 💰 **Módulo Financiero**: Contabilidad y presupuestos
- 👥 **Recursos Humanos**: Nóminas y capacitación
- 📋 **Calidad Avanzada**: Planes de control detallados

---

*Manual actualizado: $(date)*
*Versión: 1.0*
*Fase: 1 - Testing*

