"use client";
import { useState, useRef, useEffect, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Package, Sparkles, Receipt, Check,
  Plus, Minus, Camera, ShieldCheck, Zap, ArrowLeft, ArrowRight, Loader2, Truck, X, Route, Pencil,
} from "lucide-react";
import { CityDropdown, SizeDropdown, DateSelector } from "@/components/RouteDropdowns";

// Major Indian city coordinates for distance calculation
const CITY_COORDS: Record<string, [number, number]> = {
  "Mumbai": [19.076, 72.877], "Delhi": [28.704, 77.102], "Bangalore": [12.972, 77.594],
  "Bengaluru": [12.972, 77.594], "Hyderabad": [17.385, 78.487], "Chennai": [13.083, 80.270],
  "Kolkata": [22.573, 88.364], "Pune": [18.520, 73.856], "Ahmedabad": [23.023, 72.572],
  "Jaipur": [26.912, 75.787], "Surat": [21.170, 72.831], "Lucknow": [26.847, 80.947],
  "Kanpur": [26.449, 80.331], "Nagpur": [21.146, 79.089], "Indore": [22.719, 75.857],
  "Bhopal": [23.259, 77.413], "Patna": [25.594, 85.137], "Vadodara": [22.308, 73.181],
  "Ghaziabad": [28.669, 77.454], "Noida": [28.535, 77.391], "Chandigarh": [30.733, 76.779],
  "Coimbatore": [11.017, 76.956], "Agra": [27.177, 78.008], "Kochi": [9.931, 76.267],
  "Visakhapatnam": [17.687, 83.218], "Nashik": [19.997, 73.789], "Faridabad": [28.408, 77.313],
  "Meerut": [28.980, 77.706], "Rajkot": [22.303, 70.802], "Varanasi": [25.317, 82.973],
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getCityKey(city: string): string {
  const normalized = city.trim();
  return Object.keys(CITY_COORDS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  ) || normalized;
}

const steps = [
  { n: 1, label: "Address", icon: MapPin },
  { n: 2, label: "Inventory", icon: Package },
  { n: 3, label: "Add-ons", icon: Sparkles },
  { n: 4, label: "Summary", icon: Receipt },
];

const defaultItems = [
  { name: "Double Bed", qty: 1 },
  { name: "Sofa (3 Seater)", qty: 1 },
  { name: "Dining Table", qty: 0 },
  { name: "Refrigerator", qty: 1 },
  { name: "Washing Machine", qty: 1 },
  { name: "TV", qty: 1 },
  { name: "Wardrobe", qty: 2 },
  { name: "Boxes", qty: 10 },
];

function BookingInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const pickupCity = sp.get("pickupCity") || "Ahmedabad";
  const dropCity = sp.get("dropCity") || "Mumbai";
  const houseSize = sp.get("houseSize") || "2 BHK";
  const movingDate = sp.get("movingDate") || "";

  const [step, setStep] = useState(1);
  const [items, setItems] = useState(defaultItems);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [photos, setPhotos] = useState<{ name: string; url: string; size: number }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefill contact fields if customer is logged in
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.customer) return;
        setContactName((v) => v || d.customer.name || "");
        setContactPhone((v) => v || d.customer.phone || "");
        setContactEmail((v) => v || d.customer.email || "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [addons, setAddons] = useState({ insurance: true, premium: false, express: false });
  const [packingServices, setPackingServices] = useState({
    labour: false,
    extraPacking: false,
    onlyMoving: false,
  });

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupFloor, setPickupFloor] = useState("2");
  const [pickupLift, setPickupLift] = useState("Yes");
  const [pickupPincode, setPickupPincode] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [dropFloor, setDropFloor] = useState("1");
  const [dropLift, setDropLift] = useState("Yes");
  const [dropPincode, setDropPincode] = useState("");
  const [locating, setLocating] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const c1 = CITY_COORDS[getCityKey(pickupCity)];
    const c2 = CITY_COORDS[getCityKey(dropCity)];
    if (c1 && c2) setDistance(haversineKm(c1[0], c1[1], c2[0], c2[1]));
  }, [pickupCity, dropCity]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const parts = [
            addr.house_number,
            addr.road || addr.pedestrian,
            addr.neighbourhood || addr.suburb,
            addr.city_district,
          ].filter(Boolean);
          if (parts.length) setPickupAddress(parts.join(", "));
          if (addr.postcode) setPickupPincode(addr.postcode.replace(/\s/g, "").slice(0, 6));
        } catch {
          // silently ignore — user can fill manually
        } finally {
          setLocating(false);
        }
      },
      () => { setLocating(false); },
      { timeout: 10000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [editingRoute, setEditingRoute] = useState(false);
  const [editFrom, setEditFrom] = useState(pickupCity);
  const [editTo, setEditTo] = useState(dropCity);
  const [editSize, setEditSize] = useState(houseSize);
  const [editDate, setEditDate] = useState(movingDate);

  function applyRouteEdit() {
    if (!editFrom.trim() || !editTo.trim()) return;
    const params = new URLSearchParams({
      pickupCity: editFrom,
      dropCity: editTo,
      houseSize: editSize,
      ...(editDate ? { movingDate: editDate } : {}),
    });
    router.push(`/booking?${params.toString()}`);
    setEditingRoute(false);
  }

  const updateQty = (i: number, d: number) => {
    setItems(items.map((it, idx) => (idx === i ? { ...it, qty: Math.max(0, it.qty + d) } : it)));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 10 - photos.length)
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f), size: f.size }));
    setPhotos((prev) => [...prev, ...next]);
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => {
      const target = prev[idx];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const addCustomItem = () => {
    const name = customName.trim();
    if (!name) return;
    if (items.some((it) => it.name.toLowerCase() === name.toLowerCase())) {
      setItems(items.map((it) => (it.name.toLowerCase() === name.toLowerCase() ? { ...it, qty: it.qty + 1 } : it)));
    } else {
      setItems([...items, { name, qty: 1 }]);
    }
    setCustomName("");
    setShowCustom(false);
  };

  const selectedItems = items.filter((i) => i.qty > 0);
  const selectedAddons = [
    addons.insurance && "Damage Insurance",
    addons.premium && "Premium Packing",
    addons.express && "Express Delivery",
  ].filter(Boolean) as string[];

  const selectedPackingServices = [
    packingServices.labour && "Need Labour",
    packingServices.extraPacking && "Need Extra Packing",
    packingServices.onlyMoving && "Only Moving",
  ].filter(Boolean) as string[];

  async function submitInquiry(e: FormEvent) {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      setError("Please enter your name and phone number");
      return;
    }
    setSubmitting(true);
    setError(null);

    const inventoryLine = selectedItems.length
      ? "Inventory: " + selectedItems.map((i) => `${i.name} (${i.qty})`).join(", ")
      : "";
    const addonLine = selectedAddons.length
      ? "Add-ons: " + selectedAddons.join(", ")
      : "";
    const pickupLine = pickupAddress
      ? `Pickup: ${pickupAddress} (Floor ${pickupFloor}, Lift ${pickupLift})`
      : "";
    const dropLine = dropAddress
      ? `Drop: ${dropAddress} (Floor ${dropFloor}, Lift ${dropLift})`
      : "";

    const photoLine = photos.length ? `Photos: ${photos.length} uploaded` : "";

    const notes = [pickupLine, dropLine, inventoryLine, addonLine, photoLine].filter(Boolean).join("\n");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          email: contactEmail || undefined,
          pickupCity,
          dropCity,
          houseSize,
          movingDate: movingDate || undefined,
          pickupAddress: pickupAddress || undefined,
          dropAddress: dropAddress || undefined,
          notes,
          needLabour: packingServices.labour,
          extraPacking: packingServices.extraPacking,
          onlyMoving: packingServices.onlyMoving,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setDone(true);
      setTimeout(() => router.push("/account"), 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-mint-500 text-white grid place-items-center mx-auto shadow-glow-mint mb-6">
          <Check size={40} />
        </div>
        <h1 className="display text-4xl font-bold text-midnight-900 mb-3">Inquiry received!</h1>
        <p className="text-midnight-500 text-lg mb-8">
          We'll reach out with quotes from verified vendors shortly.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Loader2 size={16} className="animate-spin text-saffron-500" />
          <span className="text-sm text-midnight-500">Taking you to your account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="sr-only">Book Packers and Movers — Get Free Quotes</h1>
      {/* STEPPER */}
      <div className="card p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const active = step === s.n;
            const complete = step > s.n;
            const Icon = s.icon;
            return (
              <div key={s.n} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full grid place-items-center font-bold text-sm transition
                    ${complete ? "bg-mint-500 text-white" : active ? "bg-saffron-500 text-white shadow-glow" : "bg-cream-100 text-midnight-500"}`}
                  >
                    {complete ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:block ${
                      active ? "text-saffron-600" : complete ? "text-mint-600" : "text-midnight-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${complete ? "bg-mint-500" : "bg-cream-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <form onSubmit={submitInquiry} className="card p-6 md:p-8">
          {/* STEP 1 — Address */}
          {step === 1 && (
            <div>
              <h2 className="display text-2xl font-bold text-midnight-900 mb-1">Address Details</h2>
              <p className="text-midnight-500 mb-6">Where are we picking up and dropping off?</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ── PICKUP ── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-midnight-900">📍 Pickup Address</h3>
                    {locating && (
                      <span className="flex items-center gap-1.5 text-xs text-midnight-400">
                        <Loader2 size={11} className="animate-spin" /> Detecting location…
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="label">Full Address</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder={`Eg. A-205, Sunrise Apartments, ${pickupCity}`}
                    />
                  </div>
                  <div>
                    <label className="label">Pincode</label>
                    <input
                      className="input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={pickupPincode}
                      onChange={(e) => setPickupPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Eg. 380001"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Floor</label>
                      <input
                        className="input"
                        type="number"
                        min={0}
                        value={pickupFloor}
                        onChange={(e) => setPickupFloor(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Lift</label>
                      <select className="input" value={pickupLift} onChange={(e) => setPickupLift(e.target.value)}>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── DROP ── */}
                <div className="space-y-4">
                  <h3 className="font-bold text-midnight-900">🎯 Drop Address</h3>
                  <div>
                    <label className="label">Full Address</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      placeholder={`Eg. Flat 1501, Sea View Heights, ${dropCity}`}
                    />
                  </div>
                  <div>
                    <label className="label">Pincode</label>
                    <input
                      className="input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={dropPincode}
                      onChange={(e) => setDropPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Eg. 400001"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Floor</label>
                      <input
                        className="input"
                        type="number"
                        min={0}
                        value={dropFloor}
                        onChange={(e) => setDropFloor(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Lift</label>
                      <select className="input" value={dropLift} onChange={(e) => setDropLift(e.target.value)}>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── DISTANCE BANNER ── */}
              {distance !== null && (
                <div className="mt-6 flex items-center gap-3 bg-midnight-900 text-white rounded-2xl px-5 py-4">
                  <Route size={20} className="text-saffron-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-white/60 font-medium uppercase tracking-wider">Estimated Route Distance</div>
                    <div className="text-xl font-bold">
                      {pickupCity} → {dropCity}
                      <span className="ml-3 text-saffron-400">{distance.toLocaleString()} km</span>
                    </div>
                  </div>
                  <div className="text-xs text-white/50 text-right leading-tight">
                    Road distance<br />may vary
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Inventory */}
          {step === 2 && (
            <div>
              <h2 className="display text-2xl font-bold text-midnight-900 mb-1">Inventory</h2>
              <p className="text-midnight-500 mb-6">
                Tell us what you're moving so we can plan the right truck.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {items.map((it, i) => (
                  <div
                    key={it.name}
                    className="flex items-center justify-between border border-midnight-100 rounded-xl px-4 py-3"
                  >
                    <span className="font-medium text-midnight-900">{it.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(i, -1)}
                        className="w-7 h-7 rounded-lg bg-cream-100 grid place-items-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-semibold">{it.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(i, 1)}
                        className="w-7 h-7 rounded-lg bg-saffron-500 text-white grid place-items-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3 flex-wrap items-center">
                {showCustom ? (
                  <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                    <input
                      autoFocus
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomItem();
                        } else if (e.key === "Escape") {
                          setShowCustom(false);
                          setCustomName("");
                        }
                      }}
                      placeholder="Eg. Study Table, Bookshelf..."
                      className="input !py-2 flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCustomItem}
                      disabled={!customName.trim()}
                      className="btn btn-primary text-sm disabled:opacity-50"
                    >
                      <Plus size={14} /> Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustom(false);
                        setCustomName("");
                      }}
                      className="btn btn-ghost text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCustom(true)}
                      className="btn btn-ghost text-sm"
                    >
                      <Plus size={14} /> Add Custom Item
                    </button>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="btn btn-ghost text-sm"
                    >
                      <Camera size={14} /> Upload Photos
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </>
                )}
              </div>

              {photos.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-midnight-500 mb-3">
                    {photos.length} photo{photos.length > 1 ? "s" : ""} added
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {photos.map((p, i) => (
                      <div
                        key={p.url}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-midnight-100 bg-cream-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-midnight-900/80 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition"
                          aria-label="Remove photo"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-midnight-500 mt-2">
                    Max 10 photos. Photos help vendors give more accurate quotes.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Add-ons */}
          {step === 3 && (
            <div>
              <h2 className="display text-2xl font-bold text-midnight-900 mb-1">Add-ons</h2>
              <p className="text-midnight-500 mb-6">Customize your move with optional extras.</p>

              {/* ── Packing Services ── */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-midnight-500 mb-3">
                  🚛 Packing Services
                </div>
                <div className="space-y-3">
                  {([
                    {
                      k: "labour" as const,
                      label: "Need Labour",
                      desc: "Loading & unloading helpers included",
                      emoji: "💪",
                    },
                    {
                      k: "extraPacking" as const,
                      label: "Need Extra Packing",
                      desc: "Double/bubble wrap for extra protection",
                      emoji: "📦",
                    },
                    {
                      k: "onlyMoving" as const,
                      label: "Only Moving",
                      desc: "No packing needed — just transport",
                      emoji: "🚚",
                    },
                  ] as const).map((p) => {
                    const active = packingServices[p.k];
                    return (
                      <label
                        key={p.k}
                        className={`flex items-center justify-between border-2 rounded-2xl p-5 cursor-pointer transition ${
                          active ? "border-saffron-500 bg-saffron-500/5" : "border-midnight-100"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-white border border-midnight-100 grid place-items-center text-xl">
                            {p.emoji}
                          </div>
                          <div>
                            <div className="font-bold text-midnight-900">{p.label}</div>
                            <div className="text-sm text-midnight-500">{p.desc}</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={(e) =>
                            setPackingServices({ ...packingServices, [p.k]: e.target.checked })
                          }
                          className="w-5 h-5 accent-saffron-500"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* ── Other Add-ons ── */}
              <div className="text-xs font-bold uppercase tracking-wider text-midnight-500 mb-3">
                ✨ Other Add-ons
              </div>
              <div className="space-y-3">
                {[
                  {
                    k: "insurance" as const,
                    label: "Damage Insurance",
                    desc: "Full coverage up to ₹5,00,000",
                    icon: <ShieldCheck className="text-mint-600" />,
                  },
                  {
                    k: "premium" as const,
                    label: "Premium Packing",
                    desc: "Bubble wrap, wooden crates for fragile items",
                    icon: <Sparkles className="text-saffron-600" />,
                  },
                  {
                    k: "express" as const,
                    label: "Express Delivery",
                    desc: "Next-day delivery guaranteed",
                    icon: <Zap className="text-amber-600" />,
                  },
                ].map((a) => {
                  const active = addons[a.k];
                  return (
                    <label
                      key={a.k}
                      className={`flex items-center justify-between border-2 rounded-2xl p-5 cursor-pointer transition ${
                        active ? "border-saffron-500 bg-saffron-500/5" : "border-midnight-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white border border-midnight-100 grid place-items-center">
                          {a.icon}
                        </div>
                        <div>
                          <div className="font-bold text-midnight-900">{a.label}</div>
                          <div className="text-sm text-midnight-500">{a.desc}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setAddons({ ...addons, [a.k]: e.target.checked })}
                        className="w-5 h-5 accent-saffron-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — Summary */}
          {step === 4 && (
            <div>
              <h2 className="display text-2xl font-bold text-midnight-900 mb-1">Review & Get Quote</h2>
              <p className="text-midnight-500 mb-6">
                Review your details. Our verified vendors will send you quotes shortly.
              </p>

              <div className="space-y-5">
                <SummaryBlock title="📍 Pickup">
                  <div className="font-semibold text-midnight-900">{pickupCity}</div>
                  {pickupAddress && <div className="text-sm text-midnight-500">{pickupAddress}</div>}
                  <div className="text-xs text-midnight-500 mt-1">
                    {pickupPincode && <span>PIN {pickupPincode} · </span>}
                    Floor {pickupFloor} · Lift {pickupLift}
                  </div>
                </SummaryBlock>

                <SummaryBlock title="🎯 Drop">
                  <div className="font-semibold text-midnight-900">{dropCity}</div>
                  {dropAddress && <div className="text-sm text-midnight-500">{dropAddress}</div>}
                  <div className="text-xs text-midnight-500 mt-1">
                    {dropPincode && <span>PIN {dropPincode} · </span>}
                    Floor {dropFloor} · Lift {dropLift}
                  </div>
                </SummaryBlock>

                {distance !== null && (
                  <div className="flex items-center gap-3 bg-midnight-50 border border-midnight-100 rounded-2xl px-4 py-3">
                    <Route size={16} className="text-saffron-500 shrink-0" />
                    <span className="text-sm text-midnight-700">Estimated distance: <strong>{distance.toLocaleString()} km</strong></span>
                  </div>
                )}

                <SummaryBlock title="🏠 Move details">
                  <div className="text-sm text-midnight-700">
                    <span className="font-semibold">{houseSize}</span>
                    {movingDate && (
                      <>
                        {" · "}
                        {new Date(movingDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </div>
                </SummaryBlock>

                {selectedItems.length > 0 && (
                  <SummaryBlock title="📦 Inventory">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItems.map((i) => (
                        <span
                          key={i.name}
                          className="chip !py-1 !px-2.5 !text-xs"
                        >
                          {i.name} × {i.qty}
                        </span>
                      ))}
                    </div>
                  </SummaryBlock>
                )}

                {selectedPackingServices.length > 0 && (
                  <SummaryBlock title="🚛 Packing Services">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPackingServices.map((p) => (
                        <span key={p} className="chip !py-1 !px-2.5 !text-xs">
                          {p}
                        </span>
                      ))}
                    </div>
                  </SummaryBlock>
                )}

                {selectedAddons.length > 0 && (
                  <SummaryBlock title="✨ Add-ons">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAddons.map((a) => (
                        <span key={a} className="chip !py-1 !px-2.5 !text-xs">
                          {a}
                        </span>
                      ))}
                    </div>
                  </SummaryBlock>
                )}
              </div>

              <div className="mt-6 border border-midnight-100 rounded-2xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-midnight-500 mb-3">
                  📞 Contact Details
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Your Name *</label>
                    <input
                      className="input"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Eg. Priya Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      className="input"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Email (optional)</label>
                    <input
                      className="input"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-mint-500/10 border border-mint-500/30 rounded-xl text-sm text-mint-700 flex items-center gap-3">
                <ShieldCheck size={18} />
                No upfront payment. Get quotes from verified vendors and pick the best one.
              </div>

              {/* CONFIRM PANEL — shown only after clicking "Get Quote" */}
              {confirming && (
                <div className="mt-5 border-2 border-saffron-400 bg-saffron-50 rounded-2xl p-5">
                  <div className="font-bold text-midnight-900 mb-1">Ready to submit your inquiry?</div>
                  <p className="text-sm text-midnight-600 mb-4">
                    Once submitted, our verified vendors will review your details and send you quotes within a few hours.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      className="btn btn-ghost text-sm"
                    >
                      ← Go Back & Edit
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary text-sm disabled:opacity-70"
                    >
                      {submitting ? (
                        <><Loader2 size={15} className="animate-spin"/> Submitting...</>
                      ) : (
                        <><Check size={15}/> Yes, Submit Inquiry</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 text-sm text-red-600 font-medium bg-red-50 border border-red-200 rounded-xl p-3">
                  ⚠ {error}
                </div>
              )}
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => { setStep(Math.max(1, step - 1)); setConfirming(false); }}
              disabled={step === 1}
              className="btn btn-ghost disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : !confirming ? (
              <button
                type="button"
                onClick={() => {
                  if (!contactName.trim() || !contactPhone.trim()) {
                    setError("Please enter your name and phone number");
                    return;
                  }
                  setError(null);
                  setConfirming(true);
                }}
                className="btn btn-primary"
              >
                <Truck size={16} /> Get Quote
              </button>
            ) : null}
          </div>
        </form>

        {/* SIDE SUMMARY */}
        <aside className="card p-6 h-fit lg:sticky lg:top-24">
          <div className="eyebrow mb-3">
            <span className="w-6 h-px bg-saffron-500"></span>
            Move Details
          </div>
          <h3 className="display text-lg font-bold text-midnight-900 mb-4">Your Inquiry</h3>
          <div className="space-y-3 text-sm">
            <Row label="From" value={pickupCity} />
            <Row label="To" value={dropCity} />
            <Row label="Size" value={houseSize} />
            {movingDate && (
              <Row
                label="Date"
                value={new Date(movingDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              />
            )}
            <Row label="Items" value={String(selectedItems.length)} />
            {selectedPackingServices.length > 0 && (
              <Row label="Packing" value={selectedPackingServices.join(", ")} />
            )}
            <Row label="Add-ons" value={String(selectedAddons.length)} />
            {distance !== null && (
              <Row label="Distance" value={`~${distance.toLocaleString()} km`} />
            )}
          </div>

          <div className="border-t border-midnight-100 my-4"></div>

          {/* ── INLINE ROUTE EDITOR ── */}
          {editingRoute ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-midnight-500">Edit Route</span>
                <button type="button" onClick={() => setEditingRoute(false)} className="text-midnight-400 hover:text-midnight-700">
                  <X size={14} />
                </button>
              </div>

              <CityDropdown
                label="From"
                accent="saffron"
                value={editFrom}
                onChange={setEditFrom}
                cities={Object.keys(CITY_COORDS)}
              />

              <CityDropdown
                label="To"
                accent="mint"
                value={editTo}
                onChange={setEditTo}
                cities={Object.keys(CITY_COORDS)}
              />

              <SizeDropdown value={editSize} onChange={setEditSize} />

              <DateSelector value={editDate} onChange={setEditDate} />

              <button
                type="button"
                onClick={applyRouteEdit}
                disabled={!editFrom.trim() || !editTo.trim()}
                className="btn btn-primary w-full text-sm disabled:opacity-50 mt-1"
              >
                <Check size={14} /> Apply Changes
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setEditFrom(pickupCity); setEditTo(dropCity); setEditSize(houseSize); setEditDate(movingDate); setEditingRoute(true); }}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-lg border border-saffron-400 text-saffron-600 text-sm font-semibold bg-saffron-50 hover:bg-saffron-100 hover:border-saffron-500 transition-colors"
              >
                <Pencil size={13} /> Change Route
              </button>

              <div className="bg-cream-100 rounded-xl p-3 mt-3 text-xs text-midnight-500 flex items-start gap-2">
                <ShieldCheck size={14} className="text-mint-500 mt-0.5 shrink-0" />
                <span>100% free. You'll get quotes from multiple verified vendors — no obligation.</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-midnight-100 rounded-2xl p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-midnight-500 mb-2">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-midnight-500">{label}</span>
      <strong className="text-midnight-900">{value}</strong>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] grid place-items-center">Loading...</div>}>
      <BookingInner />
    </Suspense>
  );
}
