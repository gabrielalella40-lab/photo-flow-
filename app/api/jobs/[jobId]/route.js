import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

export async function GET(request, context) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        {
          error: authError || "Não autorizado.",
        },
        { status: 401 }
      );
    }

    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId não informado." },
        { status: 400 }
      );
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (error || !job) {
      return NextResponse.json(
        {
          error: "Job não encontrado.",
          details: error?.message || "Erro desconhecido",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: job.id,
      userId: job.user_id,
      userEmail: job.user_email,
      projectName: job.project_name,
      status: job.status,
      progress: job.progress,
      createdAt: job.created_at,
      startedAt: job.started_at,
      finishedAt: job.finished_at,
      error: job.error,
      photos: Array.isArray(job.photos) ? job.photos : [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Job não encontrado.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 404 }
    );
  }
}