import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';


// create orders
export const createRazorpayOrders = asyncHandler(async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.RAZOR_ID,
        key_secret: process.env.RAZOR_SECRET,
    });

    const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Something Went Wrong!" });
        }
        res.status(200).json({ data: order });
    });
})


// verify orders
export const verifyRazorpayOrders = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZOR_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        return res.status(200).json({ message: "Payment verified successfully" });
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
    }
})