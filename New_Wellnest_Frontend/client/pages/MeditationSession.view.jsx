import React from "react";
import { ArrowLeft, Clock, Cloud, Heart, Users, Sparkles, Brain, Activity } from "lucide-react";

export default function MeditationSessionView({ session, onBack }) {
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Session Not Found</h2>
                <button onClick={onBack} className="text-purple-600 hover:underline">
                    Back to Meditation
                </button>
            </div>
        );
    }

    const { title, subtitle, duration, mood, description, steps, method, color } = session;

    const getThemeColor = (c) => {
        switch (c) {
            case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'teal': return 'text-teal-600 bg-teal-50 border-teal-200';
            case 'pink': return 'text-pink-600 bg-pink-50 border-pink-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    }

    const themeClass = getThemeColor(color);
    const accentColor = themeClass.split(' ')[0]; // e.g., text-purple-600

    return (
        <div className="w-full pt-8 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className={`flex items-center gap-2 font-medium mb-6 hover:opacity-80 transition-opacity ${accentColor}`}
                >
                    <ArrowLeft size={18} /> Back to Sessions
                </button>

                {/* Header */}
                <div className={`p-8 rounded-2xl mb-8 ${themeClass.replace('border-', 'border-2 ')}`}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h5 className={`uppercase tracking-wider text-xs font-bold mb-2 opacity-70`}>{subtitle}</h5>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h1>
                        </div>
                        <div className={`p-3 rounded-full bg-white bg-opacity-60`}>
                            {color === 'purple' && <Brain size={32} className={accentColor} />}
                            {color === 'blue' && <Heart size={32} className={accentColor} />}
                            {color === 'teal' && <Users size={32} className={accentColor} />}
                            {color === 'pink' && <Sparkles size={32} className={accentColor} />}
                        </div>
                    </div>

                    <p className="text-lg text-slate-700 leading-relaxed mb-6">{description}</p>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white bg-opacity-60 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                            <Clock size={16} /> {duration}
                        </div>
                        <div className="flex items-center gap-2 bg-white bg-opacity-60 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm">
                            <Cloud size={16} /> Mood: {mood}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-8">

                    {/* Steps / Timing */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Activity size={20} className="text-slate-400" />
                            <h2 className="text-xl font-bold text-slate-900">Session Breakdown</h2>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            {steps.map((step, index) => (
                                <div key={index} className="flex p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    <div className="w-24 flex-shrink-0 font-mono text-sm font-semibold text-slate-500 pt-1">
                                        {step.time}
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold text-sm mb-1 ${accentColor}`}>{step.phase}</h4>
                                        <p className="text-slate-600 text-sm">{step.instruction}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Method Details */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={20} className="text-slate-400" />
                            <h2 className="text-xl font-bold text-slate-900">The Method</h2>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                            {Object.entries(method).map(([key, value], index) => (
                                <div key={index}>
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-1 opacity-70">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    <p className="text-slate-700 text-lg leading-relaxed italic">
                                        "{value.replace(/"/g, '')}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
