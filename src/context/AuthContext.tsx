import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
// Importamos la interfaz Profile desde tu archivo de modelos
import type { Profile } from '../models/profile';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let mounted = true;

        // --- FUNCIÓN PRINCIPAL DE CARGA ---
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user);
                } else {
                    setUser(null);
                    setProfile(null);
                }
            } catch (error) {
                console.error("Error verificación sesión:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkUser();

        // --- SALVAVIDAS (CRUCIAL) ---
        // Si por alguna razón (internet lento, error de supabase) la carga no termina en 3 seg,
        // forzamos a que termine para mostrar la app y no una pantalla blanca.
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn("⚠️ Tiempo de carga excedido. Forzando apertura de la app.");
                setLoading(false);
            }
        }, 3000);

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user);
            } else {
                setUser(null);
                setProfile(null);
            }
            // Aseguramos quitar el loading al cambiar el estado de auth
            setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimer); // Limpiamos el timer al salir
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Redirección automática si faltan datos (Solo si ya cargó)
    useEffect(() => {
        if (!loading && user && profile) {
            if ((!profile.telefono || !profile.direccion) && location.pathname !== '/completar-perfil') {
                navigate('/completar-perfil');
            }
        }
    }, [user, profile, loading, location.pathname, navigate]);

    const fetchProfile = async (currentUser: User) => {
        try {
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle();
            
            if (data) {
                setProfile(data as Profile);
            } else if (!error) {
                // Crear perfil si no existe (Salvavidas por si falló el trigger)
                const { data: newProfile } = await supabase
                    .from('profile')
                    .insert([{
                        id: currentUser.id,
                        nombre: currentUser.user_metadata?.full_name || 'Usuario',
                        rol: 'usuario'
                    }])
                    .select()
                    .single();
                
                if (newProfile) setProfile(newProfile as Profile);
            }
        } catch (error) {
            console.error("Error perfil:", error);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, profile, signOut, loading }}>
            {loading ? (
                // Pantalla de carga elegante
                <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                    <p className="text-gray-500 font-semibold animate-pulse">Cargando Norky's...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};