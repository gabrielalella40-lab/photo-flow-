"use client";

import {
  Sparkles,
  Wand2,
  ShieldCheck,
  Layers3,
  Workflow,
  Camera,
  ArrowRight,
  Star,
  CheckCircle2,
  Gauge,
  FolderKanban,
  Images,
  SlidersHorizontal,
  TimerReset,
  ScanLine,
  Orbit,
  ChevronRight,
  BadgeCheck,
  Zap,
  MoonStar,
  Crown,
  Lock,
  Gem,
  MonitorPlay,
  Quote,
  Check,
} from "lucide-react";

export default function PhotoFlowLandingDashboard() {
  const stats = [
    { label: "Fotos processadas", value: "+2.4M", hint: "em fluxos reais" },
    { label: "Tempo recuperado", value: "87%", hint: "menos edição repetitiva" },
    { label: "Entrega acelerada", value: "até 10x", hint: "mais agilidade no estúdio" },
    { label: "Fluxo simplificado", value: "3 etapas", hint: "sem bagunça no processo" },
  ];

  const trustPills = [
    "IA para fotografia",
    "Consistência em lote",
    "Menos retrabalho",
    "Fluxo profissional",
    "Feito para quem vive disso",
  ];

  const features = [
    {
      title: "Edição em lote com consistência de verdade",
      description:
        "Suba um volume grande de fotos e mantenha unidade visual do começo ao fim, sem aquela sensação de lote quebrado ou de edição improvisada.",
      badge: "Core AI",
      icon: Sparkles,
      glow: "from-cyan-400/30 via-sky-400/15 to-violet-500/25",
      iconColor: "text-cyan-100",
    },
    {
      title: "Ruído tratado com aparência natural",
      description:
        "A limpeza entra onde precisa, sem plastificar pele, sem destruir textura e sem deixar a imagem com cara de ferramenta agressiva.",
      badge: "Noise Control",
      icon: ShieldCheck,
      glow: "from-violet-400/30 via-fuchsia-400/15 to-cyan-500/25",
      iconColor: "text-violet-100",
    },
    {
      title: "Retoque leve, bonito e vendável",
      description:
        "Pequenas distrações podem ser suavizadas com discrição, preservando luz, atmosfera e a sensação premium do seu trabalho.",
      badge: "Refined",
      icon: Wand2,
      glow: "from-fuchsia-400/30 via-violet-400/15 to-cyan-500/20",
      iconColor: "text-fuchsia-100",
    },
    {
      title: "Padronização sem engessar seu estilo",
      description:
        "A IA ajuda a manter coerência entre as imagens sem apagar sua assinatura. Você ganha velocidade sem perder identidade.",
      badge: "Signature Feel",
      icon: Layers3,
      glow: "from-cyan-400/25 via-violet-500/15 to-fuchsia-500/25",
      iconColor: "text-cyan-100",
    },
    {
      title: "Fluxo claro, limpo e fácil de usar",
      description:
        "Upload, processamento, revisão e exportação em uma experiência visualmente forte, mas simples de entender desde o primeiro uso.",
      badge: "Fast UI",
      icon: Workflow,
      glow: "from-sky-400/30 via-cyan-400/15 to-violet-500/20",
      iconColor: "text-sky-100",
    },
    {
      title: "Pensado para rotina de fotógrafo",
      description:
        "Photo Flow não tenta impressionar só no visual. Ele foi desenhado para prazo, volume, revisão, entrega e valor percebido alto.",
      badge: "Pro Market",
      icon: Camera,
      glow: "from-violet-400/30 via-fuchsia-500/15 to-cyan-500/20",
      iconColor: "text-violet-100",
    },
  ];

  const workflow = [
    {
      step: "01",
      title: "Crie o projeto e envie seu lote",
      description:
        "Organize por cliente, ensaio, casamento ou evento e suba suas fotos em uma experiência rápida, bonita e sem poluição visual.",
      icon: FolderKanban,
    },
    {
      step: "02",
      title: "Defina a direção visual",
      description:
        "Escolha o estilo base do trabalho com poucos cliques para manter mais consistência ao longo do lote inteiro.",
      icon: SlidersHorizontal,
    },
    {
      step: "03",
      title: "A IA assume a parte pesada",
      description:
        "Correção, equilíbrio, redução de ruído e padronização entram em sequência para tirar você do operacional repetitivo.",
      icon: Orbit,
    },
    {
      step: "04",
      title: "Revise e exporte com mais leveza",
      description:
        "Você acompanha o progresso, aprova o resultado e segue para a entrega sem passar horas travada na mesma etapa.",
      icon: Images,
    },
  ];

  const projects = [
    {
      name: "Casamento • Marina & Lucas",
      photos: "1.284 fotos",
      status: "Processando",
      statusClass: "text-cyan-200 border-cyan-400/30 bg-cyan-400/10",
      progress: 76,
      eta: "8 min restantes",
      gradient: "from-cyan-400 via-violet-500 to-fuchsia-500",
    },
    {
      name: "Ensaio Feminino • Amanda",
      photos: "312 fotos",
      status: "Concluído",
      statusClass: "text-emerald-200 border-emerald-400/30 bg-emerald-400/10",
      progress: 100,
      eta: "finalizado",
      gradient: "from-emerald-400 via-cyan-400 to-violet-500",
    },
    {
      name: "Aniversário • Miguel 1 ano",
      photos: "648 fotos",
      status: "Aguardando revisão",
      statusClass: "text-fuchsia-200 border-fuchsia-400/30 bg-fuchsia-400/10",
      progress: 92,
      eta: "revisão final",
      gradient: "from-fuchsia-400 via-violet-500 to-cyan-400",
    },
  ];

  const gallery = [
    {
      title: "Natural",
      tag: "Leve e sofisticado",
      description: "Para retratos limpos, pele bonita e acabamento discreto.",
      icon: CheckCircle2,
    },
    {
      title: "Social",
      tag: "Mais presença",
      description: "Contraste elegante para eventos, festas e cobertura social.",
      icon: Gauge,
    },
    {
      title: "Premium",
      tag: "Valor percebido alto",
      description: "Um acabamento mais refinado para quem quer entrega superior.",
      icon: Star,
    },
    {
      title: "Noite",
      tag: "Baixa luz sob controle",
      description: "Feito para ISO alto, cenas difíceis e ruído mais pesado.",
      icon: MoonStar,
    },
  ];

  const testimonials = [
    {
      name: "Camila Rocha",
      role: "Fotógrafa de casamentos",
      quote:
        "O que me ganhou foi a sensação de controle com velocidade. Não parece que a ferramenta quer editar por mim. Ela só tira o peso da parte repetitiva.",
    },
    {
      name: "Thiago Martins",
      role: "Fotógrafo social",
      quote:
        "Pela primeira vez eu senti que estava usando um produto realmente premium para fotografia. Bonito, rápido e útil de verdade no dia a dia.",
    },
    {
      name: "Fernanda Alves",
      role: "Ensaios femininos e retratos",
      quote:
        "A consistência entre as fotos mudou minha revisão final. Hoje eu gasto muito menos energia alinhando cor, exposição e clima visual.",
    },
  ];

  const faqs = [
    {
      question: "O Photo Flow é para quem?",
      answer:
        "Para fotógrafos que trabalham com volume real e não querem continuar perdendo horas em tarefas repetitivas. Casamentos, eventos, ensaios, fotografia social e rotina comercial em geral.",
    },
    {
      question: "É complicado de aprender?",
      answer:
        "Não. A ideia aqui é reduzir atrito. O produto foi desenhado para parecer fluido desde o primeiro uso, sem menus cansativos e sem curva de aprendizado desnecessária.",
    },
    {
      question: "A IA substitui meu olhar?",
      answer:
        "Não. Ela acelera a base técnica, ajuda na consistência e devolve tempo. O gosto, a assinatura e a decisão criativa continuam sendo seus.",
    },
    {
      question: "Serve só para parecer bonito?",
      answer:
        "Não. A proposta é unir sensação de produto premium com utilidade real no fluxo de trabalho. Beleza sem performance não segura ninguém.",
    },
  ];

  const metrics = [
    { label: "Tempo médio", value: "6m 24s", icon: TimerReset },
    { label: "Lotes hoje", value: "12", icon: FolderKanban },
    { label: "Ruído tratado", value: "98%", icon: ScanLine },
    { label: "Exportações", value: "34", icon: Zap },
  ];

  const premiumPoints = [
    {
      icon: Crown,
      title: "Experiência premium desde o primeiro clique",
      text: "A sensação de valor começa no visual, mas se sustenta na fluidez da plataforma e no que ela entrega no fluxo real.",
    },
    {
      icon: Lock,
      title: "Ferramenta séria para rotina séria",
      text: "Não é brinquedo de IA com embalagem bonita. É uma plataforma pensada para quem trabalha com prazo, cliente e volume.",
    },
    {
      icon: Gem,
      title: "Mais tempo para fotografar e faturar",
      text: "Quando a parte pesada da edição deixa de travar sua semana, sobra espaço para atender mais, vender melhor e crescer com menos desgaste.",
    },
  ];

  const resultPills = [
    "Mais velocidade",
    "Mais padrão visual",
    "Menos retrabalho",
    "Menos desgaste",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040711] text-white selection:bg-cyan-400/20 selection:text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-[-10%] h-[440px] w-[440px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-20 right-[-8%] h-[520px] w-[520px] rounded-full bg-fuchsia-500/14 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[28%] h-[360px] w-[360px] rounded-full bg-violet-600/18 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_16%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.03),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.03),transparent_14%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,7,17,0.08),rgba(4,7,17,0.76))]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="group flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/35 via-violet-500/25 to-fuchsia-500/25 shadow-[0_0_30px_rgba(59,130,246,0.22)] transition duration-300 group-hover:scale-[1.03]">
              <span className="text-base font-bold tracking-wider text-cyan-100">PF</span>
              <div className="absolute inset-0 rounded-2xl bg-white/[0.04] opacity-0 transition duration-300 group-hover:opacity-100" />
            </div>

            <div>
              <div className="text-lg font-semibold tracking-[0.22em] text-white/95">
                PHOTO FLOW
              </div>
              <div className="text-[11px] uppercase tracking-[0.34em] text-white/40">
                Premium AI Workflow
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/66 md:flex">
            <a href="#beneficios" className="transition duration-200 hover:text-white">
              Benefícios
            </a>
            <a href="#como-funciona" className="transition duration-200 hover:text-white">
              Como funciona
            </a>
            <a href="#dashboard" className="transition duration-200 hover:text-white">
              Plataforma
            </a>
            <a href="#depoimentos" className="transition duration-200 hover:text-white">
              Depoimentos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/80 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white md:inline-flex"
            >
              Entrar
            </a>

            <a
              href="/pricing"
              className="group relative inline-flex overflow-hidden rounded-full border border-cyan-300/20 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.16)] transition duration-200 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-0 blur-xl transition duration-300 group-hover:opacity-60" />
              <span className="relative z-10 inline-flex items-center gap-2">
                Ver planos
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.10)]">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              Feito para fotógrafos que querem velocidade sem perder padrão
            </div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
              Menos tempo editando.
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Mais tempo fotografando e faturando.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
              Edite centenas de fotos em minutos, com consistência e padrão profissional.
              O <span className="font-semibold text-white">Photo Flow</span> entra para
              tirar o peso da parte repetitiva, acelerar sua entrega e devolver
              horas preciosas da sua rotina.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustPills.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/58 backdrop-blur-xl"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/pricing"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_0_50px_rgba(99,102,241,0.28)] transition duration-200 hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-0 blur-xl transition duration-300 group-hover:opacity-60" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  Ver planos e créditos
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>

              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white/90 backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Entrar na plataforma
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-white/48">
              <MonitorPlay className="h-4 w-4 text-cyan-300" />
              Plataforma pensada para fluxo real, não para parecer bonita só no anúncio
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.07] hover:shadow-[0_10px_40px_rgba(59,130,246,0.08)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />
                  <div className="text-3xl font-semibold tracking-[-0.05em] text-white">
                    {item.value}
                  </div>
                  <div className="mt-2 text-sm text-white/55">{item.label}</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                    {item.hint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[2.7rem] bg-gradient-to-r from-cyan-400/20 via-violet-500/10 to-fuchsia-500/20 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-4 shadow-[0_20px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="rounded-[1.7rem] border border-white/10 bg-[#09101f] p-4">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-white/45">Projeto ativo</div>
                    <div className="mt-1 text-lg font-medium text-white">
                      Wedding Batch • 1.284 arquivos
                    </div>
                  </div>
                  <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.15)]">
                    processamento premium
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>Pipeline do lote</span>
                      <span>76%</span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-white/10">
                      <div className="h-2.5 w-[76%] rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 shadow-[0_0_18px_rgba(34,211,238,0.18)]" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/55">
                      <div className="rounded-2xl bg-white/[0.03] p-3">
                        <div className="text-white/40">Selecionadas</div>
                        <div className="mt-1 text-xl font-semibold text-white">
                          842
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white/[0.03] p-3">
                        <div className="text-white/40">Ruído</div>
                        <div className="mt-1 text-xl font-semibold text-white">
                          Sob controle
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {gallery.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.05]"
                        >
                          <div className="relative h-28 bg-gradient-to-br from-cyan-500/30 via-violet-500/15 to-fuchsia-500/25">
                            <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-black/20 backdrop-blur-xl">
                              <Icon className="h-4.5 w-4.5 text-white" />
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="text-base font-medium text-white">
                              {item.title}
                            </div>
                            <div className="mt-1 text-sm text-cyan-200/75">
                              {item.tag}
                            </div>
                            <div className="mt-3 text-sm leading-6 text-white/48">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white/45">
                          Resultado no lote
                        </div>
                        <div className="mt-1 text-lg font-medium text-white">
                          Mais unidade visual, menos retrabalho na revisão
                        </div>
                      </div>
                      <div className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                        IA ativa
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resultPills.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/50">
                      O lote conversa melhor entre si, a revisão pesa menos e você
                      passa menos tempo corrigindo diferenças que nunca deveriam ter
                      saído tão distantes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="beneficios"
          className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16"
        >
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">
              Benefícios
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              O operacional fica mais leve. Sua entrega continua com cara de trabalho sério.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/62">
              Photo Flow foi desenhado para fazer sentido na rotina real de quem
              vive de fotografia. Menos atrito, menos retrabalho, mais clareza e
              mais tempo para o que realmente agrega valor.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07] hover:shadow-[0_14px_48px_rgba(34,211,238,0.08)]"
                >
                  <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-white/[0.03] blur-2xl transition duration-300 group-hover:scale-125" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-30" />

                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${feature.glow} shadow-[0_0_25px_rgba(34,211,238,0.1)] transition duration-300 group-hover:scale-110`}
                    >
                      <div className="absolute inset-[1px] rounded-2xl bg-[#0d1325]/85" />
                      <Icon className={`relative z-10 h-5 w-5 ${feature.iconColor}`} />
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/55">
                      {feature.badge}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-white/58">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-cyan-200/75">
                    <BadgeCheck className="h-4 w-4" />
                    feito para rotina profissional
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {premiumPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-7 text-white/58">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="como-funciona"
          className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-20"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
            <div className="text-sm uppercase tracking-[0.28em] text-fuchsia-200/80">
              Como funciona
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
              Um fluxo elegante, direto e muito mais inteligente.
            </h2>
            <p className="mt-4 text-white/60 leading-7">
              Você não deveria gastar energia tentando entender a plataforma antes
              de conseguir trabalhar. O produto precisa fazer sentido rápido.
            </p>

            <div className="mt-8 rounded-[1.7rem] border border-white/8 bg-[#0d1528] p-5">
              <div className="text-sm text-white/45">Resumo do processo</div>
              <div className="mt-3 text-lg font-medium text-white">
                Upload → IA → revisão → exportação
              </div>
              <p className="mt-3 text-sm leading-6 text-white/50">
                O peso técnico fica nos bastidores. Na sua frente, a experiência precisa ser clara.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {workflow.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="group flex items-start gap-5 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-white/18 hover:bg-white/[0.06]"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(139,92,246,0.25)]">
                    <span className="absolute inset-[1px] rounded-2xl bg-[#0c1222]" />
                    <Icon className="relative z-10 h-4.5 w-4.5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-lg font-medium text-white">
                        {item.title}
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                        Etapa {item.step}
                      </div>
                    </div>
                    <div className="mt-2 text-white/50 leading-7">
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="dashboard"
          className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20"
        >
          <div className="mb-10 max-w-3xl">
            <div className="text-sm uppercase tracking-[0.28em] text-violet-200/80">
              Plataforma
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Bonita o suficiente para impressionar. Clara o suficiente para não atrapalhar.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/62">
              O importante aparece primeiro: projetos, andamento, ações rápidas e
              o que precisa ser decidido. Sem ruído visual desnecessário.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="grid gap-4 lg:grid-cols-[270px_1fr]">
              <aside className="rounded-[1.6rem] border border-white/10 bg-[#0a1020] p-5">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/35 via-violet-500/25 to-fuchsia-500/25 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
                    <span className="font-semibold text-cyan-200">PF</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Photo Flow</div>
                    <div className="text-sm text-white/45">Painel principal</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {[
                    "Dashboard",
                    "Projetos",
                    "Processamento",
                    "Estilos",
                    "Exportações",
                    "Configurações",
                  ].map((item, idx) => (
                    <div
                      key={item}
                      className={`rounded-2xl border px-4 py-3 transition duration-200 ${
                        idx === 0
                          ? "border-cyan-300/20 bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20 text-white shadow-[0_0_22px_rgba(99,102,241,0.12)]"
                          : "border-transparent text-white/55 hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm text-white/45">Plano</div>
                  <div className="mt-1 text-lg font-medium text-white">
                    Pro Studio
                  </div>
                  <div className="mt-2 text-sm text-cyan-200/70">
                    IA em lote • exportação rápida • revisão premium
                  </div>
                  <a
                    href="/pricing"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/85 transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    Gerenciar plano
                  </a>
                </div>
              </aside>

              <div className="rounded-[1.6rem] border border-white/10 bg-[#0a1020] p-5">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-white/45">Bem-vinda de volta</div>
                    <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                      Seus projetos em andamento
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/pricing"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    >
                      Ver planos
                    </a>

                    <a
                      href="/dashboard"
                      className="group relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(99,102,241,0.25)] transition duration-200 hover:scale-[1.02]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-0 blur-xl transition duration-300 group-hover:opacity-50" />
                      <span className="relative z-10 inline-flex items-center gap-2">
                        Acessar dashboard
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white/45">Projetos recentes</div>
                        <div className="text-lg font-medium text-white">
                          Visão clara do que está acontecendo
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                        Atualizado agora
                      </div>
                    </div>

                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project.name}
                          className="rounded-3xl border border-white/8 bg-[#0d1528] p-4 transition duration-300 hover:border-white/15 hover:bg-[#111a30]"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="font-medium text-white">
                                {project.name}
                              </div>
                              <div className="mt-1 text-sm text-white/45">
                                {project.photos}
                              </div>
                            </div>
                            <div
                              className={`inline-flex rounded-full border px-3 py-1 text-xs ${project.statusClass}`}
                            >
                              {project.status}
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                              <span>Progresso</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-white/10">
                              <div
                                className={`h-2.5 rounded-full bg-gradient-to-r ${project.gradient}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="text-white/45">{project.eta}</div>
                            <button className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 transition duration-200 hover:bg-white/[0.08]">
                              Abrir projeto
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm text-white/45">Ação rápida</div>
                      <div className="mt-2 text-lg font-medium text-white">
                        Processar um novo lote
                      </div>
                      <div className="mt-4 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-violet-500/10 to-fuchsia-500/10 p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
                        <div className="text-sm text-white/55">Estilo selecionado</div>
                        <div className="mt-1 text-xl font-semibold text-white">
                          Premium Night
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/50">
                          Baixa luz, ruído difícil e resultado mais elegante para
                          quem quer entregar com presença visual.
                        </p>
                        <a
                          href="/upload"
                          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-4 py-3 font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.22)] transition duration-200 hover:scale-[1.01]"
                        >
                          Processar agora
                        </a>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm text-white/45">Métricas</div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {metrics.map((metric) => {
                          const Icon = metric.icon;
                          return (
                            <div
                              key={metric.label}
                              className="rounded-2xl bg-[#0d1528] p-4"
                            >
                              <div className="flex items-center gap-2 text-sm text-white/40">
                                <Icon className="h-4 w-4" />
                                {metric.label}
                              </div>
                              <div className="mt-2 text-xl font-semibold text-white">
                                {metric.value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-sm text-white/45">Resumo rápido</div>
                      <div className="mt-2 text-lg font-medium text-white">
                        Tudo mais leve de acompanhar
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/50">
                        O painel ajuda você a decidir rápido, agir rápido e não
                        perder energia com informação mal distribuída.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing-teaser"
          className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16"
        >
          <div className="rounded-[2.2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">
                  Planos e créditos
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                  Escolha o formato que combina com a sua fase e com o seu ritmo.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/62">
                  Seja para testar a plataforma, comprar créditos avulsos ou subir
                  para uma operação mais forte, o caminho até os planos está claro,
                  bonito e direto.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/pricing"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-7 py-4 text-base font-semibold text-slate-950 transition duration-200 hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-0 blur-xl transition duration-300 group-hover:opacity-50" />
                    <span className="relative z-10 inline-flex items-center gap-2">
                      Abrir página de planos
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>

                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/10"
                  >
                    Entrar na conta
                  </a>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                  <div className="text-sm text-white/45">Assinaturas</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    Pro e Black
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/52">
                    Para quem quer mais fôlego operacional, recorrência e uma
                    experiência mais completa dentro da plataforma.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                  <div className="text-sm text-white/45">Créditos avulsos</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    100 ou 300 créditos
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/52">
                    Ideal para testar, validar o fluxo e comprar conforme a sua demanda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="depoimentos"
          className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-18"
        >
          <div className="mb-10 max-w-3xl">
            <div className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">
              Depoimentos
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Quem usa sente o peso sair do processo.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/62">
              Produto bom não entrega só velocidade. Ele muda a forma como a
              rotina pesa no final da semana.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.07]"
              >
                <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-white/[0.03] blur-2xl" />
                <Quote className="mb-5 h-9 w-9 text-cyan-300/60" />
                <p className="leading-7 text-white/60">{item.quote}</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="mt-1 text-sm text-white/45">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            {faqs.map((item) => (
              <div
                key={item.question}
                className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 leading-7 text-white/58">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="cta"
          className="mx-auto max-w-7xl px-6 pb-24 pt-6 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-[2.3rem] border border-white/12 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(139,92,246,0.12),rgba(217,70,239,0.12))] px-8 py-12 shadow-[0_20px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:px-12 md:py-14">
            <div className="absolute -right-8 top-0 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-20 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="text-sm uppercase tracking-[0.28em] text-cyan-100/80">
                Photo Flow
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Menos horas presas no operacional. Mais energia no que realmente faz seu nome crescer.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/70">
                Se a sua rotina exige volume, prazo e padrão visual, o próximo
                passo é simples: entrar, escolher o plano certo e deixar a parte
                pesada com o sistema.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/pricing"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-7 py-4 text-base font-semibold text-slate-950 transition duration-200 hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 rounded-2xl bg-white" />
                  <span className="absolute inset-0 rounded-2xl bg-white opacity-0 blur-xl transition duration-300 group-hover:opacity-30" />
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Ver planos agora
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>

                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/10"
                >
                  Acessar plataforma
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  Fluxo em lote
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  Mais consistência
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  Menos retrabalho
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}