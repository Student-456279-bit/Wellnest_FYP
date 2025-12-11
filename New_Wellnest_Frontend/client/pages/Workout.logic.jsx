import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import ExercisesView from "./Workout.view.jsx";

// Data Extracted from Processed_Exercise_Dataset.csv
const INITIAL_EXERCISES = [
    {"exercise_name": "Retraction", "preparation": "Stand or sit.", "execution": "Pull head back as far possible while looking slightly down and hold stretch.", "main_muscle": "Neck", "duration_seconds": 20, "body_area": "full_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "yes", "needs_equipment": "yes"}, 
    {"exercise_name": "Neck Extensor", "preparation": "Bow head forward with jaw shut. Depress chin into top of sternum.", "execution": "Slightly turn head to one side. Hold stretch. Repeat to other side.", "main_muscle": "Neck", "duration_seconds": 20, "body_area": "full_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "no", "needs_equipment": "yes"}, 
    {"exercise_name": "Doorway (Shoulder)", "preparation": "Stand at end of wall or in doorway facing perpendicular to wall...", "execution": "Turn body away from positioned arm. Hold stretch. Repeat with opposite arm.", "main_muscle": "Shoulder", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "yes", "needs_equipment": "no"}, 
    {"exercise_name": "Wall (Shoulder)", "preparation": "Position forearm as close as possible to upper arm.", "execution": "Grasp elbow overhead with other hand.", "main_muscle": "Shoulder", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "yes", "needs_equipment": "no"}, 
    {"exercise_name": "Side Deltoid", "preparation": "0", "execution": "0", "main_muscle": "Shoulder", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "no", "needs_equipment": "no"}, 
    {"exercise_name": "Rear Deltoid", "preparation": "0", "execution": "0", "main_muscle": "Shoulder", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "no", "needs_equipment": "yes"}, 
    {"exercise_name": "Overhead (Arms)", "preparation": "Put one arm overhead. Position forearm close to upper arm.", "execution": "Pull elbow back and toward head. Hold stretch. Repeat with opposite arm.", "main_muscle": "Upper Arms", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "yes", "needs_equipment": "yes"}, 
    {"exercise_name": "Towel Stretch", "preparation": "Grasp near end of towel or rope. Position towel behind head.", "execution": "Pull towel downward with lower arm. Hold stretch. Repeat with opposite arm.", "main_muscle": "Upper Arms", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "no", "needs_equipment": "no"}, 
    {"exercise_name": "Doorway (Arms)", "preparation": "Stand at end of wall or in doorway facing perpendicular to wall.", "execution": "Turn body away from positioned arm. Hold stretch. Repeat with opposite arm.", "main_muscle": "Upper Arms", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "yes", "needs_equipment": "yes"}, 
    {"exercise_name": "Seated Tricep", "preparation": "Sit on floor or mat. Lean back and place hands flat on floor close together behind body.", "execution": "Scoot hips forward away from hands. Hold stretch.", "main_muscle": "Upper Arms", "duration_seconds": 20, "body_area": "upper_body", "stretch_type": "static", "safe_for_knee_injury": "yes", "safe_for_back_injury": "yes", "needs_equipment": "no"}
];


// Unique filter options extracted from the dataset
const FILTER_OPTIONS = {
    main_muscle: ["Neck", "Shoulder", "Upper Arms", "Forearm", "Back", "Chest", "Hips", "Thighs", "Calves"],
    body_area: ["full_body", "upper_body", "lower_body"],
    stretch_type: ["static", "dynamic"],
    safe_for_knee_injury: ["yes", "no"],
    safe_for_back_injury: ["yes", "no"],
    needs_equipment: ["yes", "no"]
};


export default function ExercisesLogic(props) {
    const [allExercises, setAllExercises] = useState(INITIAL_EXERCISES); // Imagine this fetches the 94 rows
    const [filters, setFilters] = useState({
        main_muscle: 'All',
        body_area: 'All',
        stretch_type: 'All',
        safe_for_knee_injury: 'All',
        needs_equipment: 'All',
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const filteredExercises = useMemo(() => {
        return allExercises.filter(exercise => {
            let matches = true;
            
            // Check each active filter
            for (const key in filters) {
                const filterValue = filters[key];
                if (filterValue !== 'All' && filterValue !== 'no_filter') {
                    // Normalize case for comparison
                    if (String(exercise[key]).toLowerCase() !== String(filterValue).toLowerCase()) {
                        matches = false;
                        break;
                    }
                }
            }
            return matches;
        });
    }, [allExercises, filters]);


    return (
        <Layout>
            <ExercisesView 
                {...props} 
                exercises={filteredExercises}
                filters={filters}
                filterOptions={FILTER_OPTIONS}
                onFilterChange={handleFilterChange}
            />
        </Layout>
    );
}