import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validación básica
    if (!username.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setIsLoading(true);
    
    // Simulamos una llamada a API
    setTimeout(() => {
      if (username === "admin" && password === "1234") {
        onLogin(true);
      } else {
        setError("Usuario o contraseña incorrectos");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-3">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
        </div>
        
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Iniciando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}