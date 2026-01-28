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
    if (!user) return;

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
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-[#7b1e1e] mb-8 text-center">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.date?.toDate().toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      order.status === "confirmed"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Items:</p>
                  <ul className="list-disc ml-6 text-sm">
                    {order.cart.map((item, index) => (
                      <li key={index}>
                        {item.name} × {item.quantity} — ₹
                        {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <p className="text-lg font-bold text-right">
                  Total Paid: ₹{order.totalAmount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
