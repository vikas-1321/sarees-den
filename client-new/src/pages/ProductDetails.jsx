import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Heart, Share2, ShieldCheck, ChevronLeft } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // 1. Fetch Saree and Watch Wishlist Status
  useEffect(() => {
    const fetchSaree = async () => {
      const docSnap = await getDoc(doc(db, "sarees", id));
      if (docSnap.exists()) setSaree({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    };
    fetchSaree();

    if (user?.email) {
      const unsubscribe = onSnapshot(doc(db, "wishlists", user.email), (doc) => {
        if (doc.exists()) {
          const items = doc.data().items || [];
          setIsInWishlist(items.some((item) => item.id === id));
        }
      });
      return () => unsubscribe();
    }
  }, [id, user?.email]);

  // 2. Share Function (WhatsApp, Instagram, etc.)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: saree.name,
          text: `Check out this beautiful saree from Sarees Den: ${saree.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // 3. Wishlist Toggle Function
  const handleWishlist = async () => {
    if (!user) return navigate("/auth");
    
    const wishlistRef = doc(db, "wishlists", user.email);
    const docSnap = await getDoc(wishlistRef);
    let currentItems = docSnap.exists() ? docSnap.data().items || [] : [];

    if (isInWishlist) {
      const updatedItems = currentItems.filter(item => item.id !== id);
      await setDoc(wishlistRef, { items: updatedItems }, { merge: true });
    } else {
      await setDoc(wishlistRef, { items: [...currentItems, saree] }, { merge: true });
    }
  };

  if (loading) return <div className="pt-40 text-center uppercase tracking-[0.5em]">Loading Masterpiece...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto font-serif animate-in fade-in duration-700">
      {/* Back Button for Team Review Fix */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image */}
        <div className="relative overflow-hidden bg-gray-50 border border-gray-100">
          <img src={saree.image} alt={saree.name} className="w-full h-auto object-cover" />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-4xl font-light text-gray-900 leading-tight uppercase tracking-wide">{saree.name}</h1>
            
            {/* Share & Wishlist Icons */}
            <div className="flex gap-6 pt-2">
              <button onClick={handleShare} className="group flex flex-col items-center gap-1">
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                <span className="text-[8px] uppercase tracking-tighter text-gray-400 group-hover:text-black">Share</span>
              </button>
              <button onClick={handleWishlist} className="group flex flex-col items-center gap-1">
                <Heart className={`w-6 h-6 transition-all duration-300 ${isInWishlist ? 'fill-red-600 text-red-600' : 'text-gray-400 group-hover:text-red-500'}`} />
                <span className="text-[8px] uppercase tracking-tighter text-gray-400 group-hover:text-red-500">{isInWishlist ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          <p className="text-2xl font-bold text-[#7b1e1e] mb-6">₹{saree.price}</p>
          
          <div className="space-y-8 mb-10">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 font-bold">Details</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{saree.description}</p>
            </div>

            
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => addToCart(saree, 1)} className="w-full py-5 border border-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500">
              Add To Cart
            </button>
            <button className="w-full py-5 bg-[#7b1e1e] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all duration-500">
              Buy Now
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4 text-gray-400">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[9px] uppercase tracking-[0.2em]">Secure checkout | 100% Authentic Sarees Den curation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;  