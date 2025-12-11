import React from "react";
import { Sparkles, CheckCircle2, Plus } from "lucide-react";


export default function GoalsView({ weeklyProgress, goals, markGoalDone, updateGoal, addNewGoal }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Goals</h1>
        <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
          Track Progress →
        </a>
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
          <button className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <span className="text-white text-lg">→</span>
          </button>
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
          <button
            onClick={addNewGoal}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Goal
          </button>
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

                  {/* Target Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${goal.badgeColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {goal.target}
                    </span>
                  </div>

                  {/* Feeling Message */}
                  {!goal.completed && (
                    <p className="text-xs text-orange-600 mb-3 flex items-center gap-1">
                      <span>⚠️</span>
                      {goal.feeling}
                    </p>
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
                      onClick={() => updateGoal(goal.id)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                    >
                      Update Goal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
