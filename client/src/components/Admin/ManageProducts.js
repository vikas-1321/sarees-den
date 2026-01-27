import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "sarees"), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this saree?")) {
            await deleteDoc(doc(db, "sarees", id));
            alert("Product removed.");
        }
    };

    const handleUpdateStock = async (id, currentStock) => {
        const newStock = prompt("Enter new stock quantity:", currentStock);
        if (newStock !== null) {
            await updateDoc(doc(db, "sarees", id), {
                stock: Number(newStock)
            });
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 className="text-maroon">Inventory Management</h2>
            <table className="manage-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} style={{ backgroundColor: p.stock < 3 ? '#fff0f0' : 'transparent' }}>
    <td><img src={p.image} width="50" alt="" /></td>
    <td>{p.name}</td>
    <td>₹{p.price}</td>
    <td style={{ 
        color: p.stock < 3 ? 'red' : 'black', 
        fontWeight: p.stock < 3 ? 'bold' : 'normal' 
    }}>
        {p.stock} {p.stock < 3 && "⚠️ LOW STOCK"}
    </td>
                            <td>
                                <button onClick={() => handleUpdateStock(p.id, p.stock)} className="edit-btn">Stock</button>
                                <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;