import { useState, useRef, useEffect } from "react"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type ConfirmationResult,
} from "firebase/auth"
import { auth } from "./firebase"

// ── Data ──────────────────────────────────────────────────────────────────────

const BIKES = [
  {
    id: 1,
    name: "Royal Enfield Classic 350",
    type: "Cruiser",
    price: 800,
    cc: 350,
    img: "https://images.unsplash.com/photo-1564594387897-c2a7adfd2b1b?w=600&h=380&fit=crop&auto=format",
    available: true,
    badge: "Popular",
    fuel: "35 kmpl",
  },
  {
    id: 2,
    name: "TVS Apache RTR 160",
    type: "Sports",
    price: 600,
    cc: 160,
    img: "https://images.unsplash.com/photo-1783791088800-966ed574f664?w=600&h=380&fit=crop&auto=format",
    available: true,
    badge: "",
    fuel: "45 kmpl",
  },
  {
    id: 3,
    name: "Honda SP 125",
    type: "Commuter",
    price: 450,
    cc: 125,
    img: "https://images.unsplash.com/photo-1763270204968-0b49cc03efbc?w=600&h=380&fit=crop&auto=format",
    available: true,
    badge: "Best Value",
    fuel: "60 kmpl",
  },
  {
    id: 4,
    name: "Bajaj Pulsar NS200",
    type: "Sports",
    price: 750,
    cc: 200,
    img: "https://images.unsplash.com/photo-1556036518-705db5129896?w=600&h=380&fit=crop&auto=format",
    available: false,
    badge: "",
    fuel: "40 kmpl",
  },
  {
    id: 5,
    name: "Royal Enfield Hunter 350",
    type: "Cruiser",
    price: 900,
    cc: 350,
    img: "https://images.unsplash.com/photo-1771402563765-0bfd3dd6d2d7?w=600&h=380&fit=crop&auto=format",
    available: true,
    badge: "Premium",
    fuel: "36 kmpl",
  },
  {
    id: 6,
    name: "Yamaha FZ-S V3",
    type: "Street",
    price: 550,
    cc: 149,
    img: "https://images.unsplash.com/photo-1556036518-705db5129896?w=600&h=380&fit=crop&auto=format",
    available: true,
    badge: "",
    fuel: "48 kmpl",
  },
]

const ROUTES = [
  {
    id: 1,
    name: "Shankarpur Beach",
    distance: "14 km",
    duration: "25 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1770703674674-79d3e536a4a6?w=600&h=360&fit=crop&auto=format",
    desc: "A quiet fishing village with a pristine beach, perfect for a short morning ride along the shoreline.",
    highlights: ["Fish market at sunrise", "Coconut shacks", "Seashore cycling track"],
  },
  {
    id: 2,
    name: "Tajpur Beach",
    distance: "25 km",
    duration: "40 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1775132693217-32c5c775adfd?w=600&h=360&fit=crop&auto=format",
    desc: "Undisturbed golden sands lined with casuarina trees — almost no crowds, just the sound of waves.",
    highlights: ["Casuarina groves", "Bird watching", "Bonfire evenings"],
  },
  {
    id: 3,
    name: "Mandarmani",
    distance: "45 km",
    duration: "1 hr",
    difficulty: "Moderate",
    img: "https://images.unsplash.com/photo-1778410350863-20fa393261f8?w=600&h=360&fit=crop&auto=format",
    desc: "Ride directly on the sand — one of India's longest drivable beaches, famous for red crabs.",
    highlights: ["Beach riding on sand", "Red crab colony", "Fresh seafood restaurants"],
  },
  {
    id: 4,
    name: "Junput Beach",
    distance: "30 km",
    duration: "50 min",
    difficulty: "Easy",
    img: "https://images.unsplash.com/photo-1770703674674-79d3e536a4a6?w=600&h=360&fit=crop&auto=format",
    desc: "Mangrove groves and a secluded cove where dolphins occasionally swim close to shore.",
    highlights: ["Mangrove walks", "Dolphin sightings", "Old lighthouse"],
  },
]

