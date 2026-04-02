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

export async function GET(request, { params }) {
  try {
    const supabase = getSupabase();

    const jobId = params?.jobId;

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId não informado." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Job não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao buscar job.",
        details: error?.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}