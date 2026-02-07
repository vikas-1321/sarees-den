import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
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
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });
      alert("Order status updated");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-3xl font-bold text-[#7b1e1e] mb-8 text-center">
          Customer Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-xl p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-4">
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

                {/* Customer */}
                <div className="mb-4 text-sm">
                  <p><strong>Name:</strong> {order.customerName}</p>
                  <p><strong>Phone:</strong> {order.customerPhone}</p>
                  <p><strong>Address:</strong> {order.customerAddress}</p>
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

                {/* Footer */}
                <div className="flex flex-wrap justify-between items-center">
                  <p className="text-lg font-bold">
                    Total: ₹{order.totalAmount}
                  </p>

                  <div className="flex gap-3">
                    {order.status === "confirmed" && (
                      <button
                        onClick={() =>
                          updateStatus(order.id, "shipped")
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Mark Shipped
                      </button>
                    )}

                    {order.status === "shipped" && (
                      <button
                        onClick={() =>
                          updateStatus(order.id, "delivered")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
