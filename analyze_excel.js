const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = 'COPPEL BALERINA KELLY ESTILO 888887 NEGRO POR 1448 PRS.xlsx';

console.log('🔍 ANALIZANDO ARCHIVO EXCEL:', excelPath);
console.log('=====================================\n');

// Verificar que el archivo existe
if (!fs.existsSync(excelPath)) {
  console.error('❌ Archivo no encontrado:', excelPath);
  process.exit(1);
}

try {
  // Leer el archivo
  const workbook = XLSX.readFile(excelPath, {
    cellDates: true,
    cellNF: false,
    cellText: false
  });

  console.log('📊 INFORMACIÓN GENERAL:');
  console.log('- Hojas encontradas:', workbook.SheetNames.length);
  console.log('- Nombres de hojas:', workbook.SheetNames);
  console.log('');

  // Analizar cada hoja
  workbook.SheetNames.forEach((sheetName, sheetIndex) => {
    console.log(`📋 HOJA ${sheetIndex + 1}: "${sheetName}"`);
    console.log('=====================================');

    const worksheet = workbook.Sheets[sheetName];

    // Convertir a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: false
    });

    console.log(`- Total de filas: ${jsonData.length}`);
    console.log('');

    // Mostrar primeras 20 filas
    console.log('🔎 PRIMERAS 20 FILAS:');
    jsonData.slice(0, 20).forEach((row, index) => {
      const rowNum = index + 1;
      const cells = row.map(cell => `"${String(cell || '').trim()}"`).join(', ');
      console.log(`  Fila ${rowNum}: [${cells}]`);
    });

    console.log('');

    // Buscar posibles headers
    console.log('🎯 ANÁLISIS DE HEADERS POSIBLES:');
    for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
      const row = jsonData[i];
      if (!row || row.length < 3) continue;

      const rowText = row.map(cell => String(cell || '').toLowerCase().trim());
      const headerMatches = rowText.filter(text =>
        ['descripción', 'descripcion', 'material', 'proveedor', 'precio', 'costo', 'cantidad', 'unidad', 'ancho', 'consumo', 'color', 'nombre', 'total', 'subtotal'].includes(text)
      ).length;

      if (headerMatches >= 2) {
        console.log(`  → Posible header en fila ${i + 1}: ${headerMatches} matches`);
        console.log(`    Contenido: ${row.map(cell => `"${String(cell || '').trim()}"`).join(', ')}`);
      }
    }

    console.log('');

    // Buscar filas que parecen datos de materiales
    console.log('📦 ANÁLISIS DE FILAS CON DATOS:');
    let dataRowsFound = 0;
    for (let i = 0; i < Math.min(jsonData.length, 30); i++) {
      const row = jsonData[i];
      if (!row || row.length < 3) continue;

      const firstCell = String(row[0] || '').trim();
      const secondCell = String(row[1] || '').trim();

      // Verificar si parece fila de datos (no header)
      const seemsLikeData =
        firstCell.length > 3 && // Descripción sustancial
        firstCell !== firstCell.toUpperCase() && // No todo mayúsculas
        secondCell.length > 1 && // Tiene segunda columna
        !['descripción', 'descripcion', 'material', 'proveedor', 'precio', 'total'].includes(firstCell.toLowerCase());

      if (seemsLikeData && dataRowsFound < 5) {
        dataRowsFound++;
        console.log(`  → Datos detectados en fila ${i + 1}:`);
        console.log(`    "${firstCell}" | "${secondCell}" | ${row.slice(2, 5).map(cell => `"${String(cell || '')}"`).join(' | ')}`);
      }
    }

    console.log('');
    console.log('🔚 FIN DEL ANÁLISIS DE ESTA HOJA');
    console.log('=====================================\n');
  });

} catch (error) {
  console.error('❌ Error al analizar el archivo:', error);
  process.exit(1);
}

console.log('✅ ANÁLISIS COMPLETADO');
console.log('Basado en este análisis, ajustaré el código del ExcelImporter.');
