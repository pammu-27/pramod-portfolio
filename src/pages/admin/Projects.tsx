import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  long_description?: string | null;
  live_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
  image_url: string | null;
  sort_order: number | null;
  featured: boolean;
  is_published: boolean;
  created_at?: string;
};

type ProjectForm = {
  title: string;
  slug: string;
  category: string;
  description: string;
  long_description: string;
  live_url: string;
  github_url: string;
  technologies: string;
  image_url: string;
  sort_order: string;
  featured: boolean;
  is_published: boolean;
};

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  category: "",
  description: "",
  long_description: "",
  live_url: "",
  github_url: "",
  technologies: "",
  image_url: "",
  sort_order: "0",
  featured: false,
  is_published: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(editingId);

  const publishedCount = useMemo(
    () => projects.filter((project) => project.is_published).length,
    [projects]
  );

  const featuredCount = useMemo(
    () => projects.filter((project) => project.featured).length,
    [projects]
  );

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
      setProjects([]);
    } else {
      setProjects((data ?? []) as Project[]);
    }

    setLoading(false);
  }

  function updateField<K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: editingId ? current.slug : slugify(value),
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function startEdit(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title ?? "",
      slug: project.slug ?? "",
      category: project.category ?? "",
      description: project.description ?? "",
      long_description: project.long_description ?? "",
      live_url: project.live_url ?? "",
      github_url: project.github_url ?? "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      image_url: project.image_url ?? "",
      sort_order: String(project.sort_order ?? 0),
      featured: Boolean(project.featured),
      is_published: Boolean(project.is_published),
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSave() {
    setMessage("");
    setError("");

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    setSaving(true);

    const technologies = form.technologies
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      category: form.category.trim(),
      description: form.description.trim() || null,
      long_description: form.long_description.trim() || null,
      live_url: normalizeUrl(form.live_url),
      github_url: normalizeUrl(form.github_url),
      technologies,
      image_url: normalizeUrl(form.image_url),
      sort_order: Number(form.sort_order) || 0,
      featured: form.featured,
      is_published: form.is_published,
    };

    let saveError = null;

    if (editingId) {
      const result = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);

      saveError = result.error;
    } else {
      const result = await supabase
        .from("projects")
        .insert(payload);

      saveError = result.error;
    }

    if (saveError) {
      console.error(saveError);
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setSaving(false);

    setMessage(
      editingId
        ? "Project updated successfully!"
        : "Project created successfully!"
    );

    resetForm();
    await loadProjects();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: string) {
    const project = projects.find((item) => item.id === id);

    if (!project) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage("Project deleted successfully.");
    setDeletingId(null);

    await loadProjects();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
              Portfolio Content
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Projects
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Add, edit and manage your portfolio projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15">
            ✓
          </span>
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-400/15">
            !
          </span>
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Total Projects
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Published
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Featured
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-400">
            {featuredCount}
          </p>
        </div>
      </div>

      {/* FORM */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl shadow-black/20">
        {/* FORM HEADER */}
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              {isEditing ? "Edit Project" : "New Project"}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {isEditing ? "Update project" : "Add new project"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {isEditing
                ? "Update the project information displayed on your portfolio."
                : "Create a new project for your portfolio."}
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {/* BASIC INFORMATION */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Basic Information
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              Project details
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Basic information about your project.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* TITLE */}
            <FormField label="Project Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(event.target.value)
                }
                placeholder="My Portfolio Website"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>

            {/* SLUG */}
            <FormField label="Slug" required hint="Used for the project URL.">
              <input
                type="text"
                value={form.slug}
                onChange={(event) =>
                  updateField("slug", slugify(event.target.value))
                }
                placeholder="my-portfolio-website"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>

            {/* CATEGORY */}
            <FormField label="Category">
              <input
                type="text"
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                placeholder="Web App"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>

            {/* SORT ORDER */}
            <FormField label="Display Order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) =>
                  updateField("sort_order", event.target.value)
                }
                placeholder="0"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>
          </div>

          {/* IMAGE */}
          <div className="mt-6">
            <FormField
              label="Project Image URL"
              hint="Optional. Add a public image URL."
            >
              <input
                type="url"
                value={form.image_url}
                onChange={(event) =>
                  updateField("image_url", event.target.value)
                }
                placeholder="https://example.com/project-image.jpg"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>
          </div>

          {/* URLS */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <FormField label="Live Project URL">
              <input
                type="url"
                value={form.live_url}
                onChange={(event) =>
                  updateField("live_url", event.target.value)
                }
                placeholder="https://your-project.vercel.app"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>

            <FormField label="GitHub URL">
              <input
                type="url"
                value={form.github_url}
                onChange={(event) =>
                  updateField("github_url", event.target.value)
                }
                placeholder="https://github.com/username/project"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>
          </div>

          {/* TECHNOLOGIES */}
          <div className="mt-6">
            <FormField
              label="Technologies"
              hint="Separate technologies with commas."
            >
              <input
                type="text"
                value={form.technologies}
                onChange={(event) =>
                  updateField("technologies", event.target.value)
                }
                placeholder="React, TypeScript, Supabase, Tailwind CSS"
                className={inputClass}
                style={inputTextStyle}
              />
            </FormField>

            {form.technologies.trim() && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.technologies
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300"
                    >
                      {technology}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Project Description
            </p>

            <div className="space-y-6">
              <FormField label="Short Description">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Brief project description..."
                  className={`${inputClass} resize-y leading-6`}
                  style={inputTextStyle}
                />
              </FormField>

              <FormField label="Long Description">
                <textarea
                  rows={7}
                  value={form.long_description}
                  onChange={(event) =>
                    updateField(
                      "long_description",
                      event.target.value
                    )
                  }
                  placeholder="Detailed project description..."
                  className={`${inputClass} resize-y leading-6`}
                  style={inputTextStyle}
                />
              </FormField>
            </div>
          </div>

          {/* STATUS */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Visibility
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-white/20">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    updateField("featured", event.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-cyan-400"
                />

                <span>
                  <span className="block text-sm font-medium text-white">
                    Featured project
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Highlight this project on your portfolio.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-white/20">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(event) =>
                    updateField(
                      "is_published",
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4 accent-cyan-400"
                />

                <span>
                  <span className="block text-sm font-medium text-white">
                    Published
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Show this project on the public portfolio.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* SAVE */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Project"
                  : "Save Project"}
            </button>
          </div>
        </div>
      </section>

      {/* PROJECT LIST */}
      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Portfolio
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-sm text-slate-500">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
              🚀
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              No projects yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first project using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 transition hover:border-cyan-400/20"
              >
                <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center">
                  {/* IMAGE */}
                  <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-950 md:w-44">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-4xl">🚀</span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {project.title}
                      </h3>

                      {project.featured && (
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                          ★ Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          project.is_published
                            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : "border border-slate-400/20 bg-slate-400/10 text-slate-400"
                        }`}
                      >
                        {project.is_published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-cyan-400">
                      {project.category || "Web Project"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {project.description ||
                        "No description provided."}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.technologies
                            .slice(0, 5)
                            .map((technology) => (
                              <span
                                key={technology}
                                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400"
                              >
                                {technology}
                              </span>
                            ))}
                        </div>
                      )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex shrink-0 gap-2 md:flex-col">
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="rounded-xl border border-red-400/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-400/30 hover:bg-red-400/5 disabled:opacity-50"
                    >
                      {deletingId === project.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   FORM COMPONENT
========================================================= */

function FormField({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}

        {required && (
          <span className="ml-1 text-cyan-400">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   INPUT STYLES
========================================================= */

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50";

const inputTextStyle = {
  color: "#ffffff",
  WebkitTextFillColor: "#ffffff",
  caretColor: "#22d3ee",
};