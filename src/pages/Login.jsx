// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.username || !formData.password) {
      setError('Por favor complete todos los campos')
      return
    }

    setLoading(true)

    const result = await login(formData.username, formData.password)

    setLoading(false)

    if (result.success) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Error al iniciar sesión')
    }
  }

  const fillDemoCredentials = () => {
    setFormData({
      username: 'johnd',
      password: 'm38rmF$'
    })
    setShowDemoCredentials(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="text-gray-600 mt-2">
          Accede a tu cuenta de FakeStore
        </p>
      </div>

      {/* Demo credentials banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">Cuenta de demostración</h3>
            <p className="text-sm text-blue-600 mt-1">
              Puedes usar las credenciales de prueba para explorar la aplicación
            </p>
            <button
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="text-sm text-blue-600 hover:text-blue-800 underline mt-2"
            >
              {showDemoCredentials ? 'Ocultar' : 'Ver credenciales'}
            </button>
            
            {showDemoCredentials && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Usuario:</strong> johnd<br />
                  <strong>Contraseña:</strong> m38rmF$
                </p>
                <button
                  onClick={fillDemoCredentials}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Usar estas credenciales
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu nombre de usuario"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="text-center">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">También puedes explorar sin registrarte</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Continuar como invitado
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login