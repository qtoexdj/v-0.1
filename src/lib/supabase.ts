// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 1. Solución para variables de entorno (error principal)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 2. Validación de variables obligatoria
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Corrección de errores en la función createUserSaas
export async function createUserSaas(userData: {
  clerk_user_id: string;
  email: string;
  nombre: string;
  rol: string;
  inmobiliaria_id: string | null; // Corregir typo: "immobiliaria" -> "inmobiliaria"
}) {
  const { data, error } = await supabase
    .from('usuarios_saas')
    .upsert(
      {
        clerk_id: userData.clerk_user_id,
        email: userData.email,
        full_name: userData.nombre,
        role: userData.rol,
        inmobiliaria_id: userData.inmobiliaria_id, // Nombre de columna consistente
        creado_en: new Date().toISOString() // Corregir toIS0String -> toISOString
      },
      { onConflict: 'clerk_id' }
    )
    .select('*');

  if (error) {
    console.error('Error en Supabase:', error.message);
    throw new Error('Error al sincronizar usuario con Supabase');
  }

  return data;
}