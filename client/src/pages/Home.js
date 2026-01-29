import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import SareeCard from "../components/common/SareeCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sarees"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSarees(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#fffaf5] min-h-screen font-serif">
      {/* 🌟 Modern Overlay Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-start">
        {/* 1. Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" 
          alt="Silk Saree Model" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* 2. Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* 3. Text Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 text-white">
          <span className="text-xs uppercase tracking-[0.4em] mb-4 mt-10 block opacity-90">
            Curated for You
          </span>
          <h1 className="text-5xl md:text-8xl font-light leading-tight mb-6">
            Draped in <br />
            <span className="font-bold italic">Tradition.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-lg leading-relaxed opacity-90">
            Discover our hand-woven silk sarees crafted for the modern woman who loves timeless elegance.
          </p>
          <div className="flex gap-4 mb-4 mt-8">
            <button 
              onClick={() => navigate("/shop-all")} 
              className="bg-white text-[#7b1e1e] px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#7b1e1e] hover:text-white transition-all duration-300 shadow-xl"
            >
              Shop All Collections
            </button>
            <button className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-[#7b1e1e] transition-all duration-300">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* 🏆 Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">Curated for You</span>
          <h2 className="text-4xl font-light text-[#7b1e1e] italic">Best Sellers</h2>
          <div className="h-[1px] w-12 bg-[#7b1e1e] mt-6"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#7b1e1e]"></div>
          </div>
        ) : (
          <>
            {/* 📏 Updated to slice(0, 6) and changed to 3 columns for 6 items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {sarees.slice(0, 6).map((saree) => (
                <SareeCard key={saree.id} saree={saree} />
              ))}
            </div>

            {/* View All Button - Appears if there are more than 6 sarees */}
            {sarees.length > 6 && (
              <div className="flex justify-center mt-20">
                <button 
                  onClick={() => navigate("/shop-all")}
                  className="px-12 py-4 border-2 border-[#7b1e1e] text-[#7b1e1e] uppercase tracking-widest font-bold hover:bg-[#7b1e1e] hover:text-white transition-all duration-300 shadow-xl"
                >
                  View All Collections
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 📖 Heritage Section */}
      <section className="bg-white py-20 border-t border-[#f5e6d3]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-2xl font-bold uppercase tracking-widest mb-16 text-[#7b1e1e]">
            Our Saree Heritage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold mb-4 uppercase">The Kanjeevaram Guide</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Learn why the Kanjeevaram is known as the "Queen of Silks" and how to identify authentic gold zari work.
              </p>
              <button className="border-b-2 border-black pb-1 uppercase text-sm font-bold hover:text-[#7b1e1e] transition-colors">
                Read the guide
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 uppercase">Banarasi Elegance</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Explore the intricate patterns of floral motifs and Mughal-inspired designs from the heart of Varanasi.
              </p>
              <button className="border-b-2 border-black pb-1 uppercase text-sm font-bold hover:text-[#7b1e1e] transition-colors">
                Explore the history
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;