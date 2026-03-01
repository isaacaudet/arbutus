"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Provider } from "@/lib/providers";

const BRAND_GREEN = "#1C3829";
const CORAL = "#C8694B";

function makeIcon(color: string, large = false) {
  const w = large ? 32 : 24;
  const h = large ? 48 : 36;
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 36" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.25));display:block">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
    className: "",
  });
}

function userIcon() {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#4A90E2" stroke="white" stroke-width="2"/>
    </svg>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    className: "",
  });
}

// Sub-component to fly map when center changes
function MapFlyController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prev = useRef<string>("");
  useEffect(() => {
    const key = `${center[0]},${center[1]}`;
    if (key !== prev.current) {
      prev.current = key;
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [map, center, zoom]);
  return null;
}

export interface MapViewProps {
  providers: Provider[];
  activeId: string | null;
  hoveredId: string | null;
  center: { lat: number; lng: number };
  radiusKm: number;
  userLocation: { lat: number; lng: number } | null;
  onPinClick: (id: string) => void;
  onPinHover: (id: string | null) => void;
}

export function MapView({
  providers,
  activeId,
  hoveredId,
  center,
  radiusKm,
  userLocation,
  onPinClick,
  onPinHover,
}: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl
    >
      <MapFlyController center={[center.lat, center.lng]} zoom={13} />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Radius circle centered on user location */}
      {userLocation && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radiusKm * 1000}
          pathOptions={{
            color: BRAND_GREEN,
            fillColor: BRAND_GREEN,
            fillOpacity: 0.07,
            weight: 1.5,
            dashArray: "5 5",
          }}
        />
      )}

      {/* User location dot */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon()} />
      )}

      {/* Provider pins */}
      {providers.map((provider) => {
        const isActive = provider.id === activeId;
        const isHovered = provider.id === hoveredId;
        const color = isActive ? CORAL : BRAND_GREEN;
        return (
          <Marker
            key={provider.id}
            position={[provider.lat, provider.lng]}
            icon={makeIcon(color, isActive || isHovered)}
            zIndexOffset={isActive ? 1000 : isHovered ? 500 : 0}
            eventHandlers={{
              click: () => onPinClick(provider.id),
              mouseover: () => onPinHover(provider.id),
              mouseout: () => onPinHover(null),
            }}
          />
        );
      })}
    </MapContainer>
  );
}
