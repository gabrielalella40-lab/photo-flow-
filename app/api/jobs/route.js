import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let supabaseAdmin = null;

function getSupabase() {
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
  return supabaseAdmin;
}

async function getAuthenticatedUser(request, supabase) {
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

function normalizeJob(job) {
  const photos = Array.isArray(job?.photos) ? job.photos : [];

  return {
    id: job?.id ?? null,
    userId: job?.user_id ?? null,
    projectName: job?.project_name || "Projeto sem nome",
    status: job?.status || "unknown",
    progress: Number(job?.progress ?? 0),
    createdAt: job?.created_at || null,
    startedAt: job?.started_at || null,
    finishedAt: job?.finished_at || null,
    totalPhotos: photos.length,
    donePhotos: photos.filter((photo) => photo?.status === "done").length,
    errorPhotos: photos.filter((photo) => photo?.status === "error").length,
  };
}

export async function GET(request) {
  try {
    const supabase = getSupabase();

    const { user, error: authError } = await getAuthenticatedUser(
      request,
      supabase
    );

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: authError || "Não autorizado.",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Falha ao listar jobs.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const jobs = (data || []).map(normalizeJob);

    return NextResponse.json(
      {
        success: true,
        jobs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERRO EM /api/jobs:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Falha ao listar jobs.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}