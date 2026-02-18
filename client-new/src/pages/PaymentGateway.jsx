import { CreditCard, Wallet, Landmark } from "lucide-react";

const PaymentGateway = ({ selected, setSelected }) => {
  const methods = [
    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI Payment", icon: Wallet },
    { id: "cod", label: "Cash on Delivery", icon: Landmark },
  ];

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl mb-4">Payment Method</h2>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <label
              key={method.id}
              className={`flex items-center gap-3 border p-3 cursor-pointer transition
                ${
                  selected === method.id
                    ? "border-[#7b1e1e] bg-[#fffaf5]"
                    : "hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="payment"
                checked={selected === method.id}
                onChange={() => setSelected(method.id)}
              />

              <Icon className="w-5 h-5 text-gray-600" />

              <span className="text-sm">{method.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Payment

