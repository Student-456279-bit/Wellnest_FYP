import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ExerciseDetailsView from "./ExerciseDetails.view.jsx";
import { EXERCISES } from "../data/exerciseData.js";

export default function ExerciseDetailsLogic(props) {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the exercise by ID
    const exercise = EXERCISES.find(ex => ex.id === parseInt(id));

    // If exercise not found, redirect to workout page
    React.useEffect(() => {
        if (!exercise) {
            navigate("/workout");
        }
    }, [exercise, navigate]);

    // Don't render if exercise not found (will redirect)
    if (!exercise) {
        return null;
    }

    return (
        <Layout>
            <ExerciseDetailsView
                {...props}
                exercise={exercise}
            />
        </Layout>
    );
}
