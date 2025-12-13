import React from "react";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Lightbulb,
  User,
  Heart,
  Leaf,
  PauseCircle,
  Clock,
  BatteryCharging, // Using BatteryCharging for 'Beginner' or 'Intermediate' for visual distinction
  TrendingUp,
  ArrowRight,
  Brain,
} from "lucide-react";

export default function MeditationView({
  data,
  onStartSession,
  onBackToDashboard,
  onCategoryClick
}) {
  const {
    category,
    description,
    recommendedSession,
    availableSessions,
    benefits,
    youMightAlsoLike,
  } = data;

  const handleStartSession = onStartSession;
  const handleBackToDashboard = onBackToDashboard;
  const handleCategoryClick = onCategoryClick;

  const getSessionButtonClasses = (color) => {
    const base = "w-full text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity";
    switch (color) {
      case "purple": return `${base} bg-purple-600`;
      case "blue": return `${base} bg-blue-600`;
      case "teal": return `${base} bg-teal-600`;
      case "pink": return `${base} bg-pink-600`;
      default: return `${base} bg-gray-600`;
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const base = "text-xs font-semibold px-2 py-0.5 rounded-full";
    return difficulty === "Beginner"
      ? `${base} bg-green-100 text-green-700`
      : `${base} bg-orange-100 text-orange-700`;
  };

  return (
    <div className="w-full pt-8 pb-8">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Back to Dashboard / Category Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain size={24} className="text-slate-700" />
              <h1 className="text-2xl font-bold text-slate-900">Meditation</h1>
            </div>
            <p className="text-slate-600">Find clarity, peace, and balance.</p>
          </div>
          {/* Top Right Meditation Icon */}
          <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center -mt-4 mr-4">
            <img src="/meditation.png" alt="Meditation Icon" className="w-20 h-20 object-contain" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-lg shadow-xl -mt-16 mb-8">
          <h1 className="text-3xl font-bold mb-3">{category}</h1>
          <p className="text-purple-100 text-lg max-w-2xl">{description}</p>
        </div>

        {/* Recommended Session Card */}
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Sparkles size={24} className="text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-700 mb-1">{recommendedSession.prompt}</p>
              <p className="text-slate-700 text-sm">{recommendedSession.intro}</p>
            </div>
          </div>
          <button
            onClick={() => handleStartSession("recommended")}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition-colors flex-shrink-0"
          >
            {recommendedSession.buttonText}
          </button>
        </div>

        {/* Available Sessions Section */}
        <div className="mb-8" id="available-sessions">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Available Sessions</h2>
          <p className="text-slate-600 mb-4">Choose a meditation that fits your schedule</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableSessions.map((session) => {
              const Icon =
                session.icon === "Lightbulb"
                  ? Lightbulb
                  : session.icon === "User"
                    ? User
                    : session.icon === "Heart"
                      ? Heart
                      : session.icon === "PauseCircle"
                        ? PauseCircle
                        : Sparkles; // Default if no match
              return (
                <div key={session.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">{session.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={16} /> {session.duration}
                        <span className={getDifficultyBadge(session.difficulty)}>
                          {session.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartSession(session.id)}
                    className={getSessionButtonClasses(session.color)}
                  >
                    Start Session <ArrowRight size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Benefits of Stress Relief Meditation</h2>
          <p className="text-slate-600 mb-4">What you'll gain from regular practice</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon =
                benefit.icon === "Heart"
                  ? Heart
                  : benefit.icon === "Leaf"
                    ? Leaf
                    : PauseCircle; // Default if no match
              return (
                <div key={benefit.id} className={`${benefit.bgColor} p-6 rounded-lg shadow-sm border ${benefit.bgColor.replace('50', '100')}`}>
                  <div className={`w-10 h-10 ${benefit.textColor.replace('700', '600')} ${benefit.bgColor.replace('50', '200')} rounded-full flex items-center justify-center mb-4`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
}