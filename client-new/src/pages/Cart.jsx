import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf7]">
        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/shop-all")}
          className="bg-black text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-[#7b1e1e]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] px-6 pt-28 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* 🛍 Cart Items */}
        <h1 className="text-3xl font-serif mb-8">Shopping Bag</h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 shadow-sm p-5 flex gap-5"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-36 object-cover rounded"
              />

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="px-4 text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ₹{item.price}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 💳 Order Summary (BOTTOM) */}
        <div className="mt-12 bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-serif mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-[#7b1e1e] text-white py-3 rounded text-sm uppercase tracking-widest hover:bg-black transition"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
