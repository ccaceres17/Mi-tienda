// src/components/ProductCard.jsx
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const truncateText = (text, maxLength = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 p-4"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">
                {product.rating?.rate} ({product.rating?.count})
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">
            {truncateText(product.title)}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(product.description, 100)}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
              Ver Detalles
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard