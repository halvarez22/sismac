import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { PurchaseHistoryItem } from '../types';
import { useTheme } from '../App';

const aggregateDataForChart = (data: PurchaseHistoryItem[]) => {
    const monthlyTotals: { [key: string]: number } = {};

    data.forEach(item => {
        // Use T00:00:00 to ensure date is parsed in local time zone consistently
        const date = new Date(item.orderDate + 'T00:00:00');
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const key = `${year}-${String(month).padStart(2, '0')}`;
        
        if (!monthlyTotals[key]) {
            monthlyTotals[key] = 0;
        }
        monthlyTotals[key] += item.totalCost;
    });

    return Object.entries(monthlyTotals)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, totalCost]) => {
             const [year, monthNum] = key.split('-');
             const monthName = new Date(parseInt(year), parseInt(monthNum)).toLocaleString('es-MX', { month: 'short' });
             return {
                 month: monthName.charAt(0).toUpperCase() + monthName.slice(1).replace('.', ''),
                 "Costo Total": totalCost,
             };
        });
};


const PurchaseHistory: React.FC<{ data: PurchaseHistoryItem[] }> = ({ data }) => {
    const { theme } = useTheme();
    const chartData = aggregateDataForChart(data);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    }
    
    const getTooltipStyles = () => ({
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
        color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
    });

    const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Historial y Gasto en Compras</h3>
            
            {/* Chart */}
            <div className="mb-8">
                <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Gasto Mensual Total</h4>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="month" stroke={axisColor} />
                        <YAxis stroke={axisColor} tickFormatter={(value: number) => `$${(value / 1000)}k`} />
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={getTooltipStyles()} 
                        />
                        <Legend />
                        <Bar dataKey="Costo Total" fill="#22d3ee" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div>
                 <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-4">Órdenes Recientes</h4>
                 <div className="overflow-y-auto max-h-72">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Proveedor</th>
                                <th scope="col" className="px-6 py-3">Material</th>
                                <th scope="col" className="px-6 py-3 text-right">Cantidad</th>
                                <th scope="col" className="px-6 py-3 text-right">Costo Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.orderId} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(item.orderDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">{item.supplierName}</th>
                                    <td className="px-6 py-4">{item.material}</td>
                                    <td className="px-6 py-4 text-right">{item.quantity.toLocaleString('es-MX')} {item.unit}</td>
                                    <td className="px-6 py-4 text-right font-medium text-cyan-500 dark:text-cyan-400">{formatCurrency(item.totalCost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistory;