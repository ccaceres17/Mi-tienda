import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

const Navbar = () => {
  const { getCartItemCount } = useCart()

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">🛒 Mi Tienda</Link>
      </h1>

      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/cart">
          Carrito ({getCartItemCount()})
        </Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar
