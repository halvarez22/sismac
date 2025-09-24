import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    positive: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, positive }) => {
    const changeColor = positive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500';

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-500/50 transition-all duration-300">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
            <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>
        </div>
    );
};

export default KpiCard;