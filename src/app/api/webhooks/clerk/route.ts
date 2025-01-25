import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: Request) {
  const payload = await req.json();
  const headerList = await headers();

  const svixId = headerList.get("svix-id");
  const svixSignature = headerList.get("svix-signature");
  const svixTimestamp = headerList.get("svix-timestamp");

  if (!svixId || !svixSignature || !svixTimestamp) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    const verifiedPayload = wh.verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    }) as any;

    const { id: clerk_id, public_metadata, email_addresses } = verifiedPayload.data;

    // Realizar upsert en Supabase
    const { error } = await supabase
      .from("usuarios_saas")
      .upsert(
        {
          clerk_id,
          rol: public_metadata?.rol || "member",
          inmobiliaria_id: public_metadata?.id_inmobiliaria || null,
          email: email_addresses[0]?.email_address,
          ultima_actualizacion: new Date().toISOString(),
        },
        { onConflict: "clerk_id" } // Actualizar si clerk_id ya existe
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}