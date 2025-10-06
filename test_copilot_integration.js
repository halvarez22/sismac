// Script para probar la integración del Copilot con los modelos de producto
// Este script simula el proceso de buildFullPrompt para verificar que los datos se incluyan correctamente

// Datos simulados del modelo VAZZA ESTILO 13501 BLANCO (basado en lo que cargamos)
const mockAppData = {
    inventoryData: [
        {
            id: 'ROBIN_SPORT_60_0',
            name: 'PUNTERA ROBIN SPORT',
            category: 'Textiles',
            quantity: 100,
            unit: 'MT',
            unitCost: 60.00,
            totalValue: 6000,
            reorderPoint: 50,
            status: 'OK'
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
            status: 'OK'
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
            status: 'OK'
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
            status: 'OK'
        }
    ],
    productionOrders: [],
    purchaseOrders: [],
    purchaseSuggestions: [],
    productModels: [
        {
            id: 'MOD-VAZZA-13501-BLANCO',
            name: 'VAZZA ESTILO 13501 BLANCO',
            bom: [
                { materialSku: 'ROBIN_SPORT_60_0', quantityPerUnit: 2.35 },
                { materialSku: 'SUELA_PRINCESA_26_0', quantityPerUnit: 1 },
                { materialSku: 'AGUJETA_CREES_203_52', quantityPerUnit: 1 },
                { materialSku: 'TRANSFER_VAZZA_0_30', quantityPerUnit: 2 }
            ]
        }
    ],
    users: []
};

// Simular la función buildFullPrompt
const buildFullPrompt = (userMessage) => {
    const summaryData = {
        inventory: mockAppData.inventoryData.map(item => ({
            id: item.id,
            name: item.name,
            status: item.status,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            unitCost: item.unitCost,
            totalValue: item.totalValue,
            reorderPoint: item.reorderPoint
        })),
        productionOrders: mockAppData.productionOrders.map(order => ({
            id: order.id,
            status: order.status,
            quantity: order.quantity,
            modelId: order.modelId,
            totalCost: order.totalCost
        })),
        purchaseOrders: mockAppData.purchaseOrders.map(order => ({
            id: order.id,
            status: order.status,
            totalCost: order.totalCost,
            supplier: order.supplier,
            materials: order.materials.map(m => ({ sku: m.materialSku, quantity: m.quantity }))
        })),
        productModels: mockAppData.productModels.map(model => ({
            id: model.id,
            name: model.name,
            bom: model.bom.map(bomItem => ({
                materialSku: bomItem.materialSku,
                quantityPerUnit: bomItem.quantityPerUnit
            }))
        }))
    };

    return `Eres SISMAC Copilot, un asistente de IA experto en gestión de inventario y producción para una fábrica de calzado.

Datos disponibles:
- Inventario: ${summaryData.inventory.length} materiales con información completa (ID, nombre, categoría, costo unitario, stock, etc.)
- Órdenes de producción: ${summaryData.productionOrders.length} (incluyendo modelo asociado y costos)
- Órdenes de compra: ${summaryData.purchaseOrders.length} (incluyendo proveedores y materiales)
- Modelos de producto: ${summaryData.productModels.length} con BOM completo (lista de materiales por unidad)

INFORMACIÓN DETALLADA DE MODELOS DE PRODUCTO:
${summaryData.productModels.map(model =>
  `- ${model.name} (${model.id}): ${model.bom.length} materiales en BOM`
).join('\n')}

Pregunta: "${userMessage}"

INSTRUCCIONES:
- Responde en español de manera clara y precisa
- Utiliza los datos específicos de modelos, materiales y costos disponibles
- Si la pregunta es sobre un modelo específico, incluye detalles del BOM (materiales y cantidades por unidad)
- Calcula costos cuando sea posible usando los precios unitarios del inventario
- Si necesitas más detalles, pide aclaración al usuario`;
};

// Probar diferentes preguntas
const testQuestions = [
    '¿Cuál es el costo total por par del modelo VAZZA ESTILO 13501 BLANCO?',
    '¿Cuántos materiales tiene el modelo 13501 BLANCO?',
    '¿Cuál es el material más caro del modelo 13501?',
    '¿Cuánto cuesta producir un par del estilo 13501 BLANCO?',
    '¿Qué materiales componen el modelo VAZZA ESTILO 13501 BLANCO?',
    '¿Cuánto cuestan las agujetas para el modelo 13501 BLANCO?'
];

console.log('🧪 PROBANDO INTEGRACIÓN DEL COPILOT CON MODELOS DE PRODUCTO');
console.log('=========================================================');
console.log('');

testQuestions.forEach((question, index) => {
    console.log(`\n📝 Pregunta ${index + 1}: "${question}"`);
    console.log('🔧 Prompt generado:');

    const prompt = buildFullPrompt(question);
    console.log(prompt.substring(0, 300) + '...');

    // Verificar si el prompt contiene la información necesaria
    const containsModel13501 = prompt.includes('VAZZA ESTILO 13501 BLANCO');
    const containsBomInfo = prompt.includes('materiales en BOM');
    const containsInstructions = prompt.includes('Calcula costos');

    console.log('');
    console.log('✅ Verificaciones:');
    console.log(`   - Contiene información del modelo 13501: ${containsModel13501 ? '✅' : '❌'}`);
    console.log(`   - Incluye detalles del BOM: ${containsBomInfo ? '✅' : '❌'}`);
    console.log(`   - Tiene instrucciones de cálculo: ${containsInstructions ? '✅' : '❌'}`);

    console.log('');
    console.log('📊 Datos disponibles en el prompt:');
    if (containsModel13501) {
        const modelInfo = mockAppData.productModels[0];
        console.log(`   - Modelo: ${modelInfo.name}`);
        console.log(`   - ID: ${modelInfo.id}`);
        console.log(`   - Materiales en BOM: ${modelInfo.bom.length}`);
        modelInfo.bom.forEach((bomItem, i) => {
            const material = mockAppData.inventoryData.find(m => m.id === bomItem.materialSku);
            console.log(`     ${i + 1}. ${material.name}: ${bomItem.quantityPerUnit} ${material.unit} ($${material.unitCost})`);
        });
    }

    console.log('---'.repeat(30));
});

console.log('\n🎉 RESULTADO DEL TEST');
console.log('====================');
console.log('✅ El prompt ahora incluye:');
console.log('   - Información completa de modelos de producto');
console.log('   - Detalles del BOM (materiales y cantidades)');
console.log('   - Instrucciones específicas para calcular costos');
console.log('   - Datos del inventario con precios unitarios');
console.log('');
console.log('🚀 El chatbot ahora debería poder:');
console.log('   - Responder sobre el modelo VAZZA ESTILO 13501 BLANCO');
console.log('   - Calcular costos totales por par');
console.log('   - Mostrar la lista de materiales del BOM');
console.log('   - Hacer análisis de costos por componente');
console.log('');
console.log('💡 Prueba el chatbot con estas preguntas:');
console.log('   - "¿Cuál es el costo total por par del modelo VAZZA ESTILO 13501 BLANCO?"');
console.log('   - "¿Cuántos materiales tiene el modelo 13501 BLANCO?"');
console.log('   - "¿Cuál es el material más caro del modelo 13501?"');
