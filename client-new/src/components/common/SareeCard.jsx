import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const SareeCard = ({ saree }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // ✅ FIXED: Dependency array now has a constant size
  useEffect(() => {
    // Only run if we have a user email
    if (!user?.email) {
        setIsInWishlist(false);
        return;
    }
    
    const wishlistRef = doc(db, "wishlists", user.email);
    const unsubscribe = onSnapshot(wishlistRef, (doc) => {
      if (doc.exists()) {
        const items = doc.data().items || [];
        // We only need the ID to check status
        const found = items.some((item) => item.id === saree.id);
        setIsInWishlist(found);
      } else {
        setIsInWishlist(false);
      }
    });

    return () => unsubscribe();
    // NEVER put saree.name here if it can be undefined/null
  }, [user?.email, saree.id]); 

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to save items.");
      return;
    }

    try {
      const wishlistRef = doc(db, "wishlists", user.email);
      const docSnap = await getDoc(wishlistRef);
      let currentItems = docSnap.exists() ? docSnap.data().items || [] : [];

      if (isInWishlist) {
        const updatedItems = currentItems.filter(item => item.id !== saree.id);
        await setDoc(wishlistRef, { items: updatedItems }, { merge: true });
      } else {
        await setDoc(wishlistRef, { items: [...currentItems, saree] }, { merge: true });
      }
    } catch (error) {
      console.error("Wishlist Error:", error);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full border border-gray-100 shadow-sm group">
      <div 
        className="relative w-full overflow-hidden"
        style={{ height: 'calc(var(--spacing) * 170)' }}
      >
        <img
          src={saree.image}
          alt={saree.name}
          style={{ height: 'calc(var(--spacing) * 170)' }}
          className="w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">Official Collection</span>
          
          <button
            onClick={handleWishlist}
            className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-all active:scale-90"
          >
            <span className={`text-xl transition-colors duration-300 ${isInWishlist ? 'text-red-600' : 'text-gray-300'}`}>
              {isInWishlist ? '❤️' : '🤍'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">
              {isInWishlist ? 'Saved' : 'Save'}
            </span>
          </button>
        </div>

        <h3 className="font-bold text-gray-900 text-lg uppercase mb-2 line-clamp-1">
          {saree.name}
        </h3>
        
        <p className="text-[#7b1e1e] font-bold text-2xl mb-6">
          ₹{saree.price}
        </p>

        <div className="mt-auto space-y-3">
          <button
            onClick={() => addToCart(saree, 1)}
            className="w-full py-4 bg-[#7b1e1e] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
          >
            Add to Cart
          </button>
          <button
            onClick={() => { addToCart(saree, 1); navigate("/cart"); }}
            className="w-full py-4 border border-gray-800 text-gray-800 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 hover:text-white transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SareeCard;