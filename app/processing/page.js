"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

const STORAGE_KEY = "pendingBatchProject";
const RESULT_KEY = "lastCompletedJob";
const RESULT_ID_KEY = "lastCompletedJobId";

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
      return status || "Preparando";
  }
}

export default function ProcessingPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [starting, setStarting] = useState(true);

  const pollRef = useRef(null);

  const doneCount = useMemo(() => {
    if (!job?.photos) return 0;
    return job.photos.filter((p) => p.status === "done").length;
  }, [job]);

  const errorCount = useMemo(() => {
    if (!job?.photos) return 0;
    return job.photos.filter((p) => p.status === "error").length;
  }, [job]);

  const processingCount = useMemo(() => {
    if (!job?.photos) return 0;
    return job.photos.filter((p) => p.status === "processing").length;
  }, [job]);

  const queuedCount = useMemo(() => {
    if (!job?.photos) return 0;
    return job.photos.filter((p) => p.status === "queued").length;
  }, [job]);

  const totalCount = job?.photos?.length || 0;

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      setError("Nenhum lote foi encontrado. Volte para o upload.");
      setStarting(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setProjectName(parsed.projectName || "Projeto sem nome");

      if (!started) {
        startBatch(parsed).catch((err) => {
          console.error("Erro ao iniciar lote:", err);
          setError(err.message || "Falha ao iniciar processamento.");
          setStarting(false);
        });
      }
    } catch {
      setError("Os dados do lote estão inválidos. Volte para o upload.");
      setStarting(false);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [started]);

  async function getAccessToken() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error("Usuário não autenticado.");
    }

    return session.access_token;
  }

  async function startBatch(project) {
    setStarted(true);
    setStarting(true);
    setError("");

    try {
      const memoryFiles = window.__PHOTO_FLOW_PENDING_FILES || [];

      if (!Array.isArray(memoryFiles) || memoryFiles.length === 0) {
        throw new Error(
          "Os arquivos do lote não estão mais em memória. Volte ao upload e envie novamente."
        );
      }

      const token = await getAccessToken();

      const formData = new FormData();
      formData.append("projectName", project.projectName || "Projeto sem nome");

      for (const file of memoryFiles) {
        if (file instanceof File) {
          formData.append("images", file);
        }
      }

      const res = await fetch("/api/jobs/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.details || data?.error || "Erro ao iniciar job.");
      }

      sessionStorage.setItem(RESULT_ID_KEY, data.jobId);

      await fetchJob(data.jobId);

      pollRef.current = setInterval(async () => {
        try {
          await fetchJob(data.jobId);
        } catch (err) {
          console.error("Erro no polling:", err);
        }
      }, 2000);
    } catch (err) {
      throw err;
    }
  }

  async function fetchJob(jobId) {
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
      throw new Error(data?.details || data?.error || "Erro ao consultar job.");
    }

    setJob(data);
    setStarting(false);

    const finishedStatuses = ["completed", "completed_with_errors", "failed"];

    if (finishedStatuses.includes(data.status)) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }

      sessionStorage.setItem(RESULT_KEY, JSON.stringify(data));
      sessionStorage.setItem(RESULT_ID_KEY, data.id);

      delete window.__PHOTO_FLOW_PENDING_FILES;
      sessionStorage.removeItem(STORAGE_KEY);

      setTimeout(() => {
        router.push("/results");
      }, 1200);
    }
  }

  function goToUpload() {
    router.push("/upload");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-140px] top-[60px] h-[360px] w-[360px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[20%] h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-cyan-200">
              Processamento em lote
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              {projectName || "Preparando projeto"}
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              O backend está organizando o lote e preparando o processamento das
              imagens com IA.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={goToUpload}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.08]"
            >
              Voltar ao upload
            </button>

            {job && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/75">
                Job: <span className="text-white">{job.id}</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {!error && (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/45">Progresso geral</div>
                  <div className="mt-2 text-2xl font-medium text-white">
                    {job ? `${job.progress}%` : starting ? "Iniciando..." : "0%"}
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                  {job ? getStatusLabel(job.status) : "Preparando"}
                </div>
              </div>

              <div className="h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${job?.progress || 0}%` }}
                />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/45">Total</div>
                  <div className="mt-2 text-2xl font-semibold">{totalCount}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/45">Concluídas</div>
                  <div className="mt-2 text-2xl font-semibold">{doneCount}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/45">Processando</div>
                  <div className="mt-2 text-2xl font-semibold">
                    {processingCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/45">Erros</div>
                  <div className="mt-2 text-2xl font-semibold">{errorCount}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/45">Na fila</div>
                  <div className="mt-2 text-xl font-semibold text-white">
                    {queuedCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                  <div className="text-sm text-white/45">Criado em</div>
                  <div className="mt-2 text-sm text-white">
                    {job?.createdAt ? formatDate(job.createdAt) : "-"}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1528] p-4 text-sm text-white/60">
                Assim que o lote terminar, esta tela redireciona
                automaticamente para os resultados.
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
              <div className="mb-5">
                <div className="text-sm text-white/45">Status por imagem</div>
                <div className="mt-2 text-2xl font-medium text-white">
                  Acompanhamento do lote
                </div>
              </div>

              <div className="space-y-3">
                {job?.photos?.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl border border-white/10 bg-[#0d1528] p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">
                          {photo.originalName}
                        </div>

                        <div className="mt-1 text-sm text-white/45">
                          {photo.step || "Aguardando atualização"}
                        </div>

                        {photo.error && (
                          <div className="mt-2 text-sm text-red-300">
                            {photo.error}
                          </div>
                        )}
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          photo.status === "done"
                            ? "bg-emerald-500/15 text-emerald-200"
                            : photo.status === "processing"
                            ? "bg-cyan-500/15 text-cyan-200"
                            : photo.status === "error"
                            ? "bg-red-500/15 text-red-200"
                            : "bg-white/10 text-white/65"
                        }`}
                      >
                        {photo.status}
                      </div>
                    </div>
                  </div>
                ))}

                {!job && !error && (
                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4 text-white/55">
                    Preparando envio do lote para o backend...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}