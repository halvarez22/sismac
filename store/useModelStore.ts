import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { Model, ModelHeader, Material, Financials, ProductionRoute, TechnicalSpecifications, ProductionOperation, ModelVersion, ProductionOrder, ProductionLine, ProductionBatch, QualityCheck } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  modelService,
  productionOrderService,
  productionLineService,
  productionBatchService,
  qualityCheckService,
  userSettingsService
} from '../src/services/firebaseService';

interface ModelState {
  models: Model[];
  selectedModelId: string | null;
  isDarkMode: boolean;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  // Production module state
  productionOrders: ProductionOrder[];
  productionLines: ProductionLine[];
  productionBatches: ProductionBatch[];
  qualityChecks: QualityCheck[];
  // Getters
  getSelectedModel: () => Model | null;
  // Data loading
  loadData: () => Promise<void>;
  // Model management
  createNewModel: () => void;
  selectModel: (modelId: string | null) => void;
  deleteModel: (modelId: string) => void;
  // Current model operations (work on selected model)
  setHeaderField: (field: keyof ModelHeader, value: ModelHeader[keyof ModelHeader]) => void;
  addMaterial: () => void;
  updateMaterial: (id: string, field: keyof Material, value: Material[keyof Material]) => void;
  setMaterials: (materials: Material[]) => void;
  removeMaterial: (id: string) => void;
  addImages: (newImages: string[]) => void;
  removeImage: (index: number) => void;
  setFinancials: (financials: Financials) => void;
  loadFromExcel: (data: { header: Partial<ModelHeader>, materials: Partial<Material>[], images: string[] }) => void;
  toggleDarkMode: () => void;
  // Nuevas funcionalidades de ingeniería
  updateProductionRoute: (route: ProductionRoute) => void;
  addProductionOperation: () => void;
  updateProductionOperation: (id: string, field: keyof ProductionOperation, value: ProductionOperation[keyof ProductionOperation]) => void;
  removeProductionOperation: (id: string) => void;
  updateTechnicalSpecifications: (specs: TechnicalSpecifications) => void;
  createNewVersion: (changes: string, createdBy: string) => void;
  approveVersion: (versionId: string, approvedBy: string) => void;
  addDocument: (documentUrl: string) => void;
  removeDocument: (index: number) => void;
  // Production module functions
  createProductionOrder: (modelId: string, quantity: number, startDate: string) => void;
  updateProductionOrder: (id: string, updates: Partial<ProductionOrder>) => void;
  deleteProductionOrder: (id: string) => void;
  createProductionLine: (name: string, capacity: number) => void;
  updateProductionLine: (id: string, updates: Partial<ProductionLine>) => void;
  deleteProductionLine: (id: string) => void;
  assignOrderToLine: (orderId: string, lineId: string | null) => void;
  createProductionBatch: (orderId: string, quantity: number) => void;
  updateProductionBatch: (id: string, updates: Partial<ProductionBatch>) => void;
  deleteProductionBatch: (id: string) => void;
  addQualityCheck: (batchId: string, operationId: string, inspector: string, status: 'pass' | 'fail') => void;
  // Production calculations
  getCapacityVsDemand: () => { lineId: string; lineName: string; capacity: number; demand: number; utilization: number; status: 'under' | 'optimal' | 'overloaded' }[];
  getOperationEfficiency: () => { operationId: string; operationName: string; efficiency: number; avgTime: number; targetTime: number }[];
  getCostPerHour: () => { lineId: string; lineName: string; costPerHour: number; hourlyCapacity: number }[];
  getLineROI: () => { lineId: string; lineName: string; roi: number; revenue: number; costs: number }[];
  getBottlenecks: () => { type: 'line' | 'operation'; id: string; name: string; severity: 'low' | 'medium' | 'high'; description: string }[];
  // Materials calculations
  getSupplierAnalysis: () => { supplier: string; totalMaterials: number; avgPrice: number; avgLeadTime: number; qualityScore: number; totalValue: number; recommendation: 'preferred' | 'alternative' | 'avoid' }[];
  getInventoryAlerts: () => { materialId: string; materialName: string; currentStock: number; requiredStock: number; status: 'critical' | 'low' | 'normal'; daysToDepletion: number }[];
  getABCAnalysis: () => { materialId: string; materialName: string; annualConsumption: number; annualValue: number; category: 'A' | 'B' | 'C'; percentage: number }[];
  getPurchaseRecommendations: () => { type: 'consolidate' | 'switch_supplier' | 'bulk_purchase' | 'emergency_order'; materials: string[]; savings: number; description: string; priority: 'high' | 'medium' | 'low' }[];
  getPriceTrends: () => { materialId: string; materialName: string; currentPrice: number; avgPrice: number; trend: 'up' | 'down' | 'stable'; changePercent: number; supplier: string }[];
}

