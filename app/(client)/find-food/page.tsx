"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type LocationItem = {
  id: number;
  name: string;
  type: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  url: string | null;
  distanceKm?: number;
};

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  { ssr: false }
);

export default function FindFoodPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "SHELF" | "KITCHEN">("all");
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (userPosition) {
      params.set("lat", String(userPosition.lat));
      params.set("lng", String(userPosition.lng));
    }
    const query = params.toString();
    fetch(`/api/locations${query ? `?${query}` : ""}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: LocationItem[]) => setLocations(Array.isArray(data) ? data : []))
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  }, [typeFilter, userPosition]);

  const handleUseMyLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError("Could not get your location. You can still browse the map.");
      }
    );
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    marginBottom: "0.75rem",
  };

  return (
    <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Food shelves & kitchens near you
      </h1>
      <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Find food shelves and community kitchens. Use your location to sort by distance.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={handleUseMyLocation}
          style={{
            padding: "0.5rem 1rem",
            background: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Use my location
        </button>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | "SHELF" | "KITCHEN")}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.875rem",
            background: "#fff",
          }}
        >
          <option value="all">All</option>
          <option value="SHELF">Food shelves</option>
          <option value="KITCHEN">Kitchens</option>
        </select>
      </div>

      {locationError && (
        <p style={{ color: "#b45309", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {locationError}
        </p>
      )}

      {loading && (
        <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading locations...</p>
      )}

      {!loading && (
        <>
          <div style={{ marginBottom: "2rem" }}>
            <MapView locations={locations} userPosition={userPosition} />
          </div>

          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            List of locations
          </h2>
          {locations.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No locations in the database yet. Staff can add food shelves and kitchens to show here.
            </p>
          ) : (
            <div>
              {locations.map((loc) => (
                <div key={loc.id} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#7c3aed",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {loc.type}
                      </span>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: "0.25rem" }}>
                        {loc.name}
                      </h3>
                      {loc.address && (
                        <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                          {loc.address}
                        </p>
                      )}
                    </div>
                    {loc.distanceKm != null && (
                      <span style={{ fontSize: "0.875rem", color: "#475569", fontWeight: 500 }}>
                        {loc.distanceKm < 1
                          ? `${Math.round(loc.distanceKm * 1000)} m away`
                          : `${loc.distanceKm.toFixed(1)} km away`}
                      </span>
                    )}
                  </div>
                  {loc.url && (
                    <a
                      href={loc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#7c3aed",
                        fontWeight: 500,
                      }}
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
