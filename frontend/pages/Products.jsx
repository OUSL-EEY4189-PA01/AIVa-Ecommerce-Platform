import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-lg text-gray-900">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">Error: {error}</div>
    );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Our Products
        </h1>
      </div>

      <section className="pb-24">
        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Products;

