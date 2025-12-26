import React from "react";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/ui/PasswordField";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function SignUpView({ form, handle, submit }) {
  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">Sign up</h2>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handle} className="input-underline" />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input name="email" value={form.email} onChange={handle} className="input-underline" />
          </div>

          <div>
            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handle}
              className="input-underline"
              autoComplete="new-password"
            />
          </div>

          <div>
            <PasswordField
              label="Confirm Password"
              name="confirm"
              value={form.confirm}
              onChange={handle}
              className="input-underline"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-slate-600">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I accept the terms &amp; Condition</label>
          </div>

          <div className="pt-6 flex flex-col items-center gap-3">
            <Button type="submit" className="w-44">Sign up</Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-700">Log in</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
