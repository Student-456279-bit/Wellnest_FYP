import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotView from "./Forgot.view.jsx";
import { requestResetCode } from "../../shared/api"; // <-- new API import

export default function ForgotLogic(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || form.email.indexOf("@") === -1) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await requestResetCode(form.email);
    setLoading(false);

    if (result.error) {
      alert(result.error);
      return;
    }

    // success: navigate to OTP page
    navigate("/otp", { state: { email: form.email } });
  };

  return <ForgotView form={form} handle={handle} submit={submit} loading={loading} {...props} />;
}
