import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBfmXmfdvfxFEc-l2K781pDe8huo5UAuKA");

export async function generateGeminiInvoiceItems(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `
    Eres un asistente experto en facturación. Tu tarea es generar una lista de items para una factura basados en la descripción del usuario.
    Debes responder ÚNICAMENTE con un array JSON válido de objetos.
    Cada objeto debe tener EXACTAMENTE estas propiedades:
    - description (string)
    - quantity (number)
    - unit_price (number)
    
    Ejemplo de respuesta:
    [{"description": "Desarrollo Web", "quantity": 1, "unit_price": 500}]
    
    No incluyas explicaciones, ni bloques de código markdown, solo el JSON.
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
