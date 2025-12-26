import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import ExercisesView from "./Workout.view.jsx";
import { EXERCISES, FILTER_OPTIONS } from "../data/exerciseData.js";


export default function ExercisesLogic(props) {
    const [allExercises, setAllExercises] = useState(EXERCISES);
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