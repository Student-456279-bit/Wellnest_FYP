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
  User,
  Bot,
  Mic,
  MicOff,
  Volume2
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatbotView({
  messages,
  isTyping,
  onSendMessage,
  onQuickAction,
  messagesEndRef,
  isListening,
  onToggleListening,
  onSpeak,
  isSpeaking,
  onStopSpeaking,
  voices,
  selectedVoice,
  onVoiceChange
}) {
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

  const handleSend = () => {
    if (inputText.trim() === "") return;
    onSendMessage(inputText);
    setInputText("");
  };

  const getButtonClasses = (color) => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap hover:shadow-md";
    switch (color) {
      case "purple": return `${base} bg-purple-100 text-purple-700 hover:bg-purple-200`;
      case "green": return `${base} bg-green-100 text-green-700 hover:bg-green-200`;
      case "indigo": return `${base} bg-indigo-100 text-indigo-700 hover:bg-indigo-200`;
      case "orange": return `${base} bg-orange-100 text-orange-700 hover:bg-orange-200`;
      case "teal": return `${base} bg-teal-100 text-teal-700 hover:bg-teal-200`;
      case "pink": return `${base} bg-pink-100 text-pink-700 hover:bg-pink-200`;
      case "yellow": return `${base} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`;
      case "cyan": return `${base} bg-cyan-100 text-cyan-700 hover:bg-cyan-200`;
      default: return `${base} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    }
  };

  return (
    // Outer wrapper (Ensures proper spacing and doesn't interfere with Layout)
    <div className="w-full pt-4 pb-4 h-[calc(100vh-100px)] flex flex-col">

      {/* 1. Main Chat Window */}
      <div className="flex-grow w-full max-w-5xl mx-auto bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-slate-100">

        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Leaf size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">WellNest AI</h1>
              <p className="text-purple-100 text-xs">Holistic Wellness Assistant</p>
            </div>
          </div>

          {/* Voice Settings */}
          {voices && voices.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="bg-purple-700 text-white text-xs border border-purple-500 rounded p-1 max-w-[150px]"
                value={selectedVoice ? selectedVoice.name : ""}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  onVoiceChange(voice);
                }}
              >
                {voices.map((v, i) => (
                  <option key={i} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 2. Scrollable Message Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">

          {/* Assistant Initial Message Bubble */}
          {messages.length === 0 && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-white p-6 rounded-3xl rounded-tl-sm max-w-md shadow-sm border border-slate-100">
                <h2 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
                  Hi, I'm your WellNest AI Assistant <Leaf size={20} className="text-green-600" />
                </h2>
                <p className="text-slate-600 mb-4 text-sm">I can help you with:</p>
                <ul className="text-slate-700 text-sm list-disc pl-5 space-y-1 mb-6">
                  <li>Creating or adjusting goals</li>
                  <li>Nutrition and meal guidance</li>
                  <li>Sleep and stress improvement</li>
                  <li>Motivation and daily coaching</li>
                </ul>
                <p className="text-slate-900 font-semibold">How can I support you today?</p>
              </div>
            </div>
          )}

          {/* Chat History */}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`
                    max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative group
                    ${msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-sm'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}
                 `}>
                {/* Icon for Bot */}
                {msg.role === 'bot' && (
                  <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Bot size={16} className="text-purple-600" />
                      <span className="font-bold text-xs text-purple-600 uppercase tracking-wider">WellNest AI</span>
                    </div>
                    {/* Speak Button for Bot Messages */}
                    <button
                      onClick={() => onSpeak(msg.text)}
                      className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                      title="Read Aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}

                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'text-slate-700'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Input & Quick Actions Fixed at Bottom */}
        <div className="bg-white border-t border-slate-200 p-4">
          {/* Quick Actions (Horizontal Scroll) */}
          <div className="mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 w-max px-1">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => onQuickAction(action.label)}
                    className={getButtonClasses(action.color)}
                  >
                    <Icon size={16} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Field */}
          <div className="flex items-center gap-3">
            {/* Mic Button */}
            <button
              onClick={onToggleListening}
              className={`p-3 rounded-full transition-all ${isListening
                ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-400'
                : 'bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-purple-600'
                }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Stop Speaking Button (Visible only when speaking) */}
            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors animate-fade-in-up"
                title="Stop Speaking"
              >
                <Volume2 size={20} className="line-through" />
              </button>
            )}

            <input
              type="text"
              placeholder={isListening ? "Listening..." : "Ask anything about your wellness..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              disabled={isListening}
              className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all disabled:bg-slate-100"
            />
            <button
              onClick={handleSend}
              disabled={inputText.trim() === "" || isTyping}
              className="bg-purple-600 text-white p-3 rounded-xl shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}