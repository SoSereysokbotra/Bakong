// pages/index.tsx
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import PlanCard from "../components/PlanCard";

type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "basic",
    name: "Starter",
    price: 20000,
    features: ["Basic analytics", "1 project", "Email support"],
  },
  {
    id: "pro",
    name: "Professional",
    price: 60000,
    features: ["Advanced analytics", "10 projects", "Priority support"],
  },
  {
    id: "premium",
    name: "Enterprise",
    price: 120000,
    features: ["Real-time insights", "Unlimited projects", "Dedicated manager"],
  },
];

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1]); // default Pro
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bakong/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setQrData(data.qrString);
        setTransactionId(data.transactionId);
      } else {
        alert("Error generating payment");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bakong Subscription
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plans */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan.id === plan.id}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Buy Subscription"}
            </button>
          </div>

          {/* QR Code Display */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            {qrData ? (
              <>
                <div className="bg-white p-4 rounded-lg border">
                  <QRCodeSVG value={qrData} size={220} />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Scan this QR code with the Bakong app to pay{" "}
                  <strong>{selectedPlan.price.toLocaleString()} KHR</strong>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Transaction ID: {transactionId}
                </p>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <p>
                  Select a plan and click "Buy Subscription" to generate QR code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
