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
}

// Helper function to save model to Firebase
const saveModelToFirebase = async (model: Model) => {
  try {
    await modelService.saveModel(model);
  } catch (error) {
    console.error('Error saving model to Firebase:', error);
    // Don't throw error to avoid blocking UI
  }
};

const createNewMaterial = (): Material => ({
  id: uuidv4(),
  description: '',
  technicalName: '',
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
  // Nuevos campos técnicos
  materialType: 'upper' as const,
  specifications: '',
  alternativeProviders: [],
  minimumOrder: 0,
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
  productionOrders: [],
  productionLines: [],
  productionBatches: [],
  qualityChecks: [],
  isLoading: true
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

        // Load all data in parallel
        const [models, orders, lines, batches, checks] = await Promise.all([
          modelService.getAllModels(),
          productionOrderService.getAllOrders(),
          productionLineService.getAllLines(),
          productionBatchService.getAllBatches(),
          qualityCheckService.getAllChecks()
        ]);

        console.log('Loaded models from Firebase:', models.length, models.map(m => ({id: m.id, type: typeof m.id})));

        // Apply dark mode
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        set({
          models: models.length > 0 ? models : [createNewModel()],
          productionOrders: orders,
          productionLines: lines,
          productionBatches: batches,
          qualityChecks: checks,
          isDarkMode,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to local data if Firebase fails
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
        set({
          models: [createNewModel()],
          isDarkMode: savedDarkMode,
          isLoading: false
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
    createNewModel: () => set(async (state) => {
      console.log('Creating new model...');
      const newModel = createNewModel();
      console.log('New model created:', newModel.id);
      try {
        await modelService.saveModel(newModel);
        console.log('Model saved to Firebase, updating state...');
        const newState = {
          models: [...state.models, newModel],
          selectedModelId: newModel.id  // Seleccionar automáticamente el nuevo modelo
        };
        console.log('New state:', newState);
        return newState;
      } catch (error) {
        console.error('Error creating model:', error);
        // Still update local state even if Firebase fails
        const newState = {
          models: [...state.models, newModel],
          selectedModelId: newModel.id  // Seleccionar automáticamente el nuevo modelo
        };
        console.log('Fallback state update:', newState);
        return newState;
      }
    }),

    selectModel: (modelId: string | null) => set(() => ({
      selectedModelId: modelId,
    })),

    deleteModel: (modelId) => set(async (state) => {
      console.log('Deleting model:', modelId, 'Type:', typeof modelId);
      console.log('Current models before filter:', state.models.map(m => ({id: m.id, type: typeof m.id})));
      console.log('Current selected:', state.selectedModelId, 'Type:', typeof state.selectedModelId);

      const filteredModels = state.models.filter(m => {
        const match = m.id !== modelId;
        console.log(`Comparing ${m.id} (${typeof m.id}) !== ${modelId} (${typeof modelId}) = ${match}`);
        return match;
      });

      console.log('Filtered models count:', filteredModels.length, 'Original count:', state.models.length);

      try {
        await modelService.deleteModel(modelId);
        const newState = {
          models: filteredModels,
          selectedModelId: state.selectedModelId === modelId ? null : state.selectedModelId,
        };
        console.log('Model deleted from Firebase, final state:', newState);
        return newState;
      } catch (error) {
        console.error('Error deleting model from Firebase:', error);
        // Still update local state even if Firebase fails
        const newState = {
          models: filteredModels,
          selectedModelId: state.selectedModelId === modelId ? null : state.selectedModelId,
        };
        console.log('Fallback delete state:', newState);
        return newState;
      }
    }),

           // Current model operations (work on selected model)
           setHeaderField: (field, value) => set((state) => {
             if (state.selectedModelId === null) return state;

      const updatedModels = state.models.map(model =>
        model.id === state.selectedModelId
          ? {
              ...model,
              header: { ...model.header, [field]: value, lastModified: new Date().toISOString() }
            }
          : model
      );

      // Save to Firebase asynchronously
      const updatedModel = updatedModels.find(m => m.id === state.selectedModelId);
      if (updatedModel) {
        saveModelToFirebase(updatedModel);
      }

      return { models: updatedModels };
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
             if (state.selectedModelId === null) return state;

      const newMaterials = data.materials.map(m => ({
        ...createNewMaterial(),
        ...m,
        id: uuidv4(),
      }));

      return {
        models: state.models.map(model =>
          model.id === state.selectedModelId
            ? {
                ...model,
                header: { ...model.header, ...data.header },
                materials: newMaterials.length > 0 ? newMaterials : [createNewMaterial()],
                images: [...model.images, ...data.images],
              }
            : model
        ),
      };
    }),

    toggleDarkMode: () => set(async (state) => {
      const newDarkMode = !state.isDarkMode;

      // Aplicar la clase al elemento html para que Tailwind funcione
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save to Firebase (async, don't wait)
      userSettingsService.saveSetting('darkMode', newDarkMode).catch(error => {
        console.error('Error saving dark mode to Firebase:', error);
        // Fallback to localStorage
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      });

      return { isDarkMode: newDarkMode };
    }),

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
  }),
  shallow
);
