import { useState } from 'react';
// 1. IMPORTANTE: Importamos las herramientas de navegación
import { Link, useNavigate } from 'react-router-dom';

import menuBurger from '../assets/svg/menu-burger.svg';
import logo from '../assets/img/norkys_logo.png';
// import logo_actual from '../assets/img/logo_actual.jpg' // Descomenta si lo usas
import lupa from '../assets/svg/lupa_buscador.svg';
import usuario from '../assets/svg/logo_usuario.svg';
import ShopCar from '../assets/svg/carrito_compras.svg?react';
import './navbar.css'; 

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // 2. Inicializamos el hook de navegación
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // Solo buscamos si el usuario escribió algo y no son solo espacios
        if (query.trim()) {
            console.log('Redirigiendo a:', query);
            navigate(`/busqueda/${query}`); // <-- ESTO TE LLEVA A LA PÁGINA DE RESULTADOS
            setQuery(''); // Opcional: Limpia la barra después de buscar
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <nav className='bar-navegation flex flex-row items-center shadow-md justify-between px-5 relative z-30 bg-white'>
                <div className='flex flex-row justify-between items-center w-40'>
                    <button className='cursor-pointer' onClick={toggleMenu}>
                        <img src={menuBurger} className='bar-menu' alt="menú" />
                    </button>
                    
                    {/* Hacemos que el logo te lleve al inicio */}
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
                    <button
                        type="submit"
                        aria-label='Buscar'
                        className='input mr-1'
                    >
                        <img src={lupa} alt="buscar" className='lupa size-6' />
                    </button>
                </form>

                <div className='flex flex-row justify-between items-center'>
                    <div className='user flex md:mr-10 font-bold font-sans'>
                        <p>Mi cuenta</p>
                        <img src={usuario} alt="usuario" />
                    </div>
                    <div className='shop-car flex flex-row justify-around items-center'>
                        <ShopCar className='icon-car' />
                        <p className='font-bold'>01</p>
                    </div>
                </div>
            </nav>

            {/* --- OFFCANVAS SIMPLE --- */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 
                transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                
                {/* Cabecera del menú (Botón cerrar) */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-700">Menú</h2>
                    <button 
                        onClick={toggleMenu} 
                        className="text-gray-500 hover:text-red-500 font-bold text-2xl focus:outline-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Lista de enlaces */}
                <div className="flex flex-col p-4 space-y-4 items-center">
                    <img src={logo} alt="" className='w-32 mb-4'/>
                    
                    {/* Usamos Link en lugar de <a> para no recargar la página */}
                    <Link 
                        to="/" 
                        onClick={toggleMenu} // Cierra el menú al hacer clic
                        className="text-gray-700 hover:text-red-600 font-medium text-lg"
                    >
                        Inicio
                    </Link>
                    
                    <Link 
                        to="/menu" 
                        onClick={toggleMenu}
                        className="text-gray-700 hover:text-red-600 font-medium text-lg"
                    >
                        Nuestra Carta
                    </Link>

                    {/* Estos botones aún no tienen ruta, así que los dejo como botones */}
                    <div className='flex flex-col w-full gap-3 mt-4'>
                        <button className='boton w-full bg-red-600 text-white py-2 rounded-full font-bold hover:bg-red-700 transition-colors'>
                            Ingresar
                        </button>
                        <button className='boton w-full border border-red-600 text-red-600 py-2 rounded-full font-bold hover:bg-red-50 transition-colors'>
                            Registrarse
                        </button>
                    </div>
                </div>
            </div>

        </header>
    );
}
export default Navbar;