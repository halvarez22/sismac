import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ComposedChart, PieChart, Pie, Cell, Sector, Area } from 'recharts';
import { Invoice, MonthlyFinancials, ExpenseDistribution, InvoiceStatus, InvoiceType } from '../types';
import KpiCard from './KpiCard';
import ChartCard from './ChartCard';

// Mock Data
const today = new Date();
const invoicesData: Invoice[] = [
    { id: 'FV-24-088', type: 'Por Cobrar', counterpartName: 'Zapaterías El Gran Paso', issueDate: '2024-07-15', dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], amount: 150000, status: 'Pendiente' },
    { id: 'FP-24-102', type: 'Por Pagar', counterpartName: 'Pieles del Bajío S.A.', issueDate: '2024-07-20', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], amount: 60000, status: 'Pendiente' },
    { id: 'FV-24-085', type: 'Por Cobrar', counterpartName: 'Moda y Calzado Fino', issueDate: '2024-06-25', dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0], amount: 85000, status: 'Vencida' },
    { id: 'FP-24-099', type: 'Por Pagar', counterpartName: 'Suelas Modernas de León', issueDate: '2024-07-28', dueDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0], amount: 21000, status: 'Pendiente' },
    { id: 'FV-24-087', type: 'Por Cobrar', counterpartName: 'Distribuidora de Calzado del Norte', issueDate: '2024-07-10', dueDate: '2024-07-25', amount: 220000, status: 'Pagada' },
    { id: 'FP-24-101', type: 'Por Pagar', counterpartName: 'Herrajes Internacionales', issueDate: '2024-07-05', dueDate: '2024-07-20', amount: 17500, status: 'Pagada' },
    { id: 'FP-24-103', type: 'Por Pagar', counterpartName: 'Agencia de Marketing Digital', issueDate: '2024-07-30', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], amount: 35000, status: 'Pendiente' },
];

const initialMonthlyFinancialsData: MonthlyFinancials[] = [
    { month: 'Feb', ingresos: 885000, gastos: 650000, beneficio: 235000 },
    { month: 'Mar', ingresos: 920000, gastos: 680000, beneficio: 240000 },
    { month: 'Abr', ingresos: 955000, gastos: 710000, beneficio: 245000 },
    { month: 'May', ingresos: 980000, gastos: 720000, beneficio: 260000 },
    { month: 'Jun', ingresos: 1025000, gastos: 750000, beneficio: 275000 },
    { month: 'Jul', ingresos: 1150000, gastos: 820000, beneficio: 330000 },
];

const expenseDistributionData: ExpenseDistribution[] = [
    { category: 'Materia Prima', value: 450000 },
    { category: 'Nómina', value: 250000 },
    { category: 'Marketing', value: 50000 },
    { category: 'Gastos Operativos', value: 70000 },
];

// Helper functions
const calculateDaysRemaining = (dueDateStr: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr + 'T00:00:00');
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const getStatusClass = (status: InvoiceStatus): string => {
    switch (status) {
        case 'Pagada': return 'bg-emerald-500/20 text-emerald-400';
        case 'Pendiente': return 'bg-amber-500/20 text-amber-400';
        case 'Vencida': return 'bg-rose-500/20 text-rose-400';
        default: return 'bg-slate-700 text-slate-300';
    }
};

const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

const CustomFinancialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-700/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 text-sm shadow-lg">
                <p className="font-bold text-slate-200 mb-2">{label}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.stroke || pld.fill }}>
                        {`${pld.name}: `}
                        <span className="font-semibold">
                            {pld.dataKey === 'margen'
                                ? `${pld.value}%`
                                : formatCurrency(pld.value)}
                        </span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


