// src/components/Cart.jsx
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function Cart({ isOpen = true, onToggle, className = "" }) {
  const { 
    cart, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart, 
    subtotal,
    tax,
    total,
    itemCount,
    isEmpty,
    isLoading,
    error 
  } = useCart();

  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  // Truncar título del producto
  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return 'Sin título';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Manejar limpieza del carrito con confirmación
  const handleClearCart = () => {
    if (showConfirmClear) {
      clearCart();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      // Auto-cancelar después de 3 segundos
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  };

  // Simular proceso de checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de checkout
      alert(`¡Compra exitosa! Total: ${formatPrice(total)}`);
      clearCart();
    } catch (error) {
      alert('Error en el proceso de compra. Inténtalo nuevamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Componente de item del carrito
  const CartItem = ({ item }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        {/* Imagen del producto */}
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border">
          {!imageError && item.image ? (
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-tight mb-1" title={item.title}>
            {truncateTitle(item.title)}
          </h4>
          
          <div className="text-sm text-gray-600 mb-2">
            {formatPrice(item.price)} × {item.quantity}
          </div>

          {/* Controles de cantidad */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-white rounded-lg border">
              <button
                onClick={() => decrementQuantity(item.id)}
                disabled={isLoading || item.quantity <= 1}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                aria-label="Disminuir cantidad"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={() => incrementQuantity(item.id)}
                disabled={isLoading}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                aria-label="Aumentar cantidad"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={() => removeFromCart(item.id)}
              disabled={isLoading}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              aria-label={`Eliminar ${item.title} del carrito`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Subtotal del item */}
        <div className="text-right">
          <div className="font-medium text-sm">
            {formatPrice((item.price || 0) * (item.quantity || 0))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header del carrito */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-800">
              Carrito de Compras
            </h2>
          </div>
          
          {/* Badge con cantidad de items */}
          {!isEmpty && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {itemCount}
            </span>
          )}
          
          {/* Botón toggle si se proporciona */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contenido del carrito */}
      <div className="p-4">
        {/* Mostrar error si existe */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {isEmpty ? (
          /* Carrito vacío */
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
            <p className="text-sm text-gray-400">Agrega algunos productos para comenzar</p>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Resumen de precios */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Proceder al Pago</span>
                  </>
                )}
              </button>

              <button
                onClick={handleClearCart}
                disabled={isLoading}
                className={`w-full font-medium py-2 rounded-lg transition-colors disabled:cursor-not-allowed ${
                  showConfirmClear
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {showConfirmClear ? '¿Confirmar vaciado?' : 'Vaciar Carrito'}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}