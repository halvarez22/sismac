import React from 'react';
import { useModelStore } from '../store/useModelStore';
import { Eye, Trash2, FileText } from 'lucide-react';
import type { Model } from '../types';

export default function ModelsList() {
  const models = useModelStore((state) => state.models);
  const selectModel = useModelStore((state) => state.selectModel);
  const deleteModel = useModelStore((state) => state.deleteModel);

  const handleSelectModel = (modelId: string) => {
    selectModel(modelId);
  };

  const handleDeleteModel = (modelId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Evitar que se seleccione el modelo al hacer clic en eliminar
    if (confirm('¿Estás seguro de que quieres eliminar este modelo?')) {
      deleteModel(modelId);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getTotalMaterials = (model: Model) => {
    return model.materials.length;
  };

  const getTotalImages = (model: Model) => {
    return model.images.length;
  };

  const getModelDisplayName = (model: Model) => {
    const { header } = model;
    const parts = [];

    // Cliente
    if (header.client) {
      parts.push(header.client.toUpperCase());
    }

    // Aquí podríamos agregar más información descriptiva si estuviera disponible
    // Por ahora usamos una estructura simple pero descriptiva

    // Código del molde como "ESTILO XXX"
    if (header.moldCode) {
      parts.push(`ESTILO ${header.moldCode}`);
    }

    // Color
    if (header.color) {
      parts.push(header.color.toUpperCase());
    }

    // Pares
    if (header.requestedPairs > 0) {
      parts.push(`POR ${header.requestedPairs} PRS`);
    }

    return parts.join(' ') || 'Modelo sin información';
  };

  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay modelos</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comienza creando tu primer modelo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estilo/Modelo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Materiales
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Imágenes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Costo Total
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {models.map((model) => (
              <tr
                key={model.id}
                onClick={() => handleSelectModel(model.id)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                        {getModelDisplayName(model)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Semana {model.header.week} • {model.header.date ? new Date(model.header.date).toLocaleDateString('es-ES') : 'Sin fecha'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                      {getTotalMaterials(model)} materiales
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200">
                      {getTotalImages(model)} imágenes
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(model.financials.totalCost)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    por par: {formatCurrency(model.financials.totalCost / Math.max(model.header.requestedPairs, 1))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectModel(model.id);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteModel(model.id, e)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                      title="Eliminar modelo"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
