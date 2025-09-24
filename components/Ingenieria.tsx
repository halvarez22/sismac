import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ProductModel, MaterialInventory } from '../types';
import ProductModelModal from './ProductModelModal';

interface OutletContextType {
    productModels: ProductModel[];
    inventoryData: MaterialInventory[];
    addProductModel: (newModel: ProductModel) => void;
    editProductModel: (updatedModel: ProductModel) => void;
}

const Ingenieria: React.FC = () => {
    const { productModels, inventoryData, addProductModel, editProductModel } = useOutletContext<OutletContextType>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<ProductModel | null>(null);

    const handleOpenAddModel = () => {
        setEditingModel(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (model: ProductModel) => {
        setEditingModel(model);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingModel(null);
    };

    const handleSaveModel = (modelToSave: ProductModel) => {
        if (productModels.some(m => m.id === modelToSave.id && m !== editingModel)) {
            // Logic to update if ID exists, otherwise add.
             editProductModel(modelToSave);
        } else if (editingModel) {
            editProductModel(modelToSave);
        }
        else {
            addProductModel(modelToSave);
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            <ProductModelModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveModel}
                existingModel={editingModel}
                inventoryData={inventoryData}
                existingModelIds={productModels.map(m => m.id)}
            />

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Catálogo de Modelos de Producto (Fichas Técnicas)</h3>
                <button
                    onClick={handleOpenAddModel}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-lg shadow-sky-900/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Crear Nuevo Modelo
                </button>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Modelo (SKU)</th>
                                <th scope="col" className="px-6 py-3">Nombre del Modelo</th>
                                <th scope="col" className="px-6 py-3 text-center">Nº de Materiales (BOM)</th>
                                <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productModels.map((model) => (
                                <tr key={model.id} className="border-b border-slate-700 hover:bg-slate-800">
                                    <td className="px-6 py-4 font-mono">{model.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-200">{model.name}</td>
                                    <td className="px-6 py-4 text-center">{model.bom.length}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleOpenEditModal(model)} className="p-1 rounded-md text-amber-400 hover:bg-amber-500/20 transition-colors" aria-label={`Editar ${model.name}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {productModels.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            No hay modelos de producto definidos. Comience creando uno nuevo.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ingenieria;