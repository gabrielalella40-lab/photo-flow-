"use client";

import { supabase } from "../../lib/supabase/client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  FolderKanban,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Sparkles,
  Clock3,
  ArrowRight,
  LogOut,
  Filter,
  Wand2,
  BarChart3,
  Zap,
  ShieldCheck,
  Crown,
  CreditCard,
  SlidersHorizontal,
  Coins,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("USER LOGADO:", data.user);
console.log("AUTH ERROR:", error);

        if (error || !data.user) {
          router.replace("/login");
          return;
        }

        setUser(data.user);

const { data: profileData, error: profileError } = await supabase
 .from("profiles")
 .select("credits, plan, email")
 .eq("id", data.user.id)
 .single();

console.log("USER LOGADO:", data.user);
console.log("PROFILE DATA:", profileData);
console.log("PROFILE ERROR:", profileError);

if (profileError) {
  console.error("ERRO PROFILE:", profileError);
  setProfile({
    credits: 0,
    plan: "free",
    email: data.user.email || "",
  });
} else {
  setProfile({
    credits: profileData?.credits ?? 0,
    plan: profileData?.plan || "free",
    email: profileData?.email || data.user.email || "",
  });
}
      } catch (error) {
        console.error("Erro ao validar sessão:", error);
        router.replace("/login");
        return;
      } finally {
        setAuthChecking(false);
      }
    }

    checkUser();
  }, [router]);

  useEffect(() => {
    if (authChecking || !user) return;

    let isMounted = true;

    async function loadJobs() {
      try {
        setJobsLoading(true);
        setJobsError("");

        const res = await fetch("/api/jobs", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.details || data?.error || "Erro ao buscar projetos."
          );
        }

        if (!isMounted) return;
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (error) {
        if (!isMounted) return;
        setJobsError(
          error?.message || "Erro inesperado ao carregar os projetos."
        );
      } finally {
        if (isMounted) {
          setJobsLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
    };
  }, [authChecking, user]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      sessionStorage.removeItem("lastCompletedJobId");
      sessionStorage.removeItem("lastCompletedJob");
      router.replace("/login");
    }
  }

  function openResults(job) {
    if (!job?.id) return;
    sessionStorage.setItem("lastCompletedJobId", String(job.id));
    sessionStorage.removeItem("lastCompletedJob");
    router.push("/results");
  }

  function goToUpload() {
    router.push("/upload");
  }

  function goToResults() {
    router.push("/results");
  }

  function goToPricing() {
    router.push("/pricing");
  }

  function formatDate(dateString) {
    if (!dateString) return "-";

    try {
      return new Date(dateString).toLocaleString("pt-BR");
    } catch {
      return dateString;
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "queued":
        return "Na fila";
      case "processing":
        return "Processando";
      case "completed":
        return "Concluído";
      case "completed_with_errors":
        return "Concluído com erros";
      case "failed":
        return "Falhou";
      default:
        return status || "Desconhecido";
    }
  }

  function getStatusClasses(status) {
    switch (status) {
      case "completed":
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
      case "completed_with_errors":
        return "border-amber-400/30 bg-amber-400/10 text-amber-200";
      case "processing":
        return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
      case "failed":
        return "border-red-400/30 bg-red-400/10 text-red-200";
      case "queued":
        return "border-violet-400/30 bg-violet-400/10 text-violet-200";
      default:
        return "border-white/10 bg-white/[0.04] text-white/70";
    }
  }

  function getProgressGradient(status) {
    if (status === "completed") {
      return "from-emerald-400 via-cyan-400 to-violet-500";
    }

    if (status === "completed_with_errors") {
      return "from-amber-400 via-orange-400 to-fuchsia-500";
    }

    if (status === "failed") {
      return "from-red-400 via-orange-400 to-amber-400";
    }

    if (status === "queued") {
      return "from-violet-400 via-fuchsia-400 to-cyan-400";
    }

    return "from-cyan-400 via-violet-500 to-fuchsia-500";
  }

  function getPlanLabel(plan) {
    switch (plan) {
      case "black":
        return "Black";
      case "profissional":
        return "Profissional";
      case "pro":
        return "Pro";
      case "free":
      default:
        return "Free";
    }
  }

  function getPlanHeadline(plan) {
    switch (plan) {
      case "black":
        return "Black";
      case "profissional":
        return "Plano Profissional";
      case "pro":
        return "Plano Pro";
      case "free":
      default:
        return "Plano Free";
    }
  }

  function getCreditsMessage(credits) {
    if (credits <= 0) {
      return "Seus créditos acabaram. Recarregue para continuar editando sem parar.";
    }

    if (credits <= 20) {
      return "Seu saldo está baixo. Vale a pena garantir mais créditos antes do próximo lote.";
    }

    if (credits <= 100) {
      return "Você ainda tem saldo disponível para seguir com calma nos próximos envios.";
    }

    return "Seu saldo está saudável. Dá para seguir com mais tranquilidade nos próximos lotes.";
  }

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const processingJobs = jobs.filter((job) => job.status === "processing").length;
    const completedJobs = jobs.filter(
      (job) => job.status === "completed" || job.status === "completed_with_errors"
    ).length;
    const failedJobs = jobs.filter((job) => job.status === "failed").length;
    const totalPhotos = jobs.reduce((acc, job) => acc + (job.totalPhotos || 0), 0);
    const totalDonePhotos = jobs.reduce((acc, job) => acc + (job.donePhotos || 0), 0);

    return {
      totalJobs,
      processingJobs,
      completedJobs,
      failedJobs,
      totalPhotos,
      totalDonePhotos,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const projectName = job.projectName || "";
      const matchesSearch =
        !searchTerm || projectName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const recentJob = jobs[0] || null;
  const hasProcessingJob = jobs.some(
    (job) => job.status === "processing" || job.status === "queued"
  );

  const credits = profile?.credits ?? 0;
  const planLabel = getPlanLabel(profile?.plan);
  const planHeadline = getPlanHeadline(profile?.plan);
  const creditsMessage = getCreditsMessage(credits);
  const displayEmail = profile?.email || user?.email || "usuária";

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] px-8 py-7 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400" />
          <p className="text-white/80">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-[-8%] h-[420px] w-[420px] rounded-full bg-cyan-500/18 blur-3xl" />
        <div className="absolute top-24 right-[-6%] h-[460px] w-[460px] rounded-full bg-fuchsia-500/14 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[24%] h-[360px] w-[360px] rounded-full bg-violet-600/16 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,8,22,0.08),rgba(5,8,22,0.84))]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-white/[0.04] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/35 via-violet-500/25 to-fuchsia-500/25 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
              <span className="text-sm font-bold tracking-wider text-cyan-100">
                PF
              </span>
            </div>
            <div>
              <div className="text-lg font-semibold tracking-[0.2em] text-white/95">
                PHOTO FLOW
              </div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-white/42">
                Dashboard
              </div>
            </div>
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={goToUpload}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/82 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <Wand2 size={16} />
              Novo lote
            </button>

            <button
              onClick={handleLogout}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(99,102,241,0.22)] transition duration-200 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
              <span className="absolute inset-0 opacity-0 blur-xl transition duration-300 group-hover:opacity-50 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
              <span className="relative z-10 inline-flex items-center gap-2">
                <LogOut size={16} />
                Sair
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <section className="mb-8 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[2.1rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.1)]">
              <Sparkles size={15} />
              Painel principal da sua operação
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Bem-vinda de volta
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/62">
              Aqui você acompanha seus lotes, o andamento real do processamento e
              os resultados prontos para revisão, sem confusão e sem excesso de informação.
            </p>

            <div className="mt-6 rounded-[1.6rem] border border-white/8 bg-[#0d1528] p-5">
              <div className="text-sm text-white/42">Conta conectada</div>
              <div className="mt-2 text-lg font-semibold text-white break-all">
                {displayEmail}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200">
                  <ShieldCheck size={14} />
                  Sessão ativa
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200">
                  <Sparkles size={14} />
                  Sistema pronto
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200">
                  <Wallet size={14} />
                  {credits.toLocaleString("pt-BR")} crédito{credits !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={goToUpload}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_0_45px_rgba(99,102,241,0.28)] transition duration-200 hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                <span className="absolute inset-0 opacity-0 blur-xl transition duration-300 group-hover:opacity-60 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Zap size={18} />
                  Criar novo projeto
                </span>
              </button>

              <button
                onClick={goToResults}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 text-base font-semibold text-white/90 backdrop-blur-md transition duration-200 hover:border-white/25 hover:bg-white/[0.10] hover:text-white"
              >
                <BarChart3 size={18} />
                Ver resultados
              </button>
            </div>
          </motion.div>

          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
            >
              <div className="text-sm uppercase tracking-[0.26em] text-cyan-200/78">
                Plano e créditos
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {planHeadline}
              </div>
              <p className="mt-3 leading-7 text-white/58">
                {creditsMessage}
              </p>

              <div className="mt-6 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/42">Plano atual</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-white">
                      <Crown size={18} className="text-cyan-300" />
                      {planLabel}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-sm text-white/60">Créditos disponíveis</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-2xl font-bold text-cyan-200">
                      <Coins size={22} />
                      {credits.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/42">Gerenciar</div>
                  <button
                    onClick={goToPricing}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-white"
                  >
                    <CreditCard size={16} />
                    Ver planos e extras
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
            >
              <div className="text-sm uppercase tracking-[0.26em] text-fuchsia-200/78">
                Último projeto
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {recentJob?.projectName || "Sem projetos ainda"}
              </div>
              <p className="mt-3 leading-7 text-white/58">
                {recentJob
                  ? `Criado em ${formatDate(recentJob.createdAt)} e atualmente marcado como ${getStatusLabel(
                      recentJob.status
                    ).toLowerCase()}.`
                  : "Assim que você enviar seu primeiro lote, o resumo mais recente aparecerá aqui."}
              </p>

              {recentJob && (
                <button
                  onClick={() => openResults(recentJob)}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/82 transition duration-200 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                >
                  Abrir último resultado
                  <ArrowRight size={16} />
                </button>
              )}
            </motion.div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Projetos criados",
              value: stats.totalJobs,
              hint: "histórico total",
              icon: FolderKanban,
            },
            {
              label: "Em processamento",
              value: stats.processingJobs,
              hint: "jobs ativos",
              icon: RefreshCw,
            },
            {
              label: "Concluídos",
              value: stats.completedJobs,
              hint: "com saída pronta",
              icon: CheckCircle2,
            },
            {
              label: "Falhas",
              value: stats.failedJobs,
              hint: "exigem atenção",
              icon: AlertTriangle,
            },
            {
              label: "Fotos tratadas",
              value: stats.totalDonePhotos.toLocaleString("pt-BR"),
              hint: "finalizadas",
              icon: ImageIcon,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 * index }}
                className="group rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.07]"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-violet-500/15 to-fuchsia-500/20 text-cyan-200">
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-sm text-white/45">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                  {item.value}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                  {item.hint}
                </div>
              </motion.div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
          >
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.26em] text-violet-200/78">
                  Projetos recentes
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Histórico do sistema
                </div>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                {filteredJobs.length} resultado
                {filteredJobs.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  type="text"
                  placeholder="Buscar projeto pelo nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0d1528] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-[#0d1528] py-3 pl-11 pr-4 text-white outline-none transition focus:border-cyan-300/30"
                >
                  <option value="all">Todos os status</option>
                  <option value="queued">Na fila</option>
                  <option value="processing">Processando</option>
                  <option value="completed">Concluído</option>
                  <option value="completed_with_errors">Concluído com erros</option>
                  <option value="failed">Falhou</option>
                </select>
              </div>
            </div>

            {jobsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-[1.7rem] border border-white/8 bg-[#0d1528]/95 p-5"
                  >
                    <div className="h-5 w-56 rounded bg-white/10" />
                    <div className="mt-3 h-4 w-40 rounded bg-white/10" />
                    <div className="mt-5 h-2.5 w-full rounded bg-white/10" />
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="h-16 rounded-2xl bg-white/10" />
                      <div className="h-16 rounded-2xl bg-white/10" />
                      <div className="h-16 rounded-2xl bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsError ? (
              <div className="rounded-[1.7rem] border border-red-400/20 bg-red-500/10 p-6 text-red-200">
                {jobsError}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-[#0d1528]/95 p-10 text-center text-white/40">
                Nenhum projeto encontrado com esse filtro.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="rounded-[1.7rem] border border-white/8 bg-[#0d1528]/95 p-4 transition duration-300 hover:-translate-y-[2px] hover:border-white/15 hover:bg-[#101a31]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="truncate text-lg font-medium text-white">
                          {job.projectName}
                        </div>
                        <div className="mt-1 text-sm text-white/45">
                          {(job.totalPhotos || 0).toLocaleString("pt-BR")} foto
                          {(job.totalPhotos || 0) !== 1 ? "s" : ""} • criado em{" "}
                          {formatDate(job.createdAt)}
                        </div>
                      </div>

                      <div
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusClasses(
                          job.status
                        )}`}
                      >
                        {getStatusLabel(job.status)}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                        <span>Progresso do lote</span>
                        <span>{job.progress || 0}%</span>
                      </div>

                      <div className="h-2.5 rounded-full bg-white/10">
                        <div
                          className={`h-2.5 rounded-full bg-gradient-to-r ${getProgressGradient(
                            job.status
                          )} shadow-[0_0_18px_rgba(34,211,238,0.15)]`}
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/8 bg-[#0b1323] p-3">
                        <div className="text-xs text-white/40">Concluídas</div>
                        <div className="mt-1 text-lg font-semibold text-white">
                          {job.donePhotos || 0}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-[#0b1323] p-3">
                        <div className="text-xs text-white/40">Erros</div>
                        <div className="mt-1 text-lg font-semibold text-white">
                          {job.errorPhotos || 0}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-[#0b1323] p-3">
                        <div className="text-xs text-white/40">Finalizado em</div>
                        <div className="mt-1 truncate text-sm font-semibold text-white">
                          {job.finishedAt ? formatDate(job.finishedAt) : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => openResults(job)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 transition duration-200 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                      >
                        Abrir resultado
                        <ArrowRight size={14} />
                      </button>

                      <button
                        onClick={goToUpload}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75 transition duration-200 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                      >
                        Novo lote
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
            >
              <div className="text-sm uppercase tracking-[0.26em] text-cyan-200/78">
                Ações rápidas
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                O que você precisa fazer agora
              </div>
              <p className="mt-3 leading-7 text-white/58">
                Tudo importante em um bloco só: subir lote, acompanhar processamento, abrir resultados e ajustar seu plano.
              </p>

              <div className="mt-6 grid gap-3">
                <button
                  onClick={goToUpload}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-5 py-3 font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition duration-200 hover:scale-[1.01]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                  <span className="absolute inset-0 opacity-0 blur-xl transition duration-300 group-hover:opacity-50 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Zap size={16} />
                    Novo projeto
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!hasProcessingJob}
                    onClick={() => router.push("/processing")}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-medium transition duration-200 ${
                      hasProcessingJob
                        ? "border border-white/10 bg-white/[0.04] text-white/80 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                        : "cursor-not-allowed border border-white/8 bg-white/[0.02] text-white/35"
                    }`}
                  >
                    <Clock3 size={16} />
                    Processing
                  </button>

                  <button
                    onClick={goToResults}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium text-white/80 transition duration-200 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                  >
                    <BarChart3 size={16} />
                    Results
                  </button>
                </div>

                <button
                  onClick={goToPricing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium text-white/80 transition duration-200 hover:border-white/18 hover:bg-white/[0.08] hover:text-white"
                >
                  <SlidersHorizontal size={16} />
                  Ver planos e extras
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
            >
              <div className="text-sm uppercase tracking-[0.26em] text-violet-200/78">
                Resumo operacional
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Visão rápida do sistema
              </div>
              <div className="mt-6 rounded-[1.6rem] border border-white/8 bg-[#0d1528] p-4">
                <div className="flex items-center justify-between text-sm text-white/48">
                  <span>Pipeline operacional</span>
                  <span>{jobs.length ? "Ativo" : "Aguardando"}</span>
                </div>

                <div className="mt-3 h-2.5 rounded-full bg-white/10">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
                    style={{
                      width: `${
                        jobs.length
                          ? Math.min(100, Math.max(18, recentJob?.progress || 18))
                          : 18
                      }%`,
                    }}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#0b1323] p-4">
                    <div className="text-sm text-white/40">Fotos no sistema</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      {stats.totalPhotos.toLocaleString("pt-BR")}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#0b1323] p-4">
                    <div className="text-sm text-white/40">Último status</div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      {recentJob ? getStatusLabel(recentJob.status) : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-[#0b1323] p-4">
                  <div className="text-sm text-white/40">Seu saldo agora</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    {credits.toLocaleString("pt-BR")} crédito{credits !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}