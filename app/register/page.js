"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 6,
      hasValue: password.length > 0,
      matches: confirmPassword.length > 0 && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !birthDate || !password || !confirmPassword) {
      setErrorMessage("Preencha todos os campos para continuar.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: origin ? `${origin}/login` : undefined,
          data: {
            birth_date: birthDate,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Tenta salvar a data de nascimento em profiles também, sem quebrar o cadastro
      // caso a política/banco ainda não permita essa escrita no client.
      const userId = data?.user?.id;

      if (userId) {
        await supabase.from("profiles").upsert(
          {
            id: userId,
            birth_date: birthDate,
          },
          { onConflict: "id" }
        );
      }

      setSuccessMessage(
        "Conta criada com sucesso. Verifique seu e-mail para confirmar o cadastro."
      );

      setEmail("");
      setBirthDate("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      setErrorMessage("Não foi possível criar sua conta agora.");
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
              Crie sua conta
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Comece a editar suas fotos com IA, ganhe velocidade no fluxo de
              trabalho e mantenha um acabamento profissional.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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
              <label className="mb-2 block text-sm text-zinc-300">
                Data de nascimento
              </label>
              <input
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha segura"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 pr-14 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Digite a senha novamente"
                  className={`w-full rounded-2xl bg-zinc-900/80 px-4 py-3 pr-14 text-sm text-white outline-none transition focus:ring-2 ${
                    confirmPassword.length === 0
                      ? "border border-white/10 focus:border-blue-500/60 focus:ring-blue-500/20"
                      : password === confirmPassword
                      ? "border border-emerald-500/50 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                      : "border border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                Requisitos da senha
              </p>

              <div className="space-y-1 text-sm">
                <p
                  className={
                    passwordRules.minLength
                      ? "text-emerald-400"
                      : "text-zinc-400"
                  }
                >
                  • Pelo menos 6 caracteres
                </p>

                <p
                  className={
                    confirmPassword.length > 0
                      ? passwordRules.matches
                        ? "text-emerald-400"
                        : "text-red-400"
                      : "text-zinc-400"
                  }
                >
                  • Confirmação igual à senha
                </p>
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
              {loading ? "Criando sua conta..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Entrar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}