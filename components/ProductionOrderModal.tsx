import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductionOrder, ProductionOrderStatus, MaterialInventory, ProductModel, PurchaseSuggestion } from '../types';

interface ProductionOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Omit<ProductionOrder, 'id'> & { id?: string }) => void;
    existingOrder?: ProductionOrder | null;
    productModels: ProductModel[];
    inventoryData: MaterialInventory[];
    addPurchaseSuggestions: (suggestions: Omit<PurchaseSuggestion, 'id'>[]) => void;
}

type OrderFormData = Omit<ProductionOrder, 'id'> & { id?: string };
type DeficitInfo = { sku: string; name: string; required: number; available: number; deficit: number; unit: string; };

const allStatuses: ProductionOrderStatus[] = ['Pendiente', 'En Progreso', 'Completada', 'Retrasada'];

const getTodayDateString = () => new Date().toISOString().split('T')[0];
const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

const ProductionOrderModal: React.FC<ProductionOrderModalProps> = ({ isOpen, onClose, onSave, existingOrder, productModels, inventoryData, addPurchaseSuggestions }) => {
    
    const inventoryMap = useMemo(() => new Map(inventoryData.map(item => [item.id, item])), [inventoryData]);

    const getInitialState = useCallback((): OrderFormData => ({
        productModel: productModels.length > 0 ? productModels[0].name : '',
        productModelId: productModels.length > 0 ? productModels[0].id : '',
        quantity: 1,
        requiredDate: getTodayDateString(),
        status: 'Pendiente',
        assignedTo: '',
        materials: []
    }), [productModels]);

    const [order, setOrder] = useState<OrderFormData>(getInitialState());
    const [errors, setErrors] = useState<{ [key: string]: any }>({});
    const [materialDeficit, setMaterialDeficit] = useState<DeficitInfo[] | null>(null);

    useEffect(() => {
        if (isOpen) {
            let initialOrder: OrderFormData;
            if (existingOrder) {
                initialOrder = { ...existingOrder };
            } else {
                initialOrder = getInitialState();
                // Pre-generate a unique ID for new orders to associate suggestions correctly
                initialOrder.id = `OP-${Date.now().toString().slice(-6)}`;
            }
            setOrder(initialOrder);
            setErrors({});
            setMaterialDeficit(null);
        }
    }, [isOpen, existingOrder, getInitialState]);

    useEffect(() => {
        if (!isOpen) return;

        const selectedModel = productModels.find(m => m.id === order.productModelId);
        if (selectedModel && order.quantity > 0) {
            const newMaterials = selectedModel.bom.map(bomItem => {
                const materialInfo = inventoryMap.get(bomItem.materialSku);
                return {
                    sku: bomItem.materialSku,
                    name: materialInfo?.name || 'Material Desconocido',
                    required: bomItem.quantityPerUnit * order.quantity,
                    unit: materialInfo?.unit || 'N/A',
                };
            });
            setOrder(prev => ({ ...prev, materials: newMaterials, productModel: selectedModel.name }));
        } else {
             setOrder(prev => ({...prev, materials: [] }));
        }
    }, [order.productModelId, order.quantity, isOpen, productModels, inventoryMap]);

    const totalMaterialCost = useMemo(() => {
        return order.materials.reduce((total, item) => {
            const inventoryItem = inventoryMap.get(item.sku);
            const itemCost = inventoryItem ? inventoryItem.unitCost * item.required : 0;
            return total + itemCost;
        }, 0);
    }, [order.materials, inventoryMap]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'quantity' ? Math.max(0, parseInt(value, 10) || 0) : value;
        
        if (name === "productModelId") {
            const selectedModel = productModels.find(m => m.id === value);
            setOrder(prev => ({ ...prev, productModelId: value, productModel: selectedModel?.name || '' }));
        } else {
            setOrder(prev => ({ ...prev, [name]: parsedValue }));
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: any } = {};
        if (!order.productModelId) newErrors.productModelId = "Debe seleccionar un modelo.";
        if (order.quantity <= 0) newErrors.quantity = "La cantidad debe ser mayor a 0.";
        if (!order.requiredDate) newErrors.requiredDate = "La fecha es obligatoria.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        const missingMaterials: DeficitInfo[] = [];
        for (const material of order.materials) {
            const stock = inventoryMap.get(material.sku)?.quantity ?? 0;
            if (stock < material.required) {
                missingMaterials.push({
                    sku: material.sku,
                    name: material.name,
                    required: material.required,
                    available: stock,
                    deficit: material.required - stock,
                    unit: material.unit
                });
            }
        }

        if (missingMaterials.length > 0) {
            setMaterialDeficit(missingMaterials);
        } else {
            onSave(order);
        }
    };
    
    const handleGenerateSuggestionsAndSave = () => {
        if (!materialDeficit || !order.id) return;
        
        // Simplified recommendation logic, a real system could be more complex.
        const recommendedSupplier = 'Pieles del Bajío S.A.';

        const newSuggestions = materialDeficit.map(item => ({
            materialId: item.sku,
            materialName: item.name,
            quantityNeeded: item.deficit,
            unit: item.unit,
            recommendedSupplier: recommendedSupplier,
            sourceProductionOrderId: order.id!
        }));

        addPurchaseSuggestions(newSuggestions);
        onSave({ ...order, suggestionStatus: 'generated' });
    };

    const handleSaveAnyway = () => onSave(order);

    const isEditing = !!existingOrder;
    const baseInputClasses = "w-full bg-slate-700 border rounded-lg p-2.5 text-sm text-white";
    const errorInputClasses = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
    const normalInputClasses = "border-slate-600 focus:ring-sky-500 focus:border-sky-500";

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">{isEditing ? `Editar Orden de Producción ${order.id}` : 'Crear Orden de Producción'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                <div className={`flex-1 overflow-y-auto transition-opacity duration-300 ${materialDeficit ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                                <label htmlFor="productModelId" className="block text-sm font-medium text-slate-300 mb-1">Modelo del Producto</label>
                                 <select id="productModelId" name="productModelId" value={order.productModelId} onChange={handleInputChange} className={`${baseInputClasses} ${errors.productModelId ? errorInputClasses : normalInputClasses}`}>
                                    <option value="" disabled>-- Seleccione un modelo --</option>
                                    {productModels.map(model => (
                                        <option key={model.id} value={model.id}>{model.name}</option>
                                    ))}
                                </select>
                                {errors.productModelId && <p className="text-xs text-rose-400 mt-1">{errors.productModelId}</p>}
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1">Cantidad a Producir (pares)</label>
                                <input type="number" id="quantity" name="quantity" value={order.quantity} onChange={handleInputChange} min="1" className={`${baseInputClasses} ${errors.quantity ? errorInputClasses : normalInputClasses}`} />
                                {errors.quantity && <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>}
                            </div>
                            <div>
                                <label htmlFor="requiredDate" className="block text-sm font-medium text-slate-300 mb-1">Fecha Requerida</label>
                                <input type="date" id="requiredDate" name="requiredDate" value={order.requiredDate} onChange={handleInputChange} className={`${baseInputClasses} ${errors.requiredDate ? errorInputClasses : normalInputClasses}`} />
                                {errors.requiredDate && <p className="text-xs text-rose-400 mt-1">{errors.requiredDate}</p>}
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Estado</label>
                                <select id="status" name="status" value={order.status} onChange={handleInputChange} className={`${baseInputClasses} ${normalInputClasses}`}>{allStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select>
                            </div>
                            <div>
                                <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-300 mb-1">Asignado a (Línea)</label>
                                <input type="text" id="assignedTo" name="assignedTo" value={order.assignedTo || ''} onChange={handleInputChange} placeholder="Ej. Línea 1" className={`${baseInputClasses} ${normalInputClasses}`} />
                            </div>
                        </div>
                        <div className="border-t border-slate-700 pt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Materiales Requeridos (BOM Automático)</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {order.materials.length > 0 ? (
                                    order.materials.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-x-4 items-center bg-slate-900/50 p-3 rounded-lg">
                                            <div className="col-span-3 font-mono text-xs">{item.sku}</div>
                                            <div className="col-span-5 font-medium text-slate-200">{item.name}</div>
                                            <div className="col-span-4 text-right">
                                                <span className="font-semibold text-white">{item.required.toLocaleString('es-MX', {maximumFractionDigits: 2})}</span>
                                                <span className="text-slate-400 ml-1.5">{item.unit}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-500 py-4">Seleccione un modelo y una cantidad para ver los materiales.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                 {materialDeficit && (
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="p-4 bg-amber-900/70 backdrop-blur-sm border border-amber-500/30 rounded-lg shadow-2xl">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">¡Alerta de Stock Insuficiente!</h3>
                                    <p className="text-sm text-amber-200 mt-1 mb-3">No hay suficiente material en almacén para completar esta orden. Puede generar sugerencias de compra o guardar la orden para planificarla más tarde.</p>
                                    <ul className="text-xs space-y-1">
                                        {materialDeficit.map(item => (
                                            <li key={item.sku} className="text-slate-200">
                                                - <span className="font-bold">{item.name} ({item.sku})</span>: Faltan <span className="font-semibold text-amber-300">{item.deficit.toLocaleString(undefined, { maximumFractionDigits: 2 })} {item.unit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <footer className="flex justify-between items-center p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
                     <div><span className="text-sm text-slate-400">Costo Total de Materiales: </span><span className="text-xl font-bold text-white ml-2">{formatCurrency(totalMaterialCost)}</span></div>
                    
                    {materialDeficit ? (
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setMaterialDeficit(null)} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold">Volver</button>
                            <button type="button" onClick={handleSaveAnyway} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors text-sm font-semibold">Guardar de Todos Modos</button>
                            <button type="button" onClick={handleGenerateSuggestionsAndSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-semibold shadow-md shadow-indigo-900/50">Generar Sugerencias y Guardar</button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold">Cancelar</button>
                            <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-md shadow-sky-900/50">{isEditing ? 'Actualizar Orden' : 'Guardar Orden'}</button>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default ProductionOrderModal;