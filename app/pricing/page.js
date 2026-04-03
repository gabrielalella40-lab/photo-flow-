"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Layers3,
  TimerReset,
  Workflow,
  Camera,
  Wand2,
  BadgeCheck,
} from "lucide-react";
import { supabase } from "../../lib/supabase/client";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  const plans = useMemo(
    () => [
      {
        id: "pro",
        type: "subscription",
        eyebrow: "Assinatura mensal",
        title: "Pro",
        subtitle:
          "Para fotógrafos que querem acelerar o lote, corrigir a base técnica com consistência e reduzir o tempo gasto nas etapas mais repetitivas da edição.",
        price: "R$ 219",
        suffix: "/mês",
        badge: "Mais escolhido",
        accent: "from-cyan-400/25 via-violet-500/20 to-fuchsia-500/20",
        buttonClass:
  "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950 hover:scale-[1.02]",
        limit: "Até 400 fotos por mês",
        model: "IA intermediária",
        idealFor:
          "Ideal para ensaios, eventos menores e rotina profissional com volume controlado",
        features: [
          "Ajuste inteligente de balanço de branco no lote",
          "Padronização de exposição, contraste e cor entre as fotos",
          "Redução de ruído com resultado equilibrado e natural",
          "Correção de base para agilizar a seleção e a revisão final",
          "Melhor consistência entre arquivos captados em luz variável",
          "Fluxo pensado para acelerar o trabalho sem perder controle visual",
        ],
        highlight:
          "O Pro foi pensado para resolver a parte técnica que mais consome tempo no lote e deixar sua revisão muito mais leve.",
      },
      {
        id: "black",
        type: "subscription",
        eyebrow: "Experiência premium",
        title: "Black",
        subtitle:
          "Para fotógrafos que trabalham com mais volume, querem um acabamento mais refinado e precisam de uma IA mais forte para lidar com correções delicadas no lote.",
        price: "R$ 347",
        suffix: "/mês",
        badge: "Premium",
        featured: true,
        accent: "from-cyan-400/30 via-violet-500/35 to-fuchsia-500/30",
        buttonClass:
          "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950 hover:scale-[1.02]",
        limit: "Até 900 fotos por mês",
        model: "IA premium",
        idealFor:
          "Ideal para casamentos, eventos intensos e fotógrafos que precisam de mais capacidade e acabamento",
        features: [
          "Balanço de branco e correção tonal com leitura mais refinada",
          "Padronização avançada de cor, contraste e temperatura no lote",
          "Redução de ruído mais forte para situações de ISO alto e baixa luz",
          "Suavização de pequenas manchas, marcas e distrações visuais leves",
          "Atenuação sutil de rugas, imperfeições discretas e detalhes que pesam na revisão",
          "Mais capacidade mensal para operar com liberdade em trabalhos maiores",
        ],
        highlight:
          "O Black entrega uma proposta mais forte de correção, acabamento e volume para quem precisa de mais segurança no resultado final.",
      },
    ],
    []
  );

  const creditBundles = useMemo(
    () => [
      {
        id: "credito_100",
        credits: "100 fotos extras",
        price: "R$ 49,90",
        description:
          "Perfeito para complementar seu mês, testar o fluxo ou resolver uma demanda pontual sem precisar mudar de plano.",
        features: [
          "Compra única",
          "Liberação automática após pagamento",
          "Ótimo para períodos de demanda pontual",
        ],
        tone: "from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20",
      },
      {
        id: "credito_300",
        credits: "300 fotos extras",
        price: "R$ 129,90",
        description:
          "A melhor opção para quem já está usando com frequência e quer ganhar capacidade extra sem travar a operação.",
        features: [
          "Mais margem para lotes maiores",
          "Melhor opção para demandas acima do previsto",
          "Pensado para quem não quer perder ritmo",
        ],
        tone: "from-fuchsia-400/20 via-violet-500/20 to-cyan-500/20",
      },
    ],
    []
  );

  async function handleCheckout(planId) {
    try {
      setError("");
      setLoadingPlan(planId);

    const {
  data: { session },
  error: authError,
} = await supabase.auth.getSession();

const user = session?.user;

console.log("USUARIO DO CHECKOUT:", user);

if (authError) {
  setError("Não foi possível validar seu login agora.");
  return;
}

if (!user?.id) {
  window.location.href = "/login";
  return;
}

const response = await fetch("/api/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    plan: planId,
    userId: user.id,
    userEmail: user.email,
  }),
});
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Não foi possível iniciar o checkout.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setError("O checkout não retornou uma URL válida.");
    } catch (err) {
      console.error(err);
      setError("Erro ao iniciar pagamento.");
    } finally {
      setLoadingPlan(null);
    }
  }

  const benefits = [
    {
      icon: Workflow,
      title: "Fluxo mais limpo",
      text: "Menos desgaste com tarefas repetitivas e mais clareza na rotina.",
    },
    {
      icon: TimerReset,
      title: "Mais tempo de volta",
      text: "A plataforma reduz o peso da parte técnica e acelera sua operação.",
    },
    {
      icon: Layers3,
      title: "Mais consistência",
      text: "As fotos do lote conversam melhor entre si e exigem menos correção manual.",
    },
    {
      icon: Camera,
      title: "Mais foco no que importa",
      text: "Você ganha espaço para acabamento, direção, atendimento e entrega.",
    },
    {
      icon: Wand2,
      title: "Mais valor percebido",
      text: "Uma ferramenta premium também eleva a percepção do seu processo.",
    },
    {
      icon: Zap,
      title: "Mais ritmo",
      text: "Quando a demanda aumenta, sua semana continua respirando.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040711] text-white selection:bg-cyan-400/20 selection:text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-[-10%] h-[440px] w-[440px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 right-[-8%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/14 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[28%] h-[360px] w-[360px] rounded-full bg-violet-600/18 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,7,17,0.08),rgba(4,7,17,0.85))]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/35 via-violet-500/25 to-fuchsia-500/25 shadow-[0_0_30px_rgba(59,130,246,0.22)]">
              <span className="text-base font-bold tracking-wider text-cyan-100">
                PF
              </span>
            </div>

            <div>
              <div className="text-lg font-semibold tracking-[0.22em] text-white/95">
                PHOTO FLOW
              </div>
              <div className="text-[11px] uppercase tracking-[0.34em] text-white/40">
                Pricing
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white md:inline-flex"
            >
              Voltar ao site
            </a>

            <a
              href="/dashboard"
              className="group relative inline-flex overflow-hidden rounded-full border border-cyan-300/20 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.16)] transition duration-200 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
              <span className="relative z-10 inline-flex items-center gap-2">
                Ir para dashboard
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.10)]">
              <Sparkles className="h-4 w-4" />
              Escolha o plano que acompanha o seu ritmo de produção
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
              Uma estrutura mais inteligente para editar em volume.
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Mais clareza no processo. Mais segurança na entrega.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/68 md:text-xl">
              Escolha entre uma assinatura mensal ou fotos extras para ampliar sua
              capacidade quando a demanda apertar. Tudo desenhado para funcionar
              na rotina real de quem trabalha com fotografia profissional.
            </p>
          </div>

          {error ? (
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.08)]">
              {error}
            </div>
          ) : null}
        </section>

        <section className="mx-auto max-w-7xl px-6 py-2 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative overflow-hidden rounded-[2rem] border p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 ${
                  plan.featured
                    ? "border-cyan-300/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] shadow-[0_20px_90px_rgba(70,85,255,0.16)]"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-r ${plan.accent} opacity-60 blur-3xl`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.28em] text-cyan-200/75">
                        {plan.eyebrow}
                      </div>
                      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
                        {plan.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-white/60 leading-7">
                        {plan.subtitle}
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                      {plan.badge}
                    </div>
                  </div>

                  <div className="mt-8 flex items-end gap-2">
                    <div className="text-5xl font-semibold tracking-[-0.06em] text-white">
                      {plan.price}
                    </div>
                    <div className="pb-2 text-white/45">{plan.suffix}</div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Volume mensal
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {plan.limit}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Tecnologia
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {plan.model}
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    {plan.highlight}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-cyan-200/75">
                    <BadgeCheck className="h-4 w-4" />
                    {plan.idealFor}
                  </div>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <div className="text-sm leading-6 text-white/76">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-base font-semibold transition duration-200 ${plan.buttonClass} disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_10px_30px_rgba(0,0,0,0.18)]`}
                  >
                    {loadingPlan === plan.id
                      ? "Abrindo checkout..."
                      : `Assinar ${plan.title}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <div className="text-sm uppercase tracking-[0.28em] text-violet-200/80">
              Fotos extras
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Mais capacidade quando o mês apertar.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/62">
              Nem todo mês vem igual. As fotos extras existem para manter sua
              operação fluindo sem precisar trocar de plano por causa de um pico
              de demanda.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {creditBundles.map((bundle) => (
              <div
                key={bundle.id}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/18"
              >
                <div
                  className={`absolute -right-12 top-0 h-36 w-36 rounded-full bg-gradient-to-r ${bundle.tone} blur-3xl`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.28em] text-fuchsia-200/75">
                        Compra única
                      </div>
                      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                        {bundle.credits}
                      </h3>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                      Extra
                    </div>
                  </div>

                  <div className="mt-8 text-5xl font-semibold tracking-[-0.06em] text-white">
                    {bundle.price}
                  </div>

                  <p className="mt-5 text-white/60 leading-7">
                    {bundle.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {bundle.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <div className="text-sm leading-6 text-white/76">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCheckout(bundle.id)}
                    disabled={loadingPlan === bundle.id}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-5 py-4 text-base font-semibold text-slate-950 transition duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  >
                    {loadingPlan === bundle.id
                      ? "Abrindo checkout..."
                      : "Comprar agora"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-2 lg:px-8">
          <div className="overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(34,211,238,0.10),rgba(139,92,246,0.10),rgba(217,70,239,0.10))] px-8 py-12 shadow-[0_20px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:px-12 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="text-sm uppercase tracking-[0.28em] text-cyan-100/80">
                  Vale a pena para quem?
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                  Para fotógrafos que querem parar de perder energia onde o processo já deveria estar resolvido.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/70">
                  Se a sua rotina envolve volume, prazo, revisão e consistência,
                  esse é o tipo de ferramenta que devolve tempo e deixa sua
                  operação muito mais respirável.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-slate-950 transition duration-200 hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  >
                    Ir para dashboard
                  </a>

                  <a
                    href="/upload"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/10"
                  >
                    Começar upload
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                {benefits.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-lg font-medium text-white">
                            {item.title}
                          </div>
                          <div className="mt-1 text-white/58 leading-7">
                            {item.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}