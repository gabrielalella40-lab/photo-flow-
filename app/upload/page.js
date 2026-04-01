"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FolderKanban,
  Image as ImageIcon,
  Trash2,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formatFileSize(bytes) {
    if (!bytes || bytes <= 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function handleChange(e) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setError("");

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();

      reader.onload = () => {
        setPhotos((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            size: file.size,
            previewUrl: reader.result,
            file,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  }

  function removePhoto(id) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }

  function clearAll() {
    setPhotos([]);
    setError("");
    setIsSubmitting(false);
    sessionStorage.removeItem("pendingBatchProject");
    delete window.__PHOTO_FLOW_PENDING_FILES;
  }

  function startProcessing() {
    if (photos.length === 0) {
      setError("Envie pelo menos uma foto antes de continuar.");
      return;
    }

    const validFiles = photos.map((photo) => photo.file).filter(Boolean);

    if (validFiles.length === 0) {
      setError("Os arquivos selecionados não puderam ser preparados. Tente enviar novamente.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const lightweightProject = {
        id: crypto.randomUUID(),
        projectName: projectName.trim() || "Projeto sem nome",
        createdAt: new Date().toISOString(),
        totalPhotos: photos.length,
        progress: 0,
        status: "queued",
        donePhotos: 0,
        errorPhotos: 0,
        files: photos.map((photo, index) => ({
          id: photo.id || String(index + 1),
          name: photo.name,
          type: photo.type,
          size: photo.size,
        })),
      };

      sessionStorage.removeItem("pendingBatchProject");
      sessionStorage.removeItem("lastCompletedJob");
      sessionStorage.removeItem("lastCompletedJobId");

      sessionStorage.setItem(
        "pendingBatchProject",
        JSON.stringify(lightweightProject)
      );

      window.__PHOTO_FLOW_PENDING_FILES = validFiles;

      router.push("/processing");
    } catch (err) {
      console.error("Erro ao iniciar processamento:", err);
      setError(
        "Não foi possível iniciar o processamento. Tente reduzir o lote ou recarregar a página."
      );
      setIsSubmitting(false);
    }
  }

  const totalSize = useMemo(() => {
    return photos.reduce((acc, photo) => acc + (photo.size || 0), 0);
  }, [photos]);

  const validImagesCount = useMemo(() => {
    return photos.filter((photo) => photo.type?.startsWith("image/")).length;
  }, [photos]);

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
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-cyan-200">
              <Sparkles size={14} />
              Upload em lote
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Enviar fotos para edição com IA
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Monte seu lote, defina o nome do projeto e envie tudo para o
              processamento em massa. A prévia continua bonita na tela, mas o
              sistema salva apenas o necessário para não travar.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/75">
            {photos.length} arquivo{photos.length !== 1 ? "s" : ""} •{" "}
            {formatFileSize(totalSize)}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-red-200">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/45">Projeto</div>
                  <div className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                    Informações do lote
                  </div>
                </div>

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20 text-cyan-200">
                  <FolderKanban size={18} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-white/65">
                    Nome do projeto
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex: Casamento Ana e Lucas"
                    className="w-full rounded-2xl border border-white/10 bg-[#0d1528] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/65">
                    Selecionar imagens
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-white/15 bg-[#0d1528] px-6 py-12 text-center transition hover:border-cyan-300/25 hover:bg-[#101a31]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-fuchsia-500/20 text-cyan-200">
                      <UploadCloud size={24} />
                    </div>

                    <div className="mt-5 text-lg font-medium text-white">
                      Clique para escolher várias fotos
                    </div>
                    <div className="mt-2 text-sm text-white/45">
                      JPG, JPEG, PNG ou WEBP
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/45">Total de fotos</div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {photos.length}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/45">Tamanho total</div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {formatFileSize(totalSize)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0d1528] p-4">
                    <div className="text-sm text-white/45">Imagens válidas</div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {validImagesCount}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-emerald-400/15 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />
                    <div>
                      <div className="font-medium text-white">
                        Fluxo corrigido para não travar
                      </div>
                      <div className="mt-1 text-sm leading-6 text-white/60">
                        O processamento envia apenas os dados essenciais do lote
                        para a próxima etapa, enquanto os arquivos reais seguem
                        em memória para o backend.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={startProcessing}
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-fuchsia-950/30 transition duration-200 ${
                      isSubmitting
                        ? "cursor-not-allowed bg-white/30 text-white/70"
                        : "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 hover:scale-[1.02]"
                    }`}
                  >
                    <Zap size={18} />
                    {isSubmitting ? "Iniciando..." : "Iniciar processamento"}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>

                  <button
                    onClick={clearAll}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 font-medium text-white/80 transition hover:bg-white/[0.08]"
                  >
                    <Trash2 size={16} />
                    Limpar lote
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm text-white/45">Pré-visualização</div>
                <div className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                  Fotos do lote
                </div>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                {photos.length} item{photos.length !== 1 ? "s" : ""}
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-[#0d1528] p-10 text-center text-white/40">
                Nenhuma imagem selecionada ainda.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#0d1528]"
                  >
                    <div className="relative">
                      <img
                        src={photo.previewUrl}
                        alt={photo.name}
                        className="h-52 w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl">
                        <ImageIcon size={12} />
                        Preview
                      </div>

                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-400/20 bg-red-500/15 text-red-200 transition hover:bg-red-500/25"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="truncate text-sm font-medium text-white">
                        {photo.name}
                      </div>
                      <div className="mt-1 text-xs text-white/45">
                        {formatFileSize(photo.size)}
                      </div>

                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15"
                      >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}