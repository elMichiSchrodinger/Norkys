import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import Productos from './pages/productos';
import Busqueda from './pages/busqueda';
import Login from './pages/login';
import Registro from './pages/registro';
import CompletarPerfil from './pages/completarPerfil';
// 1. Importar la nueva página
import ProductDetail from './pages/productDetail';

function App() {
  return (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Productos />} />
            <Route path="/busqueda/:query" element={<Busqueda />} />
            
            {/* 2. NUEVA RUTA PARA DETALLE DE PRODUCTO */}
            <Route path="/producto/:id" element={<ProductDetail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/completar-perfil" element={<CompletarPerfil />} />
        </Routes>
    </AuthProvider>
  );
}
export default App;