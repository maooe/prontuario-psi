
import { GoogleGenAI } from "@google/genai";

export const askAgent = async (prompt: string, contextData?: any) => {
  // A chave de API deve ser configurada na Vercel como API_KEY
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    return { 
      text: "⚠️ Chave de API não configurada. Vá em 'Settings > Environment Variables' na Vercel e adicione a variável API_KEY com sua chave do Google AI Studio.", 
      sources: [] 
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Resumo para a IA entender o que está acontecendo no consultório
  const patientsCount = contextData?.patients?.length || 0;
  const sessionsCount = contextData?.sessions?.length || 0;
  
  const patientsDetails = contextData?.patients?.slice(-10).map((p: any) => 
    `- ${p.name} (Problema: ${p.problemBrief || 'Não detalhado'})`
  ).join('\n');

  const systemInstruction = `Você é o "Agente PSI", assistente de um psicólogo clínico.
  Você tem acesso a ${patientsCount} pacientes e ${sessionsCount} registros de sessões.
  
  DADOS RECENTES:
  ${patientsDetails}

  REGRAS:
  1. Use Tom Profissional e Ético (Sigilo total).
  2. Para buscas de CIDs ou termos técnicos, use a ferramenta de busca Google Search.
  3. Para buscas de pacientes, use os dados acima.
  4. Responda em Português (PT-BR).
  5. Se perguntarem sobre a agenda, confirme que as sessões do prontuário já estão unificadas com o Google Calendar no Dashboard.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    // Acesso correto à propriedade .text conforme diretrizes
    const responseText = response.text || "Não consegui gerar uma resposta agora. Tente reformular a pergunta.";
    
    // Extração de fontes
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "Fonte externa",
        uri: c.web.uri || "#"
      }));

    return { text: responseText, sources };
  } catch (error: any) {
    console.error("Erro Agente PSI:", error);
    return { 
      text: "Ocorreu um erro ao conectar com a inteligência artificial. Verifique se sua chave de API é válida e se há conexão com a internet.", 
      sources: [] 
    };
  }
};

