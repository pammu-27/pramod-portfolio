import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";


const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "📊",
  },
  {
    label: "Profile",
    path: "/admin/profile",
    icon: "👤",
  },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: "🚀",
  },
  {
    label: "Skills",
    path: "/admin/skills",
    icon: "🛠️",
  },
  {
    label: "Experience",
    path: "/admin/experience",
    icon: "💼",
  },
  {
    label: "Education",
    path: "/admin/education",
    icon: "🎓",
  },
  {
    label: "Certifications",
    path: "/admin/certifications",
    icon: "🏆",
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: "💬",
  },

  {
  label: "Advertisements",
  path: "/admin/ads",
  icon: "AD",
},
  {
    label: "Settings",
    path: "/admin/settings",
    icon: "⚙️",
  },
];

function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Desktop Sidebar */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-950/95 p-5 lg:flex lg:flex-col">

        {/* Logo */}

        <div className="mb-8 flex items-center gap-3 px-2">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950 shadow-lg shadow-cyan-400/10">
            P
          </div>

          <div className="min-w-0">

            <h1 className="truncate font-bold">
              Portfolio Admin
            </h1>

            <p className="text-xs text-slate-500">
              Control Center
            </p>

          </div>

        </div>


        {/* Navigation */}

        <nav className="flex-1 space-y-1 overflow-y-auto">

          {navigation.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >

              <span className="text-base">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* Logout */}

        <div className="mt-5 border-t border-white/10 pt-5">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
          >
            <span>↪</span>
            <span>Sign Out</span>
          </button>

        </div>

      </aside>


      {/* Main Content */}

      <main className="min-h-screen lg:pl-72">

        {/* Top Header */}

        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur-xl sm:px-8">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                Admin Panel
              </p>

              <h2 className="mt-1 text-lg font-bold sm:text-xl">
                Portfolio Management
              </h2>

            </div>


            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-medium text-white">
                  Administrator
                </p>

                <p className="text-xs text-emerald-400">
                  ● Online
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 font-semibold text-cyan-300">
                P
              </div>

            </div>

          </div>

        </header>


        {/* Page Content */}

        <div className="p-5 sm:p-8 lg:p-10">

          <Outlet />

        </div>

      </main>

    </div>
  );
}

export default AdminLayout;