const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx';

console.log('🔍 ANALIZANDO ARCHIVO EXCEL VAZZA:');
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

    // Mostrar primeras 25 filas (más que antes para ver más datos)
    console.log('🔎 PRIMERAS 25 FILAS:');
    jsonData.slice(0, 25).forEach((row, index) => {
      const rowNum = index + 1;
      const cells = row.map(cell => `"${String(cell || '').trim()}"`).join(', ');
      console.log(`  Fila ${rowNum}: [${cells}]`);
    });

    console.log('');

    // Buscar filas que contengan los términos específicos mencionados
    console.log('🎯 BÚSQUEDA DE TÉRMINOS ESPECÍFICOS:');
    const searchTerms = [
      'transfer plantilla', 'nom 20', 'horma', 'hilo corte', 'hilo forro',
      'vazza', 'nom 02013501', 'polet', 'blanco', 'blnco', 'oro',
      'en lengua', 'corte sintetico', 'codigo gallo', 'suela sintetica',
      'hilo paloma', 'codigo #4', 'aplicaciones laterales'
    ];

    jsonData.forEach((row, index) => {
      const rowText = row.map(cell => String(cell || '').toLowerCase().trim()).join(' ');

      const foundTerms = searchTerms.filter(term =>
        rowText.includes(term.toLowerCase())
      );

      if (foundTerms.length > 0) {
        console.log(`  ✅ Fila ${index + 1} contiene: ${foundTerms.join(', ')}`);
        console.log(`     Contenido: ${row.map(cell => `"${String(cell || '').trim()}"`).join(' | ')}`);
        console.log('');
      }
    });

    // Análisis específico de estructura de datos
    console.log('🔧 ANÁLISIS DE ESTRUCTURA:');

    // Buscar fila de headers
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
      const row = jsonData[i];
      if (!row || row.length < 5) continue;

      const rowText = row.map(cell => String(cell || '').toLowerCase().trim());
      const headerCount = rowText.filter(text =>
        ['descripción', 'descripcion', 'material', 'proveedor', 'precio', 'costo', 'cantidad', 'unidad', 'ancho', 'consumo', 'color', 'nombre'].includes(text)
      ).length;

      if (headerCount >= 3) {
        headerRowIndex = i;
        console.log(`  📋 Headers detectados en fila ${i + 1}`);
        console.log(`     Headers: ${row.map(cell => `"${String(cell || '').trim()}"`).join(' | ')}`);
        break;
      }
    }

    // Analizar filas de datos
    if (headerRowIndex >= 0) {
      const dataRows = jsonData.slice(headerRowIndex + 1);
      console.log(`  📦 Filas de datos encontradas: ${dataRows.length}`);

      // Mostrar algunas filas de datos como ejemplo
      console.log('  💡 EJEMPLOS DE FILAS DE DATOS:');
      dataRows.slice(0, 5).forEach((row, index) => {
        if (row && row.length >= 3) {
          console.log(`     Fila ${headerRowIndex + 2 + index}: ${row.slice(0, 5).map(cell => `"${String(cell || '').trim()}"`).join(' | ')}`);
        }
      });
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
console.log('El archivo VAZZA ha sido analizado completamente.');
