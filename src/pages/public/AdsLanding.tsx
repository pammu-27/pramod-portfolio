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
};

export default function AdsLanding() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("is_published", true)
      .order("is_featured", {
        ascending: false,
      })
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Failed to load ads:", error);
      setAds([]);
      setLoading(false);
      return;
    }

    const today = getToday();

    const activeAds = ((data ?? []) as Ad[]).filter(
      (ad) => {
        const starts =
          !ad.start_date ||
          ad.start_date <= today;

        const notExpired =
          !ad.end_date ||
          ad.end_date >= today;

        return starts && notExpired;
      }
    );

    setAds(activeAds);
    setLoading(false);
  }

  const featuredAds = useMemo(
    () => ads.filter((ad) => ad.is_featured),
    [ads]
  );

  const regularAds = useMemo(
    () => ads.filter((ad) => !ad.is_featured),
    [ads]
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-white/[0.06] bg-[#020617]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-sm font-bold text-cyan-300">
              LA
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Local Ads
              </p>

              <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                Business Promotions
              </p>
            </div>

          </div>

          <div className="hidden text-right sm:block">

            <p className="text-[10px] text-slate-600">
              Discover local businesses
            </p>

            <p className="mt-1 text-xs font-medium text-slate-300">
              Offers, services and promotions
            </p>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative overflow-hidden">

        {/* Background grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative mx-auto max-w-[1180px] px-6 pb-24 pt-20 sm:pt-24">

          {/* =================================================
              HERO
          ================================================= */}

          <section className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Local Advertising
              </span>

            </div>


            <h1 className="mt-6 text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">

              Discover businesses

              <span className="block text-cyan-400">
                worth knowing.
              </span>

            </h1>


            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Discover local businesses, special
              offers, services and promotions in one
              place.
            </p>

          </section>


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading && ads.length === 0 && (
            <section className="mt-20 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">

              <p className="text-lg font-semibold text-white">
                No promotions available right now.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Please check again later.
              </p>

            </section>
          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <section className="mt-20 flex justify-center">

              <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            </section>
          )}


          {/* =================================================
              FEATURED
          ================================================= */}

          {!loading && featuredAds.length > 0 && (
            <section className="mt-20">

              <SectionHeading
                eyebrow="Featured businesses"
                title="Featured promotions"
              />

              <div className="mt-7 grid gap-6 lg:grid-cols-2">

                {featuredAds.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    featured
                  />
                ))}

              </div>

            </section>
          )}


          {/* =================================================
              ALL ADS
          ================================================= */}

          {!loading && regularAds.length > 0 && (
            <section className="mt-20">

              <SectionHeading
                eyebrow="Local businesses"
                title="All promotions"
              />

              <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {regularAds.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                  />
                ))}

              </div>

            </section>
          )}

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.06]">

        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-7">

          <p className="text-xs text-slate-600">
            Local business advertising platform
          </p>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Local Ads
          </p>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

    </div>
  );
}


/* =========================================================
   AD CARD
========================================================= */

