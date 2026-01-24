import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-lime-900 fixed top-0 left-0 w-full z-50 h-20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <Link to="/" className="cursor-pointer">
          <img
            src="https://imgur.com/IOdaMXU.jpg"
            alt="AIVa logo"
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex space-x-12 text-white font-medium ml-20 font-(family-name:--my-font) ...">
            
            <Link to="/" className="hover:text-yellow-400 transition">
                HOME
            </Link>
            <Link to="/products" className="hover:text-yellow-400 transition">
                SHOP
            </Link>
            <Link to="/chat" className="hover:text-yellow-400 transition">
                CHATBOT
            </Link>
             <Link to="/chat" className="hover:text-yellow-400 transition">
                BRANDS
            </Link>
        </div>

        <div className="flex space-x-4 ml-auto items-center font-(family-name:--my-font) ...">
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-yellow-400 text-white rounded-lg hover:bg-yellow-400 transition"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-300 transition"
              >
                REGISTER
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
