import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Hamburger and close icons

function Navbar() {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Toggle drawer open/close
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger Menu Icon (visible on small screens) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDrawer}
              className="text-islamic focus:outline-none"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-islamic">
            Ibad Allah (عباد الله)
          </Link>

          {/* Navigation Links (visible on medium and larger screens) */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="nav-link">
              Home
            </Link>
            {user && (
              <>
                <Link to="/daily-tracker" className="nav-link">
                  Daily Tracker
                </Link>
                <Link to="/tracker-status" className="nav-link">
                  Tracker Status
                </Link>
              </>
            )}
          </div>

          {/* User Actions (visible on medium and larger screens) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-islamic">Welcome, {user.name}</span>
                <button onClick={logout} className="btn-secondary">
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
          </div>
        </div>
      </div>

      {/* Drawer (visible when isDrawerOpen is true on small screens) */}
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
          className={`relative w-64 bg-white h-full shadow-lg transform transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-xl font-bold text-islamic">Daily Amal</span>
            <button
              onClick={closeDrawer}
              className="text-islamic focus:outline-none"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className="text-islamic hover:text-islamic-dark"
              onClick={closeDrawer}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/daily-tracker"
                  className="text-islamic hover:text-islamic-dark"
                  onClick={closeDrawer}
                >
                  Daily Tracker
                </Link>
                <Link
                  to="/tracker-status"
                  className="text-islamic hover:text-islamic-dark"
                  onClick={closeDrawer}
                >
                  Tracker Status
                </Link>
              </>
            )}
            <hr className="my-2" />
            {user ? (
              <>
                <span className="text-islamic">Welcome, {user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    closeDrawer();
                  }}
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
