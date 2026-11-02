import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Navigation, Compass, Store, Home, Bike, Info } from 'lucide-react';

export default function DeliveryRouteMap({
  pickup = { lat: 18.5158, lng: 73.7802, name: 'Bavdhan Agro Hub' },
  drop = { lat: 18.5590, lng: 73.7868, name: 'Baner Customer' },
  status = 'In transit',
  height = '360px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Compute intermediate rider location based on delivery status
  let riderLat = pickup.lat;
  let riderLng = pickup.lng;

  if (status === 'Assigned' || status === 'Accepted') {
    riderLat = pickup.lat - 0.005;
    riderLng = pickup.lng - 0.005;
  } else if (status === 'Reached pickup location') {
    riderLat = pickup.lat;
    riderLng = pickup.lng;
  } else if (status === 'Picked up' || status === 'In transit') {
    riderLat = (pickup.lat + drop.lat) / 2 + 0.003;
    riderLng = (pickup.lng + drop.lng) / 2;
  } else if (status === 'Out for delivery') {
    riderLat = drop.lat - 0.003;
    riderLng = drop.lng - 0.002;
  } else if (status === 'Delivered') {
    riderLat = drop.lat;
    riderLng = drop.lng;
  }

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const bounds = L.latLngBounds([
      [pickup.lat, pickup.lng],
      [drop.lat, drop.lng]
    ]);

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    });
    mapInstanceRef.current = map;

    // OpenStreetMap free tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom DivIcon for Farmer Pickup
    const pickupIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background-color: #081c15; border: 2px solid #52b788; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <span style="font-size: 16px;">🌱</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Custom DivIcon for Customer Drop-off
    const dropIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background-color: #1b4332; border: 2px solid #74c69d; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <span style="font-size: 16px;">🏠</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Custom DivIcon for Courier Rider
    const riderIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="background-color: #2d6a4f; border: 2px solid #b7e4c7; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px rgba(82, 183, 136, 0.35); animation: pulse 2s infinite;">
          <span style="font-size: 18px;">⚡</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    // Markers
    const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map);
    pickupMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <strong style="color: #081c15; font-size: 13px;">🌾 Pickup: ${pickup.name || 'Farm Hub'}</strong>
        <p style="margin: 4px 0 0; font-size: 11px; color: #555;">${pickup.address || 'Agro Staging Hub'}</p>
      </div>
    `);

    const dropMarker = L.marker([drop.lat, drop.lng], { icon: dropIcon }).addTo(map);
    dropMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <strong style="color: #1b4332; font-size: 13px;">🏡 Drop: ${drop.name || 'Customer Address'}</strong>
        <p style="margin: 4px 0 0; font-size: 11px; color: #555;">${drop.address || 'Customer Premises'}</p>
      </div>
    `);

    // Rider marker (shown when active)
    if (status !== 'Delivered') {
      const riderMarker = L.marker([riderLat, riderLng], { icon: riderIcon }).addTo(map);
      riderMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <strong style="color: #2d6a4f; font-size: 13px;">🛵 Courier Position</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #555;">Status: ${status}</p>
        </div>
      `);
    }

    // Connect with route Polyline
    const polyline = L.polyline(
      [
        [pickup.lat, pickup.lng],
        [riderLat, riderLng],
        [drop.lat, drop.lng]
      ],
      {
        color: '#2d6a4f',
        weight: 4,
        opacity: 0.8,
        dashArray: '6, 8',
        lineCap: 'round'
      }
    ).addTo(map);

    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickup.lat, pickup.lng, drop.lat, drop.lng, riderLat, riderLng, status]);

  // Google Maps turn-by-turn navigation link
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${drop.lat},${drop.lng}&travelmode=driving`;

  return (
    <div className="bg-white rounded-3xl border border-[#2d6a4f]/20 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-[#081c15] text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#2d6a4f]/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1b4332] text-[#52b788] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Route & Landmark Navigation
            </h4>
            <p className="text-[11px] text-[#74c69d]">OpenStreetMap Interactive Vector Tiles</p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#52b788] text-[#081c15] font-bold text-xs hover:bg-[#74c69d] transition shadow-sm"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} style={{ height: height, width: '100%', zIndex: 10 }} />

      {/* Milestones Legend & Transparency Note */}
      <div className="p-4 bg-[#faf8f2] border-t border-[#2d6a4f]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#081c15] border border-[#52b788]" />
            <span className="font-semibold text-[#081c15]">Pickup Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2d6a4f] border border-[#b7e4c7]" />
            <span className="font-semibold text-[#2d6a4f]">Courier Milestone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1b4332] border border-[#74c69d]" />
            <span className="font-semibold text-[#1b4332]">Customer Destination</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
          <Info className="w-3.5 h-3.5 text-[#40916c] flex-shrink-0" />
          <span>Milestone-verified routing. No simulated continuous battery drain.</span>
        </div>
      </div>
    </div>
  );
}

