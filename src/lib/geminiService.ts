// Client-side service that calls the Next.js API route instead of Gemini directly

export const chatWithAssistant = async (message: string, _history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Connection interrupted. Please email hi@svgvisual.com directly.";
  }
};
