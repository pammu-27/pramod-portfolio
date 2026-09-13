import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Ad = {
  id: string;
  business_name: string;
  title: string | null;
  description: string | null;
  category: string | null;
  location: string | null;

  image_url: string | null;
  offer: string | null;

  button_text: string | null;

  destination_url: string | null;
  website_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;

  phone: string | null;

  is_featured: boolean;
  is_published: boolean;

  sort_order: number;

  start_date: string | null;
  end_date: string | null;

  created_at: string;
  updated_at: string;
};

type AdForm = {
  business_name: string;
  title: string;
  description: string;
  category: string;
  location: string;

  image_url: string;
  offer: string;

  button_text: string;

  website_url: string;
  instagram_url: string;
  facebook_url: string;
  whatsapp_number: string;
  phone: string;
  google_maps_url: string;

  is_featured: boolean;
  is_published: boolean;

  sort_order: number;

  start_date: string;
  end_date: string;
};

const emptyForm: AdForm = {
  business_name: "",
  title: "",
  description: "",
  category: "",
  location: "",

  image_url: "",
  offer: "",

  button_text: "Visit Business",

  website_url: "",
  instagram_url: "",
  facebook_url: "",
  whatsapp_number: "",
  phone: "",
  google_maps_url: "",

  is_featured: false,
  is_published: true,

  sort_order: 0,

  start_date: "",
  end_date: "",
};

