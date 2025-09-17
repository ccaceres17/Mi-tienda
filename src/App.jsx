import { useState, useEffect } from "react";
import { CartProvider } from "./contexts/CartContext";
import Login from "./components/Login";  // ✅ Existe
import Home from "./Home";              // ✅ Existe

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      try {
        const savedSession = sessionStorage.getItem('userSession');
        if (savedSession === 'active') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(checkSession, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLogin = (loginStatus) => {
    if (loginStatus) {
      setIsLoggedIn(true);
      sessionStorage.setItem('userSession', 'active');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('userSession');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {isLoggedIn ? (
          <Home onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </CartProvider>
  );
}

export default App;