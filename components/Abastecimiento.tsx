import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PurchaseOrder, PurchaseOrderStatus, PurchaseSuggestion, MaterialInventory } from '../types';
import CreatePurchaseOrderModal from './CreatePurchaseOrderModal';
import PurchaseOrderDetailModal from './PurchaseOrderDetailModal';

const allSuppliers = ['Pieles del Bajío S.A.', 'Suelas Modernas de León', 'Herrajes Internacionales', 'Forros y Textiles GTO'];
const allStatuses: PurchaseOrderStatus[] = ['Borrador', 'Enviada', 'Recibida Parcialmente', 'Recibida Completa', 'Cancelada'];

const getStatusClass = (status: PurchaseOrderStatus): string => {
    switch (status) {
        case 'Borrador': return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        case 'Enviada': return 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400';
        case 'Recibida Parcialmente': return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';
        case 'Recibida Completa': return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
        case 'Cancelada': return 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400';
        default: return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
};

const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

interface OutletContextType {
    purchaseOrders: PurchaseOrder[];
    setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
    purchaseSuggestions: PurchaseSuggestion[];
    removePurchaseSuggestion: (id: number) => void;
    inventoryData: MaterialInventory[];
}

const Abastecimiento: React.FC = () => {
    const { purchaseOrders, setPurchaseOrders, purchaseSuggestions, removePurchaseSuggestion, inventoryData } = useOutletContext<OutletContextType>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
    const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const inventoryMap: Map<string, MaterialInventory> = useMemo(() => new Map(inventoryData.map(item => [item.id, item])), [inventoryData]);

    const handleOpenAddModal = () => {
        setEditingOrder(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (order: PurchaseOrder) => {
        setEditingOrder(order);
        setIsCreateModalOpen(true);
    };

    const handleOpenDetailModal = (order: PurchaseOrder) => {
        setViewingOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleCreateOrderFromSuggestion = (suggestion: PurchaseSuggestion) => {
        const materialCost = inventoryMap.get(suggestion.materialId)?.unitCost ?? 0;
        const prefilledOrder: Omit<PurchaseOrder, 'id'> = {
            supplierName: suggestion.recommendedSupplier,
            createdDate: new Date().toISOString().split('T')[0],
            expectedDate: '',
            status: 'Borrador',
            items: [{
                material: suggestion.materialName,
                quantity: suggestion.quantityNeeded,
                unit: suggestion.unit,
                unitCost: materialCost,
                totalCost: materialCost * suggestion.quantityNeeded,
            }],
            totalCost: materialCost * suggestion.quantityNeeded,
        };
        setEditingOrder(prefilledOrder as PurchaseOrder); // Cast for the modal
        setIsCreateModalOpen(true);
        // Optimistically remove suggestion
        removePurchaseSuggestion(suggestion.id);
    };

    const handleCloseModals = () => {
        setIsCreateModalOpen(false);
        setIsDetailModalOpen(false);
        setEditingOrder(null);
        setViewingOrder(null);
    };

    const handleSaveOrder = (orderToSave: Omit<PurchaseOrder, 'id'> & { id?: string }) => {
        if (orderToSave.id) { // Editing
            setPurchaseOrders(prev => prev.map(o => o.id === orderToSave.id ? orderToSave as PurchaseOrder : o));
        } else { // Adding
            const newOrder: PurchaseOrder = {
                ...orderToSave,
                id: `OC-${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 900) + 100)}`
            };
            setPurchaseOrders(prev => [newOrder, ...prev]);
        }
        handleCloseModals();
    };

    const filteredOrders = useMemo(() => {
        return purchaseOrders.filter(order => {
            const matchesStatus = statusFilter ? order.status === statusFilter : true;
            const matchesSearch = searchTerm ?
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.material.toLowerCase().includes(searchTerm.toLowerCase()))
                : true;
            return matchesStatus && matchesSearch;
        });
    }, [purchaseOrders, searchTerm, statusFilter]);
    
    return (
        <div className="space-y-6">
            <CreatePurchaseOrderModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveOrder}
                suppliers={allSuppliers}
                statuses={allStatuses}
                existingOrder={editingOrder}
            />

            <PurchaseOrderDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModals}
                order={viewingOrder}
            />
            
            {/* Suggestions Section */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center text-indigo-600 dark:text-indigo-400">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                    Bandeja de Sugerencias de Compra (MRP)
                </h3>
                {purchaseSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {purchaseSuggestions.map(sug => (
                            <div key={sug.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{sug.materialName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">SKU: {sug.materialId}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white my-2">{sug.quantityNeeded.toLocaleString()} <span className="text-lg text-slate-500 dark:text-slate-400 font-normal">{sug.unit}</span></p>
                                    <div className="text-xs text-slate-500 space-y-1">
                                         <p>Para OP: <span className="font-semibold text-slate-600 dark:text-slate-400">{sug.sourceProductionOrderId}</span></p>
                                         <p>Proveedor Rec: <span className="font-semibold text-slate-600 dark:text-slate-400">{sug.recommendedSupplier}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCreateOrderFromSuggestion(sug)}
                                    className="w-full mt-4 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-semibold"
                                >
                                    Crear Orden de Compra
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No hay nuevas sugerencias de compra.</p>
                )}
            </div>


            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Órdenes de Compra</h3>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-lg shadow-sky-900/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Crear Orden de Compra
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="relative flex-grow">
                    <input type="text" placeholder="Buscar por ID, proveedor o material..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5" />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                </div>
                <div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                        <option value="">Todos los Estados</option>
                        {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Orden</th>
                                <th scope="col" className="px-6 py-3">Proveedor</th>
                                <th scope="col" className="px-6 py-3">Fecha Creación</th>
                                <th scope="col" className="px-6 py-3">Fecha Esperada</th>
                                <th scope="col" className="px-6 py-3 text-right">Monto Total</th>
                                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                                <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4 font-mono">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{order.supplierName}</td>
                                    <td className="px-6 py-4">{new Date(order.createdDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                                    <td className="px-6 py-4">{new Date(order.expectedDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                                    <td className="px-6 py-4 text-right font-medium text-cyan-600 dark:text-cyan-400">{formatCurrency(order.totalCost)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => handleOpenDetailModal(order)} className="p-1 rounded-md text-sky-500 dark:text-sky-400 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 transition-colors" aria-label={`Ver detalles de ${order.id}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.27 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleOpenEditModal(order)} className="p-1 rounded-md text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-colors" aria-label={`Editar ${order.id}`}>
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredOrders.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            No se encontraron órdenes de compra que coincidan con los filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Abastecimiento;