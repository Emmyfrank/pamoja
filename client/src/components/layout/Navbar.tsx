import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, User2Icon, X, LogIn } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const navItems = [
    { name: "HOME", path: "/", icon: "" },
    { name: "OUR APPS", path: "/apps", icon: "" },
    { name: "CHAT", path: "/chat", icon: "" },
    { name: "COMMUNITY", path: "/community", icon: "" },
    { name: "LEARN", path: "/learn", icon: "" },
    { name: "ABOUT", path: "/about", icon: "" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-pamoja-purple">
              Pamoja
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm 2xl:text-md font-medium transition-colors flex items-center gap-2 hover:scale-105 transform ${
                  location.pathname === item.path
                    ? "text-pamoja-purple"
                    : "text-neutral-600 hover:text-pamoja-purple"
                }`}
              >
                {item.icon}
                <span className="hidden lg:block">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Auth Button - Hidden on Mobile */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <Link to={user?.role == "ADMIN" ? "/admin" : "/profile"}>
                  <Button className="bg-pamoja-purple hover:bg-pamoja-purple/90 text-white px-6 py-2 flex items-center gap-2 text-base">
                    <User2Icon size={20} />
                    <span>{user?.username || "Anonymous"}</span>
                  </Button>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-pamoja-purple text-white px-6 py-2 flex items-center gap-2 text-base"
                >
                  <span className="hidden lg:block">GET STARTED</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-neutral-600" />
              ) : (
                <Menu className="h-6 w-6 text-neutral-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl flex flex-col"
            >
              <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-neutral-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 text-lg font-medium transition-colors p-2 rounded-lg hover:bg-gray-50 ${
                        location.pathname === item.path
                          ? "text-pamoja-purple bg-pamoja-purple/5"
                          : "text-neutral-600"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Auth Button */}
                  {isAuthenticated ? (
                    <Link
                      to={user?.role === "ADMIN" ? "/admin" : "/profile"}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg bg-pamoja-purple text-white"
                    >
                      <User2Icon size={20} />
                      <span>{user?.username || "Anonymous"}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg bg-pamoja-purple text-white"
                    >
                      <LogIn size={20} />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Logo at bottom */}
              <div className="p-6 border-t border-gray-200">
                <span className="text-2xl font-bold text-pamoja-purple block text-center">
                  Pamoja
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
