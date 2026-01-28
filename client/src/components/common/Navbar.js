import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-[#7b1e1e]"
        >
          Sarees Den
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link to="/" className="hover:text-[#7b1e1e]">
            Home
          </Link>

          {/* Customer links */}
          {user?.role === "user" && (
            <>
              <Link to="/wishlist" className="hover:text-[#7b1e1e]">
                ❤️ Wishlist
              </Link>

              <Link to="/cart" className="relative hover:text-[#7b1e1e]">
                🛒 Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#7b1e1e] text-white text-xs px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link to="/my-orders">My Orders</Link>
            </>
          )}

          {/* Seller links */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-[#7b1e1e]">
                Add Saree
              </Link>
              <Link to="/admin/manage" className="hover:text-[#7b1e1e]">
                Manage
              </Link>
              <Link to="/admin/orders" className="hover:text-[#7b1e1e]">
                Orders
              </Link>
            </>
          )}

          {/* Auth */}
          {!user ? (
            <Link
              to="/auth"
              className="bg-[#7b1e1e] text-white px-4 py-2 rounded-lg hover:bg-[#5e1515]"
            >
              Login / Register
            </Link>
          ) : (
            <button
              onClick={logout}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
