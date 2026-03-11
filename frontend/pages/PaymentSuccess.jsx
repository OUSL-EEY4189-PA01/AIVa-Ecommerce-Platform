import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const sessionId = searchParams.get('session_id');
    const method = searchParams.get('method');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (sessionId) {
            verifyPayment();
        } else if (method === 'cod' && orderId) {
            fetchOrder(orderId);
        } else {
            setLoading(false);
        }
    }, [sessionId, method, orderId]);

    const verifyPayment = async () => {
        try {
            const { data } = await api.post('/payment/verify-payment', { sessionId, orderId });
            setOrder(data.order);
            await clearCart();
        } catch (err) {
            console.error('Payment verification failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrder = async (id) => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            console.error('Failed to fetch order:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-black/50">Processing...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                    ✓
                </div>
                <h1 className="text-3xl font-black tracking-tighter mb-2">Order Confirmed</h1>
                <p className="text-black/50 mb-8">Thank you for your purchase!</p>

                {order && (
                    <div className="border border-black/10 p-6 text-left mb-8">
                        <div className="flex justify-between mb-4">
                            <span className="text-black/50 text-sm">Order ID</span>
                            <span className="font-mono text-sm">#{order._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span className="text-black/50 text-sm">Total</span>
                            <span className="font-bold">LKR {order.totalPrice?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-black/50 text-sm">Payment</span>
                            <span className="text-sm">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid'}</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <Link to="/profile" className="flex-1 py-3 border border-black/20 text-sm font-medium hover:border-black">
                        View Orders
                    </Link>
                    <Link to="/products" className="flex-1 py-3 bg-black text-white text-sm font-medium hover:bg-black/80">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
