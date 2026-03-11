import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      setReview({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-black/50">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-black/50">Product not found</div>;
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/products" className="text-black/50 hover:text-black">Products</Link>
            <span className="text-black/30">/</span>
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-neutral-100 relative">
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50' : ''}`}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black text-white px-4 py-2 text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-black/40 uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-black mb-6">LKR {product.price?.toFixed(2)}</p>

            <p className="text-black/60 mb-8 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-medium">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-emerald-600 font-medium">✓ In Stock ({product.stock} available)</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {!isOutOfStock && (
              <div className="flex gap-4 mb-8">
                <div className="flex border border-black/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-black/5"
                  >
                    −
                  </button>
                  <div className="w-12 h-12 flex items-center justify-center border-x border-black/20 font-medium">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-black/5"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 font-medium transition-colors ${addedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-black/80'
                    }`}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Info */}
            <div className="border-t border-black/10 pt-8 space-y-4 text-sm">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-black/50">Brand</span>
                  <span>{product.brand}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/50">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex items-center gap-2 pt-4 text-emerald-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Free shipping over LKR 5,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 pt-16 border-t border-black/10">
          <h2 className="text-2xl font-bold mb-8">Reviews ({product.reviews?.length || 0})</h2>

          {/* Review Form */}
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-12 max-w-xl">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({ ...review, rating: star })}
                    className={`text-2xl ${star <= review.rating ? 'text-amber-400' : 'text-black/20'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Write your review..."
                rows={4}
                className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none mb-4"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Review List */}
          <div className="space-y-6">
            {product.reviews?.map((r, i) => (
              <div key={i} className="pb-6 border-b border-black/10">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-amber-400">{'★'.repeat(r.rating)}<span className="text-black/20">{'★'.repeat(5 - r.rating)}</span></span>
                </div>
                <p className="text-black/60">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


