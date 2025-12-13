import React from "react";
import Layout from "../components/Layout";
import JournalEntryView from "./JournalEntry.view";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function JournalEntryLogic() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const templateType = searchParams.get("template");

    // State for the entry
    const [entry, setEntry] = React.useState({
        title: "",
        content: "",
        mood: "",
        date: new Date().toLocaleDateString(),
    });

    // Load existing entry if ID is present
    React.useEffect(() => {
        if (id) {
            const saved = localStorage.getItem("journalAttempts");
            if (saved) {
                const entries = JSON.parse(saved);
                const found = entries.find(e => e.id.toString() === id);
                if (found) {
                    setEntry(found);
                }
            }
        } else {
            // Handle Templates & Prompts
            const moodParam = searchParams.get("mood");

            if (templateType === 'gratitude') {
                setEntry(e => ({ ...e, title: "Gratitude Entry", content: "Three things I am grateful for:\n1. \n2. \n3. ", mood: "Grateful" }));
            } else if (templateType === 'daily') {
                setEntry(e => ({ ...e, title: "Daily Reflection", content: "Today I felt...", mood: "Neutral" }));
            } else if (templateType === 'goal') {
                setEntry(e => ({ ...e, title: "Goal Reflection", content: "I moved closer to my goals by...", mood: "Happy" }));
            } else if (templateType === 'prompt') {
                const prompt = searchParams.get("prompt");
                if (prompt) {
                    setEntry(e => ({ ...e, title: prompt, content: "", mood: moodParam || "" }));
                }
            }
        }
    }, [id, templateType, searchParams]);

    const handleSave = () => {
        const saved = localStorage.getItem("journalAttempts");
        let entries = saved ? JSON.parse(saved) : [];

        if (id) {
            // Update existing (if we want to allow editing, otherwise just ignore or save as new)
            // For now, let's allow editing
            entries = entries.map(e => e.id.toString() === id ? { ...entry, id: parseInt(id) } : e);
        } else {
            // Create new
            const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
            const newEntry = {
                ...entry,
                id: newId,
                path: `/journal/entry/${newId}`,
                // Ensure date is static string for this demo
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            };
            entries.unshift(newEntry); // Add to top
        }

        localStorage.setItem("journalAttempts", JSON.stringify(entries));
        navigate("/journal");
    };

    const handleCancel = () => {
        navigate("/journal");
    };

    return (
        <Layout>
            <JournalEntryView
                entry={entry}
                setEntry={setEntry}
                onSave={handleSave}
                onCancel={handleCancel}
                isReadOnly={!!id} // If ID exists, we are viewing (initially)
            />
        </Layout>
    );
}
