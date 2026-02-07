import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import SareeCard from "../components/common/SareeCard";

const ShopAll = () => {
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-[#fffaf5] min-h-screen font-serif pt-10">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-light text-[#7b1e1e] mb-4 italic">The Full Collection</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">{sarees.length} Exquisite Masterpieces</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7b1e1e]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
            {sarees.map((saree) => (
              <div key={saree.id} className="transition-transform duration-300 hover:-translate-y-2">
                 <SareeCard saree={saree} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopAll;