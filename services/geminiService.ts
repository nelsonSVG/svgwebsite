
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectIdeas = async (businessType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 creative digital project ideas (web/app/branding) for a ${businessType} business. Format as JSON array of objects with 'title', 'category', and 'description'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['title', 'category', 'description']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const chatWithAssistant = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are 'Savage', the intake specialist for SVG Visual. 
        
        GOAL: Convert the user into a qualified lead by gathering: Name, Project Type, and Budget/Timeline.
        
        RULES:
        1. BE BRIEF. Maximum 2 sentences per response. No fluff.
        2. Tone: Professional, direct, efficient, but polite.
        3. Do not write long paragraphs. 
        4. Ask one qualifying question at a time.
        5. Once you have the user's details, tell them: "Perfect. I've compiled this summary and sent it directly to Nelson. He'll be in touch shortly."
        
        Example Interaction:
        User: I need a website.
        Savage: We can do that. What industry is this for, and do you have a deadline?
        User: It's a coffee shop, need it next month.
        Savage: Got it. And what is your estimated budget for this launch?`,
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Connection interrupted. Please email hi@svgvisual.com directly.";
  }
};
