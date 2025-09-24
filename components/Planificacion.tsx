import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ProductionOrder, ProductionOrderStatus, MaterialInventory, PurchaseSuggestion, SupplierPerformance, ProductModel } from '../types';
import ProductionOrderModal from './ProductionOrderModal';

const allStatuses: ProductionOrderStatus[] = ['Pendiente', 'En Progreso', 'Completada', 'Retrasada'];

// Simulación de datos de proveedores para la IA, en un caso real vendría de props o API
const supplierData: SupplierPerformance[] = [
    { id: 1, name: 'Pieles del Bajío S.A.', phone: '477-123-4567', email: 'ventas@pielesbajio.com', otd: 98, quality: 99.5, iaRecommendation: 'Óptimo' },
    { id: 2, name: 'Suelas Modernas de León', phone: '477-987-6543', email: 'contacto@suelasmodernas.com', otd: 95, quality: 98.0, iaRecommendation: 'Recomendado' },
    { id: 3, name: 'Herrajes Internacionales', phone: '55-5555-1234', email: 'info@herrajesint.com', otd: 89, quality: 99.2, iaRecommendation: 'Considerar' },
    { id: 4, name: 'Forros y Textiles GTO', phone: '462-111-2233', email: 'pedidos@forrosgto.com', otd: 99, quality: 96.5, iaRecommendation: 'Recomendado' },
];

const getStatusClass = (status: ProductionOrderStatus): string => {
    switch (status) {
        case 'Pendiente': return 'bg-slate-700 text-slate-300';
        case 'En Progreso': return 'bg-sky-500/20 text-sky-400';
        case 'Completada': return 'bg-emerald-500/20 text-emerald-400';
        case 'Retrasada': return 'bg-rose-500/20 text-rose-400';
        default: return 'bg-slate-700 text-slate-300';
    }
};

interface OutletContextType {
    productionOrders: ProductionOrder[];
    setProductionOrders: React.Dispatch<React.SetStateAction<ProductionOrder[]>>;
    inventoryData: MaterialInventory[];
    addPurchaseSuggestions: (suggestions: Omit<PurchaseSuggestion, 'id'>[]) => void;
    productModels: ProductModel[];
}

interface MaterialDeficit {
    name: string;
    missingAmount: number;
    unit: string;
}

