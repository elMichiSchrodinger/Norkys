import { supabase } from '../utils/supabase';
import type { CartItem } from '../models/cartItem';

export const createPedido = async (userId: string, cart: CartItem[], total: number) => {
    try {
        // 1. Crear la cabecera del PEDIDO
        const { data: pedidoData, error: pedidoError } = await supabase
            .from('pedido')
            .insert([
                { 
                    usuario_id: userId, 
                    montototal: total,
                    estado: 'pendiente' // Estado inicial
                }
            ])
            .select()
            .single();

        if (pedidoError) throw pedidoError;
        if (!pedidoData) throw new Error("No se pudo crear el pedido");

        const pedidoId = pedidoData.pedidoid;

        // 2. Preparar los detalles (productos del carrito)
        const detalles = cart.map(item => ({
            pedidoid: pedidoId,
            productoid: item.productoid,
            cantidad: item.cantidad,
            preciounitario: item.precio
        }));

        // 3. Insertar DETALLE_PEDIDO (todos de golpe)
        const { error: detalleError } = await supabase
            .from('detalle_pedido')
            .insert(detalles);

        if (detalleError) throw detalleError;

        return { success: true, pedidoId };

    } catch (error) {
        console.error("Error creando pedido:", error);
        return { success: false, error };
    }
};