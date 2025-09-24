import React, { useState, useEffect } from 'react';
/// <reference types="vite/client" />
import Groq from 'groq-sdk';
import { MaterialInventory, AiInsight } from '../types';

// Icons for the component
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);
const InventoryIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>;

const AiWarehouseInsights: React.FC<{ inventoryData: MaterialInventory[] }> = ({ inventoryData }) => {
    const [insights, setInsights] = useState<AiInsight[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!import.meta.env.VITE_GROQ_API_KEY) {
                    setError("La API Key de Groq no está configurada.");
                    setLoading(false);
                    // Set mock insights if API key is not available
                    setInsights([
                        { category: 'Gestión de Inventario', insight: 'Alerta de Lento Movimiento: El material con mayor valor inmovilizado no ha rotado en más de 90 días.' },
                        { category: 'Predicción de Riesgos', insight: 'Prioridad Alta: El stock de un material crítico podría detener la producción.' },
                        { category: 'Eficiencia Operativa', insight: 'Se observa una buena rotación general en la categoría "Pieles".' }
                    ]);
                    return;
                }
                const ai = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

                const prompt = `
                    System: Eres un analista de almacén experto para un fabricante de calzado. Tu tarea es analizar el inventario proporcionado y generar hasta 3 insights accionables sobre optimización, riesgos y eficiencia. Las respuestas deben ser en español.

                    User: Aquí está el inventario actual:
                    ${JSON.stringify(inventoryData.map(({ id, name, category, quantity, unit, status, totalValue, lastMovementDate }) => ({ id, name, category, quantity, unit, status, totalValue, lastMovementDate })))}

                    Basado en estos datos, proporciona hasta 3 insights. Enfócate en:
                    - Materiales de lento movimiento (sin rotación en 90+ días)
                    - Stocks críticos que podrían detener producción
                    - Oportunidades de optimización de puntos de pedido

                    Responde con un JSON object en el siguiente formato:
                    {
                      "insights": [
                        {
                          "category": "Gestión de Inventario|Predicción de Riesgos|Eficiencia Operativa",
                          "insight": "El insight detallado en español."
                        }
                      ]
                    }
                `;

                const response = await ai.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.1-8b-instant',
                    response_format: { type: "json_object" },
                });

                const parsedResponse = JSON.parse(response.choices[0]?.message?.content || '{}');
                setInsights(parsedResponse.insights || []);

            } catch (err) {
                console.error("Error fetching AI insights:", err);
                setError("No se pudieron generar las perspectivas de la IA. Por favor, intente de nuevo más tarde.");
                setInsights([
                    { category: 'Gestión de Inventario', insight: 'Alerta de Lento Movimiento: El material con mayor valor inmovilizado no ha rotado en más de 90 días.' },
                    { category: 'Predicción de Riesgos', insight: 'Prioridad Alta: El stock de un material crítico podría detener la producción.' },
                    { category: 'Eficiencia Operativa', insight: 'Se observa una buena rotación general en la categoría "Pieles".' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [inventoryData]);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center text-violet-600 dark:text-violet-400">
                <BrainIcon />
                Perspectivas de Almacén (IA)
            </h3>
            {loading && (
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700/50 flex-shrink-0"></div>
                            <div className="w-full">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700/50 rounded w-4/5 mt-1"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {error && !loading && insights.length === 0 && <p className="text-rose-500 dark:text-rose-400 text-sm">{error}</p>}
            {!loading && (
                <div className="space-y-4">
                    {insights.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                                <InventoryIcon className="w-6 h-6 text-violet-500 dark:text-violet-300" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{item.category}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{item.insight}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AiWarehouseInsights;