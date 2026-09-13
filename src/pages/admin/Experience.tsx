import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Experience = {
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

type ExperienceForm = {
  job_title: string;
  company: string;
  client: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string;
  sort_order: number;
  is_visible: boolean;
};

const emptyForm: ExperienceForm = {
  job_title: "",
  company: "",
  client: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  responsibilities: "",
  sort_order: 1,
  is_visible: true,
};

const inputClass =
  "admin-input rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

const textareaClass =
  "admin-input min-h-[140px] resize-y rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Experience loading error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setExperiences((data ?? []) as Experience[]);
    setLoading(false);
  }

  function handleChange(
    field: keyof ExperienceForm,
    value: string | boolean | number
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave() {
    if (!form.job_title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.company.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!form.start_date) {
      setError("Start date is required.");
      return;
    }

    if (!form.is_current && !form.end_date) {
      setError(
        "Add an end date or mark this as your current experience."
      );
      return;
    }

    if (
      form.end_date &&
      !form.is_current &&
      form.end_date < form.start_date
    ) {
      setError("End date cannot be before the start date.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const experienceData = {
      job_title: form.job_title.trim(),
      company: form.company.trim(),
      client: form.client.trim(),
      location: form.location.trim(),
      start_date: form.start_date,
      end_date: form.is_current
        ? null
        : form.end_date || null,
      is_current: form.is_current,
      description: form.description.trim(),
      responsibilities: form.responsibilities
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("experiences")
          .update(experienceData)
          .eq("id", editingId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setExperiences((current) =>
          current
            .map((experience) =>
              experience.id === editingId
                ? (data as Experience)
                : experience
            )
            .sort(
              (a, b) =>
                a.sort_order - b.sort_order
            )
        );

        setMessage(
          "Experience updated successfully!"
        );
      } else {
        const { data, error } = await supabase
          .from("experiences")
          .insert(experienceData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setExperiences((current) =>
          [...current, data as Experience].sort(
            (a, b) =>
              a.sort_order - b.sort_order
          )
        );

        setMessage(
          "Experience added successfully!"
        );
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error("Experience save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save experience."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(experience: Experience) {
    setEditingId(experience.id);

    setForm({
      job_title: experience.job_title ?? "",
      company: experience.company ?? "",
      client: experience.client ?? "",
      location: experience.location ?? "",
      start_date: experience.start_date ?? "",
      end_date: experience.end_date ?? "",
      is_current: experience.is_current ?? false,
      description: experience.description ?? "",
      responsibilities:
        experience.responsibilities?.join("\n") ?? "",
      sort_order: experience.sort_order ?? 0,
      is_visible: experience.is_visible ?? true,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  function handleAddNew() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: experiences.length + 1,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const previousExperiences = experiences;

    setExperiences((current) =>
      current.filter(
        (experience) => experience.id !== id
      )
    );

    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Experience delete error:",
        error
      );

      setExperiences(previousExperiences);
      setError(error.message);
      return;
    }

    setMessage(
      "Experience deleted successfully!"
    );

    if (editingId === id) {
      handleCancelEdit();
    }
  }

  return (
    <div className="admin-page mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Portfolio Content
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Experience
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your professional work experience.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          + Add Experience
        </button>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
          ⚠ {error}
        </div>
      )}

      {/* FORM */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              {editingId
                ? "Edit Experience"
                : "New Experience"}
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              {editingId
                ? "Update experience"
                : "Add new experience"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update your work experience."
                : "Add a new position to your portfolio."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* JOB TITLE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Job Title *
            </label>

            <input
              type="text"
              value={form.job_title}
              onChange={(event) =>
                handleChange(
                  "job_title",
                  event.target.value
                )
              }
              placeholder="Command Center Operator"
              autoComplete="organization-title"
              className={inputClass}
            />
          </div>

          {/* COMPANY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Company *
            </label>

            <input
              type="text"
              value={form.company}
              onChange={(event) =>
                handleChange(
                  "company",
                  event.target.value
                )
              }
              placeholder="CMS Info Systems"
              autoComplete="organization"
              className={inputClass}
            />
          </div>

          {/* CLIENT */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Client
            </label>

            <input
              type="text"
              value={form.client}
              onChange={(event) =>
                handleChange(
                  "client",
                  event.target.value
                )
              }
              placeholder="Union Bank of India"
              className={inputClass}
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Location
            </label>

            <input
              type="text"
              value={form.location}
              onChange={(event) =>
                handleChange(
                  "location",
                  event.target.value
                )
              }
              placeholder="Mangalore, Karnataka"
              className={inputClass}
            />
          </div>

          {/* START DATE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Start Date *
            </label>

            <input
              type="date"
              value={form.start_date}
              onChange={(event) =>
                handleChange(
                  "start_date",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              End Date
            </label>

            <input
              type="date"
              value={form.end_date}
              disabled={form.is_current}
              min={form.start_date || undefined}
              onChange={(event) =>
                handleChange(
                  "end_date",
                  event.target.value
                )
              }
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-40`}
            />

            {form.is_current && (
              <p className="mt-2 text-xs text-slate-500">
                End date is disabled because this is
                your current position.
              </p>
            )}
          </div>

          {/* CURRENT POSITION */}
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.04]">
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={(event) => {
                  const checked =
                    event.target.checked;

                  setForm((current) => ({
                    ...current,
                    is_current: checked,
                    end_date: checked
                      ? ""
                      : current.end_date,
                  }));

                  setMessage("");
                  setError("");
                }}
                className="h-5 w-5 cursor-pointer accent-cyan-400"
              />

              <span>
                <span className="block font-medium text-white">
                  Currently working here
                </span>

                <span className="text-sm text-slate-500">
                  Leave end date empty for your current
                  position.
                </span>
              </span>
            </label>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                handleChange(
                  "description",
                  event.target.value
                )
              }
              placeholder="Describe your role and overall responsibilities..."
              className={textareaClass}
            />
          </div>

          {/* RESPONSIBILITIES */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Responsibilities
            </label>

            <textarea
              rows={7}
              value={form.responsibilities}
              onChange={(event) =>
                handleChange(
                  "responsibilities",
                  event.target.value
                )
              }
              placeholder={`Monitor ATM operations
Coordinate with field engineers
Prepare daily reports
Handle escalations`}
              className={textareaClass}
            />

            <p className="mt-2 text-xs text-slate-500">
              Enter one responsibility per line.
            </p>
          </div>

          {/* SORT ORDER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Sort Order
            </label>

            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(event) =>
                handleChange(
                  "sort_order",
                  Number(event.target.value)
                )
              }
              className={inputClass}
            />

            <p className="mt-2 text-xs text-slate-500">
              Lower numbers appear first.
            </p>
          </div>

          {/* VISIBILITY */}
          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(event) =>
                  handleChange(
                    "is_visible",
                    event.target.checked
                  )
                }
                className="h-5 w-5 cursor-pointer accent-cyan-400"
              />

              <span>
                <span className="block font-medium text-white">
                  Visible
                </span>

                <span className="text-sm text-slate-500">
                  Show this experience on your public
                  portfolio.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* SAVE */}
        <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Experience"
                : "Save Experience"}
          </button>
        </div>
      </div>

      {/* EXPERIENCE LIST */}
      <div>
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Your Career
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Work Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {experiences.length} experience
            {experiences.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="text-sm text-slate-400">
              Loading experience...
            </p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="mb-4 text-5xl">
              💼
            </div>

            <h3 className="text-lg font-semibold text-white">
              No experience yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first work experience above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {experiences.map((experience) => (
              <article
                key={experience.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
              >
                {/* TOP */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        {experience.job_title}
                      </h3>

                      {experience.is_current && (
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-cyan-400">
                      {experience.company}
                    </p>

                    {experience.client && (
                      <p className="mt-1 text-sm text-slate-500">
                        Client: {experience.client}
                      </p>
                    )}
                  </div>

                  <span
                    className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${
                      experience.is_visible
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-slate-400/10 text-slate-400"
                    }`}
                  >
                    {experience.is_visible
                      ? "Visible"
                      : "Hidden"}
                  </span>
                </div>

                {/* META */}
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span>
                    📅 {experience.start_date}
                    {" → "}
                    {experience.is_current
                      ? "Present"
                      : experience.end_date || "—"}
                  </span>

                  {experience.location && (
                    <span>
                      📍 {experience.location}
                    </span>
                  )}

                  <span>
                    Order: {experience.sort_order}
                  </span>
                </div>

                {/* DESCRIPTION */}
                {experience.description && (
                  <p className="mt-5 text-sm leading-7 text-slate-400">
                    {experience.description}
                  </p>
                )}

                {/* RESPONSIBILITIES */}
                {experience.responsibilities?.length >
                  0 && (
                  <div className="mt-5">
                    <h4 className="mb-3 text-sm font-semibold text-white">
                      Responsibilities
                    </h4>

                    <ul className="space-y-2">
                      {experience.responsibilities.map(
                        (responsibility, index) => (
                          <li
                            key={`${experience.id}-${index}`}
                            className="flex gap-3 text-sm leading-6 text-slate-400"
                          >
                            <span className="text-cyan-400">
                              •
                            </span>

                            <span>
                              {responsibility}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(experience)
                    }
                    className="rounded-lg border border-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(experience.id)
                    }
                    className="rounded-lg border border-red-400/20 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Experience;