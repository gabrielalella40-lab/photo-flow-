import Stripe from "stripe";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    route: "/api/checkout",
  });
}

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { plan, userId, userEmail } = await request.json();

    const origin = request.headers.get("origin");
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      origin ||
      "http://localhost:3000";

      console.log("CHECKOUT BASE URL:", baseUrl);
console.log("CHECKOUT ORIGIN:", origin);
console.log("CHECKOUT APP URL ENV:", process.env.NEXT_PUBLIC_APP_URL);
console.log("CHECKOUT PLAN:", plan);

    let priceId;
    let mode;
    let credits = 0;

    switch (plan) {
      case "pro":
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
        mode = "subscription";
        break;

      case "black":
        priceId = process.env.NEXT_PUBLIC_STRIPE_BLACK_PRICE_ID;
        mode = "subscription";
        break;

      case "credito_100":
        priceId = process.env.NEXT_PUBLIC_STRIPE_CREDITO_100_PRICE_ID;
        mode = "payment";
        credits = 100;
        break;

      case "credito_300":
        priceId = process.env.NEXT_PUBLIC_STRIPE_CREDITO_300_PRICE_ID;
        mode = "payment";
        credits = 300;
        break;

      default:
        return Response.json(
          { error: `Plano inválido enviado para o checkout: ${plan}` },
          { status: 400 }
        );
    }

    if (!priceId) {
      return Response.json(
        { error: `Price ID não encontrado para o plano: ${plan}` },
        { status: 500 }
      );
    }

    if (mode === "payment" && !userId) {
      return Response.json(
        { error: "userId é obrigatório para compra de créditos." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        plan: String(plan || ""),
        credits: String(credits || 0),
        user_id: String(userId || ""),
      },
      customer_email: userEmail || undefined,
success_url: `${baseUrl}/success?success=true&plan=${plan}`,
cancel_url: `${baseUrl}/pricing?checkout=cancelled&plan=${plan}`,
      allow_promotion_codes: true,
    });

    return Response.json({ url: session.url });
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