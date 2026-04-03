import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const stripe = new Stripe(stripeSecretKey);

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function ensureProfile(userId, email = null) {
  const payload = {
    id: userId,
  };

  if (email) {
    payload.email = email;
  }

  const { error } = await supabaseAdmin.from("profiles").upsert(payload);

  if (error) {
    throw new Error(`Erro ao garantir profile: ${error.message}`);
  }
}

async function updateUserPlan({ userId, plan, subscriptionId = null, customerId = null }) {
  const updatePayload = {
    plan,
    updated_at: new Date().toISOString(),
  };

  if (subscriptionId) {
    updatePayload.stripe_subscription_id = subscriptionId;
  }

  if (customerId) {
    updatePayload.stripe_customer_id = customerId;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId);

  if (error) {
    throw new Error(`Erro ao atualizar plano: ${error.message}`);
  }
}

async function addCredits({
  userId,
  credits,
  eventId,
  eventType,
  stripeSessionId,
  stripePaymentIntentId = null,
}) {
  const { error } = await supabaseAdmin.rpc("add_credits_after_purchase", {
    p_user_id: userId,
    p_credits: credits,
    p_event_id: eventId,
    p_event_type: eventType,
    p_stripe_session_id: stripeSessionId,
    p_stripe_payment_intent_id: stripePaymentIntentId,
  });

  if (error) {
    throw new Error(`Erro ao adicionar créditos: ${error.message}`);
  }
}

export async function POST(request) {
  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY não configurada.");
    return new Response("STRIPE_SECRET_KEY não configurada", { status: 500 });
  }

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET não configurada.");
    return new Response("STRIPE_WEBHOOK_SECRET não configurada", { status: 500 });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Variáveis do Supabase admin não configuradas.");
    return new Response("Supabase admin não configurado", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Assinatura do webhook ausente", { status: 400 });
  }

  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
        const customerEmail =
          session?.customer_details?.email ||
          session?.customer_email ||
          null;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id || null;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id || null;

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null;

        console.log("CHECKOUT CONCLUÍDO:", {
          eventId: event.id,
          sessionId: session.id,
          customerId,
          customerEmail,
          mode: session.mode,
          paymentStatus: session.payment_status,
          plan,
          credits,
          userId,
          subscriptionId,
          paymentIntentId,
        });

        if (!userId) {
          console.error("user_id ausente no metadata.", {
            eventId: event.id,
            sessionId: session.id,
            plan,
            credits,
          });
          return new Response("user_id ausente no metadata", { status: 400 });
        }

        await ensureProfile(userId, customerEmail);

        // COMPRA AVULSA DE CRÉDITOS
        if (session.mode === "payment" && credits > 0) {
          await addCredits({
            userId,
            credits,
            eventId: event.id,
            eventType: event.type,
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
          });

          console.log("CRÉDITOS ADICIONADOS COM SUCESSO:", {
            userId,
            credits,
            sessionId: session.id,
            eventId: event.id,
          });
        }

        // ASSINATURA / PLANO
if (
  session.mode === "subscription" &&
  (plan === "pro" || plan === "black")
) {
          await updateUserPlan({
            userId,
            plan,
            subscriptionId,
            customerId,
          });

          console.log("PLANO ATUALIZADO COM SUCESSO:", {
            userId,
            plan,
            subscriptionId,
            customerId,
          });
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id || null;

        console.log("ASSINATURA ATUALIZADA:", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id || null;

        console.log("ASSINATURA CANCELADA:", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId,
        });

        // Se quiser, futuramente podemos localizar o profile pelo stripe_customer_id
        // e voltar o plano para "free". Por enquanto só estamos registrando.
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