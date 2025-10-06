// Script para arreglar el archivo VazzaBOMUploadModal.tsx
// Eliminar código duplicado automáticamente

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'components', 'VazzaBOMUploadModal.tsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Buscar la función convertToVazzaDataSchema correcta (línea 353)
    const convertToVazzaIndex = content.indexOf('const convertToVazzaDataSchema = (parsedData: ParsedVazzaData): VazzaDataSchema => {');

    if (convertToVazzaIndex === -1) {
        console.error('❌ No se encontró la función convertToVazzaDataSchema');
        process.exit(1);
    }

    // Buscar la línea donde debería terminar la función (antes de "return {")
    const returnIndex = content.indexOf('    return { newProductModel, newMaterials };', convertToVazzaIndex);

    if (returnIndex === -1) {
        console.error('❌ No se encontró el return de la función');
        process.exit(1);
    }

    // Encontrar el final de la función convertToVazzaDataSchema
    const functionEnd = content.indexOf('};', returnIndex) + 2;

    // Extraer solo la parte válida del archivo
    const validContent = content.substring(0, convertToVazzaIndex) +
                        content.substring(functionEnd);

    // Eliminar líneas vacías duplicadas
    const cleanedContent = validContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(filePath, cleanedContent, 'utf8');

    console.log('✅ Archivo VazzaBOMUploadModal.tsx arreglado exitosamente');
    console.log('✅ Código duplicado eliminado');
    console.log('✅ Solo queda la implementación con limpieza automática');

} catch (error) {
    console.error('❌ Error al arreglar el archivo:', error.message);
    process.exit(1);
}
