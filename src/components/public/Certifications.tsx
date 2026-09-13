import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Certification = {
  id: string;
  title: string;
  organization: string;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
};

function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertifications();
  }, []);

  async function loadCertifications() {
    const { data, error } = await supabase
      .from("certifications")
      .select(`
        id,
        title,
        organization,
        issue_date,
        credential_id,
        credential_url,
        image_url,
        description,
        sort_order,
        is_visible
      `)
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Certifications loading error:", error);
      setLoading(false);
      return;
    }

    setCertifications((data ?? []) as Certification[]);
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
        id="certifications"
        className="border-t border-white/5 bg-[#08090b] px-5 py-20 sm:px-8 sm:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-12 w-72 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.025]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="certifications"
      className="relative overflow-hidden border-t border-white/5 bg-[#08090b] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-10"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-cyan-400/[0.04] blur-3xl" />
        <div className="absolute -left-40 bottom-10 h-80 w-80 rounded-full bg-cyan-400/[0.03] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.022]"
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
                Achievements
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Certifications<span className="text-cyan-400">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Professional certifications and achievements I've earned.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                Credentials
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {certifications.length}{" "}
                {certifications.length === 1 ? "achievement" : "achievements"}
              </p>
            </div>
          </div>
        </div>

        {certifications.length === 0 ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M7 3h8l3 3v15H7z" />
                <path d="M15 3v4h4M10 12h5M10 16h5" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">
              No certifications available
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Certifications will appear here once they are added and made visible.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {certifications.map((certification, index) => (
              <article
                key={certification.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-white/[0.04]"
              >
                {/* Top accent */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent transition-all duration-500 group-hover:via-cyan-400/70" />

                {/* Certificate image */}
                {certification.image_url ? (
                  <div className="relative aspect-[16/8] overflow-hidden border-b border-white/10 bg-black/20">
                    <img
                      src={certification.image_url}
                      alt={certification.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090b]/35 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-24 overflow-hidden border-b border-white/10 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.025] to-transparent">
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full border border-cyan-400/10" />
                    <div className="absolute -right-2 -top-6 h-20 w-20 rounded-full border border-cyan-400/10" />
                  </div>
                )}

                <div className="p-6 sm:p-7">
                  <div className="flex items-start gap-4">
                    {/* Number */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] text-[10px] font-semibold tracking-wider text-cyan-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-white sm:text-xl">
                        {certification.title}
                      </h3>

                      {certification.organization && (
                        <p className="mt-2 text-sm font-medium text-cyan-400">
                          {certification.organization}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {certification.issue_date && (
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        Issued {formatDate(certification.issue_date)}
                      </span>
                    )}

                    {certification.credential_id && (
                      <span className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-400">
                        ID: {certification.credential_id}
                      </span>
                    )}
                  </div>

                  {certification.description && (
                    <p className="mt-5 text-sm leading-7 text-slate-400">
                      {certification.description}
                    </p>
                  )}

                  {certification.credential_url && (
                    <div className="mt-6 border-t border-white/10 pt-5">
                      <a
                        href={certification.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.12] hover:text-cyan-200"
                      >
                        Verify Credential
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-slate-600">
            Credentials · Learning · Growth
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
            {String(certifications.length).padStart(2, "0")}{" "}
            {certifications.length === 1 ? "ENTRY" : "ENTRIES"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Certifications;
