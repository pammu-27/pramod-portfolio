import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  technologies: string[];
  live_url: string;
  github_url: string;
  category: string;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        title,
        slug,
        description,
        long_description,
        image_url,
        technologies,
        live_url,
        github_url,
        category,
        featured,
        is_published,
        sort_order
      `)
      .eq("is_published", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Projects loading error:", error);
      setLoading(false);
      return;
    }

    setProjects((data ?? []) as Project[]);
    setLoading(false);
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section
        id="projects"
        className="
          border-t
          border-slate-200
          bg-slate-50
          px-6
          py-24
          dark:border-white/5
          dark:bg-[#08090b]
          sm:py-32
        "
      >
        <div className="mx-auto max-w-7xl">

          <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-white/10" />

          <div className="mt-4 h-10 w-48 animate-pulse rounded bg-slate-200 dark:bg-white/10" />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-80
                  animate-pulse
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  dark:border-white/10
                  dark:bg-white/[0.03]
                "
              />
            ))}
          </div>

        </div>
      </section>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <section
      id="projects"
      className="
        border-t
        border-slate-200
        bg-slate-50
        px-6
        py-24
        text-slate-900
        dark:border-white/5
        dark:bg-[#08090b]
        dark:text-white
        sm:py-32
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-12
            border-b
            border-slate-200
            pb-12
            dark:border-white/10
          "
        >
          <div className="flex items-end justify-between gap-8">

            <div>
              {/* LABEL */}

              <div className="flex items-center gap-3">
                <span
                  className="
                    h-px
                    w-10
                    bg-blue-500
                    dark:bg-cyan-400
                  "
                />

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-blue-600
                    dark:text-cyan-400
                  "
                >
                  Portfolio
                </p>
              </div>

              {/* TITLE */}

              <h2
                className="
                  mt-4
                  text-4xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-5xl
                "
              >
                Projects
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-base
                  leading-7
                  text-slate-600
                  dark:text-slate-400
                "
              >
                A selection of projects I have built and worked on.
              </p>
            </div>

            {/* RIGHT SIDE */}

            <div className="hidden text-right sm:block">
              <p
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-slate-400
                  dark:text-slate-500
                "
              >
                Selected Work
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}
              </p>
            </div>

          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {projects.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-12
              text-center
              shadow-sm
              dark:border-white/10
              dark:bg-white/[0.03]
              dark:shadow-none
            "
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                <path d="M4 19.5V16a2 2 0 0 1 2-2h3" />
                <path d="M20 4c-4.2.2-7.2 1.5-9.2 3.5L7 11.3l5.7 5.7 3.8-3.8C18.5 11.2 19.8 8.2 20 4Z" />
                <path d="m7 11.3-2.5-.2L3 12.6l4 1.1" />
                <path d="m12.7 17 1.1 4 1.5-1.5-.2-2.5" />
                <circle cx="15.5" cy="8.5" r="1.2" />
              </svg>
            </div>

            <h3
              className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              No projects available
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-500
              "
            >
              Projects will appear here once they are published.
            </p>
          </div>
        ) : (

          /* =================================================
             PROJECT GRID
          ================================================= */

          <div className="grid gap-6 md:grid-cols-2">

            {projects.map((project) => (

              <article
                key={project.id}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition
                  duration-300

                  hover:-translate-y-1
                  hover:border-blue-300
                  hover:shadow-lg
                  motion-reduce:transition-none
                  motion-reduce:hover:translate-y-0

                  dark:border-white/10
                  dark:bg-[#101114]
                  dark:shadow-none
                  dark:hover:border-cyan-400/30
                  dark:hover:bg-white/[0.04]
                "
              >

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div
                  className="
                    relative
                    aspect-[16/9]
                    overflow-hidden
                    bg-slate-100
                    dark:bg-slate-900
                  "
                >

                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_45%),linear-gradient(135deg,#0b1220,#111827)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_45%),linear-gradient(135deg,#0a1020,#0f172a)]">
                      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />

                      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20" />

                      <div className="relative w-[72%] max-w-sm rounded-2xl border border-white/10 bg-slate-950/75 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-500 group-hover:-translate-y-1 group-hover:border-cyan-400/30">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            Project Preview
                          </span>
                        </div>

                        <div className="mt-5 flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                            {project.title
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {project.title}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {project.category || "Web Project"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="h-1.5 rounded-full bg-white/10 transition duration-500 group-hover:bg-cyan-400/30" />
                          ))}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <div className="h-8 flex-1 rounded-lg bg-white/[0.04]" />
                          <div className="h-8 w-16 rounded-lg bg-cyan-400/10" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FEATURED */}

                  {project.featured && (
                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        border
                        border-amber-200
                        bg-white/90
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-amber-600
                        shadow-sm
                        backdrop-blur

                        dark:border-amber-400/20
                        dark:bg-slate-950/80
                        dark:text-amber-300
                      "
                    >
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                        </svg>
                        Featured
                      </span>
                    </div>
                  )}

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="p-6 sm:p-7">

                  {/* TITLE + CATEGORY */}

                  <div className="flex flex-col gap-2">

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-slate-900
                        transition
                        group-hover:text-blue-600

                        dark:text-white
                        dark:group-hover:text-cyan-300

                        sm:text-2xl
                      "
                    >
                      {project.title}
                    </h3>

                    {project.category && (
                      <p
                        className="
                          text-sm
                          font-medium
                          text-blue-600
                          dark:text-cyan-400
                        "
                      >
                        {project.category}
                      </p>
                    )}

                  </div>

                  {/* DESCRIPTION */}

                  {project.description && (
                    <p
                      className="
                        mt-4
                        line-clamp-3
                        text-sm
                        leading-7
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {project.description}
                    </p>
                  )}

                  {/* =================================================
                      TECHNOLOGIES
                  ================================================= */}

                  {project.technologies?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">

                      {project.technologies.map((technology) => (

                        <span
                          key={technology}
                          className="
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-50
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-slate-600

                            dark:border-white/10
                            dark:bg-white/[0.04]
                            dark:text-slate-300
                          "
                        >
                          {technology}
                        </span>

                      ))}

                    </div>
                  )}

                  {/* =================================================
                      LINKS
                  ================================================= */}

                  {(project.live_url || project.github_url) && (
                    <div className="mt-7 flex flex-wrap gap-3">

                      {/* LIVE DEMO */}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition

                            hover:bg-blue-700

                            dark:bg-cyan-400
                            dark:text-slate-950
                            dark:hover:bg-cyan-300
                          "
                        >
                          Live Demo ↗
                        </a>
                      )}

                      {/* GITHUB */}

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-700
                            transition

                            hover:border-slate-300
                            hover:bg-slate-50

                            dark:border-white/10
                            dark:bg-transparent
                            dark:text-slate-300
                            dark:hover:border-white/20
                            dark:hover:bg-white/[0.06]
                            dark:hover:text-white
                          "
                        >
                          GitHub ↗
                        </a>
                      )}

                    </div>
                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}

export default Projects;