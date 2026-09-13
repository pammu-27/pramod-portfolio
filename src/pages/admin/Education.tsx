import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Education = {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  start_year: number;
  end_year: number;
  percentage: number | null;
  grade: string | null;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
};

type EducationForm = {
  qualification: string;
  institution: string;
  location: string;
  start_year: number;
  end_year: number;
  percentage: number;
  grade: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
};

const currentYear = new Date().getFullYear();

const emptyForm: EducationForm = {
  qualification: "",
  institution: "",
  location: "",
  start_year: currentYear,
  end_year: currentYear,
  percentage: 0,
  grade: "",
  description: "",
  sort_order: 1,
  is_visible: true,
};

function Education() {
  const [education, setEducation] = useState<Education[]>([]);
  const [form, setForm] = useState<EducationForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     LOAD EDUCATION
  ===================================================== */

  useEffect(() => {
    loadEducation();
  }, []);

  async function loadEducation() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Education loading error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setEducation((data ?? []) as Education[]);
    setLoading(false);
  }

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  function handleChange(
    field: keyof EducationForm,
    value: string | number | boolean,
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

    if (!form.qualification.trim()) {
      setError("Qualification is required.");
      return;
    }

    if (!form.institution.trim()) {
      setError("Institution is required.");
      return;
    }

    if (!form.start_year) {
      setError("Start year is required.");
      return;
    }

    if (!form.end_year) {
      setError("End year is required.");
      return;
    }

    if (
      Number(form.start_year) < 1900 ||
      Number(form.start_year) > 2100
    ) {
      setError("Start year must be between 1900 and 2100.");
      return;
    }

    if (
      Number(form.end_year) < 1900 ||
      Number(form.end_year) > 2100
    ) {
      setError("End year must be between 1900 and 2100.");
      return;
    }

    if (form.end_year < form.start_year) {
      setError("End year cannot be before start year.");
      return;
    }

    if (
      Number(form.percentage) < 0 ||
      Number(form.percentage) > 100
    ) {
      setError("Percentage must be between 0 and 100.");
      return;
    }

    setSaving(true);

    const educationData = {
      qualification: form.qualification.trim(),
      institution: form.institution.trim(),
      location: form.location.trim(),
      start_year: Number(form.start_year),
      end_year: Number(form.end_year),
      percentage: Number(form.percentage) || 0,
      grade: form.grade.trim() || null,
      description: form.description.trim() || null,
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
          .from("education")
          .update(educationData)
          .eq("id", editingId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setEducation((current) =>
          current
            .map((item) =>
              item.id === editingId
                ? (data as Education)
                : item,
            )
            .sort((a, b) => a.sort_order - b.sort_order),
        );

        setMessage("Education updated successfully!");
      }

      /* =================================================
         INSERT
      ================================================= */

      else {
        const { data, error } = await supabase
          .from("education")
          .insert(educationData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setEducation((current) =>
          [...current, data as Education].sort(
            (a, b) => a.sort_order - b.sort_order,
          ),
        );

        setMessage("Education added successfully!");
      }

      setForm({
        ...emptyForm,
        sort_order: education.length + 1,
      });

      setEditingId(null);
    } catch (err) {
      console.error("Education save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save education.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     EDIT
  ===================================================== */

  function handleEdit(item: Education) {
    setEditingId(item.id);

    setForm({
      qualification: item.qualification ?? "",
      institution: item.institution ?? "",
      location: item.location ?? "",
      start_year: item.start_year ?? currentYear,
      end_year: item.end_year ?? currentYear,
      percentage: item.percentage ?? 0,
      grade: item.grade ?? "",
      description: item.description ?? "",
      sort_order: item.sort_order ?? 0,
      is_visible: item.is_visible ?? true,
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
    setForm(emptyForm);
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
      sort_order: education.length + 1,
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this education entry?",
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    const previousEducation = education;

    // Optimistic UI
    setEducation((current) =>
      current.filter((item) => item.id !== id),
    );

    const { error } = await supabase
      .from("education")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Education delete error:", error);

      setEducation(previousEducation);
      setError(error.message);
      return;
    }

    setMessage("Education deleted successfully!");

    if (editingId === id) {
      handleCancelEdit();
    }
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="mx-auto w-full max-w-7xl text-white">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
            Portfolio Content
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Education
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Manage your academic qualifications and education
            history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20"
        >
          <span className="text-lg leading-none transition-transform group-hover:rotate-90">
            +
          </span>

          Add Education
        </button>
      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
            ✓
          </span>

          {message}
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-400/10">
            !
          </span>

          {error}
        </div>
      )}

      {/* =================================================
          FORM CARD
      ================================================= */}

      <section className="mb-10 rounded-2xl border border-white/[0.08] bg-[#080d1a] shadow-2xl shadow-black/20">

        {/* FORM TOP */}

        <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.08] text-lg">
                🎓
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  {editingId
                    ? "Edit Education"
                    : "Add New Education"}
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {editingId
                    ? "Update this education entry."
                    : "Add a new academic qualification."}
                </p>
              </div>

            </div>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white sm:text-sm"
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        {/* FORM BODY */}

        <div className="px-6 py-7 sm:px-8 sm:py-8">

          <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">

            {/* QUALIFICATION */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Qualification
                <span className="ml-1 text-cyan-400">*</span>
              </label>

              <input
                type="text"
                value={form.qualification}
                onChange={(event) =>
                  handleChange(
                    "qualification",
                    event.target.value,
                  )
                }
                placeholder="Bachelor of Computer Applications"
                className="admin-input"
              />
            </div>

            {/* INSTITUTION */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Institution
                <span className="ml-1 text-cyan-400">*</span>
              </label>

              <input
                type="text"
                value={form.institution}
                onChange={(event) =>
                  handleChange(
                    "institution",
                    event.target.value,
                  )
                }
                placeholder="University / College Name"
                className="admin-input"
              />
            </div>

            {/* LOCATION */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </label>

              <input
                type="text"
                value={form.location}
                onChange={(event) =>
                  handleChange(
                    "location",
                    event.target.value,
                  )
                }
                placeholder="Mangalore, Karnataka"
                className="admin-input"
              />
            </div>

            {/* START YEAR */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Start Year
                <span className="ml-1 text-cyan-400">*</span>
              </label>

              <input
                type="number"
                min="1900"
                max="2100"
                value={form.start_year}
                onChange={(event) =>
                  handleChange(
                    "start_year",
                    Number(event.target.value),
                  )
                }
                className="admin-input"
              />
            </div>

            {/* END YEAR */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                End Year
                <span className="ml-1 text-cyan-400">*</span>
              </label>

              <input
                type="number"
                min="1900"
                max="2100"
                value={form.end_year}
                onChange={(event) =>
                  handleChange(
                    "end_year",
                    Number(event.target.value),
                  )
                }
                className="admin-input"
              />
            </div>

            {/* PERCENTAGE */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Percentage
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.percentage}
                  onChange={(event) =>
                    handleChange(
                      "percentage",
                      Number(event.target.value),
                    )
                  }
                  className="admin-input pr-12"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-cyan-400">
                  %
                </span>
              </div>
            </div>

            {/* GRADE */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Grade
              </label>

              <input
                type="text"
                value={form.grade}
                onChange={(event) =>
                  handleChange(
                    "grade",
                    event.target.value,
                  )
                }
                placeholder="A+ / First Class / Distinction"
                className="admin-input"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Description
              </label>

              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Add details about your education, achievements, coursework, etc."
                className="admin-input min-h-[120px] resize-y"
              />
            </div>

            {/* SORT ORDER */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sort Order
              </label>

              <input
                type="number"
                min="0"
                value={form.sort_order}
                onChange={(event) =>
                  handleChange(
                    "sort_order",
                    Number(event.target.value),
                  )
                }
                className="admin-input"
              />

              <p className="mt-2 text-xs text-slate-600">
                Lower numbers appear first.
              </p>
            </div>

            {/* VISIBILITY */}

            <div className="flex items-center">

              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.03]">

                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(event) =>
                    handleChange(
                      "is_visible",
                      event.target.checked,
                    )
                  }
                  className="h-5 w-5 cursor-pointer rounded accent-cyan-400"
                />

                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    Visible
                  </span>

                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                    Show this education on your public
                    portfolio.
                  </span>
                </span>

              </label>

            </div>

          </div>

          {/* FORM FOOTER */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-end">

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="h-11 rounded-xl border border-white/10 px-6 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 rounded-xl bg-cyan-400 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Education"
                  : "Save Education"}
            </button>

          </div>
        </div>
      </section>

      {/* =================================================
          EDUCATION HISTORY
      ================================================= */}

      <section>

        <div className="mb-5 flex items-end justify-between">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Education History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {education.length}{" "}
              {education.length === 1
                ? "entry"
                : "entries"}
            </p>
          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#080d1a] p-12 text-center">

            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="text-sm text-slate-400">
              Loading education...
            </p>

          </div>
        ) : education.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="rounded-2xl border border-dashed border-white/10 bg-[#080d1a] p-12 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/[0.07] text-3xl">
              🎓
            </div>

            <h3 className="text-lg font-semibold text-white">
              No education entries yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first qualification above.
            </p>

            <button
              type="button"
              onClick={handleAddNew}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              + Add Education
            </button>

          </div>
        ) : (

          /* =================================================
             EDUCATION CARDS
          ================================================= */

          <div className="grid gap-5">

            {education.map((item) => (
              <article
                key={item.id}
                className="group rounded-2xl border border-white/[0.08] bg-[#080d1a] p-6 transition-all duration-200 hover:border-cyan-400/20 hover:bg-[#0a1020] sm:p-7"
              >

                {/* CARD HEADER */}

                <div className="flex flex-col justify-between gap-4 sm:flex-row">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-xl font-semibold text-white">
                        {item.qualification}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          item.is_visible
                            ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                            : "border-slate-400/10 bg-slate-400/10 text-slate-400"
                        }`}
                      >
                        {item.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>

                    </div>

                    <p className="mt-2 text-sm font-medium text-cyan-400">
                      {item.institution}
                    </p>

                  </div>

                  <span className="h-fit shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-500">
                    Order: {item.sort_order}
                  </span>

                </div>

                {/* META */}

                <div className="mt-6 flex flex-wrap gap-2">

                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                    <span>📅</span>
                    <span>
                      {item.start_year} → {item.end_year}
                    </span>
                  </div>

                  {item.location && (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>
                  )}

                  {item.percentage !== null && (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                      <span>📊</span>
                      <span>{item.percentage}%</span>
                    </div>
                  )}

                  {item.grade && (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                      <span>🏆</span>
                      <span>{item.grade}</span>
                    </div>
                  )}

                </div>

                {/* DESCRIPTION */}

                {item.description && (
                  <div className="mt-6 border-t border-white/[0.07] pt-5">

                    <p className="text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>

                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/[0.07] pt-5">

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="h-10 rounded-lg border border-white/10 px-5 text-sm font-medium text-white transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="h-10 rounded-lg border border-red-400/15 px-5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                  >
                    Delete
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}

export default Education;