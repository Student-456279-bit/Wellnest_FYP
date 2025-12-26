import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Dumbbell,
    Target,
    Leaf,
    Layers,
    CheckCircle,
    XCircle,
    Zap,
    Clock,
    PlayCircle,
    Info,
} from "lucide-react";

export default function ExerciseDetailsView({ exercise }) {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/workout");
    };

    // Utility function to determine badge styling
    const getBadgeClass = (value, type) => {
        const base = "text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap inline-flex items-center gap-1.5";
        if (type === 'safety') {
            return value === 'yes' ? `${base} bg-green-100 text-green-700` : `${base} bg-red-100 text-red-700`;
        }
        if (type === 'equipment') {
            return value === 'yes' ? `${base} bg-orange-100 text-orange-700` : `${base} bg-blue-100 text-blue-700`;
        }
        if (type === 'stretch') {
            return `${base} bg-purple-100 text-purple-700`;
        }
        return `${base} bg-slate-100 text-slate-600`;
    };

    return (
        <div className="w-full pt-8 pb-8">
            <div className="max-w-5xl mx-auto px-4">

                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Exercises
                </button>

                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Target size={24} className="text-white" />
                                </div>
                                <h1 className="text-4xl font-bold">{exercise.exercise_name}</h1>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                                <span className={getBadgeClass(exercise.main_muscle)}>
                                    <Layers size={16} /> {exercise.main_muscle}
                                </span>
                                <span className={getBadgeClass(exercise.stretch_type, 'stretch')}>
                                    <Zap size={16} /> {exercise.stretch_type.charAt(0).toUpperCase() + exercise.stretch_type.slice(1)} Stretch
                                </span>
                                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                                    <Clock size={16} /> {exercise.duration_seconds} seconds
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Video/Animation */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <PlayCircle size={24} className="text-purple-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Exercise Demonstration</h2>
                            </div>
                            <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden relative">
                                {exercise.video_url ? (
                                    <>
                                        <img
                                            src={exercise.video_url}
                                            alt={`${exercise.exercise_name} demonstration`}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                                            <div className="text-center p-8">
                                                <Dumbbell size={64} className="mx-auto text-purple-400 mb-4 animate-pulse" />
                                                <p className="text-slate-700 font-semibold mb-2">Exercise Demonstration</p>
                                                <p className="text-slate-500 text-sm">Visual guide for {exercise.exercise_name}</p>
                                                <p className="text-slate-400 text-xs mt-2">Follow the instructions below for proper form</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                                        <div className="text-center p-8">
                                            <Dumbbell size={64} className="mx-auto text-purple-400 mb-4 animate-pulse" />
                                            <p className="text-slate-700 font-semibold mb-2">Exercise Demonstration</p>
                                            <p className="text-slate-500 text-sm">Visual guide for {exercise.exercise_name}</p>
                                            <p className="text-slate-400 text-xs mt-2">Follow the instructions below for proper form</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Info size={24} className="text-purple-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Instructions</h2>
                            </div>

                            <div className="space-y-6">
                                {exercise.preparation && exercise.preparation !== '0' && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Leaf size={18} className="text-purple-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800">Preparation</h3>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed ml-10">{exercise.preparation}</p>
                                    </div>
                                )}

                                {exercise.execution && exercise.execution !== '0' && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Zap size={18} className="text-indigo-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800">Execution</h3>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed ml-10">{exercise.execution}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metadata */}
                    <div className="space-y-6">
                        {/* Exercise Details Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Target size={20} className="text-purple-600" />
                                Exercise Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Body Area</p>
                                    <p className="text-slate-900 font-medium capitalize">
                                        {exercise.body_area.replace(/_/g, ' ')}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Duration</p>
                                    <p className="text-slate-900 font-medium">{exercise.duration_seconds} seconds</p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Stretch Type</p>
                                    <p className="text-slate-900 font-medium capitalize">{exercise.stretch_type}</p>
                                </div>
                            </div>
                        </div>

                        {/* Equipment Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Dumbbell size={20} className="text-purple-600" />
                                Equipment
                            </h3>
                            <span className={getBadgeClass(exercise.needs_equipment, 'equipment')}>
                                {exercise.needs_equipment === 'yes' ? (
                                    <>
                                        <CheckCircle size={16} /> Equipment Required
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} /> No Equipment Needed
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Safety Information Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <CheckCircle size={20} className="text-purple-600" />
                                Safety Information
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Knee Injury Safety</p>
                                    <span className={getBadgeClass(exercise.safe_for_knee_injury, 'safety')}>
                                        {exercise.safe_for_knee_injury === 'yes' ? (
                                            <>
                                                <CheckCircle size={16} /> Safe
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={16} /> Not Recommended
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Back Injury Safety</p>
                                    <span className={getBadgeClass(exercise.safe_for_back_injury, 'safety')}>
                                        {exercise.safe_for_back_injury === 'yes' ? (
                                            <>
                                                <CheckCircle size={16} /> Safe
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={16} /> Not Recommended
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tip Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md p-6 border border-purple-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Info size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Pro Tip</h4>
                                    <p className="text-sm text-slate-700">
                                        Hold each stretch for {exercise.duration_seconds} seconds and breathe deeply.
                                        Never bounce or force a stretch beyond your comfort zone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
