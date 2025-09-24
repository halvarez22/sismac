import React, { useState, useMemo } from 'react';
import { MaterialInventory, InventoryStatus } from '../types';

type SortKey = 'name' | 'quantity' | 'reorderPoint' | 'unitCost' | 'totalValue' | 'lastMovementDate';
type SortDirection = 'ascending' | 'descending';

const getStatusClass = (status: InventoryStatus): string => {
    switch (status) {
        case 'OK': return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
        case 'Bajo': return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';
        case 'Crítico': return 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400';
        case 'Exceso': return 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400';
        default: return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
};

const getRowClass = (status: InventoryStatus): string => {
    switch (status) {
        case 'Crítico':
            return 'bg-rose-50 dark:bg-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-800/50';
        case 'Bajo':
            return 'bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-800/50';
        default:
            return 'hover:bg-slate-50 dark:hover:bg-slate-800';
    }
};

const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
    <svg className="w-4 h-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {direction === 'ascending' 
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />}
    </svg>
);

const FlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="M3.5 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0V2.75Z" />
        <path d="M8.25 5.25a.75.75 0 0 0-1.5 0v10.5a.75.75 0 0 0 1.5 0V5.25Z" />
        <path d="M12 2.75a.75.75 0 0 0-1.5 0v14.5a.75.75 0 0 0 1.5 0V2.75Z" />
        <path d="M15.75 5.25a.75.75 0 0 0-1.5 0v10.5a.75.75 0 0 0 1.5 0V5.25Z" />
    </svg>
);


const InventoryTable: React.FC<{ data: MaterialInventory[] }> = ({ data }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'ascending' });

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sorted = [...data];

        sorted.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            if (sortConfig.key === 'lastMovementDate') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }

            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [data, sortConfig]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    }
    
    const renderSortableHeader = (label: string, key: SortKey) => (
         <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors" onClick={() => handleSort(key)}>
            <div className="flex items-center justify-between">
                <span>{label}</span>
                {sortConfig.key === key && <SortIcon direction={sortConfig.direction} />}
            </div>
        </th>
    );

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Inventario de Materiales</h3>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">SKU</th>
                            {renderSortableHeader('Material', 'name')}
                            <th scope="col" className="px-4 py-3 text-center">Estado</th>
                            <th scope="col" className="px-2 py-3 text-center">Alerta</th>
                            {renderSortableHeader('Cantidad', 'quantity')}
                            {renderSortableHeader('Punto Pedido', 'reorderPoint')}
                            {renderSortableHeader('Costo Unit.', 'unitCost')}
                            {renderSortableHeader('Valor Total', 'totalValue')}
                             {renderSortableHeader('Últ. Mov.', 'lastMovementDate')}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item) => {
                            const isAlert = item.status === 'Bajo' || item.status === 'Crítico';
                            const alertClass = item.status === 'Crítico' ? 'text-rose-500' : 'text-amber-500 dark:text-amber-400';
                            
                            return (
                            <tr key={item.id} className={`border-b border-slate-200 dark:border-slate-700 transition-colors duration-200 ${getRowClass(item.status)}`}>
                                <td className="px-4 py-4 font-mono text-xs">{item.id}</td>
                                <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">
                                    <div>{item.name}</div>
                                    <div className="font-normal text-xs text-slate-500">{item.category} - {item.location}</div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-2 py-4 text-center">
                                    {isAlert && (
                                        <div className="relative group flex justify-center">
                                            <FlagIcon className={alertClass} />
                                            <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-800 dark:bg-slate-900 text-white dark:text-slate-200 text-xs font-semibold rounded-lg shadow-lg border border-slate-600 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                                Stock {item.status}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 dark:bg-slate-900 border-r border-b border-slate-600 dark:border-slate-700 rotate-45 -mt-1.5"></div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-right">{item.quantity.toLocaleString('es-MX')} <span className="text-slate-500">{item.unit}</span></td>
                                <td className="px-4 py-4 text-right">{item.reorderPoint.toLocaleString('es-MX')}</td>
                                <td className="px-4 py-4 text-right">{formatCurrency(item.unitCost)}</td>
                                <td className="px-4 py-4 text-right font-medium text-cyan-600 dark:text-cyan-400">{formatCurrency(item.totalValue)}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{new Date(item.lastMovementDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                 {sortedData.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No se encontraron materiales que coincidan con los filtros.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryTable;