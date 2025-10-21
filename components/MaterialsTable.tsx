
import React from 'react';
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

  // Si no hay modelo seleccionado, mostrar mensaje
  if (!selectedModel) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Selecciona un modelo para ver los materiales</p>
      </div>
    );
  }

  const { materials } = selectedModel;

  const handleInputChange = (id: string, field: keyof Material, value: string) => {
    const isNumeric = ['priceWithoutVAT', 'netPrice', 'width', 'consumptionPerPair', 'minimumOrder', 'leadTime'].includes(field as string);
    const parsedValue = isNumeric ? parseFloat(value) || 0 : value;
    // FIX: Removed `as any` cast. After fixing the store's type definitions, this is now type-safe.
    updateMaterial(id, field, parsedValue);
  };
  
  const columns = [
    { key: 'materialType', label: 'Tipo', type: 'select', options: ['upper', 'sole', 'lining', 'insole', 'heel', 'accessory', 'packaging'] },
    { key: 'description', label: 'Descripción', type: 'text' },
    { key: 'technicalName', label: 'Nombre Técnico', type: 'text' },
    { key: 'provider', label: 'Proveedor', type: 'text' },
    { key: 'priceWithoutVAT', label: 'Precio s/IVA', type: 'number' },
    { key: 'netPrice', label: 'Precio Neto', type: 'number' },
    { key: 'purchaseUnit', label: 'Un. Compra', type: 'text' },
    { key: 'width', label: 'Ancho', type: 'number' },
    { key: 'consumptionPerPair', label: 'Consumo/Par', type: 'number' },
    { key: 'consumptionUnit', label: 'Un. Consumo', type: 'text' },
    { key: 'costPerPair', label: 'Costo/Par', type: 'number', readOnly: true },
    { key: 'totalBudget', label: 'Presupuesto Total', type: 'number', readOnly: true },
    { key: 'minimumOrder', label: 'Pedido Mín.', type: 'number' },
    { key: 'leadTime', label: 'Tiempo Entrega', type: 'number' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map(col => (
              <th key={col.key} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
            <th scope="col" className="relative px-3 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {materials.map((material, index) => (
            <tr key={material.id}>
              {columns.map(col => (
                <td key={col.key} className="px-2 py-1 whitespace-nowrap">
                  {col.type === 'select' ? (
                    <select
                      value={material[col.key as keyof Material] as string}
                      onChange={(e) => handleInputChange(material.id, col.key as keyof Material, e.target.value)}
                      disabled={col.readOnly}
                      className={`w-full text-sm border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 ${col.readOnly ? 'bg-gray-100 dark:bg-gray-600' : 'bg-white dark:bg-gray-700'} transition-colors`}
                      aria-label={col.label}
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
                      className={`w-full text-sm border-transparent rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 ${col.readOnly ? 'bg-gray-100 dark:bg-gray-600' : 'bg-white dark:bg-gray-700'} transition-colors`}
                      aria-label={col.label}
                      step={col.type === 'number' ? '0.01' : undefined}
                    />
                  )}
                </td>
              ))}
              <td className="px-2 py-1 whitespace-nowrap text-right text-sm font-medium">
                {materials.length > 1 && (
                  <button onClick={() => removeMaterial(material.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       <div className="p-4 bg-gray-50 border-t">
        <button
          onClick={addMaterial}
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Agregar Material
        </button>
      </div>
    </div>
  );
}
