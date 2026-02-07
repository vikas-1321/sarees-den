import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditSaree = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "", category: "", price: "", stock: "", description: "",
    color: "", occasion: "", isTrending: false
  });

  useEffect(() => {
    const fetchSareeData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sarees/${id}`);
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch saree:", error);
        alert("Error loading saree data");
      }
    };
    fetchSareeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/sarees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Saree den collection updated!");
        navigate("/admin/manage");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif uppercase tracking-widest">Loading Saree...</div>;

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-24 font-serif">
      <div className="max-w-4xl mx-auto bg-white border border-gray-100 shadow-sm p-10">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 block mb-2">Curating Perfection</span>
          <h2 className="text-4xl font-light text-[#7b1e1e] uppercase tracking-widest">Edit Masterpiece</h2>
          <div className="h-[1px] w-12 bg-[#7b1e1e] mx-auto mt-6"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Saree Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none focus:border-[#7b1e1e]" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Fabric Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none bg-transparent">
                <option value="Kanjeevaram">Kanjeevaram</option>
                <option value="Banarasi">Banarasi</option>
                <option value="Organza">Organza</option>
                <option value="Silk">Pure Silk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Color Tag</label>
              <select name="color" value={formData.color} onChange={handleChange} className="border-b border-gray-200 py-2 outline-none bg-transparent">
                <option value="Red">Royal Red</option>
                <option value="Gold">Antique Gold</option>
                <option value="Pastel">Soft Pastel</option>
                <option value="Emerald">Emerald Green</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Occasion Tag</label>
              <select name="occasion" value={formData.occasion} onChange={handleChange} className="border-b border-gray-200 py-2 outline-none bg-transparent">
                <option value="Wedding">Bridal / Wedding</option>
                <option value="Reception">Grand Reception</option>
                <option value="Festive">Festive Celebration</option>
                <option value="Party">Evening Party</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="border-b border-gray-200 py-2 outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="border-b border-gray-200 py-2 outline-none" />
            </div>
            <div className="flex items-center gap-3 pb-2">
              <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-4 h-4 accent-[#7b1e1e]" id="trending" />
              <label htmlFor="trending" className="text-xs uppercase tracking-widest text-gray-400">Trending Now</label>
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#7b1e1e] transition-all">
            Update Collection
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSaree;