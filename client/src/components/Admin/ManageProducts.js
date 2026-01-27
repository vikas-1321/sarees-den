import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const ManageProducts = () => {
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time fetch
    const unsubscribe = onSnapshot(collection(db, "sarees"), (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setSarees(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this saree?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "sarees", id));
      alert("Saree deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete saree");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-3xl font-bold text-[#7b1e1e] mb-8 text-center">
          Manage Sarees
        </h2>

        {sarees.length === 0 ? (
          <p className="text-center text-gray-500">
            No sarees available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#7b1e1e] text-white text-left">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sarees.map((saree) => (
                  <tr
                    key={saree.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <img
                        src={saree.image}
                        alt={saree.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-3 font-medium">
                      {saree.name}
                    </td>
                    <td className="p-3">
                      {saree.category}
                    </td>
                    <td className="p-3">
                      ₹{saree.price}
                    </td>
                    <td className="p-3">
                      {saree.stock}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(saree.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
