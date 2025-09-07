import { useParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useState, useEffect } from 'react'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart() // 👈 usamos el hook aquí

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar el producto')
        return res.json()
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!product) return <p>No se encontró el producto</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="text-lg font-semibold">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Agregar al carrito
      </button>
    </div>
  )
}

export default ProductDetail
