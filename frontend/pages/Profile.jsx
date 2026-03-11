import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', profileForm);
      await checkAuth();
      setEditMode(false);
      showMessage('success', 'Profile updated successfully');
    } catch (err) {
      showMessage('error', 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to change password');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-black/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black tracking-tighter">{user?.name}</h1>
          <p className="text-black/50">{user?.email}</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`border-b ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="max-w-4xl mx-auto px-4 py-3 text-sm font-medium">{message.text}</div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-black/10 mb-8">
          {['orders', 'profile', 'change password'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-black' : 'text-black/50 hover:text-black'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black/50 mb-4">No orders yet</p>
                <Link to="/products" className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-black/10 p-6 cursor-pointer hover:border-black/30 hover:shadow-sm transition-all"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-black/40 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="font-bold">LKR {order.totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 font-medium ${order.isDelivered ? 'bg-emerald-100 text-emerald-800' :
                          order.isPaid ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                          {order.isDelivered ? '✓ Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                        </span>
                        <p className="text-xs text-black/40 mt-2">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.orderItems.slice(0, 4).map((item, i) => (
                        <img key={i} src={`http://localhost:5000/${item.image}`} alt="" className="w-12 h-12 object-cover bg-neutral-100" />
                      ))}
                      {order.orderItems.length > 4 && (
                        <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-xs text-black/50">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-black/40 mt-3">Click to view receipt →</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-md">
            {editMode ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm text-black/50 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-black/50 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditMode(false)} className="px-6 py-3 border border-black/20 text-sm font-medium hover:bg-black/5">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-black/50 mb-1">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-black/50 mb-1">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <button onClick={() => setEditMode(true)} className="text-sm text-blue-600 hover:underline">Edit Profile</button>
              </div>
            )}
          </div>
        )}

        {/* Change Password */}
        {activeTab === 'change password' && (
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm text-black/50 mb-2">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-black/50 mb-2">New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-black/50 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80">Change Password</button>
          </form>
        )}
      </div>

      {/* Order Receipt Modal */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Receipt Header */}
              <div className="p-6 border-b border-black/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black tracking-tighter">Order Receipt</h2>
                    <p className="text-xs text-black/40 font-mono mt-1">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Order Status */}
              <div className="p-6 border-b border-black/10 bg-neutral-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-black/40 mb-1">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 font-medium ${selectedOrder.isDelivered ? 'bg-emerald-100 text-emerald-800' :
                    selectedOrder.isPaid ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                    {selectedOrder.isDelivered ? '✓ Delivered' : selectedOrder.isPaid ? 'Processing' : 'Pending Payment'}
                  </span>
                </div>
                {selectedOrder.isPaid && (
                  <p className="text-xs text-black/40 mt-2">
                    Paid on {formatDate(selectedOrder.paidAt)}
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="p-6 border-b border-black/10">
                <p className="text-xs text-black/40 mb-2">Shipping Address</p>
                <p className="font-medium">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm text-black/60">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-sm text-black/60">{selectedOrder.shippingAddress?.country}</p>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-black/10">
                <p className="text-xs text-black/40 mb-4">Items ({selectedOrder.orderItems.length})</p>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <img
                        src={`http://localhost:5000/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover bg-neutral-100"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-black/40 mt-1">Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold text-sm">LKR {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="p-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50">Subtotal</span>
                    <span>LKR {selectedOrder.itemsPrice?.toFixed(2) || (selectedOrder.totalPrice - (selectedOrder.shippingPrice || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Shipping</span>
                    <span>LKR {selectedOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-black/10 text-lg font-bold">
                    <span>Total</span>
                    <span>LKR {selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="px-6 pb-6">
                <div className="p-4 bg-neutral-50 rounded">
                  <p className="text-xs text-black/40 mb-1">Payment Method</p>
                  <p className="font-medium text-sm">{selectedOrder.paymentMethod || 'Card'}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
