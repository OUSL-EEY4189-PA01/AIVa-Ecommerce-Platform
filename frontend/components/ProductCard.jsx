import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link
    to={`/products/${product._id}`}
    className="bg-white flex flex-col transition-all duration-200 group"
    style={{ width: '269.33px', height: '329.233px', padding: '8px' }}
  >

    <div
      className="relative overflow-hidden bg-gray-100"
      style={{ width: '100%', height: '269.33px', marginBottom: '12px' }}
    >
      <img
        src={`http://localhost:5000/${product.image}`}
        alt={product.name}
        className="w-full h-full object-cover rounded-lg bg-gray-200 transition-opacity duration-200 group-hover:opacity-75"
      />

      
    </div>

    
    <h3 className="mt-4 text-sm text-gray-700" style={{ width: '100%' }}>
      {product.name}
    </h3>
    <p className="mt-1 text-lg font-medium text-gray-900" style={{ width: '100%' }}>
      ${product.price}
    </p>
  </Link>
);

export default ProductCard;
