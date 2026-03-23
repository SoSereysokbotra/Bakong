import { NextResponse } from "next/server";
import { generateKhqrPayment } from "../../../../lib/bakong";

type Plan = {
  id: string;
  name: string;
  amount: number;
  currency: "USD" | "KHR";
};

const plans: Record<string, Plan> = {
  basic: { id: "basic", name: "Starter", amount: 1, currency: "USD" },
  pro: { id: "pro", name: "Professional", amount: 1, currency: "USD" },
  premium: { id: "premium", name: "Enterprise", amount: 1, currency: "USD" },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId } = body;
    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const finalAmount = plan.amount;

    // Generate a unique transaction reference
    const transactionRef = `SUB_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Generate KHQR payload (or call Bakong API)
    const payment = await generateKhqrPayment({
      amount: finalAmount,
      currency: plan.currency,
      description: `${plan.name} Subscription - ${transactionRef}`,
      merchantId: process.env.BAKONG_MERCHANT_ID || "",
      transactionRef,
    });

    return NextResponse.json({
      transactionId: payment.transactionId,
      qrString: payment.qrString,
      amount: finalAmount,
      currency: plan.currency,
      planName: plan.name,
    }, { status: 200 });
  } catch (error) {
    console.error("Payment generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
