import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Add this

const AddSaree = () => {
  const navigate = useNavigate(); // 👈 Initialize the navigator
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    color: "",
    occasion: "",
    isTrending: false
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This correctly prevents the page from refreshing
    if (!image) return alert("Please select a saree image");

    try {
      setLoading(true);
      const data = new FormData();
      
      // Basic Fields & Tags
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append("image", image); // Key matches upload.single('image')

      const response = await fetch("https://sarees-den-backend.onrender.com/api/sarees", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");

      alert("Saree successfully added to Saree Den!");
      
      // 🚀 REDIRECT: Move user to the management dashboard after success
      navigate("/admin/manage"); 

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 py-16 font-serif">
      <div className="max-w-4xl mx-auto bg-white border border-gray-100 shadow-sm p-10">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 block mb-2">Inventory Management</span>
          <h2 className="text-4xl font-light text-[#7b1e1e] uppercase tracking-widest">Add New Masterpiece</h2>
          <div className="h-[1px] w-12 bg-[#7b1e1e] mx-auto mt-6"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Saree Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none focus:border-[#7b1e1e] transition-colors" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Fabric Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none bg-transparent">
                <option value="">Select Fabric</option>
                <option value="Kanjeevaram">Kanjeevaram</option>
                <option value="Banarasi">Banarasi</option>
                <option value="Organza">Organza</option>
                <option value="Silk">Pure Silk</option>
              </select>
            </div>
          </div>

          {/* Section 2: Luxury Tags (Color & Occasion) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Primary Color Tag</label>
              <select name="color" value={formData.color} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none bg-transparent">
                <option value="">Select Color</option>
                <option value="Red">Royal Red</option>
                <option value="Gold">Antique Gold</option>
                <option value="Pastel">Soft Pastel</option>
                <option value="Emerald">Emerald Green</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Occasion Tag</label>
              <select name="occasion" value={formData.occasion} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none bg-transparent">
                <option value="">Select Occasion</option>
                <option value="Wedding">Bridal / Wedding</option>
                <option value="Reception">Grand Reception</option>
                <option value="Festive">Festive Celebration</option>
                <option value="Party">Evening Party</option>
              </select>
            </div>
          </div>

          {/* Section 3: Pricing & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-500 mb-2">Stock Units</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="border-b border-gray-200 py-2 outline-none" />
            </div>
            <div className="flex items-center gap-3 pb-2 cursor-pointer">
              <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-4 h-4 accent-[#7b1e1e]" id="trending" />
              <label htmlFor="trending" className="text-xs uppercase tracking-widest text-gray-400 cursor-pointer">Trending Now</label>
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div className="pt-4">
            <label className="text-xs uppercase tracking-widest text-gray-500 block mb-4">Masterpiece Photography</label>
            <div className="border border-dashed border-gray-200 p-8 text-center hover:bg-gray-50 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" id="imageUpload" />
              <label htmlFor="imageUpload" className="cursor-pointer text-sm tracking-widest text-[#7b1e1e] font-semibold uppercase">
                {image ? `Selected: ${image.name}` : "Upload High-Resolution Image"}
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#7b1e1e] transition-all duration-500 disabled:opacity-50">
            {loading ? "Archiving to Collection..." : "Add to Boutique"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaree;