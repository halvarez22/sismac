# Usuarios y Contraseñas de Prueba para SISMAC

Este documento contiene las credenciales de acceso para los diferentes roles de usuario definidos en el sistema SISMAC. Utilice estas credenciales para probar la funcionalidad de la aplicación desde la perspectiva de cada perfil.

| Rol | Usuario (Login) | Contraseña | Acceso y Funcionalidades Específicas |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `password` | **Acceso Total**<br>- Gestiona usuarios: crear, editar, eliminar, activar/desactivar<br>- Acceso a todos los módulos<br>- Configuración del sistema<br>- Copilot de IA disponible<br>- Dashboard ejecutivo completo |
| **Gerente** | `gerente` | `password` | **Visión 360° Estratégica**<br>- Dashboard con KPIs completos y perspectivas IA<br>- Acceso a todos los módulos operativos<br>- Copilot de IA para análisis avanzados<br>- Vista de órdenes de producción y compra<br>- Análisis de rendimiento de proveedores<br>- Exportación de datos ejecutivos |
| **Ingeniero de Producto** | `jgarcia` | `sismac123` | **Gestión de Productos**<br>- CRUD completo de modelos de producto<br>- Carga automática de BOM VAZZA<br>- Validación inteligente de materiales<br>- Gestión de listas de materiales (BOM)<br>- Sugerencias IA de materiales sustitutos<br>- Dashboard básico + Copilot disponible |
| **Comprador** | `ana.c` | `password` | **Gestión de Compras**<br>- Bandeja de sugerencias MRP<br>- Creación y seguimiento de órdenes de compra<br>- Alertas IA de costos elevados<br>- Análisis comparativo de proveedores<br>- Dashboard básico + Copilot disponible<br>- Gestión de recepción de materiales |
| **Almacenista**| `juan.a` | `password` | **Control de Inventario**<br>- Gestión completa de movimientos de stock<br>- Registro de entradas, salidas y ajustes<br>- Dashboard de inventario con alertas IA<br>- Análisis de rotación y lento movimiento<br>- Copilot disponible para consultas<br>- **Nota: Usuario Inactivo por defecto** |
| **Planificador**| `plan` | `sismac123` | **Orquestación de Producción**<br>- Creación y gestión de órdenes de producción<br>- Validación automática de inventario<br>- Generación de sugerencias de compra<br>- Cálculo automático de BOM<br>- Dashboard básico + Copilot disponible<br>- Seguimiento de estado de producción |

---

## 📋 **INFORMACIÓN ADICIONAL**

### **Navegación por Roles**
- **Menú Lateral Dinámico:** Se adapta automáticamente según el rol del usuario
- **Acceso Restringido:** Los usuarios solo ven los módulos autorizados
- **Copilot Disponible:** Asistente de IA disponible para todos los roles (excepto cuando no hay API configurada)

### **Datos de Prueba Incluidos**
- **Modelo VAZZA 13501 BLANCO:** Datos de ejemplo cargados automáticamente
- **Materiales de Inventario:** 5 materiales reales con precios y proveedores
- **BOM Completo:** Lista de materiales con consumos por unidad

### **Recomendaciones de Testing**
1. **Admin:** Pruebe la gestión de usuarios y todos los módulos
2. **Gerente:** Verifique el dashboard ejecutivo y análisis de IA
3. **Ingeniero:** Pruebe carga de BOM VAZZA y gestión de modelos
4. **Comprador:** Gestione órdenes de compra y valide alertas de costo
5. **Almacenista:** Registre movimientos y revise análisis de inventario
6. **Planificador:** Cree órdenes de producción y valide MRP

### **Notas Importantes**
- **Persistencia:** Todos los datos se guardan en localStorage del navegador
- **Reinicio:** Si necesita datos limpios, refresque la página (F5)
- **API de IA:** Si no está configurada, el Copilot funciona en modo demo
- **Consola:** Use F12 para ver logs detallados en caso de problemas

### **Soporte y Troubleshooting**
- **Logs del Sistema:** Abra F12 → Console para ver mensajes del sistema
- **Estado de Usuario:** Verifique que el usuario esté "Activo" en Administración
- **Datos Perdidos:** Use los scripts de carga de datos si es necesario
