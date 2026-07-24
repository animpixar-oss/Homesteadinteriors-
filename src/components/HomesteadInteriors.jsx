import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Phone, User, MapPin, Menu, X, ChevronLeft, ChevronRight,
  ChevronDown, Plus, Minus, Check, MessageCircle, Calendar as CalendarIcon,
  Clock, Play, ArrowRight, ArrowUpRight,
} from "lucide-react";

/* ---------------------------------------------------------------------
   HOMESTEAD INTERIORS — marketing homepage
   Palette: sandstone cream / walnut espresso / burnt clay / sage
   Type: "Fraunces" (serif display) + "Inter" (sans body)
--------------------------------------------------------------------- */

const COLORS = {
  cream: "#F6F0E6",
  creamSoft: "#FBF7EF",
  paper: "#FFFDF8",
  espresso: "#2E2318",
  walnut: "#4A3826",
  taupe: "#8A7A65",
  clay: "#AE5A32",
  clayDark: "#8F4526",
  sage: "#77836A",
  line: "#E4D9C6",
};

/* Real, freely-licensed photography (Unsplash) keyed by category.
   Swap these for your own product photography whenever it's ready —
   the `photo()` helper just needs a working image URL. */
const PHOTO_IDS = {
  kitchens: "1759239572496-4ec13e7643d6",
  wardrobes: "1683181181112-6ba857b1d2a9",
  doors: "1726804550899-f0e01f066031",
  furnishings: "1757416654883-c73c67b3382b",
  bathware: "1723984790027-ffe34efb18f6",
  lighting: "1556545094-25635bdb8c1c",
};

