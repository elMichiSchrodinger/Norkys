import { supabase } from "../utils/supabase";
import type { Producto } from "../models/producto";

export const getAllProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from('producto')
    .select('*')
    .order('nombre', { ascending: true })

  if (error) throw error
  return (data as Producto[]) || []
}


export const getProductosByCategoria = async (categoria: string): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from('producto')
    .select('*')
    .eq('categoria', categoria)
    .order('nombre', { ascending: true })

  if (error) throw error
  return (data as Producto[]) || []
}

export const searchProductos = async (termino) => {
    // Si tienes una API real de búsqueda:
    // const response = await fetch(`T_URL/productos/buscar?q=${termino}`);
    // return await response.json();

    // SI NO TIENES API DE BÚSQUEDA, simulamos filtrando todo:
    const todos = await getAllProductos(); // Asumo que tienes una función que trae todo
    const terminoLower = termino.toLowerCase();
    
    return todos.filter(p => 
        p.nombre.toLowerCase().includes(terminoLower) || 
        p.descripcion.toLowerCase().includes(terminoLower)
    );
};