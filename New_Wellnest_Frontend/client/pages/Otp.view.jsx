import React from "react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

export default function OtpView({
  otp,
  setOtp,
  handleVerify,
  handleResend,
  mins,
  secs,
  emailFromState,
  canResend // <-- new prop
}) {
  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Enter OTP</h2>
        <p className="text-sm text-slate-600 mb-6">
          We sent a one-time code to <strong>{emailFromState}</strong>
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="text-sm text-slate-600">OTP Code</label>
            <input
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="input-underline text-center text-lg tracking-widest text-slate-800"
              placeholder="Enter code"
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button type="submit" className="w-40">Verify</Button>

            {/* Updated Resend OTP button */}
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`btn-ghost ${!canResend ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Resend OTP { !canResend && `(${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")})` }
            </button>
          </div>

          <div className="text-sm text-slate-600 mt-2">
            Expires in: <span className="font-mono">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link to="/signup" className="text-indigo-700 font-medium">Create an account instead</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
