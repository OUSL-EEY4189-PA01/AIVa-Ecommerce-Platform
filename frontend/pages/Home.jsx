import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import heroImage from '../assets/hero-image.jpeg';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=4');
      setProducts(data.products || data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          {/* Left side */}
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Unveil Your Radiance
            </h1>
            <p className="text-lg text-black/50 max-w-md mb-8">
              Discover our curated selection of premium skincare products for your skin.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
            >
              Shop Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          {/* Right side */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none z-10"></div>
            <img
              src={heroImage}
              alt="New Collection"
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm text-black/50 hover:text-black transition-colors">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-black/50">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group block border border-black/10 hover:border-black transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-1 group-hover:underline">{product.name}</h3>
                  <p className="font-bold">LKR {product.price?.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Free Shipping', desc: 'On orders over LKR 5,000' },
              { title: 'Secure Payment', desc: 'Safe & encrypted checkout' },
              { title: 'Easy Returns', desc: '7-day return policy' }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <h3 className="font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-black/50">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

