import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ProductModel, ProductionOrder, MaterialInventory, ProductionOrderStatus } from '../types';
import CreateProductionOrderModal from './CreateProductionOrderModal';

const Planificacion: React.FC = () => {
    const [productModels, setProductModels] = useState<ProductModel[]>([]);
    const [inventoryData, setInventoryData] = useState<MaterialInventory[]>([]);
    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        try {
            // Cargar modelos de producto
            const modelsData = localStorage.getItem('sismac_productModels');
            if (modelsData) {
                const models = JSON.parse(modelsData);
                setProductModels(models);
            }

            // Cargar datos de inventario
            const inventoryData = localStorage.getItem('sismac_inventoryData');
            if (inventoryData) {
                const inventory = JSON.parse(inventoryData);
                setInventoryData(inventory);
            }

            // Cargar órdenes de producción existentes
            const ordersData = localStorage.getItem('sismac_productionOrders');
            if (ordersData) {
                const orders = JSON.parse(ordersData);
                setProductionOrders(orders);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: ProductionOrderStatus) => {
        switch (status) {
            case 'Pendiente':
                return <Pause className="w-4 h-4 text-yellow-500" />;
            case 'En Progreso':
                return <Play className="w-4 h-4 text-blue-500" />;
            case 'Completada':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Retrasada':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: ProductionOrderStatus) => {
        switch (status) {
            case 'Pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'En Progreso':
                return 'bg-blue-100 text-blue-800';
            case 'Completada':
                return 'bg-green-100 text-green-800';
            case 'Retrasada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreateOrder = (model: ProductModel) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleSaveOrder = (order: ProductionOrder) => {
        const updatedOrders = [...productionOrders, order];
        setProductionOrders(updatedOrders);
        localStorage.setItem('sismac_productionOrders', JSON.stringify(updatedOrders));
        setIsModalOpen(false);
        setSelectedModel(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-600">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planificación de Producción</h1>
                        <p className="text-gray-600 dark:text-slate-300 mt-1">
                            Gestiona órdenes de producción basadas en modelos de producto cargados
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-slate-300">Modelos Disponibles</p>
                            <p className="text-2xl font-bold text-sky-600">{productModels.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-slate-300">Órdenes Activas</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {productionOrders.filter(order =>
                                    order.status === 'Pendiente' || order.status === 'En Progreso'
                                ).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Modelos Disponibles */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Modelos de Producto</h2>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                            Selecciona un modelo para crear una orden de producción
                        </p>
                    </div>
                    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                        {productModels.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                                <p>No hay modelos de producto cargados</p>
                                <p className="text-sm mt-2 text-gray-600 dark:text-slate-300">Ve a Ingeniería para cargar modelos</p>
                            </div>
                        ) : (
                            productModels.map((model) => {
                                const totalCost = model.bom.reduce((sum, item) => {
                                    const material = inventoryData.find(inv => inv.id === item.materialSku);
                                    return sum + (material ? material.unitCost * item.quantityPerUnit : 0);
                                }, 0);

                                return (
                                    <div
                                        key={model.id}
                                        className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:border-sky-300 dark:hover:border-sky-600 transition-colors cursor-pointer"
                                        onClick={() => handleCreateOrder(model)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{model.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-slate-300">ID: {model.id}</p>
                                                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                                                    <span>{model.bom.length} materiales</span>
                                                    <span>{formatCurrency(totalCost)} por par</span>
                                                    {model.category && <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs text-gray-700 dark:text-slate-300">{model.category}</span>}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCreateOrder(model);
                                                    }}
                                                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors flex items-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Crear Orden
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Órdenes de Producción */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Órdenes de Producción</h2>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                            Órdenes activas y su estado actual
                        </p>
                    </div>
                    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                        {productionOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                                <p>No hay órdenes de producción</p>
                                <p className="text-sm mt-2 text-gray-600 dark:text-slate-300">Crea tu primera orden desde los modelos disponibles</p>
                            </div>
                        ) : (
                            productionOrders.map((order) => (
                                <div key={order.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(order.status as ProductionOrderStatus)}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{order.productModel}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-slate-300">ID: {order.id}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                                                <span>{order.quantity} pares</span>
                                                <span>{formatCurrency(order.suggestionStatus === 'generated' ? 0 : 0)}</span>
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status as ProductionOrderStatus)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para crear orden de producción */}
            {selectedModel && (
                <CreateProductionOrderModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedModel(null);
                    }}
                    onSave={handleSaveOrder}
                    productModel={selectedModel}
                    inventoryData={inventoryData}
                    existingOrderIds={productionOrders.map(order => order.id)}
                />
            )}
        </div>
    );
};

export default Planificacion;