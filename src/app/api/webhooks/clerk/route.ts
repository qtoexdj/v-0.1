import { Webhook } from 'svix';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  };

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const user = evt.data;
    const publicMetadata = user.public_metadata || {};
    const role = publicMetadata.role || 'member';
    const inmobiliariaId = publicMetadata.inmobiliaria_id || null;

    const { data, error } = await supabase
      .from('usuarios_saas')
      .upsert({
        clerk_user_id: user.id,
        email: user.email_addresses[0]?.email_address || 'sin-email',
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        role: role,
        inmobiliaria_id: inmobiliariaId,
        creado_en: new Date().toISOString()
      }, { onConflict: 'clerk_user_id' })
      .select('*');

    if (error) {
      console.error('Error de Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Usuario actualizado en Supabase:', data);
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
}