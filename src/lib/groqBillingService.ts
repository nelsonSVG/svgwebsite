import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateGroqInvoiceItems(prompt: string) {
  const systemInstruction = `
    You are a professional billing assistant for SVG Visual Digital Design Agency. 
    Your task is to extract invoice items and client information from the user's description.
    
    CRITICAL RULES:
    1. Respond ONLY with a valid JSON object.
    2. Format:
       {
         "items": [
           {
             "description": "string in English",
             "quantity": number,
             "unit_price": number
           }
         ],
         "client": {
           "name": "string (Full name if mentioned)",
           "email": "string (if mentioned)",
           "company_name": "string (if mentioned)"
         }
       }
    3. ALL item descriptions must be in ENGLISH.
    4. If client info is missing, leave the client fields as null.
    
    Example response:
    {
      "items": [{"description": "Web Development", "quantity": 1, "unit_price": 500}],
      "client": {"name": "Elon Musk", "email": "elon@tesla.com", "company_name": "Tesla"}
    }
    
    No explanations, no markdown code blocks, just raw JSON.
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.1,
  });

  const text = completion.choices[0]?.message?.content || "";
  
  try {
    // Limpiar posibles bloques de código markdown o texto extra
    const startIndex = text.indexOf('[');
    const endIndex = text.lastIndexOf(']');
    
    if (startIndex !== -1 && endIndex !== -1) {
      return JSON.parse(text.substring(startIndex, endIndex + 1));
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing Groq response:", text);
    throw new Error("Could not process AI response. Please try with a clearer prompt.");
  }
}
