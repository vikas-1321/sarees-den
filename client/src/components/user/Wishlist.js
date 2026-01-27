import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "wishlist"),
      where("userId", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setWishlist(data);
    });

    return () => unsubscribe();
  }, [user]);

  const removeItem = async (id) => {
    await deleteDoc(doc(db, "wishlist", id));
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-[#7b1e1e] mb-8 text-center">
          My Wishlist ❤️
        </h2>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">
            Your wishlist is empty
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-lg mb-3"
                />

                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-[#d4af37] font-bold mb-3">
                  ₹{item.price}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-[#7b1e1e] text-white py-2 rounded-lg"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="border px-3 rounded-lg"
                  >
                    ❌
                  </button>
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
