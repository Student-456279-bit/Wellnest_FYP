import React, { useState } from "react";
import Layout from "../components/Layout";
import GoalsView from "./Goals.view.jsx";

export default function GoalsLogic(props) {
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

  // Goals state
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Daily Meditation Practice",
      description: "Cure Mindstate for 10 minutes every day to enhance focus and reduce stress",
      target: "Target: 10min",
      icon: "🧘",
      badgeColor: "bg-purple-100 text-purple-700",
      feeling: "Feeling so hard? Should We Plan",
      completed: false,
    },
    {
      id: 2,
      name: "Weekly Exercise Routine",
      description: "Cure Mindstate for 30 minutes every day to enhance focus and reduce stress",
      target: "Target: 30min",
      icon: "💪",
      badgeColor: "bg-green-100 text-green-700",
      feeling: "Feeling so hard? Should We Plan",
      completed: false,
    },
    {
      id: 3,
      name: "Evening Journaling",
      description: "Cure Write a 5 study entries practice to enhance focus and reduce stress behind that",
      target: "Target: 5min",
      icon: "📔",
      badgeColor: "bg-blue-100 text-blue-700",
      feeling: "Feeling so hard? Should We Plan",
      completed: false,
    },
    {
      id: 4,
      name: "Balanced Nutrition",
      description: "Goal: Eat 3-5 healthy and vegetables meals and balanced reaches",
      target: "Target: 5 EA",
      icon: "🥗",
      badgeColor: "bg-orange-100 text-orange-700",
      feeling: "Feeling so hard? Should We Plan",
      completed: false,
    },
    {
      id: 5,
      name: "Consistent Sleep Schedule",
      description: "Goal: Go to bed by 10 PM and wake up by 6 AM for 8 hours of sound sleep",
      target: "Target: 8hrs",
      icon: "😴",
      badgeColor: "bg-sky-100 text-sky-700",
      feeling: "Feeling so hard? Should We Plan",
      completed: false,
    },
  ]);

  // Mark goal as done
  const markGoalDone = (goalId) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  // Update goal (placeholder for future implementation)
  const updateGoal = (goalId) => {
    alert(`Update goal functionality coming soon for goal ${goalId}`);
  };

  // Add new goal (placeholder for future implementation)
  const addNewGoal = () => {
    alert("Add new goal functionality coming soon");
  };

  return (
    <Layout>
      <GoalsView
        weeklyProgress={weeklyProgress}
        goals={goals}
        markGoalDone={markGoalDone}
        updateGoal={updateGoal}
        addNewGoal={addNewGoal}
        {...props}
      />
    </Layout>
  );
}
