import { CreditCard, Smartphone, Truck } from "lucide-react";

const PaymentSection = ({ value, onChange }) => {
  const methods = [
    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI Payment", icon: Smartphone },
    { id: "cod", label: "Cash on Delivery", icon: Truck },
  ];

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl mb-4 font-semibold">Payment Method</h2>

      <div className="space-y-3 text-sm">
        {methods.map((method) => {
          const Icon = method.icon;
          const selected = value === method.id;

          return (
            <label
              key={method.id}
              className={`flex items-center gap-3 border p-3 cursor-pointer transition 
                ${selected 
                  ? "border-[#7b1e1e] bg-[#fff7f7]" 
                  : "hover:border-[#7b1e1e]"}`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selected}
                onChange={() => onChange(method.id)}
                className="accent-[#7b1e1e]"
              />

              <Icon size={18} />
              {method.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentSection;
