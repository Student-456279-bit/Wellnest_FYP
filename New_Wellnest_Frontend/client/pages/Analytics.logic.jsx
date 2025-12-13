import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AnalyticsView from "./Analytics.view.jsx";

export default function AnalyticsLogic(props) {
  const navigate = useNavigate();
  // Any data fetching for the entire analytics page would happen here.
  // For example, fetching all user wellness data from an API.
  // Analytics State
  const [analyticsData, setAnalyticsData] = React.useState({
    currentStreak: 14,
    weeklyRate: 86,
    wellnessScore: 78,
    activeGoals: { completed: 8, total: 10 },
    nutrition: {
      caloriesMet: 67,
      balancedScore: 92,
      goalAchievement: 86,
      trendData: [
        { x: 0, y: 30 }, { x: 20, y: 40 }, { x: 40, y: 35 }, { x: 60, y: 55 }, { x: 80, y: 50 }, { x: 100, y: 60 }
      ],
    },
    activity: {
      totalWorkouts: 12,
      activeMinutes: 340,
      goalAchievement: 95,
      barsData: [20, 35, 30, 45, 40, 50, 25],
    },
    mindfulness: {
      meditationMinutes: 180,
      avgSleepScore: 8.2,
      consistency: 88,
    },
    consistencyTrend: {
      labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
      data: [70, 75, 73, 78, 80, 82, 85],
    },
    weeklyGoalHitRate: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [80, 90, 70, 85, 60, 95, 80],
      average: 83
    },
    averageEnergyLevel: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [7, 8, 7.5, 9, 8, 9.5, 9],
      average: 7.6
    },
    mindBodyBalance: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      data: [60, 70, 75, 85],
      current: 85
    },
    monthlyGoals: 73,
    ranking: 18,
    aiInsights: [
      "You have the strongest completion time.",
      "You skip nutrition goals mostly on weekends",
      "Activity improved 15% from last week."
    ],
  });

  // Modal State Management
  const [modalState, setModalState] = React.useState({
    isOpen: false,
    title: "",
    message: "",
    isLoading: false,
  });

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  // Button Handlers
  const handleUpdateActivity = () => {
    // Show updating modal
    setModalState({
      isOpen: true,
      title: "Updating Activity",
      message: "Syncing your latest activity data... please wait.",
      isLoading: true
    });

    // Simulate 3s delay then reload
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  const handleModifyGoalPlan = () => {
    setModalState({
      isOpen: true,
      title: "Modify Goal Plan",
      message: "Regenerating the goal plan is not implemented yet. Do you want to go to the Goals page instead?",
      isLoading: false,
      confirmText: "Yes, go to Goals",
      cancelText: "No, stay here",
      onConfirm: () => {
        navigate("/goals");
        setModalState(curr => ({ ...curr, isOpen: false }));
      },
      onCancel: () => {
        setModalState(curr => ({ ...curr, isOpen: false }));
      }
    });
  };

  const handleViewGoalProgress = () => {
    navigate("/goals");
  };

  const handleAskWellnessAI = () => {
    navigate("/wellnest-ai-chatbot");
  };

  return (
    <Layout>
      <AnalyticsView
        data={analyticsData}
        onUpdateActivity={handleUpdateActivity}
        onReturnToDashboard={handleReturnToDashboard}
        onModifyGoalPlan={handleModifyGoalPlan}
        onViewGoalProgress={handleViewGoalProgress}
        onAskWellnessAI={handleAskWellnessAI}
        modalState={modalState}
        closeModal={closeModal}
        {...props}
      />
    </Layout>
  );
}