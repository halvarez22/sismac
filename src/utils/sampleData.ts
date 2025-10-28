import { Model, ProductionOrder, ProductionLine, ProductionBatch, QualityCheck } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Datos de ejemplo para testing
export const sampleModels: Model[] = [
  {
    id: uuidv4(),
    header: {
      moldCode: 'ZM001',
      client: 'COPPEL',
      color: 'NEGRO',
      requestedPairs: 1200,
      designer: 'Ana García',
      week: 45,
      date: '2024-11-15',
      category: 'Mujer',
      style: 'Sandalia',
      season: 'Verano',
      targetPrice: 250,
      status: 'approved',
      version: '1.2',
      lastModified: '2024-11-15T10:30:00Z'
    },
    materials: [
      {
        id: uuidv4(),
        description: 'Cuero vacuno negro',
        technicalName: 'Cuero bovino curtido vegetal',
        color: 'Negro',
        provider: 'Pieles Mexicanas SA',
        priceWithoutVAT: 45.00,
        netPrice: 42.00,
        purchaseUnit: 'metros',
        width: 1.4,
        consumptionPerPair: 0.8,
        consumptionUnit: 'metros',
        requiredToBuy: 960,
        costPerPair: 33.60,
        totalBudget: 40320.00,
        minimumOrder: 100,
        oc: false,
        comprado: false,
        materialType: 'upper',
        specifications: 'Cuero full grain, 1.2-1.4mm espesor',
        alternativeProviders: ['Cuero Plus', 'Pieles del Norte'],
        leadTime: 7
      },
      {
        id: uuidv4(),
        description: 'Suela de goma EVA',
        technicalName: 'EVA expandida anti-deslizante',
        color: 'Negro',
        provider: 'Suelas Industriales',
        priceWithoutVAT: 8.50,
        netPrice: 8.00,
        purchaseUnit: 'pares',
        width: 0,
        consumptionPerPair: 1,
        consumptionUnit: 'pares',
        requiredToBuy: 1200,
        costPerPair: 8.00,
        totalBudget: 9600.00,
        minimumOrder: 500,
        oc: true,
        comprado: true,
        materialType: 'sole',
        specifications: 'Densidad 25-30 PCF, antideslizante',
        alternativeProviders: ['Suelas Premium', 'GomaTech'],
        leadTime: 5
      }
    ],
    images: [],
    financials: {
      directMaterials: 41.60,
      directLabor: 15.50,
      manufacturingExpenses: 8.90,
      totalCost: 66.00,
      clientPrice: 250.00,
      profitOrLoss: 184.00
    },
    productionRoute: {
      id: uuidv4(),
      name: 'Ruta Sandalias Verano',
      operations: [
        {
          id: uuidv4(),
          name: 'Corte de cuero',
          description: 'Cortar piezas según patrón',
          sequence: 1,
          department: 'Corte',
          machine: 'Máquina cortadora laser',
          standardTime: 5,
          setupTime: 10,
          skillLevel: 'basic',
          qualityChecks: ['Medidas correctas', 'Sin defectos']
        },
        {
          id: uuidv4(),
          name: 'Pegado de suela',
          description: 'Unir suela con parte superior',
          sequence: 2,
          department: 'Montaje',
          machine: 'Prensa de pegado',
          standardTime: 8,
          setupTime: 5,
          skillLevel: 'intermediate',
          qualityChecks: ['Adherencia perfecta', 'Alineación']
        }
      ],
      totalTime: 13,
      efficiency: 85,
      notes: 'Proceso estándar para sandalias planas'
    },
    technicalSpecifications: {
      id: uuidv4(),
      dimensions: {
        length: 24,
        width: 8,
        height: 2,
        unit: 'cm'
      },
      weight: {
        target: 180,
        tolerance: 10,
        unit: 'g'
      },
      qualityStandards: [
        'ISO 9001:2015',
        'Resistente al desgaste',
        'Impermeable'
      ],
      testingRequirements: [
        'Prueba de flexión 10,000 ciclos',
        'Prueba de impermeabilidad 2 horas',
        'Prueba de durabilidad suela'
      ],
      packagingSpecifications: 'Caja individual con bolsa protectora',
      careInstructions: 'Lavar con agua fría, no usar secadora',
      certifications: ['Certificado de calidad', 'Amigable con el medio ambiente']
    },
    versions: [
      {
        id: uuidv4(),
        version: '1.0',
        createdAt: '2024-11-10T09:00:00Z',
        createdBy: 'Ana García',
        changes: 'Diseño inicial',
        status: 'approved'
      },
      {
        id: uuidv4(),
        version: '1.2',
        createdAt: '2024-11-15T10:30:00Z',
        createdBy: 'Carlos López',
        changes: 'Optimización de costos, cambio de proveedor de suela',
        status: 'approved'
      }
    ],
    documents: []
  },
  {
    id: uuidv4(),
    header: {
      moldCode: 'ZH002',
      client: 'LIVERPOOL',
      color: 'AZUL MARINO',
      requestedPairs: 800,
      designer: 'Carlos López',
      week: 46,
      date: '2024-11-20',
      category: 'Hombre',
      style: 'Zapato',
      season: 'Invierno',
      targetPrice: 450,
      status: 'review',
      version: '1.0',
      lastModified: '2024-11-20T14:15:00Z'
    },
    materials: [
      {
        id: uuidv4(),
        description: 'Cuero vacuno azul marino',
        technicalName: 'Cuero bovino full grain',
        color: 'Azul marino',
        provider: 'Cuero Premium',
        priceWithoutVAT: 65.00,
        netPrice: 60.00,
        purchaseUnit: 'metros',
        width: 1.5,
        consumptionPerPair: 1.2,
        consumptionUnit: 'metros',
        requiredToBuy: 960,
        costPerPair: 72.00,
        totalBudget: 57600.00,
        minimumOrder: 200,
        oc: false,
        comprado: false,
        materialType: 'upper',
        specifications: 'Cuero full grain premium, 1.4-1.6mm',
        alternativeProviders: ['Pieles Mexicanas SA', 'Cuero Plus'],
        leadTime: 10
      }
    ],
    images: [],
    financials: {
      directMaterials: 72.00,
      directLabor: 25.00,
      manufacturingExpenses: 15.50,
      totalCost: 112.50,
      clientPrice: 450.00,
      profitOrLoss: 337.50
    },
    productionRoute: {
      id: uuidv4(),
      name: 'Ruta Zapatos Hombre',
      operations: [
        {
          id: uuidv4(),
          name: 'Corte y preparación',
          description: 'Corte y preparación de cuero',
          sequence: 1,
          department: 'Corte',
          machine: 'Máquina cortadora',
          standardTime: 8,
          setupTime: 15,
          skillLevel: 'intermediate',
          qualityChecks: ['Precisión de corte', 'Calidad del cuero']
        }
      ],
      totalTime: 8,
      efficiency: 80,
      notes: 'Proceso premium para zapatos de hombre'
    },
    technicalSpecifications: {
      id: uuidv4(),
      dimensions: {
        length: 28,
        width: 10,
        height: 8,
        unit: 'cm'
      },
      weight: {
        target: 350,
        tolerance: 20,
        unit: 'g'
      },
      qualityStandards: ['ISO 9001', 'Resistente al agua', 'Antideslizante'],
      testingRequirements: ['Prueba de resistencia', 'Prueba de comodidad'],
      packagingSpecifications: 'Caja premium con accesorios',
      careInstructions: 'Limpiar con crema específica para cuero',
      certifications: ['Certificado premium', 'Hecho en México']
    },
    versions: [
      {
        id: uuidv4(),
        version: '1.0',
        createdAt: '2024-11-20T14:15:00Z',
        createdBy: 'Carlos López',
        changes: 'Diseño inicial para Liverpool',
        status: 'draft'
      }
    ],
    documents: []
  }
];

