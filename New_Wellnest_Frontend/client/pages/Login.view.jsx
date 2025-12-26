import React from "react";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/ui/PasswordField";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function LoginView({ form, handle, submit }) {
  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={submit} className="space-y-6">
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
              autoComplete="current-password"
            />
          </div>

          <div className="pt-6 flex flex-col items-center gap-3">
            <Button type="submit" className="w-44">Sign in</Button>
            <Link to="/forgot" className="btn-ghost">Forgot password?</Link>
          </div>

          <div className="mt-6 text-center text-sm">
            create account? <Link to="/signup" className="font-semibold text-indigo-700">Sign up</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
