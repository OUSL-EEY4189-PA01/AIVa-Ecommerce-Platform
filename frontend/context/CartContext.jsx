import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.get('/cart');
            setCart(data.items || []);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setCart([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            return { success: false, message: 'Please log in to add items to cart' };
        }

        try {
            const { data } = await api.post('/cart/add', { productId, quantity });
            setCart(data.items || []);
            return { success: true };
        } catch (err) {
            console.error('Error adding to cart:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user) {
            return { success: false, message: 'Please log in' };
        }

        try {
            const { data } = await api.put('/cart/update', { productId, quantity });
            setCart(data.items || []);
            return { success: true };
        } catch (err) {
            console.error('Error updating cart:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to update cart' };
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) {
            return { success: false, message: 'Please log in' };
        }

        try {
            const { data } = await api.delete(`/cart/remove/${productId}`);
            setCart(data.items || []);
            return { success: true };
        } catch (err) {
            console.error('Error removing from cart:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to remove from cart' };
        }
    };

    const clearCart = async () => {
        if (!user) {
            return { success: false, message: 'Please log in' };
        }

        try {
            await api.delete('/cart/clear');
            setCart([]);
            return { success: true };
        } catch (err) {
            console.error('Error clearing cart:', err);
            return { success: false, message: err.response?.data?.message || 'Failed to clear cart' };
        }
    };

    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            loading,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};
