"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function SubscriptionPage() {
  const [qrString, setQrString] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = {
    name: "Pro Plan",
    price: 1, // $1.00
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bakong/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro" }),
      });

      const data = await res.json();
      if (data.qrString) {
        setQrString(data.qrString);
      }
    } catch (error) {
      console.error("Error fetching QR:", error);
      alert("Failed to generate payment QR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Unlock Pro Features
        </h1>
        <p className="text-gray-500 mb-6">Get access to all premium content.</p>

        <div className="bg-blue-50 text-blue-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p className="text-3xl font-bold mt-2">
            ${plan.price.toFixed(2)}{" "}
            <span className="text-sm font-normal text-blue-600">/ month</span>
          </p>
        </div>

        {!qrString ? (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Generating QR..." : "Pay with Bakong"}
          </button>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code with your Bank App to pay.
            </p>
            <div className="p-4 bg-white border-2 border-red-500 rounded-xl inline-block">
              {/* This renders the actual visual QR code from the Bakong string */}
              <QRCodeCanvas
                value={qrString}
                size={200}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <button
              onClick={() => setQrString(null)}
              className="mt-6 text-sm text-gray-500 hover:text-gray-800"
            >
              Cancel Payment
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
