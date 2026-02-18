import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "orders"),
      where("customerId", "==", user.uid),   // ✅ FIXED
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (loading) return <div className="p-20 text-center font-serif">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-[#fffaf5] px-4 py-12 font-serif">
      <div className="max-w-6xl mx-auto bg-white shadow-sm border border-[#f5e6d3] rounded-sm overflow-hidden">
        
        <div className="p-8 border-b border-[#f5e6d3] bg-white">
          <h2 className="text-2xl font-light text-[#7b1e1e] uppercase tracking-widest text-center">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-20 text-center text-gray-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fffaf5] text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-[#f5e6d3]">
                  <th className="px-6 py-4 font-bold">Passport View</th>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    <td className="px-6 py-6">
                      <div className="flex gap-2 flex-wrap">
                        {order.cart.map((item, idx) => (
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

                    <td className="px-6 py-6">
                      <p className="text-xs font-bold text-gray-800 tracking-wider">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {order.date ? order.date.toDate().toLocaleDateString('en-GB') : "Pending"}
                      </p>
                    </td>

                    <td className="px-6 py-6">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-sm border ${
                        order.status === 'confirmed' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' : 
                        order.status === 'shipped' ? 'border-blue-200 text-blue-700 bg-blue-50' : 
                        'border-green-200 text-green-700 bg-green-50'
                      }`}>
                        {order.status}
                      </span>
                    </td>

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
