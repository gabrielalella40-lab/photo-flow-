"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/client";

type AuthState = "loading" | "authenticated" | "guest" | "error";

export default function HomePage() {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userEmail, setUserEmail] = useState("");
  const [progress, setProgress] = useState(18);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => [
      "Inicializando ambiente da plataforma",
      "Validando sessão do usuário",
      "Preparando navegação da experiência",
      "Ambiente pronto",
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const timers: NodeJS.Timeout[] = [];

    function pushTimer(timer: NodeJS.Timeout) {
      timers.push(timer);
    }

    pushTimer(
      setTimeout(() => {
        if (mounted) {
          setProgress(36);
          setCurrentStep(1);
        }
      }, 350)
    );

    pushTimer(
      setTimeout(() => {
        if (mounted) {
          setProgress(58);
          setCurrentStep(2);
        }
      }, 850)
    );

    async function resolveSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Erro ao verificar sessão:", error);
          setAuthState("error");
          setProgress(76);
          setCurrentStep(2);

          pushTimer(
            setTimeout(() => {
              if (mounted) {
                setProgress(100);
                setCurrentStep(3);
              }
            }, 300)
          );

          return;
        }

        if (session?.user) {
          setUserEmail(session.user.email || "");
          setAuthState("authenticated");
          setProgress(88);
          setCurrentStep(3);

          pushTimer(
            setTimeout(() => {
              if (mounted) {
                setProgress(100);
              }
            }, 250)
          );

          return;
        }

        setAuthState("guest");
        setProgress(88);
        setCurrentStep(3);

        pushTimer(
          setTimeout(() => {
            if (mounted) {
              setProgress(100);
            }
          }, 250)
        );
      } catch (error) {
        console.error("Erro inesperado ao verificar sessão:", error);

        if (!mounted) return;

        setAuthState("error");
        setProgress(82);
        setCurrentStep(3);

        pushTimer(
          setTimeout(() => {
            if (mounted) {
              setProgress(100);
            }
          }, 250)
        );
      }
    }

    resolveSession();

    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const badgeLabel = useMemo(() => {
    switch (authState) {
      case "authenticated":
        return "Sessão encontrada";
      case "guest":
        return "Modo visitante";
      case "error":
        return "Recuperando";
      default:
        return "Inicializando";
    }
  }, [authState]);

  const title = useMemo(() => {
    switch (authState) {
      case "authenticated":
        return "Seu ambiente está pronto";
      case "guest":
        return "A plataforma está pronta para você explorar";
      case "error":
        return "Ajustando o fluxo de entrada";
      default:
        return "Carregando o ecossistema Photo Flow";
    }
  }, [authState]);

  const description = useMemo(() => {
    switch (authState) {
      case "authenticated":
        return userEmail
          ? `Sessão ativa detectada para ${userEmail}. Seu ambiente já está validado e pronto para acesso.`
          : "Sessão ativa detectada. Seu ambiente já está validado e pronto para acesso.";
      case "guest":
        return "Nenhuma sessão ativa foi encontrada. Você pode explorar a landing ou entrar diretamente quando quiser.";
      case "error":
        return "Ocorreu uma instabilidade ao validar sua sessão. Mesmo assim, você pode seguir normalmente para a plataforma.";
      default:
        return "Validando autenticação, organizando a navegação e preparando uma entrada fluida na plataforma.";
    }
  }, [authState, userEmail]);

  const rightStatusTitle = useMemo(() => {
    switch (authState) {
      case "authenticated":
        return "Ambiente autenticado";
      case "guest":
        return "Modo visitante ativo";
      case "error":
        return "Navegação protegida";
      default:
        return "Ambiente sendo montado";
    }
  }, [authState]);

  const progressLabel = useMemo(() => `${progress}%`, [progress]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040816] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-140px] top-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-160px] top-[40px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[18%] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:70px_70px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-cyan-200">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              Photo Flow
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
              Fluxo inteligente para um
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                SaaS premium de fotografia
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
              O Photo Flow organiza uploads, dispara jobs, acompanha
              processamento e prepara a experiência do usuário com navegação
              profissional e ambiente orientado a performance.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Upload
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  Lotes organizados
                </div>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Fluxo otimizado para envio rápido e estrutura limpa de projeto.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                  IA
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  Processamento escalável
                </div>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Base pronta para automação, créditos e crescimento do produto.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                  SaaS
                </div>
                <div className="mt-3 text-lg font-semibold text-white">
                  Sessão segura
                </div>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Navegação inteligente para usuários logados e visitantes.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => router.replace("/landing")}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.08]"
              >
                Abrir landing
              </button>

              <button
                onClick={() => router.replace("/dashboard")}
                className="rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
              >
                Abrir dashboard
              </button>
            </div>
          </section>

          <section className="w-full">
            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm text-white/45">Estado do acesso</div>
                  <div className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white md:text-3xl">
                    {title}
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  {badgeLabel}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/60 md:text-base">
                {description}
              </p>

              <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-[#0b1324] p-5">
                <div className="flex items-center justify-between text-sm text-white/50">
                  <span>{rightStatusTitle}</span>
                  <span>{progressLabel}</span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {steps.map((step, index) => {
                    const isDone = index < currentStep;
                    const isActive = index === currentStep;

                    return (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            isDone
                              ? "bg-emerald-500/20 text-emerald-200"
                              : isActive
                              ? "bg-cyan-500/20 text-cyan-200"
                              : "bg-white/10 text-white/45"
                          }`}
                        >
                          {isDone ? "✓" : index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-medium ${
                              isActive || isDone ? "text-white" : "text-white/45"
                            }`}
                          >
                            {step}
                          </div>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                            isDone
                              ? "bg-emerald-500/15 text-emerald-200"
                              : isActive
                              ? "bg-cyan-500/15 text-cyan-200"
                              : "bg-white/10 text-white/45"
                          }`}
                        >
                          {isDone ? "Done" : isActive ? "Ativo" : "Pendente"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Roteamento
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    Navegação manual
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    A entrada não força mais nenhum destino. Você decide se quer
                    abrir a landing ou seguir direto para o dashboard.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Experiência
                  </div>
                  <div className="mt-3 text-lg font-semibold text-white">
                    Visual premium
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Tela de entrada forte, elegante e coerente com uma plataforma
                    SaaS profissional.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 p-5">
                <div className="text-sm font-medium text-white">
                  Photo Flow está pronto para crescer
                </div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Estrutura ideal para avançar com créditos, billing, persistência
                  completa e experiência premium para fotógrafos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}