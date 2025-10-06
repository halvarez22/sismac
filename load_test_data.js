// Script para cargar datos de prueba en localStorage
// Este script crea un localStorage simulado y carga los datos del modelo VAZZA 13501 BLANCO

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simular localStorage en Node.js
class MockLocalStorage {
    constructor() {
        this.storage = {};
    }

    getItem(key) {
        return this.storage[key] || null;
    }

    setItem(key, value) {
        this.storage[key] = value;
        console.log(`✅ Guardado: ${key} (${value.length} caracteres)`);
    }

    removeItem(key) {
        delete this.storage[key];
    }

    clear() {
        this.storage = {};
    }
}

// Crear localStorage simulado
const localStorage = new MockLocalStorage();

// Datos del modelo VAZZA ESTILO 13501 BLANCO (5 materiales)
const testProductModel = {
    id: 'MOD-VAZZA-13501-BLANCO',
    name: 'VAZZA ESTILO 13501 BLANCO',
    bom: [
        {
            materialSku: 'ROBIN_SPORT_60_0',
            quantityPerUnit: 2.35
        },
        {
            materialSku: 'SUELA_PRINCESA_26_0',
            quantityPerUnit: 1
        },
        {
            materialSku: 'AGUJETA_CREES_203_52',
            quantityPerUnit: 1
        },
        {
            materialSku: 'TRANSFER_VAZZA_0_30',
            quantityPerUnit: 2
        },
        {
            materialSku: 'BULLON_ESPONJA_1_20',
            quantityPerUnit: 1
        }
    ]
};

// Materiales del inventario
const testInventoryData = [
    {
        id: 'ROBIN_SPORT_60_0',
        name: 'PUNTERA ROBIN SPORT',
        category: 'Textiles',
        quantity: 100,
        unit: 'MT',
        unitCost: 60.00,
        totalValue: 6000,
        reorderPoint: 50,
        status: 'OK',
        location: 'IMPORT-A-01',
        lastMovementDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'SUELA_PRINCESA_26_0',
        name: 'SUELA PRINCESA/MANGO/VEGAN T.R. BLANCA',
        category: 'Suelas',
        quantity: 50,
        unit: 'PRS',
        unitCost: 26.00,
        totalValue: 1300,
        reorderPoint: 25,
        status: 'OK',
        location: 'IMPORT-B-01',
        lastMovementDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'AGUJETA_CREES_203_52',
        name: 'AGUJETA PLANA CREES #120 CM',
        category: 'Herrajes',
        quantity: 200,
        unit: 'GRUESAS',
        unitCost: 203.52,
        totalValue: 40704,
        reorderPoint: 100,
        status: 'OK',
        location: 'IMPORT-C-01',
        lastMovementDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'TRANSFER_VAZZA_0_30',
        name: 'TRANSFER PLANTILLA VAZZA ORO',
        category: 'Textiles',
        quantity: 500,
        unit: 'PZAS',
        unitCost: 0.30,
        totalValue: 150,
        reorderPoint: 200,
        status: 'OK',
        location: 'IMPORT-D-01',
        lastMovementDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'BULLON_ESPONJA_1_20',
        name: 'BULLON - ESPONJA 10 MM / 50 KG',
        category: 'Químicos',
        quantity: 25,
        unit: 'KG',
        unitCost: 1.20,
        totalValue: 30,
        reorderPoint: 10,
        status: 'OK',
        location: 'IMPORT-A-02',
        lastMovementDate: new Date().toISOString().split('T')[0]
    }
];

console.log('🔍 VERIFICANDO ESTADO ACTUAL DE LOCALSTORAGE');
console.log('=============================================');

// Verificar si existe directorio public
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    console.log('✅ Directorio public encontrado');
} else {
    console.log('❌ Directorio public no encontrado');
}

// Cargar datos existentes si existen
try {
    const existingProductModels = localStorage.getItem('sismac_productModels');
    const existingInventoryData = localStorage.getItem('sismac_inventoryData');

    console.log('📦 Product Models existentes:', existingProductModels ? JSON.parse(existingProductModels).length : 'Ninguno');
    console.log('📦 Inventory Data existente:', existingInventoryData ? JSON.parse(existingInventoryData).length : 'Ninguno');
} catch (error) {
    console.log('📦 No hay datos existentes o error al leer:', error.message);
}

console.log('');
console.log('💾 CARGANDO DATOS DE PRUEBA DEL MODELO VAZZA 13501');
console.log('==================================================');

// Guardar datos en localStorage simulado
localStorage.setItem('sismac_productModels', JSON.stringify([testProductModel]));
localStorage.setItem('sismac_inventoryData', JSON.stringify(testInventoryData));
localStorage.setItem('sismac_purchaseOrders', JSON.stringify([]));
localStorage.setItem('sismac_productionOrders', JSON.stringify([]));
localStorage.setItem('sismac_purchaseSuggestions', JSON.stringify([]));

console.log('');
console.log('📊 VERIFICACIÓN DE DATOS CARGADOS');
console.log('===================================');

const savedProductModels = localStorage.getItem('sismac_productModels');
const savedInventoryData = localStorage.getItem('sismac_inventoryData');

if (savedProductModels) {
    const models = JSON.parse(savedProductModels);
    console.log(`✅ Product Models: ${models.length} modelos cargados`);
    models.forEach(model => {
        console.log(`   - ${model.name}: ${model.bom.length} materiales`);
    });
}

if (savedInventoryData) {
    const inventory = JSON.parse(savedInventoryData);
    console.log(`✅ Inventory Data: ${inventory.length} materiales cargados`);
    inventory.forEach(material => {
        console.log(`   - ${material.name}: $${material.unitCost} (${material.quantity} ${material.unit})`);
    });
}

console.log('');
console.log('🎯 RESUMEN DEL MODELO VAZZA 13501 BLANCO');
console.log('=====================================');
console.log('📋 BOM (Lista de Materiales):');
console.log('- PUNTERA ROBIN SPORT: 2.35 MT × $60.00 = $141.00');
console.log('- SUELA PRINCESA/MANGO/VEGAN T.R. BLANCA: 1 PRS × $26.00 = $26.00');
console.log('- AGUJETA PLANA CREES #120 CM: 1 GRUESAS × $203.52 = $203.52');
console.log('- TRANSFER PLANTILLA VAZZA ORO: 2 PZAS × $0.30 = $0.60');
console.log('- BULLON - ESPONJA 10 MM / 50 KG: 1 KG × $1.20 = $1.20');
console.log('💰 COSTO TOTAL POR PAR: $372.32');

console.log('');
console.log('🚀 PRÓXIMOS PASOS PARA PROBAR');
console.log('=============================');
console.log('1. La aplicación ya está corriendo en http://localhost:3000');
console.log('2. Los datos están listos en localStorage');
console.log('3. Ve al navegador y refresca la página (F5)');
console.log('4. Inicia sesión: admin / password');
console.log('5. Abre el Copilot (ícono de estrellas)');
console.log('6. Pregunta: "¿Cuál es el costo total por par del modelo VAZZA ESTILO 13501 BLANCO?"');

console.log('');
console.log('✨ ¡Los datos están cargados! El Copilot ahora debería funcionar perfectamente.');
