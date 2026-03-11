import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', category: '', stock: '', brand: '', keyBenefits: '', keyIngredients: '', howToUse: '' });
  const [imageFile, setImageFile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
  const { user } = useAuth();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products?limit=1000'),
        api.get('/users')
      ]);

      const ordersData = ordersRes.data;
      setOrders(ordersData);
      setStats(prev => ({ ...prev, totalOrders: ordersData.length, totalRevenue: ordersData.reduce((s, o) => s + o.totalPrice, 0) }));

      const productsData = productsRes.data.products || productsRes.data;
      setProducts(productsData);
      const totalProducts = productsRes.data.pagination?.total || productsData.length;
      setStats(prev => ({ ...prev, totalProducts }));

      const usersData = usersRes.data;
      setUsers(usersData);
      setStats(prev => ({ ...prev, totalUsers: usersData.length }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeliverOrder = async (id) => {
    await api.put(`/orders/${id}/deliver`);
    fetchData();
  };

  const handlePayOrder = async (id) => {
    await api.put(`/orders/${id}/pay`);
    fetchData();
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `/products/${editingProduct._id}` : '/products';
    const method = editingProduct ? 'put' : 'post';

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', parseFloat(productForm.price));
    formData.append('stock', parseInt(productForm.stock));
    formData.append('description', productForm.description);
    formData.append('category', productForm.category);
    formData.append('brand', productForm.brand);
    formData.append('keyBenefits', productForm.keyBenefits);
    formData.append('keyIngredients', productForm.keyIngredients);
    formData.append('howToUse', productForm.howToUse);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    await api[method](url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    closeModal();
    fetchData();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchData();
  };

  const handleToggleAdmin = async (id) => {
    await api.put(`/users/${id}/admin`);
    fetchData();
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    fetchData();
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setProductForm(product ? { name: product.name, price: product.price, description: product.description, category: product.category, stock: product.stock, brand: product.brand || '', keyBenefits: '', keyIngredients: '', howToUse: '' } : { name: '', price: '', description: '', category: '', stock: '', brand: '', keyBenefits: '', keyIngredients: '', howToUse: '' });
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-black/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-black/10 p-6 flex flex-col">
        <nav className="flex-1 space-y-1">
          {['overview', 'orders', 'products', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-black/10 mt-6">
          <p className="text-sm font-medium">{user?.name}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Orders', value: stats.totalOrders },
              { label: 'Products', value: stats.totalProducts },
              { label: 'Users', value: stats.totalUsers },
              { label: 'Revenue', value: `LKR ${stats.totalRevenue.toFixed(0)}` }
            ].map((s) => (
              <div key={s.label} className="border border-black/10 p-6">
                <p className="text-sm text-black/50 mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <table className="w-full text-sm">
            <thead className="border-b border-black/10">
              <tr>
                <th className="text-left py-4 font-medium">Order</th>
                <th className="text-left py-4 font-medium">Customer</th>
                <th className="text-left py-4 font-medium">Total</th>
                <th className="text-left py-4 font-medium">Payment Type</th>
                <th className="text-left py-4 font-medium">Payment</th>
                <th className="text-left py-4 font-medium"></th>
                <th className="text-left py-4 font-medium">Delivery</th>
                <th className="text-left py-4 font-medium"></th>
                <th className="text-left py-4 font-medium">Date</th>
                <th className="text-left py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="py-4 font-mono">#{o._id.slice(-6)}</td>
                  <td className="py-4">{o.user?.name}</td>
                  <td className="py-4 font-medium">LKR {o.totalPrice.toFixed(0)}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700">
                      {o.paymentMethod || 'Card'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-medium ${o.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {o.isPaid ? '✓ Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-4">
                    {!o.isPaid && (
                      <button
                        onClick={() => handlePayOrder(o._id)}
                        className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded hover:bg-amber-600 transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-medium ${o.isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                      {o.isDelivered ? '✓ Delivered' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4">
                    {!o.isDelivered && (
                      <button
                        onClick={() => handleDeliverOrder(o._id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                  <td className="py-4 text-black/50">{formatDate(o.createdAt)}</td>
                  <td className="py-4">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-black/80 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <>
            <button onClick={() => openModal()} className="mb-6 px-4 py-2 bg-black text-white text-sm font-medium hover:bg-black/80">+ Add Product</button>
            <table className="w-full text-sm">
              <thead className="border-b border-black/10">
                <tr>
                  <th className="text-left py-4 font-medium">Product</th>
                  <th className="text-left py-4 font-medium">Price</th>
                  <th className="text-left py-4 font-medium">Stock</th>
                  <th className="text-left py-4 font-medium">Action</th>
                  <th className="text-center py-3 font-medium">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={`http://localhost:5000/${p.image}`} alt="" className="w-10 h-10 object-cover bg-neutral-100" />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 font-medium">LKR {p.price}</td>
                    <td className="py-4">
                      <span className={`font-medium ${p.stock <= 0 ? 'text-red-600' :
                        p.stock <= 5 ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => openModal(p)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-2 text-black/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete product"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <table className="w-full text-sm">
            <thead className="border-b border-black/10">
              <tr>
                <th className="text-left py-4 font-medium">User</th>
                <th className="text-left py-4 font-medium">Email</th>
                <th className="text-left py-4 font-medium">Role</th>
                <th className="text-left py-4 font-medium">Action</th>
                <th className="text-center py-3 font-medium">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((u) => {
                const isMe = u._id === user?._id || u.email === user?.email;
                return (
                  <tr key={u._id} className={isMe ? 'bg-neutral-100' : ''}>
                    <td className="py-4 font-medium">{u.name} {isMe && <span className="text-xs text-neutral-500">(You)</span>}</td>
                    <td className="py-4 text-black/50">{u.email}</td>
                    <td className="py-4">
                      <span className={`text-xs font-medium ${u.isAdmin ? 'text-blue-600' : 'text-black/50'}`}>
                        {u.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-4">
                      {isMe ? (
                        <span className="text-xs text-black/30">—</span>
                      ) : (
                        <button
                          onClick={() => handleToggleAdmin(u._id)}
                          className={`px-3 py-1.5 text-white text-xs font-medium rounded transition-colors ${u.isAdmin
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                          {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {isMe ? (
                        <span className="text-xs text-black/30">—</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 text-black/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete user"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-black/10">
              <h3 className="font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={closeModal} className="text-black/50 hover:text-black">✕</button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <input type="text" placeholder="Name" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="px-4 py-3 border border-black/20 focus:border-black focus:outline-none" />
                <input type="number" placeholder="Stock" required value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="px-4 py-3 border border-black/20 focus:border-black focus:outline-none" />
              </div>
              <textarea placeholder="Description" required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none" />
              <div>
                <label className="block text-sm text-black/50 mb-2">Product Image {editingProduct && '(leave empty to keep current)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  required={!editingProduct}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Category" required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="px-4 py-3 border border-black/20 focus:border-black focus:outline-none" />
                <input type="text" placeholder="Brand" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="px-4 py-3 border border-black/20 focus:border-black focus:outline-none" />
              </div>
              <div className="border-t border-black/10 pt-4 mt-2">
                <p className="text-xs text-black/40 mb-3 font-medium uppercase tracking-wide">Product Details</p>
                <input type="text" placeholder="Key Benefits" value={productForm.keyBenefits} onChange={(e) => setProductForm({ ...productForm, keyBenefits: e.target.value })} className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none mb-4" />
                <input type="text" placeholder="Key Ingredients" value={productForm.keyIngredients} onChange={(e) => setProductForm({ ...productForm, keyIngredients: e.target.value })} className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none mb-4" />
                <textarea placeholder="How to Use" value={productForm.howToUse} onChange={(e) => setProductForm({ ...productForm, howToUse: e.target.value })} rows={2} className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none" />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={closeModal} className="flex-1 py-3 border border-black/20 font-medium hover:bg-black/5">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-black/10">
              <div>
                <h3 className="font-bold text-lg">Order Details</h3>
                <p className="text-sm text-black/50 font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-black/50 hover:text-black">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-black/50 mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                  <p className="text-sm text-black/50">{selectedOrder.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-black/50 mb-1">Shipping Address</p>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress?.address}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}<br />
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-neutral-50 rounded">
                  <p className="text-xs text-black/50 mb-1">Payment</p>
                  <span className={`text-sm font-medium ${selectedOrder.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedOrder.isPaid ? '✓ Paid' : 'Unpaid'}
                  </span>
                  <p className="text-xs text-black/50 mt-1">{selectedOrder.paymentMethod || 'Card'}</p>
                </div>
                <div className="flex-1 p-4 bg-neutral-50 rounded">
                  <p className="text-xs text-black/50 mb-1">Delivery</p>
                  <span className={`text-sm font-medium ${selectedOrder.isDelivered ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {selectedOrder.isDelivered ? '✓ Delivered' : 'Pending'}
                  </span>
                </div>
                <div className="flex-1 p-4 bg-neutral-50 rounded">
                  <p className="text-xs text-black/50 mb-1">Order Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm font-medium mb-3">Order Items ({selectedOrder.orderItems?.length || 0})</p>
                <div className="border border-black/10 divide-y divide-black/10">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4">
                      <img
                        src={`http://localhost:5000/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover bg-neutral-100"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-black/50">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">LKR {(item.price * item.qty).toFixed(2)}</p>
                        <p className="text-xs text-black/50">@ LKR {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-black/10 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>LKR {selectedOrder.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-black/10">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 border border-black/20 font-medium hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
