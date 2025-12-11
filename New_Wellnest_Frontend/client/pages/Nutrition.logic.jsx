import React, { useState } from "react";
import Layout from "../components/Layout";
import NutritionView from "./Nutrition.view.jsx";

export default function NutritionLogic(props) {
  // Calorie tracking state
  const [calorieData, setCalorieData] = useState({
    goal: 2000,
    consumed: 1420,
    remaining: 580,
  });

  // Daily progress percentage
  const [dailyProgress, setDailyProgress] = useState(71);

  // Macronutrient breakdown state
  const [macronutrients, setMacronutrients] = useState({
    protein: { current: 45, goal: 60 },
    carbs: { current: 180, goal: 250 },
    fats: { current: 52, goal: 65 },
  });

  // Water intake state
  const [waterIntake, setWaterIntake] = useState({
    glassesConsumed: 6,
    totalGlasses: 8,
    mlConsumed: 1500,
    mlGoal: 2000,
    glassSize: 250, // ml per glass
  });

  // Functions to update water intake (ready for API integration)
  const addGlasses = (count) => {
    const newGlasses = Math.min(waterIntake.glassesConsumed + count, waterIntake.totalGlasses);
    const newMl = newGlasses * waterIntake.glassSize;
    setWaterIntake({
      ...waterIntake,
      glassesConsumed: newGlasses,
      mlConsumed: newMl,
    });
  };

  const removeGlass = () => {
    if (waterIntake.glassesConsumed > 0) {
      const newGlasses = waterIntake.glassesConsumed - 1;
      const newMl = newGlasses * waterIntake.glassSize;
      setWaterIntake({
        ...waterIntake,
        glassesConsumed: newGlasses,
        mlConsumed: newMl,
      });
    }
  };

  const resetWaterIntake = () => {
    setWaterIntake({
      ...waterIntake,
      glassesConsumed: 0,
      mlConsumed: 0,
    });
  };

  // Meal tracking state (ready for API integration)
  const [meals, setMeals] = useState({
    breakfast: {
      consumed: 420,
      goal: 500,
      items: [
        { name: "Aloo Paratha with dahi", calories: 320 },
        { name: "Chai (1 cup)", calories: 100 },
      ],
    },
    lunch: {
      consumed: 650,
      goal: 700,
      items: [
        { name: "Chicken Karahi (1 serving)", calories: 380 },
        { name: "Roti (2 pieces)", calories: 270 },
      ],
    },
    dinner: {
      consumed: 350,
      goal: 600,
      items: [{ name: "Daal Chawal", calories: 350 }],
    },
    snacks: {
      consumed: 0,
      goal: 200,
      items: [],
    },
  });

  // Recommended meals state (ready for API integration)
  const [recommendedMeals, setRecommendedMeals] = useState([
    {
      id: 1,
      name: "Chicken Biryani",
      description: "Aromatic rice with spices",
      calories: 520,
      icon: "utensils",
      gradient: "from-green-400 to-green-600",
    },
    {
      id: 2,
      name: "Seekh Kebab",
      description: "High protein, grilled kebabs",
      calories: 280,
      icon: "fish",
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      id: 3,
      name: "Daal Makhani",
      description: "Protein-rich lentil curry",
      calories: 350,
      icon: "bowl",
      gradient: "from-green-400 to-green-600",
    },
    {
      id: 4,
      name: "Haleem",
      description: "Traditional stew with lentils",
      calories: 450,
      icon: "egg",
      gradient: "from-orange-400 to-orange-600",
    },
  ]);

  // Functions to handle meal actions (ready for API integration)
  const handleAddFood = (mealType) => {
    // Placeholder for API call
    console.log(`Add food to ${mealType}`);
  };

  const handleAddRecommendedMeal = (mealId, mealType) => {
    // Placeholder for API call
    console.log(`Add recommended meal ${mealId} to ${mealType}`);
  };

  return (
    <Layout>
      <NutritionView
        calorieData={calorieData}
        dailyProgress={dailyProgress}
        macronutrients={macronutrients}
        waterIntake={waterIntake}
        onAddGlasses={addGlasses}
        onRemoveGlass={removeGlass}
        onResetWater={resetWaterIntake}
        meals={meals}
        recommendedMeals={recommendedMeals}
        onAddFood={handleAddFood}
        onAddRecommendedMeal={handleAddRecommendedMeal}
        {...props}
      />
    </Layout>
  );
}
