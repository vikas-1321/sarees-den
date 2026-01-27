import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const UserOrders = ({ user }) => {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch only orders belonging to THIS user
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Order History</h2>
      {myOrders.length === 0 ? <p>You haven't placed any orders yet.</p> : (
        myOrders.map(order => (
          <div key={order.id} className="order-card">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {order.date.toDate().toLocaleDateString()}</p>
            <ul>
              {order.cart.map((item, i) => (
                <li key={i}>{item.name} (x{item.quantity}) - ₹{item.price}</li>
              ))}
            </ul>
            <p><strong>Total Paid:</strong> ₹{order.totalAmount}</p>
            <span className="status-badge">{order.status}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrders;