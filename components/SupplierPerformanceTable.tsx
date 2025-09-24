import React from 'react';
// FIX: Corrected import path.
import { SupplierPerformance } from '../types';

interface SupplierPerformanceTableProps {
    suppliers: SupplierPerformance[];
}

const getRecommendationClass = (rec: 'Óptimo' | 'Recomendado' | 'Considerar') => {
    switch (rec) {
        case 'Óptimo':
            return 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
        case 'Recomendado':
            return 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400';
        case 'Considerar':
            return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';
    }
};

const SupplierPerformanceTable: React.FC<SupplierPerformanceTableProps> = ({ suppliers }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Rendimiento de Proveedores</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Proveedor</th>
                            <th scope="col" className="px-6 py-3 text-center">Entrega (OTD)</th>
                            <th scope="col" className="px-6 py-3 text-center">Calidad</th>
                            <th scope="col" className="px-6 py-3 text-center">Recomendación IA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                                    <div>{supplier.name}</div>
                                    <div className="font-normal text-xs text-slate-500 dark:text-slate-400 mt-1">{supplier.phone}</div>
                                    <div className="font-normal text-xs text-slate-500 dark:text-slate-400">{supplier.email}</div>
                                </th>
                                <td className="px-6 py-4 text-center">{supplier.otd}%</td>
                                <td className="px-6 py-4 text-center">{supplier.quality}%</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRecommendationClass(supplier.iaRecommendation)}`}>
                                        {supplier.iaRecommendation}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupplierPerformanceTable;