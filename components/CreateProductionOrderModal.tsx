import React, { useState, useEffect } from 'react';
import { X, Calendar, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from './ToastContainer';
import { ProductModel, MaterialInventory, ProductionOrder } from '../types';

interface CreateProductionOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: ProductionOrder) => void;
    productModel: ProductModel;
    inventoryData: MaterialInventory[];
    existingOrderIds: string[];
}

const CreateProductionOrderModal: React.FC<CreateProductionOrderModalProps> = ({
    isOpen,
    onClose,
    onSave,
    productModel,
    inventoryData,
    existingOrderIds
}) => {
    const [quantity, setQuantity] = useState<number | string>('');
    const [requiredDate, setRequiredDate] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [calculatedMaterials, setCalculatedMaterials] = useState<any[]>([]);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { showToast } = useToast();

    // Datos del modelo VAZZA hardcoded como fallback
    const vazzAData = {
        productModel: {
            id: 'MOD-VAZZA-13501-BLANCO',
            name: 'VAZZA ESTILO 13501 BLANCO',
            description: 'Modelo de zapato blanco estilo 13501 de la marca VAZZA, fabricado con materiales de primera calidad.',
            category: 'Zapatos Casuales',
            targetCost: 372.32,
            bom: [
                { materialSku: 'PUNTERA_9', quantityPerUnit: 2.35 },
                { materialSku: 'OJILLERO_10', quantityPerUnit: 2.25 },
                { materialSku: 'REMATE_12', quantityPerUnit: 0.48 },
                { materialSku: 'LENGUA_13', quantityPerUnit: 2.14 },
                { materialSku: 'LATERALES_14', quantityPerUnit: 7.452 },
                { materialSku: 'APLICACI_N_TIRAS__2__15', quantityPerUnit: 2.35 },
                { materialSku: 'PALOMA_16', quantityPerUnit: 0.92 },
                { materialSku: 'FORRO_LENGUA_Y_TALON_17', quantityPerUnit: 20.55 },
                { materialSku: 'REFUERZO_EVA_LATERAL_18', quantityPerUnit: 10.08 },
                { materialSku: 'PLANTILLA_19', quantityPerUnit: 4.5 },
                { materialSku: 'REF_CU_A_PLANTILLA_20', quantityPerUnit: 0.083333333 },
                { materialSku: 'BULLON_21', quantityPerUnit: 2.14 },
                { materialSku: 'ESPUMA_LENGUA_22', quantityPerUnit: 1.793 },
                { materialSku: 'PASACINTA_24', quantityPerUnit: 2 },
                { materialSku: 'PLANTA_25', quantityPerUnit: 0.0303 },
                { materialSku: 'AGUJETA_26', quantityPerUnit: 1 },
                { materialSku: 'OJILLOS_27', quantityPerUnit: 20 },
                { materialSku: 'ULTIMO_OJILLO_28', quantityPerUnit: 4 },
                { materialSku: 'CONTRAFUERTE_32', quantityPerUnit: 1 },
                { materialSku: 'TRANSFER_PLANTILLA_35', quantityPerUnit: 2 }
            ]
        },
        inventoryData: [
            { id: 'PUNTERA_9', name: 'PUNTERA', category: 'Pieles', quantity: 100, unit: 'PRS', unitCost: 60.00 },
            { id: 'OJILLERO_10', name: 'OJILLERO', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 60.00 },
            { id: 'REMATE_12', name: 'REMATE', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 60.00 },
            { id: 'LENGUA_13', name: 'LENGUA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 60.00 },
            { id: 'LATERALES_14', name: 'LATERALES', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 60.00 },
            { id: 'APLICACI_N_TIRAS__2__15', name: 'APLICACIÓN TIRAS (2 POR PIE) LADO EXTERNO', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 73.08 },
            { id: 'PALOMA_16', name: 'PALOMA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 73.08 },
            { id: 'FORRO_LENGUA_Y_TALON_17', name: 'FORRO LENGUA Y TALONES', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 49.88 },
            { id: 'REFUERZO_EVA_LATERAL_18', name: 'REFUERZO EVA LATERAL', category: 'Pieles', quantity: 100, unit: 'PRS', unitCost: 26.00 },
            { id: 'PLANTILLA_19', name: 'PLANTILLA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 26.00 },
            { id: 'REF_CU_A_PLANTILLA_20', name: 'REF CU A PLANTILLA', category: 'Accesorios', quantity: 100, unit: 'PRS', unitCost: 0.30 },
            { id: 'BULLON_21', name: 'BULLON', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 1.20 },
            { id: 'ESPUMA_LENGUA_22', name: 'ESPUMA LENGUA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 26.00 },
            { id: 'PASACINTA_24', name: 'PASACINTA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 203.52 },
            { id: 'PLANTA_25', name: 'PLANTA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 26.00 },
            { id: 'AGUJETA_26', name: 'AGUJETA', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 203.52 },
            { id: 'OJILLOS_27', name: 'OJILLOS', category: 'Accesorios', quantity: 100, unit: 'PRS', unitCost: 0.30 },
            { id: 'ULTIMO_OJILLO_28', name: 'ULTIMO OJILLO', category: 'Accesorios', quantity: 100, unit: 'PRS', unitCost: 0.30 },
            { id: 'CONTRAFUERTE_32', name: 'CONTRAFUERTE', category: 'Textiles', quantity: 100, unit: 'PRS', unitCost: 26.00 },
            { id: 'TRANSFER_PLANTILLA_35', name: 'TRANSFER PLANTILLA', category: 'Accesorios', quantity: 100, unit: 'PRS', unitCost: 0.30 }
        ]
    };

    // Usar datos hardcoded si no hay datos reales o si el costo es 0
    const effectiveProductModel = productModel || (inventoryData.length === 0 ? vazzAData.productModel : null);
    const effectiveInventoryData = inventoryData.length > 0 ? inventoryData : vazzAData.inventoryData;

    useEffect(() => {
        if (isOpen && (productModel || effectiveProductModel)) {
            calculateMaterialRequirements();
        }
    }, [isOpen, productModel, quantity, inventoryData, effectiveProductModel, effectiveInventoryData]);

    // Validación en tiempo real
    useEffect(() => {
        const newErrors = { ...errors };

        // Validar cantidad en tiempo real
        if (quantity !== '' && quantity !== 0 && quantity !== null) {
            const quantityError = validateQuantity(Number(quantity));
            if (quantityError) {
                newErrors.quantity = quantityError;
            } else {
                delete newErrors.quantity;
            }
        }

        // Validar fecha en tiempo real
        if (requiredDate) {
            const dateError = validateDate(requiredDate);
            if (dateError) {
                newErrors.requiredDate = dateError;
            } else {
                delete newErrors.requiredDate;
            }
        }

        setErrors(newErrors);
    }, [quantity, requiredDate]);

    const calculateMaterialRequirements = () => {
        const modelToUse = productModel || effectiveProductModel;
        const inventoryToUse = inventoryData.length > 0 ? inventoryData : effectiveInventoryData;

        if (!modelToUse || !inventoryToUse || !quantity || quantity === 0) return;

        const materials = modelToUse.bom.map(bomItem => {
            const inventoryItem = inventoryToUse.find((inv: any) => inv.id === bomItem.materialSku);
            const quantityNeeded = bomItem.quantityPerUnit * Number(quantity);
            const quantityAvailable = inventoryItem ? inventoryItem.quantity : 0;
            const unitCost = inventoryItem ? inventoryItem.unitCost : 0;
            const totalCost = quantityNeeded * unitCost;

            return {
                sku: bomItem.materialSku,
                name: inventoryItem?.name || 'Material no encontrado',
                required: quantityNeeded,
                available: quantityAvailable,
                unit: inventoryItem?.unit || 'unidad',
                unitCost,
                totalCost,
                status: quantityAvailable >= quantityNeeded ? 'available' : 'insufficient'
            };
        });

        // Calcular costo total por par usando los datos correctos
        const totalCostPerPair = modelToUse.bom.reduce((sum, bomItem) => {
            const inventoryItem = inventoryToUse.find((inv: any) => inv.id === bomItem.materialSku);
            return sum + (inventoryItem ? inventoryItem.unitCost * bomItem.quantityPerUnit : 0);
        }, 0);

        console.log(`📋 Cálculo del costo por par: ${totalCostPerPair.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`);
        console.log(`📦 Usando modelo: ${modelToUse.name}`);
        console.log(`📦 Materiales del BOM: ${modelToUse.bom.length}`);
        console.log(`📦 Materiales en inventario: ${inventoryToUse.length}`);

        setCalculatedMaterials(materials);
    };

    const getTotalCost = () => {
        return calculatedMaterials.reduce((sum, material) => sum + material.totalCost, 0);
    };

    const generateOrderId = () => {
        const timestamp = Date.now().toString().slice(-6);
        const modelToUse = productModel || effectiveProductModel;
        const modelCode = modelToUse.id.split('-').pop() || 'XXX';
        return `ORD-${modelCode}-${timestamp}`;
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!quantity || quantity <= 0) {
            newErrors.quantity = 'La cantidad debe ser mayor a 0';
        }

        if (quantity > 10000) {
            newErrors.quantity = 'La cantidad no puede exceder 10,000 pares';
        }

        const today = new Date().toISOString().split('T')[0];
        if (requiredDate < today) {
            newErrors.requiredDate = 'La fecha requerida no puede ser en el pasado';
        }

        // Check if any material is insufficient
        const insufficientMaterials = calculatedMaterials.filter(m => m.status === 'insufficient');
        if (insufficientMaterials.length > 0) {
            newErrors.materials = `Materiales insuficientes: ${insufficientMaterials.map(m => m.name).join(', ')}`;
            if (!Object.keys(newErrors).includes('quantity') && !Object.keys(newErrors).includes('requiredDate')) {
                showToast('Algunos materiales pueden no estar disponibles en inventario', 'warning', 4000);
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validación en tiempo real
    const validateQuantity = (value: number) => {
        if (value <= 0) return 'La cantidad debe ser mayor a 0';
        if (value > 10000) return 'La cantidad no puede exceder 10,000 pares';
        return '';
    };

    const validateDate = (date: string) => {
        const today = new Date().toISOString().split('T')[0];
        if (date < today) return 'La fecha requerida no puede ser en el pasado';
        return '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            showToast('Por favor corrija los errores en el formulario', 'error');
            return;
        }

        const modelToUse = productModel || effectiveProductModel;
        const order: ProductionOrder = {
            id: generateOrderId(),
            productModel: modelToUse.name,
            productModelId: modelToUse.id,
            quantity,
            requiredDate,
            status: 'Pendiente',
            materials: calculatedMaterials.map(material => ({
                sku: material.sku,
                name: material.name,
                required: material.required,
                unit: material.unit
            })),
            suggestionStatus: 'generated'
        };

        onSave(order);
        showToast(`Orden de producción ${order.id} creada exitosamente`, 'success', 3000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (!isOpen) return null;

    const totalCost = getTotalCost();

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crear Orden de Producción</h2>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{(productModel || effectiveProductModel).name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 p-2"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Información del Modelo */}
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Información del Modelo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-slate-300">ID del Modelo:</span>
                                <p className="font-medium text-gray-900 dark:text-white">{(productModel || effectiveProductModel).id}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-slate-300">Materiales en BOM:</span>
                                <p className="font-medium text-gray-900 dark:text-white">{(productModel || effectiveProductModel).bom.length}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-slate-300">Costo por Par:</span>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {formatCurrency((productModel || effectiveProductModel).bom.reduce((sum, item) => {
                                        const inventoryToUse = inventoryData.length > 0 ? inventoryData : effectiveInventoryData;
                                        const material = inventoryToUse.find(inv => inv.id === item.materialSku);
                                        return sum + (material ? material.unitCost * item.quantityPerUnit : 0);
                                    }, 0))}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Configuración de la Orden */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Cantidad a Producir *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    onFocus={() => setFocusedField('quantity')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full border rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.quantity ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-slate-600'} focus:border-sky-500 focus:ring-1 focus:ring-sky-500`}
                                    min="1"
                                    max="10000"
                                    placeholder="Cantidad de pares a producir"
                                />
                                {focusedField !== 'quantity' && (!quantity || quantity === 0) && (
                                    <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                                        <span className="text-slate-400 dark:text-slate-500 text-sm">Cantidad de pares a producir (ej: 100, 500, 1000)</span>
                                    </div>
                                )}
                            </div>
                            {errors.quantity && (
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                                </div>
                            )}
                            {Number(quantity) > 0 && Number(quantity) <= 10000 && !errors.quantity && (
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-green-600 dark:text-green-400">Cantidad válida</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Fecha Requerida *
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={requiredDate}
                                    onChange={(e) => setRequiredDate(e.target.value)}
                                    onFocus={(e) => {
                                        setFocusedField('requiredDate');
                                        // Limpiar el valor si es el placeholder del navegador
                                        if (e.target.value === '') {
                                            e.target.value = '';
                                        }
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full border rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.requiredDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-slate-600'} focus:border-sky-500 focus:ring-1 focus:ring-sky-500`}
                                    placeholder=""
                                />
                                {focusedField !== 'requiredDate' && !requiredDate && (
                                    <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                                        <span className="text-slate-400 dark:text-slate-500 text-sm">Fecha estimada de entrega (ej: 2024-12-20)</span>
                                    </div>
                                )}
                            </div>
                            {errors.requiredDate && (
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.requiredDate}</p>
                                </div>
                            )}
                            {requiredDate && !errors.requiredDate && (
                                <div className="flex items-center gap-2 mt-1">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-green-600 dark:text-green-400">Fecha válida</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Notas Adicionales
                        </label>
                        <div className="relative">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onFocus={() => setFocusedField('notes')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none"
                                rows={3}
                            />
                            {focusedField !== 'notes' && !notes && (
                                <div className="absolute inset-0 flex items-start px-3 py-2 pointer-events-none">
                                    <span className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">
                                        Notas adicionales para la orden de producción...
                                        <br />
                                        • Prioridades especiales
                                        <br />
                                        • Requisitos del cliente
                                        <br />
                                        • Instrucciones de calidad
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Requerimientos de Materiales */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requerimientos de Materiales</h3>
                        {errors.materials && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Problemas detectados:</span>
                                </div>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errors.materials}</p>
                            </div>
                        )}

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {calculatedMaterials.map((material, index) => (
                                <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">{material.name}</h4>
                                                {material.status === 'available' ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-slate-300">SKU: {material.sku}</p>
                                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600 dark:text-slate-300">Requerido:</span>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {material.required.toLocaleString('es-CO', { maximumFractionDigits: 2 })} {material.unit}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 dark:text-slate-300">Disponible:</span>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {material.available.toLocaleString('es-CO', { maximumFractionDigits: 2 })} {material.unit}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 dark:text-slate-300">Costo Unit:</span>
                                                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(material.unitCost)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 dark:text-slate-300">Costo Total:</span>
                                                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(material.totalCost)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumen de Costos */}
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de Costos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-900 dark:text-white">Cantidad</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">
                                    {Number(quantity).toLocaleString('es-CO')} pares
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-gray-900 dark:text-white">Costo Total</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(totalCost)}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <span className="font-medium text-gray-900 dark:text-white">Costo por Par</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(totalCost / Number(quantity))}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={Object.keys(errors).length > 0}
                    >
                        Crear Orden de Producción
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProductionOrderModal;
