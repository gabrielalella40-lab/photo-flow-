export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center">
        <h1 className="text-3xl font-semibold">Pagamento confirmado</h1>
        <p className="mt-4 text-white/65">
          Seu pagamento foi recebido. Agora vamos confirmar seu plano ou seus créditos.
        </p>
      </div>
    </div>
  );
}