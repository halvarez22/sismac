import React, { useState, useMemo } from 'react';
import { MaterialInventory, InventoryMovement, InventoryStatus } from '../types';
import { useTheme } from '../App';
import KpiCard from './KpiCard';
import ChartCard from './ChartCard';
import InventoryTable from './InventoryTable';
import RecentMovements from './RecentMovements';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import AiWarehouseInsights from './AiWarehouseInsights';
import AddMaterialModal from './AddMaterialModal';
// FIX: The import for RecordMovementModal was failing due to a corrupted file. It should work now with the corrected file content.
import RecordMovementModal from './RecordMovementModal';

// Mock Data for Warehouse
const initialMaterialInventoryData: Omit<MaterialInventory, 'status'>[] = [
    { id: 'PN-N-001', name: 'Piel Nappa Negra', category: 'Pieles', quantity: 850, unit: 'm²', location: 'A-01-B', unitCost: 310, totalValue: 263500, reorderPoint: 400, lastMovementDate: '2024-07-26' },
    { id: 'PN-R-002', name: 'Piel Nappa Roja', category: 'Pieles', quantity: 210, unit: 'm²', location: 'A-01-C', unitCost: 300, totalValue: 63000, reorderPoint: 200, lastMovementDate: '2024-07-22' },
    { id: 'SH-T-501', name: 'Suela Hule TR Mod. 501', category: 'Suelas', quantity: 950, unit: 'pares', location: 'B-03-A', unitCost: 35, totalValue: 33250, reorderPoint: 1000, lastMovementDate: '2024-07-28' },
    { id: 'HD-03', name: 'Hebilla Dorada #HD-03', category: 'Herrajes', quantity: 8500, unit: 'pzas', location: 'C-11-D', unitCost: 4, totalValue: 34000, reorderPoint: 5000, lastMovementDate: '2024-07-25' },
    { id: 'FC-01', name: 'Forro de cerdo', category: 'Textiles', quantity: 450, unit: 'm²', location: 'A-02-A', unitCost: 30, totalValue: 13500, reorderPoint: 300, lastMovementDate: '2024-07-18' },
    { id: 'OM-01', name: 'Ojal Metálico #OM-01', category: 'Herrajes', quantity: 9800, unit: 'pzas', location: 'C-12-B', unitCost: 1.5, totalValue: 14700, reorderPoint: 10000, lastMovementDate: '2024-07-22' },
    { id: 'ADH-PU-05', name: 'Adhesivo Poliuretano 5L', category: 'Químicos', quantity: 50, unit: 'L', location: 'D-01-F', unitCost: 800, totalValue: 40000, reorderPoint: 40, lastMovementDate: '2024-07-29' },
    { id: 'SH-C-300', name: 'Suela Cuero Mod. 300', category: 'Suelas', quantity: 80, unit: 'pares', location: 'B-04-C', unitCost: 120, totalValue: 9600, reorderPoint: 150, lastMovementDate: '2024-07-27' },
    { id: 'CV-A-001', name: 'Cuero Vegano Azul', category: 'Pieles', quantity: 600, unit: 'm²', location: 'A-03-A', unitCost: 250, totalValue: 150000, reorderPoint: 200, lastMovementDate: '2024-04-15' },
];

const initialInventoryMovementsData: InventoryMovement[] = [
    { id: 101, date: '2024-07-29T14:30:00Z', type: 'Entrada', materialId: 'ADH-PU-05', materialName: 'Adhesivo Poliuretano 5L', quantity: 20, referenceId: 'OC-2407-011', user: 'alm_user' },
    { id: 102, date: '2024-07-28T11:00:00Z', type: 'Salida', materialId: 'SH-T-501', materialName: 'Suela Hule TR Mod. 501', quantity: -50, referenceId: 'OP-5513', user: 'prod_user' },
    { id: 103, date: '2024-07-27T09:15:00Z', type: 'Salida', materialId: 'SH-C-300', materialName: 'Suela Cuero Mod. 300', quantity: -50, referenceId: 'OP-5511', user: 'prod_user' },
    { id: 104, date: '2024-07-26T16:45:00Z', type: 'Entrada', materialId: 'PN-N-001', materialName: 'Piel Nappa Negra', quantity: 300, referenceId: 'OC-2407-002', user: 'alm_user' },
    { id: 105, date: '2024-07-25T10:05:00Z', type: 'Salida', materialId: 'HD-03', materialName: 'Hebilla Dorada #HD-03', quantity: -1500, referenceId: 'OP-5510', user: 'prod_user' },
    { id: 106, date: '2024-07-22T15:20:00Z', type: 'Ajuste', materialId: 'OM-01', materialName: 'Ojal Metálico #OM-01', quantity: -200, referenceId: 'INV-ADJ-03', user: 'gerente_alm' },
    { id: 107, date: '2024-07-26T09:00:00Z', type: 'Salida', materialId: 'PN-N-001', materialName: 'Piel Nappa Negra', quantity: -50, referenceId: 'OP-5512', user: 'prod_user' },
];

