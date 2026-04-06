import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let stripeInstance = null;

function getStripe() {
  if (stripeInstance) return stripeInstance;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não configurada.");
  }

  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeInstance;
}

function getBaseUrl(request) {
  const origin = request.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const baseUrl = (appUrl || origin || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );

  return baseUrl;
}

function getPlanConfig(plan) {
  switch (plan) {
    case "pro":
      return {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        mode: "subscription",
        credits: 0,
      };

    case "black":
      return {
        priceId: process.env.NEXT_PUBLIC_STRIPE_BLACK_PRICE_ID,
        mode: "subscription",
        credits: 0,
      };

    case "credito_100":
      return {
        priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITO_100_PRICE_ID,
        mode: "payment",
        credits: 100,
      };

    case "credito_300":
      return {
        priceId: process.env.NEXT_PUBLIC_STRIPE_CREDITO_300_PRICE_ID,
        mode: "payment",
        credits: 300,
      };

    default:
      return null;
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    route: "/api/checkout",
  });
}

export async function POST(request) {
  try {
    const stripe = getStripe();

    const body = await request.json();
    const plan = String(body?.plan || "").trim();
    const userId = String(body?.userId || "").trim();
    const userEmail = String(body?.userEmail || "").trim();

    const baseUrl = getBaseUrl(request);

    console.log("CHECKOUT BASE URL:", baseUrl);
    console.log("CHECKOUT ORIGIN:", request.headers.get("origin"));
    console.log("CHECKOUT APP URL ENV:", process.env.NEXT_PUBLIC_APP_URL);
    console.log("CHECKOUT PLAN:", plan);

    const planConfig = getPlanConfig(plan);

    if (!planConfig) {
      return Response.json(
        { error: `Plano inválido enviado para o checkout: ${plan}` },
        { status: 400 }
      );
    }

    const { priceId, mode, credits } = planConfig;

    if (!priceId) {
      return Response.json(
        { error: `Price ID não encontrado para o plano: ${plan}` },
        { status: 500 }
      );
    }

    if (!userId) {
      return Response.json(
        { error: "userId é obrigatório para checkout." },
        { status: 400 }
      );
    }

    const metadata = {
      plan,
      credits: String(credits || 0),
      user_id: userId,
      user_email: userEmail || "",
    };

    const sessionConfig = {
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata,
      success_url: `${baseUrl}/dashboard?success=true&plan=${encodeURIComponent(
        plan
      )}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled&plan=${encodeURIComponent(
        plan
      )}`,
      allow_promotion_codes: true,
    };

    if (userEmail) {
      sessionConfig.customer_email = userEmail;
    }

    if (mode === "subscription") {
      sessionConfig.subscription_data = {
        metadata,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    if (!session?.url) {
      return Response.json(
        { error: "Stripe não retornou a URL do checkout." },
        { status: 500 }
      );
    }

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    console.error("ERRO AO CRIAR CHECKOUT:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      raw: error?.raw,
    });

    return Response.json(
      {
        error: error?.message || "Erro interno ao criar sessão de checkout.",
      },
      { status: 500 }
    );
  }
}