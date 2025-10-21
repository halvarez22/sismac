
import React, { useEffect, useState } from 'react';
import ModelHeaderForm from './components/ModelHeaderForm';
import MaterialsTable from './components/MaterialsTable';
import ImageUploader from './components/ImageUploader';
import CostSummary from './components/CostSummary';
import ExcelImporter from './components/ExcelImporter';
import ModelsList from './components/ModelsList';
import ProductionRouteForm from './components/ProductionRouteForm';
import TechnicalSpecificationsForm from './components/TechnicalSpecificationsForm';
import ProductionModule from './components/ProductionModule';
import { useModelStore } from './store/useModelStore';
import { Save, FileUp, FileDown, Moon, Sun, Plus, FileText, Wrench, Ruler, Image, Package, Factory } from 'lucide-react';
import { useCostCalculator } from './hooks/useCostCalculator';

export default function App() {
  const models = useModelStore((state) => state.models);
  const selectedModel = useModelStore((state) =>
    state.selectedModelId === null ? null : state.models.find(m => m.id === state.selectedModelId) || null
  );
  const isDarkMode = useModelStore((state) => state.isDarkMode);
  const isLoading = useModelStore((state) => state.isLoading);
  const loadData = useModelStore((state) => state.loadData);
  const toggleDarkMode = useModelStore((state) => state.toggleDarkMode);
  const createNewModel = useModelStore((state) => state.createNewModel);
  const selectedModelId = useModelStore((state) => state.selectedModelId);

  // Estado para las pestañas principales
  const [mainTab, setMainTab] = useState<'models' | 'production'>('models');
  // Estado para las pestañas del módulo de ingeniería
  const [engineeringTab, setEngineeringTab] = useState<'header' | 'materials' | 'route' | 'specs' | 'images'>('header');

  // This hook will automatically update the store with calculated costs
  useCostCalculator();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Initialize dark mode on mount (only after data is loaded)
  useEffect(() => {
    if (!isLoading) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isLoading]);
  
  const handleSave = () => {
    // In a real application, this would send the data to a backend API
    if (!selectedModel) {
      alert("Selecciona un modelo primero");
      return;
    }
    console.log("Guardando modelo:", JSON.stringify(selectedModel, null, 2));
    alert("Modelo listo para ser enviado al backend. Revisa la consola para ver el JSON.");
  };

  // Show loading screen while data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                         <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                           Sistema de Control de Producción - Calzado
                         </h1>
                         {selectedModelId && mainTab === 'models' && (
                           <button
                             onClick={() => useModelStore.getState().selectModel(null)}
                             className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                           >
                             ← Volver a lista
                           </button>
                         )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  {selectedModelId && mainTab === 'models' && (
                    <>
                      <ExcelImporter />
                      <button
                        onClick={handleSave}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Guardar
                      </button>
                      <button
                        disabled
                        className="flex items-center bg-gray-400 dark:bg-gray-600 text-white px-4 py-2 rounded-lg shadow cursor-not-allowed"
                        title="Función no implementada"
                      >
                        <FileDown className="h-5 w-5 mr-2" />
                        Exportar PDF
                      </button>
                    </>
                  )}
                  {mainTab === 'models' && (
                    <button
                      onClick={createNewModel}
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nuevo Modelo
                    </button>
                  )}
                </div>
              </div>

              {/* Pestañas principales */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 py-4">
                  <button
                    onClick={() => setMainTab('models')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      mainTab === 'models'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    <span>Ingeniería de Producto</span>
                  </button>
                  <button
                    onClick={() => setMainTab('production')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      mainTab === 'production'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Factory className="h-4 w-4" />
                    <span>Control de Producción</span>
                  </button>
                </nav>
              </div>
          </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {mainTab === 'models' ? (
            // Módulo de Ingeniería de Producto
            <>
              {selectedModelId === null ? (
                // Vista de lista de modelos
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Modelos Disponibles</h2>
                    <ModelsList />
                  </div>
                </div>
              ) : selectedModel ? (
                // Vista de detalle del modelo seleccionado con pestañas
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
                  {/* Pestañas de navegación del módulo de ingeniería */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6">
                      <button
                        onClick={() => setEngineeringTab('header')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          engineeringTab === 'header'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Encabezado</span>
                      </button>
                      <button
                        onClick={() => setEngineeringTab('materials')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          engineeringTab === 'materials'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Package className="h-4 w-4" />
                        <span>Materiales</span>
                      </button>
                      <button
                        onClick={() => setEngineeringTab('route')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          engineeringTab === 'route'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Wrench className="h-4 w-4" />
                        <span>Ruta Producción</span>
                      </button>
                      <button
                        onClick={() => setEngineeringTab('specs')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          engineeringTab === 'specs'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Ruler className="h-4 w-4" />
                        <span>Especificaciones</span>
                      </button>
                      <button
                        onClick={() => setEngineeringTab('images')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          engineeringTab === 'images'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        <Image className="h-4 w-4" />
                        <span>Imágenes</span>
                      </button>
                    </nav>
                  </div>

                  {/* Contenido de las pestañas del módulo de ingeniería */}
                  <div className="p-6">
                    {engineeringTab === 'header' && (
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Encabezado del Modelo</h2>
                        <ModelHeaderForm />
                      </div>
                    )}

                    {engineeringTab === 'materials' && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Explosión de Materiales</h2>
                          <MaterialsTable />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Resumen de Costos</h3>
                          <CostSummary />
                        </div>
                      </div>
                    )}

                    {engineeringTab === 'route' && (
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Ruta de Producción</h2>
                        <ProductionRouteForm />
                      </div>
                    )}

                    {engineeringTab === 'specs' && (
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Especificaciones Técnicas</h2>
                        <TechnicalSpecificationsForm />
                      </div>
                    )}

                    {engineeringTab === 'images' && (
                      <div>
                        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Imágenes del Modelo</h2>
                        <ImageUploader />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Estado de carga o error
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors">
                  <p className="text-gray-600 dark:text-gray-400">Cargando modelo...</p>
                </div>
              )}
            </>
          ) : (
            // Módulo de Control de Producción
            <ProductionModule />
          )}
        </main>
      </div>
  );
}
