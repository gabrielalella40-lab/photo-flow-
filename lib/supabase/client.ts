import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function createBrowserSupabaseClient(): SupabaseClient {
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

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Supabase client só pode ser usado no navegador.");
  }

  if (!browserClient) {
    browserClient = createBrowserSupabaseClient();
  }

  return browserClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
});