import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import SareeCard from "../components/common/SareeCard";

// 1. SUB-COMPONENT: BREADCRUMB
const Breadcrumb = ({ categoryName }) => {
  return (
    <nav className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] text-white/60 mb-8">
      <Link to="/" className="hover:text-white transition-colors">Home</Link>
      <span className="text-white/30">/</span>
      <Link to="/shop-all" className="hover:text-white transition-colors">Collections</Link>
      <span className="text-white/30">/</span>
      <span className="text-white font-bold">{categoryName}</span>
    </nav>
  );
};

const CategoryPage = () => {
  const { categoryName } = useParams(); // Automatically decodes the URL string
  const navigate = useNavigate();
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. CATEGORY-SPECIFIC HERO IMAGES
  // Ensure these keys match your Firestore 'category' strings exactly
  const categoryImages = {
    "Bridal / Wedding": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80",
    "Festive Celebration": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
    "Evening Party": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80",
    "Grand Reception": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80"
  };

useEffect(() => {
  setLoading(true);
  
  // ❌ OLD: where("category", "==", categoryName)
  // ✅ NEW: Query the 'occasion' field to match your Firebase data
  const q = query(
    collection(db, "sarees"), 
    where("occasion", "==", categoryName)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Sarees found:", data.length); // Use this to debug in the browser console
    setSarees(data);
    setLoading(false);
  });

  return () => unsubscribe();
}, [categoryName]);

  return (
    <div className="bg-white min-h-screen font-serif text-[#1a1a1a]">
      
      {/* 4. HERO SECTION */}
      <section className="relative h-[55vh] w-full overflow-hidden">
        <img 
          src={categoryImages[categoryName] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80"} 
          alt={categoryName} 
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.45] transition-transform duration-[3000ms] scale-105"
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Breadcrumb categoryName={categoryName} />
          <h1 className="text-white text-5xl md:text-7xl font-light tracking-[0.25em] uppercase mb-4">
            {categoryName.includes('/') ? (
              <>
                {categoryName.split('/')[0]} <br />
                <span className="italic font-normal text-3xl md:text-5xl lowercase tracking-widest opacity-80">
                  & {categoryName.split('/')[1]}
                </span>
              </>
            ) : (
              categoryName
            )}
          </h1>
          <div className="h-[1px] w-24 bg-white/30 mt-10"></div>
        </div>
      </section>

      {/* 5. PRODUCT GRID SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7b1e1e] mb-4"></div>
             <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">Curating Collection...</p>
          </div>
        ) : sarees.length === 0 ? (
          <div className="text-center py-24 border border-[#f5e6d3] rounded-sm">
            <p className="italic text-gray-400 tracking-widest mb-10">
              The {categoryName} collection is currently being curated.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="px-12 py-4 border border-black text-[10px] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500"
            >
              Return to Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {sarees.map((saree) => (
              <div key={saree.id} className="group transition-transform duration-500 hover:-translate-y-3">
                <SareeCard saree={saree} />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default CategoryPage;