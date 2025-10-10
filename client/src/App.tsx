import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import ClinicFinder from "./pages/ClinicFinder";
import Chatbot from "./pages/Chatbot";
import Learn from "./pages/learn/Learn";
import About from "./pages/About";
import CommunityChat from "./pages/CommunityChat";
import Loader from "./components/Loader/Loader";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuthStore } from "./store/auth.store";
import { ThemeProvider } from "./hooks/use-theme";
import { useEffect } from "react";
import "./index.css";
import Profile from "./pages/Profile";
import Apps from "./pages/Apps";
import PeriodTracker from "./pages/PeriodTracker";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useAppConsent } from "./hooks/useAppConsent";
import { ConsentPopup } from "./components/common/ConsentPopup";
import AdminPanel from "./pages/admin/AdminPanel";

function App() {
  const { checkAuth, isCheckingAuth, isAuthenticated, user } = useAuthStore();
  const { hasConsented, isTooYoung, handleConsent, resetConsent } =
    useAppConsent();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAccept = () => handleConsent(true);
  const handleDecline = () => handleConsent(false);

  if (!hasConsented)
    return <ConsentPopup onAccept={handleAccept} onDecline={handleDecline} />;

  if (isTooYoung) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-40 max-w-md text-center space-y-6">
          <div className="bg-white shadow-lg p-8 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Age Restriction
            </h1>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-700 font-medium">
                  Access Restricted: Age Requirement Not Met
                </p>
              </div>
              <p className="text-gray-600">
                We're sorry, but you must be at least 10 years old to use
                Pamoja. This is to ensure all users can safely engage with our
                health-related content.
              </p>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-gray-500">
                  Please talk to a parent or guardian about your health
                  questions. They can help guide you to age-appropriate
                  resources.
                </p>
                <a
                  href="https://www.who.int/health-topics/adolescent-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pamoja-purple hover:underline text-sm block"
                >
                  Visit WHO's Youth Health Resources →
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={resetConsent}
            className="text-sm text-gray-500 hover:text-pamoja-purple flex items-center justify-center gap-2 mx-auto"
          >
            <span>Made a mistake?</span>
            <span className="underline">Change your answer</span>
          </button>
        </div>
      </div>
    );
  }

  if (isCheckingAuth) return <Loader />;

  return (
    <ThemeProvider defaultTheme="system" storageKey="pamoja-theme">
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ClinicFinder />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route path="/apps">
              <Route index element={<Apps />} />
              <Route path="period-tracker" element={<PeriodTracker />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<CommunityChat />} />
            <Route path="*" element={<NotFound />} />
            {isAuthenticated && (
              <>
                <Route path="/profile" element={<Profile />} />
                {user?.role === "ADMIN" && (
                  <Route path="/admin" element={<AdminPanel />} />
                )}
              </>
            )}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
