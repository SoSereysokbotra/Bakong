import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-bakong-signature") || "";
    const payload = await request.json();

    // In production, validate signature with process.env.BAKONG_WEBHOOK_SECRET
    // if (!verifySignature(payload, signature)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    const { transactionId, status, amount } = payload;
    if (status === "COMPLETED") {
      // Update user subscription in database
      // await activateSubscription(transactionId, amount);
      console.log(`Payment confirmed: ${transactionId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
