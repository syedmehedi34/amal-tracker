import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { user, logOut } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      closeDrawer();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger Menu Icon and Logo (left) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDrawer}
              className="text-islamic dark:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link
              to="/"
              className="text-2xl font-bold text-islamic dark:text-white"
            >
              Ibad Allah (عباد الله)
            </Link>
          </div>

          {/* Navigation Links (center, visible on medium and larger screens) */}
          <div className="hidden md:flex flex-grow justify-center space-x-6">
            <Link
              to="/"
              className="nav-link dark:text-white dark:hover:text-gray-300"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/daily-tracker"
                  className="nav-link dark:text-white dark:hover:text-gray-300"
                >
                  Daily Tracker
                </Link>
                <Link
                  to="/tracker-status"
                  className="nav-link dark:text-white dark:hover:text-gray-300"
                >
                  Tracker Status
                </Link>
              </>
            )}
          </div>

          {/* User Actions and Theme Toggle (right, visible on medium and larger screens) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-islamic dark:text-white">
                  Welcome, {user.displayName || user.email.split("@")[0]}
                </span>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-islamic dark:text-white focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              <div className="relative w-6 h-6">
                <SunIcon
                  className={`h-6 w-6 absolute transition-opacity duration-300 ${
                    theme === "light" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <MoonIcon
                  className={`h-6 w-6 absolute transition-opacity duration-300 ${
                    theme === "dark" ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer (visible when isDrawerOpen is true) */}
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay (click to close drawer) */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeDrawer}
          aria-hidden="true"
        ></div>

        {/* Drawer Content */}
        <div
          className={`relative w-64 bg-white dark:bg-gray-800 h-full shadow-lg transform transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <span className="text-xl font-bold text-islamic dark:text-white">
              Daily Amal
            </span>
            <button
              onClick={closeDrawer}
              className="text-islamic dark:text-white focus:outline-none"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-islamic dark:text-white hover:text-islamic-dark dark:hover:text-gray-300"
              onClick={closeDrawer}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/daily-tracker"
                  className="text-islamic dark:text-white hover:text-islamic-dark dark:hover:text-gray-300"
                  onClick={closeDrawer}
                >
                  Daily Tracker
                </Link>
                <Link
                  to="/tracker-status"
                  className="text-islamic dark:text-white hover:text-islamic-dark dark:hover:text-gray-300"
                  onClick={closeDrawer}
                >
                  Tracker Status
                </Link>
              </>
            )}
            <hr className="my-2 dark:border-gray-700" />
            {user ? (
              <>
                <span className="text-islamic dark:text-white">
                  Welcome, {user.displayName || user.email.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-secondary"
                  onClick={closeDrawer}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={closeDrawer}
                >
                  Register
                </Link>
              </>
            )}
            {/* Theme Toggle Button in Drawer */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-islamic dark:text-white hover:text-islamic-dark dark:hover:text-gray-300 focus:outline-none"
              aria-label="Toggle theme"
            >
              <div className="relative w-6 h-6">
                <SunIcon
                  className={`h-6 w-6 absolute transition-opacity duration-300 ${
                    theme === "light" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <MoonIcon
                  className={`h-6 w-6 absolute transition-opacity duration-300 ${
                    theme === "dark" ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <span>Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
