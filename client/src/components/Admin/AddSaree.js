import React, { useState } from 'react';
import axios from 'axios';

const AddSaree = () => {
    const [file, setFile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Kanjeevaram Silk' // Default category
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        // We MUST use FormData for file uploads
        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', form.name);
        formData.append('price', Number(form.price)); // Ensure it's a number
        formData.append('stock', Number(form.stock)); // Ensure it's a number
        formData.append('category', form.category);

        try {
            // Ensure the URL matches your Node server port (default 5000)
            const response = await axios.post('http://localhost:5000/api/sarees', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Success:", response.data);
            alert("Saree added successfully to Sarees Den!");
            
            // Reset form after success
            setForm({ name: '', price: '', stock: '', category: 'Kanjeevaram Silk' });
            setFile(null);
            e.target.reset(); 
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            alert("Failed to add saree. Check server logs.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '2px solid var(--gold)', background: 'white' }}>
            <h2 style={{ color: 'var(--maroon)', textAlign: 'center' }}>Add New Silk Saree</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input type="text" name="name" placeholder="Saree Name" onChange={handleChange} required 
                    style={{ padding: '10px', border: '1px solid var(--gold)' }} />
                
                <select name="category" onChange={handleChange} style={{ padding: '10px', border: '1px solid var(--gold)' }}>
                    <option value="Kanjeevaram Silk">Kanjeevaram Silk</option>
                    <option value="Banarasi Silk">Banarasi Silk</option>
                    <option value="Mysore Silk">Mysore Silk</option>
                    <option value="Tussar Silk">Tussar Silk</option>
                </select>

                <input type="number" name="price" placeholder="Price (₹)" onChange={handleChange} required 
                    style={{ padding: '10px', border: '1px solid var(--gold)' }} />

                <input type="number" name="stock" placeholder="Initial Stock" onChange={handleChange} required 
                    style={{ padding: '10px', border: '1px solid var(--gold)' }} />

                <label style={{ fontWeight: 'bold' }}>Product Image:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required />

                <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading to Cloudinary...' : 'Add Saree to Catalog'}
                </button>
            </form>
        </div>
    );
};

export default AddSaree;