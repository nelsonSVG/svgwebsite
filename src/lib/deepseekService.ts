export async function generateDeepSeekResponse(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en facturación. Tu tarea es generar una lista de items para una factura basados en la descripción del usuario. Debes responder SOLO con un array JSON de objetos con las propiedades: description (string), quantity (number), unit_price (number).'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error calling DeepSeek API');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Clean content in case there's markdown code blocks
  const startIndex = content.indexOf('[');
  const endIndex = content.lastIndexOf(']');
  if (startIndex !== -1 && endIndex !== -1) {
    return JSON.parse(content.substring(startIndex, endIndex + 1));
  }
  return JSON.parse(content);
}
