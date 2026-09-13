import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type EducationData = {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  start_year: number | null;
  end_year: number | null;
  percentage: number | null;
  grade: string | null;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
};

function Education() {
  const [education, setEducation] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducation();
  }, []);

  async function loadEducation() {
    const { data, error } = await supabase
      .from("education")
      .select(`
        id,
        qualification,
        institution,
        location,
        start_year,
        end_year,
        percentage,
        grade,
        description,
        sort_order,
        is_visible
      `)
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Education loading error:", error);
      setLoading(false);
      return;
    }

    setEducation((data ?? []) as EducationData[]);
    setLoading(false);
  }

  if (loading) {
    return (
      <section
        id="education"
        className="border-t border-white/5 bg-[#08090b] px-5 py-20 transition-colors duration-300 sm:px-8 sm:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-12 w-64 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded bg-white/5" />

          <div className="mt-12 space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.025]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="education"
      className="relative overflow-hidden border-t border-white/5 bg-[#08090b] px-5 py-20 transition-colors duration-300 sm:px-8 sm:py-24 lg:px-10"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-400/[0.045] blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-400/[0.035] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:mb-12 sm:pb-9 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Academic
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Education<span className="text-cyan-400">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              My academic background and educational journey.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                Academic Profile
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {education.length} {education.length === 1 ? "qualification" : "qualifications"}
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {education.length === 0 ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
                <path d="M6 10.2V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.8" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              No education information is currently available.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline rail */}
            <div className="absolute bottom-8 left-[18px] top-8 hidden w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent md:block" />

            <div className="space-y-5">
              {education.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.04]"
                >
                  {/* Hover accent */}
                  <div className="absolute inset-y-0 left-0 w-px bg-cyan-400/0 transition-all duration-300 group-hover:bg-cyan-400/80" />

                  <div className="p-6 sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 gap-4 sm:gap-5">
                        {/* Number */}
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-[#08090b] text-[10px] font-semibold tracking-wider text-cyan-400">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                              {item.qualification}
                            </h3>

                            {item.grade && (
                              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                                {item.grade}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm font-medium text-cyan-400">
                            {item.institution}
                          </p>
                        </div>
                      </div>

                      {/* Years */}
                      {(item.start_year || item.end_year) && (
                        <div className="shrink-0 md:text-right">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-200">
                            {item.start_year ?? ""}
                            {item.start_year && item.end_year ? " — " : ""}
                            {item.end_year ?? ""}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div>
                        {item.location && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5 text-cyan-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            >
                              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                              <circle cx="12" cy="10" r="2.2" />
                            </svg>
                            <span>{item.location}</span>
                          </div>
                        )}

                        {item.description && (
                          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.percentage !== null && (
                        <div className="flex min-w-[118px] items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 sm:flex-col sm:items-start sm:gap-0">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                            Result
                          </p>
                          <p className="text-xl font-semibold tracking-tight text-white">
                            {item.percentage}
                            <span className="ml-0.5 text-cyan-400">%</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Footer detail */}
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-slate-600">
            Academic · Growth · Foundation
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
            {String(education.length).padStart(2, "0")} {education.length === 1 ? "ENTRY" : "ENTRIES"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Education;