// Helper function to save model to Firebase
const saveModelToFirebase = async (model: Model) => {
  console.log('💾 EJECUTANDO saveModelToFirebase para modelo:', model.id);
  try {
    await modelService.saveModel(model);
    console.log('✅ Modelo guardado exitosamente en Firebase:', model.id);
  } catch (error) {
    console.error('❌ Error saving model to Firebase:', error);
    // Don't throw error to avoid blocking UI
  }
};

const createNewMaterial = (): Material => ({
  id: uuidv4(),
  description: '',
  technicalName: '',
  color: '',
  provider: '',
  priceWithoutVAT: 0,
  netPrice: 0,
  purchaseUnit: '',
  width: 0,
  consumptionPerPair: 0,
  consumptionUnit: '',
  requiredToBuy: 0,
  costPerPair: 0,
  totalBudget: 0,
  minimumOrder: 0,
  oc: false,
  comprado: false,
  // Nuevos campos técnicos
  materialType: 'upper' as const,
  specifications: '',
  alternativeProviders: [],
  leadTime: 0,
});

const createNewProductionRoute = (): ProductionRoute => ({
  id: uuidv4(),
  name: 'Ruta de Producción Principal',
  operations: [],
  totalTime: 0,
  efficiency: 85,
  notes: '',
});

const createNewTechnicalSpecifications = (): TechnicalSpecifications => ({
  id: uuidv4(),
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'cm',
  },
  weight: {
    target: 0,
    tolerance: 0,
    unit: 'g',
  },
  qualityStandards: [],
  testingRequirements: [],
  packagingSpecifications: '',
  careInstructions: '',
  certifications: [],
});

const createNewModel = (): Model => {
  const now = new Date();
  return {
    id: uuidv4(),
    header: {
      moldCode: '',
      client: '',
      color: '',
      requestedPairs: 0,
      designer: '',
      week: Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7)),
      date: now.toISOString().split('T')[0],
      // Nuevos campos técnicos
      category: '',
      style: '',
      season: '',
      targetPrice: 0,
      status: 'draft' as const,
      version: '1.0',
      lastModified: now.toISOString(),
    },
    materials: [createNewMaterial()],
    images: [],
    financials: {
      directMaterials: 0,
      directLabor: 0,
      manufacturingExpenses: 0,
      totalCost: 0,
      clientPrice: 0,
      profitOrLoss: 0,
    },
    // Nuevas estructuras
    productionRoute: createNewProductionRoute(),
    technicalSpecifications: createNewTechnicalSpecifications(),
    versions: [{
      id: uuidv4(),
      version: '1.0',
      createdAt: now.toISOString(),
      createdBy: 'Sistema',
      changes: 'Creación inicial del modelo',
      status: 'draft' as const,
    }],
    documents: [],
  };
};

const initialModel: Model = {
  id: uuidv4(),
  header: {
    moldCode: '888887',
    client: 'COPPEL',
    color: 'NEGRO',
    requestedPairs: 1448,
    designer: 'DISEÑADORA',
    week: 25,
    date: new Date().toISOString().split('T')[0],
    category: 'Mujer',
    style: 'Sandalia',
    season: 'Verano',
    targetPrice: 0,
    status: 'draft',
    version: '1.0',
    lastModified: new Date().toISOString(),
  },
  materials: [createNewMaterial()],
  images: [],
  financials: {
    directMaterials: 0,
    directLabor: 0,
    manufacturingExpenses: 0,
    totalCost: 0,
    clientPrice: 0,
    profitOrLoss: 0,
  },
  productionRoute: createNewProductionRoute(),
  technicalSpecifications: createNewTechnicalSpecifications(),
  versions: [{
    id: uuidv4(),
    version: '1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'Sistema',
    changes: 'Modelo inicial de ejemplo',
    status: 'draft' as const,
  }],
  documents: [],
};

// Estado inicial - cargaremos datos de Firebase después
const initialState = {
  models: [],
  selectedModelId: null,
  isDarkMode: false,
  isLoading: true,
  hasUnsavedChanges: false,
  productionOrders: [],
  productionLines: [],
  productionBatches: [],
  qualityChecks: []
};

