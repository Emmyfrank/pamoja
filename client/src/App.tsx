import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Loader from "./components/Loader/Loader";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuthStore } from "./store/auth.store";
import { ThemeProvider } from "./hooks/use-theme";
import "./index.css";
import { useAppConsent } from "./hooks/useAppConsent";
import { ConsentPopup } from "./components/common/ConsentPopup";

// Lazy load heavy components for faster initial load
const ClinicFinder = lazy(() => import("./pages/ClinicFinder"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const Learn = lazy(() => import("./pages/learn/Learn"));
const About = lazy(() => import("./pages/About"));
const CommunityChat = lazy(() => import("./pages/CommunityChat"));
const Profile = lazy(() => import("./pages/Profile"));
const Apps = lazy(() => import("./pages/Apps"));
const PeriodTracker = lazy(() => import("./pages/PeriodTracker"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));

// Lightweight loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pamoja-purple"></div>
  </div>
);

function App() {
  const { checkAuth, isCheckingAuth, isAuthenticated, user } = useAuthStore();
  const { hasConsented, isTooYoung, handleConsent, resetConsent } =
    useAppConsent();
  const [showLoader, setShowLoader] = useState(true);
  const [minLoaderTimeElapsed, setMinLoaderTimeElapsed] = useState(false);

  useEffect(() => {
    // Start auth check immediately (non-blocking)
    checkAuth();

    // Set minimum loader display time (max 2 seconds)
    const minLoaderTimer = setTimeout(() => {
      setMinLoaderTimeElapsed(true);
    }, 2000);

    return () => {
      clearTimeout(minLoaderTimer);
    };
  }, []);

  // Hide loader when both conditions are met:
  // 1. Minimum display time (2 seconds) has passed
  // 2. Auth check is complete
  useEffect(() => {
    if (minLoaderTimeElapsed && !isCheckingAuth) {
      // Small delay to ensure smooth transition
      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, 100);
      return () => clearTimeout(hideTimer);
    }
  }, [minLoaderTimeElapsed, isCheckingAuth]);

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

  // Show loader only for max 2 seconds
  if (showLoader) {
    return <Loader />;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="pamoja-theme">
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/services"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ClinicFinder />
                  </Suspense>
                }
              />
              <Route
                path="/chat"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Chatbot />
                  </Suspense>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <PrivacyPolicy />
                  </Suspense>
                }
              />

              <Route path="/apps">
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Apps />
                    </Suspense>
                  }
                />
                <Route
                  path="period-tracker"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PeriodTracker />
                    </Suspense>
                  }
                />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route
                path="/learn"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Learn />
                  </Suspense>
                }
              />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/community"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <CommunityChat />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
              {isAuthenticated && (
                <>
                  <Route
                    path="/profile"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Profile />
                      </Suspense>
                    }
                  />
                  {user?.role === "ADMIN" && (
                    <Route
                      path="/admin"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <AdminPanel />
                        </Suspense>
                      }
                    />
                  )}
                </>
              )}
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
