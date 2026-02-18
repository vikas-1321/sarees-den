import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    fullAddress: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.pincode ||
      !address.city ||
      !address.fullAddress
    ) {
      alert("Please fill complete delivery address");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "orders"), {
        cart,
        customerId: user?.uid || "guest",
        customerName: address.fullName,
        customerPhone: address.phone,
        customerAddress: `${address.fullAddress}, ${address.city} - ${address.pincode}`,
        totalAmount: subtotal,
        status: "confirmed",
        date: new Date(),
      });

      clearCart();                 // ✅ clear AFTER success
      navigate("/order-success");  // ✅ now works correctly

    } catch (error) {
      console.error(error);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ SAFE redirect when cart empty */
  useEffect(() => {
    if (!cart.length) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-4 md:px-10 pt-28 pb-16 font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-xl">
            <h2 className="text-2xl mb-6 text-[#7b1e1e]">
              Shipping Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input name="fullName" placeholder="Full Name" onChange={handleChange} className="border p-3 rounded-lg outline-none focus:border-[#7b1e1e]" />
              <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border p-3 rounded-lg outline-none focus:border-[#7b1e1e]" />
              <input name="pincode" placeholder="Pincode" onChange={handleChange} className="border p-3 rounded-lg outline-none focus:border-[#7b1e1e]" />
              <input name="city" placeholder="City" onChange={handleChange} className="border p-3 rounded-lg outline-none focus:border-[#7b1e1e]" />
            </div>

            <textarea name="fullAddress" placeholder="Full Address" rows="3" onChange={handleChange} className="border p-3 rounded-lg w-full mt-5 outline-none focus:border-[#7b1e1e]" />
          </div>

          <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-xl">
            <h2 className="text-2xl mb-6 text-[#7b1e1e]">
              Payment Method
            </h2>

            <div className="space-y-3 text-sm">
              {["Card Payment", "UPI Payment", "Cash on Delivery"].map((method) => (
                <label key={method} className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer hover:border-[#7b1e1e]">
                  <input type="radio" name="payment" />
                  {method}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-xl h-fit sticky top-32">

          <h2 className="text-2xl mb-6 text-[#7b1e1e]">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-[#7b1e1e]">₹{subtotal}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-[#7b1e1e] text-white py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-black transition disabled:opacity-50"
          >
            {loading ? "Processing Order..." : "Place Order"}
          </button>

          <p className="text-xs text-gray-400 mt-4 text-center">
            🔒 Secure Checkout • SSL Protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