// FIX: Using createWithEqualityFn with shallow comparison to prevent infinite loops
// This ensures that getSnapshot returns stable references and avoids unnecessary re-renders
export const useModelStore = createWithEqualityFn<ModelState & { isLoading: boolean }>(
  (set, get) => ({
    ...initialState,

    // Data loading
    loadData: async () => {
      try {
        set({ isLoading: true });

        // Load dark mode setting
        const savedDarkMode = await userSettingsService.getSetting('darkMode');
        const isDarkMode = savedDarkMode !== null ? savedDarkMode : false;

        console.log('🔥 CARGANDO DATOS INICIALES DESDE FIREBASE...');

        // Load all data in parallel
        const [models, orders, lines, batches, checks] = await Promise.all([
          modelService.getAllModels(),
          productionOrderService.getAllOrders(),
          productionLineService.getAllLines(),
          productionBatchService.getAllBatches(),
          qualityCheckService.getAllChecks()
        ]);

        console.log('🔥 MODELOS CARGADOS DESDE FIREBASE:', models.length);

        // Apply dark mode
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Don't auto-select models on load - let user choose from the list
        // This ensures the app shows the models list instead of jumping to edit mode
        const selectedModelId = null; // Always start with no model selected

        set({
          models: models.length > 0 ? models : [createNewModel()],
          productionOrders: orders,
          productionLines: lines,
          productionBatches: batches,
          qualityChecks: checks,
          isDarkMode,
          isLoading: false,
          selectedModelId: selectedModelId,
          hasUnsavedChanges: false
        });

        console.log('🔥 DATOS CARGADOS COMPLETAMENTE. Modelo seleccionado:', selectedModelId);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to local data if Firebase fails
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
        set({
          models: [createNewModel()],
          isDarkMode: savedDarkMode,
          isLoading: false,
          hasUnsavedChanges: false
        });
      }
    },

    // Getters
           getSelectedModel: () => {
             const state = get();
             if (state.selectedModelId === null) return null;
             return state.models.find(m => m.id === state.selectedModelId) || null;
           },

    // Model management
    createNewModel: () => {
      // First update the local state synchronously
      set((state) => {
        const newModel = createNewModel();
        return {
          models: [...state.models, newModel],
          selectedModelId: newModel.id  // Seleccionar automáticamente el nuevo modelo
        };
      });

      // Get the current state to save the newly created model
      const currentState = get();
      const newModelToSave = currentState.models[currentState.models.length - 1];

      // Then save to Firebase asynchronously (don't block UI)
      modelService.saveModel(newModelToSave).catch(error => {
        console.error('Error saving new model to Firebase:', error);
        // Note: Local state is already updated, Firebase save failed
        // You might want to show a notification to user here
      });
    },

    selectModel: (modelId: string | null) => set(() => ({
      selectedModelId: modelId,
    })),

    // Función para guardar manualmente el modelo seleccionado
    saveCurrentModel: async () => {
      const state = get();
      if (state.selectedModelId === null) {
        console.log('❌ No hay modelo seleccionado para guardar');
        return false;
      }

      const currentModel = state.models.find(m => m.id === state.selectedModelId);
      if (currentModel) {
        console.log('💾 GUARDANDO MANUALMENTE MODELO SELECCIONADO:', currentModel.id);
        try {
          await modelService.saveModel(currentModel);
          console.log('✅ Modelo guardado exitosamente');
          // Resetear el flag de cambios sin guardar
          set({ hasUnsavedChanges: false });
          return true;
        } catch (error) {
          console.error('❌ Error guardando modelo:', error);
          return false;
        }
      }
      return false;
    },

    deleteModel: (modelId) => {
      // First update the local state synchronously
      set((state) => ({
        models: state.models.filter(m => m.id !== modelId),
        selectedModelId: state.selectedModelId === modelId ? null : state.selectedModelId,
      }));

      // Then delete from Firebase asynchronously (don't block UI)
      modelService.deleteModel(modelId).catch(error => {
        console.error('Error deleting model from Firebase:', error);
        // Note: Local state is already updated, Firebase deletion failed
        // You might want to show a notification to user here
      });
    },

           // Current model operations (work on selected model)
           setHeaderField: (field, value) => set((state) => {
             if (state.selectedModelId === null) {
               return state;
             }

      const updatedModels = state.models.map(model =>
        model.id === state.selectedModelId
          ? {
              ...model,
              header: { ...model.header, [field]: value, lastModified: new Date().toISOString() }
            }
          : model
      );

      // Marcar que hay cambios sin guardar
      const hasUnsavedChanges = !['moldCode', 'client', 'color', 'requestedPairs', 'designer', 'season'].includes(field);

      // Guardar inmediatamente en Firebase para campos críticos
      const updatedModel = updatedModels.find(m => m.id === state.selectedModelId);
      if (updatedModel && ['moldCode', 'client', 'color', 'requestedPairs', 'designer', 'season'].includes(field)) {
        console.log(`💾 Guardando campo ${field} en Firebase inmediatamente...`);
        // Guardar inmediatamente sin delay para campos críticos
        saveModelToFirebase(updatedModel);
      }

      return { models: updatedModels, hasUnsavedChanges };
    }),

           addMaterial: () => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, materials: [...model.materials, createNewMaterial()] }
            : model
        ),
      };
    }),

           updateMaterial: (id, field, value) => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                materials: model.materials.map(m => m.id === id ? { ...m, [field]: value } : m)
              }
            : model
        ),
      };
    }),

           setMaterials: (materials) => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, materials }
            : model
        ),
      };
    }),

           removeMaterial: (id) => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, materials: model.materials.filter(m => m.id !== id) }
            : model
        ),
      };
    }),

           addImages: (newImages) => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, images: [...model.images, ...newImages] }
            : model
        ),
      };
    }),

           removeImage: (index) => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, images: model.images.filter((_, i) => i !== index) }
            : model
        ),
      };
    }),

           setFinancials: (financials) => set((state) => {
             if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, financials }
            : model
        ),
      };
    }),

           loadFromExcel: (data) => set((state) => {
             console.log('📊 CARGANDO DATOS DESDE EXCEL:', data);

             let newModels = [...state.models];
             let newSelectedModelId = state.selectedModelId;

             // Si no hay modelo seleccionado, crear uno nuevo
             if (state.selectedModelId === null) {
               console.log('📝 No hay modelo seleccionado, creando uno nuevo...');
               const newModel = createNewModel();
               newModels.push(newModel);
               newSelectedModelId = newModel.id;
             }

             const targetModelId = newSelectedModelId || state.selectedModelId;
             console.log('🎯 Aplicando datos al modelo:', targetModelId);

             const newMaterials = data.materials.map(m => ({
               ...createNewMaterial(),
               ...m,
               id: uuidv4(),
             }));

             const updatedModels = newModels.map(model =>
               model.id === targetModelId
                 ? {
                     ...model,
                     header: { ...model.header, ...data.header },
                     materials: newMaterials.length > 0 ? newMaterials : [createNewMaterial()],
                     images: [...model.images, ...data.images],
                   }
                 : model
             );

             console.log('✅ Datos aplicados exitosamente al modelo');

             // Guardar inmediatamente en Firebase después de importar Excel
             const modelToSave = updatedModels.find(m => m.id === targetModelId);
             if (modelToSave) {
               console.log('💾 Guardando modelo importado en Firebase...');
               // Forzar guardado síncrono para importación
               modelService.saveModel(modelToSave).then(() => {
                 console.log('✅ Modelo importado guardado exitosamente');
               }).catch(error => {
                 console.error('❌ Error guardando modelo importado:', error);
               });
             }

             return {
               models: updatedModels,
               selectedModelId: newSelectedModelId
             };
           }),

    toggleDarkMode: () => {
      const newDarkMode = !get().isDarkMode;

      // Aplicar la clase al elemento html para que Tailwind funcione
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Update state synchronously
      set({ isDarkMode: newDarkMode });

      // Save to Firebase (async, don't wait)
      userSettingsService.saveSetting('darkMode', newDarkMode).catch(error => {
        console.error('Error saving dark mode to Firebase:', error);
        // Fallback to localStorage
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      });
    },

    // Nuevas funcionalidades de ingeniería
    updateProductionRoute: (route) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, productionRoute: route }
            : model
        ),
      };
    }),

    addProductionOperation: () => set((state) => {
      if (state.selectedModelId === null) return state;
      const newOperation: ProductionOperation = {
        id: uuidv4(),
        name: '',
        description: '',
        sequence: 0,
        department: '',
        machine: '',
        standardTime: 0,
        setupTime: 0,
        skillLevel: 'basic',
        qualityChecks: [],
      };
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                productionRoute: {
                  ...model.productionRoute,
                  operations: [...model.productionRoute.operations, newOperation]
                }
              }
            : model
        ),
      };
    }),

    updateProductionOperation: (id, field, value) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                productionRoute: {
                  ...model.productionRoute,
                  operations: model.productionRoute.operations.map(op =>
                    op.id === id ? { ...op, [field]: value } : op
                  )
                }
              }
            : model
        ),
      };
    }),

    removeProductionOperation: (id) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                productionRoute: {
                  ...model.productionRoute,
                  operations: model.productionRoute.operations.filter(op => op.id !== id)
                }
              }
            : model
        ),
      };
    }),

    updateTechnicalSpecifications: (specs) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, technicalSpecifications: specs }
            : model
        ),
      };
    }),

    createNewVersion: (changes, createdBy) => set((state) => {
      if (state.selectedModelId === null) return state;
      const currentModel = state.models.find(m => m.id === state.selectedModelId);
      if (!currentModel) return state;

      const currentVersion = parseFloat(currentModel.header.version);
      const newVersion = (currentVersion + 0.1).toFixed(1);

      const newVersionEntry: ModelVersion = {
        id: uuidv4(),
        version: newVersion,
        createdAt: new Date().toISOString(),
        createdBy,
        changes,
        status: 'draft' as const,
      };

      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                header: {
                  ...model.header,
                  version: newVersion,
                  lastModified: new Date().toISOString(),
                },
                versions: [...model.versions, newVersionEntry]
              }
            : model
        ),
      };
    }),

    approveVersion: (versionId, approvedBy) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                versions: model.versions.map(v =>
                  v.id === versionId
                    ? { ...v, approvedBy, approvedAt: new Date().toISOString(), status: 'approved' as const }
                    : v
                )
              }
            : model
        ),
      };
    }),

    addDocument: (documentUrl) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, documents: [...model.documents, documentUrl] }
            : model
        ),
      };
    }),

    removeDocument: (index) => set((state) => {
      if (state.selectedModelId === null) return state;
      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? { ...model, documents: model.documents.filter((_, i) => i !== index) }
            : model
        ),
      };
    }),

    // Production module functions
    createProductionOrder: (modelId, quantity, startDate) => set((state) => {
      const now = new Date();
      const orderNumber = `PO-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${(state.productionOrders.length + 1).toString().padStart(3, '0')}`;

      const newOrder: ProductionOrder = {
        id: uuidv4(),
        modelId,
        orderNumber,
        quantity,
        startDate,
        status: 'planned',
        priority: 'medium',
        progress: 0,
        notes: '',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      return {
        productionOrders: [...state.productionOrders, newOrder],
      };
    }),

    updateProductionOrder: (id, updates) => set((state) => ({
      productionOrders: state.productionOrders.map(order =>
        order.id === id
          ? { ...order, ...updates, updatedAt: new Date().toISOString() }
          : order
      ),
    })),

    deleteProductionOrder: (id) => set((state) => ({
      productionOrders: state.productionOrders.filter(order => order.id !== id),
    })),

    createProductionLine: (name, capacity) => set((state) => {
      const newLine: ProductionLine = {
        id: uuidv4(),
        name,
        description: '',
        capacity,
        status: 'active',
        efficiency: 85,
      };

      return {
        productionLines: [...state.productionLines, newLine],
      };
    }),

    updateProductionLine: (id, updates) => set((state) => ({
      productionLines: state.productionLines.map(line =>
        line.id === id ? { ...line, ...updates } : line
      ),
    })),

    deleteProductionLine: (id) => set((state) => ({
      productionLines: state.productionLines.filter(line => line.id !== id),
    })),

    assignOrderToLine: (orderId, lineId) => set((state) => ({
      productionOrders: state.productionOrders.map(order =>
        order.id === orderId ? { ...order, assignedTo: lineId || undefined } : order
      ),
      productionLines: state.productionLines.map(line =>
        line.currentOrder === orderId ? { ...line, currentOrder: lineId ? orderId : undefined } : line
      ),
    })),

    createProductionBatch: (orderId, quantity) => set((state) => {
      const order = state.productionOrders.find(o => o.id === orderId);
      if (!order) return state;

      const now = new Date();
      const batchNumber = `B-${order.orderNumber}-${(state.productionBatches.filter(b => b.productionOrderId === orderId).length + 1).toString().padStart(2, '0')}`;

      const newBatch: ProductionBatch = {
        id: uuidv4(),
        productionOrderId: orderId,
        batchNumber,
        quantity,
        startDate: now.toISOString(),
        status: 'pending',
        qualityStatus: 'pending',
        notes: '',
      };

      return {
        productionBatches: [...state.productionBatches, newBatch],
      };
    }),

    updateProductionBatch: (id, updates) => set((state) => ({
      productionBatches: state.productionBatches.map(batch =>
        batch.id === id ? { ...batch, ...updates } : batch
      ),
    })),

    deleteProductionBatch: (id) => set((state) => ({
      productionBatches: state.productionBatches.filter(batch => batch.id !== id),
    })),

    addQualityCheck: (batchId, operationId, inspector, status) => set((state) => {
      const newCheck: QualityCheck = {
        id: uuidv4(),
        batchId,
        operationId,
        inspector,
        timestamp: new Date().toISOString(),
        status,
        defects: [],
        notes: '',
      };

      return {
        qualityChecks: [...state.qualityChecks, newCheck],
      };
    }),

    // Production calculations
    getCapacityVsDemand: () => {
      const state = get();
      return state.productionLines.map(line => {
        // Calcular demanda total asignada a esta línea
        const assignedOrders = state.productionOrders.filter(order => order.assignedTo === line.id);
        const totalDemand = assignedOrders.reduce((sum, order) => sum + order.quantity, 0);

        // Calcular capacidad semanal (asumiendo 5 días laborales)
        const weeklyCapacity = line.capacity * 5;

        // Calcular utilización
        const utilization = weeklyCapacity > 0 ? (totalDemand / weeklyCapacity) * 100 : 0;

        // Determinar estado
        let status: 'under' | 'optimal' | 'overloaded' = 'optimal';
        if (utilization < 70) status = 'under';
        else if (utilization > 110) status = 'overloaded';

        return {
          lineId: line.id,
          lineName: line.name,
          capacity: weeklyCapacity,
          demand: totalDemand,
          utilization: Math.round(utilization * 100) / 100,
          status
        };
      });
    },

    getOperationEfficiency: () => {
      const state = get();
      const operationStats: { [key: string]: { totalTime: number; count: number; targetTime: number; name: string } } = {};

      // Recopilar datos de operaciones completadas
      state.productionBatches.forEach(batch => {
        if (batch.status === 'completed') {
          const order = state.productionOrders.find(o => o.id === batch.productionOrderId);
          if (order) {
            const model = state.models.find(m => m.id === order.modelId);
            if (model) {
              model.productionRoute.operations.forEach(op => {
                if (!operationStats[op.id]) {
                  operationStats[op.id] = {
                    totalTime: 0,
                    count: 0,
                    targetTime: op.standardTime + op.setupTime,
                    name: op.name
                  };
                }
                // Simular tiempo real basado en eficiencia de línea
                const line = state.productionLines.find(l => l.id === order.assignedTo);
                const efficiency = line ? line.efficiency / 100 : 0.85;
                const actualTime = (op.standardTime + op.setupTime) / efficiency;

                operationStats[op.id].totalTime += actualTime;
                operationStats[op.id].count += 1;
              });
            }
          }
        }
      });

      return Object.entries(operationStats).map(([operationId, stats]) => ({
        operationId,
        operationName: stats.name,
        efficiency: stats.count > 0 ? Math.round((stats.targetTime / (stats.totalTime / stats.count)) * 100 * 100) / 100 : 0,
        avgTime: stats.count > 0 ? Math.round((stats.totalTime / stats.count) * 100) / 100 : 0,
        targetTime: stats.targetTime
      }));
    },

    getCostPerHour: () => {
      const state = get();
      return state.productionLines.map(line => {
        // Calcular costo por hora basado en mano de obra y gastos
        // Asumir costo de mano de obra promedio por hora
        const hourlyLaborCost = 50; // MXN por hora (configurable)
        const hourlyOverheadCost = 25; // MXN por hora (configurable)

        const costPerHour = hourlyLaborCost + hourlyOverheadCost;
        const hourlyCapacity = Math.round((line.capacity / 8) * 100) / 100; // pares por hora (8 horas/día)

        return {
          lineId: line.id,
          lineName: line.name,
          costPerHour,
          hourlyCapacity
        };
      });
    },

    getLineROI: () => {
      const state = get();
      return state.productionLines.map(line => {
        // Calcular ingresos por línea
        const lineOrders = state.productionOrders.filter(order => order.assignedTo === line.id && order.status === 'completed');
        const revenue = lineOrders.reduce((sum, order) => {
          const model = state.models.find(m => m.id === order.modelId);
          return sum + (model ? model.financials.clientPrice * order.quantity : 0);
        }, 0);

        // Calcular costos por línea
        const costs = lineOrders.reduce((sum, order) => {
          const model = state.models.find(m => m.id === order.modelId);
          return sum + (model ? model.financials.totalCost * order.quantity : 0);
        }, 0);

        const roi = costs > 0 ? Math.round(((revenue - costs) / costs) * 100 * 100) / 100 : 0;

        return {
          lineId: line.id,
          lineName: line.name,
          roi,
          revenue: Math.round(revenue * 100) / 100,
          costs: Math.round(costs * 100) / 100
        };
      });
    },

    getBottlenecks: () => {
      const state = get();
      const bottlenecks: { type: 'line' | 'operation'; id: string; name: string; severity: 'low' | 'medium' | 'high'; description: string }[] = [];

      // Analizar cuellos de botella en líneas
      const capacityData = state.getCapacityVsDemand();
      capacityData.forEach(line => {
        if (line.status === 'overloaded') {
          bottlenecks.push({
            type: 'line',
            id: line.lineId,
            name: line.lineName,
            severity: line.utilization > 150 ? 'high' : 'medium',
            description: `Línea sobrecargada: ${line.utilization}% de utilización (${line.demand}/${line.capacity} pares/semana)`
          });
        }
      });

      // Analizar cuellos de botella en operaciones
      const operationData = state.getOperationEfficiency();
      operationData.forEach(op => {
        if (op.efficiency < 70) {
          bottlenecks.push({
            type: 'operation',
            id: op.operationId,
            name: op.operationName,
            severity: op.efficiency < 50 ? 'high' : 'medium',
            description: `Operación ineficiente: ${op.efficiency}% eficiencia (${op.avgTime}min vs ${op.targetTime}min objetivo)`
          });
        }
      });

      return bottlenecks.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    },

    // Materials calculations
    getSupplierAnalysis: () => {
      const state = get();
      const supplierStats: { [key: string]: { materials: Material[]; totalValue: number; totalLeadTime: number; qualityScore: number } } = {};

      // Recopilar datos por proveedor
      state.models.forEach(model => {
        model.materials.forEach(material => {
          if (!supplierStats[material.provider]) {
            supplierStats[material.provider] = {
              materials: [],
              totalValue: 0,
              totalLeadTime: 0,
              qualityScore: 85 // Score base, se puede ajustar con datos reales
            };
          }
          supplierStats[material.provider].materials.push(material);
          supplierStats[material.provider].totalValue += material.totalBudget;
          supplierStats[material.provider].totalLeadTime += material.leadTime || 7; // Default 7 días
        });
      });

      return Object.entries(supplierStats).map(([supplier, stats]) => {
        const avgPrice = stats.materials.reduce((sum, m) => sum + m.netPrice, 0) / stats.materials.length;
        const avgLeadTime = stats.totalLeadTime / stats.materials.length;

        // Lógica de recomendación basada en precio, tiempo de entrega y calidad
        let recommendation: 'preferred' | 'alternative' | 'avoid' = 'alternative';
        if (avgPrice < 50 && avgLeadTime < 10 && stats.qualityScore > 90) {
          recommendation = 'preferred';
        } else if (avgPrice > 100 || avgLeadTime > 20 || stats.qualityScore < 70) {
          recommendation = 'avoid';
        }

        return {
          supplier,
          totalMaterials: stats.materials.length,
          avgPrice: Math.round(avgPrice * 100) / 100,
          avgLeadTime: Math.round(avgLeadTime * 100) / 100,
          qualityScore: stats.qualityScore,
          totalValue: Math.round(stats.totalValue * 100) / 100,
          recommendation
        };
      }).sort((a, b) => b.totalValue - a.totalValue);
    },

    getInventoryAlerts: () => {
      const state = get();
      const alerts: { materialId: string; materialName: string; currentStock: number; requiredStock: number; status: 'critical' | 'low' | 'normal'; daysToDepletion: number }[] = [];

      state.models.forEach(model => {
        model.materials.forEach(material => {
          // Simular stock actual (en producción real vendría de un sistema ERP)
          const currentStock = Math.floor(Math.random() * material.requiredToBuy * 2); // Simulación
          const requiredStock = material.requiredToBuy * 1.2; // 20% buffer
          const consumptionRate = material.consumptionPerPair * model.header.requestedPairs / 30; // diario
          const daysToDepletion = consumptionRate > 0 ? Math.floor(currentStock / consumptionRate) : 30;

          let status: 'critical' | 'low' | 'normal' = 'normal';
          if (currentStock < material.minimumOrder) {
            status = 'critical';
          } else if (currentStock < requiredStock * 0.5) {
            status = 'low';
          }

          if (status !== 'normal') {
            alerts.push({
              materialId: material.id,
              materialName: material.description,
              currentStock: Math.round(currentStock * 100) / 100,
              requiredStock: Math.round(requiredStock * 100) / 100,
              status,
              daysToDepletion
            });
          }
        });
      });

      return alerts.sort((a, b) => {
        const statusOrder = { critical: 3, low: 2, normal: 1 };
        return statusOrder[b.status] - statusOrder[a.status];
      });
    },

    getABCAnalysis: () => {
      const state = get();
      const materialValues: { materialId: string; materialName: string; annualConsumption: number; annualValue: number }[] = [];

      // Calcular consumo y valor anual por material
      state.models.forEach(model => {
        const annualProduction = model.header.requestedPairs * 12; // Asumir producción mensual
        model.materials.forEach(material => {
          const annualConsumption = material.consumptionPerPair * annualProduction;
          const annualValue = material.netPrice * annualConsumption;

          materialValues.push({
            materialId: material.id,
            materialName: material.description,
            annualConsumption: Math.round(annualConsumption * 100) / 100,
            annualValue: Math.round(annualValue * 100) / 100
          });
        });
      });

      // Ordenar por valor anual descendente
      materialValues.sort((a, b) => b.annualValue - a.annualValue);

      // Calcular porcentajes acumulados y clasificar
      const totalValue = materialValues.reduce((sum, m) => sum + m.annualValue, 0);
      let cumulativePercentage = 0;

      return materialValues.map(material => {
        cumulativePercentage += (material.annualValue / totalValue) * 100;
        let category: 'A' | 'B' | 'C' = 'C';
        if (cumulativePercentage <= 80) category = 'A';
        else if (cumulativePercentage <= 95) category = 'B';

        return {
          ...material,
          category,
          percentage: Math.round((material.annualValue / totalValue) * 100 * 100) / 100
        };
      });
    },

    getPurchaseRecommendations: () => {
      const state = get();
      const recommendations: { type: 'consolidate' | 'switch_supplier' | 'bulk_purchase' | 'emergency_order'; materials: string[]; savings: number; description: string; priority: 'high' | 'medium' | 'low' }[] = [];

      // 1. Recomendaciones de consolidación de compras
      const supplierGroups = state.models.reduce((groups, model) => {
        model.materials.forEach(material => {
          if (!groups[material.provider]) groups[material.provider] = [];
          groups[material.provider].push(material.description);
        });
        return groups;
      }, {} as { [supplier: string]: string[] });

      Object.entries(supplierGroups).forEach(([supplier, materials]) => {
        if (materials.length >= 3) {
          recommendations.push({
            type: 'consolidate',
            materials,
            savings: materials.length * 50, // Ahorro estimado por consolidación
            description: `Consolidar ${materials.length} materiales del proveedor ${supplier}`,
            priority: 'medium'
          });
        }
      });

      // 2. Recomendaciones de cambio de proveedor
      const supplierAnalysis = state.getSupplierAnalysis();
      const expensiveSuppliers = supplierAnalysis.filter(s => s.recommendation === 'avoid');

      expensiveSuppliers.forEach(supplier => {
        const alternative = supplierAnalysis.find(s => s.recommendation === 'preferred');
        if (alternative) {
          recommendations.push({
            type: 'switch_supplier',
            materials: supplierGroups[supplier.supplier] || [],
            savings: supplier.totalValue * 0.15, // 15% de ahorro estimado
            description: `Cambiar de ${supplier.supplier} a ${alternative.supplier} para reducir costos`,
            priority: 'high'
          });
        }
      });

      // 3. Órdenes de emergencia
      const inventoryAlerts = state.getInventoryAlerts();
      const criticalAlerts = inventoryAlerts.filter(alert => alert.status === 'critical');

      if (criticalAlerts.length > 0) {
        recommendations.push({
          type: 'emergency_order',
          materials: criticalAlerts.map(alert => alert.materialName),
          savings: 0, // No hay ahorro, es preventivo
          description: `${criticalAlerts.length} materiales críticos requieren orden inmediata`,
          priority: 'high'
        });
      }

      // 4. Compras al por mayor
      const abcAnalysis = state.getABCAnalysis();
      const aMaterials = abcAnalysis.filter(m => m.category === 'A');

      if (aMaterials.length > 0) {
        recommendations.push({
          type: 'bulk_purchase',
          materials: aMaterials.slice(0, 3).map(m => m.materialName),
          savings: aMaterials.reduce((sum, m) => sum + m.annualValue, 0) * 0.1, // 10% descuento bulk
          description: `Compra al por mayor de materiales categoría A para descuento`,
          priority: 'medium'
        });
      }

      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    },

    getPriceTrends: () => {
      const state = get();
      const trends: { materialId: string; materialName: string; currentPrice: number; avgPrice: number; trend: 'up' | 'down' | 'stable'; changePercent: number; supplier: string }[] = [];

      state.models.forEach(model => {
        model.materials.forEach(material => {
          // Simular datos históricos (en producción vendría de base de datos)
          const basePrice = material.netPrice;
          const historicalPrices = [
            basePrice * (0.95 + Math.random() * 0.1), // Hace 3 meses
            basePrice * (0.95 + Math.random() * 0.1), // Hace 2 meses
            basePrice * (0.95 + Math.random() * 0.1), // Hace 1 mes
            basePrice // Actual
          ];

          const avgPrice = historicalPrices.reduce((sum, price) => sum + price, 0) / historicalPrices.length;
          const changePercent = ((basePrice - avgPrice) / avgPrice) * 100;

          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (Math.abs(changePercent) > 5) {
            trend = changePercent > 0 ? 'up' : 'down';
          }

          trends.push({
            materialId: material.id,
            materialName: material.description,
            currentPrice: Math.round(basePrice * 100) / 100,
            avgPrice: Math.round(avgPrice * 100) / 100,
            trend,
            changePercent: Math.round(changePercent * 100) / 100,
            supplier: material.provider
          });
        });
      });

      return trends.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    },
  }),
  shallow
);
