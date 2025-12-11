// App.jsx
import "./global.css";

import { Toaster } from "@/components/ui/toaster.jsx";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Otp from "./pages/Otp";
import ResetPassword from "./pages/ResetPassword";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
const Nutrition = lazy(() => import("./pages/Nutrition.logic.jsx"));
// import Nutrition from "./pages/Nutrition"; // This line was removed
import Workout from "./pages/Workout";
import Goals from "./pages/Goals";
import WellnestAiChatbot from "./pages/WellnestAiChatbot";
import Analytics from "./pages/Analytics";
import Journal from "./pages/Journal";
import Meditation from "./pages/Meditation";
import NotFound from "./pages/NotFound";

// ✅ Import UserProvider
import { UserProvider } from "../shared/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* ✅ Wrap all routes in UserProvider */}
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/form" element={<Form />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nutrition" element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Nutrition />
              </Suspense>
            } />
            <Route path="/goals" element={<Goals />} />
            <Route path="/wellnest-ai-chatbot" element={<WellnestAiChatbot />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

const host = globalThis;
if (!host.__REACT_ROOT__) {
  host.__REACT_ROOT__ = createRoot(container);
}

host.__REACT_ROOT__.render(<App />);

// Accept HMR and preserve the root between module reloads
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    // do not unmount so we can preserve the root across HMR, but clear module refs
  });
}
