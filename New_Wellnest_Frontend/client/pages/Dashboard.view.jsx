import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Apple, BookOpen, MessageCircle, Heart, ArrowRight } from "lucide-react";

export default function DashboardView() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalEntries] = useState(3);

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
              onClick={() => setSelectedMood(mood.label)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                selectedMood === mood.label
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
        {/* Goals Follow-Up Card */}
        <button
          onClick={() => handleCardClick("/goals")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Goals Follow-Up</h3>
          </div>
          <p className="text-sm text-slate-600 mb-6">Your weekly wellness consistency</p>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="157 314"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">100</p>
                  <p className="text-xs text-slate-600">%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>View Stats</span>
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

        {/* Wellness Plan Card */}
        <button
          onClick={() => handleCardClick("/form")}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow text-left group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Wellness Plan</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Your personalized daily wellness tasks</p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={true} readOnly className="w-4 h-4 rounded" />
              <span className="text-sm text-slate-700">Morning yoga</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={true} readOnly className="w-4 h-4 rounded" />
              <span className="text-sm text-slate-700">Healthy breakfast</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" readOnly className="w-4 h-4 rounded" />
              <span className="text-sm text-slate-700">Evening walk</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-red-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>View Full Plan</span>
            <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </div>
  );
}
