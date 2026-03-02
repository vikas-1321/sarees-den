import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const UserOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Safety check for user email
    if (!user?.email) return;

    // 2. Querying the 'orders' collection. 
    // Ensure 'userId' matches the field name used during checkout.
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.email),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.email]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf5] font-serif">
      <div className="animate-pulse uppercase tracking-[0.3em] text-[#7b1e1e]">Refining your history...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffaf5] px-4 py-32 font-serif">
      <div className="max-w-6xl mx-auto bg-white shadow-sm border border-[#f5e6d3] rounded-sm overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-[#f5e6d3] bg-white relative">
          <button 
            onClick={() => navigate('/profile')} 
            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-light text-[#7b1e1e] uppercase tracking-widest text-center">My Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-20 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 italic mb-8 uppercase tracking-widest text-xs">Your collection is currently empty.</p>
            <button 
              onClick={() => navigate('/shop-all')}
              className="px-8 py-3 bg-[#7b1e1e] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-all"
            >
              Discover Masterpieces
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fffaf5] text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-[#f5e6d3]">
                  <th className="px-6 py-4 font-bold">Passport View</th>
                  <th className="px-6 py-4 font-bold">Order Details</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* 🖼️ PASSPORT SIZE IMAGE COLUMN */}
                    <td className="px-6 py-6">
                      <div className="flex gap-2 flex-wrap">
                        {order.cart?.map((item, idx) => (
                          <div key={idx} className="relative group border border-gray-200 p-0.5 bg-white shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '35px', height: '45px' }}
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[8px] text-white font-bold">x{item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* 📝 Order Info */}
                    <td className="px-6 py-6">
                      <p className="text-xs font-bold text-gray-800 tracking-wider">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                        {/* 3. Safety check for Firestore Date */}
                        {order.date?.toDate ? order.date.toDate().toLocaleDateString('en-GB') : "Processing..."}
                      </p>
                    </td>

                    {/* 🏷️ Status Badge */}
                    <td className="px-6 py-6">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm border ${
                        order.status === 'confirmed' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' : 
                        order.status === 'shipped' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                        'border-green-200 text-green-700 bg-green-50'
                      }`}>
                        {order.status || 'Received'}
                      </span>
                    </td>

                    {/* 💰 Price */}
                    <td className="px-6 py-6 text-right">
                      <p className="text-sm font-bold text-[#7b1e1e]">₹{order.totalAmount}</p>
                      <p className="text-[9px] text-gray-400 tracking-tighter uppercase">Via Secure Pay</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;