const Planificacion: React.FC = () => {
    const { productionOrders, setProductionOrders, inventoryData, addPurchaseSuggestions, productModels } = useOutletContext<OutletContextType>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const inventoryMap: Map<string, MaterialInventory> = useMemo(() => new Map(inventoryData.map(item => [item.id, item])), [inventoryData]);

    const checkMaterialAvailability = (order: ProductionOrder): { available: boolean; deficit: MaterialDeficit[] } => {
        const missingMaterials: MaterialDeficit[] = [];
        for (const material of order.materials) {
            const stock = inventoryMap.get(material.sku)?.quantity ?? 0;
            if (stock < material.required) {
                missingMaterials.push({
                    name: material.name,
                    missingAmount: material.required - stock,
                    unit: material.unit,
                });
            }
        }
        return { available: missingMaterials.length === 0, deficit: missingMaterials };
    };

    const handleGenerateSuggestions = (order: ProductionOrder) => {
        const newSuggestions: Omit<PurchaseSuggestion, 'id'>[] = [];
        for (const material of order.materials) {
            const stock = inventoryMap.get(material.sku)?.quantity ?? 0;
            if (stock < material.required) {
                // Simulación de IA para elegir proveedor
                const recommendedSupplier = supplierData.sort((a,b) => b.otd - a.otd)[0]?.name || 'Proveedor Genérico';
                
                newSuggestions.push({
                    materialId: material.sku,
                    materialName: material.name,
                    quantityNeeded: material.required - stock,
                    unit: material.unit,
                    recommendedSupplier: recommendedSupplier,
                    sourceProductionOrderId: order.id,
                });
            }
        }
        if (newSuggestions.length > 0) {
            addPurchaseSuggestions(newSuggestions);
            // Marcar la orden para que no se puedan generar más sugerencias
            setProductionOrders(prev => prev.map(o => o.id === order.id ? { ...o, suggestionStatus: 'generated' } : o));
        }
    };

    const handleOpenAddModal = () => {
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (order: ProductionOrder) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    const handleSaveOrder = (orderToSave: Omit<ProductionOrder, 'id'> & { id?: string }) => {
        // Check if an order with this ID already exists to determine if it's an edit or a new add.
        if (orderToSave.id && productionOrders.some(o => o.id === orderToSave.id)) { // Editing
            setProductionOrders(prev => prev.map(o => o.id === orderToSave.id ? orderToSave as ProductionOrder : o));
        } else { // Adding a new order (which now has a pre-generated ID from the modal)
            const newOrder: ProductionOrder = orderToSave as ProductionOrder;
            setProductionOrders(prev => [newOrder, ...prev]);
        }
        handleCloseModal();
    };

     const filteredOrders = useMemo(() => {
        return productionOrders.filter(order => {
            const matchesStatus = statusFilter ? order.status === statusFilter : true;
            const matchesSearch = searchTerm ?
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.productModel.toLowerCase().includes(searchTerm.toLowerCase())
                : true;
            return matchesStatus && matchesSearch;
        });
    }, [productionOrders, searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            <ProductionOrderModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveOrder}
                existingOrder={editingOrder}
                productModels={productModels}
                inventoryData={inventoryData}
                addPurchaseSuggestions={addPurchaseSuggestions}
            />

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Plan de Producción</h3>
                 <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-lg shadow-sky-900/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Crear Orden de Producción
                </button>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                 <div className="relative flex-grow">
                    <input type="text" placeholder="Buscar por ID o modelo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5" />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                </div>
                 <div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                        <option value="">Todos los Estados</option>
                        {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Orden</th>
                                <th scope="col" className="px-6 py-3">Modelo Producto</th>
                                <th scope="col" className="px-6 py-3">Fecha Requerida</th>
                                <th scope="col" className="px-6 py-3 text-center">Disponibilidad Material</th>
                                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                                <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const availability = checkMaterialAvailability(order);
                                return (
                                <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-800">
                                    <td className="px-6 py-4 font-mono">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-200">
                                        <div>{order.productModel}</div>
                                        <div className="text-xs text-slate-500 mt-1">{order.quantity.toLocaleString('es-MX')} pares</div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(order.requiredDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                                    <td className="px-6 py-4 text-center">
                                        {availability.available ? (
                                            <span className="flex items-center justify-center gap-2 text-emerald-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                Disponible
                                            </span>
                                        ) : (
                                            <div className="relative group flex items-center justify-center gap-2 text-amber-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                <span>Déficit</span>
                                                <div className="absolute bottom-full mb-2 w-max max-w-sm p-3 bg-slate-900 text-slate-200 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
                                                    <p className="font-bold mb-2 text-left text-white">Materiales Faltantes:</p>
                                                    <ul className="list-disc list-inside text-left space-y-1">
                                                        {availability.deficit.map(item => (
                                                            <li key={item.name}>
                                                                <span className="font-semibold text-slate-100">{item.name}:</span> Faltan <span className="font-bold text-amber-300">{item.missingAmount.toLocaleString()} {item.unit}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        {!availability.available && order.suggestionStatus !== 'generated' ? (
                                            <button 
                                                onClick={() => handleGenerateSuggestions(order)}
                                                className="px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-xs font-semibold inline-flex items-center justify-center min-w-36"
                                            >
                                                Generar Sugerencias
                                            </button>
                                        ) : order.suggestionStatus === 'generated' ? (
                                            <span className="px-2 py-1 text-xs text-slate-500 inline-flex items-center justify-center min-w-36">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Sugerencias Creadas
                                            </span>
                                        ) : (
                                            <div className="min-w-36"></div> // Placeholder for alignment
                                        )}
                                        <button onClick={() => handleOpenEditModal(order)} className="p-1 rounded-md text-amber-400 hover:bg-amber-500/20 transition-colors inline-flex align-middle">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                     {filteredOrders.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            No se encontraron órdenes de producción que coincidan con los filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Planificacion;