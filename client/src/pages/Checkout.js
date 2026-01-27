import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const placeOrder = async () => {
    await addDoc(collection(db, "orders"), {
      userId: user.email,
      cart,
      totalAmount,
      status: "confirmed",
      date: serverTimestamp(),
    });

    clearCart();
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <p className="mb-4 font-semibold">
        Total Payable: ₹{totalAmount}
      </p>

      <button
        onClick={placeOrder}
        className="bg-green-600 text-white py-3 px-6 rounded-lg"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
