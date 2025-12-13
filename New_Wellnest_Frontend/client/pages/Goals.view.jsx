import React from "react";
import { Sparkles, CheckCircle2, Plus } from "lucide-react";


import { Link } from "react-router-dom";

// Modal Component for Updating Progress
function UpdateProgressModal({ isOpen, onClose, goal, onConfirm }) {
  const [value, setValue] = React.useState("");

  // Prefill with current value when goal changes
  React.useEffect(() => {
    if (goal && goal.current) {
      // Extract number from string like "5 hrs" or "30 min"
      const numericPart = parseFloat(goal.current) || "";
      setValue(numericPart);
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  const handleSubmit = () => {
    onConfirm(value);
    setValue("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl scale-100 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Update Progress</h3>
        <p className="text-sm text-slate-500 mb-6">
          {goal.id === 5
            ? "How many hours did you sleep last night?"
            : `Enter duration for ${goal.name}`}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {goal.id === 5 ? "Hours" : "Minutes"}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={goal.id === 5 ? "e.g. 8" : "e.g. 30"}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!value}
              className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generic Modal for Info/Loading/Confirmation
function InfoModal({ isOpen, onClose, title, message, isLoading, onConfirm, onCancel, confirmText = "Okay", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl scale-100 animate-in zoom-in-95 duration-200 text-center">
        {isLoading && (
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        )}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>

        {!isLoading && (
          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm || onClose}
              className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Choice Modal for Meditation
function MeditationChoiceModal({ isOpen, onClose, onChoice }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl scale-100 animate-in zoom-in-95 duration-200 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Update Meditation</h3>
        <p className="text-sm text-slate-600 mb-6">
          Would you like to start a guided session or manually log your time?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onChoice('page')}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 mb-1"
          >
            Go to Meditation Page
          </button>
          <button
            onClick={() => onChoice('manual')}
            className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
          >
            Update Manually
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 mt-2 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsView({
  weeklyProgress,
  goals,
  markGoalDone,
  updateGoal,
  // Modal Props
  isUpdateModalOpen,
  closeUpdateModal,
  selectedGoalForUpdate,
  confirmUpdateProgress,
  // Regen Modal Props
  regenModalState,
  closeRegenModal,
  onRegeneratePlan,
  // Meditation Choice Props
  meditationChoiceOpen,
  onMeditationChoice
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* update modal */}
      <UpdateProgressModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        goal={selectedGoalForUpdate}
        onConfirm={confirmUpdateProgress}
      />

      {/* Regen Modal */}
      <InfoModal
        isOpen={regenModalState?.isOpen}
        onClose={closeRegenModal}
        title={regenModalState?.title}
        message={regenModalState?.message}
        isLoading={regenModalState?.isLoading}
        onConfirm={regenModalState?.onConfirm}
        onCancel={regenModalState?.onCancel}
        confirmText={regenModalState?.confirmText}
        cancelText={regenModalState?.cancelText}
      />

      {/* Meditation Choice Modal */}
      <MeditationChoiceModal
        isOpen={meditationChoiceOpen}
        onClose={() => onMeditationChoice('cancel')} // Treating close as cancel? Or simple close logic
        onChoice={onMeditationChoice}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Goals</h1>
        <Link to="/analytics" className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
          Track Progress <span className="text-xs">→</span>
        </Link>
      </div>

      {/* AI Motivation Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white/90 mb-1">AI Motivation</h3>
            <p className="text-white text-base font-medium">
              You're making progress every single day, keep going!
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Progress Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">📊</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Weekly Progress</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">View statistics for this week</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(weeklyProgress.daysCompleted / weeklyProgress.totalDays) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {weeklyProgress.daysCompleted} days completed this week
          </p>
        </div>

        {/* Week Days Indicators */}
        <div className="flex items-center justify-between gap-2">
          {weeklyProgress.weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${day.completed
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md'
                  : 'bg-slate-200 text-slate-400'
                  }`}
              >
                {day.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-semibold">{day.day[0]}</span>
                )}
              </div>
              <span className="text-xs text-slate-500">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Goals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Current Goals</h2>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${goal.completed
                ? 'border-green-300 bg-green-50/30'
                : 'border-slate-200 hover:shadow-md'
                }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl">
                  {goal.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {goal.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {goal.description}
                  </p>

                  {/* Target Badge & Progress */}
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`${goal.badgeColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                        Target: {goal.target}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Current: {goal.current}
                      </span>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${goal.priority === 'Low' ? 'bg-green-100 text-green-600' :
                      goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                      Priority: {goal.priority}
                    </span>
                  </div>

                  {/* Regenerate Plan Button */}
                  {!goal.completed && (
                    <button
                      onClick={() => onRegeneratePlan(goal)}
                      className="text-xs text-blue-600 mb-3 flex items-center gap-1 hover:underline font-medium hover:text-blue-700 transition-colors"
                    >
                      <span>🔄</span>
                      Regenerate Plan
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => markGoalDone(goal.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${goal.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {goal.completed ? 'Completed' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => updateGoal(goal)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                    >
                      Update Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
