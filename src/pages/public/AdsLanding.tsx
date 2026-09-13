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
  const [activeCategory, setActiveCategory] = useState("All");

  // Keep this page isolated from the portfolio when visitors use browser Back.
  useEffect(() => {
    const lockedState = { adsLocked: true };

    window.history.replaceState(lockedState, "", window.location.href);
    window.history.pushState(lockedState, "", window.location.href);

    const keepAdsLocked = () => {
      window.history.pushState(lockedState, "", window.location.href);
    };

    window.addEventListener("popstate", keepAdsLocked);

    return () => {
      window.removeEventListener("popstate", keepAdsLocked);
    };
  }, []);

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load ads:", error);
      setAds([]);
      setLoading(false);
      return;
    }

    const today = getToday();

    const activeAds = ((data ?? []) as Ad[]).filter((ad) => {
      const starts = !ad.start_date || ad.start_date <= today;
      const notExpired = !ad.end_date || ad.end_date >= today;
      return starts && notExpired;
    });

    setAds(activeAds);
    setLoading(false);
  }

  const categories = useMemo(() => {
    const values = ads
      .map((ad) => ad.category?.trim())
      .filter((value): value is string => Boolean(value));

    return ["All", ...Array.from(new Set(values))];
  }, [ads]);

  const filteredAds = useMemo(() => {
    if (activeCategory === "All" || activeCategory === "More") {
      return ads;
    }

    return ads.filter(
      (ad) => ad.category?.trim() === activeCategory
    );
  }, [ads, activeCategory]);

  const featuredAds = filteredAds.filter((ad) => ad.is_featured);
  const regularAds = filteredAds.filter((ad) => !ad.is_featured);


  return (
    <div className="ads-page min-h-screen overflow-x-hidden bg-[#04050a] text-white">
      <style>{`
        @keyframes ads-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ads-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
        }

        @keyframes ads-pulse-soft {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .65; transform: scale(1.08); }
        }

        @keyframes ads-shimmer {
          0% { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }

        .ads-page .ads-enter {
          animation: ads-fade-up .65s cubic-bezier(.22,1,.36,1) both;
        }

        .ads-page .ads-float {
          animation: ads-float 7s ease-in-out infinite;
        }

        .ads-page .ads-pulse-soft {
          animation: ads-pulse-soft 5s ease-in-out infinite;
        }

        .ads-page .ads-delay-1 { animation-delay: 80ms; }
        .ads-page .ads-delay-2 { animation-delay: 160ms; }
        .ads-page .ads-delay-3 { animation-delay: 240ms; }

        .ads-page .ads-skeleton {
          background:
            linear-gradient(
              100deg,
              rgba(255,255,255,.035) 20%,
              rgba(255,255,255,.075) 35%,
              rgba(255,255,255,.035) 50%
            );
          background-size: 220% 100%;
          animation: ads-shimmer 1.6s linear infinite;
        }

        .ads-page * {
          -webkit-tap-highlight-color: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .ads-page .ads-enter,
          .ads-page .ads-float,
          .ads-page .ads-pulse-soft,
          .ads-page .ads-skeleton {
            animation: none !important;
          }

          .ads-page *,
          .ads-page *::before,
          .ads-page *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05050b]/88 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/[0.07] text-xs font-bold tracking-tight text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.10)]">
              LA
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Local Ads
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Discover local
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,.75)]" />
            <span className="text-[10px] font-medium text-slate-400">
              Offers • Services • Businesses
            </span>
          </div>
        </div>
      </header>

      <main className="relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="pointer-events-none absolute left-[-12rem] top-16 h-[30rem] w-[30rem] rounded-full bg-indigo-500/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute left-[34%] top-[-10rem] h-[22rem] w-[36rem] rounded-full bg-blue-600/[0.08] blur-[100px]" />
        <div className="pointer-events-none absolute right-[-12rem] top-[16rem] h-[28rem] w-[28rem] rounded-full bg-orange-500/[0.055] blur-[100px]" />
        <div className="pointer-events-none absolute right-[-14rem] top-[30rem] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1180px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:pb-28">
          <section className="ads-enter">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_280px] lg:gap-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.05] px-3.5 py-2 shadow-[0_0_30px_rgba(251,191,36,.05)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,.8)]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">
                    Local discovery
                  </span>
                </div>

                <h1 className="mt-6 max-w-[760px] text-[3.1rem] font-bold leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-[4.55rem]">
                  Discover local businesses
                  <span className="block bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                    & special offers.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-400 sm:text-lg sm:leading-7">
                  Find trusted local businesses, useful services, current deals
                  and exclusive promotions — all in one place.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/15 bg-amber-300/[0.05] text-amber-200">
                      <ShieldIcon />
                    </span>
                    <span>Trusted local listings</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-300/15 bg-purple-300/[0.05] text-purple-200">
                      <SparkIcon />
                    </span>
                    <span>Great offers</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-pink-300/15 bg-pink-300/[0.05] text-pink-200">
                      <HeartIcon />
                    </span>
                    <span>Support local</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 text-amber-200/90">
                  <span className="h-px w-10 bg-amber-300/80" />
                  <span className="font-serif text-base italic tracking-wide">
                    Support local. Grow together.
                  </span>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute -inset-8 rounded-full bg-purple-500/[0.10] blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.08] via-white/[0.025] to-fuchsia-400/[0.07] p-5 shadow-[0_25px_90px_rgba(251,191,36,.07)] backdrop-blur-xl">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-300/[0.09] blur-3xl" />
                  <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-fuchsia-500/[0.09] blur-3xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.07] text-amber-300">
                          <ChartIcon />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                          Available now
                        </span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,.9)]" />
                    </div>

                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-5xl font-semibold tracking-[-0.05em] text-white">
                          {loading ? "—" : ads.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Active {ads.length === 1 ? "Listing" : "Listings"}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-slate-300">
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 flex justify-center gap-5">
                  <MiniTrust icon={<ShieldIcon />} label="Trusted" />
                  <MiniTrust icon={<SparkIcon />} label="Great Offers" />
                  <MiniTrust icon={<HeartIcon />} label="Support Local" />
                </div>
              </div>
            </div>
          </section>

          {!loading && ads.length > 0 && (
            <section className="ads-enter ads-delay-2 mt-8">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  ["All", "grid"],
                  ["Bakery & Food", "utensils"],
                  ["Shopping", "bag"],
                  ["Services", "settings"],
                  ["Beauty", "scissors"],
                  ["Education", "book"],
                  ["Health", "heart"],
                ].map(([category, icon]) => {
                  const selected = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={[
                        "flex h-11 shrink-0 items-center gap-2.5 rounded-full border px-4 text-xs font-semibold transition-all duration-300 sm:px-5",
                        selected
                          ? "border-amber-300/60 bg-gradient-to-r from-amber-300 to-orange-300 text-[#17100a] shadow-[0_0_28px_rgba(251,191,36,.24)]"
                          : "border-white/[0.10] bg-white/[0.025] text-slate-300 hover:border-amber-300/30 hover:bg-white/[0.05] hover:text-white",
                      ].join(" ")}
                    >
                      <CategoryIcon name={icon} />
                      <span>{category}</span>
                    </button>
                  );
                })}

                {categories.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setActiveCategory("More")}
                    className={[
                      "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-all duration-300",
                      activeCategory === "More"
                        ? "border-amber-300/60 bg-gradient-to-r from-amber-300 to-orange-300 text-[#17100a]"
                        : "border-white/[0.10] bg-white/[0.025] text-slate-300 hover:border-amber-300/30 hover:text-white",
                    ].join(" ")}
                  >
                    <MoreIcon />
                    More
                  </button>
                )}
              </div>
            </section>
          )}

          {loading ? (
            <LoadingState />
          ) : ads.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {featuredAds.length > 0 && (
                <section className="ads-enter ads-delay-3 mt-12">
                  <SectionHeading
                    eyebrow="Latest promotions"
                    title="Worth checking out"
                    subtitle="Explore handpicked businesses and deals from your local area."
                    count={featuredAds.length}
                  />

                  <div className="mt-5 grid gap-5">
                    {featuredAds.map((ad, index) => (
                      <AdCard
                        key={ad.id}
                        ad={ad}
                        featured
                        index={index}
                      />
                    ))}
                  </div>
                </section>
              )}

              {regularAds.length > 0 && (
                <section className="ads-enter mt-12">
                  <SectionHeading
                    eyebrow="Local businesses"
                    title={
                      featuredAds.length > 0
                        ? "More to discover"
                        : "Latest promotions"
                    }
                    subtitle="Discover more useful services, businesses and local offers."
                    count={regularAds.length}
                  />

                  <div
                    className={[
                      "mt-5 grid gap-5",
                      regularAds.length === 1
                        ? "grid-cols-1"
                        : regularAds.length === 2
                          ? "md:grid-cols-2"
                          : "sm:grid-cols-2 xl:grid-cols-3",
                    ].join(" ")}
                  >
                    {regularAds.map((ad, index) => (
                      <AdCard key={ad.id} ad={ad} index={index} />
                    ))}
                  </div>
                </section>
              )}

              <div className="relative mt-16 overflow-hidden border-y border-white/[0.06] py-9 text-center">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.08] blur-3xl" />
                <div className="relative">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center text-amber-300">
                    <SparkIcon />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-white sm:text-lg">
                    More local businesses coming soon
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Stay tuned for more exciting offers and trusted local services.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
                <p className="text-xs text-slate-600">
                  Showing {filteredAds.length}{" "}
                  {filteredAds.length === 1 ? "listing" : "listings"}
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#03040a]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden">
          <div className="absolute -bottom-16 left-[-5%] h-32 w-[58%] rounded-[50%] border-t border-amber-300/30 bg-gradient-to-r from-amber-500/[0.10] to-transparent blur-[1px]" />
          <div className="absolute -bottom-16 right-[-5%] h-32 w-[58%] rounded-[50%] border-t border-fuchsia-400/25 bg-gradient-to-l from-fuchsia-500/[0.09] to-transparent blur-[1px]" />
        </div>

        <div className="relative mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-amber-300">
              Local Ads
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Discover. Connect. Support Local.
            </p>
          </div>

          <div className="flex items-end justify-between gap-8 md:flex-col md:items-end">
            <div className="flex gap-2.5">
              <FooterIcon icon={<InstagramIcon />} />
              <FooterIcon icon={<WhatsAppIcon />} />
              <FooterIcon icon={<MapPinIcon />} />
            </div>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Local Ads
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  count,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  count: number;
}) {
  return (
    <div className="flex items-end justify-between gap-5">
      <div>
        <div className="flex items-center gap-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber-300">
            {eyebrow}
          </p>
          <span className="hidden h-px w-10 bg-amber-300/80 sm:block" />
        </div>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <span className="shrink-0 rounded-full border border-amber-300/15 bg-amber-300/[0.04] px-3 py-1.5 text-[10px] font-semibold text-amber-200">
        {count} {count === 1 ? "listing" : "listings"}
      </span>
    </div>
  );
}

function AdCard({
  ad,
  featured = false,
  index = 0,
}: {
  ad: Ad;
  featured?: boolean;
  index?: number;
}) {
  const websiteUrl =
    normalizeWebsite(ad.website_url) ||
    normalizeWebsite(ad.destination_url);

  const instagramUrl = normalizeInstagram(ad.instagram_url);
  const facebookUrl = normalizeFacebook(ad.facebook_url);
  const whatsappUrl = getWhatsAppUrl(ad.whatsapp_number);
  const phoneUrl = getPhoneUrl(ad.phone);
  const mapsUrl = normalizeWebsite(ad.google_maps_url);

  const contactLinks = [
    websiteUrl
      ? {
          label: ad.button_text || "Visit",
          href: websiteUrl,
          icon: <ExternalIcon />,
          primary: true,
        }
      : null,
    instagramUrl
      ? {
          label: "Instagram",
          href: instagramUrl,
          icon: <InstagramIcon />,
        }
      : null,
    facebookUrl
      ? {
          label: "Facebook",
          href: facebookUrl,
          icon: <FacebookIcon />,
        }
      : null,
    whatsappUrl
      ? {
          label: "WhatsApp",
          href: whatsappUrl,
          icon: <WhatsAppIcon />,
        }
      : null,
    phoneUrl
      ? {
          label: "Call",
          href: phoneUrl,
          icon: <PhoneIcon />,
        }
      : null,
    mapsUrl
      ? {
          label: "Directions",
          href: mapsUrl,
          icon: <MapPinIcon />,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: React.ReactNode;
    primary?: boolean;
  }[];


  const delayClass =
    index % 3 === 0
      ? ""
      : index % 3 === 1
        ? "ads-delay-1"
        : "ads-delay-2";

  return (
    <article
      className={[
        "ads-enter group overflow-hidden rounded-3xl border bg-[#0b0a14]/95 shadow-[0_18px_70px_rgba(0,0,0,.2)] transition-all duration-300",
        featured
          ? "border-amber-300/25 bg-gradient-to-br from-[#0d0b12] via-[#0a0910] to-[#110d14] shadow-[0_25px_100px_rgba(251,191,36,.09)]"
          : "border-white/[0.08]",
        delayClass,
        "hover:-translate-y-1 hover:border-amber-300/25",
      ].join(" ")}
    >
      {featured ? (
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,.95fr)]">
          <AdImage ad={ad} featured />
          <AdContent
            ad={ad}
            featured
            contactLinks={contactLinks}
          />
        </div>
      ) : (
        <>
          <AdImage ad={ad} />
          <AdContent ad={ad} contactLinks={contactLinks} />
        </>
      )}
    </article>
  );
}

function AdImage({
  ad,
  featured = false,
}: {
  ad: Ad;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden bg-[#0b0a12]",
        featured ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[480px]" : "aspect-[16/9]",
      ].join(" ")}
    >
      {ad.image_url ? (
        <>
          <img
            src={ad.image_url}
            alt={ad.title || ad.business_name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050b]/70 via-transparent to-transparent" />
        </>
      ) : (
        <div className="relative flex h-full min-h-[220px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(251,191,36,.16),transparent_32%),radial-gradient(circle_at_80%_75%,rgba(168,85,247,.12),transparent_36%),linear-gradient(135deg,#120f18,#05050b)]">
          <div className="ads-pulse-soft absolute h-40 w-40 rounded-full bg-amber-300/[0.08] blur-3xl" />
          <span className="relative text-6xl font-bold tracking-[-0.06em] text-amber-300/25">
            {ad.business_name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {ad.offer && (
        <div className="absolute left-4 top-4 max-w-[80%] rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-xl">
          {ad.offer}
        </div>
      )}

      {ad.is_featured && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-cyan-300/15 bg-[#020617]/75 px-3 py-1.5 backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-200">
            Featured
          </span>
        </div>
      )}
    </div>
  );
}

function AdContent({
  ad,
  featured = false,
  contactLinks,
}: {
  ad: Ad;
  featured?: boolean;
  contactLinks: {
    label: string;
    href: string;
    icon: React.ReactNode;
    primary?: boolean;
  }[];
}) {
  return (
    <div className={featured ? "p-5 sm:p-7 lg:p-8" : "p-5"}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {ad.category && (
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">
              {ad.category}
            </p>
          )}

          <p className="mt-2 truncate text-xs font-medium text-slate-500">
            {ad.business_name}
          </p>

          {ad.title && (
            <h3
              className={[
                "mt-2 font-semibold leading-tight tracking-tight text-white",
                featured ? "text-2xl sm:text-3xl lg:text-[2rem]" : "text-xl",
              ].join(" ")}
            >
              {ad.title}
            </h3>
          )}
        </div>

        <span className="shrink-0 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300">
          Active
        </span>
      </div>

      {ad.description && (
        <p
          className={[
            "mt-4 text-sm leading-6 text-slate-400",
            featured ? "max-w-xl text-base leading-7" : "line-clamp-4",
          ].join(" ")}
        >
          {ad.description}
        </p>
      )}

      {ad.offer && (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-300/[0.10] via-amber-300/[0.055] to-orange-300/[0.07] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/15 bg-amber-300/[0.06] text-amber-300">
              <TagIcon />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">
                Special offer
              </p>
              <p className="mt-1 text-sm font-semibold leading-5 text-white">
                {ad.offer}
              </p>
            </div>
          </div>
        </div>
      )}

      {(ad.location || ad.phone) && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
          {ad.location && (
            <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
              <MapPinIcon />
              <span className="truncate">{ad.location}</span>
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

      {contactLinks.length > 0 && (
        <div className="mt-5 border-t border-white/[0.06] pt-5">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
            Connect with business
          </p>

          <div
            className={[
              "grid gap-2",
              contactLinks.length === 1
                ? "grid-cols-1"
                : "grid-cols-2",
            ].join(" ")}
          >
            {contactLinks.map((link) => (
              <ActionButton
                key={`${link.label}-${link.href}`}
                href={link.href}
                label={link.label}
                icon={link.icon}
                primary={link.primary}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const tone =
    label === "Instagram"
      ? "border-fuchsia-400/30 bg-gradient-to-r from-fuchsia-600 to-rose-500 text-white shadow-[0_10px_30px_rgba(217,70,239,.16)] hover:from-fuchsia-500 hover:to-rose-400"
      : label === "Call" || label === "WhatsApp"
        ? "border-emerald-400/25 bg-gradient-to-r from-emerald-600/90 to-emerald-500/80 text-white shadow-[0_10px_30px_rgba(16,185,129,.12)] hover:from-emerald-500 hover:to-emerald-400"
        : primary
          ? "border-amber-300/30 bg-gradient-to-r from-amber-300 to-orange-300 text-[#17100a] shadow-[0_10px_30px_rgba(251,191,36,.16)] hover:from-amber-200 hover:to-orange-200"
          : "border-white/[0.10] bg-white/[0.035] text-slate-200 hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-white";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300",
        tone,
        "hover:-translate-y-0.5 active:translate-y-0",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function LoadingState() {
  return (
    <section className="mt-12">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#07101f]"
          >
            <div className="ads-skeleton aspect-[16/9]" />
            <div className="space-y-4 p-5">
              <div className="ads-skeleton h-2.5 w-20 rounded-full" />
              <div className="ads-skeleton h-5 w-3/4 rounded-lg" />
              <div className="ads-skeleton h-12 w-full rounded-xl" />
              <div className="ads-skeleton h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="ads-enter mt-12 overflow-hidden rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] text-amber-300">
        <StoreIcon />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-white">
        No promotions available right now
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        There are no active listings at the moment. Please check again later
        for new local businesses and offers.
      </p>
    </section>
  );
}

function MiniTrust({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.025] text-amber-200">
        {icon}
      </span>
      <span className="text-[10px] font-medium text-slate-400">
        {label}
      </span>
    </div>
  );
}

function FooterIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.025] text-slate-300">
      {icon}
    </span>
  );
}

function CategoryIcon({ name }: { name: string }) {
  if (name === "grid") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    );
  }

  if (name === "utensils") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3v7a3 3 0 0 0 3 3V3" />
        <path d="M10 3v18" />
        <path d="M17 3v18" />
        <path d="M17 3c2 2 2 5 0 7" />
      </svg>
    );
  }

  if (name === "bag") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 8h14l1 12H4L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 6.6l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.6v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v2.6h-.1a1.7 1.7 0 0 0-1.1 1.4Z" />
      </svg>
    );
  }

  if (name === "scissors") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <path d="m8.2 7.3 9.8 9.4M8.2 16.7 18 7.3" />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5a3 3 0 0 1 3-2h12v17H7a3 3 0 0 0-3 2V5Z" />
        <path d="M7 20h12" />
      </svg>
    );
  }

  return <HeartIcon />;
}

function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 20V10M12 20V4M19 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function normalizeWebsite(value: string | null) {
  const input = value?.trim();

  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;

  return `https://${input}`;
}

function normalizeInstagram(value: string | null) {
  const input = value?.trim();

  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;

  return `https://instagram.com/${input.replace(/^@/, "")}`;
}

function normalizeFacebook(value: string | null) {
  const input = value?.trim();

  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;

  return `https://facebook.com/${input.replace(/^@/, "")}`;
}

function getWhatsAppUrl(value: string | null) {
  const input = value?.trim();

  if (!input) return null;

  let digits = input.replace(/\D/g, "");

  if (!digits) return null;

  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return `https://wa.me/${digits}`;
}

function getPhoneUrl(value: string | null) {
  const input = value?.trim();

  if (!input) return null;

  return `tel:${input.replace(/[^\d+]/g, "")}`;
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
      <circle cx="12" cy="10" r="2.5" />
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
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
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

function TagIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.4 7a2 2 0 0 1 0 2.8Z" />
      <circle cx="8" cy="8" r="1.2" />
    </svg>
  );
}


function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 10v9h16v-9" />
      <path d="M3 10 5 4h14l2 6" />
      <path d="M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2" />
      <path d="M9 19v-5h6v5" />
    </svg>
  );
}
