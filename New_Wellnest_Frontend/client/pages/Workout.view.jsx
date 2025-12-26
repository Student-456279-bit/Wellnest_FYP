import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Dumbbell,
    Target,
    Leaf,
    Layers,
    CheckCircle,
    XCircle,
    Zap,
    RefreshCcw,
    SlidersHorizontal,
    Search,
} from "lucide-react";

const ExerciseCard = ({ exercise }) => {
    const navigate = useNavigate();

    // Utility function to determine badge styling
    const getBadgeClass = (value, type) => {
        const base = "text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap";
        if (type === 'safety') {
            return value === 'yes' ? `${base} bg-green-100 text-green-700` : `${base} bg-red-100 text-red-700`;
        }
        if (type === 'equipment') {
            return value === 'yes' ? `${base} bg-orange-100 text-orange-700` : `${base} bg-blue-100 text-blue-700`;
        }
        return `${base} bg-slate-100 text-slate-600`;
    };

    const handleClick = () => {
        navigate(`/workout/exercise/${exercise.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 transition-all hover:shadow-xl cursor-pointer hover:border-purple-200 hover:scale-[1.02]"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-2">
                    {exercise.exercise_name}
                </h3>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target size={20} className="text-purple-600" />
                </div>
            </div>

            {/* Badges for Metadata */}
            <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
                <span className={getBadgeClass(exercise.main_muscle)}>
                    <Layers size={12} className="inline mr-1" /> {exercise.main_muscle}
                </span>
                <span className={getBadgeClass(exercise.body_area)}>
                    <Dumbbell size={12} className="inline mr-1" /> {exercise.body_area}
                </span>
                <span className={getBadgeClass(exercise.needs_equipment, 'equipment')}>
                    <Zap size={12} className="inline mr-1" /> Equipment: {exercise.needs_equipment.toUpperCase()}
                </span>
            </div>

            {/* Preparation/Execution Descriptions */}
            <div className="space-y-4">
                {exercise.preparation !== '0' && (
                    <div>
                        <p className="text-sm font-semibold text-purple-600 flex items-center gap-1 mb-1">
                            <Leaf size={16} /> Preparation
                        </p>
                        <p className="text-sm text-slate-700">{exercise.preparation}</p>
                    </div>
                )}
                {exercise.execution !== '0' && (
                    <div>
                        <p className="text-sm font-semibold text-purple-600 flex items-center gap-1 mb-1">
                            <Zap size={16} /> Execution
                        </p>
                        <p className="text-sm text-slate-700">{exercise.execution}</p>
                    </div>
                )}
            </div>

            {/* Safety Badges */}
            <div className="flex gap-4 mt-4 pt-4 border-t">
                <span className={getBadgeClass(exercise.safe_for_knee_injury, 'safety')}>
                    {exercise.safe_for_knee_injury === 'yes' ? <CheckCircle size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                    Knee Safe: {exercise.safe_for_knee_injury.toUpperCase()}
                </span>
                <span className={getBadgeClass(exercise.safe_for_back_injury, 'safety')}>
                    {exercise.safe_for_back_injury === 'yes' ? <CheckCircle size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                    Back Safe: {exercise.safe_for_back_injury.toUpperCase()}
                </span>
            </div>

        </div>
    );
};


// Custom dropdown component for filters
const FilterDropdown = ({ title, options, selectedValue, onChange, filterKey }) => {
    return (
        <div className="mb-4">
            <label className="text-sm font-semibold text-slate-700 mb-1 block">
                {title}
            </label>
            <select
                value={selectedValue}
                onChange={(e) => onChange(filterKey, e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-purple-500 focus:border-purple-500 appearance-none transition-shadow"
            >
                <option value="All">All {title}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                ))}
            </select>
        </div>
    );
};


export default function ExercisesView({ exercises, filters, filterOptions, onFilterChange }) {

    const handleResetFilters = () => {
        Object.keys(filters).forEach(key => onFilterChange(key, 'All'));
    };

    return (
        <div className="w-full pt-8 pb-8">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Dumbbell size={24} className="text-purple-600" />
                        <h1 className="text-3xl font-bold text-slate-900">Exercise Recommendations</h1>
                    </div>
                    <p className="text-slate-600">Explore and filter recommended stretches and exercises based on your needs.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Filter Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-xl shadow-lg h-fit lg:sticky lg:top-8">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <SlidersHorizontal size={20} /> Filters
                            </h2>
                            <button
                                onClick={handleResetFilters}
                                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
                            >
                                <RefreshCcw size={14} /> Reset
                            </button>
                        </div>

                        <FilterDropdown
                            title="Main Muscle Group"
                            options={filterOptions.main_muscle}
                            selectedValue={filters.main_muscle}
                            onChange={onFilterChange}
                            filterKey="main_muscle"
                        />
                        <FilterDropdown
                            title="Body Area"
                            options={filterOptions.body_area}
                            selectedValue={filters.body_area}
                            onChange={onFilterChange}
                            filterKey="body_area"
                        />
                        <FilterDropdown
                            title="Stretch Type"
                            options={filterOptions.stretch_type}
                            selectedValue={filters.stretch_type}
                            onChange={onFilterChange}
                            filterKey="stretch_type"
                        />
                        <FilterDropdown
                            title="Knee Injury Safe"
                            options={filterOptions.safe_for_knee_injury}
                            selectedValue={filters.safe_for_knee_injury}
                            onChange={onFilterChange}
                            filterKey="safe_for_knee_injury"
                        />
                        <FilterDropdown
                            title="Needs Equipment"
                            options={filterOptions.needs_equipment}
                            selectedValue={filters.needs_equipment}
                            onChange={onFilterChange}
                            filterKey="needs_equipment"
                        />

                    </aside>

                    {/* Right Column: Exercise List */}
                    <main className="flex-1">
                        <div className="mb-6">
                            <p className="text-slate-600">
                                Displaying <span className="font-bold text-purple-600">{exercises.length}</span> results.
                            </p>
                            {/* Optional: Add a general search bar here if needed */}
                        </div>

                        {exercises.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {exercises.map((exercise, index) => (
                                    <ExerciseCard key={index} exercise={exercise} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-xl shadow-lg border border-slate-200 text-center text-slate-600">
                                <Search size={48} className="mx-auto text-purple-300 mb-4" />
                                <p className="text-lg font-medium">No exercises match your current filters.</p>
                                <p className="text-sm">Try adjusting your selections or resetting the filters.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}