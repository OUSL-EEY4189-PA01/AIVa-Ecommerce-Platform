import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === 'increase' ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  if (loading)
    return <div className="text-center py-10 text-lg text-black">Loading product...</div>;

  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  if (!product)
    return <div className="text-center py-10">Product not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-white">
      <div className="pt-6 pb-8">
        <nav>
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-gray-700">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/products" className="hover:text-gray-700">Products</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 truncate max-w-[50vw]">{product.name}</li>
          </ol>
        </nav>

        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
          <div className="flex flex-col">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          
          <div className="mt-10 lg:mt-0 lg:pl-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-medium text-gray-900">
              Rs.{product.price}
            </p>

            
            <p className="mt-6 text-sm text-gray-700 leading-6">
              {product.description}
            </p>

            
            <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-md">
                <button
                onClick={() => handleQuantityChange('decrease')}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                -
                </button>
                <span className="w-10 text-center text-gray-800 font-medium select-none">
                {quantity}
                </span>
                <button
                onClick={() => handleQuantityChange('increase')}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                +
                </button>
            </div>

            <button
                className={`w-64 h-10 rounded-md text-white text-sm font-medium transition ${
                product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
                type="button"
                className="h-10 w-10 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400"
            >
                ♡
            </button>
            </div>


        
            <div className="mt-6 text-sm text-gray-600">
              <div>
                Category:{' '}
                <span className="font-medium text-gray-900">{product.category}</span>
              </div>
              <div className="mt-1">
                Stock:{' '}
                <span
                  className={`${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  } font-medium`}
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            
            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Features</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {product.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 divide-y divide-gray-200 border-t border-b border-gray-200">
              {[
                { title: 'Shipping', content: 'Standard shipping in 3-5 business days.' },
                { title: 'Returns', content: '7-day return policy. Item must be unused.' },
              ].map((item) => (
                <details key={item.title} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-900">
                    {item.title}
                    <span className="ml-6 flex h-7 items-center text-gray-400 group-open:rotate-45 transition">
                      +
                    </span>
                  </summary>
                  <div className="mt-2 text-sm text-gray-700">{item.content}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

