import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(productId);
            return;
        }
        await updateQuantity(productId, newQuantity);
    };

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 300;
    const total = subtotal + shipping;
    const freeShippingRemaining = 5000 - subtotal;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-black/50">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-black/50 mb-4">Please log in to view your cart</p>
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
                    <Link to="/products" className="px-6 py-3 bg-black text-white text-sm font-medium">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-black/10">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-black tracking-tighter">Cart</h1>
                    <p className="text-black/50 mt-1">{cart.length} items</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Free Shipping Progress */}
                {freeShippingRemaining > 0 && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-800">
                            Add <span className="font-bold">LKR {freeShippingRemaining.toFixed(2)}</span> more to qualify for free shipping!
                        </p>
                        <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                {shipping === 0 && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200">
                        <p className="text-sm text-emerald-800 font-medium">✓ You qualify for free shipping!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map(item => (
                            <div key={item.product._id} className="flex gap-6 pb-6 border-b border-black/10">
                                <Link to={`/products/${item.product._id}`} className="shrink-0">
                                    <img
                                        src={`http://localhost:5000/${item.product.image}`}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover bg-neutral-100"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <Link to={`/products/${item.product._id}`} className="font-medium hover:underline">
                                            {item.product.name}
                                        </Link>
                                        <button
                                            onClick={() => removeFromCart(item.product._id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p className="text-sm text-black/50 mt-1">LKR {item.product.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex border border-black/20">
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 text-sm"
                                            >
                                                −
                                            </button>
                                            <div className="w-10 h-8 flex items-center justify-center border-x border-black/20 text-sm">
                                                {item.quantity}
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="font-bold">LKR {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black">
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="border border-black/10 p-6">
                            <h2 className="font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-black/50">Subtotal</span>
                                    <span>LKR {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black/50">Shipping</span>
                                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                                        {shipping === 0 ? 'Free' : `LKR ${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t border-black/10 pt-4 mb-6">
                                <span>Total</span>
                                <span>LKR {total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                            <p className="text-xs text-center text-black/40 mt-4">Secure checkout powered by Stripe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
