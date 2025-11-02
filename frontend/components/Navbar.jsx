import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <Link to="/" className="text-purple-600 font-extrabold text-2xl cursor-pointer">
          AIVa
        </Link>

        <div className="hidden md:flex space-x-12 text-gray-700 font-medium ml-20">
            
            <Link to="/" className="hover:text-purple-600 transition">
                Home
            </Link>
            <Link to="/products" className="hover:text-purple-600 transition">
                Products
            </Link>
            <Link to="/chat" className="hover:text-purple-600 transition">
                Chat
            </Link>
        </div>

        <div className="flex space-x-4 ml-auto items-center">
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/cart"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center"
              >
                Cart (<span className="text-red-500 font-bold">0</span>)
              </Link>

              
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  {user.name}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
