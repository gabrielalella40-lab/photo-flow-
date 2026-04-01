"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Preencha seu e-mail e sua senha para continuar.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          "Não foi possível entrar. Confira seu e-mail, sua senha ou confirme sua conta no e-mail."
        );
        return;
      }

      setSuccessMessage("Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("Erro ao entrar na sua conta.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Digite seu e-mail para recuperar a senha.");
      return;
    }

    try {
      setLoading(true);

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: origin ? `${origin}/login` : undefined,
      });

      if (error) {
        setErrorMessage("Não foi possível enviar o e-mail de recuperação.");
        return;
      }

      setSuccessMessage(
        "Enviamos um link de recuperação para o seu e-mail."
      );
    } catch (err) {
      setErrorMessage("Erro ao solicitar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent,rgba(255,255,255,0.02))]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              Photo Flow
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Entre na sua conta
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Acesse seu painel, acompanhe seus créditos e continue editando
              suas fotos com IA.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">E-mail</label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm text-zinc-300">Senha</label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                  disabled={loading}
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 pr-20 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {successMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Ainda não tem conta?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}