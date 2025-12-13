// Login.logic.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginView from "./Login.view.jsx";
import { signinUser } from "../../shared/api.js"; // make sure this path is correct
import { useUser } from "../../shared/UserContext"; // ✅ import context

export default function LoginLogic(props) {
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ get setUser from context

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Handle form submit
  const submit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || form.email.indexOf("@") === -1) {
      alert("Please enter a valid email");
      return;
    }

    if (!form.password) {
      alert("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      // Call Flask backend signin
      const response = await signinUser({
        email: form.email,
        password: form.password,
      });

      if (response.error) {
        alert(`Login failed: ${response.error}`);
      } else if (response.message) {
        alert(response.message);
        if (response.message.toLowerCase().includes("successful")) {
          // ✅ store user info in context
          setUser({ email: form.email });

          // Check if profile exists
          try {
            // We need to use full URL for fetch unless proxied, assumed localhost:5000 based on previous code
            const profileRes = await fetch(`http://localhost:5000/api/profile/get/${form.email}`);
            if (profileRes.ok) {
              // Profile exists (200) -> Dashboard
              navigate("/dashboard");
            } else {
              // Profile missing (404) -> Form
              navigate("/form");
            }
          } catch (e) {
            // Fallback on error -> Dashboard (safer?) or Form? 
            // Logic says if error, assume user needs to check things or normal flow.
            // Let's default to dashboard to avoid trapping users if server errs on profile check?
            // Or Form if key data needed? User said "redirected to the Form page whenever they log in" IF not entered.
            // If error checking, maybe Form is safer to ensure data? 
            // Let's assume Profile Check works. If fail, log and go Dashboard to be safe.
            console.error("Profile check failed", e);
            navigate("/dashboard");
          }
        }
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return <LoginView form={form} handle={handle} submit={submit} loading={loading} {...props} />;
}
