import { createClient } from "../../lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Teste Supabase</h1>

      <pre>
        {JSON.stringify(
          {
            data,
            error,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}