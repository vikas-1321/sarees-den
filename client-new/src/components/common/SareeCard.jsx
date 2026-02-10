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

  useEffect(() => {
    if (!user?.email) {
        setIsInWishlist(false);
        return;
    }
    const wishlistRef = doc(db, "wishlists", user.email);
    const unsubscribe = onSnapshot(wishlistRef, (doc) => {
      if (doc.exists()) {
        const items = doc.data().items || [];
        const found = items.some((item) => item.id === saree.id);
        setIsInWishlist(found);
      } else {
        setIsInWishlist(false);
      }
    });
    return () => unsubscribe();
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
    <div className="bg-white flex flex-col h-full border border-gray-100 group">
      {/* 1. IMAGE SECTION (Editorial Aspect Ratio) */}
      <div 
        className="relative w-full overflow-hidden aspect-[3/4] cursor-pointer"
        onClick={() => navigate(`/product/${saree.id}`)}
      >
        <img
          src={saree.image}
          alt={saree.name}
          className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Wishlist/Save Overlay */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 flex flex-col items-center group/wish"
        >
          <span className={`text-2xl drop-shadow-md transition-transform active:scale-75 ${isInWishlist ? 'text-red-600' : 'text-white/80 group-hover/wish:text-white'}`}>
            {isInWishlist ? '❤️' : '🤍'}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-tighter text-white drop-shadow-md">
            {isInWishlist ? 'Saved' : 'Save'}
          </span>
        </button>
      </div>

      {/* 2. DETAILS SECTION (Clean Typography) */}
      <div className="p-5 flex flex-col flex-grow text-left">
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-2">
          Official Collection
        </span>

        <h3 className="font-bold text-[#1a1a1a] text-sm uppercase tracking-widest mb-2 line-clamp-1">
          {saree.name}
        </h3>
        
        <p className="text-[#7b1e1e] font-bold text-xl mb-6">
          ₹{saree.price}
        </p>

        {/* 3. ACTION BUTTONS (Clean Stack) */}
        <div className="mt-auto space-y-2">
          <button
            onClick={() => addToCart(saree, 1)}
            className="w-full py-4 bg-[#7b1e1e] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={() => { addToCart(saree, 1); navigate("/cart"); }}
            className="w-full py-4 border border-black text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SareeCard;