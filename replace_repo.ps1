# Script para reemplazar completamente el contenido del repositorio SISMAC
# con la nueva aplicación de catálogo de modelos

Write-Host "🚀 Iniciando reemplazo completo del repositorio SISMAC..." -ForegroundColor Green

# Definir rutas
$sourceDir = Get-Location
$targetDir = Join-Path $sourceDir "temp_sismac_check\nueva_version_sismac"

Write-Host "Directorio fuente: $sourceDir" -ForegroundColor Yellow
Write-Host "Directorio destino: $targetDir" -ForegroundColor Yellow

# Verificar que el directorio destino existe
if (!(Test-Path $targetDir)) {
    Write-Host "❌ Error: El directorio destino no existe" -ForegroundColor Red
    exit 1
}

# Lista de archivos y directorios a copiar (excluyendo los que no queremos)
$itemsToCopy = @(
    "App.tsx",
    "index.tsx",
    "index.html",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "vercel.json",
    "firebase-config-example.js",
    "components",
    "store",
    "src",
    "hooks",
    "README.md",
    "DEPLOYMENT_README.md",
    "MANUAL_USUARIO_COMPLETO.md",
    "GUIA_TESTING_FASE1.md",
    "PLAN_PROYECTO_CONTROL_PRODUCCION_CALZADO.md",
    "types.ts",
    "metadata.json"
)

# Copiar archivos uno por uno
foreach ($item in $itemsToCopy) {
    $sourcePath = Join-Path $sourceDir $item
    $destPath = Join-Path $targetDir $item

    if (Test-Path $sourcePath) {
        Write-Host "Copiando: $item" -ForegroundColor Cyan
        if (Test-Path $destPath) {
            Remove-Item $destPath -Recurse -Force
        }
        Copy-Item $sourcePath $destPath -Recurse -Force
    } else {
        Write-Host "⚠️  No encontrado: $item" -ForegroundColor Yellow
    }
}

# Limpiar archivos innecesarios del directorio destino
$filesToRemove = @(
    "*.js",
    "*.bat",
    "*.exe",
    "*.log"
)

foreach ($pattern in $filesToRemove) {
    Get-ChildItem -Path $targetDir -Filter $pattern -File | Remove-Item -Force
}

Write-Host "✅ Reemplazo completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Revisar el contenido en: temp_sismac_check/nueva_version_sismac" -ForegroundColor White
Write-Host "2. Ejecutar: cd temp_sismac_check/nueva_version_sismac && npm install" -ForegroundColor White
Write-Host "3. Probar: npm run dev" -ForegroundColor White
Write-Host "4. Si todo funciona: git add . && git commit -m 'Nueva versión completa' && git push" -ForegroundColor White
Write-Host ""
Write-Host "🎯 El backup de la versión anterior está en: backup_old_version/" -ForegroundColor Magenta
