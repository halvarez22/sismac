import React from 'react';
import { useModelStore } from '../store/useModelStore';
import type { ProductionOperation } from '../types';
import { PlusCircle, Trash2, Clock, Settings, Users } from 'lucide-react';

export default function ProductionRouteForm() {
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const updateProductionRoute = useModelStore((state) => state.updateProductionRoute);
  const addProductionOperation = useModelStore((state) => state.addProductionOperation);
  const updateProductionOperation = useModelStore((state) => state.updateProductionOperation);
  const removeProductionOperation = useModelStore((state) => state.removeProductionOperation);

  // Si no hay modelo seleccionado, mostrar mensaje
  if (!selectedModel) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Selecciona un modelo para gestionar la ruta de producción</p>
      </div>
    );
  }

  const { productionRoute } = selectedModel;
  const totalTime = productionRoute.operations.reduce((sum, op) => sum + op.standardTime + op.setupTime, 0);

  const handleRouteChange = (field: string, value: string | number) => {
    updateProductionRoute({
      ...productionRoute,
      [field]: value,
      ...(field === 'operations' && { totalTime })
    });
  };

  const handleOperationChange = (id: string, field: keyof ProductionOperation, value: ProductionOperation[keyof ProductionOperation]) => {
    updateProductionOperation(id, field, value);
  };

  const handleRemoveOperation = (id: string) => {
    removeProductionOperation(id);
  };

  return (
    <div className="space-y-6">
      {/* Información de la Ruta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Ruta
          </label>
          <input
            type="text"
            value={productionRoute.name}
            onChange={(e) => handleRouteChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
            placeholder="Ej: Ruta Principal Sandalias"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Eficiencia Esperada (%)
          </label>
          <input
            type="number"
            value={productionRoute.efficiency}
            onChange={(e) => handleRouteChange('efficiency', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tiempo Total Estimado
          </label>
          <div className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-900 dark:text-gray-100">{totalTime.toFixed(1)} min</span>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notas
        </label>
        <textarea
          value={productionRoute.notes}
          onChange={(e) => handleRouteChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
          placeholder="Notas adicionales sobre la ruta de producción..."
        />
      </div>

      {/* Operaciones de Producción */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Operaciones de Producción</h3>
          <button
            onClick={addProductionOperation}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar Operación
          </button>
        </div>

        {productionRoute.operations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay operaciones definidas</p>
            <p className="text-sm">Haz clic en "Agregar Operación" para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productionRoute.operations
              .sort((a, b) => a.sequence - b.sequence)
              .map((operation, index) => (
                <div key={operation.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
                        {operation.sequence || index + 1}
                      </span>
                      <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        {operation.name || `Operación ${index + 1}`}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleRemoveOperation(operation.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={operation.name}
                        onChange={(e) => handleOperationChange(operation.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                        placeholder="Ej: Corte de material"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Departamento
                      </label>
                      <select
                        value={operation.department}
                        onChange={(e) => handleOperationChange(operation.id, 'department', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                      >
                        <option value="">Seleccionar</option>
                        <option value="Corte">Corte</option>
                        <option value="Pegado">Pegado</option>
                        <option value="Montaje">Montaje</option>
                        <option value="Acabado">Acabado</option>
                        <option value="Calidad">Calidad</option>
                        <option value="Empaque">Empaque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Máquina/Equipo
                      </label>
                      <input
                        type="text"
                        value={operation.machine}
                        onChange={(e) => handleOperationChange(operation.id, 'machine', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                        placeholder="Ej: Prensa hidráulica"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nivel de Habilidad
                      </label>
                      <select
                        value={operation.skillLevel}
                        onChange={(e) => handleOperationChange(operation.id, 'skillLevel', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                      >
                        <option value="basic">Básico</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tiempo Estándar (min)
                      </label>
                      <input
                        type="number"
                        value={operation.standardTime}
                        onChange={(e) => handleOperationChange(operation.id, 'standardTime', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tiempo de Setup (min)
                      </label>
                      <input
                        type="number"
                        value={operation.setupTime}
                        onChange={(e) => handleOperationChange(operation.id, 'setupTime', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Secuencia
                      </label>
                      <input
                        type="number"
                        value={operation.sequence}
                        onChange={(e) => handleOperationChange(operation.id, 'sequence', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total Tiempo
                      </label>
                      <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {(operation.standardTime + operation.setupTime).toFixed(1)} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={operation.description}
                      onChange={(e) => handleOperationChange(operation.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
                      placeholder="Descripción detallada de la operación..."
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
