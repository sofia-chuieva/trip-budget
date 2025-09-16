import { useState } from "react";
import { getOpenAIrequest } from "../api/openai";

export default function TripForm() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendRequest = async (e) => {
    e.preventDefault();
    const newMessage = {
      message: input,
      direction: "outgoing",
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      const response = await getOpenAIrequest([...messages, newMessage]);
      const content = response.choices[0].message.content;
      // JSON in console
      console.log(JSON.parse(content));
      if (content) {
        const chatGPTresponse = {
          message: content,
          sender: "ChatGPT",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTresponse]);
      }
    } catch (error) {
      console.log("Error message - ", error);
    }
  };

  return (
    <div className="w-1/3 flex items-center flex-col gap-20 justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSendRequest} className="container mx-auto px-3">
        <div className="mb-6">
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Text
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            id="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
      <div className="px-3">
        {messages.map((m, id) => {
          return (
            <div key={id}>
              <div>{m.sender}</div>
              <p>{m.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
