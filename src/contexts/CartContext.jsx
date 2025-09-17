// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";

// Constantes
const CART_STORAGE_KEY = "shopping_cart";
const MAX_QUANTITY = 99;

// Crear contexto
export const CartContext = createContext();

// Hook personalizado para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}

// Función para validar producto
const validateProduct = (product) => {
  if (!product || typeof product !== 'object') {
    throw new Error("El producto debe ser un objeto válido");
  }
  if (!product.id) {
    throw new Error("El producto debe tener un ID");
  }
  if (typeof product.price !== 'number' || product.price < 0) {
    throw new Error("El producto debe tener un precio válido");
  }
  return true;
};

// Función para cargar carrito desde localStorage
const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Validar cada item del carrito
    return parsed.filter(item => {
      try {
        validateProduct(item);
        return typeof item.quantity === 'number' && item.quantity > 0;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.warn("Error cargando carrito desde localStorage:", error);
    return [];
  }
};

// Función para guardar carrito en localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error("Error guardando carrito en localStorage:", error);
    return false;
  }
};

export function CartProvider({ children }) {
  // Estados
  const [cart, setCart] = useState(loadCartFromStorage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guardar carrito cuando cambie
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCartToStorage(cart);
    }, 300); // Debounce para evitar muchas escrituras

    return () => clearTimeout(timeoutId);
  }, [cart]);

  // Limpiar errores después de un tiempo
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  // Función helper para manejar errores
  const handleError = useCallback((error, fallbackMessage = "Error en el carrito") => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    setError(message);
    console.error("CartContext Error:", error);
  }, []);

  // Agregar producto al carrito
  const addToCart = useCallback((product, quantity = 1) => {
    try {
      validateProduct(product);
      
      if (typeof quantity !== 'number' || quantity < 1) {
        throw new Error("La cantidad debe ser un número positivo");
      }

      setIsLoading(true);
      setError(null);

      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, MAX_QUANTITY);
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        
        return [...prevCart, { 
          ...product, 
          quantity: Math.min(quantity, MAX_QUANTITY),
          addedAt: new Date().toISOString()
        }];
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      handleError(error, "Error al agregar producto al carrito");
      setIsLoading(false);
      return false;
    }
  }, [handleError]);

  // Remover producto del carrito
  const removeFromCart = useCallback((productId) => {
    try {
      if (!productId) {
        throw new Error("ID de producto requerido");
      }

      setError(null);
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      return true;
    } catch (error) {
      handleError(error, "Error al remover producto del carrito");
      return false;
    }
  }, [handleError]);

  // Actualizar cantidad de producto
  const updateQuantity = useCallback((productId, newQuantity) => {
    try {
      if (!productId) {
        throw new Error("ID de producto requerido");
      }
      
      if (typeof newQuantity !== 'number' || newQuantity < 0) {
        throw new Error("La cantidad debe ser un número no negativo");
      }

      setError(null);

      if (newQuantity === 0) {
        return removeFromCart(productId);
      }

      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.min(newQuantity, MAX_QUANTITY) }
            : item
        )
      );
      return true;
    } catch (error) {
      handleError(error, "Error al actualizar cantidad");
      return false;
    }
  }, [handleError, removeFromCart]);

  // Incrementar cantidad
  const incrementQuantity = useCallback((productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      return updateQuantity(productId, item.quantity + 1);
    }
    return false;
  }, [cart, updateQuantity]);

  // Decrementar cantidad
  const decrementQuantity = useCallback((productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      return updateQuantity(productId, item.quantity - 1);
    }
    return false;
  }, [cart, updateQuantity]);

  // Limpiar carrito
  const clearCart = useCallback(() => {
    try {
      setError(null);
      setCart([]);
      return true;
    } catch (error) {
      handleError(error, "Error al limpiar carrito");
      return false;
    }
  }, [handleError]);

  // Verificar si un producto está en el carrito
  const isInCart = useCallback((productId) => {
    return cart.some(item => item.id === productId);
  }, [cart]);

  // Obtener cantidad de un producto específico
  const getItemQuantity = useCallback((productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cart]);

  // Calcular totales
  const totals = React.useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return sum + (price * quantity);
    }, 0);

    const itemCount = cart.reduce((sum, item) => {
      return sum + (typeof item.quantity === 'number' ? item.quantity : 0);
    }, 0);

    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount
    };
  }, [cart]);

  // Valor del contexto
  const contextValue = React.useMemo(() => ({
    // Estado
    cart,
    isLoading,
    error,
    
    // Acciones
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    
    // Utilidades
    isInCart,
    getItemQuantity,
    
    // Totales
    ...totals,
    
    // Información adicional
    isEmpty: cart.length === 0,
    maxQuantity: MAX_QUANTITY
  }), [
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    totals
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}