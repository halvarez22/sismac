# 🚀 Guía de Despliegue - Sistema de Control de Producción de Calzado

## 📋 Requisitos Previos

- Cuenta de [Firebase](https://firebase.google.com/) (gratuita)
- Cuenta de [GitHub](https://github.com/) (gratuita)
- Cuenta de [Vercel](https://vercel.com/) (gratuita)

---

## 🔥 1. Configuración de Firebase

### 1.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombre: `calzado-produccion-[tu-nombre]`
4. Habilita Google Analytics (opcional)
5. Elige cuenta de Google
6. Espera a que se cree el proyecto

### 1.2 Habilitar Firestore Database

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Elige **"Comenzar en modo de producción"**
4. Selecciona ubicación: `nam5 (us-central)` o la más cercana a ti
5. Haz clic en **"Listo"**

### 1.3 Configurar Reglas de Seguridad

En **"Firestore Database"** → **"Reglas"**, reemplaza las reglas por defecto con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura para todos (para testing)
    // ⚠️  IMPORTANTE: Cambiar esto en producción
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 1.4 Obtener las Credenciales

1. Ve a **"Configuración del proyecto"** (ícono de engranaje)
2. Baja hasta **"Tus apps"**
3. Haz clic en **"</>"** (Web app)
4. Nombre de la app: `Calzado App`
5. **IMPORTANTE:** Marca la casilla **"También configurar Firebase Hosting"**
6. Copia la configuración que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## 🐙 2. Configuración de GitHub

### 2.1 Crear Repositorio

1. Ve a [GitHub.com](https://github.com/)
2. Haz clic en **"New repository"**
3. Nombre: `sistema-calzado-produccion`
4. Descripción: `Sistema de control de producción de calzado con IA`
5. Elige **"Public"** (para que Vercel pueda acceder)
6. **NO marques** "Add a README file"
7. Haz clic en **"Create repository"**

### 2.2 Subir el Código

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - Sistema de control de producción de calzado"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/sistema-calzado-produccion.git

# Subir el código
git push -u origin main
```

---

## ⚙️ 3. Configuración de Variables de Entorno

### 3.1 Crear archivo .env.local

Crea un archivo llamado `.env.local` en la raíz del proyecto y pega tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyBpPP2uuwGtLqsWZXZYVH0AhjrT6upzM6I
VITE_FIREBASE_AUTH_DOMAIN=sismac-6e1cb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sismac-6e1cb
VITE_FIREBASE_STORAGE_BUCKET=sismac-6e1cb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=384307836083
VITE_FIREBASE_APP_ID=1:384307836083:web:d6c41cde99dddbcb35acc6
```

### 3.2 Probar Localmente

```bash
npm run dev
```

Si todo funciona, deberías ver la aplicación en `http://localhost:3000`

---

## ▲ 4. Despliegue en Vercel

### 4.1 Conectar GitHub con Vercel

1. Ve a [Vercel.com](https://vercel.com/)
2. Haz clic en **"Sign Up"** o **"Log in"**
3. Conecta tu cuenta de GitHub
4. Autoriza el acceso a repositorios

### 4.2 Importar el Proyecto

1. Haz clic en **"New Project"**
2. Busca tu repositorio: `sistema-calzado-produccion`
3. Haz clic en **"Import"**

### 4.3 Configurar Variables de Entorno en Vercel

1. En el proyecto de Vercel, ve a **"Settings"** → **"Environment Variables"**
2. Agrega cada variable de entorno:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBpPP2uuwGtLqsWZXZYVH0AhjrT6upzM6I` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `sismac-6e1cb.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `sismac-6e1cb` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `sismac-6e1cb.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `384307836083` |
| `VITE_FIREBASE_APP_ID` | `1:384307836083:web:d6c41cde99dddbcb35acc6` |

3. Haz clic en **"Save"**

### 4.4 Desplegar

1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"Redeploy"** (o espera a que se despliegue automáticamente)
3. Una vez completado, verás una URL como: `https://sistema-calzado-produccion.vercel.app`

---

## ✅ 5. Verificación del Despliegue

### 5.1 Probar la Aplicación

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la pantalla de carga y luego la aplicación
3. Prueba crear un modelo nuevo
4. Los datos deberían guardarse automáticamente en Firebase

### 5.2 Verificar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **"Firestore Database"**
4. Deberías ver las colecciones: `models`, `productionOrders`, etc.

---

## 🔧 6. Solución de Problemas

### Error: "Firebase config not found"
- Verifica que las variables de entorno en Vercel estén correctas
- Asegúrate de que empiecen con `VITE_`

### Error: "Cannot read properties of undefined"
- Espera a que termine la carga inicial (pantalla de carga)
- Si persiste, verifica la conexión a internet

### Error: "Missing or insufficient permissions"
- Revisa las reglas de Firestore (deben permitir read/write para testing)

### La aplicación no carga
- Verifica que el build de Vercel fue exitoso
- Revisa los logs de Vercel en "Functions" → "Logs"

---

## 📊 7. Monitoreo y Analytics

### Firebase Analytics (Opcional)
1. En Firebase Console → "Analytics" → "Dashboard"
2. Verás métricas de uso de tu aplicación

### Vercel Analytics
1. En Vercel → Tu proyecto → "Analytics"
2. Verás rendimiento y uso de la aplicación

---

## 🎯 8. Poblar con Datos de Ejemplo

### Para Testing Inicial

Después de configurar Firebase y desplegar en Vercel, puedes poblar la base de datos con datos de ejemplo.

#### Opción A: Desde el Navegador (Fácil)
1. Abre la aplicación desplegada en Vercel
2. Abre la consola del navegador (F11 → Console)
3. Copia y pega este código:

```javascript
// Importar función de datos de ejemplo
import('./utils/sampleData.js').then(module => {
  module.populateSampleData().then(() => {
    console.log('Datos cargados! Recarga la página.');
    window.location.reload();
  });
});
```

#### Opción B: Ejecutar Localmente
1. Clona el repositorio localmente
2. Configura las variables de entorno (.env.local)
3. Ejecuta:

```bash
npm run dev
```

4. Abre la consola del navegador y ejecuta el código de arriba

### ¿Qué incluye la data de ejemplo?
- ✅ **2 modelos completos** (Sandalias y Zapatos)
- ✅ **Materiales detallados** con costos calculados
- ✅ **Rutas de producción** con operaciones
- ✅ **Especificaciones técnicas**
- ✅ **Órdenes de producción activas**
- ✅ **Líneas de producción**
- ✅ **Lotes en proceso**
- ✅ **Controles de calidad**

---

## 🧪 9. Testing en Producción

### Checklist de Verificación

- [ ] Aplicación carga correctamente
- [ ] Datos se guardan en Firebase
- [ ] Modelos se crean y editan
- [ ] Cálculos funcionan correctamente
- [ ] No hay errores en la consola
- [ ] Responsive en móvil
- [ ] Modo oscuro funciona

### Usuarios de Testing

Comparte estos enlaces con tus testers:
- **Aplicación principal**: `https://tu-proyecto.vercel.app`
- **Firebase Console**: Para ver los datos en tiempo real
- **Vercel Dashboard**: Para ver logs y rendimiento

---

## 🚀 8. Próximos Pasos

Una vez que funcione la **Fase 1**, puedes:

### Fase 1.5: Mejoras Inmediatas
- ✅ **Persistenia de datos** (ya implementada)
- ⏳ **Sistema de backups automáticos**
- ⏳ **Validación de datos en tiempo real**

### Fase 2: IA Integrada
- 🤖 **Sugerencias inteligentes de materiales**
- 📊 **Predicción de demanda**
- 🖼️ **Análisis automático de imágenes**

### Fase 3: Producción Avanzada
- 👥 **Sistema de usuarios y permisos**
- 📱 **Aplicación móvil**
- 🔗 **Integración con ERP industrial**

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Verifica los logs de Vercel y Firebase
3. Contacta: soporte@empresa.com

**¡Tu aplicación está lista para pruebas en producción! 🎉**</contents>
</xai:function_call<parameter name="file_path">DEPLOYMENT_README.md
