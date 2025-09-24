import React, { useState } from 'react';
// FIX: Corrected import path.
import { SupplierRiskAlert } from '../types';

// Main component icon
const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

// Detail icons
const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.282 2.72a3 3 0 0 1-4.682-2.72 9.094 9.094 0 0 1 3.741-.479m-.122 3.198a3 3 0 0 0-3.498 2.77 3 3 0 0 0-3.498-2.77M12 21a3 3 0 0 0 3.498-2.77 3 3 0 0 0-3.498-2.77m3.498 2.77a3 3 0 0 0 3.498-2.77M12 12.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
);
const ExclamationTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a6.01 6.01 0 0 0-3.75 0M10.5 3.75v.008m.75 0h.008m-1.5 0h.008m1.5 0h.008m-1.5 0h.008m1.5 0h.008m-1.5 0h.008m1.5 0h.008m-3.75 0h.008m3 0h.008m-1.5 0h.008m1.5 0h.008m-1.5 0h.008m1.5 0h.008m1.5 0h.008m-1.5 0h.008m.75 0h.008M12 3a9 9 0 0 1 9 9c0 2.37-1.02 4.534-2.675 6.002C17.02 19.46 14.71 21 12 21c-2.71 0-5.02-1.54-6.325-3.998C4.02 16.534 3 14.37 3 12a9 9 0 0 1 9-9z" />
    </svg>
);
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);
const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);
const ClipboardCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
);


// Helper for styling
const getSeverityClass = (severity: 'Alta' | 'Media' | 'Baja') => {
    switch (severity) {
        case 'Alta': return { bg: 'bg-rose-50 dark:bg-rose-900/50', border: 'border-rose-200 dark:border-rose-500/30', text: 'text-rose-600 dark:text-rose-400', icon: 'border-rose-500 text-rose-500 dark:text-rose-400' };
        case 'Media': return { bg: 'bg-amber-50 dark:bg-amber-900/50', border: 'border-amber-200 dark:border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', icon: 'border-amber-500 text-amber-500 dark:text-amber-400' };
        default: return { bg: 'bg-sky-50 dark:bg-sky-900/50', border: 'border-sky-200 dark:border-sky-500/30', text: 'text-sky-600 dark:text-sky-400', icon: 'border-sky-500 text-sky-500 dark:text-sky-400' };
    }
};

const SupplierRiskAlerts: React.FC<{ alerts: SupplierRiskAlert[] }> = ({ alerts }) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setExpandedId(currentId => (currentId === id ? null : id));
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <AlertIcon />
                Monitoreo de Riesgo de Suministro (IA)
            </h3>
            <div className="space-y-4">
                {alerts.map((alert) => {
                    const classes = getSeverityClass(alert.severity);
                    const isExpanded = expandedId === alert.id;

                    return (
                        <div key={alert.id} className={`p-4 rounded-lg border ${classes.bg} ${classes.border} transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50`}>
                            {/* Main Info */}
                            <div className="flex justify-between items-start mb-3">
                                <h4 className={`font-bold text-md ${classes.text}`}>{alert.riskTitle}</h4>
                                <span className={`text-xs font-mono px-2 py-1 rounded-full bg-white dark:bg-slate-700/80 border ${classes.icon} flex-shrink-0`}>
                                    {alert.severity}
                                </span>
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm mb-4">
                               <div className="flex items-start">
                                    <UserGroupIcon className="w-5 h-5 mr-2 mt-0.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">Proveedor(es)</span>
                                        <p className="text-slate-600 dark:text-slate-400">{alert.supplierImpacted}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ExclamationTriangleIcon className="w-5 h-5 mr-2 mt-0.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">Impacto Potencial</span>
                                        <p className="text-slate-600 dark:text-slate-400">{alert.potentialImpact}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50">
                                 <div className="flex items-start">
                                    <LightBulbIcon className="w-5 h-5 mr-2 mt-0.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                                    <div>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Mitigación Sugerida por IA</span>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{alert.mitigation}</p>
                                    </div>
                                 </div>
                            </div>

                            {/* Collapsible Details Section */}
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50' : 'max-h-0'}`}>
                                <div className="space-y-4 text-sm">
                                    {/* Historical Data */}
                                    <div className="flex items-start">
                                        <HistoryIcon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="font-semibold text-slate-700 dark:text-slate-300">Datos Históricos</h5>
                                            <p className="text-slate-600 dark:text-slate-400">{alert.historicalData}</p>
                                        </div>
                                    </div>

                                    {/* Affected Metrics */}
                                    <div className="flex items-start">
                                        <ChartBarIcon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="font-semibold text-slate-700 dark:text-slate-300">Métricas Afectadas</h5>
                                            <ul className="list-disc list-inside mt-1 text-slate-600 dark:text-slate-400 space-y-1">
                                                {alert.affectedMetrics.map(m => (
                                                    <li key={m.metric}>
                                                        <span className="font-medium text-slate-800 dark:text-slate-200">{m.metric}:</span> {m.currentValue} → <span className="font-semibold text-rose-500 dark:text-rose-400">{m.expectedImpact}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    {/* Granular Mitigation */}
                                     <div className="flex items-start">
                                        <ClipboardCheckIcon className="w-5 h-5 mr-3 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="font-semibold text-emerald-600 dark:text-emerald-400">Pasos Detallados de Mitigación</h5>
                                            <ol className="list-decimal list-inside mt-1 text-slate-700 dark:text-slate-300 space-y-1">
                                                {alert.granularMitigation.map((step, i) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Toggle Button */}
                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                                <button
                                    onClick={() => handleToggle(alert.id)}
                                    className="flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors focus:outline-none"
                                    aria-expanded={isExpanded}
                                >
                                    <span>{isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}</span>
                                    <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SupplierRiskAlerts;