import crypto from "crypto";
 
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  // 1. Validate the PayPal webhook signature
  const paypalWebhookId = process.env.PAYPAL_WEBHOOK_ID; // Your webhook ID from PayPal dashboard
  const transmissionId = req.headers["paypal-transmission-id"];
  const transmissionTime = req.headers["paypal-transmission-time"];
  const certUrl = req.headers["paypal-cert-url"];
  const authAlgo = req.headers["paypal-auth-algo"];
  const transmissionSig = req.headers["paypal-transmission-sig"];
  const webhookEvent = req.body;
 
  const webhookId = paypalWebhookId;
  const requestBody = JSON.stringify(webhookEvent);
 
  const expectedSignature = crypto
    .createVerify(authAlgo)
    .update(
      `${transmissionId}|${transmissionTime}|${webhookId}|${crypto
        .createHash("sha256")
        .update(requestBody)
        .digest("hex")}`
    )
    .verify(certUrl, transmissionSig, "base64");
 
  if (!expectedSignature) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }
 
  // 2. Handle the PayPal event
  const eventType = webhookEvent.event_type;
 
  switch (eventType) {
    case "PAYMENT.SALE.COMPLETED":
      // Handle payment success
      console.log("Payment completed:", webhookEvent);
      break;
 
    case "CHECKOUT.ORDER.APPROVED":
      // Handle checkout approval
      console.log("Order approved:", webhookEvent);
      break;
 
    default:
      console.log("Unhandled event type:", eventType);
  }
 
  // 3. Respond to PayPal
  res.status(200).json({ status: "success" });
}