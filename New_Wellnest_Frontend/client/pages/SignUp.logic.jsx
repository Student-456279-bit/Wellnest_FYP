// SignUp.logic.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpView from "./SignUp.view.jsx";
import { signupUser } from "../../shared/api.js";
import { useUser } from "../../shared/UserContext";

export default function SignUpLogic(props) {
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ get setUser from context

  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || form.email.indexOf("@") === -1) {
      alert("Please provide a valid full name and email");
      return;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ Send data to Flask backend
      const response = await signupUser({
        username: form.fullName,
        email: form.email,
        password: form.password,
      });

      if (response.error) {
        alert(`Signup failed: ${response.error}`);
      } else if (response.message) {
        alert(response.message);
        if (response.message.toLowerCase().includes("success")) {
          // ✅ store user info in context
          setUser({ email: form.email });

          navigate("/form"); // ✅ go to next page if successful
        }
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return <SignUpView form={form} handle={handle} submit={submit} loading={loading} {...props} />;
}
