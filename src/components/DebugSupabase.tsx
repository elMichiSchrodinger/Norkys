import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const DebugSupabase = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    setLogs(prev => [...prev, `${icon} ${msg}`]);
  };

  useEffect(() => {
    const runTests = async () => {
      setLogs([]); // Limpiar logs
      addLog("Iniciando Diagnóstico...", 'info');

      // TEST 1: Verificar Conexión y Sesión
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        addLog(`Error Auth: ${authError.message}`, 'error');
        return;
      }

      if (!session) {
        addLog("Estado: No hay usuario logueado (Visitante)", 'info');
      } else {
        addLog(`Usuario: ${session.user.email}`, 'success');
        addLog(`ID Auth: ${session.user.id}`, 'info');

        // TEST 2: Verificar Tabla Profile (Solo si hay usuario)
        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

        if (profileError) {
            addLog(`Error leyendo Perfil: ${profileError.message}`, 'error');
            addLog(`POSIBLE CAUSA: Políticas RLS en tabla 'profile' mal configuradas.`, 'info');
        } else if (!profile) {
            addLog(`ALERTA: El usuario existe en Auth pero NO en la tabla 'profile'.`, 'error');
            addLog(`SOLUCIÓN: El trigger falló o no se ejecutó.`, 'info');
        } else {
            addLog(`Perfil cargado correctamente: ${profile.nombre}`, 'success');
        }
      }

      // TEST 3: Verificar Tabla Productos (Pública)
      const { data: productos, error: prodError } = await supabase
        .from('producto')
        .select('count')
        .limit(1);

      if (prodError) {
        addLog(`Error leyendo Productos: ${prodError.message}`, 'error');
        addLog(`POSIBLE CAUSA: Faltan políticas públicas en tabla 'producto'.`, 'info');
      } else {
        addLog(`Conexión a Productos OK`, 'success');
      }
    };

    runTests();
  }, []);

  if (!isOpen) return <button onClick={() => setIsOpen(true)} style={{position:'fixed', bottom: 10, right: 10, zIndex: 9999}}>🐞 Debug</button>;

  return (
    <div style={{ 
        position: 'fixed', bottom: 10, right: 10, 
        background: 'rgba(0,0,0,0.85)', color: 'white', 
        padding: '15px', borderRadius: '10px', zIndex: 9999, 
        width: '350px', fontFamily: 'monospace', fontSize: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
        <strong>🔍 Diagnóstico Supabase</strong>
        <button onClick={() => setIsOpen(false)} style={{cursor:'pointer'}}>✖</button>
      </div>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
        {logs.map((l, i) => (
            <div key={i} style={{marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '2px'}}>
                {l}
            </div>
        ))}
      </div>
    </div>
  );
};

export default DebugSupabase;