export const sampleProductionOrders: ProductionOrder[] = [
  {
    id: uuidv4(),
    modelId: sampleModels[0].id,
    orderNumber: 'PO-20241115-001',
    quantity: 1200,
    startDate: '2024-11-18',
    status: 'in_progress',
    priority: 'high',
    progress: 65,
    notes: 'Orden prioritaria para temporada navideña',
    createdAt: '2024-11-15T08:00:00Z',
    updatedAt: '2024-11-20T10:30:00Z'
  },
  {
    id: uuidv4(),
    modelId: sampleModels[1].id,
    orderNumber: 'PO-20241120-002',
    quantity: 800,
    startDate: '2024-11-25',
    status: 'planned',
    priority: 'medium',
    progress: 0,
    notes: 'Primera orden del modelo nuevo',
    createdAt: '2024-11-20T14:30:00Z',
    updatedAt: '2024-11-20T14:30:00Z'
  }
];

export const sampleProductionLines: ProductionLine[] = [
  {
    id: uuidv4(),
    name: 'Línea A - Sandalias',
    description: 'Línea especializada en sandalias y calzado plano',
    capacity: 300,
    status: 'active',
    efficiency: 85
  },
  {
    id: uuidv4(),
    name: 'Línea B - Zapatos',
    description: 'Línea para zapatos formales y casuales',
    capacity: 200,
    status: 'active',
    efficiency: 78
  },
  {
    id: uuidv4(),
    name: 'Línea C - Mantenimiento',
    description: 'Línea en mantenimiento programado',
    capacity: 0,
    status: 'maintenance',
    efficiency: 0
  }
];

