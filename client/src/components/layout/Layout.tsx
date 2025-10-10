import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommunityChatButton from "../chat/CommunityChatButton";
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const showChatButton = location.pathname !== "/chat";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      {showChatButton && <CommunityChatButton />}
    </div>
  );
};

export default Layout;