function AdCard({
  ad,
  featured = false,
}: {
  ad: Ad;
  featured?: boolean;
}) {
  const websiteUrl =
    normalizeWebsite(ad.website_url) ||
    normalizeWebsite(ad.destination_url);

  const instagramUrl =
    normalizeInstagram(ad.instagram_url);

  const facebookUrl =
    normalizeFacebook(ad.facebook_url);

  const whatsappUrl =
    getWhatsAppUrl(ad.whatsapp_number);

  const phoneUrl =
    getPhoneUrl(ad.phone);

  const mapsUrl =
    normalizeWebsite(ad.google_maps_url);

  const hasContactButtons =
    Boolean(websiteUrl) ||
    Boolean(instagramUrl) ||
    Boolean(facebookUrl) ||
    Boolean(whatsappUrl) ||
    Boolean(phoneUrl) ||
    Boolean(mapsUrl);

  return (
    <article
      className={[
        "group overflow-hidden rounded-2xl border bg-[#080d1d] transition-all duration-300",
        featured
          ? "border-cyan-400/20 shadow-[0_0_60px_rgba(34,211,238,0.05)]"
          : "border-white/[0.08]",
        "hover:-translate-y-1 hover:border-cyan-400/30",
      ].join(" ")}
    >

      {/* IMAGE */}

      {ad.image_url ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">

          <img
            src={ad.image_url}
            alt={
              ad.title ||
              ad.business_name
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />

          {ad.offer && (
            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
              {ad.offer}
            </div>
          )}

        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-cyan-400/[0.08] to-transparent">

          <span className="text-4xl font-bold text-cyan-400/30">
            {ad.business_name
              .charAt(0)
              .toUpperCase()}
          </span>

        </div>
      )}


      {/* CONTENT */}

      <div className="p-5">

        {/* CATEGORY */}

        {ad.category && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            {ad.category}
          </p>
        )}


        {/* BUSINESS */}

        <p className="mt-2 text-xs font-medium text-slate-500">
          {ad.business_name}
        </p>


        {/* TITLE */}

        {ad.title && (
          <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
            {ad.title}
          </h3>
        )}


        {/* DESCRIPTION */}

        {ad.description && (
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-400">
            {ad.description}
          </p>
        )}


        {/* OFFER */}

        {ad.offer && (
          <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] px-4 py-3">

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Special Offer
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {ad.offer}
            </p>

          </div>
        )}


        {/* LOCATION / PHONE */}

        {(ad.location || ad.phone) && (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">

            {ad.location && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPinIcon />
                <span>{ad.location}</span>
              </div>
            )}

            {ad.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <PhoneIcon />
                <span>{ad.phone}</span>
              </div>
            )}

          </div>
        )}


        {/* CONTACT */}

        {hasContactButtons && (
          <div className="mt-6 border-t border-white/[0.06] pt-5">

            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Contact Business
            </p>


            <div className="grid grid-cols-2 gap-2">

              {websiteUrl && (
                <ActionButton
                  href={websiteUrl}
                  label={
                    ad.button_text ||
                    "Visit Website"
                  }
                  primary
                  icon={<ExternalIcon />}
                />
              )}


              {instagramUrl && (
                <ActionButton
                  href={instagramUrl}
                  label="Instagram"
                  icon={<InstagramIcon />}
                />
              )}


              {facebookUrl && (
                <ActionButton
                  href={facebookUrl}
                  label="Facebook"
                  icon={<FacebookIcon />}
                />
              )}


              {whatsappUrl && (
                <ActionButton
                  href={whatsappUrl}
                  label="WhatsApp"
                  icon={<WhatsAppIcon />}
                />
              )}


              {phoneUrl && (
                <ActionButton
                  href={phoneUrl}
                  label="Call"
                  icon={<PhoneIcon />}
                />
              )}


              {mapsUrl && (
                <ActionButton
                  href={mapsUrl}
                  label="Directions"
                  icon={<MapPinIcon />}
                />
              )}

            </div>

          </div>
        )}

      </div>

    </article>
  );
}


/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  href,
  label,
  icon,
  primary = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "flex min-h-[42px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition",
        primary
          ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
          : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/25 hover:bg-cyan-400/[0.05] hover:text-cyan-300",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}


/* =========================================================
   URL HELPERS
========================================================= */

function normalizeWebsite(
  value: string | null
) {
  const input = value?.trim();

  if (!input) {
    return null;
  }

  if (
    /^https?:\/\//i.test(input)
  ) {
    return input;
  }

  return `https://${input}`;
}


function normalizeInstagram(
  value: string | null
) {
  const input = value?.trim();

  if (!input) {
    return null;
  }

  if (
    /^https?:\/\//i.test(input)
  ) {
    return input;
  }

  return `https://instagram.com/${input.replace(/^@/, "")}`;
}


function normalizeFacebook(
  value: string | null
) {
  const input = value?.trim();

  if (!input) {
    return null;
  }

  if (
    /^https?:\/\//i.test(input)
  ) {
    return input;
  }

  return `https://facebook.com/${input.replace(/^@/, "")}`;
}


function getWhatsAppUrl(
  value: string | null
) {
  const input = value?.trim();

  if (!input) {
    return null;
  }

  let digits = input.replace(
    /\D/g,
    ""
  );

  if (!digits) {
    return null;
  }

  // India: automatically add +91
  // when a normal 10-digit number is entered.
  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return `https://wa.me/${digits}`;
}


function getPhoneUrl(
  value: string | null
) {
  const input = value?.trim();

  if (!input) {
    return null;
  }

  return `tel:${input.replace(
    /[^\d+]/g,
    ""
  )}`;
}


/* =========================================================
   DATE
========================================================= */

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


/* =========================================================
   ICONS
========================================================= */

function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" />
    </svg>
  );
}


function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 5.18 2 2 0 0 1 5.05 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}


function MapPinIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}


function InstagramIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


function FacebookIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.67.33-1 1-1Z" />
    </svg>
  );
}


function WhatsAppIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" />
      <path d="M8.5 8.5c.3-.4.6-.4.9-.1l1 .9c.3.3.3.6.1.9l-.5.7c.7 1.2 1.6 2.1 2.8 2.8l.7-.5c.3-.2.6-.2.9.1l.9 1c.3.3.3.6-.1.9-.5.5-1.2.7-1.8.5-2.5-.8-4.5-2.8-5.3-5.3-.2-.7 0-1.3.4-1.9Z" />
    </svg>
  );
}