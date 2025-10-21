#!/bin/bash

echo "🚀 Configuración del repositorio GitHub para el Sistema de Control de Producción de Calzado"
echo ""

# Verificar si ya existe un repositorio git
if [ -d ".git" ]; then
    echo "✅ Repositorio Git ya existe"
else
    echo "📝 Inicializando repositorio Git..."
    git init
fi

# Agregar todos los archivos
echo "📦 Agregando archivos al repositorio..."
git add .

# Crear commit inicial
echo "💾 Creando commit inicial..."
git commit -m "🎉 Sistema de Control de Producción de Calzado - Fase 1

✨ Características implementadas:
- Gestión completa de modelos de calzado
- Explosión de materiales con cálculos automáticos
- Rutas de producción detalladas
- Especificaciones técnicas completas
- Módulo de control de producción
- Persistencia de datos con Firebase
- Interfaz moderna con Tailwind CSS

🛠️ Tecnologías:
- React 19 + TypeScript
- Vite + Vercel (despliegue)
- Firebase (base de datos)
- Zustand (gestión de estado)
- Tailwind CSS (estilos)

📚 Documentación incluida:
- Manual completo del usuario
- Guía de despliegue paso a paso
- Datos de ejemplo para testing"

# Mostrar estado
echo ""
echo "📊 Estado del repositorio:"
git status

echo ""
echo "🔗 Próximos pasos:"
echo "1. Crea un repositorio en GitHub: https://github.com/new"
echo "2. Copia la URL del repositorio"
echo "3. Ejecuta: git remote add origin TU_URL_DEL_REPOSITORIO"
echo "4. Ejecuta: git push -u origin main"
echo ""
echo "📖 Para más detalles, consulta: DEPLOYMENT_README.md"
