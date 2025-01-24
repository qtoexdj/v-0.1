import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const { session } = useSession();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: async (url, options) => {
      const token = await session?.getToken();
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
      return fetch(url, options);
    },
  },
});

export async function createUserSaas(userData: {
  clerk_user_id: string;
  email: string;
  nombre: string;
  rol: string;
  inmobiliaria_id: string | null;
}) {
  const { data, error } = await supabase
    .from('usuarios_saas')
    .upsert({
      clerk_id: userData.clerk_user_id,
      email: userData.email,
      full_name: userData.nombre,
      role: userData.rol,
      inmobiliaria_id: userData.inmobiliaria_id,
      creado_en: new Date().toISOString()
    }, {
      onConflict: 'clerk_id'
    })
    .select('*');

  if (error) {
    console.error('Error en Supabase:', error.message);
    throw new Error('Error al sincronizar usuario con Supabase');
  }

  return data;
}