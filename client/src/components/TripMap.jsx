import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon } from 'lucide-react';
import IconBadge from './ui/IconBadge';

/**
 * Numbered day markers, styled like the day-badge already used on
 * ItineraryCard's timeline node — same brand gradient, same treatment —
 * so a pin and its day card read as the same object. Built as a DivIcon
 * rather than Leaflet's default marker image, which sidesteps a well-known
 * bundler issue: Leaflet's default icon URLs are relative and don't
 * resolve under Vite/webpack without manual asset patching.
 */
function dayDivIcon(day, approximate) {
  return L.divIcon({
    className: '',
    html: `
      <div class="flex h-8 w-8 items-center justify-center rounded-sm bg-grad-brand text-small font-bold text-white shadow-glow-brand ring-2 ring-white${approximate ? ' opacity-80' : ''}">
        ${day}
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

const TripMap = ({ days = [], destinationCoords }) => {
  const points = useMemo(
    () => days.filter((d) => d.coords).map((d) => ({ ...d, coords: d.coords })),
    [days]
  );

  if (points.length === 0) return null;

  const center = points.length === 1
    ? [points[0].coords.lat, points[0].coords.lng]
    : destinationCoords
      ? [destinationCoords.lat, destinationCoords.lng]
      : [points[0].coords.lat, points[0].coords.lng];

  const bounds = points.length > 1 ? points.map((p) => [p.coords.lat, p.coords.lng]) : null;
  const routeLine = points.map((p) => [p.coords.lat, p.coords.lng]);

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <IconBadge icon={MapIcon} accent="teal" variant="tint" size="sm" lift={false} />
        <div>
          <p className="text-h3 text-ink">Your route</p>
          <p className="text-caption text-ink-muted">
            {points.length} location{points.length === 1 ? '' : 's'} · OpenStreetMap
          </p>
        </div>
      </div>

      <div className="h-[340px] w-full sm:h-[400px]">
        <MapContainer
          center={center}
          zoom={points.length === 1 ? 13 : 12}
          bounds={bounds || undefined}
          boundsOptions={{ padding: [36, 36] }}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.length > 1 && (
            <Polyline
              positions={routeLine}
              pathOptions={{ color: '#039855', weight: 2.5, opacity: 0.55, dashArray: '1 8' }}
            />
          )}
          {points.map((p) => (
            <Marker
              key={p.day}
              position={[p.coords.lat, p.coords.lng]}
              icon={dayDivIcon(p.day, p.coordsApproximate)}
            >
              <Popup>
                <span className="text-tiny font-semibold text-ink">Day {p.day}: {p.title}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default TripMap;
