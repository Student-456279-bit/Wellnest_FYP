import React, { useState, useEffect } from "react";
import { generateWellnessPlan } from "../../shared/api.js";
import { useUser } from "../../shared/UserContext.jsx";
import Layout from "../components/Layout";
import NutritionView from "./Nutrition.view.jsx";

export default function NutritionLogic(props) {
  // Calorie tracking state
  const [calorieData, setCalorieData] = useState({
    goal: 2000,
    consumed: 0, // Init to 0, fetch later?
    remaining: 2000,
  });
  // Determine Today's Key
  // Helper to get today's storage key
  const getStorageKey = () => {
    if (!userEmail) return null;
    const date = new Date().toISOString().split('T')[0];
    return `wellnest_meals_${userEmail}_${date}`;
  };

  // Calorie tracking state

  // Auth key from Context
  const { user } = useUser();
  const userEmail = user ? user.email : null;

  // Helper to sync with backend
  const syncNutritionToBackend = async (newConsumed) => {
    if (!userEmail) return;
    try {
      const isMet = newConsumed >= calorieData.goal;
      await fetch('http://localhost:5000/api/track/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          date: new Date().toISOString().split('T')[0],
          goal_type: 'food',
          status: isMet,
          value: newConsumed
        })
      });
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  // Helper to sync Water
  const syncWaterToBackend = async (newMl) => {
    if (!userEmail) return;
    try {
      const isMet = newMl >= waterIntake.mlGoal;
      await fetch('http://localhost:5000/api/track/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          date: new Date().toISOString().split('T')[0],
          goal_type: 'water',
          status: isMet,
          value: newMl
        })
      });
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

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
    syncWaterToBackend(newMl);
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
      syncWaterToBackend(newMl);
    }
  };

  const resetWaterIntake = () => {
    setWaterIntake({
      ...waterIntake,
      glassesConsumed: 0,
      mlConsumed: 0,
    });
    syncWaterToBackend(0);
  };

  // Meal tracking state
  const [meals, setMeals] = useState({
    breakfast: { consumed: 0, goal: 500, items: [] },
    lunch: { consumed: 0, goal: 700, items: [] },
    dinner: { consumed: 0, goal: 600, items: [] },
    snacks: { consumed: 0, goal: 200, items: [] },
  });
  // Load meals from localStorage on mount (Soft Save)
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMeals(parsed);
        } catch (e) {
          console.error("Failed to parse saved meals", e);
        }
      }
    }
  }, [userEmail]);

  // Save meals to localStorage whenever they change
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(meals));
    }
  }, [meals, userEmail]);

  // Recommended meals state (populated from Plan)
  const [recommendedMeals, setRecommendedMeals] = useState([]);

  // --- Add Food Modal State & Logic ---
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [allFoodItems, setAllFoodItems] = useState([]); // Full list from API
  const [filteredFoodItems, setFilteredFoodItems] = useState([]); // Filtered list for display
  const [selectedSearchFood, setSelectedSearchFood] = useState(null); // For details view
  const [searchServings, setSearchServings] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch food items on mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/nutrition/food-items");
        if (response.ok) {
          const data = await response.json();
          setAllFoodItems(data);
          setFilteredFoodItems(data);
        } else {
          console.error("Failed to fetch food items");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, []);

  // Fetch Wellness Plan for Recommendations & Goals
  useEffect(() => {
    async function fetchPlan() {
      if (!userEmail) return;
      try {
        const res = await generateWellnessPlan(userEmail);
        if (res && res.plan) {
          const p = res.plan;

          // 1. Update Calorie Goal
          if (p.food && p.food.target_calories) {
            setCalorieData(prev => ({
              ...prev,
              goal: p.food.target_calories,
              remaining: p.food.target_calories - prev.consumed
            }));
          }

          // 2. Update Water Goal (New!)
          if (p.water) {
            let wGoal = 2000;
            if (p.water.toLowerCase().includes('l')) {
              wGoal = Math.round(parseFloat(p.water) * 1000);
            } else {
              wGoal = parseInt(p.water) || 2000;
            }
            const glasses = Math.ceil(wGoal / 250);

            setWaterIntake(prev => ({
              ...prev,
              mlGoal: wGoal,
              totalGlasses: glasses
            }));
          }

          // 3. Populate Recommendations
          if (p.food && p.food.menu) {
            const menu = p.food.menu; // { Breakfast: "Dish (cal)", ... }
            const recoms = [];
            let idCounter = 1;

            Object.entries(menu).forEach(([mealName, dishStr]) => {
              // dishStr is like "Oatmeal (300 kcal)" or "No meal found"
              if (!dishStr || dishStr.includes("No meal")) return;

              // Parse "Dish Name (123 kcal)"
              const match = dishStr.match(/(.*)\s\((\d+)\s?kcal\)/);
              if (match) {
                const name = match[1].trim();
                const cals = parseInt(match[2]);

                let icon = "utensils";
                if (mealName === "Breakfast") icon = "egg";
                if (mealName === "Lunch") icon = "bowl";
                if (mealName === "Dinner") icon = "fish";

                recoms.push({
                  id: idCounter++,
                  name: name,
                  description: `Recommended for ${mealName}`,
                  calories: cals,
                  icon: icon,
                  gradient: "from-green-400 to-emerald-600"
                });
              }
            });
            setRecommendedMeals(recoms);
          }
        }
      } catch (err) {
        console.error("Failed to fetch plan for nutrition:", err);
      }
    }
    fetchPlan();
    fetchPlan();
  }, [userEmail]);

  // Fetch Daily Progress (Consumed Calories)
  useEffect(() => {
    async function fetchDailyProgress() {
      if (!userEmail) return;
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const res = await fetch(`http://localhost:5000/api/track/history/${userEmail}?start=${todayStr}&end=${todayStr}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const todayRecord = data.find(r => r.date === todayStr);
            if (todayRecord) {
              if (todayRecord.food_calories) {
                setCalorieData(prev => ({
                  ...prev,
                  consumed: todayRecord.food_calories,
                  remaining: prev.goal - todayRecord.food_calories
                }));
              }
              if (todayRecord.water_ml) {
                const ml = todayRecord.water_ml;
                const glasses = Math.round(ml / 250);
                setWaterIntake(prev => ({
                  ...prev,
                  glassesConsumed: glasses,
                  mlConsumed: ml
                }));
              }
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch daily progress:", e);
      }
    }
    fetchDailyProgress();
  }, [userEmail, calorieData.goal]); // depend on goal to calc remaining correctly

  // Update filtered list when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFoodItems(allFoodItems);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allFoodItems.filter((item) =>
        item.dish.toLowerCase().includes(lowerQuery)
      );
      setFilteredFoodItems(filtered);
    }
  }, [searchQuery, allFoodItems]);

  const handleOpenAddFoodModal = (mealType) => {
    setSelectedMealType(mealType);
    setSearchQuery(""); // Reset search
    setIsAddFoodModalOpen(true);
  };

  const handleCloseAddFoodModal = () => {
    setIsAddFoodModalOpen(false);
    setSelectedMealType(null);
    setSelectedSearchFood(null); // Reset selection
    setSearchServings(1);
  };

  const handleSelectFoodItem = (foodItem) => {
    setSelectedSearchFood(foodItem);
    setSearchServings(1);
  };

  const handleBackToSearch = () => {
    setSelectedSearchFood(null);
  };

  const handleConfirmAddSearchFood = () => {
    if (!selectedSearchFood) return;

    const totalCalories = Math.round(selectedSearchFood.calories_kcal * searchServings);

    // Update local state (meals)
    setMeals((prevMeals) => {
      const currentMeal = prevMeals[selectedMealType];
      return {
        ...prevMeals,
        [selectedMealType]: {
          ...currentMeal,
          consumed: currentMeal.consumed + totalCalories,
          items: [
            ...currentMeal.items,
            {
              name: `${selectedSearchFood.dish} (${searchServings} serving${searchServings !== 1 ? 's' : ''})`,
              calories: totalCalories
            },
          ],
        },
      };
    });

    // Update daily totals
    setCalorieData(prev => ({
      ...prev,
      consumed: prev.consumed + totalCalories,
      remaining: prev.remaining - totalCalories
    }));

    handleCloseAddFoodModal();

    // Sync to Backend
    const newConsumed = calorieData.consumed + totalCalories;
    syncNutritionToBackend(newConsumed);
  };

  // --- Recommended Meal Modal State & Logic ---
  const [isRecommendedModalOpen, setIsRecommendedModalOpen] = useState(false);
  const [selectedRecommendedMeal, setSelectedRecommendedMeal] = useState(null);

  const handleAddRecommendedMeal = (mealId) => {
    const meal = recommendedMeals.find(m => m.id === mealId);
    if (meal) {
      setSelectedRecommendedMeal(meal);
      setIsRecommendedModalOpen(true);
    }
  };

  const handleCloseRecommendedModal = () => {
    setIsRecommendedModalOpen(false);
    setSelectedRecommendedMeal(null);
  };

  const handleConfirmAddRecommendedMeal = (mealType, servings) => {
    if (!selectedRecommendedMeal) return;

    const totalCalories = Math.round(selectedRecommendedMeal.calories * servings);

    // Update local state (meals)
    setMeals((prevMeals) => {
      const currentMeal = prevMeals[mealType];
      return {
        ...prevMeals,
        [mealType]: {
          ...currentMeal,
          consumed: currentMeal.consumed + totalCalories,
          items: [
            ...currentMeal.items,
            {
              name: `${selectedRecommendedMeal.name} (${servings} serving${servings !== 1 ? 's' : ''})`,
              calories: totalCalories
            },
          ],
        },
      };
    });

    // Update daily totals
    setCalorieData(prev => ({
      ...prev,
      consumed: prev.consumed + totalCalories,
      remaining: prev.remaining - totalCalories
    }));

    handleCloseRecommendedModal();

    // Sync to Backend
    const newConsumed = calorieData.consumed + totalCalories;
    syncNutritionToBackend(newConsumed);
  };

  // Functions to handle meal actions (ready for API integration)
  const handleAddFood = (mealType) => {
    // Placeholder for API call
    console.log(`Add food to ${mealType}`);
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
        onAddFood={handleOpenAddFoodModal} // Changed to open modal
        onAddRecommendedMeal={handleAddRecommendedMeal}

        // New props for Modal
        isAddFoodModalOpen={isAddFoodModalOpen}
        onCloseAddFoodModal={handleCloseAddFoodModal}
        selectedMealType={selectedMealType}
        foodItems={filteredFoodItems}
        onSearchFood={setSearchQuery}
        searchQuery={searchQuery}
        onSelectFoodItem={handleSelectFoodItem}
        selectedSearchFood={selectedSearchFood}
        searchServings={searchServings}
        onSetSearchServings={setSearchServings}
        onBackToSearch={handleBackToSearch}
        onConfirmAddSearchFood={handleConfirmAddSearchFood}

        // New props for Recommended Modal
        isRecommendedModalOpen={isRecommendedModalOpen}
        onCloseRecommendedModal={handleCloseRecommendedModal}
        selectedRecommendedMeal={selectedRecommendedMeal}
        onConfirmAddRecommendedMeal={handleConfirmAddRecommendedMeal}

        {...props}
      />
    </Layout>
  );
}
