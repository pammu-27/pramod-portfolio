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

type CertificationForm = {
  title: string;
  organization: string;
  issue_date: string;
  credential_id: string;
  credential_url: string;
  image_url: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
};

const emptyForm: CertificationForm = {
  title: "",
  organization: "",
  issue_date: "",
  credential_id: "",
  credential_url: "",
  image_url: "",
  description: "",
  sort_order: 1,
  is_visible: true,
};

const fieldClass =
  "certification-input";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400";

function Certifications() {
  const [certifications, setCertifications] =
    useState<Certification[]>([]);

  const [form, setForm] =
    useState<CertificationForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD CERTIFICATIONS
  ===================================================== */

  useEffect(() => {
    loadCertifications();
  }, []);

  async function loadCertifications() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Certification loading error:",
        error,
      );

      setError(error.message);
      setLoading(false);
      return;
    }

    setCertifications(
      (data ?? []) as Certification[],
    );

    setLoading(false);
  }

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  function handleChange(
    field: keyof CertificationForm,
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
     URL VALIDATION
  ===================================================== */

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  /* =====================================================
     SAVE / UPDATE
  ===================================================== */

  async function handleSave() {
    setMessage("");
    setError("");

    if (!form.title.trim()) {
      setError(
        "Certification title is required.",
      );
      return;
    }

    if (!form.organization.trim()) {
      setError(
        "Organization is required.",
      );
      return;
    }

    if (!form.issue_date) {
      setError(
        "Issue date is required.",
      );
      return;
    }

    if (
      form.credential_url.trim() &&
      !isValidUrl(
        form.credential_url.trim(),
      )
    ) {
      setError(
        "Please enter a valid credential URL.",
      );
      return;
    }

    if (
      form.image_url.trim() &&
      !isValidUrl(
        form.image_url.trim(),
      )
    ) {
      setError(
        "Please enter a valid image URL.",
      );
      return;
    }

    setSaving(true);

    const certificationData = {
      title: form.title.trim(),

      organization:
        form.organization.trim(),

      issue_date:
        form.issue_date,

      credential_id:
        form.credential_id.trim() || null,

      credential_url:
        form.credential_url.trim() || null,

      image_url:
        form.image_url.trim() || null,

      description:
        form.description.trim() || null,

      sort_order:
        Number(form.sort_order) || 0,

      is_visible:
        form.is_visible,

      updated_at:
        new Date().toISOString(),
    };

    try {
      /* ================================================
         UPDATE
      ================================================ */

      if (editingId) {
        const { data, error } =
          await supabase
            .from("certifications")
            .update(certificationData)
            .eq("id", editingId)
            .select()
            .single();

        if (error) {
          throw error;
        }

        setCertifications(
          (current) =>
            current
              .map((item) =>
                item.id === editingId
                  ? (data as Certification)
                  : item,
              )
              .sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order,
              ),
        );

        setMessage(
          "Certification updated successfully!",
        );
      }

      /* ================================================
         INSERT
      ================================================ */

      else {
        const { data, error } =
          await supabase
            .from("certifications")
            .insert(certificationData)
            .select()
            .single();

        if (error) {
          throw error;
        }

        setCertifications(
          (current) =>
            [
              ...current,
              data as Certification,
            ].sort(
              (a, b) =>
                a.sort_order -
                b.sort_order,
            ),
        );

        setMessage(
          "Certification added successfully!",
        );
      }

      setForm({
        ...emptyForm,
        sort_order:
          certifications.length + 1,
      });

      setEditingId(null);
    } catch (err) {
      console.error(
        "Certification save error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save certification.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     EDIT
  ===================================================== */

  function handleEdit(
    certification: Certification,
  ) {
    setEditingId(certification.id);

    setForm({
      title:
        certification.title ?? "",

      organization:
        certification.organization ?? "",

      issue_date:
        certification.issue_date ?? "",

      credential_id:
        certification.credential_id ?? "",

      credential_url:
        certification.credential_url ?? "",

      image_url:
        certification.image_url ?? "",

      description:
        certification.description ?? "",

      sort_order:
        certification.sort_order ?? 0,

      is_visible:
        certification.is_visible ?? true,
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
      sort_order:
        certifications.length + 1,
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
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this certification?",
      );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const previousCertifications =
      certifications;

    // Optimistic UI
    setCertifications(
      (current) =>
        current.filter(
          (item) => item.id !== id,
        ),
    );

    const { error } =
      await supabase
        .from("certifications")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Certification delete error:",
        error,
      );

      // Rollback
      setCertifications(
        previousCertifications,
      );

      setError(error.message);
      return;
    }

    setMessage(
      "Certification deleted successfully!",
    );

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
          IMPORTANT:
          Component-level CSS overrides the broken
          global admin-input styling.
      ================================================= */}

      <style>{`
        .certification-input {
          width: 100% !important;
          min-height: 46px !important;
          box-sizing: border-box !important;

          appearance: none !important;
          -webkit-appearance: none !important;

          border: 1px solid rgba(148, 163, 184, 0.14) !important;
          border-radius: 11px !important;

          background: #050a16 !important;

          padding: 11px 14px !important;

          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;

          caret-color: #22d3ee !important;

          outline: none !important;

          font-family: inherit !important;
          font-size: 14px !important;
          line-height: 1.5 !important;

          transition:
            border-color 180ms ease,
            background-color 180ms ease,
            box-shadow 180ms ease !important;
        }

        .certification-input:hover {
          border-color: rgba(148, 163, 184, 0.26) !important;
          background: #070d1a !important;
        }

        .certification-input:focus {
          border-color: rgba(34, 211, 238, 0.6) !important;

          background: #060c18 !important;

          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;

          box-shadow:
            0 0 0 3px rgba(34, 211, 238, 0.08),
            0 8px 24px rgba(0, 0, 0, 0.18) !important;
        }

        .certification-input::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 1 !important;
        }

        .certification-input[type="date"] {
          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;
          color-scheme: dark !important;
        }

        .certification-input[type="number"] {
          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;
        }

        .certification-input[type="url"] {
          color: #f8fafc !important;
          -webkit-text-fill-color: #f8fafc !important;
        }

        .certification-input:-webkit-autofill,
        .certification-input:-webkit-autofill:hover,
        .certification-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f8fafc !important;

          box-shadow:
            0 0 0 1000px #050a16 inset !important;
        }

        .certification-checkbox {
          width: 19px !important;
          height: 19px !important;

          appearance: none !important;
          -webkit-appearance: none !important;

          border: 1px solid rgba(148, 163, 184, 0.3) !important;
          border-radius: 5px !important;

          background: #050a16 !important;

          cursor: pointer !important;

          position: relative !important;

          flex-shrink: 0 !important;
        }

        .certification-checkbox:checked {
          background: #22d3ee !important;
          border-color: #22d3ee !important;
        }

        .certification-checkbox:checked::after {
          content: "" !important;

          position: absolute !important;

          width: 5px !important;
          height: 9px !important;

          left: 6px !important;
          top: 2px !important;

          border-right: 2px solid #020617 !important;
          border-bottom: 2px solid #020617 !important;

          transform: rotate(45deg) !important;
        }
      `}</style>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
            Portfolio Content
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Certifications
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage your professional
            certifications and credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all hover:-translate-y-0.5 hover:bg-cyan-300"
        >
          <span className="text-lg leading-none transition-transform group-hover:rotate-90">
            +
          </span>

          Add Certification
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
          FORM
      ================================================= */}

      <section className="mb-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1a] shadow-2xl shadow-black/20">

        {/* HEADER */}

        <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.08] text-lg">
                🏆
              </div>

              <div>

                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  {editingId
                    ? "Edit Certification"
                    : "Add New Certification"}
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {editingId
                    ? "Update this certification."
                    : "Add a professional certification to your portfolio."}
                </p>

              </div>

            </div>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        {/* BODY */}

        <div className="px-6 py-7 sm:px-8 sm:py-8">

          <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">

            {/* TITLE */}

            <div>

              <label className={labelClass}>
                Certification Title
                <span className="ml-1 text-cyan-400">
                  *
                </span>
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  handleChange(
                    "title",
                    event.target.value,
                  )
                }
                placeholder="Responsive Web Design"
                className={fieldClass}
                autoComplete="off"
              />

            </div>

            {/* ORGANIZATION */}

            <div>

              <label className={labelClass}>
                Organization
                <span className="ml-1 text-cyan-400">
                  *
                </span>
              </label>

              <input
                type="text"
                value={form.organization}
                onChange={(event) =>
                  handleChange(
                    "organization",
                    event.target.value,
                  )
                }
                placeholder="freeCodeCamp"
                className={fieldClass}
                autoComplete="off"
              />

            </div>

            {/* ISSUE DATE */}

            <div>

              <label className={labelClass}>
                Issue Date
                <span className="ml-1 text-cyan-400">
                  *
                </span>
              </label>

              <input
                type="date"
                value={form.issue_date}
                onChange={(event) =>
                  handleChange(
                    "issue_date",
                    event.target.value,
                  )
                }
                className={fieldClass}
              />

            </div>

            {/* CREDENTIAL ID */}

            <div>

              <label className={labelClass}>
                Credential ID
              </label>

              <input
                type="text"
                value={form.credential_id}
                onChange={(event) =>
                  handleChange(
                    "credential_id",
                    event.target.value,
                  )
                }
                placeholder="ABC-123456"
                className={fieldClass}
                autoComplete="off"
              />

            </div>

            {/* CREDENTIAL URL */}

            <div>

              <label className={labelClass}>
                Credential URL
              </label>

              <input
                type="url"
                value={form.credential_url}
                onChange={(event) =>
                  handleChange(
                    "credential_url",
                    event.target.value,
                  )
                }
                placeholder="https://example.com/credential"
                className={fieldClass}
                autoComplete="off"
              />

              <p className="mt-2 text-xs text-slate-600">
                Public verification link for
                this certification.
              </p>

            </div>

            {/* IMAGE URL */}

            <div>

              <label className={labelClass}>
                Certificate Image URL
              </label>

              <input
                type="url"
                value={form.image_url}
                onChange={(event) =>
                  handleChange(
                    "image_url",
                    event.target.value,
                  )
                }
                placeholder="https://example.com/certificate.jpg"
                className={fieldClass}
                autoComplete="off"
              />

              <p className="mt-2 text-xs text-slate-600">
                Optional image displayed on
                the certification card.
              </p>

            </div>

            {/* IMAGE PREVIEW */}

            {form.image_url && (
              <div className="md:col-span-2">

                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#050a16]">

                  <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">

                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Image Preview
                    </span>

                    <span className="text-xs text-cyan-400">
                      Preview
                    </span>

                  </div>

                  <div className="flex min-h-[180px] items-center justify-center p-5">

                    <img
                      src={form.image_url}
                      alt="Certificate preview"
                      className="max-h-[280px] max-w-full rounded-lg object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                </div>

              </div>
            )}

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className={labelClass}>
                Description
              </label>

              <textarea
                rows={5}
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe what you learned or achieved through this certification..."
                className={`${fieldClass} min-h-[125px] resize-y`}
              />

            </div>

            {/* SORT ORDER */}

            <div>

              <label className={labelClass}>
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
                className={fieldClass}
              />

              <p className="mt-2 text-xs text-slate-600">
                Lower numbers appear first.
              </p>

            </div>

            {/* VISIBILITY */}

            <div className="flex items-end">

              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]">

                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(event) =>
                    handleChange(
                      "is_visible",
                      event.target.checked,
                    )
                  }
                  className="certification-checkbox"
                />

                <span>

                  <span className="block text-sm font-semibold text-white">
                    Visible
                  </span>

                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                    Show this certification
                    on your public portfolio.
                  </span>

                </span>

              </label>

            </div>

          </div>

          {/* FOOTER */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-end">

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="h-11 rounded-xl border border-white/10 px-6 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 rounded-xl bg-cyan-400 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Certification"
                  : "Save Certification"}
            </button>

          </div>

        </div>
      </section>

      {/* =================================================
          LIST HEADER
      ================================================= */}

      <section>

        <div className="mb-5">

          <h2 className="text-xl font-semibold text-white">
            Your Certifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {certifications.length}{" "}
            {certifications.length === 1
              ? "certification"
              : "certifications"}
          </p>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="rounded-2xl border border-white/[0.08] bg-[#080d1a] p-12 text-center">

            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="text-sm text-slate-400">
              Loading certifications...
            </p>

          </div>

        ) : certifications.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="rounded-2xl border border-dashed border-white/10 bg-[#080d1a] p-12 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/[0.07] text-3xl">
              🏆
            </div>

            <h3 className="text-lg font-semibold text-white">
              No certifications yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first certification
              above.
            </p>

            <button
              type="button"
              onClick={handleAddNew}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              + Add Certification
            </button>

          </div>

        ) : (

          /* =================================================
             CERTIFICATION CARDS
          ================================================= */

          <div className="grid gap-5 md:grid-cols-2">

            {certifications.map(
              (certification) => (

                <article
                  key={certification.id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1a] transition-all duration-200 hover:border-cyan-400/20 hover:bg-[#0a1020]"
                >

                  {/* IMAGE */}

                  {certification.image_url && (
                    <div className="relative aspect-video overflow-hidden border-b border-white/[0.07] bg-[#050a16]">

                      <img
                        src={
                          certification.image_url
                        }
                        alt={
                          certification.title
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    </div>
                  )}

                  {/* BODY */}

                  <div className="p-6">

                    {/* TITLE */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <h3 className="text-xl font-semibold leading-tight text-white">
                          {
                            certification.title
                          }
                        </h3>

                        <p className="mt-2 text-sm font-medium text-cyan-400">
                          {
                            certification.organization
                          }
                        </p>

                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                          certification.is_visible
                            ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                            : "border-slate-400/10 bg-slate-400/10 text-slate-400"
                        }`}
                      >
                        {certification.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>

                    </div>

                    {/* META */}

                    <div className="mt-5 grid gap-2">

                      {certification.issue_date && (
                        <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-xs text-slate-400">

                          <span>📅</span>

                          <span>
                            Issued:{" "}
                            {
                              certification.issue_date
                            }
                          </span>

                        </div>
                      )}

                      {certification.credential_id && (
                        <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-xs text-slate-400">

                          <span>🔑</span>

                          <span className="min-w-0 truncate">
                            Credential ID:{" "}
                            {
                              certification.credential_id
                            }
                          </span>

                        </div>
                      )}

                      <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-xs text-slate-400">

                        <span>↕️</span>

                        <span>
                          Sort Order:{" "}
                          {
                            certification.sort_order
                          }
                        </span>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    {certification.description && (
                      <div className="mt-5 border-t border-white/[0.07] pt-5">

                        <p className="text-sm leading-7 text-slate-400">
                          {
                            certification.description
                          }
                        </p>

                      </div>
                    )}

                    {/* CREDENTIAL */}

                    {certification.credential_url && (
                      <a
                        href={
                          certification.credential_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                      >
                        View Credential
                        <span>↗</span>
                      </a>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-6 flex gap-3 border-t border-white/[0.07] pt-5">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            certification,
                          )
                        }
                        className="h-10 flex-1 rounded-lg border border-white/10 px-5 text-sm font-medium text-white transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            certification.id,
                          )
                        }
                        className="h-10 flex-1 rounded-lg border border-red-400/15 px-5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </article>
              ),
            )}

          </div>
        )}

      </section>
    </div>
  );
}

export default Certifications;