import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import { supabase } from "../../lib/supabase";

type DashboardStats = {
  projects: number;
  skills: number;
  experience: number;
  education: number;
  certifications: number;
  messages: number;
  unreadMessages: number;
};

const emptyStats: DashboardStats = {
  projects: 0,
  skills: 0,
  experience: 0,
  education: 0,
  certifications: 0,
  messages: 0,
  unreadMessages: 0,
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [stats, setStats] =
    useState<DashboardStats>(
      emptyStats,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD USER + DASHBOARD DATA
  ===================================================== */

  const loadDashboard =
    useCallback(async () => {
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(
        user?.email ?? "",
      );

      const [
        projectsResult,
        skillsResult,
        experienceResult,
        educationResult,
        certificationsResult,
        messagesResult,
        unreadResult,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("skills")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("experiences")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("education")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("certifications")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("messages")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("messages")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("is_read", false),
      ]);

      const errors = [
        projectsResult.error,
        skillsResult.error,
        experienceResult.error,
        educationResult.error,
        certificationsResult.error,
        messagesResult.error,
        unreadResult.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error(
          "Dashboard data error:",
          errors,
        );

        setError(
          "Some dashboard statistics could not be loaded.",
        );
      }

      setStats({
        projects:
          projectsResult.count ?? 0,

        skills:
          skillsResult.count ?? 0,

        experience:
          experienceResult.count ?? 0,

        education:
          educationResult.count ?? 0,

        certifications:
          certificationsResult.count ?? 0,

        messages:
          messagesResult.count ?? 0,

        unreadMessages:
          unreadResult.count ?? 0,
      });
    }, []);

  useEffect(() => {
    async function initialize() {
      setLoading(true);

      await loadDashboard();

      setLoading(false);
    }

    initialize();
  }, [loadDashboard]);

  /* =====================================================
     REFRESH
  ===================================================== */

  async function handleRefresh() {
    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

          <p className="text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="mx-auto w-full max-w-7xl text-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="mb-8 flex flex-col gap-5 border-b border-white/[0.07] pb-7 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your portfolio content,
            professional information and
            incoming messages from one
            place.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="hidden text-right sm:block">

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Signed in as
            </p>

            <p className="mt-1 max-w-[260px] truncate text-sm text-slate-300">
              {email || "Administrator"}
            </p>

            <div className="mt-1 flex items-center justify-end gap-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[11px] text-emerald-400">
                Online
              </span>

            </div>

          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >

            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            Refresh

          </button>

        </div>

      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4">

          <div className="flex items-center gap-3">

            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-400/20 text-xs text-amber-300">
              !
            </span>

            <p className="text-sm text-amber-300">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-lg text-amber-300/50 transition hover:text-amber-300"
          >
            ×
          </button>

        </div>
      )}

      {/* =================================================
          WELCOME
      ================================================= */}

      <section className="mb-8">

        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
          Control Center
        </p>

        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

          <div>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Here's an overview of your
              portfolio content.
            </p>

          </div>

          {stats.unreadMessages > 0 && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/messages",
                )
              }
              className="self-start rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-2.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/[0.1] md:self-auto"
            >
              {stats.unreadMessages}{" "}
              unread{" "}
              {stats.unreadMessages ===
              1
                ? "message"
                : "messages"}
            </button>
          )}

        </div>

      </section>

      {/* =================================================
          MAIN STATISTICS
      ================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Projects"
          value={stats.projects}
          description="Portfolio projects"
          onClick={() =>
            navigate(
              "/admin/projects",
            )
          }
        />

        <StatCard
          title="Skills"
          value={stats.skills}
          description="Technical skills"
          onClick={() =>
            navigate(
              "/admin/skills",
            )
          }
        />

        <StatCard
          title="Experience"
          value={stats.experience}
          description="Professional roles"
          onClick={() =>
            navigate(
              "/admin/experience",
            )
          }
        />

        <StatCard
          title="Messages"
          value={stats.messages}
          description={
            stats.unreadMessages > 0
              ? `${stats.unreadMessages} unread`
              : "All messages reviewed"
          }
          highlight={
            stats.unreadMessages > 0
          }
          onClick={() =>
            navigate(
              "/admin/messages",
            )
          }
        />

      </section>

      {/* =================================================
          SECONDARY OVERVIEW
      ================================================= */}

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <MiniStat
          title="Education"
          value={stats.education}
          description="Academic qualifications"
          onClick={() =>
            navigate(
              "/admin/education",
            )
          }
        />

        <MiniStat
          title="Certifications"
          value={
            stats.certifications
          }
          description="Professional credentials"
          onClick={() =>
            navigate(
              "/admin/certifications",
            )
          }
        />

        <MiniStat
          title="Unread Messages"
          value={
            stats.unreadMessages
          }
          description="Messages awaiting review"
          highlight={
            stats.unreadMessages > 0
          }
          onClick={() =>
            navigate(
              "/admin/messages",
            )
          }
        />

      </section>

      {/* =================================================
          SYSTEM STATUS
      ================================================= */}

      <section className="relative mt-6 overflow-hidden rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.07] via-cyan-400/[0.025] to-transparent">

        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.04] blur-3xl" />

        <div className="relative p-6 sm:p-7">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />

                </span>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                    System Status
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Administration system ready
                  </h2>

                </div>

              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                Your portfolio content is
                managed through this React
                admin panel and stored in
                Supabase.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

              <TechBadge>
                React
              </TechBadge>

              <TechBadge>
                TypeScript
              </TechBadge>

              <TechBadge>
                Tailwind CSS
              </TechBadge>

              <TechBadge>
                Supabase
              </TechBadge>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          QUICK ACCESS
      ================================================= */}

      <section className="mt-10">

        <div className="mb-5">

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
            Quick Access
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Manage content
          </h2>

        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <QuickAction
            title="Projects"
            description="Add, edit and organize portfolio projects."
            onClick={() =>
              navigate(
                "/admin/projects",
              )
            }
          />

          <QuickAction
            title="Skills"
            description="Update technologies and proficiency levels."
            onClick={() =>
              navigate(
                "/admin/skills",
              )
            }
          />

          <QuickAction
            title="Experience"
            description="Manage your professional experience and roles."
            onClick={() =>
              navigate(
                "/admin/experience",
              )
            }
          />

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
  highlight = false,
  onClick,
}: {
  title: string;
  value: number;
  description: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
        highlight
          ? "border-cyan-400/25 bg-cyan-400/[0.045]"
          : "border-white/[0.08] bg-[#080d1a] hover:border-cyan-400/20 hover:bg-[#0a1020]"
      }`}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-3 text-3xl font-bold tracking-tight ${
              highlight
                ? "text-cyan-400"
                : "text-white"
            }`}
          >
            {value}
          </p>

        </div>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition ${
            highlight
              ? "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-400"
              : "border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:border-cyan-400/10 group-hover:text-cyan-300"
          }`}
        >
          →
        </span>

      </div>

      <div className="mt-5 h-px bg-white/[0.06]" />

      <p className="mt-3 text-[10px] text-slate-600">
        {description}
      </p>

      <div
        className={`absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-1/2 ${
          highlight
            ? "w-1/3"
            : ""
        }`}
      />

    </button>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  title,
  value,
  description,
  highlight = false,
  onClick,
}: {
  title: string;
  value: number;
  description: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
        highlight
          ? "border-cyan-400/20 bg-cyan-400/[0.035]"
          : "border-white/[0.08] bg-[#080d1a] hover:border-white/[0.14]"
      }`}
    >

      <div>

        <p className="text-xs font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-2 text-xl font-bold text-white">
          {value}
        </p>

        <p className="mt-1 text-[11px] text-slate-600">
          {description}
        </p>

      </div>

      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-sm text-slate-500 transition group-hover:border-cyan-400/10 group-hover:text-cyan-300">
        →
      </span>

    </button>
  );
}

/* =========================================================
   TECHNOLOGY BADGE
========================================================= */

function TechBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="flex min-h-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 text-[10px] font-medium text-slate-500">
      {children}
    </span>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-white/[0.08] bg-[#080d1a] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]"
    >

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-sm font-semibold text-slate-500 transition group-hover:border-cyan-400/15 group-hover:bg-cyan-400/[0.06] group-hover:text-cyan-300">
          {title.charAt(0)}
        </div>

        <span className="text-slate-600 transition duration-200 group-hover:translate-x-1 group-hover:text-cyan-300">
          →
        </span>

      </div>

      <h3 className="mt-5 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </button>
  );
}

export default AdminDashboard;