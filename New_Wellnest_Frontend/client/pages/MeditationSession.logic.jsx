import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import MeditationSessionView from "./MeditationSession.view.jsx";

export default function MeditationSessionLogic() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Full content data for each session
    const sessionsData = {
        1: {
            id: 1,
            title: "The 5-Minute Reset: The Prayer of Stillness",
            subtitle: "Muraqaba / The Prayer of Quiet",
            duration: "5 min",
            mood: "Reverence & Communion",
            description: "This replaces generic 'breath awareness' with the awareness that you are being watched over by a loving Creator.",
            steps: [
                {
                    time: "Minute 0–1",
                    phase: "Disconnect",
                    instruction: "Disconnect from the world; acknowledge you are entering a holy space."
                },
                {
                    time: "Minute 1–4",
                    phase: "Silent Awareness",
                    instruction: "Silent awareness of God’s presence. Focus on the Source of the breath."
                },
                {
                    time: "Minute 4–5",
                    phase: "Closing",
                    instruction: "Closing prayer. Sit in the silence of knowing you are completely known and loved."
                }
            ],
            method: {
                anchor: "Close your eyes. Focus on the Source of the breath.",
                thought: 'Hold a single thought: "God is with me. He hears my breath. He sees my heart."',
                return: 'When your mind wanders, gently bring it back with: "Not now. Right now, I am with my Lord."'
            },
            color: "purple"
        },
        2: {
            id: 2,
            title: "The 10-Minute Reflection: The Body of Gratitude",
            subtitle: "Shukr / The Thanksgiving Scan",
            duration: "10 min",
            mood: "Gratitude & Worship",
            description: "A scan to thank the Creator for the gift of your body. This turns relaxation into an act of worship.",
            steps: [
                {
                    time: "Minute 0–1",
                    phase: "Intention",
                    instruction: "Deep breathing, asking for a grateful heart."
                },
                {
                    time: "Minute 1–9",
                    phase: "Thanksgiving Scan",
                    instruction: "Scanning the body (Feet, Hands, Heart, Eyes) with thanksgiving."
                },
                {
                    time: "Minute 9–10",
                    phase: "Final Praise",
                    instruction: "Release and entrust your physical health to Him."
                }
            ],
            method: {
                feet: 'Focus on your feet. "Thank you, Lord, for these feet that carry me to work and prayer."',
                hands: 'Focus on your hands. "Thank you for the ability to work, to hold, and to give."',
                heart: 'Feel your chest rise. "Thank you for a heart that beats without my command."',
                release: "As you thank God for each part, consciously relax it."
            },
            color: "blue"
        },
        3: {
            id: 3,
            title: "The 15-Minute Connection: Intercessory Prayer",
            subtitle: "Intercession / Dua for the Ummah",
            duration: "15 min",
            mood: "Compassion & Blessing",
            description: "Instead of just 'sending energy,' you are asking the All-Powerful to bestow blessings.",
            steps: [
                {
                    time: "Minute 0–2",
                    phase: "Calming",
                    instruction: "Calming the heart."
                },
                {
                    time: "Minute 2–5",
                    phase: "Family & Self",
                    instruction: "Prayer for close family and self."
                },
                {
                    time: "Minute 5–8",
                    phase: "The Struggling",
                    instruction: "Prayer for the sick, poor, or suffering."
                },
                {
                    time: "Minute 8–12",
                    phase: "The Difficult",
                    instruction: "Prayer for those you dislike or have conflict with."
                },
                {
                    time: "Minute 12–15",
                    phase: "The World",
                    instruction: "Prayer for the world, community, and peace."
                }
            ],
            method: {
                lovedOnes: 'Visualize family. "Lord, grant them health, guide their hearts, and protect them."',
                struggling: '"Lord, You are the Healer and Provider. Please comfort them and lift their burden."',
                difficult: '"Lord, guide them. Remove bitterness from my heart. Grant them peace."',
                world: '"Bless all humanity. Bring peace to torn lands."'
            },
            color: "teal"
        },
        4: {
            id: 4,
            title: "The 30-Minute Deep Dive: Remembrance & Contemplation",
            subtitle: "Dhikr / Centering Prayer",
            duration: "30 min",
            mood: "Focus & Divine Attributes",
            description: "A discipline of the mind to focus entirely on the Divine attributes using a Holy Name.",
            steps: [
                {
                    time: "Minute 0–5",
                    phase: "Preparation",
                    instruction: "Deep breathing and reciting a preparatory prayer."
                },
                {
                    time: "Minute 5–25",
                    phase: "The Name (Dhikr)",
                    instruction: "Repetition of the Holy Name with every exhale."
                },
                {
                    time: "Minute 25–30",
                    phase: "Afterglow",
                    instruction: "Sitting in the silence and 'afterglow' of the recitation."
                }
            ],
            method: {
                selectPhrase: 'Islamic: "SubhanAllah", "Allah". Christian: "Jesus", "Maranatha". Theist: "Mercy", "Grace".',
                rhythm: "Inhale: Receive God’s light. Exhale: Say the Name.",
                focus: "Let the meaning of the word sink into your soul.",
                drifting: 'If mind wanders, gently say, "I return to You," and go back to the Name.'
            },
            color: "pink"
        }
    };

    const session = sessionsData[id];

    const handleBack = () => {
        navigate("/meditation");
    };

    return (
        <Layout>
            <MeditationSessionView session={session} onBack={handleBack} />
        </Layout>
    );
}
