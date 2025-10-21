import React from 'react';
import { useModelStore } from '../store/useModelStore';
import type { TechnicalSpecifications } from '../types';
import { Ruler, Weight, Shield, TestTube, Package, Heart } from 'lucide-react';

export default function TechnicalSpecificationsForm() {
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const updateTechnicalSpecifications = useModelStore((state) => state.updateTechnicalSpecifications);

  // Si no hay modelo seleccionado, mostrar mensaje
  if (!selectedModel) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Selecciona un modelo para gestionar las especificaciones técnicas</p>
      </div>
    );
  }

  const { technicalSpecifications: specs } = selectedModel;

  const handleSpecsChange = (field: string, value: any) => {
    updateTechnicalSpecifications({
      ...specs,
      [field]: value,
    });
  };

  const handleDimensionChange = (dimension: string, value: number | string) => {
    updateTechnicalSpecifications({
      ...specs,
      dimensions: {
        ...specs.dimensions,
        [dimension]: value,
      },
    });
  };

  const handleWeightChange = (field: string, value: number | string) => {
    updateTechnicalSpecifications({
      ...specs,
      weight: {
        ...specs.weight,
        [field]: value,
      },
    });
  };

  const handleArrayChange = (field: keyof TechnicalSpecifications, value: string[]) => {
    updateTechnicalSpecifications({
      ...specs,
      [field]: value,
    });
  };

  const addArrayItem = (field: keyof TechnicalSpecifications, item: string) => {
    if (!item.trim()) return;
    const currentArray = specs[field] as string[];
    if (!currentArray.includes(item.trim())) {
      handleArrayChange(field, [...currentArray, item.trim()]);
    }
  };

  const removeArrayItem = (field: keyof TechnicalSpecifications, index: number) => {
    const currentArray = specs[field] as string[];
    handleArrayChange(field, currentArray.filter((_, i) => i !== index));
  };

  const ArrayInput = ({
    label,
    field,
    placeholder,
    icon: Icon
  }: {
    label: string;
    field: keyof TechnicalSpecifications;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const [inputValue, setInputValue] = React.useState('');
    const array = specs[field] as string[];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem(field, inputValue);
                setInputValue('');
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 text-sm"
          />
          <button
            onClick={() => {
              addArrayItem(field, inputValue);
              setInputValue('');
            }}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {array.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            >
              {item}
              <button
                onClick={() => removeArrayItem(field, index)}
                className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Dimensiones */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Ruler className="h-5 w-5 mr-2" />
          Dimensiones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Largo
            </label>
            <div className="flex">
              <input
                type="number"
                value={specs.dimensions.length}
                onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-l-md text-sm"
                step="0.1"
                min="0"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-500 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md text-sm text-gray-600 dark:text-gray-300">
                {specs.dimensions.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ancho
            </label>
            <div className="flex">
              <input
                type="number"
                value={specs.dimensions.width}
                onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-l-md text-sm"
                step="0.1"
                min="0"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-500 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md text-sm text-gray-600 dark:text-gray-300">
                {specs.dimensions.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alto
            </label>
            <div className="flex">
              <input
                type="number"
                value={specs.dimensions.height}
                onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-l-md text-sm"
                step="0.1"
                min="0"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-500 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md text-sm text-gray-600 dark:text-gray-300">
                {specs.dimensions.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidad
            </label>
            <select
              value={specs.dimensions.unit}
              onChange={(e) => handleDimensionChange('unit', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
            >
              <option value="cm">Centímetros</option>
              <option value="mm">Milímetros</option>
              <option value="in">Pulgadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Peso */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Weight className="h-5 w-5 mr-2" />
          Peso
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Peso Objetivo
            </label>
            <div className="flex">
              <input
                type="number"
                value={specs.weight.target}
                onChange={(e) => handleWeightChange('target', parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-l-md text-sm"
                step="0.1"
                min="0"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-500 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md text-sm text-gray-600 dark:text-gray-300">
                {specs.weight.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tolerancia
            </label>
            <div className="flex">
              <input
                type="number"
                value={specs.weight.tolerance}
                onChange={(e) => handleWeightChange('tolerance', parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-l-md text-sm"
                step="0.1"
                min="0"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-500 border border-l-0 border-gray-300 dark:border-gray-500 rounded-r-md text-sm text-gray-600 dark:text-gray-300">
                {specs.weight.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidad
            </label>
            <select
              value={specs.weight.unit}
              onChange={(e) => handleWeightChange('unit', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
            >
              <option value="g">Gramos</option>
              <option value="kg">Kilogramos</option>
              <option value="oz">Onzas</option>
              <option value="lb">Libras</option>
            </select>
          </div>
        </div>
      </div>

      {/* Especificaciones de Calidad */}
      <ArrayInput
        label="Estándares de Calidad"
        field="qualityStandards"
        placeholder="Ej: ISO 9001, ASTM D-1000"
        icon={Shield}
      />

      {/* Requisitos de Pruebas */}
      <ArrayInput
        label="Requisitos de Pruebas"
        field="testingRequirements"
        placeholder="Ej: Prueba de flexión, resistencia al desgaste"
        icon={TestTube}
      />

      {/* Especificaciones de Empaque */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Package className="h-4 w-4 mr-2" />
          Especificaciones de Empaque
        </label>
        <textarea
          value={specs.packagingSpecifications}
          onChange={(e) => handleSpecsChange('packagingSpecifications', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
          placeholder="Detalles sobre empaque, caja, etiquetado, etc..."
        />
      </div>

      {/* Instrucciones de Cuidado */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          Instrucciones de Cuidado
        </label>
        <textarea
          value={specs.careInstructions}
          onChange={(e) => handleSpecsChange('careInstructions', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
          placeholder="Instrucciones para el cuidado y mantenimiento del calzado..."
        />
      </div>

      {/* Certificaciones */}
      <ArrayInput
        label="Certificaciones Requeridas"
        field="certifications"
        placeholder="Ej: Certificación ecológica, cuero certificado"
        icon={Shield}
      />
    </div>
  );
}
