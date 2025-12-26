import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Settings, LogOut } from "lucide-react";
import GlobalChatWidget from "./GlobalChatWidget.jsx";
import { useUser } from "../../shared/UserContext.jsx";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const mainPagePaths = ["/form", "/personalization", "/dashboard", "/nutrition", "/goals", "/wellnest-ai-chatbot", "/analytics", "/journal", "/meditation", "/workout", "/settings"];
  const isMaintPage = mainPagePaths.includes(location.pathname) || location.pathname.startsWith("/journal/") || location.pathname.startsWith("/meditation/") || location.pathname.startsWith("/workout/");

  // CONFIGURATION: Define which pages should show the Global Chatbot Widget
  const chatbotVisiblePaths = [
    "/dashboard",
    "/nutrition",
    "/goals",
    "/analytics",
    "/journal",
    "/meditation",
    "/workout",
    // Note: Excluded "/wellnest-ai-chatbot" to avoid redundancy
  ];
  const showChatbot = chatbotVisiblePaths.includes(location.pathname) || location.pathname.startsWith("/journal/") || location.pathname.startsWith("/meditation/") || location.pathname.startsWith("/workout/");

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const { user, logout } = useUser();
  const userNameDisplay = user ? (user.name || user.email || 'Wellnest User') : 'Demo User';

  const handleLogout = () => {
    setUserMenuOpen(false);
    setSidebarOpen(false);
    logout();
    navigate("/login");
  };

  const navigateToPage = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleNavigateToSettings = () => {
    setSidebarOpen(false);
    navigate("/settings");
  };

  return (
    <div className={`min-h-screen flex flex-col ${isMaintPage ? "bg-white" : ""}`}>
      {/* Top navigation for the Form page (main pages) */}
      {isMaintPage ? (
        <>
          <header className="w-full bg-left-blob text-white p-4 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle navigation menu"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <button
                onClick={() => navigateToPage("/dashboard")}
                className="flex-shrink-0 text-left hover:opacity-90 transition-opacity"
              >
                <h1 className="text-2xl font-extrabold">Wellnest</h1>
                <p className="text-xs opacity-90">Your Calm Digital space</p>
              </button>
              <div className="hidden sm:block text-sm opacity-90">Connect. Grow. Thrive — All in One Place</div>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((s) => !s)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <img src="/placeholder.svg" alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                <span className="hidden sm:inline text-sm font-medium">{userNameDisplay}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg text-sm text-slate-700">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Collapsible Sidebar for Main Pages */}
          <div className="flex flex-1">
            {/* Sidebar */}
            <aside
              className={`fixed md:relative left-0 top-16 md:top-0 h-[calc(100vh-64px)] md:h-auto z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:hidden"
                } md:flex md:flex-col`}
            >
              <div className="flex flex-col h-full md:pt-4 pb-4 px-4">
                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  <button
                    onClick={() => navigateToPage("/dashboard")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname === "/dashboard"
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigateToPage("/nutrition")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname === "/nutrition"
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Nutrition
                  </button>
                  <button
                    onClick={() => navigateToPage("/goals")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname === "/goals"
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Goals
                  </button>
                  <button
                    onClick={() => navigateToPage("/wellnest-ai-chatbot")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname === "/wellnest-ai-chatbot"
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Wellnest Ai Chatbot
                  </button>
                  <button
                    onClick={() => navigateToPage("/analytics")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname === "/analytics"
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => navigateToPage("/journal")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith("/journal")
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Journal
                  </button>
                  <button
                    onClick={() => navigateToPage("/meditation")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith("/meditation")
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Meditation
                  </button>
                  <button
                    onClick={() => navigateToPage("/workout")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith("/workout")
                      ? "bg-indigo-600 text-white font-medium"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    Workout
                  </button>
                </nav>

                {/* Bottom Actions */}
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <button
                    onClick={handleNavigateToSettings}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >

                    <Settings size={18} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 bg-white w-full">
              <div className="w-full max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </>
      ) : (
        <>
          <aside className="hidden md:flex w-1/2 bg-left-blob items-center justify-center text-white p-12">
            <div className="max-w-md">
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">Wellnest</h1>
              <p className="text-lg font-medium opacity-90 mb-8">Your Calm Digital space</p>
              <p className="text-base opacity-90">Connect. Grow. Thrive — All in One Place</p>
            </div>
          </aside>

          <main className="flex-1 flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-3xl mx-auto">
              {children}
              {(() => {
                // hide the footer login link on the /login and /form pages
                if (location.pathname === "/login" || location.pathname === "/form")
                  return null;
                return (
                  <footer className="mt-8 text-center text-sm text-slate-500">
                    <Link to="/login" className="text-indigo-600 hover:underline">
                      Already have an account? Log in
                    </Link>
                  </footer>
                );
              })()}
            </div>
          </main>
        </>
      )}

      {/* Small footer bar */}
      <div className="w-full bg-left-blob text-white text-center py-2 text-sm">Footer</div>

      {/* Global Chat Widget */}
      {showChatbot && <GlobalChatWidget />}
    </div>
  );
}
