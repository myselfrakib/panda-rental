import { useState, useMemo } from "react"

// ── Demo Types ────────────────────────────────────────────────────────────────

export type ConfirmationResult = {
  confirm: (otp: string) => Promise<void>
}

// ── Data ──────────────────────────────────────────────────────────────────────

const BIKES = [
  {
    id: 1,
    name: "Royal Enfield Classic 350",
    type: "Cruiser",
    price: 800,
    cc: 350,
    img: "https://images.unsplash.com/photo-1550149551-ee7bd0e3de7c?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=380&fit=crop&auto=format",
    available: true,
    badge: "",
    fuel: "48 kmpl",
  },
]

export type RouteItem = {
  id: number
  name: string
  tag: string
  category: "Beaches" | "Adventure" | "Nature" | "Culture & Food"
  distance: string
  distanceKm: number
  duration: string
  difficulty: "Easy" | "Moderate" | "Scenic"
  roadCondition: string
  bestTime: string
  fuelEst: string
  mapQuery: string
  img: string
  desc: string
  highlights: string[]
  insiderTip: string
  recommendedBikeId: number
  recommendedBikeName: string
}

const ROUTES: RouteItem[] = [
  {
    id: 1,
    name: "Udaipur Beach",
    tag: "Bengal-Odisha Border",
    category: "Beaches",
    distance: "3.5 km",
    distanceKm: 3.5,
    duration: "10 min",
    difficulty: "Easy",
    roadCondition: "Smooth coastal tarmac with sea breeze",
    bestTime: "5:30 AM – 8:00 AM (Sunrise) or 4:30 PM",
    fuelEst: "₹30 – ₹50",
    mapQuery: "Udaipur Beach, Digha, West Bengal Odisha Border",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=420&fit=crop&auto=format",
    desc: "A quiet virgin beach located right on the West Bengal – Odisha border, fringed with casuarina pine groves. Famous for fresh green coconuts, red sand crabs, and beachside fried fish shacks.",
    highlights: [
      "Scenic interstate border coastal ride",
      "Thousands of red ghost crabs at dawn",
      "Fresh tender coconut & fried fish shacks",
      "Jet ski, quad bike (ATV) & banana rides",
    ],
    insiderTip: "Ride early at 6 AM before tourist crowds arrive. The flat damp sand near the Odisha border post is the best spot for bike photoshoot reels.",
    recommendedBikeId: 5,
    recommendedBikeName: "Royal Enfield Hunter 350",
  },
  {
    id: 2,
    name: "Old Digha Sea Beach & Rock Dyke",
    tag: "Iconic Sea Wall & Food",
    category: "Culture & Food",
    distance: "2.5 km",
    distanceKm: 2.5,
    duration: "8 min",
    difficulty: "Easy",
    roadCondition: "Wide paved town promenade with street lights",
    bestTime: "5:00 PM – 9:00 PM (Evening buzz)",
    fuelEst: "₹25 – ₹40",
    mapQuery: "Old Digha Sea Beach, Digha, West Bengal",
    img: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=700&h=420&fit=crop&auto=format",
    desc: "The historic seafront of Digha protected by towering concrete boulders. Watch roaring waves crash with salty sea spray, then explore the sizzling fish fry stalls and cashew markets.",
    highlights: [
      "Crashing high-tide ocean waves on sea dyke boulders",
      "Famous fried fish market (Pomfret, Bhetki & Prawns)",
      "Nehru Market cashew nut & seashell bazaars",
      "Lively evening beach promenade atmosphere",
    ],
    insiderTip: "High tide creates breathtaking dramatic splashes over the sea wall boulders. Park near Biswa Bangla gate and enjoy piping hot fried pomfret by the shore.",
    recommendedBikeId: 3,
    recommendedBikeName: "Honda SP 125",
  },
  {
    id: 3,
    name: "Talsari Beach & Subarnarekha Estuary",
    tag: "River Meets the Bay (Odisha)",
    category: "Nature",
    distance: "9 km",
    distanceKm: 9,
    duration: "20 min",
    difficulty: "Scenic",
    roadCondition: "Picturesque country road shaded by coconut palms",
    bestTime: "6:30 AM – 10:30 AM (Soft morning light)",
    fuelEst: "₹70 – ₹110",
    mapQuery: "Talsari Beach, Balasore, Odisha",
    img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=700&h=420&fit=crop&auto=format",
    desc: "A calm, picturesque estuary where the sacred Subarnarekha River joins the Bay of Bengal in Odisha. Known for swaying palm trees, quiet backwaters, and traditional fishing boats.",
    highlights: [
      "Confluence where river meets the ocean",
      "Vast casuarina pine groves & palm tree trails",
      "Traditional wooden fishing boats resting on sand",
      "Quiet mudflats with thousands of red fiddler crabs",
    ],
    insiderTip: "During low tide, the river mouth becomes shallow enough to walk across to the serene sand island on the other side.",
    recommendedBikeId: 1,
    recommendedBikeName: "Royal Enfield Classic 350",
  },
  {
    id: 4,
    name: "Mandarmani Beach (Drive-on Coast)",
    tag: "Asia's Longest Beach Drive",
    category: "Adventure",
    distance: "32 km",
    distanceKm: 32,
    duration: "45 min",
    difficulty: "Moderate",
    roadCondition: "Smooth highway NH-116B + firm tidal sand at low tide",
    bestTime: "Low Tide hours only (Strictly check tide table)",
    fuelEst: "₹220 – ₹300",
    mapQuery: "Mandarmani Beach, West Bengal",
    img: "https://images.unsplash.com/photo-1578674735166-48bcaef9842b?w=700&h=420&fit=crop&auto=format",
    desc: "One of Asia's longest drivable beach strips! 13 km of hard-packed sand where you can cruise right beside the breaking waves. Filled with lively beach cafes and water sports.",
    highlights: [
      "Legal beach riding on firm low-tide sand",
      "Water sports: Parasailing, jet ski & ATV rides",
      "Lively beach shacks, seafood & music",
      "Unmatched panoramic ocean horizon",
    ],
    insiderTip: "Always confirm tide times with the Panda shop team before riding. Ride only on firm packed dark sand; avoid loose soft sand near dunes to prevent getting stuck.",
    recommendedBikeId: 1,
    recommendedBikeName: "Royal Enfield Classic 350",
  },
  {
    id: 5,
    name: "Tajpur Beach & Pine Groves",
    tag: "Virgin Golden Sands",
    category: "Beaches",
    distance: "20 km",
    distanceKm: 20,
    duration: "30 min",
    difficulty: "Easy",
    roadCondition: "Scenic road flanked by pisciculture bheries (prawn farms)",
    bestTime: "3:30 PM – 6:30 PM (Golden hour sunset)",
    fuelEst: "₹140 – ₹190",
    mapQuery: "Tajpur Beach, West Bengal",
    img: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=700&h=420&fit=crop&auto=format",
    desc: "A tranquil crescent beach secluded by thick casuarina pine forests. One of the cleanest beaches in Bengal, where thousands of red crabs make the shore blush red.",
    highlights: [
      "Pine forest coastal motorcycle trail",
      "Red fiddler crabs carpeting the beach",
      "Peaceful sunset reflection on wet sand",
      "Beach paragliding and solitary wooden cafes",
    ],
    insiderTip: "The winding dirt path through the casuarina trees provides the best aesthetic backdrop for motorcycle photoshoot reels.",
    recommendedBikeId: 2,
    recommendedBikeName: "TVS Apache RTR 160",
  },
  {
    id: 6,
    name: "Shankarpur Fishing Harbour",
    tag: "Deep Sea Port & Sunrise",
    category: "Culture & Food",
    distance: "15 km",
    distanceKm: 15,
    duration: "25 min",
    difficulty: "Easy",
    roadCondition: "Smooth coastal highway (NH-116B connector)",
    bestTime: "5:30 AM – 8:00 AM (Morning fish auction)",
    fuelEst: "₹110 – ₹160",
    mapQuery: "Shankarpur Fishing Harbour, West Bengal",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&h=420&fit=crop&auto=format",
    desc: "A major deep-sea fishing port on one side and a tranquil golden beach on the other. Witness hundreds of colorful trawlers unloading fresh deep-sea catch at dawn.",
    highlights: [
      "Exciting early morning wholesale fish auctions",
      "Hundreds of colorful deep-sea trawler boats",
      "Buy jumbo tiger prawns, hilsa & pomfret at harbor rates",
      "Tranquil tree-lined shoreline walking track",
    ],
    insiderTip: "Arrive before 7 AM to witness the harbor at its liveliest when the boats return from the deep Bay of Bengal.",
    recommendedBikeId: 5,
    recommendedBikeName: "Royal Enfield Hunter 350",
  },
  {
    id: 7,
    name: "Bichitrapur Mangrove Sanctuary",
    tag: "Eco Boat Safari (Odisha)",
    category: "Nature",
    distance: "16 km",
    distanceKm: 16,
    duration: "30 min",
    difficulty: "Moderate",
    roadCondition: "Rustic country roads through green fields and river crossings",
    bestTime: "7:00 AM – 11:30 AM (High tide for boat rides)",
    fuelEst: "₹120 – ₹170",
    mapQuery: "Bichitrapur Mangrove Eco Tourism, Odisha",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&h=420&fit=crop&auto=format",
    desc: "A protected ecological mangrove sanctuary on the Subarnarekha delta in Odisha. Take speedboats through winding mangrove creeks to a pristine offshore sand island.",
    highlights: [
      "Speedboat mangrove safari through creeks",
      "Sanctuary for rare living-fossil Horseshoe Crabs",
      "Coastal bird watching: Kingfishers, egrets & seagulls",
      "Offshore sand spit island in the open sea",
    ],
    insiderTip: "Speedboats operate strictly based on water levels during tidal hours. Carry cash for the eco-tourism forest entry ticket.",
    recommendedBikeId: 4,
    recommendedBikeName: "Bajaj Pulsar NS200",
  },
  {
    id: 8,
    name: "Chandaneswar Shiva Temple",
    tag: "Historic Pilgrimage (Odisha)",
    category: "Culture & Food",
    distance: "8 km",
    distanceKm: 8,
    duration: "15 min",
    difficulty: "Easy",
    roadCondition: "Clean interstate highway connecting Bengal to Odisha",
    bestTime: "Morning 7:00 AM – 11:00 AM or Evening 5:00 PM",
    fuelEst: "₹50 – ₹80",
    mapQuery: "Chandaneswar Temple, Balasore, Odisha",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=700&h=420&fit=crop&auto=format",
    desc: "A historic 16th-century Lord Shiva temple venerated by pilgrims across Bengal and Odisha. Lined with bustling shops selling local sweets, brass temple bells, and handicrafts.",
    highlights: [
      "Classic Kalinga temple architecture",
      "Spiritual interstate border pilgrimage ride",
      "Freshly baked hot Chhena Poda & Khaja sweets",
      "Bustling cultural bazaar and souvenir shops",
    ],
    insiderTip: "Don't leave without tasting the authentic hot Chhena Poda (sweet roasted cottage cheese cake) from the old sweet shops outside the temple gate.",
    recommendedBikeId: 6,
    recommendedBikeName: "Yamaha FZ-S V3",
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

function HomeScreen({
  setTab,
  setSelectedBike,
}: {
  setTab: SetTab
  setSelectedBike?: SetBike
}) {
  const [category, setCategory] = useState("All")

  const todayStr = useMemo(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  }, [])

  const [pickupDate, setPickupDate] = useState(todayStr)
  const [pickupTime, setPickupTime] = useState("09:00 AM")
  const [durationDays, setDurationDays] = useState(1)

  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
    "08:00 PM",
  ]

  const categories = [
    { id: "All", label: "All Categories (6 Models)" },
    { id: "Cruiser", label: "Cruiser (Royal Enfield)" },
    { id: "Sports", label: "Sports (Apache, Pulsar)" },
    { id: "Commuter", label: "Commuter (Honda SP)" },
    { id: "Street", label: "Street (Yamaha FZ)" },
  ]

  const filteredBikes = useMemo(() => {
    return BIKES.filter((b) => {
      if (category !== "All" && b.type !== category) return false
      return true
    })
  }, [category])

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const el = document.getElementById("search-results-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative h-[300px] md:h-[500px] bg-ink-raised flex-shrink-0">
        <img
          src="/hero-banner.png"
          alt="Panda Bike Rental Store and Banner in Digha"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1600&h=900&fit=crop&auto=format"
          }}
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

      {/* ── Search Widget (WaveRide Style) ── */}
      <div className="px-5 md:px-10 py-6 md:py-8">
        <div className="bg-ink-card border border-ink-border rounded-3xl p-5 md:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/20 via-brand to-brand/20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-brand/15 text-brand text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Instant Rental Search
                </span>
                <span className="text-muted text-xs">Self-Drive Bikes · Digha</span>
              </div>
              <h2 className="font-display font-bold text-sand text-lg md:text-2xl">
                Find Your Ride
              </h2>
            </div>
            <p className="text-muted text-xs md:text-sm">
              Free helmets · Zero security deposit · Pay at pickup
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Vehicle Category */}
              <div>
                <label className="text-sand text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                  <span>🏍️</span>
                  <span>Select Vehicle Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-ink-raised border border-ink-border text-sand rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors h-[46px]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Pickup Date */}
              <div>
                <label className="text-sand text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                  <span>📅</span>
                  <span>Pickup Date</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  min={todayStr}
                  onChange={(e) => setPickupDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-ink-raised border border-ink-border text-sand rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors h-[46px]"
                />
              </div>

              {/* 3. Pickup Time */}
              <div>
                <label className="text-sand text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                  <span>⏰</span>
                  <span>Pickup Time</span>
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-ink-raised border border-ink-border text-sand rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors h-[46px]"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Duration (Days) with Plus / Minus Button */}
              <div>
                <label className="text-sand text-xs font-semibold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>⏳</span>
                    <span>Rental Duration</span>
                  </span>
                  <span className="text-brand text-[11px] font-bold">
                    {durationDays} {durationDays === 1 ? "day" : "days"}
                  </span>
                </label>
                <div className="flex items-center justify-between bg-ink-raised border border-ink-border rounded-xl px-2 h-[46px]">
                  <button
                    type="button"
                    onClick={() => setDurationDays((d) => Math.max(1, d - 1))}
                    disabled={durationDays <= 1}
                    className="w-9 h-9 rounded-lg bg-ink-card hover:bg-brand/20 active:scale-95 text-sand font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all border border-ink-border"
                    title="Decrease duration"
                  >
                    −
                  </button>
                  <span className="font-display font-bold text-sand text-sm tabular-nums px-2">
                    {durationDays} {durationDays === 1 ? "Day" : "Days"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDurationDays((d) => Math.min(30, d + 1))}
                    disabled={durationDays >= 30}
                    className="w-9 h-9 rounded-lg bg-ink-card hover:bg-brand/20 active:scale-95 text-sand font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all border border-ink-border"
                    title="Increase duration"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Search Submit Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-muted text-xs flex flex-wrap items-center gap-2">
                <span>✓ Pay at Pickup</span>
                <span>•</span>
                <span>✓ Unlimited Kilometers</span>
                <span>•</span>
                <span>✓ Verified Inspected Bikes</span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto min-w-[220px] bg-brand text-white font-display font-bold py-3 px-8 rounded-xl text-sm shadow-[0_4px_16px_rgba(249,115,22,0.35)] hover:bg-brand/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                <span>Search Available Bikes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Search Results ── */}
      <div id="search-results-section" className="px-5 md:px-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display font-bold text-sand text-lg md:text-2xl flex items-center gap-2">
              <span>Matching Available Bikes</span>
              <span className="text-brand text-xs font-semibold bg-brand/15 px-2.5 py-0.5 rounded-full">
                {filteredBikes.length} Models
              </span>
            </h2>
            <p className="text-muted text-xs mt-0.5">
              Rates calculated for <span className="text-sand font-semibold">{durationDays} {durationDays === 1 ? "day" : "days"}</span> starting <span className="text-sand font-semibold">{pickupDate}</span> at <span className="text-sand font-semibold">{pickupTime}</span>
            </p>
          </div>
          <button
            onClick={() => setTab("fleet")}
            className="text-brand hover:underline text-xs font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>See entire fleet</span>
            <span>→</span>
          </button>
        </div>

        {/* Bike Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBikes.map((bike) => {
            const totalPrice = bike.price * durationDays

            return (
              <div
                key={bike.id}
                className="bg-ink-card border border-ink-border hover:border-brand/40 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col"
              >
                <div className="relative h-44 bg-ink-raised overflow-hidden">
                  <img
                    src={bike.img}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=380&fit=crop&auto=format"
                    }}
                  />
                  {bike.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-brand text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {bike.badge}
                    </span>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <span className="text-white text-xs font-medium">{bike.cc}cc</span>
                  </div>
                  {!bike.available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Currently Booked
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-sand font-semibold text-base leading-snug">{bike.name}</h3>
                        <span className="text-brand text-xs font-medium">{bike.type}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-muted text-[10px] block leading-tight">Total for {durationDays} {durationDays === 1 ? "day" : "days"}</span>
                        <span className="text-brand font-display font-bold text-lg">
                          ₹{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted text-xs mt-2 mb-3 bg-ink-raised px-3 py-2 rounded-xl">
                      <span>⛽ {bike.fuel}</span>
                      <span>•</span>
                      <span>👥 2 Seats</span>
                      <span>•</span>
                      <span className="text-sand font-medium">₹{bike.price}/day</span>
                    </div>
                  </div>

                  <button
                    disabled={!bike.available}
                    onClick={() => {
                      setSelectedBike?.(bike)
                      setTab("book")
                    }}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      bike.available
                        ? "bg-brand text-white hover:bg-brand/90 active:scale-[0.98] shadow-sm"
                        : "bg-ink-raised text-muted cursor-not-allowed"
                    }`}
                  >
                    {bike.available ? `Book for ₹${totalPrice.toLocaleString()}` : "Not Available"}
                  </button>
                </div>
              </div>
            )
          })}
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
            src="https://images.unsplash.com/photo-1578674735166-48bcaef9842b?w=900&h=400&fit=crop&auto=format"
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

function getMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function getMapsDirectionsUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&origin=Panda+Bike+Rental,+New+Digha,+West+Bengal&destination=${encodeURIComponent(destination)}`
}

function RoutesScreen({
  setTab,
  setSelectedBike,
}: {
  setTab?: SetTab
  setSelectedBike?: SetBike
}) {
  const [detail, setDetail] = useState<RouteItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [distanceFilter, setDistanceFilter] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const categories = ["All", "Beaches", "Adventure", "Nature", "Culture & Food"]
  const distanceOptions = ["All", "< 10 km", "10–25 km", "25+ km"]

  const filteredRoutes = useMemo(() => {
    return ROUTES.filter((r) => {
      // Category filter
      if (activeCategory !== "All" && r.category !== activeCategory) {
        return false
      }
      // Distance filter
      if (distanceFilter === "< 10 km" && r.distanceKm >= 10) return false
      if (distanceFilter === "10–25 km" && (r.distanceKm < 10 || r.distanceKm > 25)) return false
      if (distanceFilter === "25+ km" && r.distanceKm <= 25) return false

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = r.name.toLowerCase().includes(q)
        const matchTag = r.tag.toLowerCase().includes(q)
        const matchDesc = r.desc.toLowerCase().includes(q)
        const matchHighlights = r.highlights.some((h) => h.toLowerCase().includes(q))
        if (!matchName && !matchTag && !matchDesc && !matchHighlights) return false
      }

      return true
    })
  }, [activeCategory, distanceFilter, searchQuery])

  // If viewing details of a specific route:
  if (detail) {
    const recommendedBike = BIKES.find((b) => b.id === detail.recommendedBikeId) ?? BIKES[0]

    return (
      <div className="flex flex-col pb-12">
        {/* Detail Hero Image */}
        <div className="relative h-64 md:h-96 bg-ink-raised flex-shrink-0">
          <img
            src={detail.img}
            alt={detail.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=450&fit=crop&auto=format"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top navigation row */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => setDetail(null)}
              className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold border border-white/20 transition-colors"
            >
              <span>‹</span>
              <span>All Routes</span>
            </button>
            <a
              href={getMapsSearchUrl(detail.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand text-white hover:bg-brand/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <span>📍</span>
              <span>Open in Maps</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Hero text */}
          <div className="absolute bottom-4 left-4 right-4 md:left-10 md:right-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-brand text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {detail.category}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {detail.tag}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  detail.difficulty === "Easy"
                    ? "bg-green-500/20 text-green-300 border border-green-500/40"
                    : detail.difficulty === "Scenic"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {detail.difficulty} Ride
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-2xl md:text-4xl leading-tight">
              {detail.name}
            </h1>
            <p className="text-white/70 text-xs md:text-sm mt-1">
              📍 {detail.distance} from Panda Hub &nbsp;·&nbsp; ⏱ ~{detail.duration} ride &nbsp;·&nbsp; ⛽ {detail.fuelEst}
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="px-5 md:px-10 pt-5 md:pt-8 md:max-w-4xl">
          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-6">
            <a
              href={getMapsSearchUrl(detail.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <span>📍</span>
              <span>Open in Google Maps</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            <a
              href={getMapsDirectionsUrl(detail.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-ink-card border border-brand/40 text-brand font-semibold text-sm py-3 px-4 rounded-xl hover:bg-brand/10 active:scale-[0.98] transition-all"
            >
              <span>🧭</span>
              <span>Directions from Hub</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </a>

            {setTab && setSelectedBike && (
              <button
                onClick={() => {
                  setSelectedBike(recommendedBike)
                  setTab("book")
                }}
                className="flex items-center justify-center gap-2 bg-ink-raised border border-ink-border text-sand font-semibold text-sm py-3 px-4 rounded-xl hover:border-brand transition-colors active:scale-[0.98]"
              >
                <span>🏍️</span>
                <span>Rent {recommendedBike.name.split(" ")[0]} Bike</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div className="bg-ink-card border border-ink-border rounded-2xl p-4 md:p-6 mb-5">
            <h2 className="text-sand font-semibold text-base mb-2">About this Destination</h2>
            <p className="text-muted text-sm leading-relaxed">{detail.desc}</p>
          </div>

          {/* Key Trip Parameters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-ink-card border border-ink-border rounded-xl p-3.5">
              <span className="text-xs text-muted block mb-1">📏 Distance</span>
              <span className="font-display font-bold text-sand text-base">{detail.distance}</span>
              <span className="text-[10px] text-muted block mt-0.5">from New Digha</span>
            </div>

            <div className="bg-ink-card border border-ink-border rounded-xl p-3.5">
              <span className="text-xs text-muted block mb-1">⏱ Riding Time</span>
              <span className="font-display font-bold text-sand text-base">{detail.duration}</span>
              <span className="text-[10px] text-muted block mt-0.5">one way avg</span>
            </div>

            <div className="bg-ink-card border border-ink-border rounded-xl p-3.5">
              <span className="text-xs text-muted block mb-1">⏰ Best Timing</span>
              <span className="font-display font-semibold text-brand text-xs block leading-tight">
                {detail.bestTime.split("(")[0]}
              </span>
              <span className="text-[10px] text-muted block mt-0.5">Prime lighting</span>
            </div>

            <div className="bg-ink-card border border-ink-border rounded-xl p-3.5">
              <span className="text-xs text-muted block mb-1">⛽ Est. Petrol</span>
              <span className="font-display font-bold text-sand text-base">{detail.fuelEst}</span>
              <span className="text-[10px] text-muted block mt-0.5">round trip</span>
            </div>
          </div>

          {/* Road Condition & Surface */}
          <div className="bg-ink-raised border border-ink-border rounded-xl p-4 mb-5 flex items-start gap-3">
            <span className="text-xl">🛣️</span>
            <div>
              <p className="text-sand font-semibold text-xs mb-0.5">Road Surface & Route Terrain</p>
              <p className="text-muted text-xs leading-relaxed">{detail.roadCondition}</p>
            </div>
          </div>

          {/* Highlights checklist */}
          <div className="mb-6">
            <h3 className="font-display font-bold text-sand text-base mb-3">Trip Highlights & Sights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {detail.highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 bg-ink-card border border-ink-border rounded-xl px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-brand/15 text-brand flex items-center justify-center text-xs flex-shrink-0 font-bold">
                    ✓
                  </span>
                  <span className="text-sand text-xs md:text-sm font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insider Panda Tip */}
          <div className="bg-brand/10 border border-brand/30 rounded-2xl p-4 md:p-5 mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">💡</span>
              <p className="text-brand font-bold text-xs uppercase tracking-wider">Panda Rider's Insider Tip</p>
            </div>
            <p className="text-sand/90 text-xs md:text-sm leading-relaxed">{detail.insiderTip}</p>
          </div>

          {/* GPS Waypoint Card */}
          <div className="bg-ink-card border border-ink-border rounded-2xl p-4 md:p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🗺️</span>
                <h3 className="text-sand font-semibold text-sm">GPS Waypoints</h3>
              </div>
              <a
                href={getMapsSearchUrl(detail.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline text-xs font-semibold flex items-center gap-1"
              >
                <span>View Live Pin</span>
                <span>↗</span>
              </a>
            </div>

            <div className="relative pl-6 pb-2 border-l-2 border-brand/30 ml-2 space-y-4">
              <div className="relative">
                <span className="absolute -left-[31px] -top-0.5 w-4 h-4 rounded-full bg-brand flex items-center justify-center text-[9px] text-white font-bold">
                  ●
                </span>
                <p className="text-sand text-xs font-bold">Start: Panda Bike Rental Hub</p>
                <p className="text-muted text-[11px]">New Digha Town, West Bengal (Helmets & papers handed over)</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] -top-0.5 w-4 h-4 rounded-full bg-ink-border border-2 border-brand flex items-center justify-center text-[9px]"></span>
                <p className="text-sand text-xs font-bold">Trail: {detail.roadCondition}</p>
                <p className="text-muted text-[11px]">{detail.distance} · approx. {detail.duration}</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] -top-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px] text-white font-bold">
                  ★
                </span>
                <p className="text-green-400 text-xs font-bold">Destination: {detail.name}</p>
                <p className="text-muted text-[11px]">{detail.mapQuery}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ink-border flex gap-3">
              <a
                href={getMapsDirectionsUrl(detail.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-ink-raised hover:bg-brand/10 border border-ink-border hover:border-brand/40 text-sand hover:text-brand text-xs font-semibold py-2.5 rounded-xl text-center transition-colors"
              >
                🧭 Launch Google Maps Navigation
              </a>
            </div>
          </div>

          {/* Recommended Fleet Bike */}
          <div className="bg-ink-card border border-brand/30 rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-brand text-xs font-bold uppercase tracking-wider">Recommended Bike for this Route</p>
              <span className="text-xs text-muted">Ideal power & suspension</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-18 rounded-xl overflow-hidden bg-ink-raised flex-shrink-0">
                <img src={recommendedBike.img} alt={recommendedBike.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sand font-semibold text-sm truncate">{recommendedBike.name}</h4>
                <p className="text-brand font-bold text-sm mt-0.5">
                  ₹{recommendedBike.price}
                  <span className="text-muted font-normal text-xs">/day</span>
                  <span className="text-muted text-xs ml-2">· {recommendedBike.fuel}</span>
                </p>
                {setTab && setSelectedBike && (
                  <button
                    onClick={() => {
                      setSelectedBike(recommendedBike)
                      setTab("book")
                    }}
                    className="mt-2 text-xs bg-brand text-white font-semibold px-4 py-1.5 rounded-lg active:opacity-90"
                  >
                    Book This Bike
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Explore Page View:
  return (
    <div className="flex flex-col pb-12">
      {/* Page Header */}
      <div className="px-5 md:px-10 pt-5 md:pt-8 pb-3">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand/15 text-brand text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Rider's Guide · Digha
              </span>
              <span className="text-muted text-xs">8 Iconic Destinations</span>
            </div>
            <h1 className="font-display font-bold text-sand text-2xl md:text-4xl">Explore Nearby Digha</h1>
            <p className="text-muted text-xs md:text-sm mt-1">
              Curated motorcycle routes, beach trails, estuaries & Odisha border rides with direct Google Maps GPS
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 md:px-10 mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination, beach, red crabs, sand ride, temple..."
            className="w-full bg-ink-card border border-ink-border text-sand rounded-xl pl-10 pr-10 py-3 text-xs md:text-sm placeholder:text-muted/50 focus:outline-none focus:border-brand"
          />
          <span className="absolute left-3.5 top-3.5 text-muted text-sm">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3 text-muted hover:text-sand text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 md:px-10 pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === c
                ? "bg-brand text-white border-brand shadow-[0_2px_8px_rgba(249,115,22,0.35)]"
                : "bg-ink-card text-muted border-ink-border hover:border-muted/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Distance Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-5 md:px-10 pb-4 pt-1 text-xs">
        <span className="text-muted text-[11px] flex-shrink-0">Radius:</span>
        {distanceOptions.map((d) => (
          <button
            key={d}
            onClick={() => setDistanceFilter(d)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
              distanceFilter === d
                ? "bg-ink-raised text-sand border-brand/50"
                : "bg-transparent text-muted border-ink-border hover:border-ink-border/80"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Featured Route Banner: Mandarmani Beach */}
      {activeCategory === "All" && !searchQuery && distanceFilter === "All" && (
        <div className="px-5 md:px-10 mb-6">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-ink-card border border-brand/30 shadow-lg">
            <div className="relative h-56 md:h-72">
              <img
                src={ROUTES[3].img}
                alt={ROUTES[3].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-brand text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  🔥 Rider's Choice Featured Route
                </span>
                <span className="bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {ROUTES[3].tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6">
                <h3 className="font-display font-bold text-white text-xl md:text-3xl">
                  {ROUTES[3].name}
                </h3>
                <p className="text-white/80 text-xs md:text-sm line-clamp-1 mt-1">
                  {ROUTES[3].desc}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-white/90 text-xs mt-2.5">
                  <span>📍 {ROUTES[3].distance}</span>
                  <span>⏱ {ROUTES[3].duration}</span>
                  <span>⛽ {ROUTES[3].fuelEst}</span>
                  <span className="bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    {ROUTES[3].difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="p-3.5 md:p-4 bg-ink-card flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <a
                  href={getMapsSearchUrl(ROUTES[3].mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand text-white hover:bg-brand/90 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>📍</span>
                  <span>Open in Maps</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>

                <a
                  href={getMapsDirectionsUrl(ROUTES[3].mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-ink-raised border border-ink-border hover:border-brand/40 text-sand hover:text-brand px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>🧭</span>
                  <span>Directions</span>
                </a>
              </div>

              <button
                onClick={() => setDetail(ROUTES[3])}
                className="text-brand text-xs font-semibold hover:underline flex items-center gap-1 ml-auto"
              >
                <span>View Route Guide & Tips</span>
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes Grid Header */}
      <div className="px-5 md:px-10 mb-3 flex items-center justify-between">
        <h2 className="font-display font-bold text-sand text-lg md:text-xl">
          {activeCategory === "All" ? "All Locations" : activeCategory}
          <span className="text-muted font-normal text-xs ml-2">({filteredRoutes.length} found)</span>
        </h2>
      </div>

      {/* Empty State */}
      {filteredRoutes.length === 0 && (
        <div className="px-5 md:px-10 py-12 text-center bg-ink-card border border-ink-border rounded-2xl mx-5 md:mx-10">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sand font-semibold text-sm">No destinations found matching "{searchQuery}"</p>
          <p className="text-muted text-xs mt-1">Try searching for "beach", "crab", "temple", or clear filters.</p>
          <button
            onClick={() => {
              setSearchQuery("")
              setActiveCategory("All")
              setDistanceFilter("All")
            }}
            className="mt-4 bg-brand text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Route Cards Grid */}
      <div className="px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-ink-card border border-ink-border hover:border-brand/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group"
          >
            {/* Card Thumbnail */}
            <div
              className="relative h-44 bg-ink-raised overflow-hidden cursor-pointer"
              onClick={() => setDetail(route)}
            >
              <img
                src={route.img}
                alt={route.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=420&fit=crop&auto=format"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Badges on top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-brand text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  {route.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                    route.difficulty === "Easy"
                      ? "bg-green-500/30 text-green-300 border border-green-500/40"
                      : route.difficulty === "Scenic"
                      ? "bg-blue-500/30 text-blue-300 border border-blue-500/40"
                      : "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {route.difficulty}
                </span>
              </div>

              {/* Distance pill on bottom right */}
              <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                <span className="text-white text-xs font-semibold">📍 {route.distance}</span>
              </div>

              <div className="absolute bottom-2.5 left-3">
                <span className="text-white/80 text-[10px] font-medium bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                  ⏱ ~{route.duration}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3
                    onClick={() => setDetail(route)}
                    className="font-display font-bold text-sand text-base leading-snug group-hover:text-brand transition-colors cursor-pointer"
                  >
                    {route.name}
                  </h3>
                  <p className="text-brand text-xs font-medium">{route.tag}</p>
                </div>
              </div>

              <p className="text-muted text-xs leading-relaxed line-clamp-2 mb-3">
                {route.desc}
              </p>

              {/* Highlights pills */}
              <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                {route.highlights.slice(0, 2).map((h) => (
                  <span
                    key={h}
                    className="text-[10px] text-muted/90 bg-ink-raised border border-ink-border px-2 py-0.5 rounded-md truncate max-w-[200px]"
                  >
                    • {h}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-ink-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Open in Google Maps Link */}
                  <a
                    href={getMapsSearchUrl(route.mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${route.name} on Google Maps`}
                    className="bg-brand/15 hover:bg-brand text-brand hover:text-white border border-brand/30 hover:border-transparent px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span>📍</span>
                    <span>Maps</span>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>

                  {/* Directions Link */}
                  <a
                    href={getMapsDirectionsUrl(route.mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Get Directions from Panda Hub"
                    className="bg-ink-raised hover:bg-ink-border text-muted hover:text-sand px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>🧭</span>
                    <span className="hidden sm:inline">Nav</span>
                  </a>
                </div>

                <button
                  onClick={() => setDetail(route)}
                  className="text-brand hover:underline text-xs font-semibold flex items-center gap-1"
                >
                  <span>Details</span>
                  <span>›</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Local Rider's Handbook for Digha Coast */}
      <div className="mx-5 md:mx-10 bg-ink-card border border-ink-border rounded-2xl p-5 md:p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏍️</span>
          <div>
            <h3 className="font-display font-bold text-sand text-base md:text-lg">
              Digha Coastal Rider's Safety & Handbook
            </h3>
            <p className="text-muted text-xs">Essential local knowledge before starting your ride</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          <div className="bg-ink-raised border border-ink-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-brand font-bold text-xs">
              <span>🌊</span>
              <span>Tides & Beach Riding</span>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              Never take your motorcycle into wet sea water or loose tidal mud. When visiting Mandarmani or Udaipur, ride only during low tide hours on firm packed sand.
            </p>
          </div>

          <div className="bg-ink-raised border border-ink-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-brand font-bold text-xs">
              <span>🛂</span>
              <span>Odisha Border Guidelines</span>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              Riding to Talsari, Bichitrapur or Chandaneswar crosses into Odisha state. Helmets are mandatory for both rider and pillion. All Panda bikes come with full legal papers.
            </p>
          </div>

          <div className="bg-ink-raised border border-ink-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-brand font-bold text-xs">
              <span>🛠️</span>
              <span>24/7 Breakdown Assistance</span>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              If you experience a flat tire or mechanical issue along your route, call our on-road assistance at{" "}
              <a href="tel:+919876543210" className="text-brand font-semibold underline">
                +91 98765 43210
              </a>
              .
            </p>
          </div>
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
          src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&h=1000&fit=crop&auto=format"
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
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&auto=format"
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
  const [authStep, setAuthStep] = useState<"loading" | "login" | "otp" | "main">("main")
  const [authPhone, setAuthPhone] = useState("")
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [tab, setTab] = useState("home")
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null)

  const tabs = [
    { id: "home", label: "Home", Icon: IconHome },
    { id: "fleet", label: "Fleet", Icon: IconBike },
    { id: "routes", label: "Explore", Icon: IconMap },
    { id: "book", label: "Book", Icon: IconCalendar },
  ]

  function goTo(t: string) {
    setTab(t)
  }

  function handleSignOut() {
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
            </div>
          </aside>

          {/* ── Screen content ── */}
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
            {tab === "home" && <HomeScreen setTab={goTo} setSelectedBike={setSelectedBike} />}
            {tab === "fleet" && <FleetScreen setTab={goTo} setSelectedBike={setSelectedBike} />}
            {tab === "routes" && <RoutesScreen setTab={goTo} setSelectedBike={setSelectedBike} />}
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

