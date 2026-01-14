
import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI exclusively with process.env.API_KEY according to SDK guidelines
const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const askAgent = async (prompt: string, contextData?: any) => {
  const ai = getAIInstance();
  
  const systemInstruction = `Você é um assistente especializado em auxiliar psicólogos no sistema Prontuário PSI.
  Seu objetivo é ajudar com buscas internas nos dados do sistema ou realizar pesquisas externas na web sobre termos psicológicos, CID, terapias e bem-estar.
  Contexto atual do sistema (Dados de pacientes/sessões): ${JSON.stringify(contextData || {})}.
  Responda sempre em Português do Brasil de forma profissional e acolhedora.
  Se o usuário perguntar algo sobre os pacientes, busque nos dados fornecidos. 
  Se o usuário perguntar algo geral, use a ferramenta de busca do Google.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    // Fix: text property accessed directly (not a method)
    const text = response.text || "Desculpe, não consegui processar sua solicitação.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("AI Error:", error);
    return { text: "Erro ao conectar com a inteligência artificial. Verifique sua chave de API.", sources: [] };
  }
};
