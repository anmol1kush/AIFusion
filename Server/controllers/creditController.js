import Transaction from "../models/Transaction.js"
import Razorpay from "razorpay";
import crypto from "crypto";
import User from '../models/User.js'


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,       
  key_secret: process.env.RAZORPAY_API_SECRET
});


const plans=[
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

//api controller for getting all plans

export const getPlans= async (req,res)=>{
    try {
        res.json({
            success: true,
            plans
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
        
    }
}
//Api controller for purchasing plan 
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    console.log(planId)
    const userId = req.user._id;

    const plan = plans.find(p => p._id === planId);
    if (!plan) {
      return res.json({ success: false, message: "Invalid Plan" });
    }

    // 1️⃣ Create transaction entry (unpaid)
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false
    });

    // 2️⃣ Create Razorpay order
    const options = {
      amount: plan.price * 100, // in paise
      currency: "INR",
      receipt: transaction._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    // 3️⃣ Send order info to frontend
    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_API_KEY,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Payment creation failed" });
  }
};




export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Transaction.findOneAndUpdate(
        { _id: razorpay_order_id },
        { isPaid: true }
      );
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.json({ success: false, message: "Signature verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};


export const addCredits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { planId, paymentId } = req.body;

    // Define your plans (or fetch from DB if you have)
    const plans = {
      basic: { amount: 10, credits: 100 },
      pro: { amount: 50, credits: 600 },
      premium: { amount: 100, credits: 1500 },
    };

    if (!plans[planId]) {
      return res.status(400).json({ success: false, message: "Invalid plan." });
    }

    const { amount, credits } = plans[planId];

    // Create a transaction
    const transaction = await Transaction.create({
      userId,
      planId,
      amount,
      credits,
      isPaid: true, // mark as paid immediately
    });

    // Update user credits
    await User.findByIdAndUpdate(userId, { $inc: { credits: credits } });

    res.status(200).json({
      success: true,
      message: `Credits added successfully!`,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

