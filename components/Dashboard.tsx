import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, Area } from 'recharts';
import { SupplierPerformance, MaterialAlert, MonthlyData, WasteData, SalesForecastData, SupplierRiskAlert, PurchaseHistoryItem } from '../types';
import { useTheme } from '../App';
import KpiCard from './KpiCard';
import ChartCard from './ChartCard';
import MaterialAlertsList from './MaterialAlertsList';
import SupplierPerformanceTable from './SupplierPerformanceTable';
import SupplierRiskAlerts from './SupplierRiskAlerts';
import PurchaseHistory from './PurchaseHistory';
import AiAnalytics from './AiAnalytics';

// Mock Data
const supplierData: SupplierPerformance[] = [
    { id: 1, name: 'Pieles del Bajío S.A.', phone: '477-123-4567', email: 'ventas@pielesbajio.com', otd: 98, quality: 99.5, iaRecommendation: 'Óptimo' },
    { id: 2, name: 'Suelas Modernas de León', phone: '477-987-6543', email: 'contacto@suelasmodernas.com', otd: 95, quality: 98.0, iaRecommendation: 'Recomendado' },
    { id: 3, name: 'Herrajes Internacionales', phone: '55-5555-1234', email: 'info@herrajesint.com', otd: 89, quality: 99.2, iaRecommendation: 'Considerar' },
    { id: 4, name: 'Forros y Textiles GTO', phone: '462-111-2233', email: 'pedidos@forrosgto.com', otd: 99, quality: 96.5, iaRecommendation: 'Recomendado' },
];

const materialAlertsData: MaterialAlert[] = [
    { id: 1, name: 'Piel Nappa Roja Lote #842', coverageDays: 5, priority: 'High' },
    { id: 2, name: 'Suela de Hule TR Mod. 501', coverageDays: 7, priority: 'High' },
    { id: 3, name: 'Forro de cerdo', coverageDays: 12, priority: 'Medium' },
    { id: 4, name: 'Hebilla Dorada #HD-03', coverageDays: 15, priority: 'Low' },
];

const supplierRiskData: SupplierRiskAlert[] = [
    {
        id: 3,
        riskTitle: "Congestión en Puerto de Manzanillo",
        supplierImpacted: "Suelas Modernas de León",
        potentialImpact: "Retraso de entrega de 7-10 días en suelas importadas.",
        mitigation: "Confirmar ETA con el proveedor y aumentar el stock de seguridad temporalmente.",
        severity: 'Alta',
        historicalData: "Evento similar ocurrió en Q4 2023, causando retrasos de hasta 15 días.",
        affectedMetrics: [
            { metric: "On-Time Delivery (OTD)", currentValue: "95%", expectedImpact: "Caída a ~80-85%" },
            { metric: "Días de Cobertura de Stock", currentValue: "7 días", expectedImpact: "Reducción a 0 días si no se actúa" }
        ],
        granularMitigation: [
            "Contactar al proveedor para obtener número de contenedor y rastrear en tiempo real.",
            "Evaluar flete aéreo para el 20% más crítico del pedido.",
            "Notificar a planificación de la producción sobre posible ajuste de calendario."
        ]
    },
    {
        id: 1,
        riskTitle: "Volatilidad del Dólar (USD/MXN)",
        supplierImpacted: "Herrajes Internacionales",
        potentialImpact: "Aumento de costo del 5-8% en herrajes importados.",
        mitigation: "Adelantar orden de compra para el próximo lote para fijar el costo actual.",
        severity: 'Media',
        historicalData: "El tipo de cambio ha fluctuado un 12% en los últimos 6 meses.",
        affectedMetrics: [
            { metric: "Costo de Material por Par", currentValue: "$15.20", expectedImpact: "Aumento a ~$16.00" },
        ],
        granularMitigation: [
            "Negociar con proveedor un precio fijo para los próximos 3 meses.",
            "Realizar un análisis de sensibilidad de costos con el nuevo tipo de cambio.",
            "Explorar opciones de cobertura cambiaria con el área de finanzas."
        ]
    },
    {
        id: 2,
        riskTitle: "Posible Aumento de Aranceles a Textiles",
        supplierImpacted: "Forros y Textiles GTO",
        potentialImpact: "Incremento del 10% en costos de forros sintéticos.",
        mitigation: "Evaluar proveedor nacional alternativo (Proveedor B) para diversificar.",
        severity: 'Baja',
        historicalData: "Discusiones sobre aranceles llevan 3 meses en el congreso sin resolución.",
        affectedMetrics: [
             { metric: "Margen Bruto del Producto", currentValue: "45%", expectedImpact: "Reducción a 42%" },
        ],
        granularMitigation: [
            "Solicitar cotizaciones a 2-3 proveedores nacionales para comparar costos.",
            "Analizar viabilidad de sustituir el material por uno de origen nacional.",
        ]
    },
];


const costPerPairData: MonthlyData[] = [
    { month: 'Ene', value: 150.5 },
    { month: 'Feb', value: 152.0 },
    { month: 'Mar', value: 149.8 },
    { month: 'Abr', value: 153.2 },
    { month: 'May', value: 151.7 },
    { month: 'Jun', value: 148.9 },
];

