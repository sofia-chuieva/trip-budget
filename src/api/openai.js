const systemContent = `Return STRICT JSON only (no markdown). 
Model a trip plan with a stable core and flexible extensions.

Core:
{
  "duration: "string",
  "best_time_to_visit" : "string",
  "airports": "string",
  "local_transport": "string",
}

Flexible:
- "sections": [
    {
      "key": "budget" | "food" | "hotels" | "transport" | "shopping" | "nightlife" | "safety" | "packing" | "weather" | "custom",
      "title": "string",
      "items": [ { "label": "string", "detail": "string" } ]  // for lists (e.g., restaurants)
      // or alternatively: "content": "string"  // for long text sections
    }
  ]
- "faq": [ { "question": "string", "answer": "string" } ]
- "extras": { "<anyKey>": <anyJSON> }  

Rules:
- Populate core from the user prompt.
- Add at most a few smart default sections if clearly implied (e.g., top food picks).
- No emojis in JSON values.

Output: a single JSON object with these fields.`;

export async function getOpenAIrequest(chatMessages) {
  const apiMessages = chatMessages.map((messageObj) => {
    const role = messageObj.sender === "ChatGPT" ? "assistant" : "user";
    return { role, content: messageObj.message };
  });

  const apiRequestBody = {
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      ...apiMessages,
    ],
    response_format: { type: "json_object" },
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify(apiRequestBody),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const result = await res.json();
  return result;
}
