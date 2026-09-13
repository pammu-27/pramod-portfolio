import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ProfileData = {
  id?: string;
  name: string;
  professional_title: string;
  short_bio: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profile_image_url: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  available_for_work: boolean;
};

const emptyProfile: ProfileData = {
  name: "",
  professional_title: "",
  short_bio: "",
  about: "",
  email: "",
  phone: "",
  location: "",
  profile_image_url: "",
  resume_url: "",
  github_url: "",
  linkedin_url: "",
  instagram_url: "",
  available_for_work: true,
};

function Profile() {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Profile loading error:", error);
        setError(error.message);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          name: data.name ?? "",
          professional_title: data.professional_title ?? "",
          short_bio: data.short_bio ?? "",
          about: data.about ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          location: data.location ?? "",
          profile_image_url: data.profile_image_url ?? "",
          resume_url: data.resume_url ?? "",
          github_url: data.github_url ?? "",
          linkedin_url: data.linkedin_url ?? "",
          instagram_url: data.instagram_url ?? "",
          available_for_work: data.available_for_work ?? true,
        });
      }
    } catch (err) {
      console.error("Profile loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof ProfileData,
    value: string | boolean
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const profileData = {
        name: profile.name.trim(),
        professional_title: profile.professional_title.trim(),
        short_bio: profile.short_bio.trim(),
        about: profile.about.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        location: profile.location.trim(),
        profile_image_url: profile.profile_image_url.trim(),
        resume_url: profile.resume_url.trim(),
        github_url: profile.github_url.trim(),
        linkedin_url: profile.linkedin_url.trim(),
        instagram_url: profile.instagram_url.trim(),
        available_for_work: profile.available_for_work,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (profile.id) {
        result = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", profile.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("profiles")
          .insert(profileData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data) {
        setProfile({
          id: result.data.id,
          name: result.data.name ?? "",
          professional_title:
            result.data.professional_title ?? "",
          short_bio: result.data.short_bio ?? "",
          about: result.data.about ?? "",
          email: result.data.email ?? "",
          phone: result.data.phone ?? "",
          location: result.data.location ?? "",
          profile_image_url:
            result.data.profile_image_url ?? "",
          resume_url: result.data.resume_url ?? "",
          github_url: result.data.github_url ?? "",
          linkedin_url: result.data.linkedin_url ?? "",
          instagram_url: result.data.instagram_url ?? "",
          available_for_work:
            result.data.available_for_work ?? true,
        });
      }

      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error("Profile save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  /*
   * IMPORTANT:
   * These styles are intentionally applied directly to the inputs.
   * This prevents Chrome/Edge autofill from making the saved text
   * almost invisible.
   */
  const inputStyle = {
    color: "#f8fafc",
    WebkitTextFillColor: "#f8fafc",
    caretColor: "#22d3ee",
    backgroundColor: "#0f172a",
  } as React.CSSProperties;

  const textareaStyle = {
    color: "#f8fafc",
    WebkitTextFillColor: "#f8fafc",
    caretColor: "#22d3ee",
    backgroundColor: "#0f172a",
  } as React.CSSProperties;

  return (
    <div className="admin-page mx-auto max-w-[1280px]">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Portfolio Content
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
            Profile
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage the information displayed on your public portfolio.
          </p>
        </div>

        {/* Status */}
        <div className="w-fit rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                profile.available_for_work
                  ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.7)]"
                  : "bg-slate-600"
              }`}
            />

            <div>
              <p className="text-xs text-slate-500">
                Portfolio status
              </p>

              <p className="text-sm font-semibold text-white">
                {profile.available_for_work
                  ? "Available for work"
                  : "Currently unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10">
            ✓
          </span>

          <span>{message}</span>
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-400/10">
            !
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">

        {/* ===================================================
            FORM CARD
        =================================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/20">

          {/* Card Header */}

          <div className="border-b border-white/10 px-7 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Personal Information
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Basic details
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Keep your professional information up to date.
            </p>
          </div>

          {/* Form */}

          <div className="p-7">

            <div className="grid gap-6 md:grid-cols-2">

              {/* =================================================
                  NAME
              ================================================= */}

              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Name <span className="text-cyan-400">*</span>
                </label>

                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  value={profile.name}
                  onChange={(event) =>
                    handleChange(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Your name"
                  style={inputStyle}
                  className="admin-input w-full rounded-xl border border-white/10 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>

              {/* =================================================
                  PROFESSIONAL TITLE
              ================================================= */}

              <div>
                <label
                  htmlFor="profile-title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Professional Title{" "}
                  <span className="text-cyan-400">*</span>
                </label>

                <input
                  id="profile-title"
                  type="text"
                  autoComplete="organization-title"
                  value={profile.professional_title}
                  onChange={(event) =>
                    handleChange(
                      "professional_title",
                      event.target.value
                    )
                  }
                  placeholder="Full Stack Developer"
                  style={inputStyle}
                  className="admin-input w-full rounded-xl border border-white/10 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email <span className="text-cyan-400">*</span>
                </label>

                <input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  value={profile.email}
                  onChange={(event) =>
                    handleChange(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  style={inputStyle}
                  className="admin-input w-full rounded-xl border border-white/10 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>

              {/* =================================================
                  PHONE
              ================================================= */}

              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Phone
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    handleChange(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="+91 XXXXX XXXXX"
                  style={inputStyle}
                  className="admin-input w-full rounded-xl border border-white/10 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <div>
                <label
                  htmlFor="profile-location"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Location
                </label>

                <input
                  id="profile-location"
                  type="text"
                  autoComplete="address-level2"
                  value={profile.location}
                  onChange={(event) =>
                    handleChange(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="Mangalore, Karnataka, India"
                  style={inputStyle}
                  className="admin-input w-full rounded-xl border border-white/10 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>

              {/* =================================================
                  PROFILE IMAGE URL
              ================================================= */}

              <div>
                <label
                  htmlFor="profile-image"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Profile Image URL
                </label>

                <input
                  id="profile-image"
                  type="url"
                  autoComplete="off"
                  value={profile.profile_image_url}
                  onChange={(event) =>
                    handleChange(
                      "profile_image_url",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  style={inputStyle}
                  className="admin-input w-full rounded-xl border border-white/10 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                />
              </div>

            </div>

            {/* ===================================================
                ONLINE PRESENCE
            =================================================== */}

            <div className="mt-10 border-t border-white/10 pt-8">

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
                Online Presence
              </p>

              <h3 className="mt-2 text-lg font-semibold text-white">
                Professional links
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add links where people can find your work.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                {/* Resume */}

                <div>
                  <label
                    htmlFor="profile-resume"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Resume URL
                  </label>

                  <input
                    id="profile-resume"
                    type="url"
                    autoComplete="off"
                    value={profile.resume_url}
                    onChange={(event) =>
                      handleChange(
                        "resume_url",
                        event.target.value
                      )
                    }
                    placeholder="https://..."
                    style={inputStyle}
                    className="admin-input w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                  />
                </div>

                {/* GitHub */}

                <div>
                  <label
                    htmlFor="profile-github"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    GitHub URL
                  </label>

                  <input
                    id="profile-github"
                    type="url"
                    autoComplete="off"
                    value={profile.github_url}
                    onChange={(event) =>
                      handleChange(
                        "github_url",
                        event.target.value
                      )
                    }
                    placeholder="https://github.com/..."
                    style={inputStyle}
                    className="admin-input w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                  />
                </div>

                {/* LinkedIn */}

                <div>
                  <label
                    htmlFor="profile-linkedin"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    LinkedIn URL
                  </label>

                  <input
                    id="profile-linkedin"
                    type="url"
                    autoComplete="off"
                    value={profile.linkedin_url}
                    onChange={(event) =>
                      handleChange(
                        "linkedin_url",
                        event.target.value
                      )
                    }
                    placeholder="https://linkedin.com/in/..."
                    style={inputStyle}
                    className="admin-input w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                  />
                </div>

                {/* Instagram */}

                <div>
                  <label
                    htmlFor="profile-instagram"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Instagram URL
                  </label>

                  <input
                    id="profile-instagram"
                    type="url"
                    autoComplete="off"
                    value={profile.instagram_url}
                    onChange={(event) =>
                      handleChange(
                        "instagram_url",
                        event.target.value
                      )
                    }
                    placeholder="https://instagram.com/..."
                    style={inputStyle}
                    className="admin-input w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                  />
                </div>

              </div>
            </div>

            {/* ===================================================
                BIO
            =================================================== */}

            <div className="mt-10 border-t border-white/10 pt-8">

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
                About You
              </p>

              <div className="mt-6 space-y-6">

                {/* Short Bio */}

                <div>
                  <label
                    htmlFor="profile-short-bio"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Short Bio
                  </label>

                  <textarea
                    id="profile-short-bio"
                    rows={4}
                    value={profile.short_bio}
                    onChange={(event) =>
                      handleChange(
                        "short_bio",
                        event.target.value
                      )
                    }
                    placeholder="A short introduction..."
                    style={textareaStyle}
                    className="admin-textarea w-full resize-y rounded-xl border border-white/10 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                  />
                </div>

                {/* About */}

                <div>
                  <label
                    htmlFor="profile-about"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    About
                  </label>

                  <textarea
                    id="profile-about"
                    rows={7}
                    value={profile.about}
                    onChange={(event) =>
                      handleChange(
                        "about",
                        event.target.value
                      )
                    }
                    placeholder="Write your detailed about section..."
                    style={textareaStyle}
                    className="admin-textarea w-full resize-y rounded-xl border border-white/10 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/5"
                  />
                </div>

              </div>
            </div>

            {/* ===================================================
                AVAILABILITY
            =================================================== */}

            <div className="mt-10 border-t border-white/10 pt-8">

              <label className="flex cursor-pointer items-start gap-4">

                <input
                  type="checkbox"
                  checked={profile.available_for_work}
                  onChange={(event) =>
                    handleChange(
                      "available_for_work",
                      event.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5 cursor-pointer rounded border-white/20 bg-slate-900 accent-cyan-400"
                />

                <span>
                  <span className="block font-semibold text-white">
                    Available for work
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-slate-500">
                    Show that you are currently available
                    for opportunities.
                  </span>
                </span>

              </label>
            </div>

            {/* ===================================================
                SAVE
            =================================================== */}

            <div className="mt-8 flex flex-col-reverse gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-slate-600">
                Changes are saved to your portfolio profile.
              </p>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

            </div>

          </div>
        </div>

        {/* =====================================================
            LIVE PREVIEW
        ===================================================== */}

        <div className="h-fit overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">

          <div className="border-b border-white/10 px-6 py-5">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Live Preview
            </p>

            <h2 className="mt-2 text-lg font-bold text-white">
              Profile Card
            </h2>

          </div>

          <div className="p-6">

            {/* Avatar */}

            <div className="flex justify-center">

              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.name || "Profile"}
                  className="h-32 w-32 rounded-3xl border border-cyan-400/20 object-cover shadow-xl shadow-cyan-400/5"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-slate-900 text-5xl font-bold text-cyan-400">
                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "P"}
                </div>
              )}

            </div>

            {/* Name */}

            <div className="mt-6 text-center">

              <h3 className="text-2xl font-bold text-white">
                {profile.name || "Your Name"}
              </h3>

              <p className="mt-1 font-semibold text-cyan-400">
                {profile.professional_title ||
                  "Professional Title"}
              </p>

            </div>

            {/* Availability */}

            <div className="mt-5 flex justify-center">

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-slate-300">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    profile.available_for_work
                      ? "bg-emerald-400"
                      : "bg-slate-600"
                  }`}
                />

                {profile.available_for_work
                  ? "Available for work"
                  : "Currently unavailable"}

              </div>

            </div>

            {/* Short Bio */}

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">

              <p className="text-sm leading-6 text-slate-400">
                {profile.short_bio ||
                  "Your short bio will appear here."}
              </p>

            </div>

            {/* Contact */}

            <div className="mt-5 space-y-3">

              {profile.email && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm">
                    ✉️
                  </span>

                  <span className="truncate text-sm text-slate-300">
                    {profile.email}
                  </span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm">
                    📍
                  </span>

                  <span className="truncate text-sm text-slate-300">
                    {profile.location}
                  </span>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="text-sm">
                    📞
                  </span>

                  <span className="truncate text-sm text-slate-300">
                    {profile.phone}
                  </span>
                </div>
              )}

            </div>

            {/* Social Links */}

            {(profile.github_url ||
              profile.linkedin_url ||
              profile.instagram_url ||
              profile.resume_url) && (
              <div className="mt-6 border-t border-white/10 pt-5">

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Links
                </p>

                <div className="flex flex-wrap gap-2">

                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      GitHub ↗
                    </a>
                  )}

                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      LinkedIn ↗
                    </a>
                  )}

                  {profile.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      Instagram ↗
                    </a>
                  )}

                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      Resume ↗
                    </a>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;