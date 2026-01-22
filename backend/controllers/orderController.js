import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';

export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }


        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }

            if (product.stock < item.qty) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.name}. Available: ${product.stock}`
                });
            }


            product.stock -= item.qty;
            await product.save();
        }


        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid: false
        });

        const createdOrder = await order.save();

        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        );

        res.status(201).json(createdOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }


        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};