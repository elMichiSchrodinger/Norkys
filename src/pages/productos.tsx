// pages/Productos.jsx (o donde tengas este archivo)
import Navbar from '../components/Navbar'; // Asegura la ruta
import CategorySection from '../components/CategorySection'; // Asegura la ruta
import './producto.css';
import Footer from '../components/footer';

const Productos = () => {
    
    // Definimos las categorías en un array constante
    const categorias = [
        "Promoción",
        "Brasas",
        "Broaster",
        "Parrillas",
        "Menu",
        "Hamburguesas",
        "Piqueos",
        "Ensaladas",
        "Postres",
        "Bebidas",
        "Acompañamiento"
    ];

    // Función para hacer scroll suave al hacer click en el menú
    const scrollToCategory = (catName) => {
        const id = catName.replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            
            {/* MENÚ DE NAVEGACIÓN DE CATEGORÍAS (Sticky) */}
            {/* sticky top-0 hace que el menú se quede pegado arriba al bajar */}
            <div className="sticky top-0 z-20 bg-white shadow-sm py-4 overflow-x-auto">
                <ul className='flex flex-row gap-6 px-5 min-w-max whitespace-nowrap'>
                    {categorias.map((cat) => (
                        <li key={cat}>
                            <button 
                                onClick={() => scrollToCategory(cat)}
                                className="text-gray-600 hover:text-red-600 font-bold text-sm uppercase transition-colors cursor-pointer"
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* RENDERIZADO DE LAS SECCIONES */}
            <div className="container mx-auto mt-5">
                {categorias.map((cat) => (
                    <CategorySection key={cat} categoryName={cat} />
                ))}
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default Productos;