import React, { useState, useEffect, useRef } from "react";

const AnimatedAvatar = () => {
  const [currentExpression, setCurrentExpression] = useState("neutral");
  const [isNodding, setIsNodding] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glowOpacity, setGlowOpacity] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const avatarRef = useRef(null);
  const recognition = useRef(null);

  // Pulsating glow on hover
  useEffect(() => {
    let intervalId;
    if (isHovered) {
      intervalId = setInterval(() => {
        setGlowOpacity((prevOpacity) =>
          prevOpacity === 0.2 ? 0.4 : 0.2
        );
      }, 500);
    } else {
      setGlowOpacity(0);
    }
    return () => clearInterval(intervalId);
  }, [isHovered]);

  // Nodding on click
  const handleClick = () => {
    setIsNodding(true);
    setTimeout(() => setIsNodding(false), 300);
  };

  // Shaking on double click
  const handleDoubleClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  // Initialize Speech Recognition on component mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false; // Get only final results
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const text = event.results[event.results.length - 1][0].transcript;
        console.log("Speech recognition result:", text);
        handleSpeechRecognitionResult(text);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        console.log("Speech recognition ended.");
        setIsListening(false);
      };
    } else {
      console.error("Speech recognition not supported");
    }
  }, []);

  const startListening = () => {
    if (recognition.current && !isListening) {
      try {
        setIsListening(true);
        recognition.current.start();
        console.log("Speech recognition started.");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      setIsListening(false);
      recognition.current.stop();
      console.log("Speech recognition stopped.");
    }
  };

  const handleSpeechRecognitionResult = async (text) => {
    if (!text) {
      console.warn("Speech recognition result is empty or undefined.");
      return;
    }
  
    setIsListening(false);
  
    // Directly use the text for updating conversation history
    const updatedHistory = [...conversationHistory, { role: "user", content: text }];
  
    setCurrentExpression("thinking");
  
    try {
      // Send updated conversation history to LLM
      const llmResponse = await sendToLLM(updatedHistory);
  
      // Update conversation history with LLM's response AFTER receiving it
      if (llmResponse) {
        setConversationHistory([
          ...updatedHistory,
          { role: "assistant", content: llmResponse },
        ]);
        speak(llmResponse);
      } else {
        console.warn("LLM response was undefined. Skipping speech.");
      }
    } catch (error) {
      console.error("Error handling speech recognition result:", error);
      setCurrentExpression("error"); // Or some other error handling
      return; // Prevent speak(undefined) from being called
    } finally {
      setCurrentExpression("neutral");
    }
  };

  const sendToLLM = async (conversationHistory) => {
    console.log("Conversation history:", conversationHistory);
    // Get the last message in the conversation history
    const userMessage = conversationHistory[conversationHistory.length - 1]?.content;

    // Check if the last message is from the user
    if (conversationHistory[conversationHistory.length - 1]?.role !== "user") {
        console.error("Last message in conversation history is not from the user");
        return;
    }

    const messages = [
      {
        role: "user",
        content: userMessage,
      },
    ];

    console.log("Sending to LLM:", messages);

    let response;
    try {
      response = await fetch("http://localhost:3001/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-2.1",
          max_tokens: 1000,
          messages: messages,
        }),
      });

      console.log("LLM response status:", response.status);

      if (!response.ok) {
        console.error("HTTP error! status:", response.status);
        // Try to read the error response body
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("LLM data:", data);

      if (data.error) {
        console.error("LLM API error:", data.error.message);
        throw new Error(data.error.message);
      }

      if (!data.content || data.content.length === 0) {
        console.error("LLM response missing content:", data);
        throw new Error("No content received from Anthropic API");
      }

      const assistantResponse = data.content[0]?.text;
      if (!assistantResponse) {
        console.error("LLM response missing assistant text:", data);
        throw new Error("Assistant response text is missing");
      }

      return assistantResponse;
    } catch (error) {
      console.error("Error in sendToLLM:", error);
      throw error; // Re-throw the error after logging
    }
  };

  const speak = async (text) => {
    console.log("Text to be spoken:", text);
    try {
      const response = await fetch("http://localhost:3001/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      console.log("TTS response status:", response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("TTS error body:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.audioContent) {
        const audio = new Audio(
          "data:audio/mp3;base64," + data.audioContent
        );
        setCurrentExpression("talking");
        audio.play();
        audio.onended = () => setCurrentExpression("neutral");
      } else {
        throw new Error("No audio content received from TTS API");
      }
    } catch (error) {
      console.error("Error during text-to-speech:", error);
      setCurrentExpression("neutral");
    }
  };

  const handleExpressionChange = (newExpression) => {
    setCurrentExpression(newExpression);
    if (newExpression === "talking" && currentExpression !== "talking") {
      const textToSpeak =
        "Hi I'm Delta, your personal hydrological research assistant. How should we save the world today?";
      speak(textToSpeak);
    }
  };

  // Toggle talking animation
  useEffect(() => {
    if (currentExpression === "talking") {
      const talkingInterval = setInterval(() => {
        setIsTalking((prevIsTalking) => !prevIsTalking);
      }, 300);

      return () => clearInterval(talkingInterval);
    } else {
      setIsTalking(false);
    }
  }, [currentExpression]);

  return (
    <div className="flex flex-col items-center justify-start h-screen p-4 relative">
      <div className="relative mt-20">
        <div
          ref={avatarRef}
          className={`avatar-container relative transition-all duration-300 ease-in-out cursor-pointer
            ${isNodding ? "animate-nod" : ""}
            ${isShaking ? "animate-shake" : ""}
            ${isBouncing ? "animate-bounce" : ""}
            ${isHovered ? "scale-110 brightness-110" : "scale-100"}
            ${currentExpression === "happy" ? "happy" : ""}
            ${currentExpression === "thinking" ? "thinking" : ""}
            ${currentExpression === "cheeky" ? "cheeky" : ""}
            ${currentExpression === "sad" ? "sad" : ""}
            ${isTalking ? "talking animate-pulse-avatar" : ""}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src="/Droplet_avatar.png"
            alt="Water drop avatar"
            className="w-full h-full object-contain avatar-image"
          />

          {/* Glow effect with pulsating opacity */}
          <div
            className={`absolute inset-0 rounded-full bg-blue-400 blur-xl transition-opacity duration-300`}
            style={{ opacity: glowOpacity }}
          />
        </div>

        {/* Expression Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleExpressionChange("neutral")}
          >
            Neutral
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleExpressionChange("thinking")}
          >
            Thinking
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleExpressionChange("happy")}
          >
            Happy
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleExpressionChange("cheeky")}
          >
            Cheeky
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleExpressionChange("talking")}
          >
            Talking
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
      </div>
    </div>
  );
};

export default AnimatedAvatar;