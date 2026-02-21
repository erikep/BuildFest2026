"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const DEFAULT_CENTER: [number, number] = [44.9537, -93.09];
const DEFAULT_ZOOM = 10;

// Fix default marker icon in Leaflet with Next.js
const createIcon = () =>
  L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export function MapView({
  locations,
  userPosition,
}: {
  locations: LocationItem[];
  userPosition: { lat: number; lng: number } | null;
}) {
  const withCoords = useMemo(
    () => locations.filter((loc) => loc.latitude != null && loc.longitude != null),
    [locations]
  );

  const center: [number, number] = useMemo(() => {
    if (userPosition) return [userPosition.lat, userPosition.lng];
    if (withCoords.length > 0)
      return [withCoords[0].latitude!, withCoords[0].longitude!];
    return DEFAULT_CENTER;
  }, [userPosition, withCoords]);

  const icon = useMemo(() => createIcon(), []);

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={icon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {withCoords.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude!, loc.longitude!]}
            icon={icon}
          >
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              {loc.type}
              {loc.address && (
                <>
                  <br />
                  {loc.address}
                </>
              )}
              {loc.url && (
                <>
                  <br />
                  <a href={loc.url} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
