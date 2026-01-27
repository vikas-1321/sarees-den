import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import SareeCard from "../components/common/SareeCard";

const Home = () => {
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
    <div className="bg-[#fffaf5] min-h-screen">
      {/* Hero */}
      <section className="bg-[#7b1e1e] text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Discover Timeless Silk Sarees
        </h1>
        <p className="text-lg text-[#f5e6d3]">
          Authentic handpicked collections
        </p>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#7b1e1e] mb-10 text-center">
          Our Collection
        </h2>

        {loading ? (
          <p className="text-center">Loading sarees...</p>
        ) : sarees.length === 0 ? (
          <p className="text-center">No sarees available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sarees.map((saree) => (
              <SareeCard key={saree.id} saree={saree} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
