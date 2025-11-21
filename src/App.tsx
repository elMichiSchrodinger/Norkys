import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // 1. IMPORTAR

import Home from './pages/home';
import Productos from './pages/productos';
import Busqueda from './pages/busqueda';
import ProductDetail from './pages/productDetail';
import Login from './pages/login';
import Registro from './pages/registro';
import CompletarPerfil from './pages/completarPerfil';
import CarritoPage from './pages/carritoPage'; // 2. Importaremos la nueva página

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* 3. ENVOLVER AQUI */}
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