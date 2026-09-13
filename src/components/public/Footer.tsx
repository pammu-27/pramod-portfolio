import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  name: string;
  professional_title: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  twitter_url: string;
  facebook_url: string;
};

const quickLinks = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Projects", "#projects"],
  ["Certifications", "#certifications"],
  ["Contact", "#contact"],
] as const;

function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        name,
        professional_title,
        email,
        github_url,
        linkedin_url,
        instagram_url,
        twitter_url,
        facebook_url
      `)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Footer profile error:", error);
      return;
    }

    if (data) {
      setProfile(data as Profile);
    }
  }

  const name = profile?.name || "Pramod";
  const title = profile?.professional_title || "Full Stack Developer";

  const socials = [
    { label: "GitHub", url: profile?.github_url },
    { label: "LinkedIn", url: profile?.linkedin_url },
    { label: "Instagram", url: profile?.instagram_url },
    { label: "Twitter", url: profile?.twitter_url },
    { label: "Facebook", url: profile?.facebook_url },
  ].filter((item) => item.url);

  return (
    <footer className="relative overflow-hidden border-t border-[var(--glass-border)] bg-[var(--bg-secondary)] transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-cyan-400/[0.035] blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-cyan-400/[0.025] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        {/* Main footer */}
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr_1fr]">
          {/* Brand */}
          <div>
            <a
              href="#home"
              className="group inline-flex items-center text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]"
            >
              {name}
              <span className="text-cyan-400 transition-transform duration-300 group-hover:-translate-y-px">
                .
              </span>
            </a>

            <p className="mt-3 text-sm font-medium text-cyan-400">{title}</p>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
              Building modern, responsive and meaningful digital experiences.
            </p>

            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2.5 text-xs font-semibold text-[var(--text)] transition hover:border-cyan-400/40 hover:text-cyan-400"
            >
              Start a conversation
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Quick links */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-cyan-400" />
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text)]">
                Explore
              </h3>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {quickLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
                >
                  <span className="h-px w-0 bg-[var(--accent)] transition-all duration-200 group-hover:w-3" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-cyan-400" />
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text)]">
                Connect
              </h3>
            </div>

            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}

            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="mt-5 inline-flex max-w-full break-all text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
              >
                {profile.email}
              </a>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--glass-border)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[var(--text-muted)]">
              © {new Date().getFullYear()} {name}. All rights reserved.
            </p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Built with code · curiosity · continuous learning
            </p>
          </div>

          <a
            href="#home"
            className="group inline-flex items-center gap-2 text-[var(--text-muted)] transition hover:text-[var(--accent)]"
          >
            Back to top
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
