import React from "react";
import Layout from "../components/Layout";
import MeditationView from "./Meditation.view.jsx";

export default function MeditationLogic(props) {
  const meditationData = {
    category: "Stress Relief",
    description:
      "Find peace and release tension with guided meditations designed to help you let go of stress and anxiety.",
    recommendedSession: {
      prompt: "Recommended for Your Current Mood",
      intro:
        "Based on your recent activities and stress levels, we suggest starting with \"Deep Breathing Meditation\" today.",
      buttonText: "Start Recommended Session",
    },
    availableSessions: [
      {
        id: 1,
        title: "Deep Breathing Meditation",
        duration: "10 min",
        difficulty: "Beginner",
        icon: "Lightbulb", // Lucide icon
        color: "purple", // for button styling
      },
      {
        id: 2,
        title: "Body Scan Relaxation",
        duration: "15 min",
        difficulty: "Beginner",
        icon: "User", // Lucide icon
        color: "blue",
      },
      {
        id: 3,
        title: "Progressive Muscle Relaxation",
        duration: "12 min",
        difficulty: "Intermediate",
        icon: "Heart", // Lucide icon
        color: "teal",
      },
      {
        id: 4,
        title: "Stress Release Visualization",
        duration: "20 min",
        difficulty: "Intermediate",
        icon: "Sparkles", // Lucide icon
        color: "pink",
      },
    ],
    benefits: [
      {
        id: 1,
        title: "Reduces Stress",
        description: "Lower cortisol levels and feel more relaxed",
        icon: "Heart", // Lucide icon
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
      },
      {
        id: 2,
        title: "Improves Breathing",
        description: "Develop better breath control and awareness",
        icon: "Leaf", // Lucide icon
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      },
      {
        id: 3,
        title: "Calms Nervous System",
        description: "Activate your parasympathetic response",
        icon: "PauseCircle", // Lucide icon
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
      },
    ],
    youMightAlsoLike: [
      { label: "Sleep", path: "/meditation/sleep" },
      { label: "Anxiety Release", path: "/meditation/anxiety" },
      { label: "Focus", path: "/meditation/focus" },
    ],
  };

  return (
    <Layout>
      <MeditationView {...props} data={meditationData} />
    </Layout>
  );
}