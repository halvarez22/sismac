import React from 'react';
// FIX: Corrected import path.
import { InventoryMovement } from '../types';

const MovementIcon: React.FC<{ type: InventoryMovement['type'] }> = ({ type }) => {
    switch (type) {
        case 'Entrada':
            return (
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-500 dark:text-emerald-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
            );
        case 'Salida':
            return (
                <div className="w-8 h-8 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-rose-500 dark:text-rose-400">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                </div>
            );
        case 'Ajuste':
            return (
                <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-500 dark:text-amber-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </div>
            );
    }
};

const RecentMovements: React.FC<{ data: InventoryMovement[] }> = ({ data }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Movimientos Recientes</h3>
            <div className="space-y-4">
                {data.map(mov => (
                    <div key={mov.id} className="flex items-center gap-3">
                        <MovementIcon type={mov.type} />
                        <div className="flex-grow">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {mov.type}: <span className="font-bold">{mov.quantity}</span> para <span className="text-sky-600 dark:text-sky-400">{mov.materialId}</span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ref: {mov.referenceId} - {new Date(mov.date).toLocaleString('es-MX')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMovements;