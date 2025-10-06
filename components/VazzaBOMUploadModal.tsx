import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ProductModel, MaterialInventory } from '../types';
import * as XLSX from 'xlsx';

// Función para validar si una descripción corresponde a un material real
const validateMaterialDescription = (descripcion: string, precio: number, consumo: number): boolean => {
    const desc = descripcion.toUpperCase().trim();

    // Filtrar fechas en formato MM/DD/YY o DD/MM/YY
    const datePattern = /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{2}$/;
    if (datePattern.test(desc)) {
        console.log(`🚫 Descartado por fecha: "${descripcion}"`);
        return false;
    }

    // Filtrar códigos administrativos y fechas con KARLA
    if (desc.includes('KARLA') || desc.includes('11/22/23') || desc.includes('ULTIMA ACTUALIZACION')) {
        if (desc.includes('11/22/23')) {
            console.log(`🚫 FECHA DETECTADA Y DESCARTADA: "${descripcion}" - Este es el problema reportado`);
        } else {
            console.log(`🚫 Descartado por código administrativo: "${descripcion}"`);
        }
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

interface OutletContextType {
    productModels: ProductModel[];
    inventoryData: MaterialInventory[];
    addProductModel: (newModel: ProductModel) => void;
    addMaterials: (newMaterials: MaterialInventory[]) => void;
}

interface VazzaRowData {
    descripcion?: string;
    provedor?: string;
    precioNeto?: string;
    unidadCompra?: string;
    consumosUnidad?: string;
}

interface ParsedVazzaData {
    estilo: string;
    materials: Array<{
        descripcion: string;
        provedor: string;
        precioNeto: number;
        unidadCompra: string;
        consumosUnidad: number;
        componenteId: string;
        materialSku: string;
    }>;
}

interface VazzaDataSchema {
    newProductModel: ProductModel;
    newMaterials: MaterialInventory[];
}

// Función para limpiar y depurar datos del CSV (extraída del script clean_vazza_data.js)
const cleanVazzaData = (csvLines: string[]): Array<{
    descripcion: string;
    proveedor: string;
    precioNeto: number;
    consumos: number;
    costoPar: number;
    lineNumber: number;
    sku: string;
}> => {
    console.log('🧹 INICIANDO PROCESO DE LIMPIEZA Y DEPURACIÓN AUTOMÁTICA');
    console.log('=========================================================');

    const validMaterials = [];
    const invalidLines = [];

    // Encontrar la línea de headers (generalmente la línea 9 en archivos VAZZA)
    let headerLine = -1;
    for (let i = 0; i < Math.min(15, csvLines.length); i++) {
        const line = csvLines[i].trim();
        if (line && line.toLowerCase().includes('descripci')) {
            headerLine = i;
            break;
        }
    }

    if (headerLine === -1) headerLine = 8; // fallback a línea 8

    console.log(`📋 Línea de headers encontrada: ${headerLine + 1}`);

    // Procesar líneas de datos (desde la línea después de headers)
    for (let i = headerLine + 1; i < csvLines.length; i++) {
        const line = csvLines[i].trim();

        if (!line || line === ','.repeat(20)) {
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
            !line.includes('PRECIO VTA') // No es línea de precio venta
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
    function getInvalidReason(descripcion: string, proveedor: string, precioNeto: number, consumos: number, costoPar: number, line: string) {
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
    console.log('✅ RESULTADO DE LA LIMPIEZA AUTOMÁTICA');
    console.log('=====================================');
    console.log(`📦 Materiales válidos encontrados: ${validMaterials.length}`);
    console.log(`🚫 Materiales descartados: ${invalidLines.length}`);

    // Mostrar descartados por categoría
    const descartadasPorTipo = {};
    invalidLines.forEach(line => {
        descartadasPorTipo[line.reason] = (descartadasPorTipo[line.reason] || 0) + 1;
    });

    Object.entries(descartadasPorTipo).forEach(([reason, count]) => {
        console.log(`   - ${reason}: ${count} líneas`);
    });

    if (validMaterials.length === 0) {
        console.warn('⚠️ ADVERTENCIA: No se encontraron materiales válidos después de la limpieza');
        console.warn('Esto podría indicar que el archivo no tiene el formato esperado');
    }

    return validMaterials;
};

// Función para convertir XLSX a CSV automáticamente
const convertXlsxToCsv = (workbook: XLSX.WorkBook): string => {
    console.log('🔄 CONVIRTIENDO XLSX A CSV AUTOMÁTICAMENTE');
    console.log('===========================================');

    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir a CSV
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
        FS: ',', // Separador de campos
        RS: '\n', // Separador de registros
        dateNF: 'dd/mm/yyyy',
        blankrows: false,
        defval: ''
    });

    console.log(`✅ Conversión completada: ${csv.split('\n').length} líneas CSV generadas`);
    return csv;
};

// Función para parsear el archivo Excel Vazza real con limpieza automática
const parseVazzaExcelFile = (file: File): Promise<ParsedVazzaData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                console.log('🔍 Iniciando parsing del archivo:', file.name);
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Buscar la hoja que contenga los datos (generalmente la primera)
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                console.log('📋 Hoja encontrada:', sheetName);
                console.log('📊 Rango de la hoja:', worksheet['!ref']);

                // PASO 1: Convertir XLSX a CSV automáticamente
                const csvData = convertXlsxToCsv(workbook);

                // PASO 2: Aplicar proceso de limpieza automática
                const csvLines = csvData.split('\n');
                const cleanedMaterials = cleanVazzaData(csvLines);

                if (cleanedMaterials.length === 0) {
                    throw new Error('No se encontraron materiales válidos después de la limpieza automática. Verifica que el archivo contenga materiales reales.');
                }

                console.log('');
                console.log('🎯 MATERIALES LIMPÍOS Y LISTOS PARA USAR');
                console.log('========================================');
                cleanedMaterials.forEach((material, index) => {
                    console.log(`${index + 1}. ${material.descripcion}`);
                    console.log(`   - Proveedor: ${material.proveedor}`);
                    console.log(`   - Precio: $${material.precioNeto.toFixed(2)}`);
                    console.log(`   - Consumo: ${material.consumos}`);
                    console.log(`   - Costo/Par: $${material.costoPar.toFixed(2)}`);
                    console.log('');
                });

                // PASO 3: Extraer estilo del nombre del archivo
                const fileName = file.name;
                const estiloMatch = fileName.match(/(\d+)\s*(BLANCO|NEGRO|AZUL|ROJO|VERDE|AMARILLO|ROSA|GRIS|CAFE|BEIGE|MARINO)/i);
                const estilo = estiloMatch ? estiloMatch[0] : 'DESCONOCIDO';

                // PASO 4: Convertir a formato SISMAC
                const materials = cleanedMaterials.map(material => ({
                    descripcion: material.descripcion,
                    provedor: material.proveedor,
                    precioNeto: material.precioNeto,
                    unidadCompra: 'PRS', // Por defecto
                    consumosUnidad: material.consumos,
                    componenteId: material.sku,
                    materialSku: material.sku
                }));

                const parsedData: ParsedVazzaData = {
                    estilo,
                    materials
                };

                console.log('🎉 PARSING COMPLETADO CON ÉXITO');
                console.log('=============================');
                console.log(`- Archivo procesado: ${file.name}`);
                console.log(`- Estilo detectado: ${estilo}`);
                console.log(`- Materiales limpios encontrados: ${materials.length}`);
                console.log(`- Costo total por par: $${cleanedMaterials.reduce((sum, m) => sum + m.costoPar, 0).toFixed(2)}`);

                resolve(parsedData);

            } catch (error) {
                console.error('Error parsing Excel:', error);
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };

        reader.readAsArrayBuffer(file);
    });
};

// Función para convertir datos parseados a formato SISMAC
const convertToVazzaDataSchema = (parsedData: ParsedVazzaData): VazzaDataSchema => {
    // Crear el modelo de producto con el estilo extraído
    const newProductModel: ProductModel = {
        id: `MOD-VAZZA-${parsedData.estilo.replace(/\s+/g, '-').toUpperCase()}`,
        name: `VAZZA ESTILO ${parsedData.estilo.toUpperCase()}`,
        bom: parsedData.materials.map((material, index) => ({
            materialSku: material.materialSku,
            quantityPerUnit: material.consumosUnidad
        }))
    };

    // Crear los materiales para el catálogo
    const newMaterials: MaterialInventory[] = parsedData.materials.map((material, index) => {
        // Determinar categoría basada en el nombre del material
        let category: 'Pieles' | 'Suelas' | 'Herrajes' | 'Textiles' | 'Químicos' = 'Textiles';
        const nombre = material.descripcion.toLowerCase();

        if (nombre.includes('suela') || nombre.includes('planta')) {
            category = 'Suelas';
        } else if (nombre.includes('piel') || nombre.includes('cuero')) {
            category = 'Pieles';
        } else if (nombre.includes('herraje') || nombre.includes('hebilla') || nombre.includes('ojal') || nombre.includes('agujeta')) {
            category = 'Herrajes';
        } else if (nombre.includes('adhesivo') || nombre.includes('químico') || nombre.includes('pegamento')) {
            category = 'Químicos';
        }

        return {
            id: material.materialSku,
            name: material.descripcion,
            category,
            quantity: 0,
            unit: material.unidadCompra,
            location: `IMPORT-${String.fromCharCode(65 + (index % 4))}-0${Math.floor(index / 4) + 1}`,
            unitCost: material.precioNeto,
            totalValue: 0,
            reorderPoint: Math.max(50, Math.floor(material.precioNeto * 2)),
            lastMovementDate: new Date().toISOString().split('T')[0],
            status: 'OK'
        };
    });

    return { newProductModel, newMaterials };
};

