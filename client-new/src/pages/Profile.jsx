import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Package, Heart, TicketPercent, Headphones } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-10 px-4 font-sans pt-24">
      <div className="max-w-3xl mx-auto">

        {/* 🧾 Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#7b1e1e] text-white flex items-center justify-center text-2xl font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </div>

            {/* Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.displayName || "User"}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Membership Strip */}
          <div className="mt-4 bg-[#f9f5f0] rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Explore <span className="font-semibold">Plus Membership</span>
            </span>
            <span className="text-xs text-[#7b1e1e] font-bold">
              0 Coins
            </span>
          </div>
        </div>

        {/* ⚙️ Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <button
            onClick={() => navigate("/my-orders")}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition"
          >
            <Package size={20} />
            <span className="text-sm font-medium">Orders</span>
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition"
          >
            <Heart size={20} />
            <span className="text-sm font-medium">Wishlist</span>
          </button>

          <button
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition"
          >
            <TicketPercent size={20} />
            <span className="text-sm font-medium">Coupons</span>
          </button>

          <button
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition"
          >
            <Headphones size={20} />
            <span className="text-sm font-medium">Help Center</span>
          </button>
        </div>

        {/* 👤 Account Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Account Details
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Name:</strong> {user.displayName || "Not set"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>UID:</strong> {user.uid}</p>
          </div>
        </div>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#7b1e1e] text-white py-3 rounded-xl font-medium hover:bg-[#5e1515] transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;
