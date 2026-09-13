import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ProfileData = {
  name: string;
  professional_title: string;
  short_bio: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profile_image_url: string;
  resume_url: string;
  available_for_work: boolean;
};

function About() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          name,
          professional_title,
          short_bio,
          about,
          email,
          phone,
          location,
          profile_image_url,
          resume_url,
          available_for_work
        `,
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("About profile error:", error);

      setLoading(false);
      return;
    }

    if (data) {
      setProfile(data as ProfileData);
    }

    setLoading(false);
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section
        id="about"
        className="
          border-t
          border-[var(--glass-border)]
          px-6
          py-20
          sm:py-24
        "
      >
        <div className="mx-auto max-w-6xl">
          <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />

          <div className="mt-4 h-10 w-48 animate-pulse rounded bg-white/10" />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5" />

            <div className="h-[520px] animate-pulse rounded-3xl bg-white/5" />
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     DATA
  ===================================================== */

  const name = profile?.name || "Pramod";

  const professionalTitle =
    profile?.professional_title ||
    "Command Center Operator | Banking Operations & Reporting";

  const shortBio =
    profile?.short_bio ||
    "BCom Computer Science graduate with experience in banking operations, reporting, financial administration, and software development.";

  const about =
    profile?.about ||
    "I enjoy building practical digital solutions that improve business processes and reduce manual work.";

  return (
    <section
      id="about"
      className="
        relative
        border-t
        border-[var(--glass-border)]
        px-6
        py-20
        sm:py-24
        lg:py-28
      "
    >
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          className="
            mb-10
            border-b
            border-[var(--glass-border)]
            pb-6
            sm:mb-12
          "
        >
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[var(--accent)]
            "
          >
            About
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-semibold
              tracking-[-0.035em]
              text-[var(--text)]
              sm:text-4xl
              lg:text-5xl
            "
          >
            About Me
          </h2>
        </div>

        {/* =================================================
            MAIN GRID

            IMPORTANT:
            lg:items-start prevents the image card
            from stretching to the height of the text card.
        ================================================= */}

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[0.72fr_1.28fr]
            lg:items-start
          "
        >
          {/* =================================================
              PROFILE IMAGE
          ================================================= */}

          <div
            className="
              group
              relative
              aspect-[4/5]
              w-full
              overflow-hidden
              rounded-3xl
              border
              border-[var(--glass-border)]
              bg-[var(--glass)]
              shadow-[var(--shadow)]
            "
          >
            {profile?.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={name}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  group-hover:scale-[1.025]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-[var(--glass)]
                "
              >
                <span
                  className="
                    text-8xl
                    font-semibold
                    tracking-[-0.06em]
                    text-[var(--accent)]
                  "
                >
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* IMAGE OVERLAY */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                bg-gradient-to-t
                from-black/75
                via-black/25
                to-transparent
                px-6
                pb-6
                pt-24
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                "
              >
                Profile
              </p>

              <p
                className="
                  mt-2
                  text-lg
                  font-semibold
                  text-white
                "
              >
                {professionalTitle}
              </p>
            </div>
          </div>

          {/* =================================================
              INFORMATION CARD
          ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-[var(--glass-border)]
              bg-[var(--glass)]
              p-6
              shadow-[var(--shadow)]
              sm:p-8
              lg:p-9
            "
          >
            {/* STATUS */}

            <div
              className="
                flex
                flex-col
                gap-3
                border-b
                border-[var(--glass-border)]
                pb-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className={`
                    h-2.5
                    w-2.5
                    rounded-full
                    ${
                      profile?.available_for_work
                        ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]"
                        : "bg-slate-500"
                    }
                  `}
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[var(--text-secondary)]
                  "
                >
                  {profile?.available_for_work
                    ? "Available for work"
                    : "Currently unavailable"}
                </span>
              </div>

              {profile?.location && (
                <span
                  className="
                    text-xs
                    text-[var(--text-muted)]
                  "
                >
                  {profile.location}
                </span>
              )}
            </div>

            {/* NAME */}

            <div className="pt-7">
              <h3
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.035em]
                  text-[var(--text)]
                  sm:text-4xl
                "
              >
                {name}
              </h3>

              <p
                className="
                  mt-2
                  text-base
                  font-medium
                  text-[var(--accent)]
                "
              >
                {professionalTitle}
              </p>
            </div>

            {/* SHORT BIO */}

            <p
              className="
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-[var(--text-secondary)]
                sm:text-lg
                sm:leading-8
              "
            >
              {shortBio}
            </p>

            {/* ABOUT */}

            <div
              className="
                mt-7
                border-t
                border-[var(--glass-border)]
                pt-7
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[var(--text-muted)]
                "
              >
                About
              </p>

              <p
                className="
                  mt-4
                  whitespace-pre-line
                  text-sm
                  leading-7
                  text-[var(--text-secondary)]
                  sm:text-base
                "
              >
                {about}
              </p>
            </div>

            {/* =================================================
                QUICK DETAILS
            ================================================= */}

            <div
              className="
                mt-7
                grid
                gap-3
                border-t
                border-[var(--glass-border)]
                pt-7
                sm:grid-cols-2
              "
            >
              {profile?.email && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-[var(--glass-border)]
                    bg-[var(--glass)]
                    px-4
                    py-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[var(--text-muted)]
                    "
                  >
                    Email
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      text-[var(--text-secondary)]
                    "
                  >
                    {profile.email}
                  </p>
                </div>
              )}

              {profile?.phone && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-[var(--glass-border)]
                    bg-[var(--glass)]
                    px-4
                    py-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[var(--text-muted)]
                    "
                  >
                    Phone
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-[var(--text-secondary)]
                    "
                  >
                    {profile.phone}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-3
                border-t
                border-[var(--glass-border)]
                pt-7
              "
            >
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="
      inline-flex
      h-11
      items-center
      justify-center
      rounded-full
      bg-cyan-400
      px-6
      text-sm
      font-semibold
      text-slate-950
      shadow-[0_8px_25px_rgba(34,211,238,0.18)]
      transition
      duration-300
      hover:-translate-y-0.5
      hover:bg-cyan-300
      hover:text-slate-950
      hover:shadow-[0_10px_30px_rgba(34,211,238,0.25)]
    "
                >
                  View Resume
                  <span className="ml-3">↗</span>
                </a>
              )}

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--glass-border)]
                    px-6
                    text-sm
                    font-semibold
                    text-[var(--text)]
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[var(--accent)]
                    hover:text-[var(--accent)]
                  "
                >
                  Get In Touch
                  <span className="ml-3">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