// Función para manejar la selección de archivos
const handleFileSelect = async (file: File) => {
    console.log('📁 handleFileSelect llamado con:', file.name);
    setSelectedFile(file);
    setParsingError(null);
    setParsedData(null);

    if (!file.name.toLowerCase().includes('.xlsx')) {
        setParsingError('El archivo debe ser un archivo Excel (.xlsx)');
        return;
    }

    try {
        console.log('🔍 Iniciando parsing desde handleFileSelect...');
        const parsed = await parseVazzaExcelFile(file);
        setParsedData(parsed);
        console.log('✅ Parsing completado desde handleFileSelect');
    } catch (error) {
        console.error('❌ Error en handleFileSelect:', error);
        setParsingError(error instanceof Error ? error.message : 'Error al parsear el archivo');
    }
};

// Función para cargar datos desde archivo local (para desarrollo)
const loadLocalFile = async () => {
    try {
        console.log('🔍 Intentando cargar archivo local...');

        // Crear una referencia directa al archivo usando la API de archivos
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

        console.log('📁 Archivo creado:', file.name, file.size);
        await handleFileSelect(file);
    } catch (error) {
        console.error('❌ Error al cargar archivo local:', error);
        setParsingError(`Error al cargar archivo local: ${error instanceof Error ? error.message : 'Error desconocido'}. Selecciona un archivo manualmente.`);
    }
};

