import { Webhook } from 'svix';
import { createServiceRoleSupabase } from '/Users/matiasburgos/Repositorios/v-0.1/src/lib/supabase/server';

export async function POST(req: Request) {
  const payload = await req.json();
  const eventType = payload.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, public_metadata } = payload.data;
    const email = email_addresses[0].email_address;
    const inmobiliaria_id = public_metadata.inmobiliaria_id;

    const supabase = createServiceRoleSupabase();

    const { error } = await supabase
      .from('usuarios_saas')
      .upsert({
        clerk_id: id,
        email,
        rol: public_metadata.rol,
        inmobiliaria_id,
        ultima_actualizacion: new Date().toISOString()
      });

    if (error) console.error('Error syncing user:', error);
  }

  return new Response('OK', { status: 200 });
}