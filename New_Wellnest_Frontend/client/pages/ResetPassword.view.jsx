import React from "react";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/ui/PasswordField";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function ResetPasswordView({ form, handle, submit }) {
  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
        <form onSubmit={submit} className="space-y-6 max-w-sm mx-auto">
          <div>
            <PasswordField
              label="New Password"
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

          <div className="pt-6">
            <Button type="submit" className="w-44">Save Password</Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link to="/signup" className="text-indigo-700 font-medium">Create an account instead</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
