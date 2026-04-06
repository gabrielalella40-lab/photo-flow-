import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let stripeInstance = null;
let supabaseAdminInstance = null;

function getStripe() {
  if (stripeInstance) return stripeInstance;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não configurada.");
  }

  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeInstance;
}

function getWebhookSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET não configurada.");
  }

  return process.env.STRIPE_WEBHOOK_SECRET;
}

function getSupabaseAdmin() {
  if (supabaseAdminInstance) return supabaseAdminInstance;

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceRoleKey);
  return supabaseAdminInstance;
}

function normalizePlan(plan) {
  if (!plan) return "free";

  const safePlan = String(plan).toLowerCase().trim();

  if (safePlan === "black") return "black";
  if (safePlan === "pro" || safePlan === "profissional") return "pro";

  return "free";
}

/**
 * Garante que o profile exista.
 */
async function ensureProfile(userId, email = null) {
  const supabaseAdmin = getSupabaseAdmin();

  const payload = {
    id: userId,
    updated_at: new Date().toISOString(),
  };

  if (email) {
    payload.email = email;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(`Erro ao garantir profile: ${error.message}`);
  }
}

/**
 * Atualiza plano e IDs Stripe do usuário.
 */
async function updateUserPlan({
  userId,
  plan,
  subscriptionId = null,
  customerId = null,
}) {
  const supabaseAdmin = getSupabaseAdmin();

  const payload = {
    plan: normalizePlan(plan),
    updated_at: new Date().toISOString(),
  };

  if (subscriptionId !== null) {
    payload.stripe_subscription_id = subscriptionId;
  }

  if (customerId !== null) {
    payload.stripe_customer_id = customerId;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(payload)
    .eq("id", userId);

  if (error) {
    throw new Error(`Erro ao atualizar plano: ${error.message}`);
  }
}

/**
 * Busca profile pelo stripe_customer_id.
 */
async function getProfileByCustomerId(customerId) {
  if (!customerId) return null;

  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, plan, stripe_customer_id, stripe_subscription_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar profile por customerId: ${error.message}`);
  }

  return data || null;
}

/**
 * Busca profile pelo stripe_subscription_id.
 */
async function getProfileBySubscriptionId(subscriptionId) {
  if (!subscriptionId) return null;

  const supabaseAdmin = getSupabaseAdmin();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, plan, stripe_customer_id, stripe_subscription_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Erro ao buscar profile por subscriptionId: ${error.message}`
    );
  }

  return data || null;
}

/**
 * Compra avulsa de créditos.
 * Requer a função RPC add_credits_after_purchase já existente no banco.
 */
async function addCredits({
  userId,
  credits,
  eventId,
  eventType,
  stripeSessionId,
  stripePaymentIntentId = null,
}) {
  const supabaseAdmin = getSupabaseAdmin();

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

/**
 * Descobre qual plano foi comprado.
 * Primeiro tenta metadata.plan.
 * Se não houver, tenta pelo price id.
 */
function getPlanFromSession(session) {
  const metadataPlan = normalizePlan(session?.metadata?.plan);

  if (metadataPlan === "pro" || metadataPlan === "black") {
    return metadataPlan;
  }

  const lineItemPriceId = session?.line_items?.data?.[0]?.price?.id || null;

  if (
    lineItemPriceId &&
    lineItemPriceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
  ) {
    return "pro";
  }

  if (
    lineItemPriceId &&
    lineItemPriceId === process.env.NEXT_PUBLIC_STRIPE_BLACK_PRICE_ID
  ) {
    return "black";
  }

  return null;
}

/**
 * Descobre o plano real a partir da assinatura da Stripe.
 */
function resolvePlanFromSubscription(subscription) {
  const status = subscription?.status;

  if (status !== "active" && status !== "trialing") {
    return "free";
  }

  const subscriptionPriceId =
    subscription?.items?.data?.[0]?.price?.id || null;

  if (
    subscriptionPriceId &&
    subscriptionPriceId === process.env.NEXT_PUBLIC_STRIPE_BLACK_PRICE_ID
  ) {
    return "black";
  }

  if (
    subscriptionPriceId &&
    subscriptionPriceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
  ) {
    return "pro";
  }

  const metadataPlan = normalizePlan(subscription?.metadata?.plan);

  if (metadataPlan === "black") return "black";
  if (metadataPlan === "pro") return "pro";

  return "free";
}

/**
 * Busca sessão completa com line_items.
 */
async function getExpandedCheckoutSession(sessionId) {
  const stripe = getStripe();

  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "subscription"],
  });
}

/**
 * Resolve userId da sessão com fallback por customer/subscription.
 */
