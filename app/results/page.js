"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Download,
  LayoutDashboard,
  Wand2,
  Image as ImageIcon,
  FolderKanban,
  Sparkles,
  Clock3,
} from "lucide-react";

const RESULT_KEY = "lastCompletedJob";
const RESULT_ID_KEY = "lastCompletedJobId";

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString) {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toLocaleString("pt-BR");
  } catch {
    return dateString;
  }
}

function buildFileUrl(filePath) {
  if (!filePath) return "";
  return `/api/files/${filePath}`;
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
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
    case "completed_with_errors":
      return "border-amber-400/20 bg-amber-500/10 text-amber-200";
    case "failed":
      return "border-red-400/20 bg-red-500/10 text-red-200";
    case "processing":
      return "border-cyan-400/20 bg-cyan-500/10 text-cyan-200";
    default:
      return "border-white/10 bg-white/[0.05] text-white/70";
  }
}

export default function ResultsPage() {
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function getAccessToken() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      throw new Error("Usuário não autenticado.");
    }

    return session.access_token;
  }

  useEffect(() => {
    let isMounted = true;

    async function loadResult() {
      try {
        setLoading(true);
        setError("");

        const rawJob = sessionStorage.getItem(RESULT_KEY);

        if (rawJob) {
          const parsed = JSON.parse(rawJob);

          if (isMounted) {
            setJob(parsed);
            setLoading(false);
          }
          return;
        }

        const jobId = sessionStorage.getItem(RESULT_ID_KEY);

        if (!jobId) {
          if (isMounted) {
            setError("Nenhum resultado foi encontrado. Volte para o upload ou dashboard.");
            setLoading(false);
          }
          return;
        }

        const token = await getAccessToken();

        const res = await fetch(`/api/jobs/${jobId}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.details || data?.error || "Erro ao carregar resultado.");
        }

        if (isMounted) {
          setJob(data);
          sessionStorage.setItem(RESULT_KEY, JSON.stringify(data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Erro inesperado ao carregar resultado.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResult();

    return () => {
      isMounted = false;
    };
  }, []);

  const donePhotos = useMemo(() => {
    if (!job?.photos) return [];
    return job.photos.filter((photo) => photo.status === "done");
  }, [job]);

  const errorPhotos = useMemo(() => {
    if (!job?.photos) return [];
    return job.photos.filter((photo) => photo.status === "error");
  }, [job]);

  const totalPhotos = job?.photos?.length || 0;
  const successRate = totalPhotos
    ? Math.round((donePhotos.length / totalPhotos) * 100)
    : 0;

  function downloadEditedPhoto(photo) {
    if (!photo?.editedPath) return;

    const link = document.createElement("a");
    link.href = buildFileUrl(photo.editedPath);
    link.download = `${
      photo.originalName?.replace(/\.[^.]+$/, "") || "imagem"
    }_editada.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function goToUpload() {
    router.push("/upload");
  }

  function goToDashboard() {
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-140px] top-[60px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[20%] h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.05]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-emerald-200">
              <Sparkles size={14} />
              Resultados do lote
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              {job?.projectName || "Resultados"}
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Revise as imagens concluídas, veja falhas eventuais e baixe os arquivos editados.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={goToDashboard}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.08]"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            <button
              onClick={goToUpload}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-950/30 transition duration-200 hover:scale-[1.02]"
            >
              <Wand2 size={16} />
              Novo lote
            </button>
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-white/70">
            <div className="flex items-center gap-3">
              <Clock3 size={18} className="text-cyan-300" />
              Carregando resultado...
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && job && (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                <div className="text-sm text-white/45">Status final</div>
                <div className="mt-3">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm ${getStatusClasses(
                      job.status
                    )}`}
                  >
                    {getStatusLabel(job.status)}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                <div className="text-sm text-white/45">Total de fotos</div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  {totalPhotos}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                <div className="text-sm text-white/45">Concluídas</div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  {donePhotos.length}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-5">
                <div className="text-sm text-white/45">Taxa de sucesso</div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  {successRate}%
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
                <div className="text-sm text-white/45">Resumo</div>
                <div className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                  Informações do processamento
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/45">Job ID</div>
                    <div className="mt-2 break-all text-sm text-white">
                      {job.id}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/45">Criado em</div>
                    <div className="mt-2 text-sm text-white">
                      {formatDate(job.createdAt)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/45">Finalizado em</div>
                    <div className="mt-2 text-sm text-white">
                      {formatDate(job.finishedAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
                <div className="text-sm text-white/45">Falhas</div>
                <div className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                  Imagens com erro
                </div>

                <div className="mt-6 space-y-3">
                  {errorPhotos.length === 0 ? (
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200">
                      Nenhuma imagem falhou neste lote.
                    </div>
                  ) : (
                    errorPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4"
                      >
                        <div className="font-medium text-white">
                          {photo.originalName}
                        </div>
                        <div className="mt-2 text-sm text-red-200">
                          {photo.error || "Falha não especificada."}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-sm text-white/45">Galeria final</div>
                  <div className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                    Fotos editadas
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                  {donePhotos.length} concluída{donePhotos.length !== 1 ? "s" : ""}
                </div>
              </div>

              {donePhotos.length === 0 ? (
                <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-[#0d1528] p-10 text-center text-white/40">
                  Nenhuma imagem concluída foi encontrada.
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {donePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0d1528]"
                    >
                      <div className="grid gap-0 md:grid-cols-2">
                        <div className="border-b border-white/10 md:border-b-0 md:border-r">
                          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm text-white/55">
                            <ImageIcon size={14} />
                            Original
                          </div>
                          <div className="bg-black/10">
                            {photo.originalPath ? (
                              <img
                                src={buildFileUrl(photo.originalPath)}
                                alt={`${photo.originalName} original`}
                                className="h-72 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-72 items-center justify-center text-white/30">
                                Original indisponível
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm text-white/55">
                            <Sparkles size={14} />
                            Editada
                          </div>
                          <div className="bg-black/10">
                            {photo.editedPath ? (
                              <img
                                src={buildFileUrl(photo.editedPath)}
                                alt={`${photo.originalName} editada`}
                                className="h-72 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-72 items-center justify-center text-white/30">
                                Editada indisponível
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="truncate text-base font-medium text-white">
                          {photo.originalName}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/45">
                          <span>{formatFileSize(photo.size)}</span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">
                            <CheckCircle2 size={14} />
                            concluída
                          </span>
                        </div>

                        <button
                          onClick={() => downloadEditedPhoto(photo)}
                          disabled={!photo.editedPath}
                          className={`mt-4 inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-lg shadow-fuchsia-950/30 transition duration-200 ${
                            photo.editedPath
                              ? "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-slate-950 hover:scale-[1.02]"
                              : "cursor-not-allowed bg-white/10 text-white/35"
                          }`}
                        >
                          <Download size={16} />
                          Baixar imagem editada
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!loading && !error && !job && (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-center">
            <div className="mx-auto max-w-xl">
              <div className="text-2xl font-semibold text-white">
                Nenhum resultado disponível
              </div>
              <p className="mt-3 text-white/55">
                Não encontramos dados suficientes para montar esta tela.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={goToDashboard}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.08]"
                >
                  <FolderKanban size={16} />
                  Ir para dashboard
                </button>

                <button
                  onClick={goToUpload}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-950/30 transition duration-200 hover:scale-[1.02]"
                >
                  <ArrowRight size={16} />
                  Criar novo lote
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}