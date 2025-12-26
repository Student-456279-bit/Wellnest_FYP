import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeepPersonalizationView from "./DeepPersonalization.view.jsx";
import { savePersonalization, getPersonalization } from "../../shared/api.js";
import { useUser } from "../../shared/UserContext";
import { toast } from "@/hooks/use-toast.js";

export default function DeepPersonalizationLogic(props) {
    const navigate = useNavigate();
    const { user } = useUser();
    const userEmail = user?.email;
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        current_medications: "",
        mood_tracking_enabled: false,
        notification_language: "English",
        interaction_preference: "Both",
        ai_consent: false,
        data_sharing_consent: false,
        medical_report: null,
        fileName: "",
    });

    const [loading, setLoading] = useState(false);

    // Prefill form if personalization data exists
    useEffect(() => {
        if (!userEmail) return;

        getPersonalization(userEmail).then((data) => {
            if (!data.message && !data.error) {
                setForm((prev) => ({
                    ...prev,
                    current_medications: data.current_medications || "",
                    mood_tracking_enabled: Boolean(data.mood_tracking_enabled),
                    notification_language: data.notification_language || "English",
                    interaction_preference: data.interaction_preference || "Both",
                    ai_consent: Boolean(data.ai_consent),
                    data_sharing_consent: Boolean(data.data_sharing_consent),
                }));
            }
        });
    }, [userEmail]);

    const handle = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (e) => {
        setForm({ ...form, [e.target.name]: e.target.checked });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (16MB max)
            if (file.size > 16 * 1024 * 1024) {
                alert("File size must be less than 16MB");
                return;
            }

            // Validate file type
            const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                alert("Only PDF, JPG, and PNG files are allowed");
                return;
            }

            setForm({ ...form, medical_report: file, fileName: file.name });
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.ai_consent || !form.data_sharing_consent) {
            alert("Please accept both consent agreements to continue.");
            return;
        }

        if (!userEmail) {
            alert("User email missing.");
            return;
        }

        try {
            setLoading(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append("Users_Email", userEmail);
            formData.append("current_medications", form.current_medications);
            formData.append("mood_tracking_enabled", form.mood_tracking_enabled.toString());
            formData.append("notification_language", form.notification_language);
            formData.append("interaction_preference", form.interaction_preference);
            formData.append("ai_consent", form.ai_consent.toString());
            formData.append("data_sharing_consent", form.data_sharing_consent.toString());

            // Append file if selected
            if (form.medical_report) {
                formData.append("medical_report", form.medical_report);
            }

            const response = await savePersonalization(formData);

            if (response.error) {
                toast({ title: "Error", description: response.error });
            } else {
                toast({
                    title: "Success",
                    description: response.message || "Personalization completed successfully!"
                });

                // Redirect to dashboard
                setTimeout(() => navigate("/dashboard"), 500);
            }
        } catch (err) {
            console.error("Personalization error:", err);
            toast({ title: "Error", description: "Failed to save personalization data." });
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate("/form");
    };

    return (
        <DeepPersonalizationView
            form={form}
            handle={handle}
            handleCheckbox={handleCheckbox}
            handleFileChange={handleFileChange}
            submit={submit}
            goBack={goBack}
            loading={loading}
            fileInputRef={fileInputRef}
            {...props}
        />
    );
}
