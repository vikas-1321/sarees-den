import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    // 🎯 MATCHING YOUR DATA STRUCTURE:
    // Reading from 'wishlists' collection using user.email as the ID
    const wishlistRef = doc(db, "wishlists", user.email);

    const unsubscribe = onSnapshot(wishlistRef, (docSnap) => {
      if (docSnap.exists()) {
        // Access the 'items' array from the document
        setWishlist(docSnap.data().items || []);
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, [user?.email]);

  const removeItem = async (sareeId) => {
    const wishlistRef = doc(db, "wishlists", user.email);
    try {
      // Create a new array excluding the item to be removed
      const updatedWishlist = wishlist.filter((item) => item.id !== sareeId);
      await updateDoc(wishlistRef, {
        items: updatedWishlist
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-6 py-16 font-serif">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Saved Classics</span>
          <h2 className="text-4xl font-light text-[#7b1e1e] italic">My Wishlist</h2>
          <div className="h-[1px] w-12 bg-[#7b1e1e] mt-6"></div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#f5e6d3] rounded-sm shadow-sm">
            <p className="text-gray-400 uppercase tracking-widest text-sm">
              Your collection is currently empty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white flex flex-col h-full border border-gray-100 shadow-sm group">
                
                {/* 🖼️ Tall Image consistent with Home page */}
                <div className="relative w-full overflow-hidden" style={{ height: 'calc(var(--spacing) * 130)' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <span className="text-red-600 text-lg leading-none">✕</span>
                  </button>
                </div>

                <div className="p-8 flex flex-col flex-grow text-center">
                  <h3 className="font-bold text-gray-900 text-lg uppercase mb-2 tracking-widest">
                    {item.name}
                  </h3>
                  <p className="text-[#b8860b] font-bold text-2xl mb-8">
                    ₹{item.price}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-4 bg-[#7b1e1e] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;