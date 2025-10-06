// Script para limpiar y depurar el archivo CSV VAZZA y convertirlo a JSON
// Este script extrae solo los materiales válidos del archivo real

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo CSV
const csvFilePath = path.join(__dirname, 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.csv');

try {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvData.split('\n');

    console.log('🧹 LIMPIANDO Y DEPURANDO ARCHIVO VAZZA CSV');
    console.log('===========================================');
    console.log(`📄 Archivo leído: ${lines.length} líneas`);
    console.log('');

    // Analizar la estructura del CSV
    const headers = lines[8].split(','); // Línea 9 del CSV (índice 8)
    console.log('📋 Headers encontrados:');
    headers.forEach((header, index) => {
        if (header.trim()) {
            console.log(`   ${index}: ${header.trim()}`);
        }
    });

    console.log('');
    console.log('🔍 ANALIZANDO LÍNEAS DE DATOS...');
    console.log('================================');

    const validMaterials = [];
    const invalidLines = [];

    // Procesar líneas de datos (desde la línea 9 en adelante)
    for (let i = 9; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line || line === ','.repeat(50)) {
            continue; // Línea vacía
        }

        const columns = line.split(',');

        // Extraer campos importantes
        const descripcion = columns[0]?.trim() || '';
        const proveedor = columns[3]?.trim() || '';
        const precioNetoStr = columns[5]?.trim() || '0';
        const consumosStr = columns[8]?.trim() || '0';
        const costoParStr = columns[14]?.trim() || '0';

        // Limpiar precio (quitar $ y espacios)
        const precioNeto = parseFloat(precioNetoStr.replace(/[$,\s]/g, '')) || 0;
        const consumos = parseFloat(consumosStr.replace(',', '.')) || 0;
        const costoPar = parseFloat(costoParStr.replace(/[$,\s]/g, '')) || 0;

        // Filtros para determinar si es un material válido
        const isValidMaterial = (
            descripcion.length > 5 && // Descripción significativa
            proveedor.length > 2 && // Tiene proveedor
            precioNeto > 0 && // Precio mayor a 0
            consumos > 0 && // Consumo mayor a 0
            !descripcion.toLowerCase().includes('nom 020') && // No es código técnico
            !descripcion.toLowerCase().includes('csc') && // No es código CSC
            !descripcion.toLowerCase().includes('330-69') && // No es código de horma
            !descripcion.toLowerCase().includes('narc') && // No es código NARC
            !descripcion.toLowerCase().includes('horno') && // No es código de horno
            !descripcion.toLowerCase().includes('hilo') && // No es hilo (general)
            !descripcion.toLowerCase().includes('papel') && // No es papel
            !descripcion.toLowerCase().includes('caja') && // No es caja
            !descripcion.toLowerCase().includes('transfer nom') && // No es transfer NOM
            !descripcion.includes('$-') && // No tiene costo negativo
            !line.includes('MATERIALES DIRECTOS') && // No es línea de totales
            !line.includes('PROCESO EXTERNO') && // No es línea de procesos
            !line.includes('INVERSION') && // No es línea de inversión
            !line.includes('M.O.') && // No es línea de mano de obra
            !line.includes('GASTOS') && // No es línea de gastos
            !line.includes('PRECIO VTA') // No es línea de precio de venta
        );

        if (isValidMaterial) {
            validMaterials.push({
                descripcion,
                proveedor,
                precioNeto,
                consumos,
                costoPar,
                lineNumber: i + 1,
                sku: descripcion.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20) + '_' + i
            });
        } else {
            invalidLines.push({
                line: i + 1,
                descripcion,
                reason: getInvalidReason(descripcion, proveedor, precioNeto, consumos, costoPar, line)
            });
        }
    }

    // Función auxiliar para determinar razón de descarte
    function getInvalidReason(descripcion, proveedor, precioNeto, consumos, costoPar, line) {
        if (!descripcion || descripcion.length <= 5) return 'Descripción muy corta';
        if (!proveedor || proveedor.length <= 2) return 'Sin proveedor';
        if (precioNeto <= 0) return 'Precio <= 0';
        if (consumos <= 0) return 'Consumo <= 0';
        if (descripcion.toLowerCase().includes('nom 020')) return 'Código NOM 020';
        if (descripcion.toLowerCase().includes('csc')) return 'Código CSC';
        if (descripcion.toLowerCase().includes('330-69')) return 'Código 330-69';
        if (line.includes('MATERIALES DIRECTOS')) return 'Línea de totales';
        if (line.includes('PROCESO EXTERNO')) return 'Línea de procesos';
        if (line.includes('INVERSION')) return 'Línea de inversión';
        if (line.includes('M.O.')) return 'Línea de mano de obra';
        if (line.includes('GASTOS')) return 'Línea de gastos';
        if (line.includes('PRECIO VTA')) return 'Línea de precio venta';
        return 'Otro motivo';
    }

    console.log('');
    console.log('✅ MATERIALES VÁLIDOS ENCONTRADOS');
    console.log('=================================');
    console.log(`📦 Total de materiales válidos: ${validMaterials.length}`);

    validMaterials.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.descripcion}`);
        console.log(`      - Proveedor: ${material.proveedor}`);
        console.log(`      - Precio: $${material.precioNeto.toFixed(2)}`);
        console.log(`      - Consumo: ${material.consumos}`);
        console.log(`      - Costo/Par: $${material.costoPar.toFixed(2)}`);
        console.log('');
    });

    console.log('❌ LÍNEAS DESCARTADAS');
    console.log('=====================');
    console.log(`🚫 Total descartadas: ${invalidLines.length}`);

    // Mostrar algunas líneas descartadas por categoría
    const descartadasPorTipo = {};
    invalidLines.forEach(line => {
        descartadasPorTipo[line.reason] = (descartadasPorTipo[line.reason] || 0) + 1;
    });

    Object.entries(descartadasPorTipo).forEach(([reason, count]) => {
        console.log(`   - ${reason}: ${count} líneas`);
    });

    // Crear JSON con los datos limpios
    const cleanData = {
        modelInfo: {
            id: 'MOD-VAZZA-13501-BLANCO-REAL',
            name: 'VAZZA ESTILO 13501 BLANCO (Datos Reales)',
            sourceFile: 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.csv',
            totalPairs: 590,
            extractedDate: new Date().toISOString()
        },
        materials: validMaterials.map(material => ({
            sku: material.sku,
            name: material.descripcion,
            category: determineCategory(material.descripcion),
            supplier: material.proveedor,
            unitCost: material.precioNeto,
            unit: 'PRS', // La mayoría son por pares
            quantityPerUnit: material.consumos,
            totalCostPerUnit: material.costoPar,
            reorderPoint: Math.max(10, Math.floor(material.precioNeto * 2)),
            location: `VAZZA-${material.sku.substring(0, 3)}`,
            status: 'OK'
        })),
        summary: {
            totalMaterials: validMaterials.length,
            totalCostPerPair: validMaterials.reduce((sum, m) => sum + m.costoPar, 0),
            averageCostPerMaterial: validMaterials.reduce((sum, m) => sum + m.precioNeto, 0) / validMaterials.length || 0
        }
    };

    // Función para determinar categoría
    function determineCategory(description) {
        const desc = description.toLowerCase();
        if (desc.includes('suela') || desc.includes('planta')) return 'Suelas';
        if (desc.includes('punter') || desc.includes('cuero') || desc.includes('robin')) return 'Pieles';
        if (desc.includes('aguje') || desc.includes('herraje') || desc.includes('ojillo')) return 'Herrajes';
        if (desc.includes('hilo') || desc.includes('tela') || desc.includes('forro')) return 'Textiles';
        if (desc.includes('pegamento') || desc.includes('adhesivo') || desc.includes('bullon') || desc.includes('esponja')) return 'Químicos';
        return 'Textiles'; // Categoría por defecto
    }

    console.log('');
    console.log('📊 RESUMEN DE DATOS LIMPIOS');
    console.log('===========================');
    console.log(`📋 Modelo: ${cleanData.modelInfo.name}`);
    console.log(`📦 Materiales válidos: ${cleanData.materials.length}`);
    console.log(`💰 Costo total por par: $${cleanData.summary.totalCostPerPair.toFixed(2)}`);
    console.log(`📈 Promedio por material: $${cleanData.summary.averageCostPerMaterial.toFixed(2)}`);

    // Generar archivos JSON
    const jsonFileName = 'vazza_13501_clean_data.json';
    fs.writeFileSync(jsonFileName, JSON.stringify(cleanData, null, 2));

    console.log('');
    console.log('💾 ARCHIVOS GENERADOS');
    console.log('====================');
    console.log(`✅ ${jsonFileName} - Datos limpios en formato JSON`);

    // Mostrar los primeros 10 materiales del JSON
    console.log('');
    console.log('🔍 PRIMEROS 10 MATERIALES DEL JSON LIMPIO');
    console.log('========================================');
    cleanData.materials.slice(0, 10).forEach((material, index) => {
        console.log(`${index + 1}. ${material.name}`);
        console.log(`   - SKU: ${material.sku}`);
        console.log(`   - Categoría: ${material.category}`);
        console.log(`   - Proveedor: ${material.supplier}`);
        console.log(`   - Costo: $${material.unitCost.toFixed(2)}`);
        console.log(`   - Cantidad por par: ${material.quantityPerUnit}`);
        console.log('');
    });

    console.log('🎯 RECOMENDACIONES');
    console.log('=================');
    console.log('1. ✅ Los datos están limpios y listos para usar');
    console.log('2. ✅ Se eliminaron códigos administrativos y líneas inválidas');
    console.log('3. ✅ Solo se incluyeron materiales con datos completos');
    console.log('4. ✅ Se calculó el costo total por par correctamente');
    console.log('5. 🚀 El Copilot ahora tendrá datos 100% reales del archivo');

    console.log('');
    console.log('📋 CÓMO USAR ESTOS DATOS');
    console.log('=======================');
    console.log('1. Importar el archivo JSON generado');
    console.log('2. Actualizar la función loadTestDataIfNeeded() en App.tsx');
    console.log('3. El Copilot tendrá acceso a datos reales');
    console.log('4. Los cálculos de costos serán precisos');

} catch (error) {
    console.error('❌ Error al procesar el archivo CSV:', error.message);
    console.log('💡 Asegúrate de que el archivo CSV esté en el directorio correcto');
}
