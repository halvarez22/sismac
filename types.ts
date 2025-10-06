// types.ts

// From Dashboard & related
export type SupplierPerformance = {
    id: number;
    name: string;
    phone: string;
    email: string;
    otd: number;
    quality: number;
    iaRecommendation: 'Óptimo' | 'Recomendado' | 'Considerar';
};

export type MaterialAlert = {
    id: number;
    name: string;
    coverageDays: number;
    priority: 'High' | 'Medium' | 'Low';
};

export type MonthlyData = {
    month: string;
    value: number;
};

export type WasteData = {
    month: string;
    proyectado: number;
    real: number;
};

export type SalesForecastData = {
    month: string;
    forecast: number;
    confidenceInterval: [number, number];
};

export type SupplierRiskAlert = {
    id: number;
    riskTitle: string;
    supplierImpacted: string;
    potentialImpact: string;
    mitigation: string;
    severity: 'Alta' | 'Media' | 'Baja';
    historicalData: string;
    affectedMetrics: { metric: string; currentValue: string; expectedImpact: string }[];
    granularMitigation: string[];
};

export type PurchaseHistoryItem = {
    orderId: string;
    supplierName: string;
    orderDate: string;
    material: string;
    quantity: number;
    unit: string;
    totalCost: number;
};

// From AI Analytics
export interface AiInsight {
    category: string;
    insight: string;
}

// From Abastecimiento / CreatePurchaseOrderModal
export type PurchaseOrderStatus = 'Borrador' | 'Enviada' | 'Recibida Parcialmente' | 'Recibida Completa' | 'Cancelada';

export interface PurchaseOrderItem {
    material: string;
    quantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
}

export interface PurchaseOrder {
    id: string;
    supplierName: string;
    createdDate: string;
    expectedDate: string;
    status: PurchaseOrderStatus;
    items: PurchaseOrderItem[];
    totalCost: number;
}

export interface PurchaseSuggestion {
    id: number;
    materialId: string;
    materialName: string;
    quantityNeeded: number;
    unit: string;
    recommendedSupplier: string;
    sourceProductionOrderId: string;
}


// From Almacen
export type InventoryStatus = 'OK' | 'Bajo' | 'Crítico' | 'Exceso';

export type MaterialInventory = {
    id: string; // SKU
    name: string;
    category: 'Pieles' | 'Suelas' | 'Herrajes' | 'Textiles' | 'Químicos';
    quantity: number;
    unit: string;
    location: string;
    unitCost: number;
    totalValue: number;
    reorderPoint: number;
    lastMovementDate: string;
    status: InventoryStatus;
};

export type InventoryMovement = {
    id: number;
    date: string;
    type: 'Entrada' | 'Salida' | 'Ajuste';
    materialId: string;
    materialName: string;
    quantity: number;
    referenceId: string;
    user: string;
};


// From Planificacion / ProductionOrderModal
export type ProductionOrderStatus = 'Pendiente' | 'En Progreso' | 'Completada' | 'Retrasada';

export interface ProductModel {
    id: string;
    name: string;
    description?: string;
    category?: string;
    targetCost?: number;
    notes?: string;
    bom: {
        materialSku: string;
        quantityPerUnit: number; // e.g., 0.3 m² per pair, 2 pzas per pair
    }[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductionOrder {
    id: string;
    productModel: string;
    productModelId: string;
    quantity: number;
    requiredDate: string;
    status: ProductionOrderStatus;
    assignedTo?: string;
    materials: {
        sku: string;
        name: string;
        required: number;
        unit: string;
    }[];
    suggestionStatus?: 'generated';
}

// From Contabilidad
export type InvoiceStatus = 'Pagada' | 'Pendiente' | 'Vencida';
export type InvoiceType = 'Por Cobrar' | 'Por Pagar';

export interface Invoice {
    id: string;
    type: InvoiceType;
    counterpartName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}

export interface MonthlyFinancials {
    month: string;
    ingresos: number;
    gastos: number;
    beneficio: number;
}

export interface ExpenseDistribution {
    category: string;
    value: number;
}

// From Admin / User Management
export type Role = 'Administrador' | 'Gerente' | 'Comprador' | 'Almacenista' | 'Planificador' | 'Ingeniero de Producto';

export interface User {
    id: number;
    displayName: string;
    username: string;
    password?: string;
    role: Role;
    status: 'Activo' | 'Inactivo';
    avatarUrl: string;
}