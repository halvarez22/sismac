// Script de prueba para debugging del parsing Excel
// Ejecutar desde la consola del navegador: testVazzaExcelParsing()

console.log('🧪 Script de prueba Vazza Excel cargado');
console.log('💡 Para probar el parsing, ejecuta: testVazzaExcelParsing()');
console.log('💡 Para ver datos del archivo, ejecuta: analyzeExcelStructure()');

window.testVazzaExcelParsing = async () => {
    console.log('🧪 Iniciando test de parsing Excel...');

    try {
        const response = await fetch('/VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log('✅ Archivo descargado:', { size: blob.size, type: blob.type });

        if (blob.size === 0) {
            throw new Error('El archivo está vacío');
        }

        const file = new File([blob], 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        console.log('📁 Archivo creado para test:', file.name, file.size);

        // Importar dinámicamente la función de parsing
        const module = await import('/src/components/VazzaBOMUploadModal.tsx');
        console.log('🔧 Módulo importado:', module);

        // La función parseVazzaExcelFile debería estar disponible
        const result = await module.parseVazzaExcelFile(file);
        console.log('🎉 Test exitoso:', result);

        return result;
    } catch (error) {
        console.error('💥 Error en test:', error);
        throw error;
    }
};

// Función para analizar la estructura del Excel sin parsing completo
window.analyzeExcelStructure = async () => {
    console.log('🔍 Analizando estructura del Excel...');

    try {
        const response = await fetch('/VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx');
        const blob = await response.blob();
        const file = new File([blob], 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        console.log('📁 Archivo:', file.name, file.size);

        // Solo mostrar información básica sin parsing completo
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('✅ Archivo leído exitosamente');

            // Aquí podrías agregar más análisis si es necesario
            console.log('💡 Para parsing completo ejecuta: testVazzaExcelParsing()');
        };

        reader.onerror = () => {
            console.error('❌ Error al leer archivo');
        };

        reader.readAsArrayBuffer(file);

    } catch (error) {
        console.error('💥 Error al analizar:', error);
    }
};

// Función para probar la validación de materiales
window.testMaterialValidation = () => {
    console.log('🧪 Probando validación de materiales...');

    // Función de validación (copiada del componente)
    const validateMaterialDescription = (descripcion, precio, consumo) => {
        const desc = descripcion.toUpperCase().trim();

        // Filtrar fechas en formato MM/DD/YY o DD/MM/YY
        const datePattern = /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{2}$/;
        if (datePattern.test(desc)) {
            console.log(`🚫 Descartado por fecha: "${descripcion}"`);
            return false;
        }

        // Filtrar códigos administrativos y fechas con KARLA
        if (desc.includes('KARLA') || desc.includes('11/22/23') || desc.includes('ULTIMA ACTUALIZACION')) {
            console.log(`🚫 Descartado por código administrativo: "${descripcion}"`);
            return false;
        }

        // Filtrar texto muy corto (menos de 3 caracteres)
        if (desc.length < 3) {
            console.log(`🚫 Descartado por texto muy corto: "${descripcion}"`);
            return false;
        }

        // Filtrar palabras clave administrativas
        const adminKeywords = [
            'CLIENTE:', 'FECHA', 'PEDIDO', 'SEMANA', 'ANALISIS', 'COSTOS',
            'PEDIDO DEL', 'COMPRADO', 'CTO/PAR', 'PRESUP', 'COSTO REAL',
            'MATERIALES DIRECTOS', 'PROCESO EXTERNO', 'INVERSION', 'SUAJES',
            'HORMAS', 'TROQUEL', 'OTROS', 'M.O.', 'GASTOS', 'PRECIO VTA', 'DIF'
        ];

        if (adminKeywords.some(keyword => desc.includes(keyword))) {
            console.log(`🚫 Descartado por palabra clave administrativa: "${descripcion}"`);
            return false;
        }

        // Filtrar si parece código (muchos números y pocos caracteres)
        const letters = desc.replace(/[^A-Z]/g, '').length;
        const numbers = desc.replace(/[^0-9]/g, '').length;
        if (letters < 2 && numbers > 3) {
            console.log(`🚫 Descartado por código numérico: "${descripcion}"`);
            return false;
        }

        // Filtrar si es solo números (probablemente códigos)
        if (/^\d+$/.test(desc)) {
            console.log(`🚫 Descartado por solo números: "${descripcion}"`);
            return false;
        }

        // Filtrar si parece ruta de archivo o código técnico
        if (desc.includes('NOM 020') || desc.includes('330-69') || desc.includes('CSC')) {
            console.log(`🚫 Descartado por código técnico: "${descripcion}"`);
            return false;
        }

        // Aceptar si tiene al menos 3 caracteres alfabéticos y parece un material
        if (letters >= 3) {
            return true;
        }

        console.log(`🚫 Descartado por no cumplir criterios de material: "${descripcion}"`);
        return false;
    };

    // Casos que deberían ser descartados
    const invalidCases = [
        '11/22/23',
        'KARLA',
        'ULTIMA ACTUALIZACION',
        'CLIENTE:',
        'FECHA DE ENTREGA',
        'PEDIDO :',
        'SEMANA :',
        'MATERIALES DIRECTOS',
        'PROCESO EXTERNO',
        '123',
        'NOM 020 13501',
        '330-69-N CXF NARC',
        'CSC 22-23'
    ];

    // Casos que deberían ser aceptados
    const validCases = [
        'PUNTERA ROBIN SPORT VIRGEN ARTICO',
        'OJILLERO ROBIN SPORT VIRGEN ARTICO',
        'TALON ROBIN SPORT VIRGEN ARTICO',
        'REF CUÑA PLANTILLA TIRA DE EVA BCA 5 MM',
        'BULLON ESPONJA 10 MM / 50 KG',
        'ESPUMA LENGUA CHINELA ESPONJA 5 MM/50 KG',
        'HILO CORTE BLANCO',
        'HILO FORRO BLANCO'
    ];

    console.log('🚫 Casos inválidos (deberían ser descartados):');
    invalidCases.forEach(desc => {
        const isValid = validateMaterialDescription(desc, 10, 1);
        console.log(`  ${isValid ? '✅' : '❌'} "${desc}" → ${isValid ? 'ACEPTADO' : 'DESCARTADO'}`);
    });

    console.log('✅ Casos válidos (deberían ser aceptados):');
    validCases.forEach(desc => {
        const isValid = validateMaterialDescription(desc, 10, 1);
        console.log(`  ${isValid ? '✅' : '❌'} "${desc}" → ${isValid ? 'ACEPTADO' : 'DESCARTADO'}`);
    });
};
