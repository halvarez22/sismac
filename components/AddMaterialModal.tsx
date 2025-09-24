import React, { useState, useEffect } from 'react';
import { MaterialInventory } from '../types';

type NewMaterialData = Omit<MaterialInventory, 'totalValue' | 'status' | 'lastMovementDate'>;

interface AddMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: NewMaterialData) => void;
    categories: MaterialInventory['category'][];
    existingSkus: string[];
}

interface FormErrors {
    id?: string;
    name?: string;
    category?: string;
    quantity?: string;
    unit?: string;
    location?: string;
    unitCost?: string;
    reorderPoint?: string;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({ isOpen, onClose, onSave, categories, existingSkus }) => {
    const getInitialState = (): NewMaterialData => ({
        id: '',
        name: '',
        category: categories.length > 0 ? categories[0] : 'Pieles',
        quantity: 0,
        unit: '',
        location: '',
        unitCost: 0,
        reorderPoint: 0,
    });

    const [material, setMaterial] = useState(getInitialState());
    const [errors, setErrors] = useState<FormErrors>({});
    
    useEffect(() => {
        if (isOpen) {
            setMaterial(getInitialState());
            setErrors({});
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMaterial(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMaterial(prev => ({ ...prev, [name]: Math.max(0, parseFloat(value) || 0) }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!material.id.trim()) newErrors.id = "El SKU es requerido.";
        else if (existingSkus.includes(material.id.trim().toUpperCase())) newErrors.id = "Este SKU ya existe.";
        if (!material.name.trim()) newErrors.name = "El nombre es requerido.";
        if (!material.category) newErrors.category = "La categoría es requerida.";
        if (material.quantity <= 0) newErrors.quantity = "La cantidad inicial debe ser mayor a 0.";
        if (!material.unit.trim()) newErrors.unit = "La unidad es requerida (ej. pzas, m²).";
        if (!material.location.trim()) newErrors.location = "La ubicación es requerida.";
        if (material.unitCost < 0) newErrors.unitCost = "El costo no puede ser negativo.";
        if (material.reorderPoint < 0) newErrors.reorderPoint = "El punto de pedido no puede ser negativo.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...material,
                id: material.id.trim().toUpperCase(),
                name: material.name.trim(),
            });
        }
    };
    
    const totalValue = material.quantity * material.unitCost;
    const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

    const baseInputClasses = "w-full bg-slate-100 dark:bg-slate-700 border rounded-lg p-2.5 text-sm text-slate-900 dark:text-white";
    const errorInputClasses = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
    const normalInputClasses = "border-slate-300 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500";

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Añadir Nuevo Material al Inventario</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU / ID del Material</label>
                            <input type="text" id="id" name="id" value={material.id} onChange={handleInputChange} className={`${baseInputClasses} ${errors.id ? errorInputClasses : normalInputClasses}`} required />
                            {errors.id && <p className="text-xs text-rose-400 mt-1">{errors.id}</p>}
                        </div>
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Material</label>
                            <input type="text" id="name" name="name" value={material.name} onChange={handleInputChange} className={`${baseInputClasses} ${errors.name ? errorInputClasses : normalInputClasses}`} required />
                            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                            <select id="category" name="category" value={material.category} onChange={handleInputChange} className={`${baseInputClasses} ${errors.category ? errorInputClasses : normalInputClasses}`}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ubicación</label>
                            <input type="text" id="location" name="location" value={material.location} onChange={handleInputChange} placeholder="Ej. A-01-B" className={`${baseInputClasses} ${errors.location ? errorInputClasses : normalInputClasses}`} required />
                            {errors.location && <p className="text-xs text-rose-400 mt-1">{errors.location}</p>}
                        </div>
                        <div className="md:col-span-2 grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cantidad Inicial</label>
                                <input type="number" id="quantity" name="quantity" value={material.quantity} onChange={handleNumberChange} min="0" className={`${baseInputClasses} ${errors.quantity ? errorInputClasses : normalInputClasses}`} required />
                                {errors.quantity && <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>}
                            </div>
                            <div>
                                <label htmlFor="unit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unidad</label>
                                <input type="text" id="unit" name="unit" value={material.unit} onChange={handleInputChange} placeholder="Ej. pzas, m², pares" className={`${baseInputClasses} ${errors.unit ? errorInputClasses : normalInputClasses}`} required />
                                {errors.unit && <p className="text-xs text-rose-400 mt-1">{errors.unit}</p>}
                            </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="unitCost" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Costo Unitario (MXN)</label>
                                <input type="number" id="unitCost" name="unitCost" value={material.unitCost} onChange={handleNumberChange} min="0" step="0.01" className={`${baseInputClasses} ${errors.unitCost ? errorInputClasses : normalInputClasses}`} />
                                {errors.unitCost && <p className="text-xs text-rose-400 mt-1">{errors.unitCost}</p>}
                            </div>
                            <div>
                                <label htmlFor="reorderPoint" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Punto de Pedido (ROP)</label>
                                <input type="number" id="reorderPoint" name="reorderPoint" value={material.reorderPoint} onChange={handleNumberChange} min="0" className={`${baseInputClasses} ${errors.reorderPoint ? errorInputClasses : normalInputClasses}`} />
                                {errors.reorderPoint && <p className="text-xs text-rose-400 mt-1">{errors.reorderPoint}</p>}
                            </div>
                        </div>
                    </div>
                </form>

                <footer className="flex justify-between items-center p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-b-xl">
                    <div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Valor Total Inicial: </span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white ml-2">{formatCurrency(totalValue)}</span>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm font-semibold">Cancelar</button>
                        <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-md shadow-sky-900/50">Guardar Material</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AddMaterialModal;