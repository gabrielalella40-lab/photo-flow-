import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function createBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * 🔥 NOVO (seguro para Next.js)
 */
export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Supabase client só pode rodar no browser.");
  }

  if (!browserClient) {
    browserClient = createBrowserClient();
  }

  return browserClient;
}

/**
 * 🔥 LEGADO (compatibilidade com seu projeto inteiro)
 */
export const supabase =
  typeof window !== "undefined" ? createBrowserClient() : ({} as SupabaseClient);