function Ads() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [form, setForm] = useState<AdForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("ads")
      .select("*")
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
      setAds([]);
      setLoading(false);
      return;
    }

    setAds((data ?? []) as Ad[]);
    setLoading(false);
  }

  function handleChange<K extends keyof AdForm>(
    field: K,
    value: AdForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  function handleAddNew() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: ads.length + 1,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleEdit(ad: Ad) {
    setEditingId(ad.id);

    setForm({
      business_name: ad.business_name ?? "",
      title: ad.title ?? "",
      description: ad.description ?? "",
      category: ad.category ?? "",
      location: ad.location ?? "",

      image_url: ad.image_url ?? "",
      offer: ad.offer ?? "",

      button_text:
        ad.button_text ?? "Visit Business",

      website_url: ad.website_url ?? "",
      instagram_url: ad.instagram_url ?? "",
      facebook_url: ad.facebook_url ?? "",
      whatsapp_number: ad.whatsapp_number ?? "",
      phone: ad.phone ?? "",
      google_maps_url: ad.google_maps_url ?? "",

      is_featured: Boolean(ad.is_featured),
      is_published: Boolean(ad.is_published),

      sort_order: ad.sort_order ?? 0,

      start_date: ad.start_date ?? "",
      end_date: ad.end_date ?? "",
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

    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }

    if (
      form.start_date &&
      form.end_date &&
      form.end_date < form.start_date
    ) {
      setError(
        "End date cannot be earlier than start date."
      );
      return;
    }

    setSaving(true);

    const payload = {
      business_name:
        form.business_name.trim(),

      title:
        form.title.trim() || null,

      description:
        form.description.trim() || null,

      category:
        form.category.trim() || null,

      location:
        form.location.trim() || null,

      image_url:
        form.image_url.trim() || null,

      offer:
        form.offer.trim() || null,

      button_text:
        form.button_text.trim() || null,

      website_url:
        form.website_url.trim() || null,

      instagram_url:
        form.instagram_url.trim() || null,

      facebook_url:
        form.facebook_url.trim() || null,

      whatsapp_number:
        form.whatsapp_number.trim() || null,

      phone:
        form.phone.trim() || null,

      google_maps_url:
        form.google_maps_url.trim() || null,

      is_featured:
        form.is_featured,

      is_published:
        form.is_published,

      sort_order:
        Number(form.sort_order) || 0,

      start_date:
        form.start_date || null,

      end_date:
        form.end_date || null,

      updated_at:
        new Date().toISOString(),
    };

    try {
      if (editingId) {
        const {
          data,
          error: updateError,
        } = await supabase
          .from("ads")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        setAds((current) =>
          current.map((item) =>
            item.id === editingId
              ? (data as Ad)
              : item
          )
        );

        setMessage(
          "Advertisement updated successfully."
        );
      } else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("ads")
          .insert(payload)
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        setAds((current) => [
          ...current,
          data as Ad,
        ]);

        setMessage(
          "Advertisement created successfully."
        );
      }

      setEditingId(null);
      setForm(emptyForm);

      await loadAds();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save advertisement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const previousAds = ads;

    setAds((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    const { error: deleteError } =
      await supabase
        .from("ads")
        .delete()
        .eq("id", id);

    if (deleteError) {
      setAds(previousAds);
      setError(deleteError.message);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(
      "Advertisement deleted successfully."
    );
  }

  async function togglePublished(ad: Ad) {
    const newValue = !ad.is_published;

    setAds((current) =>
      current.map((item) =>
        item.id === ad.id
          ? {
              ...item,
              is_published: newValue,
            }
          : item
      )
    );

    const { error: updateError } =
      await supabase
        .from("ads")
        .update({
          is_published: newValue,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", ad.id);

    if (updateError) {
      setAds((current) =>
        current.map((item) =>
          item.id === ad.id
            ? {
                ...item,
                is_published:
                  ad.is_published,
              }
            : item
        )
      );

      setError(updateError.message);
    }
  }

  const filteredAds = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return ads;
    }

    return ads.filter((ad) =>
      [
        ad.business_name,
        ad.title,
        ad.category,
        ad.location,
        ad.offer,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [ads, search]);

  const totalAds = ads.length;

  const publishedAds = ads.filter(
    (ad) => ad.is_published
  ).length;

  const featuredAds = ads.filter(
    (ad) => ad.is_featured
  ).length;

  const expiredAds = ads.filter((ad) => {
    if (!ad.end_date) {
      return false;
    }

    return ad.end_date < getToday();
  }).length;

  return (
    <div className="mx-auto max-w-[1180px]">

      <style>{`
        .ads-admin-input {
          width: 100%;
          min-height: 46px;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          background: #020617;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          padding: 11px 14px;
          outline: none;
          transition: all 180ms ease;
        }

        .ads-admin-input::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
        }

        .ads-admin-input:hover {
          border-color: rgba(255,255,255,0.16);
        }

        .ads-admin-input:focus {
          border-color: rgba(34,211,238,0.55);
          background: #030a1d;
          box-shadow:
            0 0 0 3px rgba(34,211,238,0.08);
        }

        .ads-admin-input[type="date"] {
          color-scheme: dark;
        }

        .ads-admin-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
        }

        .ads-admin-textarea {
          min-height: 120px;
          resize: vertical;
        }
      `}</style>


      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Local Advertising
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Advertisements
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Create and manage local business
            promotions displayed on your standalone
            advertising page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Add Advertisement
        </button>

      </div>


      {/* STATS */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          label="Total Ads"
          value={totalAds}
        />

        <Stat
          label="Published"
          value={publishedAds}
        />

        <Stat
          label="Featured"
          value={featuredAds}
        />

        <Stat
          label="Expired"
          value={expiredAds}
        />

      </div>


      {message && (
        <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
          {message}
        </div>
      )}


      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}


      {/* EDITOR */}

      <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">

        <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/10 pb-5">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Advertisement Editor
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              {editingId
                ? "Edit Advertisement"
                : "Create Advertisement"}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
          )}

        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {/* BUSINESS */}

          <Field
            label="Business Name"
            required
          >
            <input
              className="ads-admin-input"
              value={form.business_name}
              onChange={(e) =>
                handleChange(
                  "business_name",
                  e.target.value
                )
              }
              placeholder="Example Business"
            />
          </Field>


          <Field label="Ad Title">
            <input
              className="ads-admin-input"
              value={form.title}
              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value
                )
              }
              placeholder="Special Offer This Week"
            />
          </Field>


          <Field label="Category">
            <input
              className="ads-admin-input"
              value={form.category}
              onChange={(e) =>
                handleChange(
                  "category",
                  e.target.value
                )
              }
              placeholder="Restaurant, Salon, Electronics..."
            />
          </Field>


          <Field label="Location">
            <input
              className="ads-admin-input"
              value={form.location}
              onChange={(e) =>
                handleChange(
                  "location",
                  e.target.value
                )
              }
              placeholder="Bengaluru"
            />
          </Field>


          <div className="md:col-span-2">

            <Field label="Description">

              <textarea
                className="ads-admin-input ads-admin-textarea"
                value={form.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Tell customers about the business or promotion..."
              />

            </Field>

          </div>


          <Field label="Offer">
            <input
              className="ads-admin-input"
              value={form.offer}
              onChange={(e) =>
                handleChange(
                  "offer",
                  e.target.value
                )
              }
              placeholder="20% OFF"
            />
          </Field>


          <Field label="Image URL">
            <input
              className="ads-admin-input"
              type="url"
              value={form.image_url}
              onChange={(e) =>
                handleChange(
                  "image_url",
                  e.target.value
                )
              }
              placeholder="https://example.com/image.jpg"
            />
          </Field>


          {/* CONTACT SECTION */}

          <div className="md:col-span-2">

            <div className="mb-1 border-b border-white/[0.06] pb-3">

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Contact & Social Links
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Add only the contact methods the
                business actually has.
              </p>

            </div>

          </div>


          <Field label="Website URL">

            <input
              className="ads-admin-input"
              type="url"
              value={form.website_url}
              onChange={(e) =>
                handleChange(
                  "website_url",
                  e.target.value
                )
              }
              placeholder="https://business.com"
            />

          </Field>


          <Field label="Instagram URL">

            <input
              className="ads-admin-input"
              type="url"
              value={form.instagram_url}
              onChange={(e) =>
                handleChange(
                  "instagram_url",
                  e.target.value
                )
              }
              placeholder="https://instagram.com/business"
            />

          </Field>


          <Field label="Facebook URL">

            <input
              className="ads-admin-input"
              type="url"
              value={form.facebook_url}
              onChange={(e) =>
                handleChange(
                  "facebook_url",
                  e.target.value
                )
              }
              placeholder="https://facebook.com/business"
            />

          </Field>


          <Field label="WhatsApp Number">

            <input
              className="ads-admin-input"
              type="tel"
              value={form.whatsapp_number}
              onChange={(e) =>
                handleChange(
                  "whatsapp_number",
                  e.target.value
                )
              }
              placeholder="+91 98765 43210"
            />

          </Field>


          <Field label="Phone">

            <input
              className="ads-admin-input"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
              placeholder="+91 98765 43210"
            />

          </Field>


          <Field label="Google Maps URL">

            <input
              className="ads-admin-input"
              type="url"
              value={form.google_maps_url}
              onChange={(e) =>
                handleChange(
                  "google_maps_url",
                  e.target.value
                )
              }
              placeholder="https://maps.google.com/..."
            />

          </Field>


          {/* DISPLAY OPTIONS */}

          <Field label="Button Text">

            <input
              className="ads-admin-input"
              value={form.button_text}
              onChange={(e) =>
                handleChange(
                  "button_text",
                  e.target.value
                )
              }
              placeholder="Visit Business"
            />

          </Field>


          <Field label="Sort Order">

            <input
              className="ads-admin-input"
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) =>
                handleChange(
                  "sort_order",
                  Number(e.target.value)
                )
              }
            />

          </Field>


          <Field label="Start Date">

            <input
              className="ads-admin-input"
              type="date"
              value={form.start_date}
              onChange={(e) =>
                handleChange(
                  "start_date",
                  e.target.value
                )
              }
            />

          </Field>


          <Field label="End Date">

            <input
              className="ads-admin-input"
              type="date"
              value={form.end_date}
              onChange={(e) =>
                handleChange(
                  "end_date",
                  e.target.value
                )
              }
            />

          </Field>


          {/* FEATURED */}

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  handleChange(
                    "is_featured",
                    e.target.checked
                  )
                }
                className="mt-1 h-4 w-4 accent-cyan-400"
              />

              <span>
                <span className="block text-sm font-medium text-white">
                  Featured Advertisement
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Display this advertisement
                  prominently.
                </span>
              </span>

            </label>

          </div>


          {/* PUBLISHED */}

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">

            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  handleChange(
                    "is_published",
                    e.target.checked
                  )
                }
                className="mt-1 h-4 w-4 accent-cyan-400"
              />

              <span>
                <span className="block text-sm font-medium text-white">
                  Published
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Allow this advertisement to
                  appear publicly.
                </span>
              </span>

            </label>

          </div>

        </div>


        {/* SAVE */}

        <div className="mt-7 flex justify-end border-t border-white/10 pt-6">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Advertisement"
                : "Save Advertisement"}
          </button>

        </div>

      </section>


      {/* CAMPAIGNS */}

      <section>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Campaigns
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Your Advertisements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredAds.length} advertisement
              {filteredAds.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          <input
            className="ads-admin-input max-w-sm"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search advertisements..."
          />

        </div>


        {loading ? (

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-12 text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-sm text-slate-500">
              Loading advertisements...
            </p>

          </div>

        ) : filteredAds.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

            <h3 className="text-lg font-semibold text-white">
              No advertisements found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first local business
              advertisement.
            </p>

          </div>

        ) : (

          <div className="grid gap-5 lg:grid-cols-2">

            {filteredAds.map((ad) => (
              <AdvertisementCard
                key={ad.id}
                ad={ad}
                onEdit={() =>
                  handleEdit(ad)
                }
                onDelete={() =>
                  handleDelete(ad.id)
                }
                onTogglePublished={() =>
                  togglePublished(ad)
                }
              />
            ))}

          </div>

        )}

      </section>

    </div>
  );
}


