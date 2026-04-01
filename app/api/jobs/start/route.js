import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const RESULTS_DIR = path.join(DATA_DIR, "results");

async function ensureDirs() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(RESULTS_DIR, { recursive: true });
}

function sanitizeFileName(name) {
  return name.replace(/[^\w.\-]+/g, "_");
}

async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "Token não enviado." };
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return { user: null, error: "Token inválido." };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { user: null, error: "Usuário não autenticado." };
    }

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error?.message || "Erro ao autenticar usuário.",
    };
  }
}

async function saveJob(job) {
  const payload = {
    id: job.id,
    user_id: job.userId,
    user_email: job.userEmail,
    project_name: job.projectName,
    status: job.status,
    progress: job.progress,
    created_at: job.createdAt,
    started_at: job.startedAt,
    finished_at: job.finishedAt,
    error: job.error,
    photos: job.photos,
  };

  const { error } = await supabase.from("jobs").upsert(payload);

  if (error) {
    throw new Error(error.message || "Falha ao salvar job no Supabase.");
  }
}

async function readJob(jobId) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Job não encontrado.");
  }

  return {
    id: data.id,
    userId: data.user_id,
    userEmail: data.user_email,
    projectName: data.project_name,
    status: data.status,
    progress: data.progress,
    createdAt: data.created_at,
    startedAt: data.started_at,
    finishedAt: data.finished_at,
    error: data.error,
    photos: Array.isArray(data.photos) ? data.photos : [],
  };
}

async function updatePhoto(jobId, photoId, patch) {
  const job = await readJob(jobId);

  job.photos = job.photos.map((photo) =>
    photo.id === photoId ? { ...photo, ...patch } : photo
  );

  const doneCount = job.photos.filter((p) => p.status === "done").length;
  const errorCount = job.photos.filter((p) => p.status === "error").length;
  const processedCount = doneCount + errorCount;

  job.progress =
    job.photos.length > 0
      ? Math.round((processedCount / job.photos.length) * 100)
      : 0;

  if (processedCount === job.photos.length && job.photos.length > 0) {
    job.status = errorCount > 0 ? "completed_with_errors" : "completed";
    job.finishedAt = new Date().toISOString();
  } else if (processedCount > 0) {
    job.status = "processing";
  }

  await saveJob(job);
}

async function updateJob(jobId, patch) {
  const job = await readJob(jobId);
  const nextJob = { ...job, ...patch };
  await saveJob(nextJob);
}

async function processJob(jobId) {
  try {
    const job = await readJob(jobId);

    await updateJob(jobId, {
      status: "processing",
      startedAt: new Date().toISOString(),
    });

    for (const photo of job.photos) {
      try {
        await updatePhoto(jobId, photo.id, {
          status: "processing",
          step: "Enviando para IA",
        });

        const originalPath = path.join(process.cwd(), photo.originalPath);
        const imageBuffer = await fs.readFile(originalPath);

        const imageFile = new File([imageBuffer], photo.originalName, {
          type: photo.mimeType,
        });

        const prompt = `
Edite esta fotografia profissionalmente para fotografia social, ensaios e eventos.
Regras obrigatórias:
- corrigir luz e exposição com naturalidade
- melhorar balanço de branco
- refinar contraste sem exagero
- preservar tons de pele realistas
- aumentar definição de forma suave
- reduzir ruído sem plastificar
- manter enquadramento original
- não deformar rosto, corpo, roupas ou cenário
- não remover elementos importantes
- entregar resultado premium, limpo e comercial
`;

        await updatePhoto(jobId, photo.id, {
          step: "Aplicando edição com IA",
        });

        const result = await client.images.edit({
          model: "gpt-image-1",
          image: imageFile,
          prompt,
          size: "1024x1024",
        });

        const b64 = result?.data?.[0]?.b64_json;

        if (!b64) {
          throw new Error("A IA não retornou b64_json.");
        }

        const outputBuffer = Buffer.from(b64, "base64");
        const resultFileName = `${photo.id}.png`;
        const resultPath = path.join(RESULTS_DIR, resultFileName);

        await fs.writeFile(resultPath, outputBuffer);

        await updatePhoto(jobId, photo.id, {
          status: "done",
          step: "Concluída",
          editedPath: path
            .join("data", "results", resultFileName)
            .replaceAll("\\", "/"),
          error: null,
        });
      } catch (error) {
        await updatePhoto(jobId, photo.id, {
          status: "error",
          step: "Falhou",
          error: error?.message || "Erro desconhecido",
        });
      }
    }
  } catch (error) {
    await updateJob(jobId, {
      status: "failed",
      error: error?.message || "Falha geral no job",
      finishedAt: new Date().toISOString(),
    });
  }
}

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não encontrada no .env.local" },
        { status: 500 }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Variáveis do Supabase não encontradas no .env.local" },
        { status: 500 }
      );
    }

    const { user, error: authError } = await getAuthenticatedUser(req);

    if (authError || !user) {
      return NextResponse.json(
        { error: authError || "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Perfil não encontrado." },
        { status: 404 }
      );
    }

    await ensureDirs();

    const formData = await req.formData();
    const projectName = formData.get("projectName") || "Projeto sem nome";
    const files = formData.getAll("images");

    if (!files.length) {
      return NextResponse.json(
        { error: "Nenhuma imagem foi enviada." },
        { status: 400 }
      );
    }

    const totalPhotos = files.length;

    if (profile.credits <= 0) {
      return NextResponse.json(
        { error: "Você não possui créditos." },
        { status: 403 }
      );
    }

    if (profile.credits < totalPhotos) {
      return NextResponse.json(
        {
          error: `Créditos insuficientes. Você tem ${profile.credits} e tentou enviar ${totalPhotos} fotos.`,
        },
        { status: 403 }
      );
    }

    const jobId = crypto.randomUUID();
    const now = new Date().toISOString();

    const photos = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        return NextResponse.json(
          { error: `Formato não suportado: ${file.name}` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const photoId = crypto.randomUUID();
      const safeName = sanitizeFileName(file.name);
      const storedName = `${photoId}_${safeName}`;
      const originalPath = path.join(UPLOADS_DIR, storedName);

      await fs.writeFile(originalPath, buffer);

      photos.push({
        id: photoId,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        status: "queued",
        step: "Na fila",
        originalPath: path
          .join("data", "uploads", storedName)
          .replaceAll("\\", "/"),
        editedPath: null,
        error: null,
      });
    }

    const job = {
      id: jobId,
      userId: user.id,
      userEmail: user.email || null,
      projectName,
      status: "queued",
      progress: 0,
      createdAt: now,
      startedAt: null,
      finishedAt: null,
      error: null,
      photos,
    };

    await saveJob(job);

    await supabase
      .from("profiles")
      .update({
        credits: profile.credits - totalPhotos,
      })
      .eq("id", user.id);

    processJob(jobId);

    return NextResponse.json({
      success: true,
      jobId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao iniciar job em lote.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}