const photo = (key, w = 1200, h = 900) =>
  `https://images.unsplash.com/photo-${PHOTO_IDS[key]}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Featured Collection background — real, freely-licensed stock footage (Pexels)
const ATELIER_VIDEO =
  "https://videos.pexels.com/video-files/29459385/12681247_1440_2560_60fps.mp4";
const ATELIER_POSTER =
  "https://images.pexels.com/videos/29459385/kanvas-designs-an-interior-design-company-29459385.jpeg?auto=compress&cs=tinysrgb&w=1600";

/* ------------------------- Shared bits ------------------------- */

const Eyebrow = ({ children, dark }) => (
  <div
    className="uppercase tracking-[0.2em] text-xs font-semibold mb-3"
    style={{ color: dark ? COLORS.cream : COLORS.clay }}
  >
    {children}
  </div>
);

const SectionHeading = ({ eyebrow, title, sub, dark, center }) => (
  <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
    {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
    <h2
      className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight"
      style={{ color: dark ? COLORS.paper : COLORS.espresso }}
    >
      {title}
    </h2>
    {sub && (
      <p
        className="mt-4 text-base sm:text-lg leading-relaxed"
        style={{ color: dark ? "#D9CFC0" : COLORS.taupe }}
      >
        {sub}
      </p>
    )}
  </div>
);

const Button = ({ children, variant = "primary", className = "", ...rest }) => {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 rounded-sm";
  const styles = {
    primary: { backgroundColor: COLORS.clay, color: COLORS.paper },
    dark: { backgroundColor: COLORS.espresso, color: COLORS.paper },
    outline: {
      backgroundColor: "transparent",
      color: COLORS.paper,
      border: `1px solid ${COLORS.paper}`,
    },
    outlineDark: {
      backgroundColor: "transparent",
      color: COLORS.espresso,
      border: `1px solid ${COLORS.espresso}`,
    },
    ghost: { backgroundColor: "transparent", color: COLORS.clay },
  };
  return (
    <button
      className={`${base} ${className} hover:opacity-85 active:scale-[0.98]`}
      style={styles[variant]}
      {...rest}
    >
      {children}
    </button>
  );
};

// Smooth-scrolls to a section id on the page (used everywhere instead of dead "#" links)
const scrollToId = (id) => (e) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ============================= HEADER ============================= */
// Each top-level nav item now links to a real section on the page (its
// SEO write-up further down), instead of a dead "#" href.
const NAV = [
  {
    label: "Kitchens",
    id: "kitchens",
    links: ["Modular Kitchens", "Island Kitchens", "L-Shaped Kitchens", "Kitchen Accessories", "Kitchen Cost Calculator"],
  },
  {
    label: "Wardrobes",
    id: "wardrobes",
    links: ["Sliding Wardrobes", "Hinged Wardrobes", "Walk-in Closets", "Wardrobe Interiors", "Wardrobe Cost Calculator"],
  },
  {
    label: "Doors & Windows",
    id: "doors-windows",
    links: ["Interior Doors", "Front Doors", "Windows", "Door Hardware"],
  },
  {
    label: "Furnishings",
    id: "furnishings",
    links: ["Sofas & Seating", "Dining", "Beds", "Soft Furnishings"],
  },
  {
    label: "Bathware",
    id: "bathware",
    links: ["Sanitaryware", "Faucets & Fittings", "Bath Furniture", "Accessories"],
  },
  {
    label: "Lighting",
    id: "lighting",
    links: ["Ceiling Lights", "Wall Lights", "Table Lamps", "Outdoor Lighting"],
  },
  { label: "Design Ideas", id: "design-stories", links: ["Lookbooks", "Before & After", "Trend Reports", "Design Stories"] },
  { label: "More", id: "visit-store", links: ["About Us", "Store Locator", "Careers", "Warranty"] },
];

function Header({ onBook }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(null);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b"
      style={{ backgroundColor: COLORS.creamSoft, borderColor: COLORS.line }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#top" onClick={scrollToId("top")} className="flex items-center gap-2 shrink-0">
            <span
              className="font-serif text-xl sm:text-2xl tracking-tight"
              style={{ color: COLORS.espresso }}
            >
              Homestead
            </span>
            <span
              className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] mt-1"
              style={{ color: COLORS.clay }}
            >
              Interiors
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <a
                  href={`#${item.id}`}
                  onClick={scrollToId(item.id)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                  style={{ color: COLORS.walnut }}
                >
                  {item.label}
                  <ChevronDown size={14} />
                </a>
                {openMenu === item.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56">
                    <div
                      className="rounded-sm border shadow-lg py-3"
                      style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}
                    >
                      {item.links.map((l) => (
                        <a
                          key={l}
                          href={`#${item.id}`}
                          onClick={scrollToId(item.id)}
                          className="block px-5 py-2 text-sm hover:pl-6 transition-all duration-150"
                          style={{ color: COLORS.walnut }}
                        >
                          {l}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button aria-label="Search" style={{ color: COLORS.walnut }}><Search size={19} /></button>
            <a href="tel:+911234567890" aria-label="Call us" style={{ color: COLORS.walnut }}><Phone size={19} /></a>
            <button aria-label="Account" style={{ color: COLORS.walnut }}><User size={19} /></button>
            <a href="#visit-store" onClick={scrollToId("visit-store")} aria-label="Store locator" style={{ color: COLORS.walnut }}><MapPin size={19} /></a>
            <Button variant="primary" className="ml-1 !py-2.5" onClick={onBook}>
              Book Consultation
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden"
            style={{ color: COLORS.walnut }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto"
            style={{ backgroundColor: COLORS.creamSoft }}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: COLORS.line }}>
              <span className="font-serif text-xl" style={{ color: COLORS.espresso }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} style={{ color: COLORS.walnut }}>
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center gap-6 px-5 py-4 border-b" style={{ borderColor: COLORS.line }}>
              <Search size={19} style={{ color: COLORS.walnut }} />
              <Phone size={19} style={{ color: COLORS.walnut }} />
              <User size={19} style={{ color: COLORS.walnut }} />
              <MapPin size={19} style={{ color: COLORS.walnut }} />
            </div>
            <nav className="py-2">
              {NAV.map((item) => (
                <div key={item.label} className="border-b" style={{ borderColor: COLORS.line }}>
                  <div className="w-full flex items-center justify-between px-5 py-4">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => { scrollToId(item.id)(e); setMobileOpen(false); }}
                      className="text-left font-medium"
                      style={{ color: COLORS.walnut }}
                    >
                      {item.label}
                    </a>
                    <button
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() => setMobileSub(mobileSub === item.label ? null : item.label)}
                    >
                      <ChevronDown
                        size={16}
                        className="transition-transform"
                        style={{ transform: mobileSub === item.label ? "rotate(180deg)" : "none", color: COLORS.walnut }}
                      />
                    </button>
                  </div>
                  {mobileSub === item.label && (
                    <div className="pb-3 pl-8 flex flex-col gap-1">
                      {item.links.map((l) => (
                        <a
                          key={l}
                          href={`#${item.id}`}
                          onClick={(e) => { scrollToId(item.id)(e); setMobileOpen(false); }}
                          className="py-1.5 text-sm"
                          style={{ color: COLORS.taupe }}
                        >
                          {l}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="p-5">
              <Button variant="primary" className="w-full" onClick={() => { setMobileOpen(false); onBook(); }}>
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ============================= HERO ============================= */

const HERO_SLIDES = [
  { key: "kitchens", title: "Kitchens That Gather", tag: "Where the day begins and everyone ends up." },
  { key: "wardrobes", title: "Wardrobes, Reimagined", tag: "Storage that stays as tidy as the plan." },
  { key: "doors-windows", photoKey: "doors", title: "Doors & Windows", tag: "The quiet detailing that frames a home." },
  { key: "furnishings", title: "Furnishings With Feeling", tag: "Pieces built to be lived in, not around." },
  { key: "bathware", title: "Bathware, Elevated", tag: "Everyday rituals, made a little more still." },
];

function Hero() {
  const [active, setActive] = useState(0);
  const timer = useRef(null);

  const go = useCallback((i) => setActive((i + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    timer.current = setInterval(() => setActive((a) => (a + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <section id="top" className="relative w-full h-[92vh] min-h-[560px] overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.key}
          className="absolute inset-0 transition-opacity duration-[1200ms]"
          style={{ opacity: active === i ? 1 : 0 }}
        >
          <img
            src={photo(slide.photoKey || slide.key, 1600, 1200)}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(20,14,8,0.55) 0%, rgba(20,14,8,0.15) 45%, rgba(20,14,8,0.35) 100%)" }}
          />
          <div className="absolute inset-0 flex flex-col justify-end pb-24 sm:pb-28 px-6 sm:px-12 lg:px-20">
            <div className="max-w-xl">
              <Eyebrow dark>{`0${i + 1} / 0${HERO_SLIDES.length}`}</Eyebrow>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.02]" style={{ color: COLORS.paper }}>
                {slide.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg" style={{ color: "#EBE2D2" }}>{slide.tag}</p>
              <a href={`#${slide.key}`} onClick={scrollToId(slide.key)}>
                <Button variant="outline" className="mt-7">
                  Explore <ArrowRight size={16} />
                </Button>
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      <button
        onClick={() => go(active - 1)}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full border"
        style={{ borderColor: "rgba(255,255,255,0.5)", color: COLORS.paper }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(active + 1)}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full border"
        style={{ borderColor: "rgba(255,255,255,0.5)", color: COLORS.paper }}
      >
        <ChevronRight size={20} />
      </button>

      {/* dots */}
      <div className="absolute bottom-8 left-6 sm:left-12 lg:left-20 flex items-center gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: active === i ? 32 : 14,
              backgroundColor: active === i ? COLORS.clay : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* ========================= LEAD FORM ========================= */

const COUNTRY_CODES = ["+91", "+1", "+44", "+971", "+65"];

function LeadForm() {
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [form, setForm] = useState({ name: "", code: "+91", mobile: "", email: "", pincode: "", whatsapp: true });
  const [errors, setErrors] = useState({});

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Enter your full name";
    if (!/^\d{7,10}$/.test(form.mobile)) errs.mobile = "Enter a valid mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!/^\d{4,6}$/.test(form.pincode)) errs.pincode = "Enter a valid pincode";
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  return (
    <section id="get-started" className="w-full py-16 sm:py-24" style={{ backgroundColor: COLORS.espresso }}>
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          dark
          eyebrow="Free design consultation"
          title="Let's get started"
          sub="Share a few details and our design consultants will reach out within 24 hours — no obligation, just ideas."
        />

        {status === "success" ? (
          <div
            className="mt-10 flex flex-col items-center text-center gap-3 py-14 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.walnut}` }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.sage }}>
              <Check size={22} color={COLORS.paper} />
            </div>
            <h3 className="font-serif text-2xl" style={{ color: COLORS.paper }}>You're all set, {form.name.split(" ")[0]}.</h3>
            <p className="text-sm max-w-sm" style={{ color: "#D9CFC0" }}>
              A design consultant will call you shortly on {form.code} {form.mobile}. Keep an eye on WhatsApp too.
            </p>
            <button
              className="mt-2 text-sm underline"
              style={{ color: COLORS.cream }}
              onClick={() => { setStatus("idle"); setForm({ name: "", code: "+91", mobile: "", email: "", pincode: "", whatsapp: true }); }}
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5" noValidate>
            {status === "error" && (
              <div className="md:col-span-2 px-4 py-3 text-sm rounded-sm" style={{ backgroundColor: "rgba(174,90,50,0.15)", color: "#F2C9B4", border: `1px solid ${COLORS.clay}` }}>
                Please fix the highlighted fields before continuing.
              </div>
            )}

            <Field label="Full name" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Aditi Rao"
                className="lead-input"
              />
            </Field>

            <Field label="Mobile number" error={errors.mobile}>
              <div className="flex gap-2">
                <select value={form.code} onChange={(e) => update("code", e.target.value)} className="lead-input !w-24 shrink-0">
                  {COUNTRY_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
                  placeholder="98765 43210"
                  className="lead-input"
                />
              </div>
            </Field>

            <Field label="Email address" error={errors.email}>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@email.com"
                className="lead-input"
              />
            </Field>

            <Field label="Pincode" error={errors.pincode}>
              <input
                value={form.pincode}
                onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
                placeholder="560001"
                className="lead-input"
              />
            </Field>

            <label className="md:col-span-2 flex items-center gap-3 text-sm mt-1" style={{ color: "#D9CFC0" }}>
              <input
                type="checkbox"
                checked={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.checked)}
                className="w-4 h-4"
              />
              <MessageCircle size={16} /> Send me updates and design ideas on WhatsApp
            </label>

            <div className="md:col-span-2 mt-2">
              <Button variant="primary" type="submit" className="w-full sm:w-auto px-10">
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .lead-input {
          width: 100%;
          background: transparent;
          border: 1px solid ${COLORS.walnut};
          color: ${COLORS.paper};
          padding: 12px 14px;
          font-size: 14px;
          border-radius: 2px;
          outline: none;
        }
        .lead-input:focus { border-color: ${COLORS.clay}; }
        .lead-input::placeholder { color: #8A7A65; }
      `}</style>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: "#B7AB98" }}>{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs" style={{ color: "#E39A78" }}>{error}</p>}
    </div>
  );
}

/* ======================== CATEGORY GRID ======================== */

const CATEGORIES = [
  { name: "Kitchens", id: "kitchens" },
  { name: "Wardrobes", id: "wardrobes" },
  { name: "Furnishings", id: "furnishings" },
  { name: "Doors & Windows", id: "doors-windows", photoKey: "doors" },
  { name: "Bathware", id: "bathware" },
];

function CategoryGrid() {
  return (
    <section className="w-full py-16 sm:py-24" style={{ backgroundColor: COLORS.cream }}>
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Shop by room" title="Every space, considered" />
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c, i) => (
            <a
              key={c.name}
              href={`#${c.id}`}
              onClick={scrollToId(c.id)}
              className={`group relative overflow-hidden rounded-sm h-72 sm:h-96 ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}
            >
              <img
                src={photo(c.photoKey || c.id, 700, 900)}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ background: "linear-gradient(0deg, rgba(20,14,8,0.75) 0%, rgba(20,14,8,0.05) 55%)" }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3 className="font-serif text-xl sm:text-2xl" style={{ color: COLORS.paper }}>{c.name}</h3>
                <span
                  className="mt-1 flex items-center gap-1 text-sm font-medium opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  style={{ color: "#EFC9A9" }}
                >
                  Know more <ArrowUpRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== FEATURED COLLECTION ===================== */

const VALUE_PROPS = [
  { title: "Handcrafted Detailing", desc: "Every edge finished by hand, not just machine." },
  { title: "Sustainably Sourced", desc: "Timber and stone traced back to responsible origins." },
  { title: "Lifetime Hardware", desc: "Hinges and runners warrantied for as long as you live here." },
  { title: "Bespoke Consultations", desc: "One designer, one home, from first sketch to install." },
];

function FeaturedCollection() {
  const [active, setActive] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % VALUE_PROPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Autoplay is best-effort — browsers may block it until user interaction.
    videoRef.current?.play?.().catch(() => {});
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[520px] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={ATELIER_VIDEO}
        poster={ATELIER_POSTER}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(20,14,8,0.75) 0%, rgba(20,14,8,0.25) 60%, rgba(20,14,8,0.1) 100%)" }} />

      <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="w-8 h-[1px]" style={{ backgroundColor: COLORS.clay }} />
          <span className="text-xs uppercase tracking-[0.35em]" style={{ color: "#EFC9A9" }}>Homestead Atelier</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl" style={{ color: COLORS.paper }}>The Atelier Collection</h2>

        <div className="mt-8 min-h-[92px]">
          <p className="text-sm uppercase tracking-wide mb-2" style={{ color: COLORS.clay }}>
            {`0${active + 1}`} — {VALUE_PROPS[active].title}
          </p>
          <p className="text-lg" style={{ color: "#EBE2D2" }}>{VALUE_PROPS[active].desc}</p>
        </div>

        <div className="flex gap-2 mt-6">
          {VALUE_PROPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-1 rounded-full transition-all"
              style={{ width: active === i ? 28 : 12, backgroundColor: active === i ? COLORS.clay : "rgba(255,255,255,0.4)" }}
              aria-label={`Value prop ${i + 1}`}
            />
          ))}
        </div>

        <a href="#get-started" onClick={scrollToId("get-started")}>
          <Button variant="outline" className="mt-9 w-fit">View Collection <ArrowRight size={16} /></Button>
        </a>
      </div>
    </section>
  );
}

/* ============================ TOOLS STRIP ============================ */

const TOOLS = [
  { title: "Home Budget Calculator", cta: "Calculate now", photoKey: "furnishings" },
  { title: "Kitchen Cost Calculator", cta: "Calculate now", photoKey: "kitchens" },
  { title: "Wardrobe Cost Calculator", cta: "Calculate now", photoKey: "wardrobes" },
  { title: "Style Configurator", cta: "Get started", photoKey: "lighting" },
  { title: "Find Your Design Style — Quiz", cta: "Get started", photoKey: "bathware" },
];

function ToolsStrip() {
  return (
    <section className="w-full py-16 sm:py-24" style={{ backgroundColor: COLORS.creamSoft }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <SectionHeading eyebrow="Plan smarter" title="Tools to plan your home" />
          <p className="text-sm font-medium" style={{ color: COLORS.sage }}>★★★★★ Loved by 10K+ users</p>
        </div>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 scroll-smooth snap-x" style={{ scrollbarWidth: "thin" }}>
          {TOOLS.map((t) => (
            <a
              key={t.title}
              href="#get-started"
              onClick={scrollToId("get-started")}
              className="group shrink-0 w-64 sm:w-72 snap-start rounded-sm overflow-hidden border"
              style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}
            >
              <div className="h-40 overflow-hidden">
                <img src={photo(t.photoKey, 500, 350)} alt={t.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg" style={{ color: COLORS.espresso }}>{t.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: COLORS.clay }}>
                  {t.cta} <ArrowRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ BLOG CAROUSEL ============================ */

const BLOG_POSTS = [
  { title: "Small Kitchen, Big Ideas: 8 Layouts That Work", date: "12 Jul 2026", photoKey: "kitchens" },
  { title: "The Case for a Walk-in Wardrobe, Even in a Small Home", date: "03 Jul 2026", photoKey: "wardrobes" },
  { title: "Choosing Door Hardware That Ages Well", date: "26 Jun 2026", photoKey: "doors" },
  { title: "Warm Minimalism: A Bathware Edit", date: "18 Jun 2026", photoKey: "bathware" },
  { title: "Layered Lighting, Explained Room by Room", date: "09 Jun 2026", photoKey: "lighting" },
];

function BlogCarousel() {
  return (
    <section id="design-stories" className="w-full py-16 sm:py-24" style={{ backgroundColor: COLORS.cream }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <SectionHeading eyebrow="From the journal" title="Design stories" />
          <span className="text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.clay }}>
            View all <ArrowRight size={14} />
          </span>
        </div>

        <div className="mt-10 flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x scroll-smooth">
          {BLOG_POSTS.map((p) => (
            <div key={p.title} className="group shrink-0 w-72 sm:w-80 snap-start">
              <div className="h-52 overflow-hidden rounded-sm">
                <img src={photo(p.photoKey, 600, 420)} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wide" style={{ color: COLORS.taupe }}>{p.date}</p>
              <h3 className="mt-1 font-serif text-lg leading-snug" style={{ color: COLORS.espresso }}>{p.title}</h3>
              <a
                href={`#${p.photoKey === "kitchens" ? "kitchens" : p.photoKey === "wardrobes" ? "wardrobes" : p.photoKey === "doors" ? "doors-windows" : p.photoKey === "bathware" ? "bathware" : "lighting"}`}
                onClick={scrollToId(p.photoKey === "kitchens" ? "kitchens" : p.photoKey === "wardrobes" ? "wardrobes" : p.photoKey === "doors" ? "doors-windows" : p.photoKey === "bathware" ? "bathware" : "lighting")}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold tracking-wide"
                style={{ color: COLORS.clay }}
              >
                READ <ArrowRight size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ STORE CTA BAND ============================ */

function StoreCTA({ onBook }) {
  return (
    <section id="visit-store" className="relative w-full py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: COLORS.walnut }}>
      <img src={photo("furnishings", 1600, 500)} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Eyebrow dark>Visit us</Eyebrow>
        <h2 className="font-serif text-3xl sm:text-4xl" style={{ color: COLORS.paper }}>Discover in store</h2>
        <p className="mt-4 text-base" style={{ color: "#D9CFC0" }}>
          Touch the finishes, sit in the seating, and talk through your space with a designer at your nearest Homestead studio.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Homestead+Interiors+store"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline"><MapPin size={16} /> Find a Store</Button>
          </a>
          <Button variant="primary" onClick={onBook}>Book Consultation</Button>
        </div>
      </div>
    </section>
  );
}

/* ============================ SEO CONTENT ============================ */

const SEO_SECTIONS = [
  {
    id: "kitchens",
    h: "Kitchens",
    p: [
      "The kitchen has quietly become the room a home is planned around — not just where meals happen, but where the day starts and, more often than not, where everyone ends up by evening. A well-planned kitchen makes room for both.",
      "Our modular kitchens are built around how you actually cook: storage where your hands reach first, worktops that give you room to breathe, and finishes chosen to age gracefully through years of daily use.",
    ],
  },
  {
    id: "wardrobes",
    h: "Wardrobes",
    p: [
      "A wardrobe is a small piece of architecture — it should hold everything you own without asking you to think about it. We design ours around your actual wardrobe, not an imagined one, with sliding and hinged options to suit rooms of every size.",
      "From walk-in closets to compact sliding units, every wardrobe is fitted with soft-close hardware and interiors that keep even a full week's worth of outfits in order.",
    ],
  },
  {
    id: "doors-windows",
    h: "Doors & Windows",
    p: [
      "Doors and windows are the details most homes overlook, yet they set the tone the moment someone steps in. A front door with the right weight and finish makes an entrance feel considered; interior doors that close quietly make a home feel calm.",
      "We work across timber, veneer, and laminate finishes, pairing every door with hardware chosen to match — because a beautiful door with the wrong handle never quite feels finished.",
    ],
  },
  {
    id: "furnishings",
    h: "Furnishings",
    p: [
      "Furnishings are where a house starts to feel like your house. A sofa that fits the way your family actually sits together, a dining table sized for the room rather than the showroom — these choices carry more weight than they're given credit for.",
      "Our furnishings collection spans sofas, dining, beds, and soft furnishings, each piece built on frames meant to outlast trends and upholstered in fabrics chosen for comfort as much as looks.",
    ],
  },
  {
    id: "bathware",
    h: "Bathware",
    p: [
      "The bathroom is the smallest room with the biggest daily impact — a few quiet minutes that can either rush you out the door or ease you into it. Good bathware makes that difference without ever calling attention to itself.",
      "From sanitaryware to fittings and bath furniture, we bring together pieces designed to work as a set: consistent finishes, considered proportions, and details built to handle daily water and daily use.",
    ],
  },
  {
    id: "lighting",
    h: "Lighting",
    p: [
      "Lighting shapes a room more than almost any other choice — the same space can feel stark or serene depending on how it's lit. Layering ceiling, wall, and task lighting lets every room shift with the time of day.",
      "Our lighting range covers ceiling fixtures, wall lights, table lamps, and outdoor lighting, each selected to complement natural light rather than compete with it.",
    ],
  },
];

function SEOContent() {
  return (
    <section className="w-full py-16 sm:py-24" style={{ backgroundColor: COLORS.creamSoft }}>
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-3xl sm:text-4xl mb-6" style={{ color: COLORS.espresso }}>
          Interiors, considered room by room
        </h2>
        <p className="text-base leading-relaxed mb-10" style={{ color: COLORS.taupe }}>
          Homestead Interiors designs and fits kitchens, wardrobes, doors and windows, furnishings, bathware, and
          lighting for homes that are meant to be lived in for a long time. Every project starts with how a space
          is actually used, and ends with details built to hold up to that use — long after the first coat of
          paint has settled in.
        </p>

        {SEO_SECTIONS.map((s) => (
          <div key={s.h} id={s.id} className="mb-9 scroll-mt-24">
            <h3 className="font-serif text-2xl mb-3" style={{ color: COLORS.clayDark }}>{s.h}</h3>
            {s.p.map((para, i) => (
              <p key={i} className="text-[15px] leading-relaxed mb-3" style={{ color: COLORS.taupe }}>{para}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ APPOINTMENT MODAL ============================ */

const REQ_TYPES = ["Full Home Interiors", "Kitchen", "Wardrobes", "Single Room", "Doors & Windows", "Bathware"];
const RENO_STATUS = ["New Construction", "Under Renovation", "Ready to Move"];
const POSSESSION = ["Have Possession", "In 3 Months", "In 6+ Months"];
const BUDGET_RANGES = ["Under ₹5L", "₹5L – ₹10L", "₹10L – ₹20L", "₹20L+"];
const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

function Pill({ active, children, ...rest }) {
  return (
    <button
      className="px-4 py-2.5 rounded-full text-sm font-medium border transition-colors"
      style={{
        backgroundColor: active ? COLORS.clay : "transparent",
        color: active ? COLORS.paper : COLORS.walnut,
        borderColor: active ? COLORS.clay : COLORS.line,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function Stepper({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: COLORS.line }}>
      <span className="text-sm font-medium" style={{ color: COLORS.walnut }}>{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{ borderColor: COLORS.line, color: COLORS.walnut }}
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-sm" style={{ color: COLORS.espresso }}>{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{ borderColor: COLORS.line, color: COLORS.walnut }}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function AppointmentModal({ onClose }) {
  const TOTAL = 6;
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    reqType: "",
    renoStatus: "",
    possession: "",
    rooms: { bedrooms: 1, bathrooms: 1, kitchen: 1 },
    hasBudget: null,
    budget: "",
    date: "",
    slot: "",
  });
  const [done, setDone] = useState(false);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setRoom = (k, v) => setData((d) => ({ ...d, rooms: { ...d.rooms, [k]: v } }));

  const next = () => (step < TOTAL ? setStep(step + 1) : setDone(true));
  const back = () => step > 1 && setStep(step - 1);

  const canNext = () => {
    if (step === 1) return !!data.reqType;
    if (step === 2) return !!data.renoStatus;
    if (step === 3) return !!data.possession;
    if (step === 4) return true;
    if (step === 5) return data.hasBudget !== null && (data.hasBudget === false || !!data.budget);
    if (step === 6) return !!data.date && !!data.slot;
    return false;
  };

  // simple next-14-days date list
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-lg sm:rounded-sm max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.paper }}
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}>
          {!done ? (
            <span className="text-xs font-semibold tracking-wide" style={{ color: COLORS.taupe }}>
              STEP {step}/{TOTAL}
            </span>
          ) : <span />}
          <button onClick={onClose} style={{ color: COLORS.walnut }} aria-label="Close"><X size={20} /></button>
        </div>

        {!done && (
          <div className="h-1 w-full" style={{ backgroundColor: COLORS.line }}>
            <div className="h-1 transition-all duration-300" style={{ width: `${(step / TOTAL) * 100}%`, backgroundColor: COLORS.clay }} />
          </div>
        )}

        <div className="p-6 sm:p-8 min-h-[360px] flex flex-col">
          {done ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.sage }}>
                <Check size={26} color={COLORS.paper} />
              </div>
              <h3 className="font-serif text-2xl" style={{ color: COLORS.espresso }}>You're booked in.</h3>
              <p className="text-sm max-w-xs" style={{ color: COLORS.taupe }}>
                {data.date && new Date(data.date).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} at {data.slot}. A designer will confirm shortly.
              </p>
              <Button variant="primary" className="mt-3" onClick={onClose}>Done</Button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <StepBlock title="What do you need help with?">
                  <div className="flex flex-wrap gap-2">
                    {REQ_TYPES.map((r) => (
                      <Pill key={r} active={data.reqType === r} onClick={() => set("reqType", r)}>{r}</Pill>
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 2 && (
                <StepBlock title="What's the status of your home?">
                  <div className="flex flex-wrap gap-2">
                    {RENO_STATUS.map((r) => (
                      <Pill key={r} active={data.renoStatus === r} onClick={() => set("renoStatus", r)}>{r}</Pill>
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 3 && (
                <StepBlock title="When do you get possession?">
                  <div className="flex flex-wrap gap-2">
                    {POSSESSION.map((r) => (
                      <Pill key={r} active={data.possession === r} onClick={() => set("possession", r)}>{r}</Pill>
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 4 && (
                <StepBlock title="How many rooms are we designing?">
                  <Stepper label="Bedrooms" value={data.rooms.bedrooms} onChange={(v) => setRoom("bedrooms", v)} />
                  <Stepper label="Bathrooms" value={data.rooms.bathrooms} onChange={(v) => setRoom("bathrooms", v)} />
                  <Stepper label="Kitchens" value={data.rooms.kitchen} onChange={(v) => setRoom("kitchen", v)} />
                </StepBlock>
              )}

              {step === 5 && (
                <StepBlock title="Do you have a budget in mind?">
                  <div className="flex gap-2 mb-5">
                    <Pill active={data.hasBudget === true} onClick={() => set("hasBudget", true)}>Yes</Pill>
                    <Pill active={data.hasBudget === false} onClick={() => { set("hasBudget", false); set("budget", ""); }}>No, not yet</Pill>
                  </div>
                  {data.hasBudget && (
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_RANGES.map((b) => (
                        <Pill key={b} active={data.budget === b} onClick={() => set("budget", b)}>{b}</Pill>
                      ))}
                    </div>
                  )}
                </StepBlock>
              )}

              {step === 6 && (
                <StepBlock title="Pick a date & time">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: COLORS.taupe }}>
                    <CalendarIcon size={14} /> DATE
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                    {dates.map((d) => {
                      const iso = d.toDateString();
                      const active = data.date === iso;
                      return (
                        <button
                          key={iso}
                          onClick={() => set("date", iso)}
                          className="shrink-0 w-14 py-2 rounded-sm border flex flex-col items-center"
                          style={{ borderColor: active ? COLORS.clay : COLORS.line, backgroundColor: active ? COLORS.clay : "transparent" }}
                        >
                          <span className="text-[10px]" style={{ color: active ? COLORS.paper : COLORS.taupe }}>
                            {d.toLocaleDateString(undefined, { weekday: "short" })}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: active ? COLORS.paper : COLORS.espresso }}>
                            {d.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: COLORS.taupe }}>
                    <Clock size={14} /> TIME SLOT
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((t) => (
                      <Pill key={t} active={data.slot === t} onClick={() => set("slot", t)}>{t}</Pill>
                    ))}
                  </div>
                </StepBlock>
              )}

              <div className="mt-auto pt-8 flex items-center justify-between">
                <button
                  onClick={back}
                  disabled={step === 1}
                  className="text-sm font-medium disabled:opacity-30"
                  style={{ color: COLORS.walnut }}
                >
                  ← Previous Question
                </button>
                <Button variant="primary" disabled={!canNext()} onClick={next} className={!canNext() ? "opacity-40 pointer-events-none" : ""}>
                  {step === TOTAL ? "Confirm Booking" : "Next"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StepBlock({ title, children }) {
  return (
    <div>
      <h3 className="font-serif text-2xl mb-6" style={{ color: COLORS.espresso }}>{title}</h3>
      {children}
    </div>
  );
}

/* ============================ FOOTER ============================ */

function Footer() {
  return (
    <footer style={{ backgroundColor: COLORS.espresso }}>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <span className="font-serif text-2xl" style={{ color: COLORS.paper }}>Homestead</span>
            <p className="mt-3 text-sm max-w-xs" style={{ color: "#B7AB98" }}>
              Considered interiors for homes meant to be lived in for a long time.
            </p>
            <div className="mt-5">
              <label className="text-xs uppercase tracking-wide" style={{ color: "#B7AB98" }}>Newsletter</label>
              <div className="mt-2 flex">
                <input
                  placeholder="Your email"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: "transparent", border: `1px solid ${COLORS.walnut}`, color: COLORS.paper }}
                />
                <button className="px-4 text-sm font-semibold" style={{ backgroundColor: COLORS.clay, color: COLORS.paper }}>
                  Join
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-6 text-sm" style={{ color: "#B7AB98" }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>

          {NAV.slice(0, 5).map((col) => (
            <div key={col.label}>
              <a
                href={`#${col.id}`}
                onClick={scrollToId(col.id)}
                className="text-sm font-semibold mb-3 block"
                style={{ color: COLORS.paper }}
              >
                {col.label}
              </a>
              <ul className="space-y-2">
                {col.links.slice(0, 4).map((l) => (
                  <li key={l}>
                    <a href={`#${col.id}`} onClick={scrollToId(col.id)} className="text-sm" style={{ color: "#B7AB98" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: COLORS.walnut, color: "#8A7A65" }}>
          <span>© {new Date().getFullYear()} Homestead Interiors. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================ APP ============================ */

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: COLORS.cream, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.line}; border-radius: 4px; }
      `}</style>

      <Header onBook={() => setModalOpen(true)} />
      <Hero />
      <LeadForm />
      <CategoryGrid />
      <FeaturedCollection />
      <ToolsStrip />
      <BlogCarousel />
      <StoreCTA onBook={() => setModalOpen(true)} />
      <SEOContent />
      <Footer />

      {/* Floating appointment CTA */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg text-sm font-semibold"
        style={{ backgroundColor: COLORS.clay, color: COLORS.paper }}
      >
        <CalendarIcon size={16} /> Book a Consultation
      </button>

      {modalOpen && <AppointmentModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
