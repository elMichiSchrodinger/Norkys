import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../services/producto_service';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        const fetchProducto = async () => {
            if (!id) return;
            try {
                const data = await getProductoById(id);
                setProducto(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    const handleIncrement = () => setCantidad(prev => prev + 1);
    const handleDecrement = () => {
        if (cantidad > 1) setCantidad(prev => prev - 1);
    };

    const handleAddToCart = () => {
        // Aquí iría la lógica real del carrito
        alert(`¡Agregado! ${cantidad} x ${producto.nombre}`);
        navigate('/menu');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-gray-500 font-bold text-xl animate-pulse">Cargando...</p>
            </div>
        );
    }

    if (!producto) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col justify-center items-center">
                    <p className="text-xl text-gray-600 mb-4">Producto no encontrado</p>
                    <button onClick={() => navigate('/menu')} className="text-red-600 font-bold underline">
                        Volver al menú
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="container mx-auto max-w-5xl">
                    <button 
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center text-gray-600 hover:text-red-600 font-bold transition-colors"
                    >
                        ← Volver a la carta
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                        {/* Imagen */}
                        <div className="w-full md:w-1/2 bg-gray-100 flex justify-center items-center p-8 relative">
                            <img 
                                src={'/img/' + producto.image_path} 
                                alt={producto.nombre} 
                                className="w-full h-auto max-h-[400px] object-contain hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                            />
                             <span className="absolute top-4 left-4 bg-yellow-400 text-red-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                                {producto.categoria}
                            </span>
                        </div>

                        {/* Datos */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase mb-4 leading-tight">
                                {producto.nombre}
                            </h1>
                            
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {producto.descripcion}
                            </p>

                            <div className="flex items-end gap-2 mb-8">
                                <span className="text-gray-400 font-bold mb-1">Precio Unitario:</span>
                                <span className="text-4xl font-black text-red-600">
                                    S/ {parseFloat(producto.precio).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-8">
                                <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden w-full sm:w-auto">
                                    <button onClick={handleDecrement} className="px-2 py-2 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold text-xl w-12 h-12 flex items-center justify-center">-</button>
                                    <span className="px-4 py-2 font-black text-xl text-gray-800 w-12 text-center bg-white">{cantidad}</span>
                                    <button onClick={handleIncrement} className="px-2 py-2 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold text-xl w-12 h-12 flex items-center justify-center">+</button>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full bg-green-600 hover:bg-green-700 text-yellow-300 text-lg font-black py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex-grow"
                                >
                                    AGREGAR S/ {(producto.precio * cantidad).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetail;