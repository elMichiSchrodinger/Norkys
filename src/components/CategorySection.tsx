// components/CategorySection.jsx
import { useEffect, useState } from 'react';
import { getProductosByCategoria } from '../services/producto_service';
import type { Producto } from '../models/producto'; // Descomenta si usas TS

const CategorySection = ({ categoryName }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                // Reutilizamos tu servicio pasando la categoría dinámica
                const data = await getProductosByCategoria(categoryName);
                setProductos(data);
            } catch (error) {
                console.error(`Error cargando ${categoryName}:`, error);
            } finally {
                setLoading(false);
            }
        };
        cargarProductos();
    }, [categoryName]);

    // Si no hay productos en esta categoría, no mostramos nada (evita secciones vacías)
    if (!loading && productos.length === 0) return null;

    return (
        // El ID es importante para que el menú de navegación sepa dónde bajar (scroll)
        <div id={categoryName.replace(/\s+/g, '-')} className='mb-12 mx-5 px-4 py-8 bg-white shadow-md hover:shadow-xl rounded-xl transition-all duration-300 border border-gray-100'>
            
            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase border-b pb-4 border-gray-200">
                {categoryName}
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12'>
                {productos.map((prod) => (
                    <div key={prod.productoid} className='flex flex-row gap-4 group'>
                        
                        {/* 1. Imagen */}
                        <div className='w-2/5 flex-shrink-0'>
                            <img 
                                src={'/img/' + prod.image_path} 
                                className='w-full h-auto object-contain rounded-lg aspect-square group-hover:scale-105 transition-transform duration-300' 
                                alt={prod.nombre} 
                            />
                        </div>

                        {/* 2. Información */}
                        <div className='w-3/5 flex flex-col justify-between'>
                            <div>
                                <h3 className='font-bold text-gray-900 text-sm uppercase leading-tight mb-2'>
                                    {prod.nombre}
                                </h3>
                                <p className='text-xs text-gray-600 leading-snug line-clamp-4 mb-3 uppercase font-medium'>
                                    {prod.descripcion}
                                </p>
                            </div>

                            <div className='mt-auto'>
                                <p className='font-bold text-gray-800 mb-2 text-base'>
                                    S/ {parseFloat(prod.precio).toFixed(2)}
                                </p>
                                <button className='w-full bg-green-600 hover:bg-green-700 text-yellow-300 font-bold py-1.5 px-4 rounded-full text-sm transition-colors shadow-sm'>
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySection;