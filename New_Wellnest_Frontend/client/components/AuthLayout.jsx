import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="hidden md:flex w-1/2 bg-left-blob items-center justify-center text-white p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Wellnest</h1>
          <p className="text-lg font-medium opacity-90 mb-8">Your Calm Digital space</p>
          <p className="text-base opacity-90">Connect. Grow. Thrive — All in One Place</p>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </main>
    </div>
  );
}
