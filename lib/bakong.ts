// lib/bakong.ts

interface PaymentRequest {
  amount: number; // in KHR
  description: string;
  merchantId: string;
  accountNumber?: string;
  transactionRef: string;
}

export async function generateKhqrPayment(payment: PaymentRequest) {
  // Use bakong-khqr package (requiring it this way bypasses inaccurate @types/bakong-khqr typescript errors)
  const bakongKhqrModule = require("bakong-khqr");
  const BakongKHQR = bakongKhqrModule.BakongKHQR;
  const IndividualInfo = bakongKhqrModule.IndividualInfo;
  const khqrData = bakongKhqrModule.khqrData;

  const optionalData = {
    currency: khqrData.currency.khr,
    amount: payment.amount,
    billNumber: payment.transactionRef,
    storeLabel: "Bakong Subscription", 
    terminalLabel: "Bakong Web Checkout",
    merchantCategoryCode: "5999",
  };

  // merchantId will use the process.env.BAKONG_MERCHANT_ID provided from the route
  const accountId = payment.merchantId || "so_sereysokbotra@bkrt";

  const individualInfo = new IndividualInfo(
    accountId,
    khqrData.currency.khr,
    "Serey Sokbotra", // Replaced from generic 'Subscription Plan'
    "Phnom Penh",
    optionalData
  );

  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);
  
  // Real EMVCo KHQR String
  const qrString = response.data ? (response.data as any).qr : "";

  return { qrString, transactionId: payment.transactionRef };
}

// Example of calling real Bakong API (you'll need to adapt to their actual endpoints)
export async function createBakongPayment(amount: number, description: string) {
  const response = await fetch(`${process.env.BAKONG_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BAKONG_API_KEY}`,
    },
    body: JSON.stringify({
      amount,
      description,
      merchantId: process.env.BAKONG_MERCHANT_ID,
      currency: "KHR",
    }),
  });
  const data = await response.json();
  return data; // Should contain a QR code or payment ID
}
