import { useState } from 'react';
import menuBurger from '../assets/svg/menu-burger.svg';
import logo from '../assets/img/norkys_logo.png';
import lupa from '../assets/svg/lupa_buscador.svg';
import usuario from '../assets/svg/logo_usuario.svg';
import ShopCar from '../assets/svg/carrito_compras.svg?react';
import './navbar.css'; 

const Navbar = () => {
    const [query, setQuery] = useState('');
    // Estado para abrir/cerrar el menú
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Buscando:', query);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            {/* Barra de navegación principal */}
            <nav className='bar-navegation flex flex-row items-center shadow-md justify-between px-5 relative z-30 bg-white'>
                <div className='flex flex-row justify-between items-center w-40'>
                    {/* 1. AQUI ponemos el onClick para abrir el menú */}
                    <button className='cursor-pointer' onClick={toggleMenu}>
                        <img src={menuBurger} className='bar-menu' alt="menú" />
                    </button>
                    <button className='cursor-pointer'>
                        <img src={logo} alt="logo" className='logo' />
                    </button>
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
                        &times; {/* La X para cerrar */}
                    </button>
                </div>

                {/* Lista de enlaces */}
                <div className="flex flex-col p-4 space-y-4">
                    <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Inicio</a>
                    <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Promociones</a>
                    <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Nuestra Carta</a>
                </div>
            </div>

        </header>
    );
}
export default Navbar;