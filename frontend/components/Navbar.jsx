import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ChatPanel from './ChatPanel';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-black tracking-tighter">
              A I V a
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-black/50 hover:text-black'}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-black/50 hover:text-black'}`}
              >
                Products
              </NavLink>
              {user?.isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-black' : 'text-black/50 hover:text-black'}`}
                >
                  Admin
                </NavLink>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Chat */}
              <button
                onClick={() => setChatOpen(true)}
                className="relative p-2 hover:bg-black/5 rounded-lg transition-colors flex items-center gap-1.5"
                title="Chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">Chat</span>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-black/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/profile" className="p-2 hover:bg-black/5 rounded-lg transition-colors" title={user.name}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-black/50 hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-black/50 hover:text-black transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-black/5 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-black/10 py-4 space-y-3">
              <Link to="/" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              {user?.isAdmin && <Link to="/admin" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
              {user ? (
                <>
                  <Link to="/profile" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block text-sm font-medium py-2 text-black/50">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Chat Panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default Navbar;
