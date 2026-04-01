import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET não configurada.");
    return new Response("Webhook secret não configurado", { status: 500 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Variáveis do Supabase admin não configuradas.");
    return new Response("Supabase admin não configurado", { status: 500 });
  }

  if (!signature) {
    return new Response("Assinatura do webhook ausente", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Erro ao validar assinatura do webhook:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        const plan = session?.metadata?.plan || null;
        const credits = Number(session?.metadata?.credits || 0);
        const userId = session?.metadata?.user_id || null;

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null;

        console.log("CHECKOUT CONCLUÍDO:", {
          sessionId: session.id,
          customerId: session.customer,
          customerEmail: session.customer_details?.email || null,
          mode: session.mode,
          paymentStatus: session.payment_status,
          plan,
          credits,
          userId,
          subscriptionId: session.subscription || null,
        });

        // Só adiciona créditos se for compra avulsa de créditos
if (session.mode === "payment" && credits > 0) {
  if (!userId) {
    console.error("Pagamento de créditos sem user_id no metadata.", {
      sessionId: session.id,
      plan,
      credits,
    });
    return new Response("user_id ausente no metadata", { status: 400 });
  }

  // 🔥 GARANTE PROFILE
  await supabaseAdmin
    .from("profiles")
    .upsert({
      id: userId,
      credits: 0,
    });

  // 🔥 ADICIONA CRÉDITOS
  const { error } = await supabaseAdmin.rpc(
    "add_credits_after_purchase",
    {
      p_user_id: userId,
      p_credits: credits,
      p_event_id: event.id,
      p_event_type: event.type,
      p_stripe_session_id: session.id,
      p_stripe_payment_intent_id: paymentIntentId,
    }
  );

  if (error) {
    console.error("Erro ao adicionar créditos no Supabase:", error);
    return new Response("Erro ao adicionar créditos", { status: 500 });
  }

  console.log("CRÉDITOS ADICIONADOS COM SUCESSO:", {
    userId,
    credits,
    sessionId: session.id,
    eventId: event.id,
  });
}

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;

        console.log("ASSINATURA ATUALIZADA:", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        console.log("ASSINATURA CANCELADA:", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });

        break;
      }

      default:
        console.log(`Evento recebido sem tratamento específico: ${event.type}`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response("Erro interno no webhook", { status: 500 });
  }
}