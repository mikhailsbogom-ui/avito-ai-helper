</>  JavaScript

import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_KEY);
const router = express.Router();

router.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "100 credits" },
        unit_amount: 500
      },
      quantity: 1
    }],
    mode: "payment",
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL
  });

  res.json({ url: session.url });
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const email = event.data.object.customer_email;

    const user = await User.findOne({ email });
    if (user) {
      user.credits += 100;
      await user.save();
    }
  }

  res.sendStatus(200);
});

export default router;