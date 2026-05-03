import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function askVoteEaseAssistant(prompt: string, context?: string) {
  const ai = getAI();
  const systemInstruction = `You are VoteEase Assistant, a neutral AI advisor for a digital voting platform. 
  Your goal is to help voters understand candidate platforms, election processes, and clarify complex terminology. 
  Maintain strict neutrality. Do not endorse any candidate. 
  Use clear, accessible language.
  Context provided: ${context || 'None'}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
