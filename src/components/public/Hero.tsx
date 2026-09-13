import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type SiteSettings = {
  hero_greeting: string;
  hero_name: string;
  hero_description: string;
  typing_roles: string[];
};

function Hero() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("hero_greeting, hero_name, hero_description, typing_roles")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Failed to load hero settings:", error);
        return;
      }

      if (active && data) setSettings(data as SiteSettings);
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!settings?.typing_roles?.length || settings.typing_roles.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setRoleIndex((current) =>
        current + 1 >= settings.typing_roles.length ? 0 : current + 1,
      );
    }, 3500);

    return () => window.clearInterval(timer);
  }, [settings]);

  const greeting = settings?.hero_greeting || "Hello, I'm";
  const name = settings?.hero_name || "Pramod P";
  const description =
    settings?.hero_description ||
    "I build modern, responsive and user-friendly web experiences.";
  const roles = settings?.typing_roles?.length
    ? settings.typing_roles
    : ["Full Stack Developer"];
  const currentRole = roles[roleIndex] || roles[0];

  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-10 pt-5 sm:px-6 sm:pb-12 sm:pt-7 lg:pb-14 lg:pt-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-cyan-400/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-[38%] h-80 w-80 rounded-full bg-cyan-400/[0.04] blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--accent)] sm:w-12" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-[11px]">
              {greeting}
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              01 / 01
            </span>
          </div>
        </div>

        <div className="grid items-center gap-10 py-10 sm:gap-12 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:py-14">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(34,211,238,0.75)]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:text-[10px]">
                Web Development · UI · Digital Products
              </span>
            </div>

            <h1 className="max-w-4xl text-[clamp(3.35rem,6.5vw,6.2rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[var(--text)]">
              {name}
              <span className="text-[var(--accent)]">.</span>
            </h1>

            <div className="mt-7 flex min-h-8 items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-30 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              </span>
              <span
                key={currentRole}
                className="animate-[heroRoleIn_500ms_ease-out] text-lg font-medium tracking-[-0.025em] text-[var(--text-secondary)] sm:text-xl lg:text-[1.35rem]"
              >
                {currentRole}
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8 lg:text-[17px]">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex h-12 items-center justify-center rounded-full !border !border-white !bg-white px-7 text-sm font-semibold !text-black shadow-[0_10px_35px_rgba(255,255,255,0.08)] transition-all duration-300 hover:-translate-y-1 hover:!border-[var(--accent)] hover:!bg-[var(--accent)] hover:!text-white hover:shadow-[0_12px_35px_rgba(34,211,238,0.2)]"
              >
                View Projects
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>

              <a
                href="#contact"
                className="group inline-flex h-12 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-7 text-sm font-semibold text-[var(--text)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Contact Me
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
              {[
                "Banking Operations",
                "Automation",
                "Full Stack",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[390px] items-center justify-center sm:min-h-[430px] lg:min-h-[500px]">
            <div
              aria-hidden="true"
              className="absolute right-[5%] top-[4%] h-40 w-40 opacity-20 [background-image:linear-gradient(var(--glass-border)_1px,transparent_1px),linear-gradient(90deg,var(--glass-border)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(circle,black_25%,transparent_72%)]"
            />

            <div
              aria-hidden="true"
              className="absolute h-[350px] w-[275px] rotate-[-7deg] rounded-[42%_58%_55%_45%/48%_40%_60%_52%] border border-[var(--accent)] opacity-40 transition-transform duration-700 hover:rotate-[-3deg] sm:h-[405px] sm:w-[315px] lg:h-[460px] lg:w-[355px]"
            />

            <div
              aria-hidden="true"
              className="absolute h-[335px] w-[262px] rotate-[6deg] rounded-[42%_58%_55%_45%/48%_40%_60%_52%] border border-[var(--glass-border)] opacity-80 transition-transform duration-700 hover:rotate-[2deg] sm:h-[390px] sm:w-[305px] lg:h-[445px] lg:w-[340px]"
            />

            <div className="group relative z-10 h-[325px] w-[252px] overflow-hidden rounded-[42%_58%_55%_45%/48%_40%_60%_52%] border border-[var(--glass-border)] bg-[var(--glass)] shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:h-[375px] sm:w-[292px] lg:h-[430px] lg:w-[330px]">
              <img
                src="/Profile.jpg"
                alt={name}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.06]"
              />
            </div>

            <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:bottom-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text)]">
                  Available for work
                </span>
              </div>
            </div>

            <div className="absolute left-[3%] top-[18%] z-20 hidden rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 shadow-lg backdrop-blur-xl sm:block">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Creative · Technical
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-[var(--glass-border)] sm:grid-cols-3">
          <div className="border-b border-[var(--glass-border)] py-5 sm:border-b-0 sm:border-r sm:pr-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Expertise
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--text)]">
              Web Development
            </p>
          </div>

          <div className="border-b border-[var(--glass-border)] py-5 sm:border-b-0 sm:border-r sm:px-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Speciality
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--text)]">
              UI / UX & Full Stack
            </p>
          </div>

          <div className="py-5 sm:pl-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Location
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--text)]">India</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Selected work
          </span>
          <a
            href="#projects"
            className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-[var(--accent)]"
          >
            Explore →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes heroRoleIn {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[heroRoleIn_500ms_ease-out\\] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
