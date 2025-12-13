import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Apple, BookOpen, MessageCircle, Heart, ArrowRight, Brain } from "lucide-react";

// Redirect Modal Component
const RedirectModal = ({ isOpen, onClose, mood, countdown }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={32} className="text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Check-in Detected</h3>
        <p className="text-slate-600 mb-6">
          Redirecting to your journal to write about feeling <span className="font-semibold text-purple-600">{mood}</span>...
        </p>

        <div className="mb-6">
          <div className="text-4xl font-bold text-purple-600 mb-1">{countdown}</div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">Seconds</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
        >
          Cancel Navigation
        </button>
      </div>
    </div>
  );
};

export default function DashboardView() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalEntries] = useState(3);

  // Redirect Modal State
  const [redirectModal, setRedirectModal] = useState({
    isOpen: false,
    mood: "",
    count: 5
  });

  // Handle Mood Click
  const handleMoodClick = (moodLabel) => {
    setSelectedMood(moodLabel);
    setRedirectModal({
      isOpen: true,
      mood: moodLabel,
      count: 5
    });
  };

  // Close Modal
  const closeRedirectModal = () => {
    setRedirectModal(prev => ({ ...prev, isOpen: false }));
  };

  // Countdown Effect
  React.useEffect(() => {
    let timer;
    if (redirectModal.isOpen && redirectModal.count > 0) {
      timer = setTimeout(() => {
        setRedirectModal(prev => ({ ...prev, count: prev.count - 1 }));
      }, 1000);
    } else if (redirectModal.isOpen && redirectModal.count === 0) {
      // Time's up -> Redirect
      const promptText = `Why are you feeling ${redirectModal.mood} right now?`;
      navigate(`/journal/new?template=prompt&prompt=${encodeURIComponent(promptText)}&mood=${encodeURIComponent(redirectModal.mood)}`);
      closeRedirectModal();
    }
    return () => clearTimeout(timer);
  }, [redirectModal.isOpen, redirectModal.count, redirectModal.mood, navigate]);

  const moods = [
    { emoji: "😊", label: "Great" },
    { emoji: "😄", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😰", label: "Stressed" },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full">
      <RedirectModal
        isOpen={redirectModal.isOpen}
        onClose={closeRedirectModal}
        mood={redirectModal.mood}
        countdown={redirectModal.count}
      />

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back! 👋</h1>
        <p className="text-slate-600">How are you feeling today?</p>
      </div>

      {/* Mood Check-in Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Check in with yourself</h2>
        <div className="flex justify-between gap-4">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodClick(mood.label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${selectedMood === mood.label
                ? "bg-purple-100 border-2 border-purple-500"
                : "hover:bg-slate-50 border border-transparent"
                }`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-slate-700">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Affirmation Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">✨</span>
          <h3 className="text-sm font-semibold">Today's Affirmation</h3>
        </div>
        <p className="text-2xl font-bold mb-2">"Progress, not perfection."</p>
        <p className="text-purple-100 text-sm">Remember to be kind to yourself today.</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals Card */}
        <button
          onClick={() => handleCardClick("/goals")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Wellness Goals</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Your personalized daily wellness tasks</p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={false} readOnly className="w-4 h-4 rounded accent-purple-600 pointer-events-none" />
              <span className="text-sm text-slate-700">Meditation or Praying</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={false} readOnly className="w-4 h-4 rounded accent-purple-600 pointer-events-none" />
              <span className="text-sm text-slate-700">Daily Exercise</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={false} readOnly className="w-4 h-4 rounded accent-purple-600 pointer-events-none" />
              <span className="text-sm text-slate-700">Food Intake</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={false} readOnly className="w-4 h-4 rounded accent-purple-600 pointer-events-none" />
              <span className="text-sm text-slate-700">Hydration</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={false} readOnly className="w-4 h-4 rounded accent-purple-600 pointer-events-none" />
              <span className="text-sm text-slate-700">Sleep Schedule</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-red-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>View Full Goals</span>
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Nutrition Card */}
        <button
          onClick={() => handleCardClick("/nutrition")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Apple size={20} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Nutrition</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Meal plans & daily food tracking</p>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-600">Calorie Calories</span>
              <span className="text-sm font-semibold text-slate-900">2,401 / 2,000</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <p className="text-xs text-slate-600">Protein</p>
              <p className="font-semibold text-slate-900 text-sm">65g</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-600">Carbs</p>
              <p className="font-semibold text-slate-900 text-sm">180g</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-600">Fats</p>
              <p className="font-semibold text-slate-900 text-sm">63g</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Track Meal</span>
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Analytics Card */}
        <button
          onClick={() => handleCardClick("/analytics")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Analytics</h3>
          </div>
          <p className="text-sm text-slate-600 mb-6">Track your wellness progress and insights</p>
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-600">Overall Score</span>
                <span className="text-sm font-semibold text-slate-900">78%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-600">Goals Achieved</span>
                <span className="text-sm font-semibold text-slate-900">12/15</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>View Analytics</span>
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Journal Card */}
        <button
          onClick={() => handleCardClick("/journal")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Journal</h3>
            </div>
            <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-1 rounded">
              {journalEntries} entries this week
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4">Reflect on your day and track your thoughts</p>
          <p className="text-xs text-slate-500 italic mb-4">"Stay productive and grateful..."</p>
          <div className="flex items-center gap-1 text-pink-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Write Entry</span>
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Meditation Card */}
        <button
          onClick={() => handleCardClick("/meditation")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Brain size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Meditation</h3>
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
              10 mins today
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4">Find your inner peace and clarity</p>
          <p className="text-xs text-slate-500 italic mb-4">"Quiet the mind, and the soul will speak."</p>
          <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Start Session</span>
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Chat with Wellnest AI Card */}
        <button
          onClick={() => handleCardClick("/wellnest-ai-chatbot")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={20} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Chat with Wellnest AI</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Your AI wellness companion is here to help</p>
          <p className="text-xs text-slate-500 italic mb-4">"How can I support your wellness journey today?"</p>
          <div className="flex items-center gap-1 text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Start Chat</span>
            <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </div>
  );
}
