import { useState } from "react";
import { supabase } from "../../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOGIN
  ===================================================== */

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      console.error(
        "Login error:",
        error,
      );

      setError(
        error.message ||
          "Unable to sign in. Please check your credentials.",
      );

      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4 py-10 text-white">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/[0.06] blur-3xl" />

        <div className="absolute bottom-[-220px] left-[-120px] h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-3xl" />

        <div className="absolute right-[-120px] top-[35%] h-[350px] w-[350px] rounded-full bg-cyan-500/[0.03] blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      </div>

      {/* =================================================
          LOCAL INPUT STYLES
          Prevents global CSS conflicts.
      ================================================= */}

      <style>{`
        .login-input {
          width: 100% !important;
          min-height: 48px !important;

          box-sizing: border-box !important;

          appearance: none !important;
          -webkit-appearance: none !important;

          border: 1px solid rgba(148, 163, 184, 0.14) !important;
          border-radius: 12px !important;

          background: #070d1a !important;

          padding: 12px 14px !important;

          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;

          caret-color: #22d3ee !important;

          outline: none !important;

          font-family: inherit !important;
          font-size: 14px !important;
          line-height: 1.5 !important;

          transition:
            border-color 180ms ease,
            background-color 180ms ease,
            box-shadow 180ms ease !important;
        }

        .login-input:hover {
          border-color: rgba(148, 163, 184, 0.25) !important;
          background: #09101f !important;
        }

        .login-input:focus {
          border-color: rgba(34, 211, 238, 0.65) !important;

          background: #080f1d !important;

          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;

          box-shadow:
            0 0 0 3px rgba(34, 211, 238, 0.08),
            0 10px 30px rgba(0, 0, 0, 0.2) !important;
        }

        .login-input::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 1 !important;
        }

        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:hover,
        .login-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f8fafc !important;

          box-shadow:
            0 0 0 1000px #070d1a inset !important;
        }
      `}</style>

      {/* =================================================
          LOGIN WRAPPER
      ================================================= */}

      <div className="relative z-10 w-full max-w-[430px]">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] shadow-lg shadow-cyan-400/[0.06]">

            <span className="text-xl font-bold text-cyan-400">
              P
            </span>

          </div>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
            Portfolio Admin
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your portfolio
          </p>

        </div>

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <form
          onSubmit={handleLogin}
          className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#080d1a]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >

          {/* CARD TOP */}

          <div className="border-b border-white/[0.07] px-6 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/[0.08] text-sm">
                🔐
              </div>

              <div>

                <h2 className="text-sm font-semibold text-white">
                  Administrator Login
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  Secure access to your control center
                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="px-6 py-7 sm:px-7">

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3.5 text-sm text-red-300">

                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-400/10 text-xs">
                  !
                </span>

                <p className="leading-5">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                FIELDS
            ================================================= */}

            <div className="space-y-5">

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(
                      event.target.value,
                    );
                    setError("");
                  }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  className="login-input"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value,
                      );
                      setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="login-input pr-[82px]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-cyan-400"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="text-base">
                    →
                  </span>
                </>
              )}

            </button>

          </div>

          {/* =================================================
              CARD FOOTER
          ================================================= */}

          <div className="border-t border-white/[0.07] px-6 py-4 text-center sm:px-7">

            <p className="text-[11px] text-slate-600">
              Authorized access only
            </p>

          </div>

        </form>

        {/* =================================================
            PAGE FOOTER
        ================================================= */}

        <div className="mt-7 text-center">

          <p className="text-xs text-slate-600">
            Portfolio Administration
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-700">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            Secure connection

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;