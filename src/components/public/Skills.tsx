import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Skill = {
  id: string;
  name: string;
  category: string;
  percentage: number;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
  level: number;
  is_published: boolean;
};

function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const { data, error } = await supabase
      .from("skills")
      .select(`
        id,
        name,
        category,
        percentage,
        icon,
        sort_order,
        is_visible,
        level,
        is_published
      `)
      .eq("is_visible", true)
      .eq("is_published", true)
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      console.error("Skills loading error:", error);
      setLoading(false);
      return;
    }

    setSkills((data ?? []) as Skill[]);
    setLoading(false);
  }

  const groupedSkills = skills.reduce<Record<string, Skill[]>>(
    (groups, skill) => {
      const category = skill.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    },
    {},
  );

  if (loading) {
    return (
      <section
        id="skills"
        className="border-t border-[var(--glass-border)] px-5 py-20 sm:px-6 sm:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="mt-5 h-11 w-48 rounded-lg bg-white/10" />
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl border border-white/[0.07] bg-white/[0.025]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-[var(--glass-border)] px-5 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-[22%] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.035] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-[8%] h-[360px] w-[360px] rounded-full bg-cyan-400/[0.025] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-[var(--glass-border)] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--accent)] sm:w-12" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] sm:text-[11px]">
                Expertise
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[var(--text)] sm:text-5xl lg:text-6xl">
              Skills<span className="text-[var(--accent)]">.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-[15px]">
              Technologies and tools I use to build modern, responsive and
              reliable digital experiences.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-1">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Technical profile
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {skills.length} technologies
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] px-6 py-14 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              No skills are currently available.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                {/* Category header */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Category
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-[var(--text)]">
                      {category}
                    </h3>
                  </div>

                  <div className="h-px flex-1 bg-[var(--glass-border)]" />

                  <span className="text-[10px] tabular-nums text-[var(--text-muted)]">
                    {String(categorySkills.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Skill grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map((skill) => {
                    const level = Math.max(
                      0,
                      Math.min(100, Number(skill.percentage ?? 0)),
                    );

                    return (
                      <div
                        key={skill.id}
                        className="
                          group relative overflow-hidden rounded-2xl
                          border border-[var(--glass-border)]
                          bg-[var(--glass)]
                          p-4
                          transition-all duration-300
                          hover:-translate-y-1
                          hover:border-[var(--accent)]/30
                        "
                      >
                        {/* Hover accent */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100"
                        />

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            {/* Icon */}
                            <div
                              className="
                                flex h-10 w-10 shrink-0 items-center justify-center
                                rounded-xl border border-[var(--glass-border)]
                                bg-[var(--bg)]
                                text-xs font-semibold text-[var(--accent)]
                                transition duration-300
                                group-hover:border-[var(--accent)]/25
                                group-hover:bg-[var(--accent)]/[0.05]
                              "
                            >
                              {skill.icon ? (
                                <span>{skill.icon}</span>
                              ) : (
                                <span>
                                  {skill.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold text-[var(--text)]">
                                {skill.name}
                              </h4>
                              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                                {category}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--accent)]">
                            {level}%
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="mt-5">
                          <div className="h-1 overflow-hidden rounded-full bg-[var(--glass-border)]">
                            <div
                              className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
                              style={{ width: `${level}%` }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-[0.13em] text-[var(--text-muted)]">
                              Proficiency
                            </span>
                            <span className="text-[9px] tabular-nums text-[var(--text-muted)]">
                              {level}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom line */}
        {skills.length > 0 && (
          <div className="mt-10 flex items-center justify-between border-t border-[var(--glass-border)] pt-5 sm:mt-12">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Tools · Technologies · Growth
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {Object.keys(groupedSkills).length} categories
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;