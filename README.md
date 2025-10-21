# 🏭 SISMAC - Sistema Inteligente de Suministro y Materiales para Calzado

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/halvarez22/sismac)

Sistema ERP/MRP integral diseñado específicamente para optimizar la cadena de suministro en la industria del calzado. Centraliza la gestión de inventarios, planificación de producción, abastecimiento y finanzas con inteligencia artificial integrada.

## ✨ Características Principales

### 🏗️ **Ingeniería de Producto**
- **Gestión de Modelos**: Crear y gestionar diseños de calzado
- **Explosión de Materiales**: Cálculos automáticos de costos y cantidades
- **Rutas de Producción**: Definir procesos de fabricación detallados
- **Especificaciones Técnicas**: Dimensiones, pesos, estándares de calidad
- **Control de Versiones**: Historial de cambios y aprobaciones

### 🏭 **Control de Producción**
- **Órdenes de Producción**: Gestionar pedidos y programar fabricación
- **Líneas de Producción**: Configurar y monitorear capacidad
- **Lotes de Producción**: Seguimiento de tandas de fabricación
- **Control de Calidad**: Inspecciones y reportes de defectos

### 📊 **Características Técnicas**
- **Persistencia de Datos**: Firebase para almacenamiento en la nube
- **Interfaz Moderna**: React + TypeScript + Tailwind CSS
- **Responsive**: Funciona en desktop y móvil
- **Modo Oscuro**: Interfaz adaptable
- **Cálculos Automáticos**: Costos, tiempos y eficiencia

## 🚀 Inicio Rápido

### Opción 1: Despliegue Automático (Recomendado)

1. **Haz clic en el botón "Deploy with Vercel"** arriba
2. **Conecta tu cuenta de GitHub**
3. **Configura Firebase** (sigue los pasos en `DEPLOYMENT_README.md`)
4. **¡Listo!** Tu app estará online en segundos

### Opción 2: Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/halvarez22/sismac.git
cd sismac

# Instalar dependencias
npm install

# Configurar Firebase
cp firebase-config-example.js src/firebase.ts
# Edita src/firebase.ts con tus credenciales de Firebase

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📋 Requisitos del Sistema

- **Node.js**: 18+ recomendado
- **Navegador**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Firebase**: Cuenta gratuita para base de datos
- **GitHub**: Para control de versiones

## 📚 Documentación

- **[Manual del Usuario](MANUAL_USUARIO_COMPLETO.md)**: Guía completa paso a paso
- **[Guía de Despliegue](DEPLOYMENT_README.md)**: Cómo configurar Firebase y Vercel
- **[Tipos de Datos](types.ts)**: Estructura técnica del proyecto

## 🎯 Casos de Uso

### Para Diseñadores
- Crear nuevos modelos con especificaciones detalladas
- Calcular costos automáticamente
- Gestionar versiones y aprobaciones

### Para Gerentes de Producción
- Programar órdenes de fabricación
- Monitorear líneas de producción
- Controlar calidad y defectos

### Para Compras
- Gestionar proveedores y materiales
- Optimizar pedidos mínimos
- Controlar tiempos de entrega

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19**: Framework moderno para interfaces
- **TypeScript**: JavaScript con tipos estáticos
- **Vite**: Bundler ultra-rápido
- **Tailwind CSS**: Framework CSS utility-first

### Backend & Base de Datos
- **Firebase Firestore**: Base de datos NoSQL en la nube
- **Firebase Hosting**: Hosting gratuito y CDN
- **Groq API**: Inteligencia artificial para análisis y sugerencias

### Estado y Lógica
- **Zustand**: Gestión de estado simple y poderosa
- **React Hooks**: Lógica reutilizable

### Utilidades
- **Lucide React**: Iconos modernos y consistentes
- **UUID**: Generación de identificadores únicos
- **JSZip**: Manejo de archivos comprimidos
- **XLSX**: Procesamiento de archivos Excel

## 📈 Roadmap

### ✅ Fase 1 - Completada
- Sistema básico de gestión de modelos
- Persistencia de datos con Firebase
- Despliegue en Vercel
- Documentación completa

### 🚧 Fase 2 - Próximamente
- **IA integrada**: Sugerencias inteligentes de materiales
- **Análisis predictivo**: Predicción de demanda
- **Sistema de usuarios**: Autenticación y permisos

### 🔮 Fase 3 - Futuro
- **Aplicación móvil**: React Native
- **Integraciones ERP**: Conexión con sistemas existentes
- **Analytics avanzado**: Reportes y dashboards

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Email**: soporte@empresa.com
- **Issues**: [GitHub Issues](https://github.com/halvarez22/sismac/issues)
- **Documentación**: Consulta los archivos `MANUAL_USUARIO_COMPLETO.md` y `DEPLOYMENT_README.md`

---

**Desarrollado con ❤️ para la industria del calzado**

*¿Necesitas ayuda? Revisa la documentación o abre un issue en GitHub.*

---

**Última actualización: $(date)** - SISMAC v1.0 - Listo para producción