import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Maximize2, X, Send, Sparkles } from "lucide-react";

export default function GlobalChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("menu"); // 'menu' | 'chat'
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState([
        { text: "Hi! How can I help you today?", sender: "ai" }
    ]);
    const navigate = useNavigate();

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setMode("menu"); // Reset to menu when opening
    };

    const handleNavigateToFullChat = () => {
        navigate("/wellnest-ai-chatbot");
        setIsOpen(false);
    };

    const handleSend = async () => {
        if (inputText.trim() === "") return;

        // Add user message immediately
        const userMsg = { text: inputText, sender: "user" };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputText("");

        try {
            // Prepare history for backend
            const history = newMessages.map(msg => ({
                role: msg.sender === "user" ? "user" : "bot",
                text: msg.text
            }));

            const response = await fetch("http://localhost:5000/api/chatbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: userMsg.text,
                    history: history,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prev) => [...prev, { text: data.response, sender: "ai" }]);
            } else {
                setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting to my brain right now.", sender: "ai" }]);
            }
        } catch (error) {
            console.error("Chatbot Widget Error:", error);
            setMessages((prev) => [...prev, { text: "Network error. Is the backend running?", sender: "ai" }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Popover Window */}
            {isOpen && (
                <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200 flex flex-col max-h-[500px]">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            <h3 className="font-semibold">WellNest AI</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {mode === "chat" && (
                                <button
                                    onClick={() => setMode("menu")}
                                    className="hover:bg-white/20 p-1 rounded transition-colors text-xs"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={toggleOpen}
                                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-slate-50 min-h-[300px] flex flex-col">

                        {/* MODE: MENU */}
                        {mode === "menu" && (
                            <div className="p-6 flex flex-col gap-4 h-full justify-center">
                                <p className="text-slate-600 text-center mb-2 text-sm">
                                    How would you like to interact?
                                </p>

                                <button
                                    onClick={() => setMode("chat")}
                                    className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all text-left group"
                                >
                                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Quick Chat</h4>
                                        <p className="text-xs text-slate-500">Ask a question right here</p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleNavigateToFullChat}
                                    className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group"
                                >
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Maximize2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Full Experience</h4>
                                        <p className="text-xs text-slate-500">Go to the Chatbot page</p>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* MODE: CHAT (Mini Version) */}
                        {mode === "chat" && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.sender === 'user'
                                                ? "bg-purple-600 text-white self-end ml-auto rounded-tr-none"
                                                : "bg-white text-slate-700 border border-slate-200 self-start mr-auto rounded-tl-none"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 bg-white border-t border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask something..."
                                            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!inputText.trim()}
                                            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen
                    ? "bg-slate-700 text-white rotate-90"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-purple-500/25"
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}
