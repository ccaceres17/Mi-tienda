// src/components/Product.jsx
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function Product({ product }) {
  const { 
    addToCart, 
    isInCart, 
    getItemQuantity, 
    incrementQuantity, 
    decrementQuantity,
    isLoading,
    error 
  } = useCart();

  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Verificar si el producto está en el carrito
  const inCart = isInCart(product?.id);
  const quantity = getItemQuantity(product?.id);

  // Validar que el producto tenga datos mínimos
  if (!product || !product.id) {
    return (
      <div className="border p-4 rounded shadow bg-gray-50">
        <div className="text-center text-gray-500">
          <p>Producto no disponible</p>
        </div>
      </div>
    );
  }

  // Manejar agregar al carrito con feedback visual
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      const success = await addToCart(product);
      if (success) {
        // Pequeña pausa para mostrar el feedback
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Manejar incremento de cantidad
  const handleIncrement = () => {
    incrementQuantity(product.id);
  };

  // Manejar decremento de cantidad
  const handleDecrement = () => {
    decrementQuantity(product.id);
  };

  // Formatear precio
  const formatPrice = (price) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    return numPrice.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Truncar título si es muy largo
  const truncateTitle = (title, maxLength = 60) => {
    if (!title) return 'Sin título';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      {/* Imagen del producto */}
      <div className="h-48 mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        {!imageError && product.image ? (
          <img 
            src={product.image} 
            alt={product.title || 'Producto'} 
            className="h-full w-full object-contain hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-center p-4">
            <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Sin imagen</p>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="space-y-2">
        <h3 
          className="font-semibold text-gray-800 text-sm leading-tight"
          title={product.title}
        >
          {truncateTitle(product.title)}
        </h3>
        
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-green-600">
            {formatPrice(product.price)}
          </p>
          
          {/* Badge de categoría si existe */}
          {product.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Rating si existe */}
        {product.rating && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating.rate) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="mt-4">
        {inCart ? (
          <div className="space-y-2">
            {/* Controles de cantidad */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-2">
              <button
                onClick={handleDecrement}
                disabled={isLoading || quantity <= 1}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="mx-4 font-semibold text-lg min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={handleIncrement}
                disabled={isLoading}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar cantidad"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-center text-gray-600">
              En el carrito: {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
            </p>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            aria-label={`Añadir ${product.title} al carrito`}
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Agregando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Añadir al carrito</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}