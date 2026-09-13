import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdminAccess() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      // No logged-in user
      if (!session) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      // Check whether the logged-in user exists in admin_users
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error("Admin authorization check failed:", error);
        setAuthorized(false);
      } else {
        setAuthorized(Boolean(adminUser));
      }

      setLoading(false);
    }

    checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        if (mounted) {
          setAuthorized(false);
          setLoading(false);
        }
        return;
      }

      // Re-check admin authorization after authentication changes.
      checkAdminAccess();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-sm text-slate-400">
            Checking authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;