const wasteIndexData: WasteData[] = [
    { month: 'Ene', proyectado: 5, real: 5.8 },
    { month: 'Feb', proyectado: 5, real: 5.5 },
    { month: 'Mar', proyectado: 4.8, real: 5.1 },
    { month: 'Abr', proyectado: 4.8, real: 4.9 },
    { month: 'May', proyectado: 4.5, real: 4.6 },
    { month: 'Jun', proyectado: 4.5, real: 4.5 },
];

const aiSavingsData: MonthlyData[] = [
    { month: 'Ene', value: 12000 },
    { month: 'Feb', value: 15500 },
    { month: 'Mar', value: 18000 },
    { month: 'Abr', value: 21300 },
    { month: 'May', value: 25000 },
    { month: 'Jun', value: 28900 },
];

const salesForecastData: SalesForecastData[] = [
    { month: 'Jul', forecast: 2200, confidenceInterval: [2000, 2400] },
    { month: 'Ago', forecast: 2450, confidenceInterval: [2200, 2700] },
    { month: 'Sep', forecast: 2800, confidenceInterval: [2500, 3100] },
    { month: 'Oct', forecast: 3100, confidenceInterval: [2800, 3400] },
    { month: 'Nov', forecast: 3500, confidenceInterval: [3100, 3900] },
    { month: 'Dic', forecast: 4200, confidenceInterval: [3800, 4600] },
];

const purchaseHistoryData: PurchaseHistoryItem[] = [
    { orderId: 'OC-2406-001', supplierName: 'Pieles del Bajío S.A.', orderDate: '2024-06-20', material: 'Piel Nappa Roja', quantity: 150, unit: 'm²', totalCost: 45000 },
    { orderId: 'OC-2406-002', supplierName: 'Suelas Modernas de León', orderDate: '2024-06-18', material: 'Suela Hule TR Mod. 501', quantity: 500, unit: 'pares', totalCost: 17500 },
    { orderId: 'OC-2406-003', supplierName: 'Herrajes Internacionales', orderDate: '2024-06-15', material: 'Hebilla Dorada #HD-03', quantity: 2000, unit: 'pzas', totalCost: 8000 },
    { orderId: 'OC-2405-015', supplierName: 'Pieles del Bajío S.A.', orderDate: '2024-05-22', material: 'Piel Nappa Negra', quantity: 200, unit: 'm²', totalCost: 62000 },
    { orderId: 'OC-2405-016', supplierName: 'Forros y Textiles GTO', orderDate: '2024-05-19', material: 'Forro de cerdo', quantity: 300, unit: 'm²', totalCost: 9000 },
    { orderId: 'OC-2404-011', supplierName: 'Suelas Modernas de León', orderDate: '2024-04-25', material: 'Suela Hule TR Mod. 501', quantity: 450, unit: 'pares', totalCost: 15750 },
    { orderId: 'OC-2404-012', supplierName: 'Pieles del Bajío S.A.', orderDate: '2024-04-18', material: 'Piel Nappa Roja', quantity: 120, unit: 'm²', totalCost: 36000 },
    { orderId: 'OC-2403-008', supplierName: 'Herrajes Internacionales', orderDate: '2024-03-20', material: 'Hebilla Plateada #HP-01', quantity: 1500, unit: 'pzas', totalCost: 5250 },
];

const monthlyRevenueData: MonthlyData[] = [
    { month: 'Ene', value: 850000 },
    { month: 'Feb', value: 885000 },
    { month: 'Mar', value: 920000 },
    { month: 'Abr', value: 955000 },
    { month: 'May', value: 980000 },
    { month: 'Jun', value: 1025000 },
];

