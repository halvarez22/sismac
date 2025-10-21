
import React from 'react';
import { useModelStore } from '../store/useModelStore';
import { shallow } from 'zustand/shallow';
import type { ModelHeader } from '../types';

// Helper component to avoid re-rendering the whole form on every keystroke
function FormInput<T>({ label, field, value, type, onChange }: {
    label: string;
    field: keyof T;
    value: string | number;
    type: string;
    onChange: (field: keyof T, value: string | number) => void;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
        onChange(field, val);
    };

    return (
        <div>
            <label htmlFor={field as string} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input
                type={type}
                id={field as string}
                name={field as string}
                value={value}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 sm:text-sm transition-colors"
            />
        </div>
    );
}


export default function ModelHeaderForm() {
    const selectedModel = useModelStore((state) =>
        state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
    );
    const setHeaderField = useModelStore((state) => state.setHeaderField);

    // Si no hay modelo seleccionado, mostrar mensaje
    if (!selectedModel) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Selecciona un modelo para editar</p>
            </div>
        );
    }

    const { header } = selectedModel;
    
    const handleFieldChange = (field: keyof ModelHeader, value: string | number) => {
        // FIX: Removed `as any` cast. After fixing the store's type definitions, this is now type-safe.
        setHeaderField(field, value);
    };

    return (
        <div className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormInput label="Código Molde" field="moldCode" value={header.moldCode} type="text" onChange={handleFieldChange} />
                <FormInput label="Cliente" field="client" value={header.client} type="text" onChange={handleFieldChange} />
                <FormInput label="Color" field="color" value={header.color} type="text" onChange={handleFieldChange} />
                <FormInput label="Pares Solicitados" field="requestedPairs" value={header.requestedPairs} type="number" onChange={handleFieldChange} />
                <FormInput label="Diseñadora" field="designer" value={header.designer} type="text" onChange={handleFieldChange} />
                <FormInput label="Semana" field="week" value={header.week} type="number" onChange={handleFieldChange} />
                <FormInput label="Fecha" field="date" value={header.date} type="date" onChange={handleFieldChange} />
            </div>

            {/* Información Técnica */}
            <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                        <select
                            id="category"
                            name="category"
                            value={header.category}
                            onChange={(e) => handleFieldChange('category', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Seleccionar categoría</option>
                            <option value="Mujer">Mujer</option>
                            <option value="Hombre">Hombre</option>
                            <option value="Niño">Niño</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estilo</label>
                        <select
                            id="style"
                            name="style"
                            value={header.style}
                            onChange={(e) => handleFieldChange('style', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Seleccionar estilo</option>
                            <option value="Sandalia">Sandalia</option>
                            <option value="Zapato">Zapato</option>
                            <option value="Bota">Bota</option>
                            <option value="Zapatilla">Zapatilla</option>
                            <option value="Mocasín">Mocasín</option>
                            <option value="Botín">Botín</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="season" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Temporada</label>
                        <select
                            id="season"
                            name="season"
                            value={header.season}
                            onChange={(e) => handleFieldChange('season', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Seleccionar temporada</option>
                            <option value="Primavera">Primavera</option>
                            <option value="Verano">Verano</option>
                            <option value="Otoño">Otoño</option>
                            <option value="Invierno">Invierno</option>
                        </select>
                    </div>

                    <FormInput label="Precio Objetivo ($)" field="targetPrice" value={header.targetPrice} type="number" onChange={handleFieldChange} />

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                        <select
                            id="status"
                            name="status"
                            value={header.status}
                            onChange={(e) => handleFieldChange('status', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                        >
                            <option value="draft">Borrador</option>
                            <option value="review">En Revisión</option>
                            <option value="approved">Aprobado</option>
                            <option value="production">En Producción</option>
                            <option value="discontinued">Discontinuado</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Versión:</span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">{header.version}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