export const sampleProductionBatches: ProductionBatch[] = [
  {
    id: uuidv4(),
    productionOrderId: sampleProductionOrders[0].id,
    batchNumber: 'B-PO-20241115-001-01',
    quantity: 300,
    startDate: '2024-11-18T06:00:00Z',
    status: 'completed',
    qualityStatus: 'approved',
    notes: 'Primera tanda completada exitosamente'
  },
  {
    id: uuidv4(),
    productionOrderId: sampleProductionOrders[0].id,
    batchNumber: 'B-PO-20241115-001-02',
    quantity: 300,
    startDate: '2024-11-19T06:00:00Z',
    status: 'in_progress',
    qualityStatus: 'pending',
    notes: 'En proceso de producción'
  }
];

export const sampleQualityChecks: QualityCheck[] = [
  {
    id: uuidv4(),
    batchId: sampleProductionBatches[0].id,
    operationId: sampleModels[0].productionRoute.operations[0].id,
    inspector: 'María González',
    timestamp: '2024-11-18T14:30:00Z',
    status: 'pass',
    defects: [],
    notes: 'Calidad excelente, sin defectos detectados'
  },
  {
    id: uuidv4(),
    batchId: sampleProductionBatches[0].id,
    operationId: sampleModels[0].productionRoute.operations[1].id,
    inspector: 'José Martínez',
    timestamp: '2024-11-18T16:45:00Z',
    status: 'pass',
    defects: [],
    notes: 'Pegado perfecto, adherencia óptima'
  }
];

// Función para poblar la base de datos con datos de ejemplo
export const populateSampleData = async () => {
  try {
    console.log('Poblando base de datos con datos de ejemplo...');

    // Importar los servicios aquí para evitar dependencias circulares
    const { modelService, productionOrderService, productionLineService, productionBatchService, qualityCheckService } = await import('../services/firebaseService');

    // Guardar modelos
    for (const model of sampleModels) {
      await modelService.saveModel(model);
      console.log(`Modelo guardado: ${model.header.moldCode}`);
    }

    // Guardar órdenes de producción
    for (const order of sampleProductionOrders) {
      await productionOrderService.saveOrder(order);
      console.log(`Orden guardada: ${order.orderNumber}`);
    }

    // Guardar líneas de producción
    for (const line of sampleProductionLines) {
      await productionLineService.saveLine(line);
      console.log(`Línea guardada: ${line.name}`);
    }

    // Guardar lotes de producción
    for (const batch of sampleProductionBatches) {
      await productionBatchService.saveBatch(batch);
      console.log(`Lote guardado: ${batch.batchNumber}`);
    }

    // Guardar controles de calidad
    for (const check of sampleQualityChecks) {
      await qualityCheckService.saveCheck(check);
      console.log(`Control de calidad guardado: ${check.inspector}`);
    }

    console.log('✅ Base de datos poblada exitosamente!');
    console.log('Datos de ejemplo incluidos:');
    console.log('- 2 modelos de calzado');
    console.log('- 2 órdenes de producción');
    console.log('- 3 líneas de producción');
    console.log('- 2 lotes de producción');
    console.log('- 2 controles de calidad');

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    throw error;
  }
};
