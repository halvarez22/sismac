
import React, { useState } from 'react';
import { useModelStore } from '../store/useModelStore';
import type { Financials } from '../types';
import { ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

function SummaryRow({ label, value, isBold = false, valueColor = 'text-gray-900' }: { label: string; value: string; isBold?: boolean; valueColor?: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className={`text-gray-600 dark:text-gray-400 ${isBold ? 'font-semibold' : ''}`}>{label}</span>
            <span className={`${valueColor} ${isBold ? 'font-bold' : 'font-medium'}`}>{value}</span>
        </div>
    );
}

function EditableSummaryRow({ label, value, onChange }: { label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="flex justify-between items-center">
            <label htmlFor={label} className="text-gray-600 dark:text-gray-400">{label}</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">$</span>
                <input
                    type="number"
                    id={label}
                    value={value}
                    onChange={onChange}
                    className="w-32 pl-7 pr-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    step="0.01"
                />
            </div>
        </div>
    );
}

export default function CostSummary() {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const setFinancials = useModelStore((state) => state.setFinancials);

  // Si no hay modelo seleccionado, mostrar mensaje
  if (!selectedModel) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        <p className="text-xs">Selecciona un modelo</p>
      </div>
    );
  }

  const { financials } = selectedModel;

    const handleManualInputChange = (field: keyof Financials, value: string) => {
        const numericValue = parseFloat(value) || 0;
        setFinancials({ ...financials, [field]: numericValue });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);
    };

    const { profitOrLoss } = financials;
    const isLoss = profitOrLoss < 0;

    return (
        <div className="w-full">
            {/* Vista Compacta */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Resumen de Costos
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`text-xs font-semibold px-2 py-1 rounded ${
                            isLoss
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                            {formatCurrency(profitOrLoss)}
                        </div>
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                    </div>
                </button>

                {/* Vista Expandida */}
                {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                        <div className="space-y-2 text-sm">
                            <SummaryRow label="Materiales Directos" value={formatCurrency(financials.directMaterials)} />

                            <EditableSummaryRow
                                label="Mano de Obra Directa"
                                value={financials.directLabor}
                                onChange={(e) => handleManualInputChange('directLabor', e.target.value)}
                            />

                            <EditableSummaryRow
                                label="Gastos de Fabricación"
                                value={financials.manufacturingExpenses}
                                onChange={(e) => handleManualInputChange('manufacturingExpenses', e.target.value)}
                            />

                            <div className="border-t pt-2">
                                <SummaryRow label="Costo Total" value={formatCurrency(financials.totalCost)} isBold={true} />
                            </div>

                            <EditableSummaryRow
                                label="Precio al Cliente"
                                value={financials.clientPrice}
                                onChange={(e) => handleManualInputChange('clientPrice', e.target.value)}
                            />

                            <div className={`p-2 rounded-md ${isLoss ? 'bg-red-50 text-red-800 dark:bg-red-900/20' : 'bg-green-50 text-green-800 dark:bg-green-900/20'}`}>
                                 <SummaryRow
                                    label={isLoss ? 'Pérdida' : 'Utilidad'}
                                    value={formatCurrency(profitOrLoss)}
                                    isBold={true}
                                    valueColor={isLoss ? 'text-red-600' : 'text-green-600'}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
