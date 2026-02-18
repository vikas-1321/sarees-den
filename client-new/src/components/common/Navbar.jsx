import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Search, Heart, ShoppingBag, User, X, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, logout, isAdmin } = useAuth(); 
  const { cart } = useCart();
  const navigate = useNavigate();

  // Trending/Suggested terms to help users find products faster
  const SUGGESTIONS = ["Bridal", "Wedding", "Banarasi", "Silk", "Gold", "Reception"];

  // Reusable active link styling logic for NavLink components
  const activeLinkStyle = ({ isActive }) => 
    `transition-all duration-300 pb-1 ${
      isActive 
        ? "text-[#7b1e1e] border-b-2 border-[#7b1e1e]" 
        : "hover:text-[#7b1e1e] text-gray-700"
    }`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery(""); // Clear for next use
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 font-serif">
      {/* 1. SEARCH MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="absolute inset-0 h-screen bg-white z-[60] flex flex-col items-center justify-center px-10 animate-in fade-in slide-in-from-top duration-300">
          <div className="w-full max-w-4xl">
            {/* Search Input Form */}
            <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
              <input 
                autoFocus
                className="w-full text-2xl md:text-4xl outline-none border-b border-black pb-4 font-light tracking-widest uppercase"
                placeholder="SEARCH FOR SAREES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <X 
                onClick={() => setIsSearchOpen(false)} 
                className="cursor-pointer w-10 h-10 text-gray-300 hover:text-black transition-colors" 
              />
            </form>

            {/* Suggested Searches Section */}
            <div className="flex flex-wrap gap-4 justify-start">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 w-full mb-2">
                Suggested Searches:
              </span>
              {SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(term)}`);
                    setIsSearchOpen(false);
                  }}
                  className="px-6 py-2 border border-gray-100 rounded-full text-[10px] uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-all duration-300"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN NAVBAR CONTENT */}
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Left: Navigation Links */}
        <nav className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.3em] font-semibold">
          <NavLink to="/shop-all" className={activeLinkStyle}>
            All Sarees
          </NavLink>

          <NavLink to="/category/Wedding" className={activeLinkStyle}>
            Wedding
          </NavLink>

          <NavLink to="/category/Reception" className={activeLinkStyle}>
            Reception
          </NavLink>

          {/* Admin Tools Dropdown */}
          {isAdmin && (
            <div className="relative group flex items-center gap-1 text-[#7b1e1e] cursor-pointer">
              <span>Seller Panel</span>
              <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-gray-100 p-4 w-48 mt-0 animate-in fade-in zoom-in-95">
                <Link to="/admin/add" className="block py-2 text-gray-600 hover:text-black lowercase font-sans text-xs">
                  Add New Saree
                </Link>
                <Link to="/admin/manage" className="block py-2 text-gray-600 hover:text-black lowercase font-sans text-xs">
                  Manage Products
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Center: Brand Logo */}
        <Link to="/" className="text-2xl tracking-[0.4em] uppercase font-light text-[#7b1e1e] text-center">
          SAREE <span className="font-bold">DEN</span>
        </Link>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-6 text-gray-800">
          {/* Search Trigger */}
          <Search 
            onClick={() => setIsSearchOpen(true)} 
            className="w-5 h-5 cursor-pointer hover:text-[#7b1e1e] transition-colors" 
          />
          
          {/* Wishlist Link */}
          <Link to="/wishlist">
            <Heart className="w-5 h-5 hover:text-[#7b1e1e] transition-colors" />
          </Link>
          
          {/* Shopping Bag with dynamic badge */}
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 hover:text-[#7b1e1e] transition-colors" />
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7b1e1e] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <Link to="/profile">
                <User className="w-5 h-5 hover:text-[#7b1e1e] transition-colors" />
              </Link>
              <button onClick={handleLogout} className="hover:text-[#7b1e1e] transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-[11px] uppercase tracking-widest font-semibold hover:text-[#7b1e1e] transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;