import React, { useState } from "react";
import SettingsView from "./Settings.view.jsx";
import { updateProfile } from "../../shared/api.js";
import { useUser } from "../../shared/UserContext.jsx";
import { useToast } from "../hooks/use-toast.js";

const Settings = () => {
    const { user, login } = useUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Profile
        username: user?.name || "",
        email: user?.email || "",
        phone: "",
        dob: "",
        gender: "",



        // Notification Preferences
        workoutReminders: true,
        meditationReminders: true,
        moodCheckin: false,
        goalMilestones: true,
        weeklySummary: true,

        // App Preferences
        theme: "light",
        measurementSystem: "metric",
        firstDayOfWeek: "monday",
        timeFormat: "12h",

        // Privacy & Security
        password: "",
        confirmPassword: "",
        twoFactorAuth: false,
        dataSharing: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name, checked) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive"
            });
            return;
        }



        setLoading(true);
        try {
            const res = await updateProfile({
                email: user.email,
                username: formData.username,
                password: formData.password || undefined,
                // Add additional fields when backend is ready
                // phone: formData.phone,
                // dob: formData.dob,
                // gender: formData.gender,
                // etc...
            });

            if (res.error) {
                toast({
                    title: "Error",
                    description: res.error,
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Success",
                    description: "Settings saved successfully!",
                });

                // For now, we'll save additional settings to localStorage
                // In production, these should be saved to the backend
                localStorage.setItem('userSettings', JSON.stringify({
                    phone: formData.phone,
                    dob: formData.dob,
                    gender: formData.gender,
                    workoutReminders: formData.workoutReminders,
                    meditationReminders: formData.meditationReminders,
                    moodCheckin: formData.moodCheckin,
                    goalMilestones: formData.goalMilestones,
                    weeklySummary: formData.weeklySummary,
                    theme: formData.theme,
                    measurementSystem: formData.measurementSystem,
                    firstDayOfWeek: formData.firstDayOfWeek,
                    timeFormat: formData.timeFormat,
                    twoFactorAuth: formData.twoFactorAuth,
                    dataSharing: formData.dataSharing
                }));
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        }
    };

    // Load settings from localStorage on mount
    React.useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setFormData(prev => ({ ...prev, ...parsed, username: user?.name || "", email: user?.email || "" }));
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }, [user]);

    return (
        <SettingsView
            formData={formData}
            loading={loading}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleSliderChange={handleSliderChange}
            handleToggle={handleToggle}
            handleSubmit={handleSubmit}
        />
    );
};

export default Settings;
