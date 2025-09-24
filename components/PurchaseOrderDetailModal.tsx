import React from 'react';
import { PurchaseOrder, PurchaseOrderStatus } from '../types';

const getStatusClass = (status: PurchaseOrderStatus): string => {
    switch (status) {
        case 'Borrador': return 'bg-slate-700 text-slate-300';
        case 'Enviada': return 'bg-sky-500/20 text-sky-400';
        case 'Recibida Parcialmente': return 'bg-amber-500/20 text-amber-400';
        case 'Recibida Completa': return 'bg-emerald-500/20 text-emerald-400';
        case 'Cancelada': return 'bg-rose-500/20 text-rose-400';
        default: return 'bg-slate-700 text-slate-300';
    }
};

const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00').toLocaleDateString('es-MX');

interface PurchaseOrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: PurchaseOrder | null;
}

const InfoField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-slate-400">{label}</label>
        <div className="mt-1 text-base text-white font-semibold">{value}</div>
    </div>
);

const PurchaseOrderDetailModal: React.FC<PurchaseOrderDetailModalProps> = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">
                        Detalles de la Orden <span className="font-mono text-sky-400">{order.id}</span>
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Order Header */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-slate-900/50 rounded-lg">
                        <InfoField label="Proveedor" value={order.supplierName} />
                        <InfoField label="Fecha Creación" value={formatDate(order.createdDate)} />
                        <InfoField label="Fecha Esperada" value={formatDate(order.expectedDate)} />
                        <InfoField 
                            label="Estado" 
                            value={<span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>} 
                        />
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Items de la Orden</h3>
                        <div className="overflow-x-auto rounded-lg border border-slate-700">
                             <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Material</th>
                                        <th scope="col" className="px-6 py-3 text-right">Cantidad</th>
                                        <th scope="col" className="px-6 py-3 text-right">Costo Unit.</th>
                                        <th scope="col" className="px-6 py-3 text-right">Total Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-700 last:border-b-0 bg-slate-800">
                                            <td className="px-6 py-4 font-medium text-slate-200">{item.material}</td>
                                            <td className="px-6 py-4 text-right">{item.quantity.toLocaleString('es-MX')} {item.unit}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(item.unitCost)}</td>
                                            <td className="px-6 py-4 text-right font-medium text-cyan-400">{formatCurrency(item.totalCost)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <footer className="flex justify-between items-center p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
                    <div>
                        <span className="text-sm text-slate-400">Costo Total de la Orden: </span>
                        <span className="text-xl font-bold text-white ml-2">{formatCurrency(order.totalCost)}</span>
                    </div>
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold">Cerrar</button>
                </footer>
            </div>
        </div>
    );
};

export default PurchaseOrderDetailModal;