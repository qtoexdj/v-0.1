import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ClerkEventData {
  id: string;
  public_metadata?: {
    rol?: string;
    id_inmobiliaria?: string;
  };
  email_addresses: Array<{ email_address: string }>;
}

interface ClerkWebhookEvent {
  data: ClerkEventData;
  type: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const payload = await req.text();
  // Obtener headers correctamente tipados
  const headerList = headers() as unknown as Headers;
  
  const svixHeaders = {
    'svix-id': headerList.get('svix-id'),
    'svix-signature': headerList.get('svix-signature'),
    'svix-timestamp': headerList.get('svix-timestamp')
  };

  if (!svixHeaders['svix-id'] || !svixHeaders['svix-signature'] || !svixHeaders['svix-timestamp']) {
    return NextResponse.json({ error: 'Encabezados requeridos faltantes' }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  try {
    const verifiedPayload = wh.verify(payload, svixHeaders) as ClerkWebhookEvent;
    
    if (!['user.created', 'user.updated'].includes(verifiedPayload.type)) {
      return NextResponse.json({ error: 'Tipo de evento no manejado' }, { status: 422 });
    }

    const { id: clerk_id, public_metadata, email_addresses } = verifiedPayload.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return NextResponse.json({ error: 'Email no encontrado' }, { status: 400 });
    }

    const { error } = await supabase
      .from('usuarios_saas')
      .upsert({
        clerk_id,
        rol: public_metadata?.rol || 'member',
        inmobiliaria_id: public_metadata?.id_inmobiliaria || null,
        email,
        ultima_actualizacion: new Date().toISOString()
      }, { onConflict: 'clerk_id' });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Error en webhook:', err);
    return NextResponse.json(
      { error: 'Firma de webhook inválida' },
      { status: 400 }
    );
  }
}