const TESTIMONIALS = [
  {
    name: "Arjun Mukherjee",
    city: "Kolkata",
    rating: 5,
    text: "Rented a Classic 350 for three days. The bike was in perfect condition and the staff mapped out the best coastal route to Mandarmani. Unforgettable trip!",
    avatar: "AM",
  },
  {
    name: "Priya Sharma",
    city: "Delhi",
    rating: 5,
    text: "Super affordable rates and bikes were well maintained. Rode to Tajpur at sunset — absolutely magical. Will definitely rent from Panda again next season.",
    avatar: "PS",
  },
  {
    name: "Rahul Das",
    city: "Howrah",
    rating: 4,
    text: "Easy booking, flexible pickup time. The Apache RTR was great for the coastal roads. Highly recommend for anyone visiting Digha.",
    avatar: "RD",
  },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconHome({ active }: { active: boolean }) {
  const c = active ? "#F97316" : "#A0918A"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={active ? "#F97316" : "none"} fillOpacity={active ? 0.15 : 0} />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconBike({ active }: { active: boolean }) {
  const c = active ? "#F97316" : "#A0918A"
  return (
    <svg width="26" height="22" viewBox="0 0 26 20" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="15" r="3.5" />
      <circle cx="20.5" cy="15" r="3.5" />
      <path d="M9 15h7" />
      <path d="M9 15L11 7h5l3 5" />
      <path d="M16 7l4 8" />
      <path d="M7 7h4" />
    </svg>
  )
}

function IconMap({ active }: { active: boolean }) {
  const c = active ? "#F97316" : "#A0918A"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" fill={active ? "#F97316" : "none"} fillOpacity={active ? 0.1 : 0} />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function IconCalendar({ active }: { active: boolean }) {
  const c = active ? "#F97316" : "#A0918A"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill={active ? "#F97316" : "none"} fillOpacity={active ? 0.12 : 0} />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

// ── Star Rating ───────────────────────────────────────────────────────────────

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= n ? "#F59E0B" : "#E6DDD3"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Bike = (typeof BIKES)[number]
type SetTab = (t: string) => void
type SetBike = (b: Bike | null) => void

// ── Home Screen ───────────────────────────────────────────────────────────────

function HomeScreen({ setTab }: { setTab: SetTab }) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative h-[300px] md:h-[500px] bg-ink-raised flex-shrink-0">
        <img
          src="/Screenshot 2026-09-01 230254.png"
          alt="Motorcycle parked by the ocean at Digha beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Top bar — mobile only (desktop uses sidebar) */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-5 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-base">🐼</div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">PANDA BIKE</p>
              <p className="text-white/60 text-[9px] tracking-wider">RENTAL · DIGHA</p>
            </div>
          </div>
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 10.8 19.79 19.79 0 01.06 2.22 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
            </svg>
            <span className="text-white text-xs font-medium">Call Us</span>
          </a>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 pb-5 md:pb-12">
          <p className="text-brand text-[10px] font-bold tracking-[0.18em] uppercase mb-1.5">Digha, West Bengal</p>
          <h1 className="font-display font-bold text-white text-[26px] md:text-5xl leading-tight mb-4">
            Explore Digha<br />on Two Wheels
          </h1>
          <div className="flex gap-2.5 md:gap-4">
            <button
              onClick={() => setTab("fleet")}
              className="flex-1 md:flex-none md:px-8 bg-brand text-white font-semibold text-sm py-2.5 rounded-xl active:opacity-90 transition-opacity"
            >
              Browse Fleet
            </button>
            <button
              onClick={() => setTab("book")}
              className="flex-1 md:flex-none md:px-8 bg-white/10 border border-white/20 text-white font-semibold text-sm py-2.5 rounded-xl backdrop-blur-sm active:opacity-90"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 border-b border-ink-border py-4 md:py-6 mx-5 md:mx-10">
        {[
          { val: "500+", label: "Riders" },
          { val: "15+", label: "Models" },
          { val: "4.8★", label: "Rating" },
          { val: "₹450", label: "From/day" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="font-display font-bold text-brand text-[15px] md:text-xl">{s.val}</span>
            <span className="text-muted text-[10px] md:text-xs mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Why us */}
      <div className="px-5 md:px-10 py-5 md:py-8">
        <h2 className="font-display font-bold text-sand text-lg md:text-2xl mb-4">Why Ride with Us?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[
            { icon: "🕐", title: "24/7 Pickup", desc: "Flexible pickup and drop-off, any hour of the day." },
            { icon: "💰", title: "Best Rates", desc: "Starting at ₹450/day with zero hidden charges." },
            { icon: "🔧", title: "Serviced Bikes", desc: "Every bike inspected before and after each rental." },
            { icon: "🗺️", title: "Route Guides", desc: "Get curated coastal route maps from local riders." },
          ].map((f) => (
            <div key={f.title} className="bg-ink-card border border-ink-border rounded-2xl p-4 md:p-5">
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <h3 className="text-sand font-semibold text-sm md:text-base mb-1">{f.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick fleet preview */}
      <div className="px-5 md:px-10 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sand text-lg md:text-2xl">Our Bikes</h2>
          <button onClick={() => setTab("fleet")} className="text-brand text-sm font-medium">
            See all →
          </button>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {BIKES.filter((b) => b.available).slice(0, 4).map((bike) => (
            <div
              key={bike.id}
              className="min-w-[185px] bg-ink-card border border-ink-border rounded-2xl overflow-hidden flex-shrink-0"
            >
              <div className="relative h-28 bg-ink-raised">
                <img src={bike.img} alt={bike.name} className="w-full h-full object-cover" />
                {bike.badge && (
                  <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bike.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sand font-semibold text-xs leading-tight mb-2">{bike.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand font-display font-bold text-sm">
                    ₹{bike.price}
                    <span className="text-muted font-body font-normal text-[10px]">/day</span>
                  </span>
                  <span className="text-muted text-[10px] bg-ink-raised px-2 py-0.5 rounded-full">{bike.cc}cc</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
          {BIKES.filter((b) => b.available).slice(0, 4).map((bike) => (
            <div
              key={bike.id}
              className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden"
            >
              <div className="relative h-36 bg-ink-raised">
                <img src={bike.img} alt={bike.name} className="w-full h-full object-cover" />
                {bike.badge && (
                  <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bike.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sand font-semibold text-sm leading-tight mb-2">{bike.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand font-display font-bold text-base">
                    ₹{bike.price}
                    <span className="text-muted font-body font-normal text-xs">/day</span>
                  </span>
                  <span className="text-muted text-xs bg-ink-raised px-2 py-0.5 rounded-full">{bike.cc}cc</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-5 md:px-10 pb-5">
        <h2 className="font-display font-bold text-sand text-lg md:text-2xl mb-4">What Riders Say</h2>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-ink-card border border-ink-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand/15 border border-brand/25 flex items-center justify-center text-brand font-bold text-xs flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sand font-semibold text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.city}</p>
                </div>
                <Stars n={t.rating} />
              </div>
              <p className="text-muted text-xs leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA banner */}
      <div className="mx-5 md:mx-10 mb-6">
        <div className="relative rounded-3xl overflow-hidden h-36 md:h-52 bg-ink-raised">
          <img
            src="https://images.unsplash.com/photo-1780926539659-2ecaa95b2f62?w=700&h=300&fit=crop&auto=format"
            alt="Motorcycle on coastal cliff at sunset"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-black/25 rounded-3xl">
            <p className="font-display font-bold text-white text-lg md:text-2xl mb-1">Ready to Ride?</p>
            <p className="text-white/70 text-xs md:text-sm mb-3">Book your bike — pay at pickup, cancel anytime</p>
            <button
              onClick={() => setTab("book")}
              className="bg-brand text-white font-semibold text-sm md:text-base px-7 md:px-10 py-2 md:py-3 rounded-full"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Fleet Screen ──────────────────────────────────────────────────────────────

function FleetScreen({ setTab, setSelectedBike }: { setTab: SetTab; setSelectedBike: SetBike }) {
  const [filter, setFilter] = useState("All")
  const filters = ["All", "Cruiser", "Sports", "Commuter", "Street"]
  const visible = filter === "All" ? BIKES : BIKES.filter((b) => b.type === filter)

  return (
    <div className="flex flex-col">
      <div className="px-5 md:px-10 pt-5 md:pt-8 pb-3">
        <h1 className="font-display font-bold text-sand text-2xl md:text-3xl">Our Fleet</h1>
        <p className="text-muted text-sm mt-1">Well-maintained bikes for every rider</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 md:px-10 pb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f
                ? "bg-brand text-white border-brand"
                : "bg-ink-card text-muted border-ink-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bike cards — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        {visible.map((bike) => (
          <div key={bike.id} className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden">
            <div className="relative h-48 md:h-52 bg-ink-raised">
              <img src={bike.img} alt={bike.name} className="w-full h-full object-cover" />
              {!bike.available && (
                <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                  <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Currently Booked
                  </span>
                </div>
              )}
              {bike.badge && bike.available && (
                <span className="absolute top-3 left-3 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                  {bike.badge}
                </span>
              )}
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-white/90 text-xs font-medium">{bike.cc}cc</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1.5">
                <div>
                  <h3 className="font-display font-semibold text-sand text-base leading-snug">{bike.name}</h3>
                  <span className="text-brand text-xs font-medium">{bike.type}</span>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <p className="font-display font-bold text-brand text-xl">₹{bike.price}</p>
                  <p className="text-muted text-[10px]">per day</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3.5 mt-2">
                <span className="text-muted text-xs">⛽ {bike.fuel}</span>
                <span className="text-muted text-xs">👥 2 seats</span>
                <span className={`text-xs font-semibold ${bike.available ? "text-green-400" : "text-red-400"}`}>
                  {bike.available ? "● Available" : "● Unavailable"}
                </span>
              </div>
              <button
                disabled={!bike.available}
                onClick={() => {
                  setSelectedBike(bike)
                  setTab("book")
                }}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity ${
                  bike.available
                    ? "bg-brand text-white active:opacity-90"
                    : "bg-ink-raised text-muted cursor-not-allowed"
                }`}
              >
                {bike.available ? "Book This Bike" : "Not Available"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Routes Screen ─────────────────────────────────────────────────────────────

function RoutesScreen() {
  const [detail, setDetail] = useState<(typeof ROUTES)[number] | null>(null)

  if (detail) {
    return (
      <div className="flex flex-col">
        <div className="relative h-56 md:h-80 bg-ink-raised flex-shrink-0">
          <img src={detail.img} alt={detail.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent" />
          <button
            onClick={() => setDetail(null)}
            className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white w-9 h-9 rounded-full flex items-center justify-center text-xl leading-none"
          >
            ‹
          </button>
        </div>
        <div className="px-5 md:px-10 pt-4 pb-8">
          <div className="md:max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  detail.difficulty === "Easy"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {detail.difficulty}
              </span>
              <span className="text-muted text-xs">{detail.distance} &nbsp;·&nbsp; {detail.duration}</span>
            </div>
            <h1 className="font-display font-bold text-sand text-2xl md:text-3xl mb-3">{detail.name}</h1>
            <p className="text-muted text-sm leading-relaxed mb-5">{detail.desc}</p>
            <h3 className="text-sand font-semibold text-sm mb-3">Highlights</h3>
            <div className="flex flex-col gap-2 mb-5">
              {detail.highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 bg-ink-card border border-ink-border rounded-xl px-4 py-3">
                  <span className="text-brand text-sm">✦</span>
                  <span className="text-sand text-sm">{h}</span>
                </div>
              ))}
            </div>
            <div className="bg-ink-card border border-brand/25 rounded-2xl p-4">
              <p className="text-brand text-xs font-bold mb-1">Recommended Bikes</p>
              <p className="text-muted text-xs leading-relaxed">
                Royal Enfield Classic 350 or TVS Apache RTR 160 are ideal for this coastal stretch.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 md:px-10 pt-5 md:pt-8 pb-3">
        <h1 className="font-display font-bold text-sand text-2xl md:text-3xl">Explore Digha</h1>
        <p className="text-muted text-sm mt-1">Top rides from New Digha town</p>
      </div>

      {/* Featured card */}
      <div className="px-5 md:px-10 mb-4">
        <div
          className="relative h-52 md:h-72 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => setDetail(ROUTES[2])}
        >
          <img src={ROUTES[2].img} alt={ROUTES[2].name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <span className="bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 inline-block">
              ✦ Featured Route
            </span>
            <h3 className="font-display font-bold text-white text-xl md:text-2xl mt-1">{ROUTES[2].name}</h3>
            <p className="text-white/65 text-xs md:text-sm mt-0.5">
              {ROUTES[2].distance} &nbsp;·&nbsp; {ROUTES[2].duration} &nbsp;·&nbsp; {ROUTES[2].difficulty}
            </p>
          </div>
        </div>
      </div>

      {/* Route list — 1 col mobile, 2 col desktop */}
      <div className="px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROUTES.map((route) => (
          <button
            key={route.id}
            onClick={() => setDetail(route)}
            className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden flex text-left"
          >
            <div className="w-28 md:w-36 h-24 md:h-28 flex-shrink-0 bg-ink-raised">
              <img src={route.img} alt={route.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex flex-col justify-center flex-1 min-w-0">
              <h3 className="text-sand font-semibold text-sm leading-tight mb-1 truncate">{route.name}</h3>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-muted text-xs">📍 {route.distance}</span>
                <span className="text-muted text-xs">⏱ {route.duration}</span>
              </div>
              <span
                className={`text-[11px] font-semibold w-fit px-2 py-0.5 rounded-full ${
                  route.difficulty === "Easy"
                    ? "bg-green-500/12 text-green-400"
                    : "bg-amber-500/12 text-amber-400"
                }`}
              >
                {route.difficulty}
              </span>
            </div>
            <div className="flex items-center pr-4 text-muted text-xl">›</div>
          </button>
        ))}
      </div>

      {/* Riding tips */}
      <div className="mx-5 md:mx-10 my-5 bg-ink-card border border-ink-border rounded-2xl p-4">
        <h3 className="text-sand font-semibold text-sm mb-3">🏍 Riding Tips for Digha</h3>
        <div className="flex flex-col gap-2">
          {[
            "Carry valid DL and Aadhaar ID while riding",
            "Best riding hours: 6–9 AM and 4–7 PM",
            "Petrol pumps available on all major routes",
            "Avoid NH-116B during evening peak hours",
          ].map((tip, i) => (
            <p key={i} className="text-muted text-xs leading-relaxed flex gap-2">
              <span className="text-brand flex-shrink-0">•</span>
              {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Book Screen ───────────────────────────────────────────────────────────────

function BookScreen({ selectedBike }: { selectedBike: Bike | null }) {
  const defaultId = selectedBike ? String(selectedBike.id) : "1"
  const [form, setForm] = useState({ name: "", phone: "", date: "", days: "1", bikeId: defaultId })
  const [done, setDone] = useState(false)

  const currentBike = BIKES.find((b) => String(b.id) === form.bikeId) ?? BIKES[0]
  const total = currentBike.price * parseInt(form.days || "1")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center px-8 text-center pt-20 pb-10">
        <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center text-3xl mb-5">
          ✓
        </div>
        <h2 className="font-display font-bold text-sand text-2xl mb-2">Booking Request Sent!</h2>
        <p className="text-muted text-sm leading-relaxed mb-1">
          Thank you, {form.name}! We&apos;ll confirm your booking for the
        </p>
        <p className="text-sand font-semibold text-sm mb-1">{currentBike.name}</p>
        <p className="text-muted text-sm mb-4">via WhatsApp within 30 minutes.</p>
        <p className="font-display font-bold text-brand text-2xl mb-6">₹{total.toLocaleString()}</p>
        <div className="bg-ink-card border border-ink-border rounded-2xl p-4 w-full max-w-sm text-left mb-6">
          <p className="text-muted text-xs mb-2">Booking Summary</p>
          <p className="text-sand text-sm font-semibold">{currentBike.name}</p>
          <p className="text-muted text-xs mt-1">
            {form.days} day{parseInt(form.days) > 1 ? "s" : ""} starting {form.date}
          </p>
        </div>
        <button onClick={() => setDone(false)} className="text-brand text-sm font-medium underline underline-offset-2">
          Make another booking
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      <div className="px-5 md:px-10 pt-5 md:pt-8 pb-4">
        <h1 className="font-display font-bold text-sand text-2xl md:text-3xl">Book a Bike</h1>
        <p className="text-muted text-sm mt-1">Fill in your details to reserve</p>
      </div>

      {/* Desktop: two-column layout; Mobile: single column */}
      <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8 md:px-10 md:items-start">

        {/* ── Left: Form ── */}
        <form onSubmit={handleSubmit} className="px-5 md:px-0 flex flex-col gap-4">
          {/* Bike selector */}
          <div>
            <label className="text-sand text-xs font-semibold mb-2 block">Select Bike</label>
            <select
              value={form.bikeId}
              onChange={(e) => setForm({ ...form, bikeId: e.target.value })}
              className="w-full bg-ink-card border border-ink-border text-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand"
              style={{ colorScheme: "dark" }}
            >
              {BIKES.filter((b) => b.available).map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name} — ₹{b.price}/day
                </option>
              ))}
            </select>
          </div>

          {/* Bike preview — mobile only */}
          <div className="md:hidden flex items-center gap-3 bg-ink-card border border-brand/25 rounded-xl p-3">
            <div className="w-16 h-12 rounded-lg overflow-hidden bg-ink-raised flex-shrink-0">
              <img src={currentBike.img} alt={currentBike.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sand text-sm font-semibold">{currentBike.name}</p>
              <p className="text-brand text-xs mt-0.5">
                ₹{currentBike.price}/day &nbsp;·&nbsp; {currentBike.cc}cc &nbsp;·&nbsp; {currentBike.fuel}
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sand text-xs font-semibold mb-2 block">Full Name</label>
            <input
              type="text"
              placeholder="Rahul Kumar"
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-ink-card border border-ink-border text-sand rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-brand"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sand text-xs font-semibold mb-2 block">WhatsApp Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              required
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-ink-card border border-ink-border text-sand rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-brand"
            />
          </div>

          {/* Date + Days */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sand text-xs font-semibold mb-2 block">Start Date</label>
              <input
                type="date"
                value={form.date}
                required
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{ colorScheme: "dark" }}
                className="w-full bg-ink-card border border-ink-border text-sand rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="text-sand text-xs font-semibold mb-2 block">Duration</label>
              <select
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                style={{ colorScheme: "dark" }}
                className="w-full bg-ink-card border border-ink-border text-sand rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-brand"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={String(d)}>
                    {d} day{d > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price summary — mobile only */}
          <div className="md:hidden bg-ink-raised border border-ink-border rounded-xl px-4 py-3">
            <div className="flex justify-between items-center text-muted text-xs mb-2">
              <span>₹{currentBike.price} × {form.days} day{parseInt(form.days) > 1 ? "s" : ""}</span>
              <span className="text-sand font-medium">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-ink-border pt-2.5">
              <span className="text-sand text-sm font-bold">Total Due at Pickup</span>
              <span className="font-display font-bold text-brand text-xl">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand text-white font-display font-bold py-3.5 rounded-xl text-base active:opacity-90 transition-opacity"
          >
            Confirm Booking
          </button>

          <p className="text-muted text-[10px] text-center leading-relaxed">
            Carry a valid driving license. Payment collected at pickup. Free cancellation up to 2 hours before pickup.
          </p>
        </form>

        {/* ── Right: Summary panel — desktop only ── */}
        <div className="hidden md:flex flex-col gap-4 sticky top-6 px-0">
          {/* Bike image card */}
          <div className="bg-ink-card border border-ink-border rounded-2xl overflow-hidden">
            <div className="h-44 bg-ink-raised">
              <img src={currentBike.img} alt={currentBike.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold text-sand text-base">{currentBike.name}</h3>
              <p className="text-brand text-sm mt-1">
                {currentBike.cc}cc &nbsp;·&nbsp; {currentBike.fuel} &nbsp;·&nbsp; {currentBike.type}
              </p>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-ink-raised border border-ink-border rounded-xl px-4 py-4">
            <div className="flex justify-between items-center text-muted text-xs mb-2">
              <span>₹{currentBike.price} × {form.days} day{parseInt(form.days) > 1 ? "s" : ""}</span>
              <span className="text-sand font-medium">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-ink-border pt-2.5">
              <span className="text-sand text-sm font-bold">Total Due at Pickup</span>
              <span className="font-display font-bold text-brand text-xl">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-ink-card border border-brand/25 rounded-2xl p-4">
            <p className="text-brand text-xs font-bold mb-2">📋 Booking Info</p>
            <div className="flex flex-col gap-1.5">
              {[
                "Pay at pickup — no advance required",
                "Free cancellation up to 2 hrs before",
                "Valid driving license required",
                "WhatsApp confirmation within 30 min",
              ].map((info) => (
                <p key={info} className="text-muted text-xs flex gap-2">
                  <span className="text-brand flex-shrink-0">•</span>
                  {info}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── OTP Input ─────────────────────────────────────────────────────────────────

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const boxes = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const digits = value.padEnd(6, " ").split("").slice(0, 6)

  function handleChange(i: number, raw: string) {
    const d = raw.replace(/\D/g, "").slice(-1)
    const arr = digits.map((c) => (c.trim() ? c : ""))
    arr[i] = d
    onChange(arr.join(""))
    if (d && i < 5) boxes.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i]?.trim() && i > 0) {
      boxes.current[i - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2.5 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { boxes.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-11 h-13 text-center bg-ink-card border border-ink-border text-sand font-display font-bold text-xl rounded-xl focus:outline-none focus:border-brand focus:bg-ink-raised transition-colors"
        />
      ))}
    </div>
  )
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({
  onOtpSent,
  onGuestLogin,
}: {
  onOtpSent: (phone: string, confirmation: ConfirmationResult) => void
  onGuestLogin: () => void
}) {
  const [phone, setPhone] = useState("")
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (phone.replace(/\D/g, "").length !== 10) return
    setLoading(true)
    setError("")
    try {
      // Set up invisible reCAPTCHA
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      })
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, recaptcha)
      onOtpSent(phone, confirmation)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP. Try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      // onAuthStateChanged in App will handle the transition
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 h-full">
      {/* Hero image — 52% height on mobile top, full-height left column on desktop */}
      <div className="relative flex-shrink-0 h-[52%] md:h-auto md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1780926539659-2ecaa95b2f62?w=800&h=900&fit=crop&auto=format"
          alt="Motorcycle on coastal cliff at Digha"
          className="w-full h-full object-cover"
        />
        {/* Mobile gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FFFCF7] md:hidden" />
        {/* Desktop gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/55 hidden md:block" />

        {/* Mobile logo overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-6 md:hidden">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-3xl shadow-[0_8px_32px_rgba(249,115,22,0.5)] mb-3">
            🐼
          </div>
          <p className="font-display font-bold text-white text-2xl tracking-wide">PANDA BIKE</p>
          <p className="text-white/60 text-xs tracking-[0.2em] mt-1 uppercase">Rental · Digha, W.B.</p>
        </div>

        {/* Desktop logo overlay */}
        <div className="absolute inset-0 hidden md:flex flex-col items-center justify-center gap-2">
          <div className="w-20 h-20 rounded-3xl bg-brand flex items-center justify-center text-4xl shadow-[0_12px_40px_rgba(249,115,22,0.6)] mb-2">
            🐼
          </div>
          <p className="font-display font-bold text-white text-3xl tracking-wide">PANDA BIKE</p>
          <p className="text-white/70 text-sm tracking-[0.25em] uppercase">Rental · Digha, West Bengal</p>
          <div className="mt-8 flex flex-col gap-2.5 text-center">
            <p className="text-white/65 text-sm">🏍 Premium bikes for coastal adventures</p>
            <p className="text-white/65 text-sm">📍 Based in New Digha — since 2019</p>
            <p className="text-white/65 text-sm">⭐ 4.8 rating from 500+ happy riders</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 bg-ink-card rounded-t-[32px] md:rounded-none -mt-8 md:mt-0 relative z-10 flex flex-col px-6 md:px-12 pt-7 md:pt-0 pb-6 overflow-y-auto no-scrollbar shadow-[0_-8px_32px_rgba(0,0,0,0.08)] md:shadow-none md:justify-center">
        {/* Pull indicator — mobile only */}
        <div className="w-10 h-1 bg-ink-raised rounded-full mx-auto mb-6 md:hidden" />

        <div className="md:max-w-sm md:w-full md:mx-auto">
          <h2 className="font-display font-bold text-sand text-2xl md:text-3xl mb-1">Welcome back</h2>
          <p className="text-muted text-sm mb-7">Sign in to manage bookings and your ride history</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Phone input */}
            <div>
              <label className="text-sand text-xs font-semibold mb-2 block">Mobile Number</label>
              <div
                className={`flex items-center bg-ink-card border rounded-xl overflow-hidden transition-colors ${
                  focused ? "border-brand" : "border-ink-border"
                }`}
              >
                <div className="flex items-center gap-2 px-4 py-3 border-r border-ink-border flex-shrink-0">
                  <span className="text-base">🇮🇳</span>
                  <span className="text-sand text-sm font-semibold">+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  required
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 bg-transparent text-sand text-sm px-4 py-3 placeholder:text-muted/45 focus:outline-none"
                />
                {phone.length === 10 && (
                  <span className="text-green-400 text-sm pr-4">✓</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length !== 10 || loading}
              className="w-full bg-brand disabled:bg-brand/30 disabled:text-white/40 text-white font-display font-bold py-3.5 rounded-xl text-base transition-all active:scale-[0.98]"
            >
              {loading ? "Sending OTP…" : "Get OTP"}
            </button>

            {/* Invisible reCAPTCHA anchor */}
            <div id="recaptcha-container" />

            {error && (
              <p className="text-red-400 text-xs text-center -mt-1">{error}</p>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-ink-border" />
            <span className="text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-ink-border" />
          </div>

          {/* Google sign in */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-ink-card border border-ink-border text-sand font-semibold text-sm py-3 rounded-xl active:opacity-80 transition-opacity disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Guest link */}
          <p className="text-center text-muted text-xs mt-5">
            Just browsing?{" "}
            <button onClick={onGuestLogin} className="text-brand font-semibold">
              Continue as Guest
            </button>
          </p>

          <p className="text-center text-muted/50 text-[10px] mt-4 leading-relaxed">
            By continuing you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

// ── OTP Screen ────────────────────────────────────────────────────────────────

function OtpScreen({
  phone,
  confirmation,
  onVerify,
  onBack,
}: {
  phone: string
  confirmation: ConfirmationResult
  onVerify: () => void
  onBack: () => void
}) {
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(30)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (otp.trim().length < 6) { setError("Please enter all 6 digits"); return }
    setLoading(true)
    setError("")
    try {
      await confirmation.confirm(otp)
      onVerify() // auth state change will handle the rest
    } catch {
      setError("Incorrect OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const masked = `+91 ${phone.slice(0, 5)}XXXXX`

  return (
    <div className="flex flex-col flex-1 h-full bg-ink-card md:bg-ink md:items-center md:justify-center">
      <div className="w-full md:max-w-md md:bg-ink-card md:rounded-3xl md:shadow-[0_8px_48px_rgba(0,0,0,0.12)] md:overflow-hidden">
        {/* Header with image bg */}
        <div className="relative">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1779636447852-9febc139fb47?w=600&h=300&fit=crop&auto=format"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFFCF7]" />
          </div>
          <div className="relative z-10 px-5 pt-12 pb-8">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-ink-card border border-ink-border flex items-center justify-center text-sand text-lg mb-8"
            >
              ‹
            </button>
            {/* Panda logo small */}
            <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-2xl mb-5 shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
              🐼
            </div>
            <h1 className="font-display font-bold text-sand text-2xl leading-snug mb-2">
              Verify your<br />mobile number
            </h1>
            {phone !== "guest" && (
              <p className="text-muted text-sm">
                OTP sent to{" "}
                <span className="text-sand font-semibold">{masked}</span>
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 pt-2 flex flex-col pb-6">
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div>
              <label className="text-sand text-xs font-semibold mb-4 block">Enter 6-digit OTP</label>
              <OtpBoxes value={otp} onChange={(v) => { setOtp(v); setError("") }} />
              {error && (
                <p className="text-red-400 text-xs text-center mt-3">{error}</p>
              )}
            </div>

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-muted text-sm">
                  Resend OTP in{" "}
                  <span className="text-sand font-semibold tabular-nums">0:{String(countdown).padStart(2, "0")}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setCountdown(30)}
                  className="text-brand text-sm font-semibold"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand disabled:bg-brand/50 text-white font-display font-bold py-3.5 rounded-xl text-base active:opacity-90 transition-opacity"
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>

          {/* Security note */}
          <div className="flex items-center gap-2.5 bg-ink-card border border-ink-border rounded-2xl px-4 py-3 mt-5 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-muted text-xs leading-relaxed">
              Your number is only used for booking confirmation — never shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // "loading" = checking auth state on mount
  const [authStep, setAuthStep] = useState<"loading" | "login" | "otp" | "main">("loading")
  const [authPhone, setAuthPhone] = useState("")
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [tab, setTab] = useState("home")
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null)

  // Listen for Firebase auth state — auto-login on page refresh
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStep("main")
      } else {
        setAuthStep((prev) => prev === "loading" ? "login" : prev)
      }
    })
    return unsub
  }, [])

  const tabs = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "fleet", label: "Fleet", Icon: IconBike },
    { id: "routes", label: "Explore", Icon: IconMap },
    { id: "book", label: "Book", Icon: IconCalendar },
  ]

  function goTo(t: string) {
    setTab(t)
  }

  async function handleSignOut() {
    await signOut(auth)
    setAuthStep("login")
    setTab("home")
  }

  // Loading splash
  if (authStep === "loading") {
    return (
      <div className="size-full bg-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-3xl shadow-[0_8px_32px_rgba(249,115,22,0.4)] animate-pulse">
            🐼
          </div>
          <p className="text-muted text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="size-full bg-ink flex flex-col">
      {authStep === "login" && (
        <LoginScreen
          onOtpSent={(phone, conf) => {
            setAuthPhone(phone)
            setConfirmation(conf)
            setAuthStep("otp")
          }}
          onGuestLogin={() => setAuthStep("main")}
        />
      )}

      {authStep === "otp" && confirmation && (
        <OtpScreen
          phone={authPhone}
          confirmation={confirmation}
          onVerify={() => setAuthStep("main")}
          onBack={() => setAuthStep("login")}
        />
      )}

      {authStep === "main" && (
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden md:flex flex-col w-60 bg-ink-card border-r border-ink-border flex-shrink-0 py-6">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-xl shadow-[0_4px_16px_rgba(249,115,22,0.4)]">
                🐼
              </div>
              <div>
                <p className="font-display font-bold text-sand text-sm leading-none">PANDA BIKE</p>
                <p className="text-muted text-[10px] tracking-wider mt-0.5">RENTAL · DIGHA</p>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 px-3 flex-1">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-left w-full ${
                    tab === id
                      ? "bg-brand/10 border border-brand/20"
                      : "hover:bg-ink-raised border border-transparent"
                  }`}
                >
                  <Icon active={tab === id} />
                  <span className={`font-semibold text-sm ${tab === id ? "text-brand" : "text-muted"}`}>
                    {label}
                  </span>
                </button>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 mt-2 flex flex-col gap-2">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 text-brand hover:bg-brand/15 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 10.8 19.79 19.79 0 01.06 2.22 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
                <span className="font-semibold text-sm">Call Us</span>
              </a>
              {auth.currentUser && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 bg-ink-raised border border-ink-border rounded-xl px-4 py-3 text-muted hover:text-sand transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span className="font-semibold text-sm">Sign Out</span>
                </button>
              )}
            </div>
          </aside>

          {/* ── Screen content ── */}
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
            {tab === "home" && <HomeScreen setTab={goTo} />}
            {tab === "fleet" && <FleetScreen setTab={goTo} setSelectedBike={setSelectedBike} />}
            {tab === "routes" && <RoutesScreen />}
            {tab === "book" && <BookScreen selectedBike={selectedBike} />}
          </div>

          {/* ── Bottom nav — mobile only ── */}
          <nav className="md:hidden flex-shrink-0 bg-ink-card border-t border-ink-border flex items-center justify-around px-4 pt-2 pb-5">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className="flex flex-col items-center gap-1 min-w-[64px] py-1 transition-opacity"
              >
                <Icon active={tab === id} />
                <span className={`text-[10px] font-semibold tracking-wide ${tab === id ? "text-brand" : "text-muted"}`}>
                  {label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

