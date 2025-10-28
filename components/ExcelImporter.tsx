
import React, { useRef, useState } from 'react';
import { useModelStore } from '../store/useModelStore';
import { FileUp } from 'lucide-react';
import { read, utils } from 'xlsx';
import JSZip from 'jszip';
import type { ParsedExcelData } from '../types';

export default function ExcelImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createNewModel = useModelStore((state) => state.createNewModel);
  const setHeaderField = useModelStore((state) => state.setHeaderField);
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const loadFromExcel = useModelStore((state) => state.loadFromExcel);

  const parseFileName = (fileName: string) => {
    // Remove extension
    const nameWithoutExt = fileName.replace(/\.xlsx?$/, '');

    // Initialize parsed info
    const parsedInfo: any = {};

    // Common patterns in file names - more flexible
    const patterns = {
      brand: /(VAZZA|COPPEL|WALMART|SORETTO|CAT|NIKE|ADIDAS|PUMA|OTHER_BRAND)/i,
      // Capture everything between brand and "ESTILO" as product description
      productDesc: /(?:VAZZA|COPPEL|WALMART|SORETTO|CAT|NIKE|ADIDAS|PUMA|OTHER_BRAND)\s+(.+?)\s+ESTILO/i,
      style: /ESTILO\s+(\d+[\d-]*)/i,
      color: /(BLANCO|NEGRO|ROJO|AZUL|VERDE|AMARILLO|GRIS|BEIGE|MARRON|ROSADO|VIOLETA|NARANJA|CAFE|BORDO|CREMA|LILA|FUCSIA|CORAL|BURDEOS|NAVY|INDIGO|OLIVA|MOSTAZA|TERRACOTA|SIENA|SALMON|PINK|PURPLE|ORANGE|BROWN|CREAM|LILAC|MAGENTA|CORAL|BURGUNDY)/i,
      quantity: /POR\s+(\d+)\s+PRS?/i,
      component: /(HORMA|PLANTA|SUELA|TACON|FORRO|EMPEINE|CUÑA|PLATAFORMA|CORTE|COSTURA|BORDADO|ESTAMPADO)/i,
      baseStyle: /BASE\s+DEL?\s+ESTILO\s+([\d\s-]+[\d-]*)/i
    };

    // Extract information using patterns
    const brandMatch = nameWithoutExt.match(patterns.brand);
    if (brandMatch) {
      parsedInfo.brand = brandMatch[1].toUpperCase();
    }

    // Extract product description (everything between brand and "ESTILO")
    const productDescMatch = nameWithoutExt.match(patterns.productDesc);
    if (productDescMatch) {
      parsedInfo.productDescription = productDescMatch[1].trim();
    }

    const styleMatch = nameWithoutExt.match(patterns.style);
    if (styleMatch) {
      parsedInfo.styleCode = styleMatch[1];
    }

    const colorMatch = nameWithoutExt.match(patterns.color);
    if (colorMatch) {
      parsedInfo.color = colorMatch[1].toUpperCase();
    }

    const quantityMatch = nameWithoutExt.match(patterns.quantity);
    if (quantityMatch) {
      parsedInfo.quantity = parseInt(quantityMatch[1]);
    }

    const componentMatch = nameWithoutExt.match(patterns.component);
    if (componentMatch) {
      parsedInfo.component = componentMatch[1].toUpperCase();
    }

    const baseStyleMatch = nameWithoutExt.match(patterns.baseStyle);
    if (baseStyleMatch) {
      parsedInfo.baseStyle = baseStyleMatch[1];
    }

    return parsedInfo;
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      console.log('🚀 Iniciando carga de archivo Excel:', file.name);

      // Parse file name for additional information
      const fileNameInfo = parseFileName(file.name);
      console.log('📋 Información extraída del nombre:', fileNameInfo);

      const data = await file.arrayBuffer();
      console.log('📊 Tamaño del archivo:', (data.byteLength / 1024).toFixed(2), 'KB');

      const parsedData: ParsedExcelData = {
        header: {},
        materials: [],
        images: []
      };

      // 1. Parse Excel with xlsx library
      console.log('📖 Parseando archivo Excel...');
      const workbook = read(data, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false
      });

      console.log('📑 Hojas encontradas:', workbook.SheetNames);

      if (workbook.SheetNames.length === 0) {
        throw new Error('El archivo Excel no contiene hojas de trabajo.');
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      console.log('🎯 Trabajando con hoja:', sheetName);

      // Convert to JSON with better options
      const json = utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false
      }) as (string | number | boolean)[][];

      console.log('📊 Filas encontradas:', json.length);
      console.log('🔍 Primeras 3 filas:', json.slice(0, 3));

      // 2. COPPEL Excel format - headers in row 7, data from row 8
      console.log('🎯 Procesando formato COPPEL Excel...');

      // For COPPEL Excel files, headers are ALWAYS in row 7 (index 6)
      // Data ALWAYS starts from row 8 (index 7)
      const materialStartRowIndex = 7;

      console.log('📋 Headers en fila 7, datos desde fila 8');
      console.log(`📊 Procesando ${json.length} filas totales`);

      // 3. Extract header information from filename (takes precedence)
      parsedData.header.moldCode = fileNameInfo.styleCode || '';
      parsedData.header.client = fileNameInfo.brand || '';
      parsedData.header.color = fileNameInfo.color || '';
      parsedData.header.requestedPairs = fileNameInfo.quantity || 0;

      // Try to extract header from Excel cells if filename doesn't have info
      if (!parsedData.header.moldCode && worksheet['B2']?.v) {
        parsedData.header.moldCode = String(worksheet['B2'].v);
      }
      if (!parsedData.header.client && worksheet['B3']?.v) {
        parsedData.header.client = String(worksheet['B3'].v);
      }
      if (!parsedData.header.color && worksheet['B4']?.v) {
        parsedData.header.color = String(worksheet['B4'].v);
      }
      if (!parsedData.header.requestedPairs && worksheet['F2']?.v) {
        parsedData.header.requestedPairs = Number(worksheet['F2'].v) || 0;
      }

      // 4. Extract materials data with intelligent mapping
      console.log('🔧 Extrayendo datos de materiales...');
      const materialRows = json.slice(materialStartRowIndex);

      let processedRows = 0;
      let validMaterials = 0;

      materialRows.forEach((row, index) => {
        if (!row || row.length < 3) return;

        // Skip empty rows
        const firstCell = String(row[0] || '').trim();
        if (!firstCell || firstCell.length < 2) return;

        // STRICT filtering - skip header rows and invalid data
        const rowText = row.map(cell => String(cell || '').toLowerCase().trim());

        // Check if this row contains header-like terms
        const headerTerms = [
          'descripción', 'descripcion', 'nombre', 'color', 'proveedor', 'provedor',
          'precio', 'costo', 'total', 'subtotal', 'unidad', 'ancho', 'consumo',
          'cantidad', 'compra', 'orden', 'oc', 'comprado', 'presupuesto', 'requerimiento'
        ];

        const headerMatches = rowText.filter(text =>
          headerTerms.some(term => text.includes(term)) && text.length > 3
        ).length;

        // If more than 30% of cells contain header terms, skip this row
        const headerRatio = headerMatches / rowText.length;
        if (headerRatio > 0.3 && headerMatches >= 2) {
          console.log(`🚫 Saltando fila ${index + materialStartRowIndex + 1} - parece contener headers (${headerMatches}/${rowText.length} celdas):`, rowText.slice(0, 3));
          return;
        }

        // Skip if first cell is clearly a header term
        if (headerTerms.some(term => firstCell.toLowerCase().includes(term)) && firstCell.length < 20) {
          console.log(`🚫 Saltando fila ${index + materialStartRowIndex + 1} - primera celda parece header: "${firstCell}"`);
          return;
        }

        // Only skip if the entire row is empty or contains only meaningless content
        const hasAnyContent = row.some(cell => {
          const cellValue = String(cell || '').trim();
          return cellValue.length > 0 && cellValue !== '0' && cellValue !== '-';
        });

        if (!hasAnyContent) {
          console.log(`⚠️ Saltando fila ${index + materialStartRowIndex + 1} - fila completamente vacía`);
          return;
        }

        // Skip rows that are clearly just separators (like "=====" or similar)
        if (firstCell.length > 0 && /^[=*-]+$/.test(firstCell)) {
          console.log(`⚠️ Saltando fila ${index + materialStartRowIndex + 1} - fila separadora: "${firstCell}"`);
          return;
        }

        processedRows++;

        try {
          // Intelligent column mapping - try to detect columns by content
          const material: any = {};

          // Map columns based on expected order, but be flexible
          material.description = String(row[0] || '').trim();
          material.technicalName = String(row[1] || '').trim();
          material.color = String(row[2] || '').trim();
          material.provider = String(row[3] || '').trim();

          // Numeric fields with better parsing
          material.priceWithoutVAT = parseFloat(String(row[4] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
          material.netPrice = parseFloat(String(row[5] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;

          material.purchaseUnit = String(row[6] || '').trim();
          material.width = parseFloat(String(row[7] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
          material.consumptionPerPair = parseFloat(String(row[8] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
          material.consumptionUnit = String(row[9] || '').trim();

          material.requiredToBuy = parseFloat(String(row[10] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;
          material.minimumOrder = parseFloat(String(row[11] || '0').replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;

          // Boolean fields - check for various true representations
          const ocValue = String(row[12] || '').toLowerCase().trim();
          material.oc = ['1', 'true', 'sí', 'si', 'yes', '✓', 'x', 'ok'].includes(ocValue);

          const compradoValue = String(row[13] || '').toLowerCase().trim();
          material.comprado = ['1', 'true', 'sí', 'si', 'yes', '✓', 'x', 'ok'].includes(compradoValue);

          parsedData.materials.push(material);
          validMaterials++;

          console.log(`✅ Material ${validMaterials}: ${material.description} - ${material.provider}`);

        } catch (error) {
          console.warn(`⚠️ Error procesando fila ${index + materialStartRowIndex + 1}:`, error);
        }
      });

      console.log(`📊 Resumen de procesamiento:`);
      console.log(`   - Filas procesadas: ${processedRows}`);
      console.log(`   - Materiales válidos: ${validMaterials}`);
      console.log(`   - Header extraído:`, parsedData.header);

      // 5. Show detailed summary to user
      const summary = [
        `📁 Archivo: ${file.name}`,
        `📊 Hojas: ${workbook.SheetNames.length}`,
        `🎯 Hoja procesada: ${sheetName}`,
        `📦 Materiales válidos: ${validMaterials}`,
        `📝 Filas procesadas: ${processedRows}`,
        `🏷️ Header: ${parsedData.header.moldCode || 'No detectado'} - ${parsedData.header.client || 'Sin cliente'}`,
        `📍 Datos desde fila: ${materialStartRowIndex + 1}`
      ].join('\n');

      alert(`✅ Archivo procesado exitosamente!\n\n${summary}`);

      // 6. Extract images if available
      try {
        console.log('🖼️ Buscando imágenes...');
      const zip = await JSZip.loadAsync(data);
      const mediaFolder = zip.folder('xl/media');

      if (mediaFolder) {
        const imagePromises: Promise<string>[] = [];
        mediaFolder.forEach((relativePath, file) => {
          if (!file.dir) {
            const promise = file.async('base64').then(base64 => {
              const extension = relativePath.split('.').pop()?.toLowerCase();
              return `data:image/${extension};base64,${base64}`;
              }).catch(() => null); // Ignore failed images
            imagePromises.push(promise);
          }
        });

          const images = await Promise.all(imagePromises);
          parsedData.images = images.filter(img => img !== null);
          console.log(`🖼️ Imágenes extraídas: ${parsedData.images.length}`);
        }
      } catch (imageError) {
        console.warn('⚠️ Error extrayendo imágenes:', imageError);
      }

      // 7. Load data into the application
             if (parsedData.materials.length > 0) {
               loadFromExcel(parsedData);
               console.log('✅ Datos cargados exitosamente en la aplicación');

               // Notificación al usuario
               alert(`¡Datos cargados exitosamente!\n\nSe crearon ${parsedData.materials.length} materiales.\nSe encontraron ${parsedData.images?.length || 0} imágenes.\n\nLos datos están disponibles en la pestaña "Explosión de Materiales" del modelo actual.`);

             } else {
        const errorDetails = [
          'No se encontraron materiales válidos en el archivo.',
          `Se procesaron ${processedRows} filas potenciales de datos.`,
          `Se encontraron ${parsedData.images?.length || 0} imágenes.`,
          'Posibles causas:',
          '• Las filas de datos pueden estar en una hoja diferente',
          '• El formato de los datos puede ser diferente al esperado',
          '• Las filas pueden estar completamente vacías',
          `Revisar filas desde la ${materialStartRowIndex + 1} en adelante`
        ].join('\n');

        throw new Error(errorDetails);
      }

    } catch (error) {
      console.error('❌ Error procesando archivo Excel:', error);

      let errorMessage = 'Hubo un error al procesar el archivo Excel.\n\n';

      if (error instanceof Error) {
        errorMessage += `Error: ${error.message}\n\n`;
      }

      errorMessage += 'Sugerencias:\n';
      errorMessage += '• Verifica que el archivo no esté dañado\n';
      errorMessage += '• Asegúrate de que tenga al menos una hoja con datos\n';
      errorMessage += '• Revisa que las columnas de materiales estén en el orden correcto\n';
      errorMessage += '• Los materiales deben tener al menos descripción y proveedor\n\n';
      errorMessage += 'Revisa la consola del navegador para más detalles.';

      alert(errorMessage);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        className="hidden"
        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-wait"
      >
        <FileUp className="h-5 w-5 mr-2" />
        {isLoading ? 'Importando...' : 'Importar Excel'}
      </button>
    </>
  );
}
