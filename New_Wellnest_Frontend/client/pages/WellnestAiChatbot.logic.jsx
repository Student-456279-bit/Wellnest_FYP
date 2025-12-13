import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import WellnestAiChatbotView from "./WellnestAiChatbot.view.jsx";

export default function WellnestAiChatbotLogic() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const recognitionRef = useRef(null);
  const messagesRef = useRef(messages); // Keep track of latest messages

  // Update ref whenever messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load Voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Construct a default voice preference
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // We need a stable ref to the function so the onresult closure calls the latest version
  const handleSendMessageRef = useRef(null);

  // Initialize Speech Recognition (Run once)
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one sentence/phrase
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US"; // Default, can auto-detect usually or be switched

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Use the Ref to get the LATEST handleSendMessage logic
        if (handleSendMessageRef.current) {
          handleSendMessageRef.current(transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []); // Run once on mount

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    // Stop any current speaking
    window.speechSynthesis.cancel();

    // Strip Markdown for clearer speech
    const cleanText = text.replace(/[*#_`]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Use REF for current messages state to avoid stale closure issues
    const currentMessages = messagesRef.current;

    // Add user message immediately
    const userMsg = { role: "user", text };
    const newMessages = [...currentMessages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const history = newMessages.map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const response = await fetch("http://localhost:5000/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          history: history,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting to my brain right now." }]);
        console.error("Chatbot Error:", data.error);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "Network error. Please ensure the backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Keep the Ref updated with the latest function
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  const handleQuickAction = (label) => {
    const promptMap = {
      "Create a Goal": "Help me set a realistic wellness goal.",
      "Nutrition Suggestions": "Give me some healthy nutrition tips.",
      "Improve My Sleep": "How can I improve my sleep quality?",
      "Stress Relief Help": "I'm feeling stressed, what should I do?",
      "Workout Guidance": "Suggest a simple workout routine.",
      "Show My Progress": "How can I track my wellness progress?",
      "Motivation Boost": "Give me a motivational quote.",
      "Ask a Wellness Question": "I have a general wellness question."
    };

    const text = promptMap[label] || label;
    handleSendMessage(text);
  };

  return (
    <Layout>
      <WellnestAiChatbotView
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
        messagesEndRef={messagesEndRef}
        isListening={isListening}
        onToggleListening={toggleListening}
        onSpeak={speakText}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        voices={voices}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
      />
    </Layout>
  );
}
