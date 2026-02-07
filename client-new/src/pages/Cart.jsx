import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4">Your cart is empty</p>
        <Link to="/" className="text-[#7b1e1e] font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center mb-4 border-b pb-4"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p>Qty: {item.quantity}</p>
          </div>

          <div className="flex gap-4 items-center">
            <p>₹{item.price * item.quantity}</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right font-bold text-lg">
        Total: ₹{totalAmount}
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full bg-[#7b1e1e] text-white py-3 rounded-lg"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
