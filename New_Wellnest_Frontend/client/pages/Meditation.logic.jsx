import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import MeditationView from "./Meditation.view.jsx";

export default function MeditationLogic(props) {
  const navigate = useNavigate();
  const meditationData = {
    category: "Stress Relief",
    description:
      "Find peace and release tension with guided meditations designed to help you let go of stress and anxiety.",
    recommendedSession: {
      prompt: "Your Daily Goal: 15 mins",
      intro:
        "Consistently hitting your 15-minute target can reduce stress by 40%. Here are some sessions to help you get there.",
      buttonText: "Explore Sessions Below",
    },
    availableSessions: [
      {
        id: 1,
        title: "The Prayer of Stillness",
        duration: "5 min",
        difficulty: "Beginner",
        icon: "PauseCircle",
        color: "purple",
      },
      {
        id: 2,
        title: "The Body of Gratitude",
        duration: "10 min",
        difficulty: "Beginner",
        icon: "Heart",
        color: "blue",
      },
      {
        id: 3,
        title: "Intercessory Prayer",
        duration: "15 min",
        difficulty: "Intermediate",
        icon: "User",
        color: "teal",
      },
      {
        id: 4,
        title: "Remembrance & Contemplation",
        duration: "30 min",
        difficulty: "Advanced",
        icon: "Sparkles",
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

  const handleStartSession = (sessionId) => {
    // Scroll to sessions list if recommended, otherwise navigate to session
    if (sessionId === "recommended") {
      document.getElementById("available-sessions")?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/meditation/session/${sessionId}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <Layout>
      <MeditationView
        data={meditationData}
        onStartSession={handleStartSession}
        onBackToDashboard={handleBackToDashboard}
        onCategoryClick={handleCategoryClick}
      />
    </Layout>
  );
}