import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { toast } from "@/hooks/use-toast.js";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip.jsx";
import { Activity, Heart, Zap, Target, Apple } from "lucide-react";
import { useUser } from "../../shared/UserContext";
import { generateWellnessPlan } from "../../shared/api";
import { useNavigate } from "react-router-dom";

export default function Form() {
  const { user } = useUser();
  const navigate = useNavigate();
  const userEmail = user?.email;

  const [form, setForm] = useState({
    height: "",
    weight: "",
    bodyFat: "",
    activityLevel: "Moderate",
    injuries: "",
    medical: "",
    allergies: "",
    sleep: "7",
    workHours: "9 AM - 5 PM",
    stress: "3",
    mainGoal: "Improve Wellness",
    secondaryGoals: "",
    workoutMinutes: "30",
    workoutDays: "3",
    dietaryPreference: "Mix",
    cuisinePreference: "Mix",
    dislikedFoods: "",
    mealsPerDay: "3",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleMainGoalChange = (goal) => setForm({ ...form, mainGoal: goal });

  // Prefill form if profile exists
  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:5000/api/profile/get/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) {
          setForm((prev) => ({
            ...prev,
            height: data.height || "",
            weight: data.weight || "",
            bodyFat: data.bodyFat || "",
            activityLevel: data.activityLevel || "Moderate",
            injuries: data.injuries || "",
            medical: data.medical || "",
            allergies: data.allergies || "",
            sleep: data.sleep ? String(data.sleep) : "7",
            workHours: data.workHours || "9 AM - 5 PM",
            stress: data.stress ? String(data.stress) : "3",
            mainGoal: data.mainGoal || "Improve Wellness",
            secondaryGoals: data.secondaryGoals || "",
            workoutMinutes: data.workoutMinutes ? String(data.workoutMinutes) : "30",
            workoutDays: data.workoutDays ? String(data.workoutDays) : "3",
            dietaryPreference: data.dietaryPreference || "Mix",
            cuisinePreference: data.cuisinePreference || "Mix",
            dislikedFoods: data.dislikedFoods || "",
            mealsPerDay: data.mealsPerDay ? String(data.mealsPerDay) : "3",
          }));
        }
      })
      .catch((err) => console.error("Profile Fetch Error:", err));
  }, [userEmail]);

  const requiredFields = [
    "height",
    "weight",
    "activityLevel",
    "injuries",
    "medical",
    "allergies",
    "sleep",
    "workHours",
    "stress",
    "mainGoal",
    "workoutMinutes",
    "workoutDays",
    "dietaryPreference",
    "cuisinePreference",
    "dislikedFoods",
    "mealsPerDay",
  ];

  const isFormValid = requiredFields.every((field) => String(form[field]).trim() !== "");

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert(
        "Please complete all required fields so we can provide the best personalized plan for you. Thank you."
      );
      return;
    }

    if (!userEmail) {
      alert("User email missing.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, Users_Email: userEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({ title: "Profile saved", description: data.message || "Your details have been saved." });

        // Trigger Plan Generation (Asynchronous - "While generated")
        console.log("Triggering wellness plan generation...");
        generateWellnessPlan(userEmail).then(planRes => {
          console.log("Plan generation triggered:", planRes);
        });

        // Redirect immediately to Dashboard
        setTimeout(() => navigate("/dashboard"), 500);

      } else {
        toast({ title: "Error", description: data.message || "Failed to save profile." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Backend connection failed." });
    }
  };

  const InfoLabel = ({ children, info }) => (
    <label className="text-sm text-slate-600 flex items-center gap-2">
      <span>{children}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center"
          >
            ?
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="max-w-xs">
          {info}
        </TooltipContent>
      </Tooltip>
    </label>
  );

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`}
      >
        <Icon size={20} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    </div>
  );

  const mainGoalOptions = ["Lose Weight", "Gain Muscle", "Improve Wellness", "Manage Stress"];
  const stressEmoji = { 1: "😴", 2: "😊", 3: "😐", 4: "😟", 5: "😰" };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900">Tell us about yourself</h1>
        <p className="mb-8 text-slate-600">
          Share a few details so we can personalize your Wellnest experience.
        </p>

        <form onSubmit={submit} className="space-y-8">
          {/* Physical Details Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <SectionHeader icon={Activity} title="Physical Details" color="bg-indigo-500" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InfoLabel info="Your current height in centimeters. Helps calculate BMI and personalize recommendations.">
                  Height
                </InfoLabel>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    name="height"
                    value={form.height}
                    onChange={handle}
                    placeholder="170"
                    className="input-underline flex-1"
                  />
                  <span className="text-sm text-slate-500">cm</span>
                </div>
              </div>
              <div>
                <InfoLabel info="Your current weight in kilograms. Used to tailor workout and nutrition guidance.">
                  Weight
                </InfoLabel>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    name="weight"
                    value={form.weight}
                    onChange={handle}
                    placeholder="70"
                    className="input-underline flex-1"
                  />
                  <span className="text-sm text-slate-500">kg</span>
                </div>
              </div>
              <div>
                <InfoLabel info="Optional — if you know it, this helps fine-tune body composition guidance.">
                  Body Fat Percentage (optional)
                </InfoLabel>
                <input
                  name="bodyFat"
                  value={form.bodyFat}
                  onChange={handle}
                  placeholder="20"
                  className="input-underline mt-2"
                />
              </div>
              <div>
                <InfoLabel info="How active you are day-to-day — affects calorie and training recommendations.">
                  Activity Level
                </InfoLabel>
                <select
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={handle}
                  className="input-underline mt-2 w-full"
                >
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>Active</option>
                </select>
              </div>
            </div>
          </section>

          {/* Health & Medical Info Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <SectionHeader icon={Heart} title="Health & Medical Info" color="bg-pink-500" />
            <div className="space-y-6">
              <div>
                <InfoLabel info="Tell us about injuries that may affect exercise choices so we can suggest safe options.">
                  Current Injuries?
                </InfoLabel>
                <textarea
                  name="injuries"
                  value={form.injuries}
                  onChange={handle}
                  placeholder="Describe any current injuries or physical limitations..."
                  className="input-underline mt-2 w-full min-h-24"
                />
              </div>
              <div>
                <InfoLabel info="Share medical conditions your coach or program should be aware of (e.g., diabetes, heart conditions).">
                  Medical Conditions
                </InfoLabel>
                <textarea
                  name="medical"
                  value={form.medical}
                  onChange={handle}
                  placeholder="List any medical conditions we should know about..."
                  className="input-underline mt-2 w-full min-h-24"
                />
              </div>
              <div>
                <InfoLabel info="List allergies or foods you avoid so meal plans can respect your needs.">
                  Allergies or Food Restrictions
                </InfoLabel>
                <textarea
                  name="allergies"
                  value={form.allergies}
                  onChange={handle}
                  placeholder="Any allergies or dietary restrictions..."
                  className="input-underline mt-2 w-full min-h-24"
                />
              </div>
            </div>
          </section>

          {/* Lifestyle Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <SectionHeader icon={Zap} title="Lifestyle" color="bg-orange-500" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-600">Average Sleep Hours</label>
                  <input
                    name="sleep"
                    value={form.sleep}
                    onChange={handle}
                    placeholder="7"
                    className="input-underline mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Typical Work Hours</label>
                  <input
                    name="workHours"
                    value={form.workHours}
                    onChange={handle}
                    placeholder="8"
                    className="input-underline mt-2"
                  />
                </div>
              </div>

              {/* Stress Slider */}
              <div>
                <label className="text-sm text-slate-600 block mb-4">Stress Level (1-5)</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{stressEmoji[parseInt(form.stress) || 3]}</span>
                    <input
                      type="range"
                      name="stress"
                      min="1"
                      max="5"
                      value={form.stress}
                      onChange={handle}
                      className="flex-1 mx-4 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                    <span className="text-lg">{stressEmoji[5]}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Very Calm</span>
                    <span>Very Stressed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fitness Goals Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <SectionHeader icon={Target} title="Fitness Goals" color="bg-indigo-600" />
            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-600 block mb-3">Main Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mainGoalOptions.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleMainGoalChange(goal)}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors text-sm ${form.mainGoal === goal
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-150"
                        }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Secondary Goals (optional)</label>
                <textarea
                  name="secondaryGoals"
                  value={form.secondaryGoals}
                  onChange={handle}
                  placeholder="Any other goals you'd like to achieve..."
                  className="input-underline mt-2 w-full min-h-20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-600">Available Workout Time per Day (minutes)</label>
                  <input
                    name="workoutMinutes"
                    value={form.workoutMinutes}
                    onChange={handle}
                    placeholder="30"
                    className="input-underline mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Available Workout Days per Week</label>
                  <select
                    name="workoutDays"
                    value={form.workoutDays}
                    onChange={handle}
                    className="input-underline mt-2 w-full"
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Diet & Preferences Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <SectionHeader icon={Apple} title="Diet & Preferences" color="bg-green-500" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-600">Dietary Preference</label>
                  <select
                    name="dietaryPreference"
                    value={form.dietaryPreference}
                    onChange={handle}
                    className="input-underline mt-2 w-full"
                  >
                    <option>Vegetarian</option>
                    <option>Non-vegetarian</option>
                    <option>Vegan</option>
                    <option>Mix</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Cuisine Preference</label>
                  <select
                    name="cuisinePreference"
                    value={form.cuisinePreference}
                    onChange={handle}
                    className="input-underline mt-2 w-full"
                  >
                    <option>Local</option>
                    <option>International</option>
                    <option>Mix</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Disliked or Restricted Foods</label>
                <textarea
                  name="dislikedFoods"
                  value={form.dislikedFoods}
                  onChange={handle}
                  placeholder="List any foods you dislike or cannot eat..."
                  className="input-underline mt-2 w-full min-h-20"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Typical Meals per Day</label>
                <input
                  name="mealsPerDay"
                  value={form.mealsPerDay}
                  onChange={handle}
                  placeholder="3"
                  className="input-underline mt-2"
                />
              </div>
            </div>
          </section>

          {/* Validation Message */}
          {!isFormValid && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium">Complete Required Fields</p>
              <p className="text-amber-700 mt-1">
                Please complete all fields on this page so we can provide the best possible personalized plan for you. Thank you.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`btn-primary ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
