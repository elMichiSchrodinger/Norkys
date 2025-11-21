import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
// Importamos la interfaz Profile desde tu archivo de modelos
import type { Profile } from '../models/Profile';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // Inicializamos el estado con el tipo Profile o null
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let mounted = true;

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

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user);
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Lógica de protección: Redirigir si faltan datos
    useEffect(() => {
        if (!loading && user && profile) {
            // Si faltan datos (teléfono o dirección) y NO estamos ya en la página de completar perfil
            if ((!profile.telefono || !profile.direccion) && location.pathname !== '/completar-perfil') {
                console.log("Faltan datos, redirigiendo...");
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
            
            if (error) throw error;

            if (data) {
                // Supabase devuelve 'any', así que lo forzamos al tipo Profile
                setProfile(data as Profile);
            } else {
                // SALVAVIDAS: Crear perfil si no existe (por si falló el trigger)
                const { data: newProfile, error: createError } = await supabase
                    .from('profile')
                    .insert([{
                        id: currentUser.id,
                        nombre: currentUser.user_metadata?.full_name || 'Usuario',
                        rol: 'usuario'
                    }])
                    .select()
                    .single();
                
                if (!createError && newProfile) {
                    setProfile(newProfile as Profile);
                }
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
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
                <div className="h-screen flex justify-center items-center">
                    <p className="text-gray-500">Cargando...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

// Hook personalizado
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};