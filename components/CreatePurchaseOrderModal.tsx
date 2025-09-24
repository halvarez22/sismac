import React, { useState, useEffect } from 'react';
// FIX: Corrected import path.
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from '../types';

interface CreatePurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Omit<PurchaseOrder, 'id'> & { id?: string }) => void;
    suppliers: string[];
    statuses: PurchaseOrderStatus[];
    existingOrder?: PurchaseOrder | null;
}

interface FormErrors {
    supplierName?: string;
    expectedDate?: string;
    items?: ({
        material?: string;
        quantity?: string;
        unit?: string;
        unitCost?: string;
    } | null)[];
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Inteligencia de Costos (Simulación) ---
// En un sistema real, estos datos vendrían de una base de datos o API.
const mockHistoricalCosts: { [key: string]: number } = {
    'Piel Nappa Roja Lote #842': 280,
    'Suela de Hule TR Mod. 501': 32,
    'Hebilla Dorada #HD-03': 3.5,
    'Piel Nappa Negra': 295,
    'Forro de cerdo': 28,
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const getCostWarning = (materialName: string, unitCost: number): string | null => {
    const historicalCost = mockHistoricalCosts[materialName];
    if (historicalCost && unitCost > historicalCost * 1.15) { // Si el costo es > 15% del histórico
        return `Costo un 15%+ mayor al promedio histórico de ${formatCurrency(historicalCost)}.`;
    }
    if (!historicalCost && unitCost > 500) { // Lógica genérica para materiales sin historial
        return "Costo unitario elevado. Se recomienda verificar con otros proveedores.";
    }
    return null;
};
// --- Fin de la Inteligencia de Costos ---


// This helper function centralizes all cost calculation logic.
const recalculateTotalsAndItems = (items: PurchaseOrderItem[]) => {
    const updatedItems = items.map(item => ({
        ...item,
        totalCost: (item.quantity > 0 && item.unitCost >= 0) ? item.quantity * item.unitCost : 0,
    }));

    const newTotalCost = updatedItems.reduce((acc, item) => acc + item.totalCost, 0);

    return { updatedItems, newTotalCost };
};

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({ isOpen, onClose, onSave, suppliers, statuses, existingOrder }) => {
    const initialItem: PurchaseOrderItem = { material: '', quantity: 0, unit: '', unitCost: 0, totalCost: 0 };
    const getInitialState = (): Omit<PurchaseOrder, 'id'> & { id?: string } => ({
        supplierName: suppliers.length > 0 ? suppliers[0] : '',
        createdDate: getTodayDateString(),
        expectedDate: '',
        status: 'Borrador',
        items: [initialItem],
        totalCost: 0,
    });

    const [order, setOrder] = useState(getInitialState());
    const [errors, setErrors] = useState<FormErrors>({});
    
    useEffect(() => {
        if (isOpen) {
            const baseOrder = existingOrder ? { ...existingOrder } : getInitialState();
            
            // Recalculate totals on load to ensure data is consistent
            const { updatedItems, newTotalCost } = recalculateTotalsAndItems(baseOrder.items);
            
            setOrder({ ...baseOrder, items: updatedItems, totalCost: newTotalCost });
            
            setErrors({});
        }
    }, [isOpen, existingOrder, suppliers]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setOrder(prev => {
            const itemsWithUpdate = prev.items.map((item, i) => {
                if (i !== index) return item;
                
                const updatedItem = { ...item };
                if (name === 'quantity' || name === 'unitCost') {
                    updatedItem[name] = Math.max(0, parseFloat(value) || 0);
                } else {
                    updatedItem[name as keyof Omit<PurchaseOrderItem, 'quantity' | 'unitCost' | 'totalCost'>] = value;
                }
                return updatedItem;
            });

            const { updatedItems, newTotalCost } = recalculateTotalsAndItems(itemsWithUpdate);
            return { ...prev, items: updatedItems, totalCost: newTotalCost };
        });
    };

    const handleAddItem = () => {
        setOrder(prev => {
            const newItems = [...prev.items, { ...initialItem }];
            const { updatedItems, newTotalCost } = recalculateTotalsAndItems(newItems);
            return { ...prev, items: updatedItems, totalCost: newTotalCost };
        });
    };

    const handleRemoveItem = (index: number) => {
        if (order.items.length <= 1) return;
        setOrder(prev => {
            const newItems = prev.items.filter((_, i) => i !== index);
            const { updatedItems, newTotalCost } = recalculateTotalsAndItems(newItems);
            return { ...prev, items: updatedItems, totalCost: newTotalCost };
        });
    };
    
    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        const newItemsErrors: FormErrors['items'] = [];

        if (!order.supplierName) {
            newErrors.supplierName = "Se requiere seleccionar un proveedor.";
        }
        if (!order.expectedDate) {
            newErrors.expectedDate = "La fecha de entrega es un campo requerido.";
        }

        order.items.forEach((item, index) => {
            const itemErrors: { [key: string]: string } = {};
            if (!item.material.trim()) {
                itemErrors.material = "El campo de material no puede estar vacío.";
            }
            if (item.quantity <= 0) {
                itemErrors.quantity = "La cantidad debe ser mayor a 0.";
            }
            if (!item.unit.trim()) {
                itemErrors.unit = "Se requiere especificar la unidad (ej. pzas, m²).";
            }
            if (item.unitCost < 0) {
                itemErrors.unitCost = "El costo unitario no puede ser un valor negativo.";
            }

            if (Object.keys(itemErrors).length > 0) {
                newItemsErrors[index] = itemErrors;
            } else {
                 newItemsErrors[index] = null;
            }
        });

        if (newItemsErrors.some(e => e !== null)) {
            newErrors.items = newItemsErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(order);
        }
    };
    
    const isEditing = !!order.id;

    const baseInputClasses = "w-full bg-slate-100 dark:bg-slate-700 border rounded-lg p-2.5 text-sm text-slate-900 dark:text-white";
    const errorInputClasses = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
    const normalInputClasses = "border-slate-300 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500";

    const baseItemInputClasses = "w-full bg-slate-100 dark:bg-slate-700 border rounded-md p-2 text-sm text-slate-900 dark:text-white mt-1";
    const errorItemInputClasses = "border-rose-500";
    const normalItemInputClasses = "border-slate-300 dark:border-slate-600";

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {isEditing ? `Editar Orden de Compra ${order.id}` : 'Crear Nueva Orden de Compra'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Order Header */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="supplierName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proveedor</label>
                                <select id="supplierName" name="supplierName" value={order.supplierName} onChange={handleInputChange} className={`${baseInputClasses} ${errors.supplierName ? errorInputClasses : normalInputClasses}`}>
                                    {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.supplierName && <p className="text-xs text-rose-400 mt-1">{errors.supplierName}</p>}
                            </div>
                            <div>
                                <label htmlFor="createdDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha Creación</label>
                                <input type="date" id="createdDate" name="createdDate" value={order.createdDate} onChange={handleInputChange} className={`${baseInputClasses} ${normalInputClasses}`} />
                            </div>
                            <div>
                                <label htmlFor="expectedDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha Esperada</label>
                                <input type="date" id="expectedDate" name="expectedDate" value={order.expectedDate} required className={`${baseInputClasses} ${errors.expectedDate ? errorInputClasses : normalInputClasses}`} />
                                {errors.expectedDate && <p className="text-xs text-rose-400 mt-1">{errors.expectedDate}</p>}
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                                <select id="status" name="status" value={order.status} onChange={handleInputChange} className={`${baseInputClasses} ${normalInputClasses}`}>
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Items de la Orden</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => {
                                    const costWarning = getCostWarning(item.material, item.unitCost);
                                    return (
                                        <div key={index} className="grid grid-cols-12 gap-3 items-start bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg">
                                            <div className="col-span-12 md:col-span-4">
                                                <label className="text-xs text-slate-500 dark:text-slate-400">Material</label>
                                                <input type="text" name="material" value={item.material} onChange={e => handleItemChange(index, e)} placeholder="Nombre del material" required className={`${baseItemInputClasses} ${errors.items?.[index]?.material ? errorItemInputClasses : normalItemInputClasses}`}/>
                                                {errors.items?.[index]?.material && <p className="text-xs text-rose-400 mt-1">{errors.items[index]?.material}</p>}
                                            </div>
                                            <div className="col-span-6 md:col-span-2">
                                                 <label className="text-xs text-slate-500 dark:text-slate-400">Cantidad</label>
                                                <input type="number" name="quantity" value={item.quantity} onChange={e => handleItemChange(index, e)} placeholder="0" required min="0" className={`${baseItemInputClasses} ${errors.items?.[index]?.quantity ? errorItemInputClasses : normalItemInputClasses}`}/>
                                                {errors.items?.[index]?.quantity && <p className="text-xs text-rose-400 mt-1">{errors.items[index]?.quantity}</p>}
                                            </div>
                                            <div className="col-span-6 md:col-span-1">
                                                 <label className="text-xs text-slate-500 dark:text-slate-400">Unidad</label>
                                                <input type="text" name="unit" value={item.unit} onChange={e => handleItemChange(index, e)} placeholder="pzas" className={`${baseItemInputClasses} ${errors.items?.[index]?.unit ? errorItemInputClasses : normalItemInputClasses}`}/>
                                                {errors.items?.[index]?.unit && <p className="text-xs text-rose-400 mt-1">{errors.items[index]?.unit}</p>}
                                            </div>
                                            <div className="col-span-6 md:col-span-2">
                                                 <label className="text-xs text-slate-500 dark:text-slate-400">Costo Unit.</label>
                                                <input type="number" name="unitCost" value={item.unitCost} onChange={e => handleItemChange(index, e)} placeholder="0.00" min="0" step="0.01" className={`${baseItemInputClasses} ${errors.items?.[index]?.unitCost ? errorItemInputClasses : normalItemInputClasses}`}/>
                                                {errors.items?.[index]?.unitCost && <p className="text-xs text-rose-400 mt-1">{errors.items[index]?.unitCost}</p>}
                                            </div>
                                            <div className="col-span-6 md:col-span-2 text-right">
                                                <label className="text-xs text-slate-500 dark:text-slate-400 block">Total Item</label>
                                                <div className="relative group flex justify-end items-center gap-1">
                                                    {costWarning && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-1">{formatCurrency(item.totalCost)}</p>
                                                     {costWarning && (
                                                        <div className="absolute bottom-full mb-2 w-64 left-1/2 -translate-x-1/2 p-3 bg-amber-600 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                                            <div className="flex items-start gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                                <span className="font-semibold">{costWarning}</span>
                                                            </div>
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-600 rotate-45"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-span-12 md:col-span-1 flex items-center justify-center pt-5">
                                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-rose-500 dark:text-rose-400 hover:text-rose-400 dark:hover:text-rose-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={order.items.length <= 1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                             <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-sky-600 dark:text-sky-400 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Añadir Material
                            </button>
                        </div>
                    </div>
                </form>

                <footer className="flex justify-between items-center p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-b-xl">
                    <div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">Costo Total de la Orden: </span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white ml-2">{formatCurrency(order.totalCost)}</span>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm font-semibold">Cancelar</button>
                        <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-md shadow-sky-900/50">
                            {isEditing ? 'Actualizar Orden' : 'Guardar Orden'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CreatePurchaseOrderModal;