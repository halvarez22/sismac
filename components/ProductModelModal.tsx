/// <reference types="vite/client" />

import React, { useState, useEffect, useRef } from 'react';
import { ProductModel, MaterialInventory } from '../types';
import Groq from 'groq-sdk';
import SubstituteSuggestionsModal from './SubstituteSuggestionsModal';

interface ProductModelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (model: ProductModel) => void;
    existingModel: ProductModel | null;
    inventoryData: MaterialInventory[];
    existingModelIds: string[];
}

// Type for AI suggestions, can be expanded as needed
export type SubstituteSuggestion = {
    substituteSku: string;
    justification: string;
    costImpactPerPair: number;
    // Enriched properties
    substituteName?: string;
    substituteUnitCost?: number;
};


const ProductModelModal: React.FC<ProductModelModalProps> = ({ isOpen, onClose, onSave, existingModel, inventoryData, existingModelIds }) => {
    
    const getInitialState = (): ProductModel => ({
        id: '',
        name: '',
        description: '',
        category: '',
        targetCost: 0,
        notes: '',
        bom: [],
    });

    const [model, setModel] = useState<ProductModel>(getInitialState());
    const [errors, setErrors] = useState<{ [key: string]: any }>({});
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // State for AI suggestions
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SubstituteSuggestion[]>([]);
    const [analyzingBomItemIndex, setAnalyzingBomItemIndex] = useState<number | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [modalSize, setModalSize] = useState({ width: 'max-w-6xl', height: 'max-h-[95vh]' });
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setModel(existingModel ? { ...existingModel } : getInitialState());
            setErrors({});
            setOpenDropdownIndex(null);
            setSearchTerm('');
        }
    }, [isOpen, existingModel]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSuggestSubstitute = async (index: number) => {
        const bom = model.bom || [];
        if (index >= bom.length) return;
        const originalItem = bom[index];
        const originalMaterial = inventoryData.find(m => m.id === originalItem.materialSku);
        if (!originalMaterial) return;

        setIsSuggesting(true);
        setSuggestionError(null);
        setAnalyzingBomItemIndex(index);

        try {
            if (!import.meta.env.VITE_GROQ_API_KEY) {
                // Demo mode
                setSuggestions([
                    { substituteSku: 'CV-A-001', justification: 'Misma categoría, costo menor.', costImpactPerPair: -18, substituteName: 'Cuero Vegano Azul', substituteUnitCost: 250 },
                    { substituteSku: 'PN-R-002', justification: 'Misma categoría, similar.', costImpactPerPair: -3, substituteName: 'Piel Nappa Roja', substituteUnitCost: 300 },
                ]);
                setIsSuggestionModalOpen(true);
                return;
            }

            const ai = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY as string, dangerouslyAllowBrowser: true });

            const prompt = `
                System: Eres un ingeniero de materiales experto para un fabricante de calzado. Tu tarea es encontrar sustitutos adecuados para un material de nuestra lista de inventario, centrándote en la similitud funcional y el impacto en el costo. Todas las respuestas deben ser en español.

                User:
                Necesito encontrar un sustituto para el siguiente material en mi Lista de Materiales (BOM):
                - Material Original: ${JSON.stringify({ sku: originalMaterial.id, name: originalMaterial.name, category: originalMaterial.category, unitCost: originalMaterial.unitCost })}
                - Cantidad necesaria por par de zapatos: ${originalItem.quantityPerUnit} ${originalMaterial.unit}

                Aquí está nuestra lista de inventario actual. No sugieras el material original:
                ${JSON.stringify(inventoryData.map(({ id, name, category, unitCost, quantity }) => ({ id, name, category, unitCost, stock: quantity })))}

                Analiza el inventario y sugiere hasta 3 sustitutos. Para cada sugerencia, proporciona:
                1. El SKU del sustituto.
                2. Una breve justificación de por qué es un sustituto adecuado (ej. misma categoría, nombre similar).
                3. El impacto en el costo por par de zapatos si se utiliza este sustituto (un número negativo significa un ahorro).

                Responde con un JSON object en el siguiente formato:
                {
                  "suggestions": [
                    {
                      "substituteSku": "SKU",
                      "justification": "Justificación",
                      "costImpactPerPair": número
                    }
                  ]
                }
            `;

            const response = await ai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.1-8b-instant',
                response_format: { type: "json_object" },
            });

            const parsedResponse = JSON.parse(response.choices[0]?.message?.content || '{}');
            const enrichedSuggestions = parsedResponse.suggestions.map((sug: SubstituteSuggestion) => {
                const subInfo = inventoryData.find(m => m.id === sug.substituteSku);
                return {
                    ...sug,
                    substituteName: subInfo?.name || 'Desconocido',
                    substituteUnitCost: subInfo?.unitCost || 0
                };
            });

            setSuggestions(enrichedSuggestions);
            setIsSuggestionModalOpen(true);

        } catch (err) {
            console.error("Error fetching AI suggestions:", err);
            setSuggestionError("No se pudieron generar las sugerencias. Intente de nuevo.");
        } finally {
            setIsSuggesting(false);
        }
    };
    
    const handleApplySubstitute = (substituteSku: string) => {
        if (analyzingBomItemIndex !== null) {
            handleBomItemChange(analyzingBomItemIndex, 'materialSku', substituteSku);
        }
        setIsSuggestionModalOpen(false);
        setAnalyzingBomItemIndex(null);
    };


    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setModel(prev => ({
            ...prev,
            [name]: name === 'targetCost' ? parseFloat(value) || 0 : value
        }));
    };
    
    const handleBomItemChange = (index: number, field: 'materialSku' | 'quantityPerUnit', value: string | number) => {
        const bom = model.bom || [];
        if (index >= bom.length) return;
        const updatedBom = [...bom];
        if(field === 'quantityPerUnit') {
            updatedBom[index] = { ...updatedBom[index], [field]: Math.max(0, Number(value)) };
        } else {
            updatedBom[index] = { ...updatedBom[index], [field]: String(value) };
        }
        setModel(prev => ({ ...prev, bom: updatedBom }));
    };

    const handleAddBomItem = () => {
        setModel(prev => ({
            ...prev,
            bom: [...(prev.bom || []), { materialSku: '', quantityPerUnit: 0 }]
        }));
    };

    const handleRemoveBomItem = (index: number) => {
        const bom = model.bom || [];
        if (index >= bom.length) return;
        setModel(prev => ({
            ...prev,
            bom: (prev.bom || []).filter((_, i) => i !== index)
        }));
    };
    
    const validate = (): boolean => {
        const newErrors: { [key: string]: any } = {};
        if (!model.id.trim()) {
            newErrors.id = "El ID del modelo es requerido.";
        } else if (!isEditing && existingModelIds.includes(model.id.trim().toUpperCase())) {
            newErrors.id = "Este ID de modelo ya existe.";
        }
        if (!model.name.trim()) {
            newErrors.name = "El nombre del modelo es requerido.";
        }

        const bom = model.bom || [];
        const bomErrors = bom.map(item => {
            const itemErrors: { [key: string]: string } = {};
            if (!item.materialSku) itemErrors.materialSku = "Seleccione un material.";
            if (item.quantityPerUnit <= 0) itemErrors.quantityPerUnit = "La cantidad debe ser > 0.";
            return Object.keys(itemErrors).length > 0 ? itemErrors : null;
        });

        if(bomErrors.some(e => e !== null)) {
            newErrors.bom = bomErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(validate()) {
            onSave({
                ...model,
                id: model.id.trim().toUpperCase()
            });
        }
    };

    const isEditing = !!existingModel;
    const baseInputClasses = "w-full bg-slate-700 border rounded-lg p-2.5 text-sm text-white";
    const errorInputClasses = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
    const normalInputClasses = "border-slate-600 focus:ring-sky-500 focus:border-sky-500";
    
    const baseItemInputClasses = "w-full bg-slate-700 border rounded-md p-2 text-sm text-white mt-1";
    const errorItemInputClasses = "border-rose-500";
    const normalItemInputClasses = "border-slate-600";

    const filteredInventory = inventoryData.filter(invItem => 
        invItem.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        invItem.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const originalMaterialForSuggestion = analyzingBomItemIndex !== null && (model.bom || []).length > analyzingBomItemIndex ? inventoryData.find(m => m.id === (model.bom || [])[analyzingBomItemIndex].materialSku) : undefined;

    // Funciones de control de ventana
    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
        if (!isMinimized) {
            setModalSize({ width: 'max-w-md', height: 'max-h-20' });
        } else {
            setModalSize({ width: 'max-w-6xl', height: 'max-h-[95vh]' });
        }
    };

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
        if (!isMaximized) {
            setModalSize({ width: 'max-w-none w-[95vw]', height: 'max-h-none h-[95vh]' });
        } else {
            setModalSize({ width: 'max-w-6xl', height: 'max-h-[95vh]' });
        }
    };

    const handleFullscreen = () => {
        if (!isMaximized) {
            setModalSize({ width: 'max-w-none w-[98vw]', height: 'max-h-none h-[98vh]' });
            setIsMaximized(true);
        } else {
            setModalSize({ width: 'max-w-6xl', height: 'max-h-[95vh]' });
            setIsMaximized(false);
        }
    };

    return (
        <>
            <SubstituteSuggestionsModal
                isOpen={isSuggestionModalOpen}
                onClose={() => setIsSuggestionModalOpen(false)}
                isLoading={isSuggesting}
                suggestions={suggestions}
                originalMaterial={originalMaterialForSuggestion}
                onApply={handleApplySubstitute}
                error={suggestionError}
            />
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50">
                    <div
                        ref={modalRef}
                        className={`bg-slate-800 border border-slate-700 rounded-xl shadow-2xl ${modalSize.width} ${modalSize.height} flex flex-col modal-resizable transition-all duration-300`}
                        style={{
                            resize: 'both',
                            minWidth: '400px',
                            minHeight: '300px'
                        }}
                    >
                    <header className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 window-controls">
                                    <button
                                        onClick={handleMinimize}
                                        className="w-6 h-6 rounded-sm bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center text-black text-xs font-bold"
                                        title="Minimizar"
                                    >
                                        −
                                    </button>
                                    <button
                                        onClick={handleMaximize}
                                        className="w-6 h-6 rounded-sm bg-green-500 hover:bg-green-400 flex items-center justify-center text-white text-xs"
                                        title={isMaximized ? "Restaurar" : "Maximizar"}
                                    >
                                        {isMaximized ? '⊞' : '⊟'}
                                    </button>
                                    <button
                                        onClick={handleFullscreen}
                                        className="w-6 h-6 rounded-sm bg-blue-500 hover:bg-blue-400 flex items-center justify-center text-white text-xs"
                                        title="Pantalla completa"
                                    >
                                        ⛶
                                    </button>
                                </div>
                                <h2 className="text-lg font-semibold text-white truncate">{isEditing ? `Editar Modelo: ${model.name}` : 'Crear Nuevo Modelo de Producto'}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-slate-400 px-2 py-1 modal-status">
                                    {isMaximized ? 'Pantalla completa' : isMinimized ? 'Minimizado' : 'Normal'}
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </header>
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="id" className="block text-sm font-medium text-slate-300 mb-1">ID Modelo (SKU) *</label>
                                <input type="text" id="id" name="id" value={model.id} onChange={handleInputChange} disabled={isEditing} className={`${baseInputClasses} ${errors.id ? errorInputClasses : normalInputClasses} ${isEditing ? 'bg-slate-800 cursor-not-allowed' : ''}`} />
                                {errors.id && <p className="text-xs text-rose-400 mt-1">{errors.id}</p>}
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nombre del Modelo *</label>
                                <input type="text" id="name" name="name" value={model.name} onChange={handleInputChange} className={`${baseInputClasses} ${errors.name ? errorInputClasses : normalInputClasses}`} />
                                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
                                <select id="category" name="category" value={model.category} onChange={handleInputChange} className={`${baseInputClasses} ${errors.category ? errorInputClasses : normalInputClasses}`}>
                                    <option value="">Seleccionar categoría</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Deportivo">Deportivo</option>
                                    <option value="Industrial">Industrial</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
                            </div>
                            <div>
                                <label htmlFor="targetCost" className="block text-sm font-medium text-slate-300 mb-1">Costo Objetivo ($)</label>
                                <input type="number" id="targetCost" name="targetCost" value={model.targetCost || 0} onChange={handleInputChange} min="0" step="0.01" className={`${baseInputClasses} ${errors.targetCost ? errorInputClasses : normalInputClasses}`} />
                                {errors.targetCost && <p className="text-xs text-rose-400 mt-1">{errors.targetCost}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Descripción del Modelo</label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={model.description}
                                        onChange={handleInputChange}
                                        onFocus={() => setSearchTerm('')}
                                        rows={3}
                                        className={`${baseInputClasses} ${errors.description ? errorInputClasses : normalInputClasses} resize-none bg-transparent placeholder:text-slate-400`}
                                    />
                                    {!model.description && (
                                        <div className="absolute inset-0 flex items-start px-3 py-2 pointer-events-none">
                                            <span className="text-slate-400 text-sm leading-relaxed">
                                                Describe las características principales del modelo...
                                                <br />
                                                • Materiales destacados y composición
                                                <br />
                                                • Público objetivo y mercado
                                                <br />
                                                • Características técnicas especiales
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">Notas Adicionales</label>
                                <div className="relative">
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={model.notes}
                                        onChange={handleInputChange}
                                        onFocus={() => setSearchTerm('')}
                                        rows={2}
                                        className={`${baseInputClasses} ${errors.notes ? errorInputClasses : normalInputClasses} resize-none bg-transparent placeholder:text-slate-400`}
                                    />
                                    {!model.notes && (
                                        <div className="absolute inset-0 flex items-start px-3 py-2 pointer-events-none">
                                            <span className="text-slate-400 text-sm leading-relaxed">
                                                Notas de diseño y consideraciones especiales...
                                                <br />
                                                • Requisitos específicos del cliente
                                                <br />
                                                • Consideraciones de producción
                                                <br />
                                                • Notas de calidad y control
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {errors.notes && <p className="text-xs text-rose-400 mt-1">{errors.notes}</p>}
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-700 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Lista de Materiales (Bill of Materials - BOM)</h3>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                <div className="overflow-x-auto scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-600 bg-slate-800/30 rounded-lg p-1">
                                    <div className="min-w-max inline-block align-middle">
                                        <div className="text-xs text-slate-400 mb-3 flex items-center gap-2 bg-slate-700/50 rounded-md p-2 border border-slate-600/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                            </svg>
                                            <span className="font-medium">📋 Lista completa de materiales - Desliza horizontalmente para ver todas las columnas</span>
                                        </div>
                                        {(model.bom || []).map((item, index) => {
                                    const selectedMaterialInfo = inventoryData.find(m => m.id === item.materialSku);
                                    const isDropdownOpen = openDropdownIndex === index;
                                    const showSuggestionButton = item.materialSku && !isSuggesting;
                                    const isCurrentlySuggesting = isSuggesting && analyzingBomItemIndex === index;

                                    return (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-start bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 min-w-max hover:bg-slate-800/50 transition-colors">
                                        <div className="col-span-12 md:col-span-5 relative" ref={isDropdownOpen ? dropdownRef : null}>
                                            <label className="text-xs text-slate-400 font-medium mb-1 block">Material (SKU)</label>
                                            <button
                                                type="button"
                                                onClick={() => { setOpenDropdownIndex(isDropdownOpen ? null : index); setSearchTerm(''); }}
                                                className={`${baseItemInputClasses} text-left flex justify-between items-center ${errors.bom?.[index]?.materialSku ? errorItemInputClasses : normalItemInputClasses} min-w-[280px]`}
                                            >
                                                <span className={`truncate pr-2 ${selectedMaterialInfo ? 'text-white' : 'text-slate-400'}`}>
                                                    {selectedMaterialInfo ? `${selectedMaterialInfo.name} (${selectedMaterialInfo.id})` : '-- Seleccionar material --'}
                                                </span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                            {isDropdownOpen && (
                                                <div className="absolute z-20 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg min-w-[300px]">
                                                    <div className="p-2 relative">
                                                        <input
                                                            type="text"
                                                            placeholder=""
                                                            value={searchTerm}
                                                            onChange={e => setSearchTerm(e.target.value)}
                                                            onFocus={() => setSearchTerm('')}
                                                            className="w-full bg-slate-600 border border-slate-500 rounded-md p-2 text-sm text-white placeholder:text-slate-400"
                                                            autoFocus
                                                        />
                                                        {!searchTerm && (
                                                            <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                                                                <span className="text-slate-400 text-sm">Buscar material por nombre o SKU (ej: "cuero", "PUNTERA_8")</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ul className="max-h-48 overflow-y-auto">
                                                        {filteredInventory.length > 0 ? filteredInventory.map(invItem => (
                                                            <li key={invItem.id} onClick={() => { handleBomItemChange(index, 'materialSku', invItem.id); setOpenDropdownIndex(null); }} className="px-3 py-2 text-sm text-slate-200 hover:bg-sky-600 cursor-pointer">
                                                                {invItem.name} <span className="text-xs text-slate-400">({invItem.id})</span>
                                                            </li>
                                                        )) : <li className="px-3 py-2 text-sm text-slate-500 text-center">No se encontraron materiales.</li>}
                                                    </ul>
                                                </div>
                                            )}
                                            {errors.bom?.[index]?.materialSku && <p className="text-xs text-rose-400 mt-1">{errors.bom[index].materialSku}</p>}
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="text-xs text-slate-400 font-medium mb-1 block">Cantidad por Par</label>
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={item.quantityPerUnit}
                                                        onChange={e => handleBomItemChange(index, 'quantityPerUnit', e.target.value)}
                                                        min="0"
                                                        step="0.01"
                                                        className={`${baseItemInputClasses} ${errors.bom?.[index]?.quantityPerUnit ? errorItemInputClasses : normalItemInputClasses} mr-2 w-20 bg-transparent text-white placeholder:text-slate-500`}
                                                    />
                                                    {item.quantityPerUnit === 0 && (
                                                        <div className="absolute inset-0 flex items-center px-1 pointer-events-none">
                                                            <span className="text-slate-500 dark:text-slate-400 text-xs">0.00</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm text-slate-400 truncate font-medium">{selectedMaterialInfo?.unit || 'unidad'}</span>
                                            </div>
                                            {errors.bom?.[index]?.quantityPerUnit && <p className="text-xs text-rose-400 mt-1">{errors.bom[index].quantityPerUnit}</p>}
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="text-xs text-slate-400 font-medium mb-1 block">Costo Unitario</label>
                                            <div className="text-sm text-slate-300 bg-slate-700/50 px-2 py-1 rounded min-w-[80px] text-center">
                                                {selectedMaterialInfo ? `$${selectedMaterialInfo.unitCost.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                                            </div>
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <label className="text-xs text-slate-400 font-medium mb-1 block">Costo Total</label>
                                            <div className="text-sm font-semibold text-green-400 bg-green-900/20 px-2 py-1 rounded min-w-[80px] text-center">
                                                {selectedMaterialInfo ? `$${(selectedMaterialInfo.unitCost * item.quantityPerUnit).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
                                            </div>
                                        </div>
                                        <div className="col-span-6 md:col-span-1 flex items-center justify-center pt-6 space-x-1">
                                            {showSuggestionButton && (
                                                <button type="button" onClick={() => handleSuggestSubstitute(index)} className="p-2 rounded-md text-violet-400 hover:bg-violet-500/20 transition-colors" title="Sugerir Sustituto con IA">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                                                </button>
                                            )}
                                            {isCurrentlySuggesting && <div className="p-2"><div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div></div>}
                                            <button type="button" onClick={() => handleRemoveBomItem(index)} className="p-2 rounded-md text-rose-400 hover:bg-rose-500/20 transition-colors" title="Eliminar Material">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    );
                                })}
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={handleAddBomItem} className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-sky-400 rounded-md hover:bg-slate-600 transition-colors text-sm font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Añadir Material
                            </button>
                        </div>
                    </form>

                    {/* Resumen de Costos */}
                    <div className="border-t border-slate-700 pt-6 mt-6 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Resumen de Costos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Costo Total Calculado</h4>
                                    <p className="text-2xl font-bold text-green-400">
                                        ${(model.bom || []).reduce((total, item) => {
                                            const material = inventoryData.find(m => m.id === item.materialSku);
                                            return total + (material ? material.unitCost * item.quantityPerUnit : 0);
                                        }, 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Costo por par basado en materiales</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Costo Objetivo</h4>
                                    <p className="text-2xl font-bold text-blue-400">
                                        ${(model.targetCost || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Meta de costo definida</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                                    <h4 className="text-sm font-medium text-slate-300 mb-2">Diferencia</h4>
                                    <p className={`text-2xl font-bold ${(model.targetCost || 0) > 0 && (model.bom || []).length > 0 ?
                                        ((model.targetCost || 0) >= (model.bom || []).reduce((total, item) => {
                                            const material = inventoryData.find(m => m.id === item.materialSku);
                                            return total + (material ? material.unitCost * item.quantityPerUnit : 0);
                                        }, 0) ? 'text-green-400' : 'text-rose-400') :
                                        'text-slate-400'}`}>
                                        {(model.targetCost || 0) > 0 && (model.bom || []).length > 0 ?
                                            ((model.targetCost || 0) >= (model.bom || []).reduce((total, item) => {
                                                const material = inventoryData.find(m => m.id === item.materialSku);
                                                return total + (material ? material.unitCost * item.quantityPerUnit : 0);
                                            }, 0) ? '✓ Dentro del objetivo' : '⚠ Sobre el objetivo') :
                                            '--'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Estado vs objetivo</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-400">
                                <p><strong>Total de Materiales:</strong> {(model.bom || []).length} materiales en el BOM</p>
                                <p><strong>Última Actualización:</strong> {new Date().toLocaleString('es-CO')}</p>
                            </div>
                        </div>
                    </div>

                    <footer className="flex justify-end p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-xl gap-4 relative">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold">Cancelar</button>
                        <button type="button" onClick={(e) => { e.preventDefault(); handleSubmit(e); }} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-md shadow-sky-900/50">{isEditing ? 'Guardar Cambios' : 'Crear Modelo'}</button>
                    </footer>

                    {/* Área de redimensionamiento */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-slate-600 hover:bg-slate-500 transition-colors">
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-slate-400"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductModelModal;
