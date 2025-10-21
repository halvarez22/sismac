
import React, { useRef, useState } from 'react';
import { useModelStore } from '../store/useModelStore';
import { FileUp } from 'lucide-react';
import { read, utils } from 'xlsx';
import JSZip from 'jszip';
import type { ParsedExcelData } from '../types';

export default function ExcelImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadFromExcel = useModelStore((state) => state.loadFromExcel);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
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
      parsedData.header.moldCode = String(worksheet['B2']?.v || '');
      parsedData.header.client = String(worksheet['B3']?.v || '');
      parsedData.header.color = String(worksheet['B4']?.v || '');
      parsedData.header.requestedPairs = Number(worksheet['F2']?.v || 0);
      parsedData.header.designer = String(worksheet['F3']?.v || '');
      parsedData.header.week = Number(worksheet['F4']?.v || 0);

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
