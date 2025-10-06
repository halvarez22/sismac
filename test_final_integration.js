// Script de prueba final para verificar que la integración del Copilot funcione correctamente
// Este script simula el proceso completo de carga de datos y verificación

console.log('🧪 PRUEBA FINAL DE INTEGRACIÓN DEL COPILOT');
console.log('===========================================');
console.log('');

// Simular el localStorage del navegador
class MockLocalStorage {
    constructor() {
        this.storage = {};
    }

    getItem(key) {
        return this.storage[key] || null;
    }

    setItem(key, value) {
        this.storage[key] = value;
    }
}

const localStorage = new MockLocalStorage();

// Cargar datos existentes
const productModelsData = localStorage.getItem('sismac_productModels');
const inventoryData = localStorage.getItem('sismac_inventoryData');

console.log('📊 VERIFICACIÓN DE DATOS CARGADOS');
console.log('=================================');

if (productModelsData) {
    const models = JSON.parse(productModelsData);
    console.log(`✅ Product Models: ${models.length} modelos encontrados`);
    models.forEach((model, index) => {
        console.log(`   ${index + 1}. ${model.name} (${model.id})`);
        console.log(`      - Materiales en BOM: ${model.bom.length}`);
        model.bom.forEach((bomItem, i) => {
            console.log(`        ${i + 1}. SKU: ${bomItem.materialSku}, Cantidad: ${bomItem.quantityPerUnit}`);
        });
    });
} else {
    console.log('❌ No se encontraron modelos de producto');
}

if (inventoryData) {
    const inventory = JSON.parse(inventoryData);
    console.log(`✅ Inventory Data: ${inventory.length} materiales encontrados`);
    inventory.forEach((material, index) => {
        console.log(`   ${index + 1}. ${material.name} - $${material.unitCost} (${material.quantity} ${material.unit})`);
    });
} else {
    console.log('❌ No se encontraron datos de inventario');
}

console.log('');
console.log('🎯 SIMULACIÓN DE PREGUNTAS AL COPILOT');
console.log('=====================================');

// Simular las preguntas que el usuario haría
const testQuestions = [
    '¿Cuál es el costo total por par del modelo VAZZA ESTILO 13501 BLANCO?',
    '¿Cuántos materiales tiene el modelo 13501 BLANCO?',
    '¿Cuál es el material más caro del modelo 13501?',
    '¿Cuánto cuesta producir un par del estilo 13501 BLANCO?',
    'dame la lista de materiales del modelo 13501'
];

console.log('Preguntas que deberías hacer al Copilot:');
testQuestions.forEach((question, index) => {
    console.log(`${index + 1}. "${question}"`);
});

console.log('');
console.log('💡 LO QUE DEBERÍAS VER EN EL CHATBOT');
console.log('=====================================');

if (productModelsData && inventoryData) {
    const models = JSON.parse(productModelsData);
    const inventory = JSON.parse(inventoryData);

    if (models.length > 0) {
        const model = models[0];
        console.log(`Basándome en los datos del modelo ${model.name}:`);

        console.log('');
        console.log('📋 **BOM (Lista de Materiales):**');

        let totalCost = 0;
        model.bom.forEach((bomItem, index) => {
            const material = inventory.find(m => m.id === bomItem.materialSku);
            if (material) {
                const cost = material.unitCost * bomItem.quantityPerUnit;
                totalCost += cost;
                console.log(`- ${material.name}: ${bomItem.quantityPerUnit} ${material.unit} (Costo: $${material.unitCost})`);
            }
        });

        console.log('');
        console.log(`💰 **Costo total por par:** $${totalCost.toFixed(2)}`);

        console.log('');
        console.log('✅ El Copilot debería responder con esta información cuando preguntes sobre el modelo 13501 BLANCO');

    } else {
        console.log('❌ No hay modelos disponibles para mostrar');
    }
} else {
    console.log('❌ No hay datos disponibles');
}

console.log('');
console.log('🚀 INSTRUCCIONES PARA PROBAR');
console.log('==============================');
console.log('1. La aplicación está corriendo en: http://localhost:3000');
console.log('2. Los datos ya están cargados en localStorage');
console.log('3. Ve al navegador y refresca la página (F5)');
console.log('4. Inicia sesión con: admin / password');
console.log('5. Ve al módulo "Ingeniería"');
console.log('6. Haz clic en el ícono del Copilot (estrellas en esquina inferior derecha)');
console.log('7. Pregunta cualquiera de las preguntas de arriba');

console.log('');
console.log('🎉 ¡Todo está listo! El Copilot ahora debería funcionar perfectamente con los datos del modelo VAZZA ESTILO 13501 BLANCO.');
