import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon issue
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function ListingMap({ listings, onMarkerClick }) {
  return (
    <MapContainer
      center={[43.6629, -79.3957]} // Default center: UofT area
      zoom={13}
      style={{ height: '400px', width: '100%', borderRadius: '1rem' }}
      scrollWheelZoom={false}
      className="z-10"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {listings.map((listing, index) => (
        listing.lat && listing.lng && (
          <Marker
            key={index}
            position={[listing.lat, listing.lng]}
            eventHandlers={{
              click: () => onMarkerClick(listing),
            }}
          >
            <Popup>
              <strong>{listing.title}</strong><br />
              {listing.price}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
