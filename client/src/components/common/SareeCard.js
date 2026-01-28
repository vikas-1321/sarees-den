import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { addToWishlist } from "../../utils/wishlist";

const SareeCard = ({ saree }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(saree, 1);
  };

  const handleBuyNow = () => {
    addToCart(saree, 1);
    navigate("/cart");
  };

  const handleWishlist = async () => {
    if (!user) {
      alert("Please login to use wishlist");
      return;
    }

    await addToWishlist(user.email, saree);
    alert("Added to wishlist ❤️");
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative">

      {/* ❤️ Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition"
        title="Add to Wishlist"
      >
        ❤️
      </button>

      {/* Image */}
      <img
        src={saree.image}
        alt={saree.name}
        className="h-52 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {saree.name}
        </h3>

        <p className="text-[#d4af37] font-bold text-lg mb-4">
          ₹{saree.price}
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#7b1e1e] text-white py-2 rounded-lg hover:bg-[#5e1515]"
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 border border-[#7b1e1e] text-[#7b1e1e] py-2 rounded-lg hover:bg-[#fff1f1]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SareeCard;
