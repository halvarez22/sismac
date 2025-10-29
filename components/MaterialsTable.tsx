
import React, { useRef, useEffect } from 'react';
import { useModelStore } from '../store/useModelStore';
import type { Material } from '../types';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function MaterialsTable() {
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const addMaterial = useModelStore((state) => state.addMaterial);
  const updateMaterial = useModelStore((state) => state.updateMaterial);
  const removeMaterial = useModelStore((state) => state.removeMaterial);

  // Referencias para sincronizar el scroll horizontal
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Sincronizar scroll horizontal entre header y body
  useEffect(() => {
    const headerScroll = headerScrollRef.current;
    const bodyScroll = bodyScrollRef.current;

    if (!headerScroll || !bodyScroll) return;

    const handleHeaderScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      bodyScroll.scrollLeft = headerScroll.scrollLeft;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };

    const handleBodyScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      headerScroll.scrollLeft = bodyScroll.scrollLeft;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };

    headerScroll.addEventListener('scroll', handleHeaderScroll);
    bodyScroll.addEventListener('scroll', handleBodyScroll);

    return () => {
      headerScroll.removeEventListener('scroll', handleHeaderScroll);
      bodyScroll.removeEventListener('scroll', handleBodyScroll);
    };
  }, []);

  // Si no hay modelo seleccionado, mostrar mensaje
  if (!selectedModel) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Selecciona un modelo para ver los materiales</p>
      </div>
    );
  }

  const { materials } = selectedModel;

  const handleInputChange = (id: string, field: keyof Material, value: string | boolean) => {
    const isNumeric = ['priceWithoutVAT', 'netPrice', 'width', 'consumptionPerPair', 'minimumOrder', 'requiredToBuy', 'costPerPair', 'totalBudget', 'leadTime'].includes(field as string);
    const isBoolean = ['comprado', 'oc'].includes(field as string);

    let parsedValue: any;
    if (isBoolean) {
      parsedValue = Boolean(value);
    } else if (isNumeric) {
      parsedValue = parseFloat(value as string) || 0;
    } else {
      parsedValue = value;
    }

    updateMaterial(id, field, parsedValue);
  };
  
  const columns = [
    { key: 'description', label: 'Descripción', type: 'text' },
    { key: 'technicalName', label: 'Nombre', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'provider', label: 'Proveedor', type: 'text' },
    { key: 'priceWithoutVAT', label: 'Precio s/IVA', type: 'number' },
    { key: 'netPrice', label: 'Precio Neto', type: 'number' },
    { key: 'purchaseUnit', label: 'Unidad Compra', type: 'text' },
    { key: 'width', label: 'Ancho', type: 'number' },
    { key: 'consumptionPerPair', label: 'Consumos', type: 'number' },
    { key: 'consumptionUnit', label: 'Unidad Consumo', type: 'text' },
    { key: 'requiredToBuy', label: 'Req. Comprar', type: 'number', readOnly: true },
    { key: 'minimumOrder', label: 'Unidad', type: 'number' },
    { key: 'oc', label: 'OC', type: 'checkbox' },
    { key: 'comprado', label: 'Comprado', type: 'checkbox' },
    { key: 'costPerPair', label: 'Costo/Par', type: 'number', readOnly: true },
    { key: 'totalBudget', label: 'Presupuesto', type: 'number', readOnly: true },
  ];

  return (
    <div className="w-full">
      {/* Header fijo con título y botón */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Materiales del Modelo ({materials.length})
          </h3>
          <button
            onClick={addMaterial}
            className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-md transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Agregar Material
          </button>
        </div>
      </div>

      {/* Barra de desplazamiento horizontal sincronizada con el body */}
      <div
        ref={headerScrollRef}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
      >
        <div className="min-w-[1600px] px-6 py-3">
          {/* Encabezados de columna perfectamente alineados */}
          <div className="flex bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            {columns.map(col => (
              <div key={col.key} className="flex-shrink-0 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[110px] border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                {col.label}
              </div>
            ))}
            <div className="flex-shrink-0 px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[80px]">
              Acciones
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo de la tabla con barra de desplazamiento sincronizada */}
      <div
        ref={bodyScrollRef}
        className="overflow-x-auto overflow-y-auto max-h-[70vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
      >
          <div className="min-w-[1600px]">
          {materials.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <p>No hay materiales registrados para este modelo.</p>
              <p className="text-sm mt-2">Haz clic en "Agregar Material" para comenzar.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {materials.map((material, index) => (
                <div key={material.id} className="flex hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {columns.map(col => (
                    <div key={col.key} className="flex-shrink-0 px-3 py-4 w-[110px] border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                      {col.key === 'priceWithoutVAT' || col.key === 'netPrice' ? (
                        // Campos de precio con símbolo $
                        <div className="flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">$</span>
                          <input
                            type={col.type}
                            value={material[col.key as keyof Material] as string | number}
                            readOnly={col.readOnly}
                            onChange={(e) => handleInputChange(material.id, col.key as keyof Material, e.target.value)}
                            className={`w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 ${col.readOnly ? 'bg-gray-100 dark:bg-gray-600' : 'bg-white dark:bg-gray-700'} transition-colors`}
                            aria-label={col.label}
                            title={String(material[col.key as keyof Material] || '')}
                            step={col.type === 'number' ? '0.01' : undefined}
                          />
                        </div>
                      ) : col.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={material[col.key as keyof Material] as boolean}
                          onChange={(e) => handleInputChange(material.id, col.key as keyof Material, e.target.checked)}
                          disabled={col.readOnly}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          aria-label={col.label}
                          title={`${col.label}: ${material[col.key as keyof Material] ? 'Marcado' : 'No marcado'}`}
                        />
                      ) : col.type === 'select' ? (
                        <select
                          value={material[col.key as keyof Material] as string}
                          onChange={(e) => handleInputChange(material.id, col.key as keyof Material, e.target.value)}
                          disabled={col.readOnly}
                          className={`w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 ${col.readOnly ? 'bg-gray-100 dark:bg-gray-600' : 'bg-white dark:bg-gray-700'} transition-colors`}
                          aria-label={col.label}
                          title={`${col.label}: ${String(material[col.key as keyof Material] || 'Sin seleccionar')}`}
                        >
                          <option value="">Seleccionar...</option>
                          {col.options?.map(option => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.type}
                          value={material[col.key as keyof Material] as string | number}
                          readOnly={col.readOnly}
                          onChange={(e) => handleInputChange(material.id, col.key as keyof Material, e.target.value)}
                          className={`w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 ${col.readOnly ? 'bg-gray-100 dark:bg-gray-600' : 'bg-white dark:bg-gray-700'} transition-colors`}
                          aria-label={col.label}
                          title={`${col.label}: ${String(material[col.key as keyof Material] || '')}`}
                          step={col.type === 'number' ? '0.01' : undefined}
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex-shrink-0 px-3 py-4 w-[80px] flex items-center justify-center">
                    {materials.length > 1 && (
                      <button
                        onClick={() => removeMaterial(material.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                        title="Eliminar material"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
