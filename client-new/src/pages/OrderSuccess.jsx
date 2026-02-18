import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center px-6 pt-24 font-serif">
      <div className="bg-white max-w-2xl w-full shadow-sm border border-gray-100 p-10 text-center">

        {/* ✅ Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={1.5} />
        </div>

        {/* ✅ Heading */}
        <h1 className="text-3xl md:text-4xl font-light text-[#7b1e1e] mb-4">
          Order Confirmed
        </h1>

        {/* ✅ Subtext */}
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
          Thank you for shopping with <span className="font-semibold">Sarees Den</span>.  
          Your masterpiece is being prepared with care and elegance.
        </p>

        {/* ✅ Order Details Box */}
        <div className="border border-[#eadfcd] bg-[#fffaf5] p-5 text-sm mb-8">
          <p className="mb-1">
            <span className="text-gray-500">Estimated Delivery:</span>{" "}
            <span className="font-medium">3 – 5 Business Days</span>
          </p>
          <p>
            <span className="text-gray-500">Payment Status:</span>{" "}
            <span className="font-medium text-green-700">Successful</span>
          </p>
        </div>

        {/* ✅ Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/my-orders")}
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-[#7b1e1e] transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/shop-all")}
            className="px-6 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition"
          >
            Continue Shopping
          </button>

        </div>

        {/* ✅ Footer Note */}
        <p className="text-xs text-gray-400 mt-8">
          A confirmation email has been sent to your registered address.
        </p>

      </div>
    </div>
  );
};

export default OrderSuccess;
