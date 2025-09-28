import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
  // State management
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Context and navigation hooks
  const { user, loading, logout } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Update login state
  useEffect(() => {
    if (!user && !loading) {
      setIsLoggedIn(false);
    } else if (user) {
      setIsLoggedIn(true);
    }
  }, [user, loading]);

  // Update admin state
  useEffect(() => {
    if (user && user.role === "Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <header className="sticky top-0">
      <nav className="bg-slate-900/95 p-4 shadow-lg backdrop-blur text-white flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/dashboard" className="flex items-center gap-2 text-white">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/30 flex items-center justify-center">
            <span className="text-indigo-300 text-xs font-bold">DG</span>
          </div>
          <span className="font-semibold justify-center text-xl">
            DEXA Absensi
          </span>
          {isAdmin && (
            <span className="ml-2 rounded-md bg-indigo-500/15 text-indigo-300 text-xs px-2 py-0.5 ring-1 ring-indigo-400/30">
              Admin
            </span>
          )}
        </Link>

        {/* Navigation Links */}
        <div>
          {isLoggedIn && (
            <>
              {isAdmin && (
                <>
                  <Link
                    to="/employees"
                    className="px-3 py-2 font-medium text-lg text-slate-100 rounded-md hover:bg-gray-700 hover:text-white transition"
                  >
                    Employees
                  </Link>
                  <Link
                    to="/attendances"
                    className="px-3 py-2 font-medium text-lg text-slate-100 rounded-md hover:bg-gray-700 hover:text-white transition"
                  >
                    Attendances
                  </Link>
                </>
              )}
              <Link
                to="/dashboard"
                className="px-3 py-2 font-medium text-lg text-slate-100 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 font-medium text-lg text-slate-100 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