// Función para probar el parsing directamente (para debugging)
const testExcelParsing = async () => {
    try {
        console.log('🧪 Iniciando test de parsing Excel...');

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
        const file = new File([blob], 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        console.log('📁 Archivo de test creado:', file.name, file.size);

        const parsed = await parseVazzaExcelFile(file);
        console.log('🎉 Test exitoso:', parsed);

        return parsed;
    } catch (error) {
        console.error('💥 Error en test:', error);
        throw error;
    }
};

// Hacer las funciones de test disponibles globalmente para debugging
if (typeof window !== 'undefined') {
    (window as any).testVazzaExcelParsing = testExcelParsing;
    (window as any).testMaterialValidation = () => {
        console.log('🧪 PROBANDO VALIDACIÓN DE MATERIALES...');

        const testCases = [
            { desc: '11/22/23', expected: false, reason: 'fecha MM/DD/YY' },
            { desc: '22/11/23', expected: false, reason: 'fecha DD/MM/YY' },
            { desc: 'PUNTERA ROBIN SPORT', expected: true, reason: 'material válido' },
            { desc: 'KARLA', expected: false, reason: 'código administrativo' },
            { desc: 'NOM 020', expected: false, reason: 'código técnico' },
            { desc: '330-69', expected: false, reason: 'código técnico' },
            { desc: 'CLIENTE: JUAN PEREZ', expected: false, reason: 'palabra clave administrativa' },
            { desc: '123456', expected: false, reason: 'solo números' },
            { desc: 'XY', expected: false, reason: 'texto muy corto' },
            { desc: 'SUELA PRINCESA/MANGO/VEGAN T.R. BLANCA', expected: true, reason: 'material válido largo' }
        ];

        testCases.forEach((test, index) => {
            // Simular la función de validación
            const desc = test.desc.toUpperCase().trim();
            let isValid = true;
            let reason = '';

            // Filtrar fechas en formato MM/DD/YY o DD/MM/YY
            const datePattern = /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{2}$/;
            if (datePattern.test(desc)) {
                isValid = false;
                reason = 'fecha';
            }

            // Filtrar códigos administrativos
            if (isValid && (desc.includes('KARLA') || desc.includes('11/22/23') || desc.includes('ULTIMA ACTUALIZACION'))) {
                isValid = false;
                reason = 'código administrativo';
            }

            // Filtrar texto muy corto
            if (isValid && desc.length < 3) {
                isValid = false;
                reason = 'texto muy corto';
            }

            // Filtrar palabras clave administrativas
            if (isValid) {
                const adminKeywords = ['CLIENTE:', 'FECHA', 'PEDIDO', 'SEMANA', 'ANALISIS', 'COSTOS'];
                if (adminKeywords.some(keyword => desc.includes(keyword))) {
                    isValid = false;
                    reason = 'palabra clave administrativa';
                }
            }

            // Filtrar si es solo números
            if (isValid && /^\d+$/.test(desc)) {
                isValid = false;
                reason = 'solo números';
            }

            // Filtrar códigos técnicos
            if (isValid && (desc.includes('NOM 020') || desc.includes('330-69') || desc.includes('CSC'))) {
                isValid = false;
                reason = 'código técnico';
            }

            // Aceptar si tiene al menos 3 caracteres alfabéticos
            if (isValid) {
                const letters = desc.replace(/[^A-Z]/g, '').length;
                if (letters >= 3) {
                    isValid = true;
                    reason = 'material válido';
                } else {
                    isValid = false;
                    reason = 'letras insuficientes';
                }
            }

            const status = isValid === test.expected ? '✅' : '❌';
            console.log(`${status} Test ${index + 1}: "${test.desc}" → ${isValid ? 'ACEPTADO' : 'DESCARTADO'} (${reason}) - Esperado: ${test.expected ? 'ACEPTADO' : 'DESCARTADO'}`);
        });

        console.log('🎉 Pruebas de validación completadas');
    };
}

interface VazzaBOMUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VazzaBOMUploadModal: React.FC<VazzaBOMUploadModalProps> = ({ isOpen, onClose }) => {
    const { addProductModel, addMaterials } = useOutletContext<OutletContextType>();
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedVazzaData | null>(null);
    const [parsingError, setParsingError] = useState<string | null>(null);

    // Función para convertir datos parseados a formato SISMAC
    const convertToVazzaDataSchema = (parsedData: ParsedVazzaData): VazzaDataSchema => {
        // Crear el modelo de producto con el estilo extraído
        const newProductModel: ProductModel = {
            id: `MOD-VAZZA-${parsedData.estilo.replace(/\s+/g, '-').toUpperCase()}`,
            name: `VAZZA ESTILO ${parsedData.estilo.toUpperCase()}`,
            bom: parsedData.materials.map((material, index) => ({
                materialSku: material.materialSku,
                quantityPerUnit: material.consumosUnidad
            }))
        };

        // Crear los materiales para el catálogo
        const newMaterials: MaterialInventory[] = parsedData.materials.map((material, index) => {
            // Determinar categoría basada en el nombre del material
            let category: 'Pieles' | 'Suelas' | 'Herrajes' | 'Textiles' | 'Químicos' = 'Textiles';
            const nombre = material.descripcion.toLowerCase();

            if (nombre.includes('suela') || nombre.includes('planta')) {
                category = 'Suelas';
            } else if (nombre.includes('piel') || nombre.includes('cuero')) {
                category = 'Pieles';
            } else if (nombre.includes('herraje') || nombre.includes('hebilla') || nombre.includes('ojal') || nombre.includes('agujeta')) {
                category = 'Herrajes';
            } else if (nombre.includes('adhesivo') || nombre.includes('químico') || nombre.includes('pegamento')) {
                category = 'Químicos';
            }

            return {
                id: material.materialSku,
                name: material.descripcion,
                category,
                quantity: 0,
                unit: material.unidadCompra,
                location: `IMPORT-${String.fromCharCode(65 + (index % 4))}-0${Math.floor(index / 4) + 1}`,
                unitCost: material.precioNeto,
                totalValue: 0,
                reorderPoint: Math.max(50, Math.floor(material.precioNeto * 2)),
                lastMovementDate: new Date().toISOString().split('T')[0],
                status: 'OK'
            };
        });

        return { newProductModel, newMaterials };
    };

    // Función para manejar la selección de archivos
    const handleFileSelect = async (file: File) => {
        console.log('📁 handleFileSelect llamado con:', file.name);
        setSelectedFile(file);
        setParsingError(null);
        setParsedData(null);

        if (!file.name.toLowerCase().includes('.xlsx')) {
            setParsingError('El archivo debe ser un archivo Excel (.xlsx)');
            return;
        }

        try {
            console.log('🔍 Iniciando parsing desde handleFileSelect...');
            const parsed = await parseVazzaExcelFile(file);
            setParsedData(parsed);
            console.log('✅ Parsing completado desde handleFileSelect');
        } catch (error) {
            console.error('❌ Error en handleFileSelect:', error);
            setParsingError(error instanceof Error ? error.message : 'Error al parsear el archivo');
        }
    };

    // Función para cargar datos desde archivo local (para desarrollo)
    const loadLocalFile = async () => {
        try {
            console.log('🔍 Intentando cargar archivo local...');

            // Crear una referencia directa al archivo usando la API de archivos
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

            console.log('📁 Archivo creado:', file.name, file.size);
            await handleFileSelect(file);
        } catch (error) {
            console.error('❌ Error al cargar archivo local:', error);
            setParsingError(`Error al cargar archivo local: ${error instanceof Error ? error.message : 'Error desconocido'}. Selecciona un archivo manualmente.`);
        }
    };

    // Función para probar el parsing directamente (para debugging)
    const testExcelParsing = async () => {
        try {
            console.log('🧪 Iniciando test de parsing Excel...');

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
            const file = new File([blob], 'VAZZA ESTILO 13501 BLANCO POR 590 PRS  HORMA POLET BASE DEL ESTILO 330-69.xlsx', {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            console.log('📁 Archivo de test creado:', file.name, file.size);

            const result = await parseVazzaExcelFile(file);
            console.log('🎉 Test exitoso:', result);

            return result;
        } catch (error) {
            console.error('💥 Error en test:', error);
            throw error;
        }
    };

    if (!isOpen) return null;

    const handleInjectVazzaData = async () => {
        if (!parsedData) {
            setUploadStatus('Primero selecciona y parsea un archivo Excel');
            return;
        }

        setIsProcessing(true);
        setUploadStatus('Procesando datos del archivo Vazza...');

        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const { newProductModel, newMaterials } = convertToVazzaDataSchema(parsedData);

            // Insertar en el estado central
            addProductModel(newProductModel);
            addMaterials(newMaterials);

            setUploadStatus('¡Datos Vazza cargados exitosamente!');
            console.log('✅ Vazza BOM cargado:', {
                modelo: newProductModel,
                materiales: newMaterials
            });
            setTimeout(() => {
                resetModal();
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Error al procesar archivo Vazza:', error);
            setUploadStatus('Error al procesar el archivo. Intente nuevamente.');
            setIsProcessing(false);
        }
    };

    const resetModal = () => {
        setUploadStatus(null);
        setIsProcessing(false);
        setSelectedFile(null);
        setParsedData(null);
        setParsingError(null);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v12m-6-9.75h.008v.008H7.5v-.008Z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-white">Cargar BOM Vazza - Estilo 13501</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-white transition-colors"
                        disabled={isProcessing}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* File Upload Section */}
                            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                                <h3 className="text-lg font-semibold text-white mb-3">Seleccionar Archivo Excel</h3>

                                {/* Debug Section - Solo visible en desarrollo */}
                                {process.env.NODE_ENV === 'development' && (
                                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                                        <p className="text-yellow-300 text-sm font-semibold mb-2">🔧 DEBUGGING TOOLS</p>
                                        <button
                                            onClick={() => {
                                                console.log('🔧 Ejecutando test de parsing...');
                                                testExcelParsing().then(result => {
                                                    console.log('✅ Test completado:', result);
                                                    alert(`Test completado! Revisa la consola para ver los resultados. Materiales encontrados: ${result.materials.length}`);
                                                }).catch(error => {
                                                    console.error('❌ Error en test:', error);
                                                    alert(`Error en test: ${error.message}`);
                                                });
                                            }}
                                            className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded text-xs hover:bg-yellow-500"
                                        >
                                            🧪 Test Excel Parsing
                                        </button>
                                        <p className="text-yellow-300/70 text-xs mt-1">Haz clic para probar el parsing directamente</p>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Archivo Excel (.xlsx)
                                        </label>
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileSelect(file);
                                            }}
                                            className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500"
                                            disabled={isProcessing}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-slate-400 text-sm">ó</span>
                                    </div>
                                    <button
                                        onClick={loadLocalFile}
                                        disabled={isProcessing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold disabled:opacity-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v12m-6-9.75h.008v.008H7.5v-.008Z" />
                                        </svg>
                                        Cargar Archivo Local de Prueba
                                    </button>
                                </div>
                            </div>

                            {/* Error Display */}
                            {parsingError && (
                                <div className="bg-rose-500/10 p-4 rounded-lg border border-rose-500 text-rose-400">
                                    <div className="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.007v.008H12v-.008z" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold">Error al procesar archivo:</p>
                                            <p className="text-sm mt-1">{parsingError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Parsed Data Preview */}
                            {parsedData && !parsingError && (
                                <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/50">
                                    <div className="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm text-emerald-200">
                                            <p className="font-semibold mb-1">✅ Archivo parseado correctamente</p>
                                            <p><strong>Estilo detectado:</strong> {parsedData.estilo}</p>
                                            <p><strong>Materiales válidos encontrados:</strong> {parsedData.materials.length}</p>
                                            <p className="text-xs text-emerald-300/80 mt-1">
                                                📝 Solo se incluyen materiales con precio y consumo válido
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* File Info - Only show if file is parsed */}
                        {selectedFile && (
                            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                                <h3 className="text-lg font-semibold text-white mb-2">Información del Archivo</h3>
                                <div className="text-sm text-slate-300 space-y-1">
                                    <p><strong>Archivo:</strong> {selectedFile.name}</p>
                                    <p><strong>Estilo:</strong> {parsedData?.estilo || 'Detectando...'}</p>
                                    <p><strong>Componentes:</strong> {parsedData?.materials.length || 0} materiales identificados</p>
                                    <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-MX')}</p>
                                </div>
                            </div>
                        )}

                        {/* Materials Table - Show parsed data if available, otherwise show demo */}
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                {parsedData ? 'Materiales a Importar' : 'Materiales de Ejemplo (sin archivo cargado)'}
                            </h3>
                            {parsedData && (
                                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                                    <p className="text-blue-300 text-sm">
                                        📋 <strong>Filtrado Inteligente:</strong> Solo se muestran materiales con precio y consumo válidos.
                                        Elementos como fechas, códigos de proyecto, y datos administrativos se descartaron automáticamente.
                                    </p>
                                </div>
                            )}
                            <div className="overflow-x-auto rounded-lg border border-slate-600">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Material</th>
                                            <th scope="col" className="px-4 py-3">Proveedor</th>
                                            <th scope="col" className="px-4 py-3 text-center">Costo Unitario</th>
                                            <th scope="col" className="px-4 py-3 text-center">Unidad</th>
                                            <th scope="col" className="px-4 py-3 text-center">Consumo/Par</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedData ? (
                                            // Show real parsed data
                                            parsedData.materials.map((material, index) => (
                                                <tr key={material.materialSku} className={`border-b border-slate-700 ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                                                    <td className="px-4 py-3 font-medium text-slate-200">{material.descripcion}</td>
                                                    <td className="px-4 py-3 text-slate-400">{material.provedor}</td>
                                                    <td className="px-4 py-3 text-center text-emerald-400 font-semibold">
                                                        ${material.precioNeto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{material.unidadCompra}</td>
                                                    <td className="px-4 py-3 text-center">{material.consumosUnidad}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            // Show demo data when no file is loaded
                                            <>
                                                <tr className="border-b border-slate-700 bg-slate-800">
                                                    <td className="px-4 py-3 font-medium text-slate-200">ROBIN SPORT VIRGEN ARTICO</td>
                                                    <td className="px-4 py-3 text-slate-400">OFICINA LENM</td>
                                                    <td className="px-4 py-3 text-center text-emerald-400 font-semibold">$60.00</td>
                                                    <td className="px-4 py-3 text-center">MT</td>
                                                    <td className="px-4 py-3 text-center">2.35</td>
                                                </tr>
                                                <tr className="border-b border-slate-700 bg-slate-800">
                                                    <td className="px-4 py-3 font-medium text-slate-200">SUELA PRINCESA/MANGO /VEGAN T.R. BLANCA</td>
                                                    <td className="px-4 py-3 text-slate-400">FELIPE</td>
                                                    <td className="px-4 py-3 text-center text-emerald-400 font-semibold">$26.00</td>
                                                    <td className="px-4 py-3 text-center">PRS</td>
                                                    <td className="px-4 py-3 text-center">1</td>
                                                </tr>
                                                <tr className="border-b border-slate-700 bg-slate-800">
                                                    <td className="px-4 py-3 font-medium text-slate-200">AGUJETA PLANA CREES #120 CM</td>
                                                    <td className="px-4 py-3 text-slate-400">BARAJAS</td>
                                                    <td className="px-4 py-3 text-center text-emerald-400 font-semibold">$203.52</td>
                                                    <td className="px-4 py-3 text-center">GRUESAS</td>
                                                    <td className="px-4 py-3 text-center">1</td>
                                                </tr>
                                                <tr className="bg-slate-800">
                                                    <td className="px-4 py-3 font-medium text-slate-200">TRANSFER PLANTILLA VAZZA ORO</td>
                                                    <td className="px-4 py-3 text-slate-400">ALEX SAUCEDO</td>
                                                    <td className="px-4 py-3 text-center text-emerald-400 font-semibold">$0.30</td>
                                                    <td className="px-4 py-3 text-center">PZAS</td>
                                                    <td className="px-4 py-3 text-center">2</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {uploadStatus && (
                            <div className={`p-4 rounded-lg border ${
                                uploadStatus.includes('Error')
                                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                                    : uploadStatus.includes('éxito')
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                    : 'bg-sky-500/10 border-sky-500 text-sky-400'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {uploadStatus.includes('Error') && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {uploadStatus.includes('éxito') && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {!uploadStatus.includes('Error') && !uploadStatus.includes('éxito') && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    )}
                                    <span className="font-medium">{uploadStatus}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="flex justify-end p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-xl gap-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold disabled:opacity-50"
                        disabled={isProcessing}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleInjectVazzaData}
                        disabled={isProcessing}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-semibold shadow-md shadow-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Cargar BOM Vazza
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default VazzaBOMUploadModal;
