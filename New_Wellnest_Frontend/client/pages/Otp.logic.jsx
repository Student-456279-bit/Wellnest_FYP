import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpView from "./Otp.view.jsx";
import { verifyResetCode, requestResetCode } from "../../shared/api";

export default function OtpLogic(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const timerRef = useRef(null);
  const [resendCount, setResendCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const canResend = secondsLeft === 0;

  // Timer effect
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!canResend) return;

    setResendCount((c) => c + 1);
    setSecondsLeft(120); // reset timer immediately

    // Call backend to actually resend OTP
    const result = await requestResetCode(emailFromState);
    if (result.error) {
      alert(`Failed to resend OTP: ${result.error}`);
    } else {
      alert("OTP resent successfully!");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.trim().length < 4) {
      alert("Please enter a valid OTP From your email!!");
      return;
    }

    setLoading(true);
    const result = await verifyResetCode(emailFromState, otp);
    setLoading(false);

    if (result.error) {
      alert(result.error);
      return;
    }

    navigate("/reset-password", { state: { email: emailFromState } });
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <OtpView
      otp={otp}
      setOtp={(v) => setOtp(v.replace(/[^0-9]/g, ""))}
      handleVerify={handleVerify}
      handleResend={handleResend}
      mins={mins}
      secs={secs}
      emailFromState={emailFromState}
      loading={loading}
      canResend={canResend}
      {...props}
    />
  );
}
