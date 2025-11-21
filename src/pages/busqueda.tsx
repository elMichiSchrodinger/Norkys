// pages/Busqueda.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import { searchProductos } from '../services/producto_service';

const Busqueda = () => {
    const { query } = useParams(); // Captura lo que viene en la URL (ej: "pollo")
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const realizarBusqueda = async () => {
            setLoading(true);
            try {
                const data = await searchProductos(query);
                setResultados(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            realizarBusqueda();
        }
    }, [query]); // Se ejecuta cada vez que cambia la búsqueda

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">
                    Resultados para: <span className="text-red-600">"{query}"</span>
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500">Buscando...</p>
                ) : resultados.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-600">No encontramos productos que coincidan.</p>
                        <p className="text-gray-400 mt-2">Intenta con "Pollo", "Papas" o "Ensalada".</p>
                    </div>
                ) : (
                    // Reutilizamos TU MISMO DISEÑO DE GRID
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12'>
                        {resultados.map((prod) => (
                            <div key={prod.productoid} className='flex flex-row gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100'>
                                <div className='w-2/5 flex-shrink-0'>
                                    <img 
                                        src={'/img/' + prod.image_path} 
                                        className='w-full h-auto object-contain rounded-lg aspect-square' 
                                        alt={prod.nombre} 
                                    />
                                </div>
                                <div className='w-3/5 flex flex-col justify-between'>
                                    <div>
                                        <h3 className='font-bold text-gray-900 text-sm uppercase leading-tight mb-2'>
                                            {prod.nombre}
                                        </h3>
                                        <p className='text-xs text-gray-600 leading-snug line-clamp-3 mb-3 uppercase font-medium'>
                                            {prod.descripcion}
                                        </p>
                                    </div>
                                    <div className='mt-auto'>
                                        <p className='font-bold text-gray-800 mb-2 text-base'>
                                            S/ {parseFloat(prod.precio).toFixed(2)}
                                        </p>
                                        <button className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-full text-sm transition-colors'>
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Busqueda;