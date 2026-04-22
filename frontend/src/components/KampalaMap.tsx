"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative; width:24px; height:24px;">
      <div style="position:absolute; inset:-6px; border-radius:9999px; background:var(--accent); opacity:0.4; animation: pulse-ring 2s ease-out infinite;"></div>
      <div style="position:absolute; inset:0; border-radius:9999px; background:var(--accent); border:3px solid var(--surface); box-shadow:0 4px 16px rgba(0,0,0,0.3);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const KAMPALA_CENTER: [number, number] = [0.3476, 32.5825];

const KAMPALA_LOCATIONS = [
  { name: "Ndeeba", lat: 0.3205, lng: 32.5689 },
  { name: "Kisenyi", lat: 0.3217, lng: 32.5859 },
  { name: "Kasubi", lat: 0.3312, lng: 32.5612 },
  { name: "Makerere", lat: 0.3318, lng: 32.5655 },
  { name: "Kamwokya", lat: 0.3392, lng: 32.5678 },
  { name: "Kawempe", lat: 0.3561, lng: 32.5366 },
  { name: "Bukoto", lat: 0.3489, lng: 32.5912 },
  { name: "Ntinda", lat: 0.3472, lng: 32.6045 },
  { name: "Kireka", lat: 0.3612, lng: 32.6134 },
  { name: "Naalya", lat: 0.3512, lng: 32.6112 },
  { name: "Kyaliwajjala", lat: 0.3589, lng: 32.5945 },
  { name: "Kulambiro", lat: 0.3556, lng: 32.6223 },
  { name: "Kigoowa", lat: 0.3523, lng: 32.6178 },
  { name: "Muyenga", lat: 0.3267, lng: 32.6089 },
  { name: "Tank Hill", lat: 0.3323, lng: 32.6134 },
  { name: "Munyonyo", lat: 0.3089, lng: 32.6178 },
  { name: "Gaba", lat: 0.3145, lng: 32.6256 },
  { name: "Kizungu", lat: 0.3189, lng: 32.6212 },
  { name: "Seguku", lat: 0.3112, lng: 32.6345 },
  { name: "Lweza", lat: 0.2989, lng: 32.6289 },
  { name: "Kigo", lat: 0.3401, lng: 32.6012 },
  { name: "Naguru", lat: 0.3434, lng: 32.5978 },
  { name: "Kololo", lat: 0.3389, lng: 32.5812 },
  { name: "Nakasero", lat: 0.3234, lng: 32.5789 },
  { name: "Downtown", lat: 0.3134, lng: 32.5801 },
  { name: "Industrial Area", lat: 0.3078, lng: 32.5756 },
  { name: "Mulwana", lat: 0.3056, lng: 32.5723 },
  { name: "Bugweri", lat: 0.3034, lng: 32.5689 },
  { name: "Namirembe", lat: 0.3267, lng: 32.5734 },
  { name: "Kibuli", lat: 0.3289, lng: 32.5695 },
  { name: "Namiso", lat: 0.3256, lng: 32.5678 },
  { name: "Bweyogerere", lat: 0.3712, lng: 32.6389 },
  { name: "Kiwatule", lat: 0.3634, lng: 32.5978 },
  { name: "Renee", lat: 0.3678, lng: 32.6023 },
  { name: "Kungu", lat: 0.3578, lng: 32.5867 },
  { name: "Kanyanya", lat: 0.3689, lng: 32.5712 },
  { name: "Mpererwe", lat: 0.3789, lng: 32.5434 },
  { name: "Kasokoso", lat: 0.3856, lng: 32.5234 },
  { name: "Kiteezi", lat: 0.3734, lng: 32.5156 },
  { name: "Wakiso", lat: 0.3945, lng: 32.4789 },
  { name: "Sentoo", lat: 0.3867, lng: 32.4923 },
  { name: "Busukuma", lat: 0.4056, lng: 32.4589 },
  { name: "Kigoogi", lat: 0.3123, lng: 32.5923 },
  { name: "Munyanka", lat: 0.3189, lng: 32.5989 },
  { name: "Kabalagala", lat: 0.3256, lng: 32.6012 },
  { name: "Lusaka", lat: 0.3223, lng: 32.5989 },
  { name: "Kansanga", lat: 0.3301, lng: 32.5956 },
  { name: "Acacia", lat: 0.3367, lng: 32.5878 },
  { name: "Mubutu", lat: 0.3423, lng: 32.5812 },
  { name: "Kafumbe Mukasa", lat: 0.3467, lng: 32.5845 },
];

function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export default function KampalaMap({
  point,
  onPick,
}: {
  point: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(KAMPALA_CENTER);
  const [mapZoom, setMapZoom] = useState(13);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const filteredLocations = KAMPALA_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  function selectLocation(lat: number, lng: number) {
    setMapCenter([lat, lng]);
    setMapZoom(15);
    onPick(lat, lng);
    setSearchOpen(false);
    setQuery("");
  }

  if (!mounted) return null;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={11}
        maxZoom={17}
        zoomControl={false}
        className="h-full w-full z-0"
        style={{ background: "var(--surface)" }}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={onPick} />
        {point && (
          <>
            <Marker position={[point.lat, point.lng]} icon={markerIcon} />
            <Circle
              center={[point.lat, point.lng]}
              radius={400}
              pathOptions={{
                color: "var(--accent)",
                fillColor: "var(--accent)",
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: "4 4",
              }}
            />
          </>
        )}
      </MapContainer>

      <button
        onClick={() => setSearchOpen(true)}
        className="absolute top-6 right-6 z-[400] flex items-center gap-2 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-xl px-4 py-3 shadow-lg hover:border-[var(--accent)] transition-all"
      >
        <Search size={16} className="text-[var(--ink-muted)]" />
        <span className="text-sm text-[var(--ink-muted)]">Search locations</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[10px] font-mono text-[var(--ink-subtle)]">
          /
        </kbd>
      </button>

      {searchOpen && (
        <div className="absolute top-6 right-6 z-[500] w-80 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Search size={16} className="text-[var(--ink-muted)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search neighborhoods..."
              className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-subtle)] outline-none"
            />
            <button
              onClick={() => { setSearchOpen(false); setQuery(""); }}
              className="p-1 rounded hover:bg-[var(--bg)] transition-colors"
            >
              <X size={16} className="text-[var(--ink-muted)]" />
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-strong)] scrollbar-track-transparent hover:scrollbar-thumb-[var(--ink-muted)]">
            {filteredLocations.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--ink-muted)]">
                No locations found
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => selectLocation(loc.lat, loc.lng)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-colors text-left"
                >
                  <MapPin size={14} className="text-[var(--ink-subtle)] shrink-0" />
                  <span className="text-sm text-[var(--ink)]">{loc.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}