import React from 'react';
// FIX: Corrected import path.
import { MaterialAlert } from '../types';

// Icons for each priority level
const HighPriorityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
const MediumPriorityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v.01M12 12v3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const LowPriorityIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


interface MaterialAlertsListProps {
    alerts: MaterialAlert[];
}

const getPriorityInfo = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
        case 'High':
            return {
                className: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30',
                Icon: HighPriorityIcon,
            };
        case 'Medium':
            return {
                className: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
                Icon: MediumPriorityIcon,
            };
        case 'Low':
            return {
                className: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 dark:text-sky-400 border-sky-500/20 dark:border-sky-500/30',
                Icon: LowPriorityIcon,
            };
    }
};

const MaterialAlertsList: React.FC<MaterialAlertsListProps> = ({ alerts }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Alertas de ROP Inteligente</h3>
            <div className="space-y-3">
                {alerts.map((alert) => {
                    const { className, Icon } = getPriorityInfo(alert.priority);
                    return (
                        <div key={alert.id} className={`p-4 rounded-lg border flex items-center justify-between ${className}`}>
                            <div className="flex items-center gap-3">
                                <Icon />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{alert.name}</p>
                                    <p className="text-sm mt-1">
                                        <span className="font-bold text-lg text-slate-900 dark:text-white">{alert.coverageDays}</span>
                                        <span className="text-slate-500 dark:text-slate-400 ml-1.5">días de cobertura</span>
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-mono px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-inherit">{alert.priority}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MaterialAlertsList;