import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Importamos las páginas (Asegúrate de que coincidan con los nombres de archivo reales)
import Home from './pages/home';
import Productos from './pages/productos';
import Busqueda from './pages/busqueda';
import ProductDetail from './pages/productDetail';
import Login from './pages/login';
import Registro from './pages/registro';
import CompletarPerfil from './pages/completarPerfil';
import CarritoPage from './pages/carritoPage';

// Importamos el Debugger para solucionar el problema de sesión
import DebugSupabase from './components/DebugSupabase';
localStorage.clear()

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        
        {/* Componente de Diagnóstico (Bórralo cuando ya todo funcione perfecto) */}
        {/*<DebugSupabase />*/}

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Productos />} />
            <Route path="/busqueda/:query" element={<Busqueda />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            
            {/* Nueva ruta del carrito */}
            <Route path="/carrito" element={<CarritoPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/completar-perfil" element={<CompletarPerfil />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;