/* =====================================================
   FIELD
===================================================== */

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-cyan-400">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}


/* =====================================================
   STAT
===================================================== */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-200">
        {value}
      </p>

      <div className="mt-4 h-px bg-white/[0.06]" />

      <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-slate-600">
        Advertising data
      </p>

    </div>
  );
}


/* =====================================================
   AD CARD
===================================================== */

function AdvertisementCard({
  ad,
  onEdit,
  onDelete,
  onTogglePublished,
}: {
  ad: Ad;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublished: () => void;
}) {
  const expired =
    Boolean(ad.end_date) &&
    Boolean(
      ad.end_date &&
        ad.end_date < getToday()
    );

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition hover:border-cyan-400/20">

      {ad.image_url && (
        <div className="h-48 overflow-hidden bg-slate-900">

          <img
            src={ad.image_url}
            alt={
              ad.title ||
              ad.business_name
            }
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display =
                "none";
            }}
          />

        </div>
      )}


      <div className="p-5">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-400">
              {ad.business_name}
            </p>

            {ad.title && (
              <h3 className="mt-2 text-lg font-semibold text-white">
                {ad.title}
              </h3>
            )}

          </div>


          <div className="flex flex-wrap gap-2">

            {ad.is_featured && (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase text-cyan-300">
                Featured
              </span>
            )}

            {ad.is_published ? (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase text-emerald-300">
                Published
              </span>
            ) : (
              <span className="rounded-full border border-slate-400/10 bg-slate-400/10 px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">
                Hidden
              </span>
            )}

          </div>

        </div>


        {ad.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
            {ad.description}
          </p>
        )}


        <div className="mt-5 flex flex-wrap gap-2">

          {ad.category && (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
              {ad.category}
            </span>
          )}

          {ad.location && (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
              {ad.location}
            </span>
          )}

          {ad.offer && (
            <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-xs text-cyan-300">
              {ad.offer}
            </span>
          )}

        </div>


        {/* CONTACT METHODS */}

        <div className="mt-5 flex flex-wrap gap-2">

          {ad.website_url && (
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
              Website
            </span>
          )}

          {ad.instagram_url && (
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
              Instagram
            </span>
          )}

          {ad.facebook_url && (
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
              Facebook
            </span>
          )}

          {ad.whatsapp_number && (
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
              WhatsApp
            </span>
          )}

          {ad.phone && (
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
              Phone
            </span>
          )}

          {ad.google_maps_url && (
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
              Maps
            </span>
          )}

        </div>


        <div className="mt-5 border-t border-white/[0.07] pt-4">

          <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">

            <div>
              <span className="text-slate-600">
                Order
              </span>{" "}
              {ad.sort_order}
            </div>

            <div>
              <span className="text-slate-600">
                Status
              </span>{" "}
              {expired
                ? "Expired"
                : ad.is_published
                  ? "Active"
                  : "Hidden"}
            </div>

            {ad.start_date && (
              <div>
                <span className="text-slate-600">
                  Start
                </span>{" "}
                {ad.start_date}
              </div>
            )}

            {ad.end_date && (
              <div>
                <span className="text-slate-600">
                  End
                </span>{" "}
                {ad.end_date}
              </div>
            )}

          </div>

        </div>


        <div className="mt-5 flex flex-wrap gap-2">

          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-300"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onTogglePublished}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            {ad.is_published
              ? "Hide"
              : "Publish"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-400/10 px-4 py-2 text-xs font-medium text-red-300 transition hover:border-red-400/30 hover:bg-red-400/5"
          >
            Delete
          </button>

        </div>

      </div>

    </article>
  );
}


/* =====================================================
   TODAY
===================================================== */

function getToday() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default Ads;