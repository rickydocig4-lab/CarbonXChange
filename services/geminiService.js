
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCarbonProject = async (description) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an environmental expert, analyze the following carbon credit project description and provide a brief summary of its impact and potential risks: ${description}`,
    config: {
      temperature: 0.7,
    }
  });
  return response.text;
};

export const getMarketplaceInsights = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Provide a brief 3-point summary of current global carbon market trends for a B2B audience.",
    config: {
      temperature: 0.5,
    }
  });
  return response.text;
};
