import React from "react";
import Layout from "../components/Layout";
import JournalView from "./Journal.view.jsx";

export default function JournalLogic(props) {
  // Example data for the journal entries and templates
  const journalData = {
    todayPrompt: "What made you smile today?",
    quickTemplates: [
      {
        icon: "Heart", // Lucide icon name
        title: "Gratitude Entry",
        description: "Write 3 things you're grateful for today and reflect on why they matter.",
        path: "/journal/new?template=gratitude",
      },
      {
        icon: "BookOpen", // Lucide icon name
        title: "Daily Reflection",
        description: "Describe how your day felt emotionally and what stood out most.",
        path: "/journal/new?template=daily",
      },
      {
        icon: "Target", // Lucide icon name
        title: "Goal Reflection",
        description: "What moved you closer to your wellness goals today?",
        path: "/journal/new?template=goal",
      },
    ],
    pastEntries: [
      {
        id: 1,
        date: "November 14, 2025",
        mood: "Calm",
        content: "Today was a peaceful day filled with small moments of joy... I woke up early and did my mediation. The morning felt quiet and clear. I spent time journaling and planning my goals for the week.",
        path: "/journal/entry/1",
      },
      {
        id: 2,
        date: "November 13, 2025",
        mood: "Hopeful",
        content: "Reflecting on my progress this week... I am proud of how consistent I've been with my wellness routine. Small steps are leading to big changes.",
        path: "/journal/entry/2",
      },
      {
        id: 3,
        date: "November 12, 2025",
        mood: "Grateful",
        content: "Three things I'm grateful for today... 1. My morning cup of chai. 2. A supportive conversation with a friend. 3. The beautiful sunset I witnessed.",
        path: "/journal/entry/3",
      },
    ],
  };

  return (
    <Layout>
      <JournalView {...props} data={journalData} />
    </Layout>
  );
}