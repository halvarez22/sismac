
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
      // Parse file name for additional information
      const fileNameInfo = parseFileName(file.name);
      console.log('Parsed file name info:', fileNameInfo);

      const data = await file.arrayBuffer();

      const parsedData: ParsedExcelData = {
        header: {},
        materials: [],
        images: []
      };

      // 1. Parse sheet data with xlsx
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

      // Assuming a specific structure
      // Header data in specific cells
      // FIX: Explicitly cast excel values to the correct types to prevent assignment errors.

      // First, get data from Excel cells
      const excelMoldCode = String(worksheet['B2']?.v || '');
      const excelClient = String(worksheet['B3']?.v || '');
      const excelColor = String(worksheet['B4']?.v || '');
      const excelRequestedPairs = Number(worksheet['F2']?.v || 0);
      const excelDesigner = String(worksheet['F3']?.v || '');
      const excelWeek = Number(worksheet['F4']?.v || 0);

      // Override with file name information if available (file name takes precedence)
      parsedData.header.moldCode = fileNameInfo.styleCode || excelMoldCode;
      parsedData.header.client = fileNameInfo.brand || excelClient;
      parsedData.header.color = fileNameInfo.color || excelColor;
      parsedData.header.requestedPairs = fileNameInfo.quantity || excelRequestedPairs;
      parsedData.header.designer = excelDesigner;
      parsedData.header.week = excelWeek;

      // Show extracted information from filename to user
      const extractedInfo = [];
      if (fileNameInfo.brand) extractedInfo.push(`Marca: ${fileNameInfo.brand}`);
      if (fileNameInfo.productDescription) extractedInfo.push(`Producto: ${fileNameInfo.productDescription}`);
      if (fileNameInfo.styleCode) extractedInfo.push(`Estilo: ${fileNameInfo.styleCode}`);
      if (fileNameInfo.color) extractedInfo.push(`Color: ${fileNameInfo.color}`);
      if (fileNameInfo.quantity) extractedInfo.push(`Cantidad: ${fileNameInfo.quantity} pares`);
      if (fileNameInfo.component) extractedInfo.push(`Componente: ${fileNameInfo.component}`);
      if (fileNameInfo.baseStyle) extractedInfo.push(`Base del estilo: ${fileNameInfo.baseStyle}`);

      if (extractedInfo.length > 0) {
        const message = `Información extraída del nombre del archivo:\n${extractedInfo.join('\n')}\n\nEsta información se ha aplicado automáticamente a los campos correspondientes.`;
        alert(message);
        console.log('Extracted file info:', extractedInfo);
      }

      // Materials table starting from row 8 (index 7)
      const materialRows = json.slice(7);
      materialRows.forEach(row => {
          if (row[0]) { // Check if first cell has content
              parsedData.materials.push({
                  description: String(row[0] || ''),
                  technicalName: String(row[1] || ''),
                  provider: String(row[2] || ''),
                  priceWithoutVAT: Number(row[3]) || 0,
                  netPrice: Number(row[4]) || 0,
                  purchaseUnit: String(row[5] || ''),
                  width: Number(row[6]) || 0,
                  consumptionPerPair: Number(row[7]) || 0,
                  consumptionUnit: String(row[8] || ''),
              });
          }
      });

      // 2. Extract images with jszip
      const zip = await JSZip.loadAsync(data);
      const mediaFolder = zip.folder('xl/media');
      if (mediaFolder) {
        const imagePromises: Promise<string>[] = [];
        mediaFolder.forEach((relativePath, file) => {
          if (!file.dir) {
            const promise = file.async('base64').then(base64 => {
              const extension = relativePath.split('.').pop()?.toLowerCase();
              return `data:image/${extension};base64,${base64}`;
            });
            imagePromises.push(promise);
          }
        });
        parsedData.images = await Promise.all(imagePromises);
      }
      
      loadFromExcel(parsedData);
      alert('Datos importados correctamente desde Excel.');

    } catch (error) {
      console.error('Error importing Excel file:', error);
      alert('Hubo un error al importar el archivo. Revisa el formato y la consola.');
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
