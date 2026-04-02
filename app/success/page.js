"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const plan = params.get("plan");

    // espera um pouco pra garantir webhook processou
    setTimeout(() => {
      router.push(`/dashboard?plan=${plan}`);
    }, 2000);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Pagamento confirmado 🎉</h1>
      <p>Estamos liberando seus créditos...</p>
    </div>
  );
}