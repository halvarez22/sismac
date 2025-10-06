// Script para debuggear el estado de la aplicación
// Este script se ejecuta en la consola del navegador (F12 -> Console)

console.log('🔍 VERIFICANDO DATOS EN LOCALSTORAGE');
console.log('=====================================');

try {
    const productModelsData = localStorage.getItem('sismac_productModels');
    const inventoryData = localStorage.getItem('sismac_inventoryData');
    const purchaseOrdersData = localStorage.getItem('sismac_purchaseOrders');
    const productionOrdersData = localStorage.getItem('sismac_productionOrders');
    const purchaseSuggestionsData = localStorage.getItem('sismac_purchaseSuggestions');

    console.log('📦 Product Models:', productModelsData ? JSON.parse(productModelsData) : 'No hay datos');
    console.log('📦 Inventory Data:', inventoryData ? JSON.parse(inventoryData).length + ' materiales' : 'No hay datos');
    console.log('📦 Purchase Orders:', purchaseOrdersData ? JSON.parse(purchaseOrdersData).length : 'No hay datos');
    console.log('📦 Production Orders:', productionOrdersData ? JSON.parse(productionOrdersData).length : 'No hay datos');
    console.log('📦 Purchase Suggestions:', purchaseSuggestionsData ? JSON.parse(purchaseSuggestionsData).length : 'No hay datos');

    console.log('');
    console.log('🔧 CREANDO DATOS DE PRUEBA DEL MODELO VAZZA 13501');
    console.log('=================================================');

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

    console.log('');
    console.log('💾 GUARDANDO DATOS DE PRUEBA EN LOCALSTORAGE');
    console.log('============================================');

    // Guardar datos en localStorage
    localStorage.setItem('sismac_productModels', JSON.stringify([testProductModel]));
    localStorage.setItem('sismac_inventoryData', JSON.stringify(testInventoryData));
    localStorage.setItem('sismac_purchaseOrders', JSON.stringify([]));
    localStorage.setItem('sismac_productionOrders', JSON.stringify([]));
    localStorage.setItem('sismac_purchaseSuggestions', JSON.stringify([]));

    console.log('✅ Datos guardados exitosamente');
    console.log('');
    console.log('📊 VERIFICACIÓN DE DATOS GUARDADOS');
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
    console.log('🎯 PRÓXIMOS PASOS');
    console.log('=================');
    console.log('1. Refresca la página en el navegador (F5)');
    console.log('2. Abre el Copilot y pregunta:');
    console.log('   "¿Cuál es el costo total por par del modelo VAZZA ESTILO 13501 BLANCO?"');
    console.log('3. Deberías ver:');
    console.log('   - 5 materiales en el BOM');
    console.log('   - Cálculo correcto del costo total');
    console.log('   - Información detallada de cada material');

    console.log('');
    console.log('🔍 DATOS DEL MODELO VAZZA 13501 BLANCO');
    console.log('=====================================');
    console.log('📋 BOM (Lista de Materiales):');
    console.log('- PUNTERA ROBIN SPORT: 2.35 MT × $60.00 = $141.00');
    console.log('- SUELA PRINCESA/MANGO/VEGAN T.R. BLANCA: 1 PRS × $26.00 = $26.00');
    console.log('- AGUJETA PLANA CREES #120 CM: 1 GRUESAS × $203.52 = $203.52');
    console.log('- TRANSFER PLANTILLA VAZZA ORO: 2 PZAS × $0.30 = $0.60');
    console.log('- BULLON - ESPONJA 10 MM / 50 KG: 1 KG × $1.20 = $1.20');
    console.log('💰 COSTO TOTAL POR PAR: $372.32');

    console.log('');
    console.log('✨ ¡Los datos están listos! Refresca la página y prueba el Copilot.');

} catch (error) {
    console.error('❌ Error al acceder a localStorage:', error);
    console.log('💡 Copia y pega el siguiente código en la consola del navegador:');

    const script = `
    // Datos del modelo VAZZA ESTILO 13501 BLANCO (5 materiales)
    const testProductModel = {
        id: 'MOD-VAZZA-13501-BLANCO',
        name: 'VAZZA ESTILO 13501 BLANCO',
        bom: [
            { materialSku: 'ROBIN_SPORT_60_0', quantityPerUnit: 2.35 },
            { materialSku: 'SUELA_PRINCESA_26_0', quantityPerUnit: 1 },
            { materialSku: 'AGUJETA_CREES_203_52', quantityPerUnit: 1 },
            { materialSku: 'TRANSFER_VAZZA_0_30', quantityPerUnit: 2 },
            { materialSku: 'BULLON_ESPONJA_1_20', quantityPerUnit: 1 }
        ]
    };

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

    localStorage.setItem('sismac_productModels', JSON.stringify([testProductModel]));
    localStorage.setItem('sismac_inventoryData', JSON.stringify(testInventoryData));
    localStorage.setItem('sismac_purchaseOrders', JSON.stringify([]));
    localStorage.setItem('sismac_productionOrders', JSON.stringify([]));
    localStorage.setItem('sismac_purchaseSuggestions', JSON.stringify([]));

    console.log('✅ Datos cargados. Refresca la página (F5) y prueba el Copilot.');
    `;

    console.log(script);
}
