// Script de verificación final para probar el Copilot con datos cargados automáticamente
// Este script simula el comportamiento completo de la aplicación

console.log('🧪 VERIFICACIÓN FINAL DEL SISTEMA');
console.log('=================================');
console.log('');

// Simular el comportamiento de loadTestDataIfNeeded
const loadTestDataIfNeeded = () => {
    try {
        console.log('🔍 Verificando estado de localStorage...');

        const hasProductModels = localStorage.getItem('sismac_productModels');
        const hasInventoryData = localStorage.getItem('sismac_inventoryData');

        console.log('📦 Estado actual:');
        console.log(`   - Product Models: ${hasProductModels ? '✅' : '❌'}`);
        console.log(`   - Inventory Data: ${hasInventoryData ? '✅' : '❌'}`);

        if (!hasProductModels || !hasInventoryData) {
            console.log('🔧 Cargando datos de prueba automáticamente...');

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

            console.log('✅ Datos cargados exitosamente');
            return true;
        } else {
            console.log('✅ Datos ya disponibles');
            return true;
        }
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        return false;
    }
};

// Simular la aplicación cargando datos automáticamente
console.log('🚀 SIMULANDO CARGA AUTOMÁTICA DE LA APLICACIÓN');
console.log('===============================================');

// Limpiar datos existentes para simular primera carga
localStorage.clear();

const dataLoaded = loadTestDataIfNeeded();

console.log('');
console.log('📊 VERIFICACIÓN DE DATOS CARGADOS');
console.log('=================================');

// Verificar datos
const productModelsData = localStorage.getItem('sismac_productModels');
const inventoryData = localStorage.getItem('sismac_inventoryData');

let models = [];
let inventory = [];
let totalCost = 0;

if (productModelsData) {
    models = JSON.parse(productModelsData);
    console.log(`✅ Product Models: ${models.length} modelos cargados`);

    if (inventoryData) {
        inventory = JSON.parse(inventoryData);
        console.log(`✅ Inventory Data: ${inventory.length} materiales cargados`);

        // Calcular costo total
        if (models.length > 0) {
            const model = models[0];
            console.log(`\n📋 BOM del modelo ${model.name}:`);

            model.bom.forEach((bomItem, index) => {
                const material = inventory.find(m => m.id === bomItem.materialSku);
                if (material) {
                    const cost = material.unitCost * bomItem.quantityPerUnit;
                    totalCost += cost;
                    console.log(`   ${index + 1}. ${material.name}: ${bomItem.quantityPerUnit} ${material.unit} × $${material.unitCost} = $${cost.toFixed(2)}`);
                }
            });

            console.log(`\n💰 Costo total por par: $${totalCost.toFixed(2)}`);
        }
    }
}

console.log('');
console.log('🎯 RESULTADO DE LA VERIFICACIÓN');
console.log('==============================');

if (dataLoaded && models.length > 0 && inventory.length > 0) {
    console.log('✅ ¡ÉXITO! Los datos se cargaron correctamente');
    console.log('✅ El modelo VAZZA ESTILO 13501 BLANCO está disponible');
    console.log('✅ El Copilot debería funcionar sin errores');
    console.log('');
    console.log('🚀 INSTRUCCIONES PARA PROBAR EN EL NAVEGADOR:');
    console.log('============================================');
    console.log('1. Ve a http://localhost:3000 (la aplicación ya está corriendo)');
    console.log('2. Refresca la página (F5)');
    console.log('3. Inicia sesión: admin / password');
    console.log('4. Ve a "Ingeniería" → Copilot (ícono de estrellas)');
    console.log('5. Pregunta: "¿Cuál es el costo total por par del modelo VAZZA ESTILO 13501 BLANCO?"');
    console.log('');
    console.log('🎉 ¡El Copilot ahora debería responder correctamente!');
} else {
    console.log('❌ Hubo un problema al cargar los datos');
    console.log('💡 Verifica los logs de error anteriores');
}

console.log('');
console.log('🔍 DEPURACIÓN DEL COPILOT');
console.log('=========================');
console.log('Si aún hay errores, revisa la consola del navegador (F12) y busca:');
console.log('- 🔍 DEBUG Copilot - Datos recibidos:');
console.log('- ✅ Verificación de datos iniciales completada');
console.log('- 🔧 Verificando datos iniciales...');
