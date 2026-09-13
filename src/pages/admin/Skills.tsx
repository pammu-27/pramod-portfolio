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
  created_at?: string;
  updated_at?: string;
};

type SkillForm = {
  name: string;
  category: string;
  percentage: number;
  icon: string;
  sort_order: number;
  is_visible: boolean;
};

const emptyForm: SkillForm = {
  name: "",
  category: "",
  percentage: 80,
  icon: "⭐",
  sort_order: 1,
  is_visible: true,
};

function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<SkillForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(editingId);

  useEffect(() => {
    loadSkills();
  }, []);

  /* =====================================================
     LOAD SKILLS
  ===================================================== */

  async function loadSkills() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Skills loading error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setSkills((data ?? []) as Skill[]);
    setLoading(false);
  }

  /* =====================================================
     INPUT HANDLER
  ===================================================== */

  function handleChange(
    field: keyof SkillForm,
    value: string | number | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  /* =====================================================
     SAVE
  ===================================================== */

  async function handleSave() {
    setMessage("");
    setError("");

    const name = form.name.trim();
    const category = form.category.trim();

    if (!name) {
      setError("Skill name is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    const percentage = Number(form.percentage);

    if (percentage < 0 || percentage > 100) {
      setError("Skill percentage must be between 0 and 100.");
      return;
    }

    setSaving(true);

    const skillData = {
      name,
      category,
      percentage,
      icon: form.icon.trim() || "⭐",
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
      updated_at: new Date().toISOString(),
    };

    try {
      /* =================================================
         UPDATE
      ================================================= */

      if (editingId) {
        const { data, error } = await supabase
          .from("skills")
          .update(skillData)
          .eq("id", editingId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setSkills((current) =>
          current
            .map((skill) =>
              skill.id === editingId
                ? (data as Skill)
                : skill
            )
            .sort(
              (a, b) =>
                Number(a.sort_order) - Number(b.sort_order)
            )
        );

        setMessage("Skill updated successfully!");
      }

      /* =================================================
         INSERT
      ================================================= */

      else {
        const { data, error } = await supabase
          .from("skills")
          .insert(skillData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setSkills((current) =>
          [...current, data as Skill].sort(
            (a, b) =>
              Number(a.sort_order) - Number(b.sort_order)
          )
        );

        setMessage("Skill added successfully!");
      }

      setForm({
        ...emptyForm,
        sort_order: skills.length + 1,
      });

      setEditingId(null);
    } catch (err) {
      console.error("Skill save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     EDIT
  ===================================================== */

  function handleEdit(skill: Skill) {
    setEditingId(skill.id);

    setForm({
      name: skill.name ?? "",
      category: skill.category ?? "",
      percentage: Number(skill.percentage ?? 0),
      icon: skill.icon ?? "⭐",
      sort_order: Number(skill.sort_order ?? 0),
      is_visible: skill.is_visible ?? true,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  function handleCancelEdit() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: skills.length + 1,
    });

    setMessage("");
    setError("");
  }

  /* =====================================================
     ADD NEW
  ===================================================== */

  function handleAddNew() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: skills.length + 1,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function handleDelete(id: string) {
    const skill = skills.find((item) => item.id === id);

    if (!skill) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${skill.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");
    setError("");

    const previousSkills = skills;

    // Instant UI update
    setSkills((current) =>
      current.filter((item) => item.id !== id)
    );

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Skill delete error:", error);

      // Rollback
      setSkills(previousSkills);

      setError(error.message);
      setDeletingId(null);
      return;
    }

    setMessage("Skill deleted successfully!");

    if (editingId === id) {
      handleCancelEdit();
    }

    setDeletingId(null);
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="mx-auto max-w-7xl">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Portfolio Content
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Skills
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Manage your technical and professional skills.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
        >
          + Add Skill
        </button>
      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10">
            ✓
          </span>

          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-400/10">
            !
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl shadow-black/20">
        {/* FORM HEADER */}

        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              {isEditing ? "Edit Skill" : "New Skill"}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {isEditing ? "Update skill" : "Add new skill"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isEditing
                ? "Update this skill on your portfolio."
                : "Add a skill to your portfolio."}
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {/* FORM GRID */}

          <div className="grid gap-6 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className={labelClass}>
                Skill Name <span className="text-cyan-400">*</span>
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                placeholder="React"
                className={inputClass}
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className={labelClass}>
                Category <span className="text-cyan-400">*</span>
              </label>

              <input
                type="text"
                value={form.category}
                onChange={(event) =>
                  handleChange(
                    "category",
                    event.target.value
                  )
                }
                placeholder="Web Development"
                className={inputClass}
              />
            </div>

            {/* PERCENTAGE */}

            <div>
              <label className={labelClass}>
                Skill Percentage
              </label>

              <div className="flex gap-3">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.percentage}
                  onChange={(event) =>
                    handleChange(
                      "percentage",
                      Number(event.target.value)
                    )
                  }
                  className={inputClass}
                />

                <div className="flex min-w-[55px] items-center justify-center rounded-xl border border-white/10 bg-slate-950 px-4 text-sm font-semibold text-cyan-400">
                  %
                </div>
              </div>
            </div>

            {/* ICON */}

            <div>
              <label className={labelClass}>
                Icon
              </label>

              <input
                type="text"
                value={form.icon}
                onChange={(event) =>
                  handleChange(
                    "icon",
                    event.target.value
                  )
                }
                placeholder="⭐"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-500">
                You can use an emoji or icon identifier.
              </p>
            </div>

            {/* SORT ORDER */}

            <div>
              <label className={labelClass}>
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
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(event) =>
                    handleChange(
                      "is_visible",
                      event.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5 accent-cyan-400"
                />

                <span>
                  <span className="block font-medium text-white">
                    Visible
                  </span>

                  <span className="mt-1 block text-sm text-slate-500">
                    Show this skill on your public portfolio.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* =================================================
              LIVE PROGRESS PREVIEW
          ================================================= */}

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Progress Preview
              </span>

              <span className="text-sm font-bold text-cyan-400">
                {Math.min(
                  100,
                  Math.max(0, Number(form.percentage) || 0)
                )}
                %
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      Number(form.percentage) || 0
                    )
                  )}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg">
                {form.icon || "⭐"}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {form.name || "Skill Name"}
                </p>

                <p className="text-xs text-slate-500">
                  {form.category || "Category"}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
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
              className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Skill"
                  : "Save Skill"}
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          SKILLS LIST
      ================================================= */}

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Portfolio
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Your Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {skills.length}{" "}
              {skills.length === 1 ? "skill" : "skills"}
            </p>
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-sm text-slate-500">
              Loading skills...
            </p>
          </div>
        ) : skills.length === 0 ? (
          /* EMPTY */

          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
              ⭐
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              No skills yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first skill using the form above.
            </p>
          </div>
        ) : (
          /* SKILLS */

          <div className="grid gap-5 md:grid-cols-2">
            {skills.map((skill) => {
              const percentage = Math.min(
                100,
                Math.max(0, Number(skill.percentage) || 0)
              );

              return (
                <article
                  key={skill.id}
                  className="group rounded-2xl border border-white/10 bg-slate-900/40 p-6 transition duration-300 hover:border-cyan-400/20 hover:bg-slate-900/60"
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-xl">
                        {skill.icon || "⭐"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-white">
                          {skill.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {skill.category}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-lg font-bold text-cyan-400">
                      {percentage}%
                    </span>
                  </div>

                  {/* PROGRESS */}

                  <div className="mt-5">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        skill.is_visible
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-slate-400/10 text-slate-400"
                      }`}
                    >
                      {skill.is_visible
                        ? "● Visible"
                        : "○ Hidden"}
                    </span>

                    <span className="text-xs text-slate-600">
                      Order: {skill.sort_order}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-3 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={() => handleEdit(skill)}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(skill.id)
                      }
                      disabled={deletingId === skill.id}
                      className="flex-1 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === skill.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const labelClass =
  "mb-2 block text-sm font-medium text-slate-200";

const inputClass =
  "admin-input w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/10";

export default Skills;