const Dashboard: React.FC = () => {
    const { theme } = useTheme();
    const currentRevenue = monthlyRevenueData[monthlyRevenueData.length - 1].value;
    const previousRevenue = monthlyRevenueData[monthlyRevenueData.length - 2].value;
    const revenueChange = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);

    const getTooltipStyles = () => ({
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
        color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
    });

    const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const handleExportCSV = () => {
        // Helper to escape commas in strings
        const escapeCsvField = (field: string | number) => `"${String(field).replace(/"/g, '""')}"`;

        let csvContent = "";

        // Section 1: Supplier Performance
        csvContent += "Rendimiento de Proveedores\n";
        csvContent += ["ID", "Nombre", "Teléfono", "Email", "OTD (%)", "Calidad (%)", "Recomendacion IA"].join(",") + "\n";
        supplierData.forEach(item => {
            csvContent += [item.id, escapeCsvField(item.name), item.phone, item.email, item.otd, item.quality, item.iaRecommendation].join(",") + "\n";
        });

        // Section 2: Material Alerts
        csvContent += "\nAlertas de Materiales\n";
        csvContent += ["ID", "Nombre", "Dias de Cobertura", "Prioridad"].join(",") + "\n";
        materialAlertsData.forEach(item => {
            csvContent += [item.id, escapeCsvField(item.name), item.coverageDays, item.priority].join(",") + "\n";
        });
        
        // Section 3: Supplier Risk Alerts
        csvContent += "\nAlertas de Riesgo de Proveedores\n";
        csvContent += ["ID", "Titulo del Riesgo", "Proveedor Impactado", "Impacto Potencial", "Mitigacion Sugerida", "Severidad"].join(",") + "\n";
        supplierRiskData.forEach(item => {
             csvContent += [item.id, escapeCsvField(item.riskTitle), escapeCsvField(item.supplierImpacted), escapeCsvField(item.potentialImpact), escapeCsvField(item.mitigation), item.severity].join(",") + "\n";
        });

        // Section 4: Purchase History
        csvContent += "\nHistorial de Compras\n";
        csvContent += ["ID Orden", "Proveedor", "Fecha", "Material", "Cantidad", "Unidad", "Costo Total (MXN)"].join(",") + "\n";
        purchaseHistoryData.forEach(item => {
            csvContent += [item.orderId, escapeCsvField(item.supplierName), item.orderDate, escapeCsvField(item.material), item.quantity, item.unit, item.totalCost].join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute("download", `sismac_dashboard_export_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-semibold"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Exportar a CSV
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {/* KPI Cards */}
                <KpiCard title="Ingresos del Mes" value={`$${currentRevenue.toLocaleString('es-MX')}`} change={`+${revenueChange}% vs mes anterior`} positive={true} />
                <KpiCard title="Ahorro Generado por IA (Mes)" value={`$${aiSavingsData[aiSavingsData.length - 1].value.toLocaleString('es-MX')}`} change="+5.2% vs mes anterior" positive={true} />
                <KpiCard title="Costo Material por Par" value={`$${costPerPairData[costPerPairData.length - 1].value.toFixed(2)}`} change="-1.8% vs mes anterior" positive={true} />
                <KpiCard title="Índice de Desperdicio" value={`${wasteIndexData[wasteIndexData.length - 1].real.toFixed(1)}%`} change="En objetivo" positive={true} />
                <KpiCard title="Rotación de Inventario" value="4.5" change="+0.2 vs periodo ant." positive={true} />
                <KpiCard title="Riesgo de Suministro" value="Medio" change="1 alerta crítica" positive={false} />

                {/* AI Analytics */}
                <div className="lg:col-span-6">
                    <AiAnalytics 
                        supplierData={supplierData}
                        costPerPairData={costPerPairData}
                        supplierRiskData={supplierRiskData}
                        aiSavingsData={aiSavingsData}
                        wasteIndexData={wasteIndexData}
                    />
                </div>

                {/* Supplier Risk Alerts */}
                <div className="lg:col-span-6">
                    <SupplierRiskAlerts alerts={supplierRiskData} />
                </div>

                {/* Charts */}
                <div className="lg:col-span-3">
                    <ChartCard title="Costo de Materiales por Par (CMP)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={costPerPairData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" stroke={axisColor} />
                                <YAxis stroke={axisColor} />
                                <Tooltip contentStyle={getTooltipStyles()} />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Costo (MXN)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                
                <div className="lg:col-span-3">
                    <ChartCard title="Índice de Desperdicio Promedio (IDA) %">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={wasteIndexData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" stroke={axisColor} />
                                <YAxis stroke={axisColor} />
                                <Tooltip contentStyle={getTooltipStyles()} />
                                <Legend />
                                <Bar dataKey="proyectado" name="Proyectado" fill="#475569" />
                                <Bar dataKey="real" name="Real" fill="#f43f5e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                
                {/* Lists and Tables */}
                <div className="lg:col-span-3">
                    <MaterialAlertsList alerts={materialAlertsData} />
                </div>

                <div className="lg:col-span-3">
                    <SupplierPerformanceTable suppliers={supplierData} />
                </div>

                <div className="lg:col-span-3">
                    <ChartCard title="Ahorro Acumulado por Sugerencias de IA">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={aiSavingsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" stroke={axisColor} />
                                <YAxis stroke={axisColor} />
                                <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-MX')}`} contentStyle={getTooltipStyles()} />
                                <Legend />
                                <Bar dataKey="value" name="Ahorro (MXN)" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                
                <div className="lg:col-span-3">
                    <ChartCard title="Pronóstico de Ventas (Próximos 6 Meses)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesForecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="month" stroke={axisColor} />
                                <YAxis stroke={axisColor} />
                                <Tooltip 
                                    formatter={(value: number) => value.toLocaleString('es-MX')}
                                    labelStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b' }}
                                    contentStyle={getTooltipStyles()} 
                                />
                                <Legend />
                                <defs>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="confidenceInterval" stroke={false} fill="url(#colorForecast)" name="Intervalo de Confianza" />
                                <Line type="monotone" dataKey="forecast" name="Pronóstico (pares)" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* Purchase History */}
                <div className="lg:col-span-6">
                    <PurchaseHistory data={purchaseHistoryData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;