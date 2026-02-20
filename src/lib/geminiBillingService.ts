import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBfmXmfdvfxFEc-l2K781pDe8huo5UAuKA");

export async function generateGeminiInvoiceItems(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemInstruction = `
    You are a professional billing assistant for SVG Visual Digital Design Agency. 
    Your task is to generate a list of invoice items based on the user's description.
    
    CRITICAL RULES:
    1. Respond ONLY with a valid JSON array of objects.
    2. ALL descriptions must be in ENGLISH, even if the user provides the instruction in Spanish.
    3. Each object must have EXACTLY these properties:
       - description (string in English)
       - quantity (number)
       - unit_price (number)
    
    Example response:
    [{"description": "Web Development Services", "quantity": 1, "unit_price": 500}]
    
    No explanations, no markdown code blocks, just the raw JSON array.
  `;

  const result = await model.generateContent([systemInstruction, prompt]);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Limpiar posibles bloques de código markdown
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const startIndex = jsonStr.indexOf('[');
    const endIndex = jsonStr.lastIndexOf(']');
    
    if (startIndex !== -1 && endIndex !== -1) {
      return JSON.parse(jsonStr.substring(startIndex, endIndex + 1));
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error parsing Gemini response:", text);
    throw new Error("No se pudo procesar la respuesta de la IA. Por favor intenta con un prompt más claro.");
  }
}
