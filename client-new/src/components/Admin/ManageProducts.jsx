import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const ManageProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "sarees"), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this saree from the inventory?")) {
            await deleteDoc(doc(db, "sarees", id));
        }
    };

    const handleUpdateStock = async (id, currentStock) => {
        const newStock = prompt("Enter new stock quantity:", currentStock);
        if (newStock !== null && !isNaN(newStock)) {
            await updateDoc(doc(db, "sarees", id), {
                stock: Number(newStock)
            });
        }
    };

    if (loading) return <div className="p-20 text-center font-serif italic text-gray-500">Loading Inventory...</div>;

    return (
        <div className="min-h-screen bg-[#fffaf5] p-8 font-serif">
            <div className="max-w-7xl mx-auto bg-white shadow-sm border border-[#f5e6d3] rounded-sm overflow-hidden">
                
                {/* Header Area */}
                <div className="p-8 border-b border-[#f5e6d3] flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-light text-[#7b1e1e] uppercase tracking-widest">Inventory Management</h2>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Manage your collection and stock levels</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Products: {products.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#fffaf5] text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-[#f5e6d3]">
                                <th className="px-6 py-4 font-bold">Preview</th>
                                <th className="px-6 py-4 font-bold">Product Details</th>
                                <th className="px-6 py-4 font-bold">Price</th>
                                <th className="px-6 py-4 font-bold">Availability</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p) => (
                                <tr key={p.id} className={`transition-colors hover:bg-gray-50/50 ${p.stock < 3 ? 'bg-red-50/30' : ''}`}>
                                    
                                    {/* Passport Size Preview */}
                                    <td className="px-6 py-4">
                                        <div className="border border-gray-200 p-0.5 bg-white shadow-sm inline-block">
                                            <img 
                                                src={p.image} 
                                                style={{ width: '35px', height: '45px' }} 
                                                className="object-cover" 
                                                alt={p.name} 
                                            />
                                        </div>
                                    </td>

                                    {/* Name and ID */}
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">{p.name}</p>
                                        <p className="text-[9px] text-gray-400 uppercase">ID: {p.id.slice(0, 8)}</p>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-[#7b1e1e]">₹{p.price}</p>
                                    </td>

                                    {/* Stock Status Badge */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${p.stock < 3 ? 'text-red-600' : 'text-gray-700'}`}>
                                                {p.stock} in stock
                                            </span>
                                            {p.stock < 3 && (
                                                <span className="text-[8px] font-bold text-red-500 uppercase mt-0.5 animate-pulse">
                                                    ⚠️ Low Stock Alert
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button 
                                            onClick={() => navigate(`/admin/edit/${p.id}`)} 
                                            className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all"
                                        >
                                            Edit Saree
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(p.id)} 
                                            className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;