"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan") || "";

    const timer = setTimeout(() => {
      router.replace(`/dashboard?checkout=success&plan=${plan}`);
    }, 1800);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-3xl">
          ✨
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">
          Pagamento confirmado
        </h1>

        <p className="mt-4 text-base leading-7 text-white/65">
          Seu pagamento foi aprovado e estamos finalizando a atualização da sua conta.
          Você será redirecionada em instantes.
        </p>

        <div className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400" />
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] px-8 py-7 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400" />
            <p className="text-white/80">Confirmando seu pagamento...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}