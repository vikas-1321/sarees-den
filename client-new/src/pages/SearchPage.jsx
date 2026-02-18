import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import SareeCard from "../components/common/SareeCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch all sarees and filter client-side for better text matching
    const unsubscribe = onSnapshot(collection(db, "sarees"), (snapshot) => {
      const allSarees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const filtered = allSarees.filter(saree => 
        saree.name?.toLowerCase().includes(searchQuery) ||
        saree.description?.toLowerCase().includes(searchQuery) ||
        saree.occasion?.toLowerCase().includes(searchQuery) ||
        saree.color?.toLowerCase().includes(searchQuery)
      );

      setResults(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  return (
    <div className="bg-white min-h-screen pt-32 px-6 max-w-7xl mx-auto">
      <div className="mb-12 border-b border-gray-100 pb-8">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 block mb-2">Search Results</span>
        <h1 className="text-3xl font-light italic">
          Showing results for: <span className="font-bold text-[#7b1e1e] not-italic">"{searchQuery}"</span>
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#7b1e1e]"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 italic mb-6">No sarees found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
          {results.map((saree) => (
            <SareeCard key={saree.id} saree={saree} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;