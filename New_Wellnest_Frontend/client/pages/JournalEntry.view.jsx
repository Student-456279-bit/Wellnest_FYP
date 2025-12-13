import React from "react";
import { ArrowLeft, Save, Smile, Meh, Frown, Sun, Cloud, Moon, Star } from "lucide-react";

export default function JournalEntryView({ entry, setEntry, onSave, onCancel, isReadOnly }) {

    const moods = [
        { name: "Happy", icon: Smile, color: "text-green-500 bg-green-50" },
        { name: "Calm", icon: Sun, color: "text-yellow-500 bg-yellow-50" },
        { name: "Neutral", icon: Meh, color: "text-slate-500 bg-slate-50" },
        { name: "Sad", icon: Frown, color: "text-blue-500 bg-blue-50" },
        { name: "Grateful", icon: Star, color: "text-purple-500 bg-purple-50" },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Journal
                </button>
                <span className="text-slate-400 text-sm">{entry.date}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[600px] flex flex-col">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Title of your entry..."
                    value={entry.title}
                    readOnly={isReadOnly}
                    onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                    className="text-3xl font-bold text-slate-900 placeholder-slate-300 border-none focus:ring-0 w-full mb-6 p-0"
                />

                {/* Mood Selector */}
                {!isReadOnly && (
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                        {moods.map((m) => {
                            const Icon = m.icon;
                            const isSelected = entry.mood === m.name;
                            return (
                                <button
                                    key={m.name}
                                    onClick={() => setEntry({ ...entry, mood: m.name })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSelected
                                            ? `${m.color} border-current ring-2 ring-offset-1 ring-current/20`
                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{m.name}</span>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Read-only Mood Display */}
                {isReadOnly && entry.mood && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Mood:</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {entry.mood}
                        </span>
                    </div>
                )}

                {/* Content Area */}
                <textarea
                    placeholder="Write your thoughts here..."
                    value={entry.content}
                    readOnly={isReadOnly}
                    onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                    className="flex-1 w-full resize-none border-none focus:ring-0 text-lg text-slate-700 leading-relaxed p-0 placeholder-slate-300"
                />

                {/* Footer Actions */}
                {!isReadOnly && (
                    <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
                        <button
                            onClick={onSave}
                            className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                        >
                            <Save size={20} /> Save Entry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