const Contabilidad: React.FC = () => {
    const [filters, setFilters] = useState({ status: '', type: '' });

    const monthlyFinancialsData = useMemo(() => {
        return initialMonthlyFinancialsData.map(item => ({
            ...item,
            margen: parseFloat(((item.beneficio / item.ingresos) * 100).toFixed(1))
        }));
    }, [initialMonthlyFinancialsData]);

    const kpis = useMemo(() => {
        const accountsReceivable = invoicesData.filter(i => i.type === 'Por Cobrar' && (i.status === 'Pendiente' || i.status === 'Vencida')).reduce((sum, i) => sum + i.amount, 0);
        const accountsPayable = invoicesData.filter(i => i.type === 'Por Pagar' && i.status === 'Pendiente').reduce((sum, i) => sum + i.amount, 0);
        const lastMonth = monthlyFinancialsData[monthlyFinancialsData.length - 1];
        const prevMonth = monthlyFinancialsData[monthlyFinancialsData.length - 2];
        const netCashFlow = lastMonth.beneficio;
        const grossMargin = lastMonth.margen;
        const cashFlowChange = (((netCashFlow - prevMonth.beneficio) / prevMonth.beneficio) * 100).toFixed(1);

        return { accountsReceivable, accountsPayable, netCashFlow, grossMargin, cashFlowChange };
    }, [invoicesData, monthlyFinancialsData]);

    const totalExpenses = useMemo(() => expenseDistributionData.reduce((acc, curr) => acc + curr.value, 0), []);

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = totalExpenses > 0 ? ((data.value / totalExpenses) * 100).toFixed(1) : "0.0";
            return (
                <div className="bg-slate-700/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 text-sm shadow-lg">
                    <div className="flex items-center mb-1">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: data.payload.fill }}></div>
                        <p className="font-bold text-slate-200">{data.name}</p>
                    </div>
                    <div className="pl-5">
                        <p className="text-slate-100 font-semibold">
                            {formatCurrency(data.value)}
                        </p>
                        <p className="text-slate-400 text-xs">
                            ({percentage}% del total)
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const filteredInvoices = useMemo(() => {
        return invoicesData.filter(invoice => {
            const matchesStatus = filters.status ? invoice.status === filters.status : true;
            const matchesType = filters.type ? invoice.type === filters.type : true;
            return matchesStatus && matchesType;
        });
    }, [invoicesData, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const PIE_COLORS = ['#38bdf8', '#818cf8', '#f472b6', '#fb923c'];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Cuentas por Cobrar" value={formatCurrency(kpis.accountsReceivable)} change="Pendientes y Vencidas" positive={false} />
                <KpiCard title="Cuentas por Pagar" value={formatCurrency(kpis.accountsPayable)} change="Pendientes de pago" positive={false} />
                <KpiCard title="Flujo de Caja Neto (Mes)" value={formatCurrency(kpis.netCashFlow)} change={`${kpis.cashFlowChange}% vs mes anterior`} positive={parseFloat(kpis.cashFlowChange) >= 0} />
                <KpiCard title="Margen de Beneficio Bruto" value={`${kpis.grossMargin}%`} change="Último mes" positive={true} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Rendimiento Financiero Mensual">
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={monthlyFinancialsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis yAxisId="left" stroke="#94a3b8" tickFormatter={(val) => `$${(val as number / 1000)}k`} />
                            <YAxis yAxisId="right" orientation="right" stroke="#a78bfa" tickFormatter={(val) => `${val}%`} />
                            <Tooltip content={<CustomFinancialTooltip />} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" fill="url(#colorIngresos)" />
                            <Area yAxisId="left" type="monotone" dataKey="gastos" name="Gastos" stroke="#f43f5e" fill="url(#colorGastos)" />
                            <Line yAxisId="left" type="monotone" dataKey="beneficio" name="Flujo de Caja Neto" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            <Line yAxisId="right" type="monotone" dataKey="margen" name="Margen Beneficio (%)" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Distribución de Gastos (Último Mes)">
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseDistributionData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="category">
                                {expenseDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip content={<CustomPieTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
            
            {/* Invoices Table */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Gestión de Facturas</h3>
                {/* Filters */}
                 <div className="flex items-center gap-4 mb-4">
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5">
                        <option value="">Todas los Tipos</option>
                        <option value="Por Cobrar">Por Cobrar</option>
                        <option value="Por Pagar">Por Pagar</option>
                    </select>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5">
                        <option value="">Todos los Estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagada">Pagada</option>
                        <option value="Vencida">Vencida</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                         <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">ID Factura</th>
                                <th scope="col" className="px-6 py-3">Cliente/Proveedor</th>
                                <th scope="col" className="px-6 py-3">Fecha Venc.</th>
                                <th scope="col" className="px-6 py-3 text-center">Días para Venc.</th>
                                <th scope="col" className="px-6 py-3 text-right">Monto</th>
                                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map(invoice => {
                                const daysRemaining = calculateDaysRemaining(invoice.dueDate);
                                let daysContent;
                                if (invoice.status === 'Pagada') {
                                    daysContent = <span className="text-slate-500">-</span>;
                                } else if (daysRemaining < 0) {
                                    daysContent = <span className="text-rose-400 font-semibold">Vencida por {Math.abs(daysRemaining)}d</span>;
                                } else if (daysRemaining <= 7) {
                                    daysContent = <span className="text-amber-400 font-semibold">{daysRemaining} días</span>;
                                } else {
                                    daysContent = <span>{daysRemaining} días</span>;
                                }

                                return (
                                <tr key={invoice.id} className="border-b border-slate-700 hover:bg-slate-800">
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${invoice.type === 'Por Cobrar' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {invoice.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{invoice.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-200">{invoice.counterpartName}</td>
                                    <td className="px-6 py-4">{new Date(invoice.dueDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                                    <td className="px-6 py-4 text-center">{daysContent}</td>
                                    <td className="px-6 py-4 text-right font-medium text-cyan-400">{formatCurrency(invoice.amount)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Contabilidad;