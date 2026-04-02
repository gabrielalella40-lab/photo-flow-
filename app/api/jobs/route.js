import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

async function getAuthenticatedUser(request) {
  try {
    const supabase = getSupabase();

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

export async function GET(request) {
  try {
    const supabase = getSupabase();

    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        {
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
          error: "Falha ao listar jobs.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const jobs = (data || []).map((job) => ({
      id: job.id,
      userId: job.user_id || null,
      projectName: job.project_name || "Projeto sem nome",
      status: job.status || "unknown",
      progress: job.progress || 0,
      createdAt: job.created_at || null,
      startedAt: job.started_at || null,
      finishedAt: job.finished_at || null,
      totalPhotos: Array.isArray(job.photos) ? job.photos.length : 0,
      donePhotos: Array.isArray(job.photos)
        ? job.photos.filter((photo) => photo.status === "done").length
        : 0,
      errorPhotos: Array.isArray(job.photos)
        ? job.photos.filter((photo) => photo.status === "error").length
        : 0,
    }));

    return NextResponse.json({
      success: true,
      jobs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao listar jobs.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}