async function resolveUserIdFromSession(session) {
  const metadataUserId = session?.metadata?.user_id || null;
  if (metadataUserId) return metadataUserId;

  const customerId =
    typeof session?.customer === "string"
      ? session.customer
      : session?.customer?.id || null;

  const subscriptionId =
    typeof session?.subscription === "string"
      ? session.subscription
      : session?.subscription?.id || null;

  const profileBySubscription = await getProfileBySubscriptionId(subscriptionId);
  if (profileBySubscription?.id) return profileBySubscription.id;

  const profileByCustomer = await getProfileByCustomerId(customerId);
  if (profileByCustomer?.id) return profileByCustomer.id;

  return null;
}

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Assinatura do webhook ausente", { status: 400 });
  }

  const body = await request.text();

  let event;

  try {
    const stripe = getStripe();
    const webhookSecret = getWebhookSecret();

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Erro ao validar assinatura do webhook:", error?.message);
    return new Response(`Webhook Error: ${error?.message}`, { status: 400 });
  }

  try {
    const stripe = getStripe();

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        let session = event.data.object;

        if (session?.id) {
          session = await getExpandedCheckoutSession(session.id);
        }

        const plan = getPlanFromSession(session);
        const credits = Number(session?.metadata?.credits || 0);

        const customerEmail =
          session?.customer_details?.email ||
          session?.customer_email ||
          null;

        const customerId =
          typeof session?.customer === "string"
            ? session.customer
            : session?.customer?.id || null;

        const subscriptionId =
          typeof session?.subscription === "string"
            ? session.subscription
            : session?.subscription?.id || null;

        const paymentIntentId =
          typeof session?.payment_intent === "string"
            ? session.payment_intent
            : session?.payment_intent?.id || null;

        const userId = await resolveUserIdFromSession(session);

        console.log("CHECKOUT CONCLUÍDO:", {
          eventId: event.id,
          sessionId: session?.id,
          mode: session?.mode,
          paymentStatus: session?.payment_status,
          plan,
          credits,
          userId,
          customerId,
          subscriptionId,
          paymentIntentId,
          customerEmail,
        });

        if (!userId) {
          console.error("user_id ausente e não foi possível resolver o usuário.", {
            eventId: event.id,
            sessionId: session?.id,
            customerId,
            subscriptionId,
          });
          return new Response("user_id ausente no metadata", { status: 400 });
        }

        await ensureProfile(userId, customerEmail);

        if (session?.mode === "payment" && credits > 0) {
          await addCredits({
            userId,
            credits,
            eventId: event.id,
            eventType: event.type,
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
          });

          if (customerId) {
            await updateUserPlan({
              userId,
              plan: "free",
              customerId,
            });
          }

          console.log("CRÉDITOS ADICIONADOS:", {
            userId,
            credits,
            sessionId: session.id,
          });
        }

        if (
          session?.mode === "subscription" &&
          (plan === "pro" || plan === "black")
        ) {
          await updateUserPlan({
            userId,
            plan,
            subscriptionId,
            customerId,
          });

          console.log("PLANO LIBERADO NO CHECKOUT:", {
            userId,
            plan,
            subscriptionId,
            customerId,
          });
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object;

        const subscriptionId = subscription?.id || null;

        const customerId =
          typeof subscription?.customer === "string"
            ? subscription.customer
            : subscription?.customer?.id || null;

        const status = subscription?.status || "unknown";

        const profile =
          (await getProfileBySubscriptionId(subscriptionId)) ||
          (await getProfileByCustomerId(customerId));

        if (!profile) {
          console.warn("Nenhum profile encontrado para subscription/customer.", {
            subscriptionId,
            customerId,
            status,
          });
          break;
        }

        const newPlan = resolvePlanFromSubscription(subscription);

        await updateUserPlan({
          userId: profile.id,
          plan: newPlan,
          subscriptionId,
          customerId,
        });

        console.log("ASSINATURA SINCRONIZADA:", {
          userId: profile.id,
          oldPlan: profile.plan,
          newPlan,
          status,
          subscriptionId,
          customerId,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const subscriptionId = subscription?.id || null;

        const customerId =
          typeof subscription?.customer === "string"
            ? subscription.customer
            : subscription?.customer?.id || null;

        const profile =
          (await getProfileBySubscriptionId(subscriptionId)) ||
          (await getProfileByCustomerId(customerId));

        if (!profile) {
          console.warn("Profile não encontrado para assinatura cancelada.", {
            subscriptionId,
            customerId,
          });
          break;
        }

        await updateUserPlan({
          userId: profile.id,
          plan: "free",
          subscriptionId: null,
          customerId,
        });

        console.log("PLANO REBAIXADO PARA FREE:", {
          userId: profile.id,
          subscriptionId,
          customerId,
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