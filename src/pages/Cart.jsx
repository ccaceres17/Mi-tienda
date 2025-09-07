import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const { cartItems, clearCart } = useCart()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium mb-4"
          >
            Vaciar carrito
          </button>

          <div className="space-y-4">
            {cartItems.map(({ product, quantity }, index) => (
              <div
                key={index}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{product.title}</h2>
                  <p>Cantidad: {quantity}</p>
                </div>
                <p className="font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
