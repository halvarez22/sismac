import React from 'react';
import { MaterialInventory } from '../types';
import { SubstituteSuggestion } from './ProductModelModal';

interface SubstituteSuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    suggestions: SubstituteSuggestion[];
    originalMaterial?: MaterialInventory;
    onApply: (substituteSku: string) => void;
    error: string | null;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

const SubstituteSuggestionsModal: React.FC<SubstituteSuggestionsModalProps> = ({
    isOpen,
    onClose,
    isLoading,
    suggestions,
    originalMaterial,
    onApply,
    error
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-slate-700">
                     <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-violet-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-white">Sugerencias de Sustitutos (IA)</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <p className="text-sm text-slate-400 mb-4">
                        Sugerencias para sustituir: <strong className="text-slate-200">{originalMaterial?.name || 'Material'}</strong>
                    </p>
                    
                    {isLoading && (
                        <div className="flex justify-center items-center h-48">
                            <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-4 text-slate-300">Analizando inventario...</p>
                        </div>
                    )}

                    {error && !isLoading && <p className="text-center text-rose-400">{error}</p>}
                    
                    {!isLoading && !error && suggestions.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-slate-700">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Material Sustituto</th>
                                        <th scope="col" className="px-6 py-3">Justificación IA</th>
                                        <th scope="col" className="px-6 py-3 text-center">Impacto Costo/Par</th>
                                        <th scope="col" className="px-6 py-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suggestions.map((sug) => {
                                        const isSaving = sug.costImpactPerPair < 0;
                                        const costClass = isSaving ? 'text-emerald-400' : 'text-rose-400';
                                        return (
                                            <tr key={sug.substituteSku} className="border-b border-slate-700 last:border-b-0 bg-slate-800">
                                                <td className="px-6 py-4 font-medium text-slate-200">
                                                    <div>{sug.substituteName}</div>
                                                    <div className="text-xs text-slate-500 font-mono">{sug.substituteSku}</div>
                                                </td>
                                                <td className="px-6 py-4 italic text-slate-400">"{sug.justification}"</td>
                                                <td className={`px-6 py-4 text-center font-semibold ${costClass}`}>
                                                    {isSaving ? '' : '+'}{formatCurrency(sug.costImpactPerPair)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => onApply(sug.substituteSku)}
                                                        className="px-3 py-1 bg-sky-600 text-white rounded-md hover:bg-sky-500 transition-colors text-xs font-semibold"
                                                    >
                                                        Seleccionar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                     {!isLoading && !error && suggestions.length === 0 && (
                        <p className="text-center text-slate-500 py-10">No se encontraron sustitutos adecuados en el inventario actual.</p>
                     )}
                </main>

                <footer className="flex justify-end p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold">Cerrar</button>
                </footer>
            </div>
        </div>
    );
};

export default SubstituteSuggestionsModal;
