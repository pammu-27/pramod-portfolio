import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ExperienceData = {
  id: string;
  job_title: string;
  company: string;
  client: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  sort_order: number;
  is_visible: boolean;
};

function Experience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    const { data, error } = await supabase
      .from("experiences")
      .select(
        `
          id,
          job_title,
          company,
          client,
          location,
          start_date,
          end_date,
          is_current,
          description,
          responsibilities,
          sort_order,
          is_visible
        `
      )
      .eq("is_visible", true)
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      console.error("Experience loading error:", error);
      setLoading(false);
      return;
    }

    setExperiences((data ?? []) as ExperienceData[]);
    setLoading(false);
  }

  function formatDate(date: string | null) {
    if (!date) return "";

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return date;
    }

    return formatted.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <section
        id="experience"
        className="border-t border-[var(--glass-border)] px-5 py-20 sm:px-6 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-3 w-20 rounded-full bg-white/10" />
          <div className="mt-5 h-11 w-64 rounded-lg bg-white/10" />
          <div className="mt-12 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 rounded-[2rem] border border-white/[0.07] bg-white/[0.025]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t border-[var(--glass-border)] px-5 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-[18%] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.03] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 bottom-[8%] h-[360px] w-[360px] rounded-full bg-cyan-400/[0.025] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-[var(--glass-border)] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--accent)] sm:w-12" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-[11px]">
                Career
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[var(--text)] sm:text-5xl lg:text-6xl">
              Experience<span className="text-[var(--accent)]">.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
              My professional journey, roles and experience.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-1">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Professional profile
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {experiences.length}{" "}
                {experiences.length === 1 ? "position" : "positions"}
              </p>
            </div>
          </div>
        </div>

        {/* Experience list */}
        {experiences.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass)] px-6 py-14 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              No experience is currently available.
            </p>
          </div>
        ) : (
          <div className="relative mt-10 space-y-5 sm:mt-12">
            {/* Timeline rail */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-[15px] top-8 hidden w-px bg-[var(--glass-border)] lg:block"
            />

            {experiences.map((experience, index) => (
              <article
                key={experience.id}
                className="
                  group relative overflow-hidden rounded-[2rem]
                  border border-[var(--glass-border)]
                  bg-[var(--glass)]
                  shadow-[var(--shadow)]
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[var(--accent)]/30
                "
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100"
                />

                {/* Main information */}
                <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[56px_1fr_auto] lg:gap-7 lg:p-9">
                  {/* Number */}
                  <div className="hidden lg:block">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--bg)] text-[10px] font-semibold tabular-nums text-[var(--accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text)] sm:text-2xl">
                        {experience.job_title}
                      </h3>

                      {experience.is_current && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40 motion-reduce:hidden" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          </span>
                          Current
                        </span>
                      )}
                    </div>

                    {experience.company && (
                      <p className="mt-2 text-base font-semibold text-[var(--accent)]">
                        {experience.company}
                      </p>
                    )}

                    {experience.client && (
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Client · {experience.client}
                      </p>
                    )}

                    {experience.description && (
                      <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px] sm:leading-8">
                        {experience.description}
                      </p>
                    )}
                  </div>

                  {/* Date / location */}
                  <div className="border-t border-[var(--glass-border)] pt-5 sm:pt-0 sm:text-left lg:min-w-[175px] lg:border-t-0 lg:pt-1 lg:text-right">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {formatDate(experience.start_date)}
                    </p>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      —{" "}
                      {experience.is_current
                        ? "Present"
                        : formatDate(experience.end_date)}
                    </p>

                    {experience.location && (
                      <p className="mt-3 text-xs text-[var(--text-muted)]">
                        {experience.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Responsibilities */}
                {experience.responsibilities?.length > 0 && (
                  <div className="border-t border-[var(--glass-border)] px-6 py-6 sm:px-8 sm:py-7 lg:px-9">
                    <div className="mb-5 flex items-center gap-4">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Responsibilities
                        </p>
                      </div>

                      <span className="h-px flex-1 bg-[var(--glass-border)]" />

                      <span className="text-[9px] tabular-nums text-[var(--text-muted)]">
                        {String(experience.responsibilities.length).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>

                    <div className="grid gap-x-10 gap-y-3 md:grid-cols-2">
                      {experience.responsibilities.map(
                        (responsibility, responsibilityIndex) => (
                          <div
                            key={`${experience.id}-${responsibilityIndex}`}
                            className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]"
                          >
                            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                            <span>{responsibility}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Bottom line */}
        {experiences.length > 0 && (
          <div className="mt-10 flex items-center justify-between border-t border-[var(--glass-border)] pt-5 sm:mt-12">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Career · Operations · Growth
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {experiences.length}{" "}
              {experiences.length === 1 ? "role" : "roles"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;