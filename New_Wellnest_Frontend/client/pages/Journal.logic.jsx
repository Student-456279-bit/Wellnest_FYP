import React from "react";
import Layout from "../components/Layout";
import JournalView from "./Journal.view.jsx";

import { useNavigate } from "react-router-dom";

export default function JournalLogic(props) {
  const navigate = useNavigate();
  const [entries, setEntries] = React.useState([]);

  // Initial Data (with localStorage check)
  React.useEffect(() => {
    const savedEntries = localStorage.getItem("journalAttempts"); // Using a temporary key for this session
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      // Default seed data
      const defaults = [
        {
          id: 1,
          date: "November 14, 2025",
          mood: "Calm",
          title: "Peaceful Morning",
          content: "Today was a peaceful day filled with small moments of joy... I woke up early and did my mediation. The morning felt quiet and clear. I spent time journaling and planning my goals for the week.",
          path: "/journal/entry/1",
        },
        {
          id: 2,
          date: "November 13, 2025",
          mood: "Happy",
          title: "Weekly Reflection",
          content: "Reflecting on my progress this week... I am proud of how consistent I've been with my wellness routine. Small steps are leading to big changes.",
          path: "/journal/entry/2",
        },
        {
          id: 3,
          date: "November 12, 2025",
          mood: "Grateful",
          title: "Gratitude List",
          content: "Three things I'm grateful for today... 1. My morning cup of chai. 2. A supportive conversation with a friend. 3. The beautiful sunset I witnessed.",
          path: "/journal/entry/3",
        },
      ];
      setEntries(defaults);
      localStorage.setItem("journalAttempts", JSON.stringify(defaults));
    }
  }, []);

  // Dynamic Prompts Data
  const promptsPool = [
    { text: "What made you smile today?", mood: "Happy" },
    { text: "Describe a moment of peace you found today.", mood: "Calm" },
    { text: "How are you feeling right now, really?", mood: "Neutral" },
    { text: "What is weighing on your mind today?", mood: "Sad" },
    { text: "List three small things that you are thankful for.", mood: "Grateful" }
  ];

  const [todaysPrompt, setTodaysPrompt] = React.useState(promptsPool[0]);

  // Randomize prompt on mount
  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * promptsPool.length);
    setTodaysPrompt(promptsPool[randomIndex]);
  }, []);

  const journalData = {
    todayPrompt: todaysPrompt.text,
    quickTemplates: [
      {
        icon: "Heart",
        title: "Gratitude Entry",
        description: "Write 3 things you're grateful for today and reflect on why they matter.",
        path: "gratitude",
      },
      {
        icon: "BookOpen",
        title: "Daily Reflection",
        description: "Describe how your day felt emotionally and what stood out most.",
        path: "daily",
      },
      {
        icon: "Target",
        title: "Goal Reflection",
        description: "What moved you closer to your wellness goals today?",
        path: "goal",
      },
    ],
    pastEntries: entries,
  };

  const onNewEntry = () => {
    navigate("/journal/new");
  };

  const onStartTemplate = (templateType) => {
    navigate(`/journal/new?template=${templateType}`);
  };

  const onOpenEntry = (id) => {
    navigate(`/journal/entry/${id}`);
  };

  const onWriteAboutPrompt = () => {
    navigate(`/journal/new?template=prompt&prompt=${encodeURIComponent(todaysPrompt.text)}&mood=${encodeURIComponent(todaysPrompt.mood)}`);
  };

  return (
    <Layout>
      <JournalView
        {...props}
        data={journalData}
        onNewEntry={onNewEntry}
        onStartTemplate={onStartTemplate}
        onOpenEntry={onOpenEntry}
        onWriteAboutPrompt={onWriteAboutPrompt}
      />
    </Layout>
  );
}