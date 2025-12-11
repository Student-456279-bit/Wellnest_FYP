import React from "react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

export default function ForgotView({ form, handle, submit }) {
  return (
    <AuthLayout>
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">Forget Something</h2>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input name="email" value={form.email} onChange={handle} className="input-underline" />
          </div>

          <div className="pt-6 flex flex-col items-center gap-3">
            <Button type="submit" className="w-44">Recover</Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link to="/signup" className="text-indigo-700 font-medium">Create an account instead</Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
