import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
            <div>{children}</div>
        </div>
    );
};

export default ChartCard;