import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import PublicLayout from "../../pages/public/PublicLayout";
import Maintenance from "./Maintenance";

type SiteSettings = {
  maintenance_mode: boolean;
};

function PublicGate() {
  const [maintenanceMode, setMaintenanceMode] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("maintenance_mode")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Public settings error:",
        error
      );

      // If settings cannot be loaded,
      // keep the portfolio accessible.
      setMaintenanceMode(false);
      setLoading(false);
      return;
    }

    if (data) {
      const settings =
        data as SiteSettings;

      setMaintenanceMode(
        settings.maintenance_mode
      );
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading portfolio...
          </p>

        </div>

      </main>
    );
  }

  if (maintenanceMode) {
    return <Maintenance />;
  }

  return <PublicLayout />;
}

export default PublicGate;