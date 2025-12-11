import React, { useState } from "react";
import {
  Apple,
  Droplet,
  Minus,
  Plus,
  Lightbulb,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Utensils,
  Fish,
  Egg,
  ArrowRight,
} from "lucide-react";

export default function NutritionView({
  calorieData,
  dailyProgress,
  macronutrients,
  waterIntake,
  onAddGlasses,
  onRemoveGlass,
  onResetWater,
  meals,
  recommendedMeals,
  onAddFood,
  onAddRecommendedMeal,
}) {
  // Safe defaults - handle undefined/null explicitly
  const safeCalorieData = calorieData || { goal: 2000, consumed: 0, remaining: 2000 };
  const safeDailyProgress = dailyProgress ?? 0;
  const safeMacronutrients = macronutrients || { 
    protein: { current: 0, goal: 0 }, 
    carbs: { current: 0, goal: 0 }, 
    fats: { current: 0, goal: 0 } 
  };
  const safeWaterIntake = waterIntake || { 
    glassesConsumed: 0, 
    totalGlasses: 8, 
    mlConsumed: 0, 
    mlGoal: 2000, 
    glassSize: 250 
  };
  const safeMeals = meals || {
    breakfast: { consumed: 0, goal: 500, items: [] },
    lunch: { consumed: 0, goal: 700, items: [] },
    dinner: { consumed: 0, goal: 600, items: [] },
    snacks: { consumed: 0, goal: 200, items: [] },
  };
  const safeRecommendedMeals = recommendedMeals || [];
  const safeOnAddGlasses = onAddGlasses || (() => {});
  const safeOnRemoveGlass = onRemoveGlass || (() => {});
  const safeOnResetWater = onResetWater || (() => {});
  const safeOnAddFood = onAddFood || (() => {});
  const safeOnAddRecommendedMeal = onAddRecommendedMeal || (() => {});

  const waterProgressPercentage = safeWaterIntake.mlGoal
    ? Math.round((safeWaterIntake.mlConsumed / safeWaterIntake.mlGoal) * 100)
    : 0;
  const waterRemaining = safeWaterIntake.mlGoal ? safeWaterIntake.mlGoal - safeWaterIntake.mlConsumed : 0;

  // Tab state (FIXED - changed from "overview" to "daily-summary")
  const [activeTab, setActiveTab] = useState("daily-summary");

  // Weekly data for overview
  const weeklyData = [
    { day: 'Mon', calories: 1800, height: 75 },
    { day: 'Tue', calories: 2100, height: 90 },
    { day: 'Wed', calories: 1950, height: 82 },
    { day: 'Thu', calories: 2200, height: 95 },
    { day: 'Fri', calories: 2050, height: 88 },
    { day: 'Sat', calories: 1900, height: 80 },
    { day: 'Sun', calories: 2300, height: 100 },
  ];

  const avgCalories = Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length);
  const onTrackDays = 6;
  const totalDays = 7;
  const consistency = Math.round((onTrackDays / totalDays) * 100);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const percentage = waterProgressPercentage;
    if (percentage === 0) return "💧 Start your hydration journey!";
    if (percentage < 25) return "💧 Great start! Keep going!";
    if (percentage < 50) return "💪 You're making progress!";
    if (percentage < 75) return "💪 Halfway there! Stay hydrated.";
    if (percentage < 100) return "🎉 Almost there! Keep it up!";
    return "🎉 Perfect! You've reached your goal!";
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Nutrition Tracking</h1>
        <p className="text-slate-600">Track your daily nutrition and water intake</p>
      </div>
      
      
      {/* Custom Tabs */}
      <div className="w-full mb-6">
        <div className="grid grid-cols-4 w-full max-w-3xl bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("daily-summary")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "daily-summary"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daily Summary
          </button>
          <button
            onClick={() => setActiveTab("water-intake")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "water-intake"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Water Intake
          </button>
          <button
            onClick={() => setActiveTab("food-intake")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "food-intake"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Food Intake
          </button>
          <button
            onClick={() => setActiveTab("weekly-overview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "weekly-overview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Weekly Overview
          </button>
        </div>
      </div>


      {/* Tab Content */}
      {activeTab === "weekly-overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Chart - Left Side (Takes 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Apple className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Weekly Overview</h2>
                <p className="text-sm text-slate-500">Your nutrition trends</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="mb-8">
              <div className="flex items-end justify-between gap-2 h-64 px-4">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex flex-col items-center flex-1 gap-2">
                    <div className="relative w-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          day.day === 'Sun' 
                            ? 'bg-gradient-to-t from-cyan-400 to-cyan-500' 
                            : 'bg-gradient-to-t from-purple-400 to-purple-500'
                        }`}
                        style={{ height: `${day.height * 2.5}px` }}
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-600">{day.day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Avg Calories</p>
                <p className="text-2xl font-bold text-purple-600">{avgCalories.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">On Track Days</p>
                <p className="text-2xl font-bold text-teal-600">{onTrackDays}/{totalDays}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Consistency</p>
                <p className="text-2xl font-bold text-orange-600">{consistency}%</p>
              </div>
            </div>
          </div>

          {/* Nutrition Goals - Right Side */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Nutrition Goals</h2>
            
            <div className="space-y-6">
              {/* Water Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Water</span>
                  </div>
                  <span className="text-xs text-slate-600">6/8 cups</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                </div>
                <div className="flex justify-between mt-1">
                  <button className="text-slate-400 hover:text-slate-600">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fruits & Veg Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Apple className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-700">Fruits & Veg</span>
                  </div>
                  <span className="text-xs text-slate-600">4/5 servings</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Protein Goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Egg className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-slate-700">Protein</span>
                  </div>
                  <span className="text-xs text-slate-600">45/60g</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Meal Timing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">Meal Timing</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">2/3 meals on time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "daily-summary" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Apple className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Daily Summary</h2>
            <p className="text-sm text-slate-500">Today's nutritional overview</p>
          </div>
        </div>

        {/* Calorie Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Calories Goal */}
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs text-slate-600 mb-1">Calories Goal</p>
            <p className="text-3xl font-bold text-slate-900">
              {safeCalorieData.goal.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">kcal</p>
          </div>

          {/* Consumed */}
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-xs text-slate-600 mb-1">Consumed</p>
            <p className="text-3xl font-bold text-orange-600">
              {safeCalorieData.consumed.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">kcal</p>
          </div>

          {/* Remaining */}
          <div className="bg-teal-50 rounded-xl p-4">
            <p className="text-xs text-slate-600 mb-1">Remaining</p>
            <p className="text-3xl font-bold text-teal-600">
              {safeCalorieData.remaining.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">kcal</p>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">Daily Progress</p>
            <p className="text-sm font-bold text-slate-900">{safeDailyProgress}%</p>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${safeDailyProgress}%` }}
            />
          </div>
        </div>

        {/* Macronutrient Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Macronutrient Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Protein */}
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-600 mb-2">Protein</p>
              <p className="text-3xl font-bold text-orange-600">
                {safeMacronutrients.protein.current}g
              </p>
              <p className="text-xs text-slate-500 mt-1">
                of {safeMacronutrients.protein.goal}g
              </p>
            </div>

            {/* Carbs */}
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-600 mb-2">Carbs</p>
              <p className="text-3xl font-bold text-blue-600">
                {safeMacronutrients.carbs.current}g
              </p>
              <p className="text-xs text-slate-500 mt-1">
                of {safeMacronutrients.carbs.goal}g
              </p>
            </div>

            {/* Fats */}
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-600 mb-2">Fats</p>
              <p className="text-3xl font-bold text-yellow-600">
                {safeMacronutrients.fats.current}g
              </p>
              <p className="text-xs text-slate-500 mt-1">
                of {safeMacronutrients.fats.goal}g
              </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === "water-intake" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Daily Progress */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Daily Water Intake</h2>
                    <p className="text-sm text-slate-600">
                      {safeWaterIntake.glassesConsumed} of {safeWaterIntake.totalGlasses} glasses •{" "}
                      {safeWaterIntake.mlConsumed}ml of {safeWaterIntake.mlGoal}ml
                    </p>
                  </div>
                </div>

                {/* Glass Visuals */}
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: safeWaterIntake.totalGlasses }, (_, index) => {
                    const glassNumber = index + 1;
                    const isFilled = glassNumber <= safeWaterIntake.glassesConsumed;
                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center font-semibold text-sm transition-all ${
                          isFilled
                            ? "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-300 text-slate-400"
                        }`}
                      >
                        {glassNumber}
                      </div>
                    );
                  })}
                </div>

                {/* Daily Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Daily Progress</p>
                    <p className="text-sm font-bold text-slate-900">{waterProgressPercentage}%</p>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${waterProgressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">{getMotivationalMessage()}</p>
                </div>
              </div>

              {/* Right Column - Summary, Logging, and Tips */}
              <div className="space-y-6">
                {/* Consumed and Remaining Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-slate-600 mb-1">Consumed</p>
                    <p className="text-3xl font-bold text-blue-600">{safeWaterIntake.mlConsumed} ml</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-slate-600 mb-1">Remaining</p>
                    <p className="text-3xl font-bold text-blue-600">{waterRemaining} ml</p>
                  </div>
                </div>

                {/* Log Water Intake Section */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={safeOnRemoveGlass}
                      disabled={safeWaterIntake.glassesConsumed === 0}
                      className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex flex-col items-center">
                      <Droplet className="w-12 h-12 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-slate-900">
                        {safeWaterIntake.glassesConsumed} glasses
                      </p>
                      <p className="text-xs text-slate-500">1 glass = {safeWaterIntake.glassSize}ml</p>
                    </div>
                    <button
                      onClick={() => safeOnAddGlasses(1)}
                      disabled={safeWaterIntake.glassesConsumed >= safeWaterIntake.totalGlasses}
                      className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Hydration Tips Section */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Hydration Tips</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Drink water first thing in the morning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Keep a water bottle nearby</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Set reminders throughout the day</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => safeOnAddGlasses(1)}
                disabled={safeWaterIntake.glassesConsumed >= safeWaterIntake.totalGlasses}
                className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                + 1 Glass
              </button>
              <button
                onClick={() => safeOnAddGlasses(2)}
                disabled={safeWaterIntake.glassesConsumed + 2 > safeWaterIntake.totalGlasses}
                className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                + 2 Glasses
              </button>
              <button
                onClick={safeOnResetWater}
                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
      )}

      {activeTab === "food-intake" && (
        <div className="space-y-6">
            {/* Meal Tracking Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Breakfast Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Breakfast</h3>
                    <p className="text-sm text-slate-600">
                      {safeMeals.breakfast.consumed} / {safeMeals.breakfast.goal} kcal
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {safeMeals.breakfast.items && safeMeals.breakfast.items.length > 0 ? (
                    safeMeals.breakfast.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-600 font-medium">{item.calories} kcal</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No items logged yet</p>
                  )}
                </div>
                <button
                  onClick={() => safeOnAddFood("breakfast")}
                  className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium hover:bg-yellow-100 transition-colors text-sm"
                >
                  + Add Food
                </button>
              </div>

              {/* Lunch Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Lunch</h3>
                    <p className="text-sm text-slate-600">
                      {safeMeals.lunch.consumed} / {safeMeals.lunch.goal} kcal
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {safeMeals.lunch.items && safeMeals.lunch.items.length > 0 ? (
                    safeMeals.lunch.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-600 font-medium">{item.calories} kcal</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No items logged yet</p>
                  )}
                </div>
                <button
                  onClick={() => safeOnAddFood("lunch")}
                  className="w-full py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors text-sm"
                >
                  + Add Food
                </button>
              </div>

              {/* Dinner Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Dinner</h3>
                    <p className="text-sm text-slate-600">
                      {safeMeals.dinner.consumed} / {safeMeals.dinner.goal} kcal
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {safeMeals.dinner.items && safeMeals.dinner.items.length > 0 ? (
                    safeMeals.dinner.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-600 font-medium">{item.calories} kcal</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No items logged yet</p>
                  )}
                </div>
                <button
                  onClick={() => safeOnAddFood("dinner")}
                  className="w-full py-2 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors text-sm"
                >
                  + Add Food
                </button>
              </div>

              {/* Snacks Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Snacks</h3>
                    <p className="text-sm text-slate-600">
                      {safeMeals.snacks.consumed} / {safeMeals.snacks.goal} kcal
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {safeMeals.snacks.items && safeMeals.snacks.items.length > 0 ? (
                    safeMeals.snacks.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700">{item.name}</span>
                        <span className="text-slate-600 font-medium">{item.calories} kcal</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No snacks logged yet</p>
                  )}
                </div>
                <button
                  onClick={() => safeOnAddFood("snacks")}
                  className="w-full py-2 bg-pink-50 text-pink-700 rounded-lg font-medium hover:bg-pink-100 transition-colors text-sm"
                >
                  + Add Food
                </button>
              </div>
            </div>

            {/* Recommended for You Today Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recommended for You Today</h2>
                  <p className="text-sm text-slate-500">AI-powered meal suggestions</p>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {safeRecommendedMeals && safeRecommendedMeals.map((meal) => {
                  const getIcon = () => {
                    switch (meal.icon) {
                      case "utensils":
                        return <Utensils className="w-6 h-6 text-white" />;
                      case "fish":
                        return <Fish className="w-6 h-6 text-white" />;
                      case "bowl":
                        return <Utensils className="w-6 h-6 text-white" />;
                      case "egg":
                        return <Egg className="w-6 h-6 text-white" />;
                      default:
                        return <Utensils className="w-6 h-6 text-white" />;
                    }
                  };

                  return (
                    <div
                      key={meal.id}
                      className={`bg-gradient-to-br ${meal.gradient} rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3">
                        {getIcon()}
                      </div>
                      <h3 className="font-semibold text-white mb-1">{meal.name}</h3>
                      <p className="text-sm text-white/90 mb-3">{meal.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">{meal.calories} kcal</span>
                      </div>
                      <button
                        onClick={() => safeOnAddRecommendedMeal(meal.id, "meal")}
                        className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-sm transition-colors"
                      >
                        Add to Meal
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      )}

      {/* Floating Action Button (matching design mockup) */}
      <div className="fixed bottom-8 right-8">
        <button className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </button>
      </div>
    </div>
  );
}