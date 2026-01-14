
import { GoogleGenAI } from "@google/genai";

// Fix: Updated model to gemini-3-flash-preview and enforced strict initialization and search grounding logic
export const askAgent = async (prompt: string, contextData?: any) => {
  // Always use naming parameter for apiKey and initialize strictly as per guidelines
  console.log("Agente PSI: Iniciando chamada de IA...");

  try {
    // Correct initialization following the @google/genai guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare context summary from patient data
    const pSummary = contextData?.patients?.map((p: any) => p.name).join(', ') || 'Nenhum';

    const systemInstruction = `Você é o Agente PSI, um assistente virtual ético e profissional para psicólogos brasileiros. 
    Responda de forma curta, técnica e acolhedora em Português (Brasil).
    Pacientes no banco de dados atual: ${pSummary}.
    Utilize a ferramenta de busca do Google para fundamentar respostas sobre legislações, técnicas de psicologia (como TCC, Psicanálise) e saúde mental.`;

    // Use 'gemini-3-flash-preview' for basic text tasks and reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ googleSearch: {} }], // Enable search grounding for up-to-date information
        thinkingConfig: { thinkingBudget: 0 } // Optimization for response latency
      }
    });

    // Directly access the text property (getter) as per SDK requirements
    const text = response.text || "Desculpe, não consegui processar sua solicitação no momento.";
    
    // Fix: Extract grounding sources from groundingChunks if Google Search was triggered
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri
      })) || [];

    console.log("Agente PSI: Resposta recebida com sucesso.");
    return { text, sources };

  } catch (error: any) {
    console.error("Agente PSI: Erro na chamada da API:", error);
    return { 
      text: "Desculpe, ocorreu um erro de conexão com os serviços de IA. Verifique sua conexão e tente novamente.", 
      sources: [] 
    };
  }
};
