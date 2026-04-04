import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("./DashboardClient."), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] px-8 py-7 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400" />
        <p className="text-white/80">Carregando dashboard...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardClient />;
}