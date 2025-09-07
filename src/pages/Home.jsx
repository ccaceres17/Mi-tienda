// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos iniciales
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Filtrar y ordenar cuando cambien las opciones
  useEffect(() => {
    if (selectedCategory === 'all') {
      fetchProducts()
    } else {
      fetchProductsByCategory(selectedCategory)
    }
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) throw new Error('Error al cargar productos')
      
      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories')
      if (!response.ok) throw new Error('Error al cargar categorías')
      
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error('Error al cargar categorías:', err)
    }
  }

  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true)
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`)
      if (!response.ok) throw new Error('Error al cargar productos por categoría')
      
      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (sortType) => {
    setSortBy(sortType)
    let sortedProducts = [...products]

    switch (sortType) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'rating':
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate)
        break
      default:
        break
    }

    setProducts(sortedProducts)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchProducts}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">FakeStore</h1>
        <p className="text-xl md:text-2xl mb-6">
          Descubre productos increíbles con los mejores precios
        </p>
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm opacity-90">Productos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm opacity-90">Categorías</div>
          </div>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filtro por categoría */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-medium text-gray-700">Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Orden por defecto</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
              <option value="rating">Mejor calificación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl">
            No se encontraron productos en esta categoría
          </div>
        </div>
      )}
    </div>
  )
}

export default Home