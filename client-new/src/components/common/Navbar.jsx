import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Search, Heart, ShoppingBag, User, X, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Destructure logout and isAdmin from your AuthContext
  const { user, logout, isAdmin } = useAuth(); 
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
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
      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white z-[60] flex items-center px-10 animate-in fade-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto flex items-center gap-4">
            <input 
              autoFocus
              className="w-full text-2xl outline-none border-b border-black pb-2 font-light tracking-widest"
              placeholder="SEARCH FOR SAREES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <X onClick={() => setIsSearchOpen(false)} className="cursor-pointer w-8 h-8 text-gray-400 hover:text-black" />
          </form>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
        {/* Navigation Links */}
        <nav className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-700">
          {/* Updated Navbar Links */}
          <Link to="/shop-all" className="hover:text-[#7b1e1e] transition">
            All Sarees
          </Link>

          <Link to="/category/Wedding" className="hover:text-[#7b1e1e] transition">
            Wedding
          </Link>

          <Link to="/category/Reception" className="hover:text-[#7b1e1e] transition">
            Reception
          </Link>

          {/* Admin Tools Dropdown - Only visible to Admins */}
          {isAdmin && (
            <div className="relative group flex items-center gap-1 text-[#7b1e1e] cursor-pointer">
              <span>Seller Panel</span>
              <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-gray-100 p-4 w-48 mt-0 animate-in fade-in zoom-in-95">
                <Link to="/admin/add" className="block py-2 text-gray-600 hover:text-black lowercase font-sans">Add New Saree</Link>
                <Link to="/admin/manage" className="block py-2 text-gray-600 hover:text-black lowercase font-sans">Manage Products</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Logo */}
        <Link to="/" className="text-2xl tracking-[0.4em] uppercase font-light text-[#7b1e1e] text-center">
          SAREE <span className="font-bold">DEN</span>
        </Link>

        {/* Action Icons */}
        <div className="flex items-center gap-6 text-gray-800">
          <Search onClick={() => setIsSearchOpen(true)} className="w-5 h-5 cursor-pointer hover:text-[#7b1e1e]" />
          <Link to="/wishlist"><Heart className="w-5 h-5 hover:text-[#7b1e1e]" /></Link>
          
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 hover:text-[#7b1e1e]" />
            {cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7b1e1e] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <Link to="/profile"><User className="w-5 h-5 hover:text-[#7b1e1e]" /></Link>
              <button onClick={handleLogout} className="hover:text-[#7b1e1e] transition">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-[11px] uppercase tracking-widest font-semibold hover:text-[#7b1e1e]">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;