import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const AddSaree = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Convert image
      const base64Image = await convertToBase64(image);

      // 2️⃣ Upload image to backend → Cloudinary
      const uploadRes = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        throw new Error("Image upload failed");
      }

      // 3️⃣ Prepare saree data
      const sareePayload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        image: uploadData.imageUrl,
        createdAt: serverTimestamp(),
      };

      // 4️⃣ Save to Firestore
      await addDoc(collection(db, "sarees"), sareePayload);

      alert("Saree added successfully!");

      // 5️⃣ Reset form
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
      });
      setImage(null);
    } catch (error) {
      console.error("ADD SAREE ERROR:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-[#7b1e1e] mb-8 text-center">
          Add New Saree
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Saree Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Saree Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Kanjeevaram Silk Saree"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select category</option>
              <option value="Kanjeevaram">Kanjeevaram</option>
              <option value="Banarasi">Banarasi</option>
              <option value="Chanderi">Chanderi</option>
              <option value="Mysore Silk">Mysore Silk</option>
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Fabric, design, occasion, etc."
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Saree Image
            </label>

            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer text-[#7b1e1e] font-semibold"
              >
                Click to upload image
              </label>

              {image && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {image.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7b1e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#5e1515] disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Add Saree"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSaree;
