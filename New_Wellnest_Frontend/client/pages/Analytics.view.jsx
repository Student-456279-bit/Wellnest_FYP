import React from "react";
import {
  Zap,
  CheckCircle,
  TrendingUp,
  Apple,
  Dumbbell,
  MessageSquare,
  Heart,
  Settings,
  Target,
  BarChart2,
  Trophy,
  Award,
  Leaf,
  Moon,
  Flame,
  Plus,
  ArrowRight,
  ArrowUp,
  Sliders,
  Eye,
  MessageCircleQuestion,
  Check,
} from "lucide-react";

// Helper component for simple line charts (like Nutrition trend)
const MiniLineChart = ({ data }) => {
  const points = data.map((d, i) => `${d.x},${d.y}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#8b5cf6" // A vibrant purple for the line
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

// Helper component for simple bar charts (like Activity bars)
const MiniBarChart = ({ data }) => {
  const maxVal = Math.max(...data);
  const barWidth = 100 / data.length;
  return (
    <svg viewBox="0 0 100 50" className="w-full h-16" preserveAspectRatio="none">
      {data.map((val, index) => (
        <rect
          key={index}
          x={index * barWidth + 2} // Add a small gap between bars
          y={50 - (val / maxVal) * 50} // Bars grow from bottom
          width={barWidth - 4} // Bar width adjusted for gap
          height={(val / maxVal) * 50}
          fill="#f97316" // Orange color for bars
          rx="2" ry="2" // Rounded corners for bars
        />
      ))}
    </svg>
  );
};

// Helper for general line charts (larger, with labels)
const BigLineChart = ({ labels, data, lineColor = '#8b5cf6' }) => {
  const maxY = Math.max(...data, 100); // Ensure Y-axis goes up to at least 100
  const minY = Math.min(...data, 0);
  const rangeY = maxY - minY;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - minY) / rangeY) * 100; // Invert Y for SVG coord system
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative w-full h-64">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {/* Y-axis grid lines and labels */}
        {[0, 25, 50, 75, 100].map(val => (
          <g key={val}>
            <line
              x1="0" y1={100 - val} x2="100" y2={100 - val}
              stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2"
            />
            <text x="-2" y={100 - val + 1} fontSize="5" fill="#6b7280" textAnchor="end">{val}</text>
          </g>
        ))}

        {/* X-axis labels */}
        {labels.map((label, i) => {
          const x = (i / (labels.length - 1)) * 100;
          return (
            <text key={label} x={x} y="105" fontSize="4" fill="#6b7280" textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}>
              {label}
            </text>
          );
        })}

        {/* The line itself */}
        <polyline fill="none" stroke={lineColor} strokeWidth="2" points={points} />
      </svg>
    </div>
  );
};

// Helper for general bar charts (larger, with labels)
const BigBarChart = ({ labels, data, barColor = '#8b5cf6', average }) => {
  const maxVal = Math.max(...data, 100);
  const barWidthPx = 100 / data.length;

  return (
    <div className="relative w-full h-64">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {/* Y-axis grid lines and labels */}
        {[0, 25, 50, 75, 100].map(val => (
          <g key={val}>
            <line
              x1="0" y1={100 - val} x2="100" y2={100 - val}
              stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2"
            />
            <text x="-2" y={100 - val + 1} fontSize="5" fill="#6b7280" textAnchor="end">{val}</text>
          </g>
        ))}

        {/* Bars */}
        {data.map((val, i) => {
          const x = i * barWidthPx + (barWidthPx * 0.1); // 10% padding on each side of bar
          const barWidth = barWidthPx * 0.8;
          const barHeight = (val / maxVal) * 100;
          return (
            <rect
              key={i}
              x={x}
              y={100 - barHeight}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              rx="1" ry="1"
            />
          );
        })}

        {/* X-axis labels */}
        {labels.map((label, i) => {
          const x = (i * barWidthPx) + (barWidthPx / 2);
          return (
            <text key={label} x={x} y="105" fontSize="4" fill="#6b7280" textAnchor="middle">
              {label}
            </text>
          );
        })}
      </svg>
      {average && (
        <div className="absolute bottom-0 left-0 w-full text-center text-sm text-slate-600 -mb-6">
          Average: {average}%
        </div>
      )}
    </div>
  );
};


// Generic Modal for Info/Loading
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


export default function AnalyticsView({
  data,
  // Button Handlers
  onUpdateActivity,
  onReturnToDashboard,
  onModifyGoalPlan,
  onViewGoalProgress,
  onAskWellnessAI,
  // Modal State
  modalState,
  closeModal
}) {
  // Destructure data for easier access
  const {
    currentStreak,
    weeklyRate,
    wellnessScore,
    activeGoals,
    nutrition,
    activity,
    mindfulness,
    consistencyTrend,
    weeklyGoalHitRate,
    averageEnergyLevel,
    mindBodyBalance,
    monthlyGoals,
    ranking,
    aiInsights,
  } = data;

  return (
    <div className="w-full pt-8 pb-8">
      <InfoModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        isLoading={modalState.isLoading}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Wellness Tracking</h1>
            <p className="text-slate-600">Your comprehensive wellness overview</p>
          </div>
          <button
            onClick={onUpdateActivity}
            className="bg-purple-600 text-white px-5 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} /> Update Activity
          </button>
        </div>

        {/* Top Overview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Streak Card */}
          <div className="bg-orange-50 p-6 rounded-lg shadow-sm border border-orange-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{currentStreak} Days</p>
              <p className="text-sm text-orange-600">Current Streak</p>
              <p className="text-xs text-orange-500 flex items-center gap-1">
                <CheckCircle size={14} /> Keep going!
              </p>
            </div>
          </div>

          {/* Weekly Rate Card */}
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Leaf size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">{weeklyRate}%</p>
              <p className="text-sm text-purple-600">Weekly Rate</p>
              <p className="text-xs text-purple-500">of consistency</p>
            </div>
          </div>

          {/* Wellness Score Card */}
          <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{wellnessScore}/100</p>
              <p className="text-sm text-green-600">Wellness Score</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <ArrowUp size={14} /> +5 from last week
              </p>
            </div>
          </div>

          {/* Active Goals Card */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">
                {activeGoals.completed} of {activeGoals.total}
              </p>
              <p className="text-sm text-blue-600">Active Goals</p>
              <p className="text-xs text-blue-500">{Math.round((activeGoals.completed / activeGoals.total) * 100)}% completion</p>
            </div>
          </div>
        </div>

        {/* Core Metrics Cards Grid (Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Nutrition Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Apple size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Nutrition</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Weekly Overview</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Calories Met</span>
                <span className="font-semibold text-green-600">{nutrition.caloriesMet}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Balanced Score</span>
                <span className="font-semibold text-green-600">{nutrition.balancedScore}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Goal Achievement</span>
                <span className="font-semibold text-green-600">{nutrition.goalAchievement}%</span>
              </div>
            </div>
            <MiniLineChart data={nutrition.trendData} />
          </div>

          {/* Activity Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Dumbbell size={20} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Activity</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Weekly Overview</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Total Workouts</span>
                <span className="font-semibold text-slate-900">{activity.totalWorkouts} sessions</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Active Minutes</span>
                <span className="font-semibold text-orange-600">{activity.activeMinutes} min</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Goal Achievement</span>
                <span className="font-semibold text-slate-900">{activity.goalAchievement}%</span>
              </div>
            </div>
            <MiniBarChart data={activity.barsData} />
          </div>

          {/* Mindfulness Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Moon size={20} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Mindfulness</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Weekly Overview</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Meditation Minutes</span>
                <span className="font-semibold text-slate-900">{mindfulness.meditationMinutes} min</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Avg Sleep Score</span>
                <span className="font-semibold text-purple-600">{mindfulness.avgSleepScore}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Consistency</span>
                <span className="font-semibold text-purple-600 flex items-center gap-1">{mindfulness.consistency}% <ArrowUp size={14} /></span>
              </div>
            </div>
            <p className="text-purple-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp size={16} /> Improving trend
            </p>
          </div>
        </div>

        {/* Consistency Trend Chart (Image 1) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Consistency Trend - Last 30 Days</h2>
            {/* Button 2: Static Badge */}
            <div className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1">
              <TrendingUp size={16} /> Trending up
            </div>
          </div>
          <BigLineChart labels={consistencyTrend.labels} data={consistencyTrend.data} />
        </div>

        {/* --- Start of Image 2 Content --- */}

        {/* Weekly Performance Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Goal Hit Rate */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">Weekly Goal Hit Rate</h3>
            <BigBarChart
              labels={weeklyGoalHitRate.labels}
              data={weeklyGoalHitRate.data}
              barColor="#8b5cf6" // Purple
              average={weeklyGoalHitRate.average}
            />
          </div>

          {/* Average Energy Level */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">Average Energy Level</h3>
            <BigLineChart
              labels={averageEnergyLevel.labels}
              data={averageEnergyLevel.data}
              lineColor="#10b981" // Green
            />
            <div className="text-center text-sm text-slate-600 mt-4">Average: {averageEnergyLevel.average}/10</div>
          </div>

          {/* Mind-Body Balance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">Mind-Body Balance</h3>
            {/* Simplified Line/Area Chart for Mind-Body Balance */}
            <div className="relative w-full h-64">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <polyline
                  fill="none"
                  stroke="#f97316" // Orange line color
                  strokeWidth="2"
                  points={mindBodyBalance.data.map((val, i) => `${(i / (mindBodyBalance.data.length - 1)) * 100},${100 - (val / 100) * 100}`).join(" ")}
                />
                {/* Shaded area under the line */}
                <polygon
                  fill="#f97316" // Orange fill
                  fillOpacity="0.2"
                  points={`0,100 ${mindBodyBalance.data.map((val, i) => `${(i / (mindBodyBalance.data.length - 1)) * 100},${100 - (val / 100) * 100}`).join(" ")} 100,100`}
                />
                {/* X-axis labels */}
                {mindBodyBalance.labels.map((label, i) => {
                  const x = (i / (mindBodyBalance.labels.length - 1)) * 100;
                  return (
                    <text key={label} x={x} y="105" fontSize="4" fill="#6b7280" textAnchor={i === 0 ? "start" : i === mindBodyBalance.labels.length - 1 ? "end" : "middle"}>
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
            <div className="text-center text-sm text-slate-600 mt-4">Current: {mindBodyBalance.current}/100</div>
          </div>
        </div>


        {/* Achievements & Milestones Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Award size={20} className="text-purple-600" /> Achievements & Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Goals Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{monthlyGoals}%</h3>
              <p className="text-sm text-slate-600 mb-4">Monthly Goals</p>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-pink-500 h-2.5 rounded-full"
                  style={{ width: `${monthlyGoals}%` }}
                ></div>
              </div>
            </div>

            {/* Your Ranking Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Top {ranking}%</h3>
              <p className="text-sm text-slate-600 mb-4">Your Ranking</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                <TrendingUp size={14} /> More consistent than {100 - ranking}% of users
              </p>
            </div>

            {/* Earned Badges Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-900 text-center mb-4">Earned Badges</h3>
              <div className="flex justify-around items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <Flame size={32} className="text-orange-600" />
                  </div>
                  <p className="text-xs text-slate-700 font-medium">Consistency Star</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Apple size={32} className="text-green-600" />
                  </div>
                  <p className="text-xs text-slate-700 font-medium">Nutrition Champ</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Moon size={32} className="text-purple-600" />
                  </div>
                  <p className="text-xs text-slate-700 font-medium">Mindful Master</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Personalized Insights Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-purple-600" /> AI Personalized Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex items-start gap-4">
                <div className={`w-10 h-10 ${index === 0 ? 'bg-blue-100 text-blue-600' : index === 1 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {index === 0 && <Award size={20} />} {/* Example icon for first insight */}
                  {index === 1 && <MessageSquare size={20} />} {/* Example icon for second insight */}
                  {index === 2 && <ArrowUp size={20} />} {/* Example icon for third insight */}
                </div>
                <p className="text-sm text-slate-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- End of Image 2 Content --- */}

        {/* --- Start of Image 3 Content --- */}

        {/* Quick Actions Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={onReturnToDashboard}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
            >
              <Check size={20} /> Return to Dashboard
            </button>
            <button
              onClick={onModifyGoalPlan}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Sliders size={20} /> Modify Goals
            </button>
            <button
              onClick={onViewGoalProgress}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Eye size={20} /> View Goal Progress
            </button>
            <button
              onClick={onAskWellnessAI}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
            >
              <MessageCircleQuestion size={20} /> Ask Wellness AI
            </button>
          </div>
        </div>

        {/* Affirmation Banner (Bottom of Page) */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-lg shadow-md text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">✨</span>
            <p className="text-lg font-bold">"Progress is built one consistent day at a time."</p>
          </div>
          {/* Optional: Add a smaller text if needed, like "WellNest AI" */}
        </div>

        {/* --- End of Image 3 Content --- */}

      </div>
    </div>
  );
}