import React, { useState } from "react";
import {
  Leaf,
  Zap,
  Apple,
  Moon,
  Flame,
  Dumbbell,
  TrendingUp,
  Sparkles,
  HelpCircle,
  Send,
} from "lucide-react";

export default function ChatbotView() {
  const [inputText, setInputText] = useState("");
  
  // Data for the Quick Actions buttons
  const quickActions = [
    { label: "Create a Goal", icon: Zap, color: "purple" },
    { label: "Nutrition Suggestions", icon: Apple, color: "green" },
    { label: "Improve My Sleep", icon: Moon, color: "indigo" },
    { label: "Stress Relief Help", icon: Flame, color: "orange" },
    { label: "Workout Guidance", icon: Dumbbell, color: "teal" },
    { label: "Show My Progress", icon: TrendingUp, color: "pink" },
    { label: "Motivation Boost", icon: Sparkles, color: "yellow" },
    { label: "Ask a Wellness Question", icon: HelpCircle, color: "cyan" },
  ];

  const handleActionClick = (actionLabel) => {
    console.log(`Action clicked: ${actionLabel}`);
  };

  const handleSend = () => {
    if (inputText.trim() === "") return;
    console.log(`Sending message: ${inputText}`);
    setInputText("");
  };

  const getButtonClasses = (color) => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap hover:shadow-md";
    switch (color) {
      case "purple": return `${base} bg-purple-100 text-purple-700`;
      case "green": return `${base} bg-green-100 text-green-700`;
      case "indigo": return `${base} bg-indigo-100 text-indigo-700`;
      case "orange": return `${base} bg-orange-100 text-orange-700`;
      case "teal": return `${base} bg-teal-100 text-teal-700`;
      case "pink": return `${base} bg-pink-100 text-pink-700`;
      case "yellow": return `${base} bg-yellow-100 text-yellow-700`;
      case "cyan": return `${base} bg-cyan-100 text-cyan-700`;
      default: return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    // Outer wrapper (Ensures proper spacing and doesn't interfere with Layout)
    <div className="w-full pt-8 pb-8"> 
      
      {/* 1. Central White Card Container (Main Chat Window) */}
      {/* h-[80vh] gives a clean, defined height for the chat interface */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl flex flex-col h-[80vh]"> 

        {/* 2. Scrollable Message and Quick Actions Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6"> 
          
          {/* Assistant Initial Message Bubble */}
          <div className="flex justify-start">
            <div className="bg-purple-50 p-6 rounded-3xl rounded-tl-lg max-w-md shadow-sm border border-purple-100">
              <h2 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
                Hi, I'm your WellNest AI Assistant <Leaf size={20} className="text-green-600" />
              </h2>
              <p className="text-slate-600 mb-4 text-sm">I can help you with:</p>
              <ul className="text-slate-700 text-sm list-disc pl-5 space-y-1 mb-6">
                <li>Creating or adjusting goals</li>
                <li>Nutrition and meal guidance</li>
                <li>Sleep and stress improvement</li>
                <li>Workout support</li>
                <li>Motivation and daily coaching</li>
                <li>Viewing or updating progress</li>
                <li>General wellness questions</li>
              </ul>
              <p className="text-slate-900 font-semibold">How can I support you today?</p>
            </div>
          </div>
          
          {/* Quick Actions Section (Placed inside the scrollable area) */}
          <div className="mt-6">
            <h3 className="text-slate-600 font-medium mb-3">Quick Actions:</h3>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleActionClick(action.label)}
                    className={getButtonClasses(action.color)}
                  >
                    <Icon size={16} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div> 

        {/* 3. Input Field (Integrated into the Container Footer - Fixed within the card) */}
        <div className="border-t border-slate-200 p-4"> 
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Ask anything about your wellness..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-grow p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
            />
            <button
              onClick={handleSend}
              disabled={inputText.trim() === ""}
              className="bg-purple-600 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
            >
              <Send size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}