import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ResetPasswordView from "./ResetPassword.view.jsx";
import { resetPassword } from "../../shared/api"; // <-- new API import

export default function ResetPasswordLogic(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return alert("Password must be at least 8 characters");
    if (form.password !== form.confirm) return alert("Passwords do not match");

    setLoading(true);
    const result = await resetPassword(emailFromState, form.password);
    setLoading(false);

    if (result.error) {
      alert(result.error);
      return;
    }

    alert("Password reset successfully!");
    navigate("/login");
  };

  return <ResetPasswordView form={form} handle={handle} submit={submit} loading={loading} {...props} />;
}
