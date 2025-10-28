
export interface ModelHeader {
  moldCode: string;
  client: string;
  color: string;
  requestedPairs: number;
  designer: string;
  week: number;
  date: string;
  // Nuevos campos técnicos
  category: string; // Categoría: Mujer, Hombre, Niño, etc.
  style: string; // Estilo: Sandalia, Zapato, Bota, etc.
  season: string; // Temporada: Primavera, Verano, Otoño, Invierno
  targetPrice: number; // Precio objetivo
  status: 'draft' | 'review' | 'approved' | 'production' | 'discontinued'; // Estado del modelo
  version: string; // Versión del diseño
  lastModified: string; // Última modificación
}

export interface Material {
  id: string; // Unique ID for each material row
  description: string;
  technicalName: string;
  color: string; // Color del material
  provider: string;
  priceWithoutVAT: number;
  netPrice: number;
  purchaseUnit: string;
  width: number;
  consumptionPerPair: number;
  consumptionUnit: string;
  requiredToBuy: number;
  costPerPair: number;
  totalBudget: number;
  minimumOrder: number; // Pedido mínimo / Unidad orden de compra
  oc: boolean; // Orden de Compra
  comprado: boolean; // Estado de compra
  // Nuevos campos técnicos
  materialType: 'upper' | 'sole' | 'lining' | 'insole' | 'heel' | 'accessory' | 'packaging'; // Tipo de material
  specifications: string; // Especificaciones técnicas
  alternativeProviders: string[]; // Proveedores alternativos
  leadTime: number; // Tiempo de entrega en días
}

export interface Financials {
  directMaterials: number;
  directLabor: number;
  manufacturingExpenses: number;
  totalCost: number;
  clientPrice: number;
  profitOrLoss: number;
}

export interface ProductionOperation {
  id: string;
  name: string; // Nombre de la operación (Corte, Pegado, Ensamblaje, etc.)
  description: string;
  sequence: number; // Orden en la ruta
  department: string; // Departamento responsable
  machine: string; // Máquina o equipo requerido
  standardTime: number; // Tiempo estándar en minutos por par
  setupTime: number; // Tiempo de preparación en minutos
  skillLevel: 'basic' | 'intermediate' | 'advanced'; // Nivel de habilidad requerido
  qualityChecks: string[]; // Puntos de control de calidad
}

export interface ProductionRoute {
  id: string;
  name: string;
  operations: ProductionOperation[];
  totalTime: number; // Tiempo total calculado
  efficiency: number; // Eficiencia esperada (%)
  notes: string;
}

export interface TechnicalSpecifications {
  id: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight: {
    target: number;
    tolerance: number;
    unit: string;
  };
  qualityStandards: string[];
  testingRequirements: string[];
  packagingSpecifications: string;
  careInstructions: string;
  certifications: string[]; // Certificaciones requeridas
}

export interface ModelVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string; // Descripción de cambios
  approvedBy?: string;
  approvedAt?: string;
  status: 'draft' | 'approved' | 'rejected';
}

// Interfaces para el módulo de Producción
export interface ProductionOrder {
  id: string;
  modelId: string;
  orderNumber: string;
  quantity: number;
  startDate: string;
  endDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // Línea de producción o supervisor
  progress: number; // Porcentaje completado
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionBatch {
  id: string;
  productionOrderId: string;
  batchNumber: string;
  quantity: number;
  startDate: string;
  endDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  qualityStatus: 'pending' | 'approved' | 'rejected';
  defects?: number;
  notes: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  description: string;
  capacity: number; // Capacidad por día
  status: 'active' | 'maintenance' | 'inactive';
  assignedModel?: string;
  currentOrder?: string;
  efficiency: number; // Eficiencia promedio
}

export interface QualityCheck {
  id: string;
  batchId: string;
  operationId: string;
  inspector: string;
  timestamp: string;
  status: 'pass' | 'fail';
  defects: Array<{
    type: string;
    quantity: number;
    severity: 'minor' | 'major' | 'critical';
  }>;
  notes: string;
}

export interface ProductionSchedule {
  id: string;
  week: number;
  year: number;
  lineId: string;
  orders: Array<{
    orderId: string;
    day: number; // 1-7 (lunes-domingo)
    startTime: string;
    endTime: string;
    quantity: number;
  }>;
}

export interface Model {
  id: string;
  header: ModelHeader;
  materials: Material[];
  images: string[]; // Array of base64 data URLs
  financials: Financials;
  // Nuevas estructuras
  productionRoute: ProductionRoute;
  technicalSpecifications: TechnicalSpecifications;
  versions: ModelVersion[];
  documents: string[]; // URLs o IDs de documentos técnicos
}

export interface ParsedExcelData {
    header: Partial<ModelHeader>;
    materials: Partial<Material>[];
    images: string[];
}
