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
    <div className="bg-white min-h-screen font-serif text-[#1a1a1a]">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80" 
          alt="Luxury Silk Collection" 
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-75 transition-transform duration-[2000ms] hover:scale-105"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-6xl md:text-8xl font-light tracking-[0.2em] uppercase mb-6 leading-tight">
            Embroidered <br /> <span className="italic font-normal">to Impress</span>
          </h1>
          <p className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase max-w-xl mb-12">
            Timeless Heritage. Modern Elegance.
          </p>
          <button 
            onClick={() => navigate("/shop-all")} 
            className="group relative px-12 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.4em] overflow-hidden transition-all hover:text-white"
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 bg-black translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
          </button>
        </div>
      </section>

      {/* 2. SHOP BY OCCASION (MODERN BENTO GRID) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light tracking-[0.4em] uppercase mb-4 text-[#7b1e1e]">Shop by Occasion</h2>
          <div className="h-[1px] w-20 bg-[#7b1e1e] mx-auto opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[700px]">
          {/* Main Large Box */}
          <div className="md:col-span-2 relative group overflow-hidden cursor-pointer h-[400px] md:h-full">
            <img src="https://images.unsplash.com/photo-1621112904887-419379ce6824?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Bridal" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-end p-10">
              <span className="text-white text-2xl tracking-[0.2em] uppercase border-b border-white pb-2">Bridal Couture</span>
            </div>
          </div>
          
          {/* Two Small Boxes */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="flex-1 relative group overflow-hidden cursor-pointer h-[300px]">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Festive" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white text-sm tracking-[0.3em] uppercase">Festive Glow</span>
              </div>
            </div>
            <div className="flex-1 relative group overflow-hidden cursor-pointer h-[300px]">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Daily" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white text-sm tracking-[0.3em] uppercase">Daily Drape</span>
              </div>
            </div>
          </div>

          {/* Tall Box */}
          <div className="md:col-span-1 relative group overflow-hidden cursor-pointer h-[400px] md:h-full">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Party" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white text-sm tracking-[0.3em] uppercase rotate-90 whitespace-nowrap">Reception Wear</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING NOW (6-ITEM GRID) */}
      <section className="bg-[#fcfbf9] py-24 px-6 border-y border-[#f5e6d3]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-2 block">The Current Favorites</span>
              <h2 className="text-4xl font-light italic text-[#7b1e1e]">Trending Now</h2>
            </div>
            <button onClick={() => navigate("/shop-all")} className="text-xs uppercase font-bold tracking-widest border-b border-black pb-1 hover:text-[#7b1e1e] hover:border-[#7b1e1e] transition-all">
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#7b1e1e]"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {sarees.slice(0, 6).map((saree) => (
                <div key={saree.id} className="transition-transform duration-500 hover:-translate-y-2">
                  <SareeCard saree={saree} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;