const calculateStatus = (quantity: number, reorderPoint: number): InventoryStatus => {
    if (reorderPoint <= 0) return 'OK'; 
    const ratio = quantity / reorderPoint;
    if (ratio <= 0.75) return 'Crítico';
    if (ratio <= 1.1) return 'Bajo';
    if (ratio >= 2.5) return 'Exceso';
    return 'OK';
};

const Almacen: React.FC = () => {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

    const [inventoryData, setInventoryData] = useState<MaterialInventory[]>(
        initialMaterialInventoryData.map(item => ({
            ...item,
            status: calculateStatus(item.quantity, item.reorderPoint)
        }))
    );
    const [movementsData, setMovementsData] = useState<InventoryMovement[]>(initialInventoryMovementsData);

    const handleSaveNewMaterial = (newMaterialData: Omit<MaterialInventory, 'totalValue' | 'status' | 'lastMovementDate'>) => {
        const today = new Date().toISOString().slice(0, 10);
        const newMaterial: MaterialInventory = {
            ...newMaterialData,
            totalValue: newMaterialData.quantity * newMaterialData.unitCost,
            status: calculateStatus(newMaterialData.quantity, newMaterialData.reorderPoint),
            lastMovementDate: today,
        };

        setInventoryData(prev => [newMaterial, ...prev]);

        const newMovement: InventoryMovement = {
            id: Math.max(...movementsData.map(m => m.id), 0) + 1,
            date: new Date().toISOString(),
            type: 'Entrada',
            materialId: newMaterial.id,
            materialName: newMaterial.name,
            quantity: newMaterial.quantity,
            referenceId: 'STOCK-INICIAL',
            user: 'gerente_alm',
        };

        setMovementsData(prev => [newMovement, ...prev]);
        setIsAddMaterialModalOpen(false);
    };
    
    const handleSaveMovement = (movement: { materialId: string; type: InventoryMovement['type']; quantity: number; referenceId: string; user: string; }) => {
        const today = new Date();
        const materialIndex = inventoryData.findIndex(m => m.id === movement.materialId);

        if (materialIndex === -1) {
            console.error("Material not found for movement");
            return;
        }

        const updatedInventory = [...inventoryData];
        const materialToUpdate = { ...updatedInventory[materialIndex] };

        // For this implementation, 'Ajuste' is also a reduction.
        const quantityChange = movement.type === 'Entrada' ? movement.quantity : -movement.quantity;
        
        const newQuantity = Math.max(0, materialToUpdate.quantity + quantityChange);
        
        // Update material properties
        materialToUpdate.quantity = newQuantity;
        materialToUpdate.lastMovementDate = today.toISOString().slice(0, 10);
        materialToUpdate.totalValue = newQuantity * materialToUpdate.unitCost;
        materialToUpdate.status = calculateStatus(newQuantity, materialToUpdate.reorderPoint);

        updatedInventory[materialIndex] = materialToUpdate;
        setInventoryData(updatedInventory);

        // Create and add new movement record
        const newMovement: InventoryMovement = {
            id: Math.max(...movementsData.map(m => m.id), 0) + 1,
            date: today.toISOString(),
            type: movement.type,
            materialId: movement.materialId,
            materialName: materialToUpdate.name,
            quantity: quantityChange, // Store the change with its sign
            referenceId: movement.referenceId,
            user: movement.user,
        };
        
        setMovementsData(prev => [newMovement, ...prev]);
        setIsMovementModalOpen(false);
    };

    const uniqueCategories = [...new Set(inventoryData.map(item => item.category))];

    const filteredInventoryData = useMemo(() => {
        return inventoryData.filter(item => {
            const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
            const matchesSearch = searchTerm ?
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase())
                : true;
            const matchesLocation = locationFilter ?
                item.location.toLowerCase().includes(locationFilter.toLowerCase())
                : true;
            return matchesCategory && matchesSearch && matchesLocation;
        });
    }, [inventoryData, searchTerm, selectedCategory, locationFilter]);

    const totalInventoryValue = inventoryData.reduce((acc, item) => acc + item.totalValue, 0);
    const lowStockAlerts = inventoryData.filter(item => item.status === 'Bajo' || item.status === 'Crítico').length;
    
    const criticalStockData = inventoryData
        .filter(item => item.status === 'Bajo' || item.status === 'Crítico')
        .map(item => ({
            name: item.id,
            'Cantidad Actual': item.quantity,
            'Punto de Pedido': item.reorderPoint
        }))
        .sort((a,b) => (a['Cantidad Actual']/a['Punto de Pedido']) - (b['Cantidad Actual']/b['Punto de Pedido']));

    const statusDistributionData = useMemo(() => {
        const counts = inventoryData.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, {} as Record<InventoryStatus, number>);

        return (['OK', 'Bajo', 'Crítico', 'Exceso'] as InventoryStatus[]).map(status => ({
            name: status,
            value: counts[status] || 0,
        }));
    }, [inventoryData]);

    const PIE_COLORS: Record<InventoryStatus, string> = {
        'OK': '#10b981', 'Bajo': '#f59e0b', 'Crítico': '#ef4444', 'Exceso': '#38bdf8',
    };

    const inventoryRotationData = useMemo(() => {
        const categoryValueMap = inventoryData.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.totalValue;
            return acc;
        }, {} as Record<string, number>);

        const materialDetailsMap = inventoryData.reduce((acc, item) => {
            acc[item.id] = { unitCost: item.unitCost, category: item.category };
            return acc;
        }, {} as Record<string, { unitCost: number, category: string }>);

        const categoryCogsMap = movementsData.reduce((acc, movement) => {
            if (movement.type === 'Salida') {
                const details = materialDetailsMap[movement.materialId];
                if (details) {
                    const cogs = Math.abs(movement.quantity) * details.unitCost;
                    acc[details.category] = (acc[details.category] || 0) + cogs;
                }
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.keys(categoryValueMap).map(category => {
            const totalValue = categoryValueMap[category];
            const totalCogs = categoryCogsMap[category] || 0;
            const rotation = totalValue > 0 ? totalCogs / totalValue : 0;
            return { name: category, rotacion: parseFloat(rotation.toFixed(2)) };
        }).sort((a, b) => b.rotacion - a.rotacion);

    }, [inventoryData, movementsData]);

    const handleExportCSV = () => {
        if (filteredInventoryData.length === 0) return alert("No hay datos para exportar.");
        const escapeCsvField = (field: string | number): string => `"${String(field).replace(/"/g, '""')}"`;
        const headers = ["SKU", "Material", "Categoría", "Ubicación", "Estado", "Cantidad", "Unidad", "Valor Total (MXN)", "Último Movimiento"];
        const csvRows = [headers.join(','), ...filteredInventoryData.map(item => [
            escapeCsvField(item.id), escapeCsvField(item.name), escapeCsvField(item.category),
            escapeCsvField(item.location), escapeCsvField(item.status), item.quantity,
            escapeCsvField(item.unit), item.totalValue, item.lastMovementDate
        ].join(','))];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `sismac_inventario_export_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setLocationFilter('');
    };
    
    const getTooltipStyles = () => ({
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
        color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
    });
    const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const CustomCriticalStockTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload?.length) return null;
        const { 'Cantidad Actual': cantidad, 'Punto de Pedido': reorderPoint } = payload[0].payload;
        const diff = cantidad - reorderPoint;
        return (
            <div className="bg-slate-700/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 text-sm shadow-lg">
                <p className="font-bold text-slate-200 mb-1">{`SKU: ${label}`}</p>
                <p className="text-slate-300">{`Cantidad Actual: `}<span className="font-semibold text-white">{cantidad.toLocaleString()}</span></p>
                <p className="text-slate-300">{`Punto de Pedido: `}<span className="font-semibold text-white">{reorderPoint.toLocaleString()}</span></p>
                <hr className="my-1 border-slate-600" />
                <p className={diff >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {diff >= 0 ? `Excedente: ${diff.toLocaleString()}` : `Faltante: ${Math.abs(diff).toLocaleString()}`}
                </p>
            </div>
        );
    };

    return (
        <div>
            {isAddMaterialModalOpen && (
                <AddMaterialModal
                    isOpen={isAddMaterialModalOpen}
                    onClose={() => setIsAddMaterialModalOpen(false)}
                    onSave={handleSaveNewMaterial}
                    categories={uniqueCategories as MaterialInventory['category'][]}
                    existingSkus={inventoryData.map(i => i.id)}
                />
            )}
            {isMovementModalOpen && (
                <RecordMovementModal
                    isOpen={isMovementModalOpen}
                    onClose={() => setIsMovementModalOpen(false)}
                    onSave={handleSaveMovement}
                    inventory={inventoryData}
                />
            )}

            <div className="space-y-6">
                {/* Top Row: KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <KpiCard title="Valor Total Inventario" value={`$${totalInventoryValue.toLocaleString('es-MX')}`} change="Estimado" positive={true} />
                    <KpiCard title="% Ocupación de Almacén" value="82%" change="+3% vs semana anterior" positive={false} />
                    <KpiCard title="Alertas de Stock Bajo" value={`${lowStockAlerts}`} change="Requieren atención" positive={false} />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Inventory Management */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Gestión de Inventario</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsMovementModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-semibold shadow-lg shadow-indigo-900/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.25a2.25 2.25 0 0 0-2.25-2.25L5.25 3m14.023 6.348-3.181-3.182a8.25 8.25 0 0 0-11.667 0L2.985 19.644" /></svg>
                                    Registrar Movimiento
                                </button>
                                <button
                                    onClick={() => setIsAddMaterialModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-lg shadow-sky-900/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                    Añadir Material
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 flex-wrap">
                            <div className="relative flex-grow min-w-[200px]">
                                <input type="text" placeholder="Buscar por nombre o SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5" />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                            </div>
                            <div className="min-w-[180px]">
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                                    <option value="">Todas las Categorías</option>
                                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="relative flex-grow min-w-[200px]">
                                <input type="text" placeholder="Buscar por ubicación..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5" />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                                </div>
                            </div>
                            <button onClick={handleClearFilters} className="px-4 py-2.5 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm font-semibold">Limpiar Filtros</button>
                            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-semibold" aria-label="Exportar a CSV"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>Exportar a CSV</button>
                        </div>
                        <InventoryTable data={filteredInventoryData} />
                    </div>

                    {/* Right Column: Analytics Dashboard */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                         {/* Top 2x2 Chart Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ChartCard title="Distribución por Estado de Inventario">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart><Pie data={statusDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">{statusDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as InventoryStatus]} />))}</Pie><Tooltip contentStyle={getTooltipStyles()} formatter={(value: number, name: string) => [`${value} items`, name]} /><Legend /></PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Rotación de Inventario por Categoría">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={inventoryRotationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis dataKey="name" stroke={axisColor} /><YAxis stroke={axisColor} /><Tooltip contentStyle={getTooltipStyles()} formatter={(value: number) => [value.toFixed(2), "Tasa de Rotación"]} /><Bar dataKey="rotacion" name="Tasa de Rotación" fill="#8b5cf6" /></BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                             <ChartCard title="Análisis de Stock Crítico">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={criticalStockData.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis type="number" stroke={axisColor} /><YAxis type="category" dataKey="name" stroke={axisColor} width={80} tick={{ fontSize: 10 }}/><Tooltip content={<CustomCriticalStockTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} /><Legend wrapperStyle={{ paddingTop: '20px' }} /><Bar dataKey="Cantidad Actual" fill="#f59e0b" /><Bar dataKey="Punto de Pedido" fill="#ef4444" opacity={0.7} /></BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <ChartCard title="Detalle de Stock Bajo y Crítico">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={criticalStockData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                        <XAxis type="number" stroke={axisColor} />
                                        <YAxis type="category" dataKey="name" stroke={axisColor} width={80} tick={{ fontSize: 10 }}/>
                                        <Tooltip content={<CustomCriticalStockTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="Cantidad Actual" fill="#38bdf8" />
                                        <Bar dataKey="Punto de Pedido" fill="#ef4444" opacity={0.7} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                        
                        {/* Stacked Insights and Movements */}
                        <AiWarehouseInsights inventoryData={inventoryData} />
                        <RecentMovements data={movementsData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Almacen;