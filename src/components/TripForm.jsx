import { useState } from "react";
import { getOpenAIrequest } from "../api/openai";
import sendIcon from "../assets/send-icon.png";

export default function TripForm({ onTripDataUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    const newMessage = {
      message: input,
      direction: "outgoing",
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getOpenAIrequest([...messages, newMessage]);
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);

      // JSON in console
      console.log(parsed);
      if (content) {
        const chatGPTresponse = {
          message: parsed,
          sender: "ChatGPT",
          displayText: JSON.stringify(parsed, null, 2),
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTresponse]);
        
        // Pass the parsed data to the parent component
        if (onTripDataUpdate) {
          onTripDataUpdate(parsed);
        }
      }
    } catch (error) {
      console.log("Error message - ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/3 flex items-center flex-col bg-gray-100 h-screen overflow-y-hidden">
      <div className="flex-1 overflow-y-auto px-3 pt-12 pb-12 space-y-4 w-full">
        {messages.map((m, id) => {
          return (
            <div
              key={id}
              className={`${
                m.sender === "user"
                  ? "float-right bg-dark-purple text-white rounded-br-sm"
                  : "float-left bg-white max-w-4/5 rounded-bl-sm"
              } px-6 py-4 rounded-xl`}
            >
              {m.sender === "user" ? m.message : m.message.conversation_text}
            </div>
          );
        })}
        {isLoading && (
          <div className="clear-both flex items-center">
            <div className="flex gap-2 items-center">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-600 rounded-full animate-[bounce_1s_infinite_100ms]"></div>
                <div className="h-2 w-2 bg-gray-600 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSendRequest}
        className="container mx-auto pt-6 px-3"
      >
        <div className="mb-6 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            id="text"
            className="block w-full bg-white p-6 pr-16 rounded-2xl drop-shadow-xl font-medium placeholder-purple"
            placeholder="Ask me anything..."
            required
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-dark-purple text-white p-4 rounded-xl cursor-pointer mr-1 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <img className="w-5 h-5" src={sendIcon} alt="Send" />
          </button>
        </div>
      </form>
    </div>
  );
}
