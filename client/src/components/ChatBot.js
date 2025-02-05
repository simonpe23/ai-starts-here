// client/src/components/ChatBot.js
import React, { useState } from 'react';
import './ChatBot.css';

const presetPrompts = [
  "What AI-tools can improve my website?",
  "How can AI streamline customer support?",
  "What automation can boost productivity?",
];

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome! Paste your website URL to get started or select a prompt below.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add the user message
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("Server responded with an error:", response.statusText);
        setMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", sender: "bot" }]);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.reply) {
        setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      setMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", sender: "bot" }]);
    }
  };

  // Handler for preset prompt buttons
  const handlePresetClick = (prompt) => {
    setInput(prompt);
  };

  // Send the message when Enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input-area">
          <input
            type="text"
            placeholder="Type your prompt here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="preset-prompts">
          {presetPrompts.map((prompt, index) => (
            <button key={index} onClick={() => handlePresetClick(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
