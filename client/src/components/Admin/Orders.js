import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch orders and sort by newest first
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div style={{ padding: '30px' }}>
            <h2 className="text-maroon">Customer Orders & Deliveries</h2>
            
            {loading ? <p>Loading Orders...</p> : (
                <div className="orders-container">
                    {orders.length === 0 ? (
                        <p>No orders placed yet.</p>
                    ) : (
                        <table className="manage-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer Details</th>
                                    <th>Items Ordered</th>
                                    <th>Total Paid</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td><small>{order.id}</small></td>
                                        <td>
                                            <strong>{order.customerName}</strong><br />
                                            <span style={{fontSize: '0.85rem'}}>
                                                📞 {order.customerPhone}<br />
                                                📍 {order.customerAddress}, {order.pincode}
                                            </span>
                                        </td>
                                        <td>
                                            {order.cart.map((item, index) => (
                                                <div key={index} style={{fontSize: '0.9rem', borderBottom: '1px solid #eee'}}>
                                                    {item.name} (x{item.quantity})
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{fontWeight: 'bold'}}>₹{order.totalAmount}</td>
                                        <td>
                                            <span className="status-badge">Confirmed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;