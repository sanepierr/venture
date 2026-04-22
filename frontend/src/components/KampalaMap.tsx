"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix default icon paths for Leaflet in bundlers
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

const KAMPALA: [number, number] = [0.3476, 32.5825];

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

export default function KampalaMap({
  point,
  onPick,
}: {
  point: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <MapContainer
      center={KAMPALA}
      zoom={13}
      minZoom={11}
      maxZoom={17}
      zoomControl={false}
      className="h-full w-full z-0"
      style={{ background: "var(--surface)" }}
    >
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
  );
}
