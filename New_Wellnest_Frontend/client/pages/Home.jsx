import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold">Welcome to Wellnest</h1>
        <p className="mt-4 text-slate-600">Get started by creating an account.</p>
        <div className="mt-6">
          <Link to="/signup" className="btn-primary px-4 py-2">Sign up</Link>
        </div>
      </div>
    </Layout>
  );
}
