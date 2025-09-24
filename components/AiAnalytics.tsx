/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import Groq from 'groq-sdk';
import { AiInsight, SupplierPerformance, MonthlyData, SupplierRiskAlert, WasteData } from '../types';

// Icons for the component
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);
const CostIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.562 0 1.085.16 1.5.44" /></svg>;
const SupplierIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.282 2.72a3 3 0 0 1-4.682-2.72 9.094 9.094 0 0 1 3.741-.479m-.122 3.198a3 3 0 0 0-3.498 2.77 3 3 0 0 0-3.498-2.77M12 21a3 3 0 0 0 3.498-2.77 3 3 0 0 0-3.498-2.77m3.498 2.77a3 3 0 0 0 3.498-2.77M12 12.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>;
const RiskIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const EfficiencyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>;

const categoryIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'Ahorro de Costos': CostIcon,
    'Rendimiento de Proveedores': SupplierIcon,
    'Predicción de Riesgos': RiskIcon,
    'Eficiencia Operativa': EfficiencyIcon,
};

interface AiAnalyticsProps {
    supplierData: SupplierPerformance[];
    costPerPairData: MonthlyData[];
    supplierRiskData: SupplierRiskAlert[];
    aiSavingsData: MonthlyData[];
    wasteIndexData: WasteData[];
}

const AiAnalytics: React.FC<AiAnalyticsProps> = ({
    supplierData,
    costPerPairData,
    supplierRiskData,
    aiSavingsData,
    wasteIndexData
}) => {
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
                    { category: 'Ahorro de Costos', insight: 'Se ha detectado una oportunidad de ahorro al negociar con "Herrajes Internacionales" debido a la volatilidad del dólar.'},
                    { category: 'Predicción de Riesgos', insight: 'Riesgo de retraso con "Suelas Modernas de León" por congestión portuaria. Se recomienda aumentar el stock de seguridad.'},
                    { category: 'Eficiencia Operativa', insight: 'El índice de desperdicio real ha superado consistentemente el proyectado. Investigar causas en la línea de producción.'}
                  ]);
                  return;
                }
                const ai = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY as string, dangerouslyAllowBrowser: true });

                const prompt = `
                    System: You are an expert supply chain analyst for a high-end shoe manufacturer called SISMAC. Your task is to analyze the provided dashboard data and generate three concise, actionable insights for the management team. The language must be Spanish.

                    User: Here is the key performance data for the last period:

                    - Supplier Performance Data: ${JSON.stringify(supplierData)}
                    - Material Cost Per Pair Data (last 6 months): ${JSON.stringify(costPerPairData)}
                    - Active Supplier Risk Alerts: ${JSON.stringify(supplierRiskData.map(r => ({ risk: r.riskTitle, supplier: r.supplierImpacted, severity: r.severity })))}
                    - AI-Generated Savings Data (last 6 months): ${JSON.stringify(aiSavingsData)}
                    - Waste Index Data (projected vs. real, last 6 months): ${JSON.stringify(wasteIndexData)}

                    Based on this data, provide 3 key insights. Focus on identifying significant trends, potential cost-saving opportunities, and predicting future risks.

                    Respond with a JSON object in the following format:
                    {
                      "insights": [
                        {
                          "category": "Ahorro de Costos|Rendimiento de Proveedores|Predicción de Riesgos|Eficiencia Operativa",
                          "insight": "The detailed, actionable insight in Spanish."
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
                setInsights(parsedResponse.insights);

            } catch (err) {
                console.error("Error fetching AI insights:", err);
                setError("No se pudieron generar las perspectivas de la IA. Por favor, intente de nuevo más tarde.");
                 setInsights([
                    { category: 'Ahorro de Costos', insight: 'Se ha detectado una oportunidad de ahorro al negociar con "Herrajes Internacionales" debido a la volatilidad del dólar.'},
                    { category: 'Predicción de Riesgos', insight: 'Riesgo de retraso con "Suelas Modernas de León" por congestión portuaria. Se recomienda aumentar el stock de seguridad.'},
                    { category: 'Eficiencia Operativa', insight: 'El índice de desperdicio real ha superado consistentemente el proyectado. Investigar causas en la línea de producción.'}
                  ]);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [supplierData, costPerPairData, supplierRiskData, aiSavingsData, wasteIndexData]);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center text-violet-600 dark:text-violet-400">
                <BrainIcon />
                Perspectivas Clave de la IA
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
                    {insights.map((item, index) => {
                        const Icon = categoryIcons[item.category] || EfficiencyIcon;
                        return (
                            <div key={index} className="flex items-start gap-4 p-3 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
                                <div className="flex-shrink-0 mt-1">
                                    <Icon className="w-6 h-6 text-violet-500 dark:text-violet-300" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{item.category}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.insight}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AiAnalytics;