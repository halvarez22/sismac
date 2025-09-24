/// <reference types="vite/client" />

import React, { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import {
    User, PurchaseOrder, ProductionOrder, MaterialInventory,
    ProductModel, PurchaseSuggestion
} from '../types';

interface AppData {
    inventoryData: MaterialInventory[];
    purchaseOrders: PurchaseOrder[];
    productionOrders: ProductionOrder[];
    purchaseSuggestions: PurchaseSuggestion[];
    productModels: ProductModel[];
    users: Omit<User, 'password'>[];
}

interface CopilotProps {
    isOpen: boolean;
    onClose: () => void;
    appData: AppData;
}

type ChatMessage = {
    role: 'user' | 'model';
    text: string;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
    </div>
);

export const Copilot: React.FC<CopilotProps> = ({ isOpen, onClose, appData }) => {
    const [ai, setAi] = useState<any>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // Scroll to bottom of chat history
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    // Initialize AI on open
    useEffect(() => {
        if (isOpen) {
            setInputValue(''); // Clear input on open

            if (!ai) {
                const examplePrompts = `Aquí tienes algunas ideas de lo que puedes preguntar:
- "¿Cuál es el valor total del inventario?"
- "¿Qué órdenes de producción están pendientes?"
- "Muéstrame los materiales con stock crítico."
- "¿Quién es nuestro proveedor con el mejor OTD?"`;

                if (!import.meta.env.VITE_GROQ_API_KEY) {
                    setError("Modo Demo: La API Key de Groq no está configurada.");
                    const demoMessage = `¡Hola! Soy SISMAC Copilot. **Estoy en modo de demostración porque la API Key no está configurada.**\n\n${examplePrompts}\n\nPregúntame algo y te daré una respuesta de ejemplo para mostrarte cómo funciono.`;
                    setChatHistory([{ role: 'model', text: demoMessage }]);
                    return;
                }
                try {
                    const groqAI = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY as string, dangerouslyAllowBrowser: true });
                    setAi(groqAI);
                    const initialMessage = `¡Hola! Soy SISMAC Copilot. Puedo ayudarte a analizar los datos de la aplicación.\n\n${examplePrompts}\n\n¿En qué puedo ayudarte?`;
                    setChatHistory([{ role: 'model', text: initialMessage }]);
                } catch (e) {
                    console.error("Error initializing Groq:", e);
                    setError("Error al inicializar el asistente de IA.");
                }
            }
        }
    }, [isOpen, ai]);
    
    const buildFullPrompt = (userMessage: string): string => {
        // Simplificar los datos para evitar prompts demasiado largos
        const summaryData = {
            inventory: appData.inventoryData.map(item => ({
                id: item.id,
                name: item.name,
                status: item.status,
                quantity: item.quantity,
                unit: item.unit
            })),
            productionOrders: appData.productionOrders.map(order => ({
                id: order.id,
                status: order.status,
                quantity: order.quantity
            })),
            purchaseOrders: appData.purchaseOrders.map(order => ({
                id: order.id,
                status: order.status,
                totalCost: order.totalCost
            }))
        };

        return `Eres SISMAC Copilot, un asistente de IA para gestión de inventario y producción.

Datos disponibles:
- Inventario: ${summaryData.inventory.length} materiales
- Órdenes de producción: ${summaryData.productionOrders.length}
- Órdenes de compra: ${summaryData.purchaseOrders.length}

Pregunta: "${userMessage}"

Responde de manera concisa en español basándote solo en estos datos.`;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading) return;

        console.log('Sending message:', userMessage);
        setInputValue('');
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        // Handle Demo Mode
        if (error) {
             setTimeout(() => {
                setChatHistory(prev => [...prev, { role: 'model', text: "Esta es una respuesta de demostración. En un entorno real, analizaría los datos para informarte que el proveedor con mejor OTD (On-Time Delivery) es 'Pieles del Bajío S.A.' con un 98%." }]);
                setIsLoading(false);
            }, 1500);
            return;
        }

        if (!ai) {
            setError("La IA no está inicializada.");
            setIsLoading(false);
            return;
        }

        try {
            const fullPrompt = buildFullPrompt(userMessage);
            console.log('Full prompt:', fullPrompt.substring(0, 200) + '...');

            // Usar chat completions con streaming
            const stream = await ai.chat.completions.create({
                messages: [{ role: 'user', content: fullPrompt }],
                model: 'llama-3.1-8b-instant',
                stream: true,
            });

            let currentResponse = '';
            setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                console.log('Chunk received:', chunk);
                const text = chunk.choices[0]?.delta?.content || '';
                currentResponse += text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].text = currentResponse;
                    return newHistory;
                });
            }

            console.log('Final response text:', currentResponse);

        } catch (e) {
            console.error("Error sending message to Groq:", e);
            const errorMessage = `Error: ${e instanceof Error ? e.message : 'Error desconocido'}`;
            setChatHistory(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-violet-500 dark:text-violet-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                        </svg>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">SISMAC Copilot</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-violet-200 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-violet-600 dark:text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                                </div>
                             )}
                             <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-200 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-violet-600 dark:text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                            </div>
                            <div className="max-w-md p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    {error && <p className="text-xs text-center text-rose-500 dark:text-rose-400">{error}</p>}
                </div>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pregunta algo sobre tus datos..."
                            className="flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-sky-500 focus:border-sky-500"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="bg-sky-600 text-white p-2.5 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                            disabled={isLoading || !inputValue.trim()}
                            aria-label="Enviar mensaje"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};