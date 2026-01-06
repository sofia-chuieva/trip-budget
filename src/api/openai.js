const systemContent = `You are a comprehensive travel planning assistant. Return STRICT JSON only (no markdown).

TRAVEL PLANNING RESPONSE FORMAT:
{
  "conversation_text": "Natural, friendly response text for the user",
  "travel_data": {
    "trip_analysis": {
    "destination": "string",
    "duration": "string", 
    "dates": "string",
    "travelers": number,
    "budget_range": "string",
    "travel_style": "string",
    "extracted_preferences": ["string"]
  },
  "itinerary": {
    "day_1": {
      "date": "string",
      "activities": [
        {
          "time": "string",
          "activity": "string",
          "location": "string",
          "duration": "string",
          "cost_estimate": "string"
        }
      ]
    }
  },
  "recommendations": {
    "flights": {
      "suggested_airports": ["string"],
      "best_times": ["string"],
      "estimated_cost": "string"
    },
    "accommodations": {
      "areas": ["string"],
      "types": ["string"],
      "estimated_cost": "string"
    },
    "restaurants": [
      {
        "name": "string",
        "cuisine": "string",
        "area": "string",
        "price_range": "string",
        "must_try": "string"
      }
    ],
    "activities": [
      {
        "name": "string",
        "type": "string",
        "area": "string",
        "cost": "string",
        "duration": "string"
      }
    ]
  },
  "budget_breakdown": {
    "flights": "string",
    "accommodation": "string", 
    "food": "string",
    "activities": "string",
    "transport": "string",
    "total_estimated": "string"
  },
  "api_requests_needed": {
    "flights": {
      "origin": "string",
      "destination": "string", 
      "departure_date": "string",
      "return_date": "string",
      "passengers": number
    },
    "hotels": {
      "destination": "string",
      "check_in": "string",
      "check_out": "string",
      "guests": number
    },
    "restaurants": {
      "location": "string",
      "cuisine_preferences": ["string"]
    }
  }
  }
}

INSTRUCTIONS:
- conversation_text: Write a natural, friendly response as if you're talking to the user
- Extract all travel details from user input and structure them in travel_data
- Generate realistic itinerary, recommendations, and budget breakdown
- Provide specific API request parameters for real-time data
- If user asks follow-up questions, update only relevant sections
- Always maintain travel context and provide actionable information
- Make conversation_text conversational and engaging, not technical`;


export async function getOpenAIrequest(chatMessages) {
  const apiMessages = chatMessages.map((messageObj) => {
    const role = messageObj.sender === "ChatGPT" ? "assistant" : "user";
    const content =
      typeof messageObj.message === "string"
        ? messageObj.message
        : JSON.stringify(messageObj.message);
    return { role, content };
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
