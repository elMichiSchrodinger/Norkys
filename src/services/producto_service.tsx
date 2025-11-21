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