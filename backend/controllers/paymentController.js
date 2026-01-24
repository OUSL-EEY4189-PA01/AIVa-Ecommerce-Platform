import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import dotenv from 'dotenv';


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const lineItems = orderItems.map(item => ({
            price_data: {
                currency: 'lkr',
                product_data: {
                    name: item.name,
                    images: item.image ? [`http://localhost:5000/${item.image}`] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        }));


        const order = new Order({
            user: req.user._id,
            orderItems: orderItems.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item.product,
            })),
            shippingAddress,
            paymentMethod: 'Card',
            totalPrice,
            isPaid: false,
        });
        const savedOrder = await order.save();


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${savedOrder._id}`,
            cancel_url: `http://localhost:5173/cart?canceled=true`,
            metadata: {
                orderId: savedOrder._id.toString(),
                userId: req.user._id.toString(),
            },
        });


        res.json({
            sessionId: session.id,
            url: session.url,
            orderId: savedOrder._id
        });
    } catch (err) {
        console.error('Stripe error:', err);
        res.status(500).json({ message: 'Payment failed', error: err.message });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const { sessionId, orderId } = req.body;


        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {

            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }


            if (order.isPaid) {
                return res.json({ success: true, message: 'Already verified', order });
            }

            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                id: session.payment_intent,
                status: session.payment_status,
                email: session.customer_details?.email,
            };
            await order.save();


            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.qty } }
                );
            }


            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { items: [] }
            );

            res.json({ success: true, message: 'Payment verified', order });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ message: 'Verification failed', error: err.message });
    }
};