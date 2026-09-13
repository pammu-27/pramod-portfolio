import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type SiteSettings = {
  id: string;
  site_name: string;
  hero_greeting: string;
  hero_name: string;
  hero_description: string;
  typing_roles: string[];
  maintenance_mode: boolean;
  maintenance_message: string;
  primary_email: string;
};

type SettingsForm = {
  site_name: string;
  hero_greeting: string;
  hero_name: string;
  hero_description: string;
  typing_roles: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  primary_email: string;
};

const emptyForm: SettingsForm = {
  site_name: "",
  hero_greeting: "",
  hero_name: "",
  hero_description: "",
  typing_roles: "",
  maintenance_mode: false,
  maintenance_message: "",
  primary_email: "",
};

const inputClass = "settings-input";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400";

function Settings() {
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  const [form, setForm] =
    useState<SettingsForm>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* =====================================================
     LOAD SETTINGS
  ===================================================== */

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Settings loading error:",
        error,
      );

      setError(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      const siteSettings =
        data as SiteSettings;

      setSettings(siteSettings);

      setForm({
        site_name:
          siteSettings.site_name ?? "",

        hero_greeting:
          siteSettings.hero_greeting ?? "",

        hero_name:
          siteSettings.hero_name ?? "",

        hero_description:
          siteSettings.hero_description ?? "",

        typing_roles:
          (
            siteSettings.typing_roles ?? []
          ).join("\n"),

        maintenance_mode:
          siteSettings.maintenance_mode ??
          false,

        maintenance_message:
          siteSettings.maintenance_message ??
          "",

        primary_email:
          siteSettings.primary_email ?? "",
      });
    }

    setLoading(false);
  }

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  function handleChange(
    field: keyof SettingsForm,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  /* =====================================================
     SAVE
  ===================================================== */

  async function handleSave() {
    setMessage("");
    setError("");

    if (!form.site_name.trim()) {
      setError(
        "Site name is required.",
      );
      return;
    }

    if (!form.hero_name.trim()) {
      setError(
        "Hero name is required.",
      );
      return;
    }

    if (!form.primary_email.trim()) {
      setError(
        "Primary email is required.",
      );
      return;
    }

    const email =
      form.primary_email.trim();

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      setError(
        "Please enter a valid email address.",
      );
      return;
    }

    if (
      form.maintenance_mode &&
      !form.maintenance_message.trim()
    ) {
      setError(
        "Please enter a maintenance message when maintenance mode is enabled.",
      );
      return;
    }

    setSaving(true);

    const roles =
      form.typing_roles
        .split("\n")
        .map((role) => role.trim())
        .filter(Boolean);

    const settingsData = {
      site_name:
        form.site_name.trim(),

      hero_greeting:
        form.hero_greeting.trim(),

      hero_name:
        form.hero_name.trim(),

      hero_description:
        form.hero_description.trim(),

      typing_roles:
        roles,

      maintenance_mode:
        form.maintenance_mode,

      maintenance_message:
        form.maintenance_message.trim(),

      primary_email:
        email,

      updated_at:
        new Date().toISOString(),
    };

    try {
      /* ================================================
         UPDATE
      ================================================ */

      if (settings?.id) {
        const { data, error } =
          await supabase
            .from("site_settings")
            .update(settingsData)
            .eq("id", settings.id)
            .select()
            .single();

        if (error) {
          throw error;
        }

        setSettings(
          data as SiteSettings,
        );

        setMessage(
          "Settings updated successfully!",
        );
      }

      /* ================================================
         CREATE
      ================================================ */

      else {
        const { data, error } =
          await supabase
            .from("site_settings")
            .insert(settingsData)
            .select()
            .single();

        if (error) {
          throw error;
        }

        setSettings(
          data as SiteSettings,
        );

        setMessage(
          "Settings created successfully!",
        );
      }
    } catch (err) {
      console.error(
        "Settings save error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     RESET
  ===================================================== */

  function handleReset() {
    if (!settings) {
      setForm(emptyForm);
      return;
    }

    setForm({
      site_name:
        settings.site_name ?? "",

      hero_greeting:
        settings.hero_greeting ?? "",

      hero_name:
        settings.hero_name ?? "",

      hero_description:
        settings.hero_description ?? "",

      typing_roles:
        (
          settings.typing_roles ?? []
        ).join("\n"),

      maintenance_mode:
        settings.maintenance_mode ??
        false,

      maintenance_message:
        settings.maintenance_message ??
        "",

      primary_email:
        settings.primary_email ?? "",
    });

    setMessage("");
    setError("");
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="mx-auto w-full max-w-6xl text-white">

      {/* =================================================
          LOCAL SETTINGS INPUT CSS
          Prevents global admin-input conflicts.
      ================================================= */}

      <style>{`
        .settings-input {
          width: 100% !important;
          min-height: 46px !important;

          box-sizing: border-box !important;

          appearance: none !important;
          -webkit-appearance: none !important;

          border: 1px solid rgba(148, 163, 184, 0.14) !important;
          border-radius: 11px !important;

          background: #050a16 !important;

          padding: 11px 14px !important;

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

        .settings-input:hover {
          border-color: rgba(148, 163, 184, 0.25) !important;
          background: #070d1a !important;
        }

        .settings-input:focus {
          border-color: rgba(34, 211, 238, 0.6) !important;

          background: #060c18 !important;

          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;

          box-shadow:
            0 0 0 3px rgba(34, 211, 238, 0.08),
            0 8px 24px rgba(0, 0, 0, 0.18) !important;
        }

        .settings-input::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 1 !important;
        }

        .settings-input[type="email"],
        .settings-input[type="text"] {
          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;
        }

        .settings-input:-webkit-autofill,
        .settings-input:-webkit-autofill:hover,
        .settings-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f8fafc !important;

          box-shadow:
            0 0 0 1000px #050a16 inset !important;
        }
      `}</style>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
          Site Control
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Manage your portfolio identity,
          hero content, contact information
          and maintenance mode.
        </p>

      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-5 py-4 text-sm text-emerald-300">

          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
            ✓
          </span>

          {message}

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-5 py-4 text-sm text-red-300">

          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-400/10">
            !
          </span>

          <span>{error}</span>

        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1a] p-14 text-center">

          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">
            Loading site settings...
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {/* =================================================
              SITE IDENTITY
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1a]">

            <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.08] text-lg">
                  🌐
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Site Identity
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Basic information used
                    throughout your portfolio.
                  </p>
                </div>

              </div>

            </div>

            <div className="px-6 py-7 sm:px-8">

              <div className="grid gap-6 md:grid-cols-2">

                {/* SITE NAME */}

                <div>

                  <label className={labelClass}>
                    Site Name
                    <span className="ml-1 text-cyan-400">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.site_name}
                    onChange={(event) =>
                      handleChange(
                        "site_name",
                        event.target.value,
                      )
                    }
                    placeholder="Pramod Portfolio"
                    className={inputClass}
                    autoComplete="off"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className={labelClass}>
                    Primary Email
                    <span className="ml-1 text-cyan-400">
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    value={
                      form.primary_email
                    }
                    onChange={(event) =>
                      handleChange(
                        "primary_email",
                        event.target.value,
                      )
                    }
                    placeholder="hello@example.com"
                    className={inputClass}
                    autoComplete="email"
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Main contact email for
                    your portfolio.
                  </p>

                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              HERO SECTION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1a]">

            <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.08] text-lg">
                  ✨
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Hero Section
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Control the main introduction
                    visitors see.
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-6 px-6 py-7 sm:px-8">

              {/* GREETING */}

              <div>

                <label className={labelClass}>
                  Hero Greeting
                </label>

                <input
                  type="text"
                  value={
                    form.hero_greeting
                  }
                  onChange={(event) =>
                    handleChange(
                      "hero_greeting",
                      event.target.value,
                    )
                  }
                  placeholder="Hello, I'm"
                  className={inputClass}
                  autoComplete="off"
                />

              </div>

              {/* NAME */}

              <div>

                <label className={labelClass}>
                  Hero Name
                  <span className="ml-1 text-cyan-400">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={form.hero_name}
                  onChange={(event) =>
                    handleChange(
                      "hero_name",
                      event.target.value,
                    )
                  }
                  placeholder="Pramod"
                  className={inputClass}
                  autoComplete="off"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className={labelClass}>
                  Hero Description
                </label>

                <textarea
                  rows={5}
                  value={
                    form.hero_description
                  }
                  onChange={(event) =>
                    handleChange(
                      "hero_description",
                      event.target.value,
                    )
                  }
                  placeholder="I build modern web experiences..."
                  className={`${inputClass} min-h-[130px] resize-y`}
                />

              </div>

              {/* TYPING ROLES */}

              <div>

                <label className={labelClass}>
                  Typing Roles
                </label>

                <textarea
                  rows={6}
                  value={
                    form.typing_roles
                  }
                  onChange={(event) =>
                    handleChange(
                      "typing_roles",
                      event.target.value,
                    )
                  }
                  placeholder={`Full Stack Developer
Frontend Developer
Web Designer
Software Developer`}
                  className={`${inputClass} min-h-[150px] resize-y`}
                />

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Enter one role per line.
                  These are stored as a
                  text array.
                </p>

              </div>

            </div>
          </section>

          {/* =================================================
              MAINTENANCE MODE
          ================================================= */}

          <section
            className={`overflow-hidden rounded-2xl border transition ${
              form.maintenance_mode
                ? "border-amber-400/25 bg-amber-400/[0.035]"
                : "border-white/[0.08] bg-[#080d1a]"
            }`}
          >

            <div className="px-6 py-6 sm:px-8">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/[0.07]">
                      🛠️
                    </div>

                    <h2 className="text-lg font-semibold text-white sm:text-xl">
                      Maintenance Mode
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        form.maintenance_mode
                          ? "border-amber-400/15 bg-amber-400/10 text-amber-300"
                          : "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                      }`}
                    >
                      {form.maintenance_mode
                        ? "Enabled"
                        : "Live"}
                    </span>

                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Hide the public portfolio
                    while you make changes.
                  </p>

                </div>

                {/* TOGGLE */}

                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    form.maintenance_mode
                  }
                  aria-label="Toggle maintenance mode"
                  onClick={() =>
                    handleChange(
                      "maintenance_mode",
                      !form.maintenance_mode,
                    )
                  }
                  className={`relative h-8 w-14 shrink-0 rounded-full border transition-all duration-200 ${
                    form.maintenance_mode
                      ? "border-amber-300/40 bg-amber-400"
                      : "border-white/10 bg-slate-700"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-200 ${
                      form.maintenance_mode
                        ? "left-7"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* MESSAGE */}

              <div className="mt-7">

                <label className={labelClass}>
                  Maintenance Message
                </label>

                <textarea
                  rows={4}
                  value={
                    form.maintenance_message
                  }
                  onChange={(event) =>
                    handleChange(
                      "maintenance_message",
                      event.target.value,
                    )
                  }
                  placeholder="The portfolio is currently being updated. Please check back soon."
                  className={`${inputClass} min-h-[120px] resize-y`}
                />

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  This message can be
                  displayed to visitors while
                  maintenance mode is active.
                </p>

              </div>

            </div>
          </section>

          {/* =================================================
              ARCHITECTURE
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1a]">

            <div className="px-6 py-6 sm:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-lg">
                  ⚙️
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    Architecture
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Current technology stack
                    powering your portfolio.
                  </p>

                </div>

              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-400">
                Your portfolio uses React,
                TypeScript, Tailwind CSS and
                Supabase. Portfolio content is
                managed from this admin panel
                and stored in Supabase.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Frontend
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    React + TypeScript
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Styling
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    Tailwind CSS
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Database
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    Supabase
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Build Tool
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    Vite
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-white/[0.08] bg-[#050914]/95 py-5 backdrop-blur-xl sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="h-11 rounded-xl border border-white/10 px-6 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Changes
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 rounded-xl bg-cyan-400 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Settings"}
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default Settings;