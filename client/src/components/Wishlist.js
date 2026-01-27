import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  writeBatch, 
  getDocs 
} from 'firebase/firestore'; // Added writeBatch and getDocs
import SareeCard from './SareeCard';

const Wishlist = ({ user, addToCart, wishlist, setWishlist }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.data().sareeId, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // 🗑️ Clear All Items Function
  const handleClearWishlist = async () => {
    if (items.length === 0) return;
    if (!window.confirm("Are you sure you want to remove all items from your wishlist?")) return;

    try {
      const batch = writeBatch(db);
      const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setWishlist([]); // Clear local state in App.js
      alert("Wishlist cleared!");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      alert("Failed to clear wishlist.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="text-maroon">My Favorites ❤️</h2>
        {items.length > 0 && (
          <button onClick={handleClearWishlist} className="clear-btn">
            Clear All
          </button>
        )}
      </div>

      {loading ? <p>Loading your favorites...</p> : (
        <div className="product-grid">
          {items.length === 0 ? (
            <div className="empty-wishlist">
                <p>Your wishlist is empty. Start hearting some sarees!</p>
            </div>
          ) : (
            items.map(item => (
              <SareeCard 
                key={item.id} 
                saree={item} 
                addToCart={addToCart} 
                user={user}
                isWishlisted={true}
                toggleWishlistState={(id) => {
                    setWishlist(prev => prev.filter(x => x !== id))
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;