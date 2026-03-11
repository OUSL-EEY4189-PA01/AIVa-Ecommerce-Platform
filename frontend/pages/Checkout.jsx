import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 300;
    const total = subtotal + shipping;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-black/50 mb-4">Please sign in to checkout</p>
                    <Link to="/login" className="px-6 py-3 bg-black text-white text-sm font-medium">Sign In</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-black/50 mb-4">Your cart is empty</p>
                    <Link to="/products" className="px-6 py-3 bg-black text-white text-sm font-medium">Shop Now</Link>
                </div>
            </div>
        );
    }

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');
        try {
            const orderItems = cart.map(item => ({
                name: item.product.name,
                qty: item.quantity,
                image: item.product.image,
                price: item.product.price,
                product: item.product._id,
            }));

            if (paymentMethod === 'Card') {
                const { data } = await api.post('/payment/create-checkout-session', {
                    orderItems,
                    shippingAddress: shippingInfo,
                    totalPrice: total,
                });
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    setError(data.message || data.error || 'Payment initialization failed. Please try again.');
                }
            } else {
                const { data } = await api.post('/orders', {
                    orderItems,
                    shippingAddress: shippingInfo,
                    paymentMethod: 'COD',
                    taxPrice: 0,
                    shippingPrice: shipping,
                    totalPrice: total,
                });
                await clearCart();
                navigate('/payment-success?method=cod&order_id=' + data._id);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-black/10">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Link to="/cart" className="text-sm text-black/50 hover:text-black mb-2 inline-block">← Back to Cart</Link>
                    <h1 className="text-3xl font-black tracking-tighter">Checkout</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Steps */}
                <div className="flex gap-8 mb-12">
                    {['Shipping', 'Payment'].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? 'bg-emerald-600 text-white' :
                                step === i + 1 ? 'border-2 border-black' : 'border border-black/20 text-black/40'
                                }`}>
                                {step > i + 1 ? '✓' : i + 1}
                            </div>
                            <span className={step >= i + 1 ? 'font-medium' : 'text-black/40'}>{s}</span>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <form onSubmit={handleShippingSubmit} className="space-y-6">
                                <h2 className="font-bold text-lg mb-4">Shipping Information</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm text-black/50 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.fullName}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm text-black/50 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            required
                                            value={shippingInfo.phone}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-black/50 mb-2">Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingInfo.address}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-black/50 mb-2">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.city}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-black/50 mb-2">Postal Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.postalCode}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-black/50 mb-2">Country</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingInfo.country}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                            className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-black text-white font-medium hover:bg-black/80">
                                    Continue to Payment
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <button onClick={() => setStep(1)} className="text-sm text-black/50 hover:text-black">← Back to Shipping</button>
                                <h2 className="font-bold text-lg mb-4">Payment Method</h2>

                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'Card' ? 'border-blue-600 bg-blue-50' : 'border-black/20 hover:border-black/40'}`}>
                                        <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="w-4 h-4 text-blue-600" />
                                        <div className="flex-1">
                                            <p className="font-medium">Credit / Debit Card</p>
                                            <p className="text-sm text-black/50">Pay securely via Stripe</p>
                                        </div>
                                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </label>
                                    <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50' : 'border-black/20 hover:border-black/40'}`}>
                                        <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4 text-emerald-600" />
                                        <div className="flex-1">
                                            <p className="font-medium">Cash on Delivery</p>
                                            <p className="text-sm text-black/50">Pay when you receive</p>
                                        </div>
                                        <span className="text-2xl">💵</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className={`w-full py-3 font-medium disabled:opacity-50 transition-colors ${paymentMethod === 'Card'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        }`}
                                >
                                    {loading ? 'Processing...' : paymentMethod === 'Card' ? 'Pay with Card' : 'Place Order'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="border border-black/10 p-6">
                            <h2 className="font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.product._id} className="flex gap-3">
                                        <img src={`http://localhost:5000/${item.product.image}`} alt="" className="w-12 h-12 object-cover bg-neutral-100" />
                                        <div className="flex-1 text-sm">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-black/50">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">LKR {(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 text-sm border-t border-black/10 pt-4">
                                <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span>LKR {subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between">
                                    <span className="text-black/50">Shipping</span>
                                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `LKR ${shipping}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-black/10"><span>Total</span><span>LKR {total.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
