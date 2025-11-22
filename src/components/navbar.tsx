import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// 1. Importar el hook del carrito
import { useCart } from '../context/CartContext'; 

import menuBurger from '../assets/svg/menu-burger.svg';
import logo from '../assets/img/norkys_logo.png';
import lupa from '../assets/svg/lupa_buscador.svg';
import usuario from '../assets/svg/logo_usuario.svg';
import ShopCar from '../assets/svg/carrito_compras.svg?react';
import './navbar.css'; 

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const { user, profile, signOut } = useAuth();
    
    // 2. Obtener el número total de items del contexto del carrito
    const { totalItems } = useCart(); 
    
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/busqueda/${query}`); 
            setQuery(''); 
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        await signOut();
        toggleMenu(); 
    };

    const displayName = user && profile?.nombre 
        ? profile.nombre.split(' ')[0] 
        : 'Mi cuenta';

    return (
        <header>
            <nav className='bar-navegation flex flex-row items-center shadow-md justify-between px-5 relative z-30 bg-white'>
                <div className='flex flex-row justify-between items-center w-40'>
                    <button className='cursor-pointer' onClick={toggleMenu}>
                        <img src={menuBurger} className='bar-menu' alt="menú" />
                    </button>
                    
                    <Link to="/" className='cursor-pointer'>
                        <img src={logo} alt="logo" className='logo' />
                    </Link>
                </div>

                <form onSubmit={handleSearch} className='form-search flex flex-row items-center'>
                    <input 
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='¿Cuál es su antojo?'
                        className='search mr-6'
                    />
                    <button type="submit" aria-label='Buscar' className='input mr-1'>
                        <img src={lupa} alt="buscar" className='lupa size-6' />
                    </button>
                </form>

                <div className='flex flex-row justify-between items-center'>
                    <div className='user flex md:mr-10 font-bold font-sans items-center gap-2'>
                        <p className="truncate max-w-[100px]">{displayName}</p>
                        <img src={usuario} alt="usuario" className='size-8' />
                    </div>
                    
                    {/* 3. CARRITO DINÁMICO */}
                    <div 
                        className='shop-car flex flex-row justify-around items-center cursor-pointer hover:opacity-90 transition-opacity'
                        onClick={() => navigate('/carrito')} // Redirige al hacer clic
                    >
                        <ShopCar className='icon-car' />
                        {/* Si es mayor a 99 muestra 99+, si no muestra el número con 2 dígitos (01, 05, 10) */}
                        <p className='font-bold'>
                            {totalItems > 99 ? '99+' : totalItems.toString().padStart(2, '0')}
                        </p>
                    </div>
                </div>
            </nav>

            {/* --- OFFCANVAS SIMPLE --- */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 
                transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-700">Menú</h2>
                    <button onClick={toggleMenu} className="text-gray-500 hover:text-red-500 font-bold text-2xl focus:outline-none">&times;</button>
                </div>
                <div className="flex flex-col p-4 space-y-4 items-center">
                    <img src={logo} alt="" className='w-32 mb-4'/>
                    
                    <Link to="/" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Inicio</Link>
                    <Link to="/menu" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Nuestra Carta</Link>
                    
                    <div className='flex flex-col w-full gap-3 mt-4'>
                        {user ? (
                            <Link to='/' onClick={handleLogout} className='boton w-full text-center text-white py-2 rounded-full font-bold hover:bg-yellow-50 transition-colors'>Cerrar Sesión</Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className='boton w-full text-center text-white py-2 rounded-full font-bold hover:bg-yellow-50 transition-colors'>Ingresar</Link>
                                <Link to="/registro" onClick={toggleMenu} className='boton w-full text-center text-white py-2 rounded-full font-bold hover:bg-yellow-50 transition-colors'>Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {isMenuOpen && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={toggleMenu}></div>}
        </header>
    );
}
export default Navbar;