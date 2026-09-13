import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type MaintenanceSettings = {
  site_name: string;
  maintenance_message: string;
};

function Maintenance() {
  const [settings, setSettings] =
    useState<MaintenanceSettings | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenanceSettings();
  }, []);

  async function loadMaintenanceSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_name, maintenance_message")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Maintenance settings error:",
        error
      );

      setLoading(false);
      return;
    }

    if (data) {
      setSettings(data as MaintenanceSettings);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading...
          </p>

        </div>
      </main>
    );
  }

  const siteName =
    settings?.site_name || "Pramod Portfolio";

  const message =
    settings?.maintenance_message ||
    "The portfolio is currently being updated. Please check back soon.";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">

      {/* Background decoration */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      </div>


      {/* Content */}

      <div className="relative w-full max-w-2xl text-center">

        {/* ICON */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/5 text-4xl">
          🚧
        </div>


        {/* SITE NAME */}

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          {siteName}
        </p>


        {/* TITLE */}

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Under Maintenance
        </h1>


        {/* MESSAGE */}

        <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-slate-400 sm:text-lg">
          {message}
        </p>


        {/* STATUS */}

        <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3">

          <span className="relative flex h-2.5 w-2.5">

            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />

          </span>

          <span className="text-sm text-slate-300">
            We'll be back soon
          </span>

        </div>


        {/* FOOTER */}

        <p className="mt-12 text-xs text-slate-700">
          {siteName}
        </p>

      </div>

    </main>
  );
}

export default Maintenance;