import React from "react";
import {
  BookOpen,
  Plus,
  Zap,
  Heart,
  Target,
  ArrowRight,
} from "lucide-react";

export default function JournalView({
  data,
  onNewEntry,
  onStartTemplate,
  onOpenEntry,
  onWriteAboutPrompt
}) {
  const { todayPrompt, quickTemplates, pastEntries } = data;

  const handleNewEntryClick = onNewEntry;
  const handleWriteAboutItClick = onWriteAboutPrompt;
  const handleStartTemplateClick = onStartTemplate;
  const handleOpenEntryClick = (path) => {
    // Extract ID from path "/journal/entry/1"
    const id = path.split("/").pop();
    onOpenEntry(id);
  };

  return (
    <div className="w-full pt-8 pb-8"> {/* Added a light background color to match the image */}
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={24} className="text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Daily Journal</h1>
          </div>
          <p className="text-slate-600">Reflect, release, and rediscover yourself.</p>
        </div>

        {/* New Journal Entry Button */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-md mb-8">
          <button
            onClick={handleNewEntryClick}
            className="w-full text-white py-3 rounded-md flex items-center justify-center gap-2 text-lg font-semibold hover:bg-opacity-90 transition-opacity"
          >
            <Plus size={24} /> New Journal Entry
          </button>
        </div>

        {/* Today's Prompt */}
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-100 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-yellow-600" />
            <p className="text-slate-700 font-medium">Today's Prompt: <span className="text-slate-900">{todayPrompt}</span></p>
          </div>
          <button
            onClick={handleWriteAboutItClick}
            className="text-yellow-700 hover:text-yellow-800 font-semibold text-sm transition-colors"
          >
            Write About It
          </button>
        </div>

        {/* Quick Start Templates */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Quick Start Templates</h2>
          <p className="text-slate-600 mb-4">Choose a template to begin writing</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickTemplates.map((template, index) => {
              const Icon = template.icon === "Heart" ? Heart : template.icon === "BookOpen" ? BookOpen : Target; // Map string to Lucide icon
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 ${template.icon === "Heart" ? 'bg-purple-100 text-purple-600' : template.icon === "BookOpen" ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <button
                    onClick={() => handleStartTemplateClick(template.path)}
                    className="text-purple-600 font-medium text-sm flex items-center gap-1 group"
                  >
                    <span>Start Template</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Past Journal Entries */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Past Journal Entries</h2>
            <button
              className="text-purple-600 font-medium text-sm hover:underline"
              onClick={() => console.log("View All Past Entries")}
            >
              View All &gt;
            </button>
          </div>
          <div className="space-y-4">
            {pastEntries.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-700 mb-1">
                    {entry.date} <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded ml-2">{entry.mood}</span>
                  </p>
                  <p className="text-base text-slate-900 line-clamp-2">{entry.content}</p>
                </div>
                <button
                  onClick={() => handleOpenEntryClick(entry.path)}
                  className="text-purple-600 font-medium text-sm flex items-center gap-1 group flex-shrink-0 ml-4"
                >
                  <span>Open Entry</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}