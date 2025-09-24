import React, { useState, useEffect } from 'react';
import { MaterialInventory, InventoryMovement } from '../types';

type MovementData = {
    materialId: string;
    type: InventoryMovement['type'];
    quantity: number;
    referenceId: string;
    user: string;
}

interface RecordMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (movement: MovementData) => void;
    inventory: MaterialInventory[];
}

interface FormErrors {
    materialId?: string;
    quantity?: string;
    referenceId?: string;
}

const RecordMovementModal: React.FC<RecordMovementModalProps> = ({ isOpen, onClose, onSave, inventory }) => {
    const getInitialState = (): MovementData => ({
        materialId: inventory.length > 0 ? inventory[0].id : '',
        type: 'Entrada',
        quantity: 0,
        referenceId: '',
        user: 'gerente_alm', // or get from auth context in a real app
    });

    const [movement, setMovement] = useState<MovementData>(getInitialState());
    const [errors, setErrors] = useState<FormErrors>({});
    const [currentStock, setCurrentStock] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && inventory.length > 0) {
            const initialState = getInitialState();
            setMovement(initialState);
            const initialMaterial = inventory.find(m => m.id === initialState.materialId);
            setCurrentStock(initialMaterial ? initialMaterial.quantity : null);
            setErrors({});
        }
    }, [isOpen, inventory]);
    
    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'materialId') {
            const selectedMaterial = inventory.find(m => m.id === value);
            setCurrentStock(selectedMaterial ? selectedMaterial.quantity : null);
        }

        setMovement(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMovement(prev => ({ ...prev, [name]: Math.max(0, parseInt(value) || 0) }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!movement.materialId) newErrors.materialId = "Debe seleccionar un material.";
        if (movement.quantity <= 0) newErrors.quantity = "La cantidad debe ser mayor a 0.";
        if (!movement.referenceId.trim()) newErrors.referenceId = "La referencia es requerida.";
        
        if ((movement.type === 'Salida' || movement.type === 'Ajuste') && currentStock !== null && movement.quantity > currentStock) {
             newErrors.quantity = `No puede exceder el stock actual (${currentStock}).`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(movement);
        }
    };

    const typeDescription = {
        'Entrada': 'Aumenta el stock (ej. recepción de OC).',
        'Salida': 'Disminuye el stock (ej. envío a producción).',
        'Ajuste': 'Disminuye el stock (ej. merma, material dañado).'
    };
    
    const baseInputClasses = "w-full bg-slate-100 dark:bg-slate-700 border rounded-lg p-2.5 text-sm text-slate-900 dark:text-white";
    const errorInputClasses = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
    const normalInputClasses = "border-slate-300 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500";
    
    const selectedMaterial = inventory.find(m => m.id === movement.materialId);

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Registrar Movimiento de Inventario</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label htmlFor="materialId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Material</label>
                        <select id="materialId" name="materialId" value={movement.materialId} onChange={handleInputChange} className={`${baseInputClasses} ${errors.materialId ? errorInputClasses : normalInputClasses}`}>
                            {inventory.map(m => <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
                        </select>
                        {selectedMaterial && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stock Actual: <span className="font-bold text-slate-800 dark:text-white">{selectedMaterial.quantity.toLocaleString()} {selectedMaterial.unit}</span></p>}
                        {errors.materialId && <p className="text-xs text-rose-400 mt-1">{errors.materialId}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Movimiento</label>
                            <select id="type" name="type" value={movement.type} onChange={handleInputChange} className={`${baseInputClasses} ${normalInputClasses}`}>
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                                <option value="Ajuste">Ajuste</option>
                            </select>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{typeDescription[movement.type]}</p>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cantidad</label>
                            <input type="number" id="quantity" name="quantity" value={movement.quantity} onChange={handleNumberChange} min="0" className={`${baseInputClasses} ${errors.quantity ? errorInputClasses : normalInputClasses}`} required />
                            {errors.quantity && <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="referenceId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Referencia</label>
                        <input type="text" id="referenceId" name="referenceId" value={movement.referenceId} onChange={handleInputChange} placeholder="Ej. OC-123, OP-456, INV-ADJ-01" className={`${baseInputClasses} ${errors.referenceId ? errorInputClasses : normalInputClasses}`} required />
                        {errors.referenceId && <p className="text-xs text-rose-400 mt-1">{errors.referenceId}</p>}
                    </div>
                </form>

                <footer className="flex justify-end p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-b-xl gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm font-semibold">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-md shadow-sky-900/50">Guardar Movimiento</button>
                </footer>
            </div>
        </div>
    );
};

export default RecordMovementModal;
