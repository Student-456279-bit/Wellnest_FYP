import React, { useState } from "react";
import Layout from "../components/Layout";
import GoalsView from "./Goals.view.jsx";
import { useNavigate } from "react-router-dom";

import { generateWellnessPlan } from "../../shared/api.js";
import { useUser } from "../../shared/UserContext.jsx";

export default function GoalsLogic(props) {
  const navigate = useNavigate();
  // Get User Context
  const { user } = useUser();

  // Weekly progress state
  const [weeklyProgress, setWeeklyProgress] = useState({
    daysCompleted: 6,
    totalDays: 7,
    weekDays: [
      { day: "Mon", completed: true },
      { day: "Tue", completed: true },
      { day: "Wed", completed: true },
      { day: "Thu", completed: true },
      { day: "Fri", completed: true },
      { day: "Sat", completed: true },
      { day: "Sun", completed: false },
    ],
  });

  // Goals state - Fixed 5 Major Categories
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Meditation or Praying",
      description: "Take time to reflect and find inner peace",
      target: "15 min",
      current: "0 min",
      unit: "min",
      icon: "🧘",
      badgeColor: "bg-purple-100 text-purple-700",
      feeling: "Not started yet",
      priority: "Medium",
      completed: false,
    },
    {
      id: 2,
      name: "Daily Exercise",
      description: "Move your body to stay healthy and active",
      target: "30 min",
      current: "0 min",
      unit: "min",
      icon: "💪",
      badgeColor: "bg-green-100 text-green-700",
      feeling: "Ready to go",
      priority: "High",
      completed: false,
    },
    {
      id: 3,
      name: "Food Intake",
      description: "Eat balanced meals with emphasis on greens",
      target: "2000 kcal",
      current: "0 kcal",
      unit: "kcal",
      icon: "🥗",
      badgeColor: "bg-orange-100 text-orange-700",
      feeling: "Hungry",
      priority: "Medium",
      completed: false,
    },
    {
      id: 4,
      name: "Water Intake",
      description: "Stay hydrated throughout the day",
      target: "2500 ml",
      current: "500 ml",
      unit: "ml",
      icon: "💧",
      badgeColor: "bg-blue-100 text-blue-700",
      feeling: "Thirsty",
      priority: "Low",
      completed: false,
    },
    {
      id: 5,
      name: "Sleep Schedule",
      description: "Get enough rest for recovery",
      target: "8 hrs",
      current: "0 hrs",
      unit: "hrs",
      icon: "😴",
      badgeColor: "bg-indigo-100 text-indigo-700",
      feeling: "Tired",
      priority: "High",
      completed: false,
    },
  ]);

  // Fetch Wellness Plan on Mount
  React.useEffect(() => {
    async function fetchPlan() {
      if (!user || !user.email) return;

      console.log("Fetching wellness plan for:", user.email);
      const res = await generateWellnessPlan(user.email);

      if (res && res.plan) {
        console.log("Plan fetched:", res.plan);
        const p = res.plan;

        // Helper to extract number from string like "20 mins" -> 20
        const parseNum = (str) => parseInt(str) || 0;

        // Calculate Workout Total Duration
        let workoutMins = 30; // default
        if (p.workout && Array.isArray(p.workout)) {
          // sum seconds / 60
          const totalSec = p.workout.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
          if (totalSec > 0) workoutMins = Math.ceil(totalSec / 60);
          // Ensure at least 1 min if plan exists
          if (workoutMins < 1) workoutMins = 1;
        }

        setGoals(prevGoals => prevGoals.map(g => {
          switch (g.id) {
            case 1: // Meditation
              return { ...g, target: p.meditation || g.target };
            case 2: // Exercise
              return { ...g, target: `${workoutMins} min` };
            case 3: // Food
              return { ...g, target: p.food?.target ? `${p.food.target} kcal` : g.target };
            case 4: // Water
              return { ...g, target: p.water || g.target };
            case 5: // Sleep
              return { ...g, target: p.sleep || g.target };
            default:
              return g;
          }
        }));
      }
    }

    fetchPlan();
  }, [user]);

  // Mark goal as done with confirmation and auto-fill
  const markGoalDone = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // If marking as done (currently not completed)
    if (!goal.completed) {
      if (window.confirm("Are you sure you want to mark this goal as done?")) {
        setGoals(goals.map(g => {
          if (g.id !== goalId) return g;
          // Auto-fill progress to match target
          return { ...g, completed: true, current: g.target };
        }));
      }
    } else {
      // If unmarking (toggle off), just set completed to false
      setGoals(goals.map(g =>
        g.id === goalId ? { ...g, completed: false } : g
      ));
    }
  };

  // Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGoalForUpdate, setSelectedGoalForUpdate] = useState(null);

  // Meditation Choice Modal State
  const [meditationChoiceOpen, setMeditationChoiceOpen] = useState(false);

  // Regeneration Modal State
  const [regenModalState, setRegenModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    isLoading: false,
  });

  const handleRegeneratePlan = async (goal) => {
    // Only allow regeneration for the whole plan context, but user clicked a specific goal?
    // The prompt says "regenerate the plan using the buttons on the goals page".
    // Usually "Regenerate Plan" might be a global action, but if it's per goal (e.g. "Regenerate Workout"),
    // the backend currently regenerates the *entire* plan.
    // So for MVP, we'll regenerate the whole plan regardless of which goal triggered it, 
    // or arguably only update that part if backend supported it.
    // Given the backend change `generate_plan_logic` regenerates everything, we'll do a full regen.

    if (!confirm(`Are you sure you want to regenerate your entire wellness plan based on your latest profile? This will overwrite your current targets.`)) {
      return;
    }

    setRegenModalState({
      isOpen: true,
      title: "Regenerating Plan...",
      message: "Please wait while we create a new plan for you.",
      isLoading: true,
    });

    if (user && user.email) {
      const res = await generateWellnessPlan(user.email, true); // regenerate = true

      if (res.plan) {
        const p = res.plan;
        // Calculate Workout Total Duration
        let workoutMins = 30; // default
        if (p.workout && Array.isArray(p.workout)) {
          const totalSec = p.workout.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
          if (totalSec > 0) workoutMins = Math.ceil(totalSec / 60);
          if (workoutMins < 1) workoutMins = 1;
        }

        setGoals(prevGoals => prevGoals.map(g => {
          switch (g.id) {
            case 1: return { ...g, target: p.meditation || g.target };
            case 2: return { ...g, target: `${workoutMins} min` };
            case 3: return { ...g, target: p.food?.target ? `${p.food.target} kcal` : g.target };
            case 4: return { ...g, target: p.water || g.target };
            case 5: return { ...g, target: p.sleep || g.target };
            default: return g;
          }
        }));

        setRegenModalState({
          isOpen: true,
          title: "Success!",
          message: "Your plan has been regenerated.",
          isLoading: false,
        });
      } else {
        setRegenModalState({
          isOpen: true,
          title: "Error",
          message: res.error || "Failed to regenerate plan.",
          isLoading: false,
        });
      }
    }
  };

  const closeRegenModal = () => {
    setRegenModalState(curr => ({ ...curr, isOpen: false }));
  };


  // Update goal progress (Redirection OR Modal)
  const updateGoal = (goal) => {
    // 1. Food (ID 3) and Water (ID 4) -> Redirect to Nutrition
    if (goal.id === 3 || goal.id === 4) {
      if (confirm(`Go to Nutrition page to track ${goal.name}?`)) {
        navigate("/nutrition");
      }
      return;
    }

    // 2. Meditation (ID 1) -> Choice Modal
    if (goal.id === 1) {
      setSelectedGoalForUpdate(goal);
      setMeditationChoiceOpen(true);
      return;
    }

    // 3. Others -> Open Manual Modal directly
    setSelectedGoalForUpdate(goal);
    setIsUpdateModalOpen(true);
  };

  const handleMeditationChoice = (choice) => {
    setMeditationChoiceOpen(false);
    if (choice === 'page') {
      navigate("/meditation");
    } else {
      // Manual update
      setIsUpdateModalOpen(true);
    }
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedGoalForUpdate(null);
  };

  const confirmUpdateProgress = (value) => {
    if (!selectedGoalForUpdate) return;

    // Determine unit
    const unit = selectedGoalForUpdate.id === 5 ? "hrs" : "min";
    const numValue = parseFloat(value);
    const targetVal = parseFloat(selectedGoalForUpdate.target) || 0;

    // Warning validation: If value is surprisingly high (> 1.5x target)
    if (numValue > (targetVal * 1.5)) {
      if (!confirm(`That seems like a lot! Are you sure you want to log ${value} ${unit}?`)) {
        return; // User cancelled
      }
    }

    updateGoalProgress(selectedGoalForUpdate.id, value, unit);
    closeUpdateModal();
  };

  // Helper to update state and check completion
  const updateGoalProgress = (id, value, unit) => {
    setGoals(goals.map(g => {
      if (g.id !== id) return g;

      const newVal = parseInt(value) || 0;
      const targetVal = parseInt(g.target) || 0;
      const isCompleted = newVal >= targetVal;

      return {
        ...g,
        current: `${value} ${unit}`,
        completed: isCompleted // Auto-mark if target reached
      };
    }));
  };

  // Add new goal (placeholder)
  const addNewGoal = () => {
    // Logic removed as per new requirements
  };

  return (
    <Layout>
      <GoalsView
        weeklyProgress={weeklyProgress}
        goals={goals}
        markGoalDone={markGoalDone}
        updateGoal={updateGoal}
        // Modal Props
        isUpdateModalOpen={isUpdateModalOpen}
        closeUpdateModal={closeUpdateModal}
        selectedGoalForUpdate={selectedGoalForUpdate}
        confirmUpdateProgress={confirmUpdateProgress}
        addNewGoal={addNewGoal}
        regenModalState={regenModalState}
        closeRegenModal={closeRegenModal}
        onRegeneratePlan={handleRegeneratePlan}
        // Meditation Choice Props
        meditationChoiceOpen={meditationChoiceOpen}
        onMeditationChoice={handleMeditationChoice}
        {...props}
      />
    </Layout>
  );
}
