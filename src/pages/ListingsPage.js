import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Tag, LogOut, Pencil } from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import { Users, BedDouble, Home } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

function ForceMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // give the container a bit of time to layout
  }, [map]);

  return null;
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
});

const geocodeLocation = async (location) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
  return null;
};

const typeIcons = {
  Roommates: Users,
  Sublet: BedDouble,
  'Furniture Market': Home,
  'Long-Term Housing': BedDouble,
};

const badgeColors = {
  Roommates: 'bg-purple-200 text-purple-900',
  Sublet: 'bg-green-200 text-green-900',
  'Furniture Market': 'bg-yellow-200 text-yellow-900',
  'Long-Term Housing': 'bg-indigo-200 text-indigo-900',
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ListingsPage() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [priceLimit, setPriceLimit] = useState(null);
  const navigate = useNavigate();
  const sliderRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState({
    name: 'Unnamed User',
    email: '',
    avatar: '/default-avatar.png'
  });
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [mapOpen, setMapOpen] = useState(true);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [leftWidth, setLeftWidth] = useState(60); // % width of listings
  const [filteredByMapClickId, setFilteredByMapClickId] = useState(null);
  const [pinnedPopupId, setPinnedPopupId] = useState(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser({
        name: parsed.name || 'Unnamed User',
        email: parsed.email || '',
        avatar: parsed.avatar || '/default-avatar.png'
      });
    }
  }, []);  
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/favorites/${user.email}`);
        const data = await res.json();
        setFavorites(data.map(id => String(id)));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setFavoritesReady(true);
      }
    };
  
    if (user.email) {
      fetchFavorites();
    }
  }, [user.email]);  

  useEffect(() => {
    const fetchListingsWithCoords = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/listings`);
        const data = await res.json();
  
        const listingsWithCoords = await Promise.all(
          data.map(async (item) => {
            const coords = await geocodeLocation(item.location);
            return { ...item, id: String(item.id), coords };
          })
        );
  
        setListings(listingsWithCoords);
      } catch (err) {
        console.error("Failed to fetch listings with coordinates:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchListingsWithCoords();
  }, [location.pathname]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await fetch(`${API_BASE_URL}/api/listings/${id}`, {
        method: 'DELETE'
      });      
      setListings((prev) => prev.filter((listing) => String(listing.id) !== String(id)));
    }
  };  

  let filtered = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
  
    const matchesType =
      activeType === 'All' ||
      item.type === activeType ||
      (activeType === 'Your Listings' && item.poster?.email === user.email);
  
    const matchesSaved = !showOnlySaved || favorites.includes(item.id);
    const matchesPrice = !priceLimit || item.price <= priceLimit;
    const matchesLocation = !clickedLocation || item.location === clickedLocation;
  
    return matchesSearch && matchesType && matchesSaved && matchesPrice && matchesLocation;
  });  

  if (sortBy === 'low') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'high') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'az') filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === 'za') filtered.sort((a, b) => b.title.localeCompare(a.title));
  if (sortBy === 'recent') filtered.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));  

  return (
    <div className="min-h-[100vh] bg-gradient-to-b from-[#f0f4fa] to-[#e4e9f1] font-sans">
      {/* NAVBAR */}
      <header className="w-full sticky top-0 z-30 bg-gradient-to-tr from-[#e9f0fa] to-[#008AD8] shadow-sm backdrop-blur-sm flex items-center justify-between px-6 py-2 h-14">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:shadow-md transition focus:outline-none"
          >
          <span className="material-icons text-gray-600 text-[28px]">account_circle</span>
          <span className="hidden sm:block font-medium text-gray-700">{user.name}</span>
            <span
              className={`material-icons text-gray-500 text-[20px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            >
              keyboard_arrow_down
            </span>
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className="absolute right-0 mt-3 w-44 rounded-2xl shadow-2xl bg-white/70 backdrop-blur-lg border border-gray-200 z-50 overflow-hidden"
>
  <button
    onClick={() => {
      navigate('/profile');
      setDropdownOpen(false);
    }}
    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-100 transition"
  >
    <Pencil size={16} className="text-blue-500" />
    Edit Profile
  </button>
  <button
    onClick={() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
    }}
    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-100 transition"
  >
    <LogOut size={16} className="text-red-500" />
    Sign Out
  </button>
</motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mt-12 mb-6 text-center px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Your Next Space
        </motion.h1>
        <motion.p
          className="text-md text-gray-600 mt-3 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Browse UofT-verified housing, furniture, and sublets all in one place.
        </motion.p>
      </div>

      {/* Search + Sort + Saved */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 px-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings..."
          className="w-full sm:w-[45%] px-5 py-3 rounded-xl shadow border border-gray-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-[30%] px-4 py-3 rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-sm focus:outline-none"
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="az">Title: A → Z</option>
          <option value="za">Title: Z → A</option>
          <option value="recent">Most Recent</option>
        </select>
        <div className="w-full sm:w-[30%] flex flex-col gap-2">
          <label className="text-sm text-gray-700 font-semibold">
            Max Price
            <span className="ml-1 text-blue-700 font-bold">
              ${priceLimit ?? '∞'}
            </span>
          </label>
          <div className="relative group">
            <input
              ref={sliderRef}
              type="range"
              min="200"
              max="3000"
              step="50"
              value={priceLimit ?? 3000}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="w-full appearance-none bg-gradient-to-r from-blue-300 to-blue-600 h-2 rounded-full outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {isDragging && (
              <div
                className="absolute -top-10 left-[calc(((var(--val)-200)/2800)*100%)] transform -translate-x-1/2 transition-opacity duration-200"
                style={{ '--val': priceLimit ?? 3000 }}
              >
                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded shadow-lg font-semibold whitespace-nowrap">
                  ${priceLimit ?? '∞'}
                </div>
              </div>
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
          <input
            type="checkbox"
            checked={showOnlySaved}
            onChange={() => setShowOnlySaved(!showOnlySaved)}
            className="h-4 w-4"
          />
          <span>Show Only Saved</span>
        </label>
        <Link to="/post">
          <button
            className="flex whitespace-nowrap items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full shadow transition"
          >
            <span className="material-icons text-base">add</span>
            <span className="font-medium">Post Listing</span>
          </button>
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="w-full flex flex-wrap justify-center items-center gap-2 px-6 mb-8">
  {[
    { type: 'All', icon: null },
    { type: 'Roommates', icon: Users },
    { type: 'Sublet', icon: BedDouble },
    { type: 'Furniture Market', icon: Home },
    { type: 'Long-Term Housing', icon: BedDouble },
    { type: 'Your Listings', icon: Tag },
  ].map(({ type, icon: Icon }) => (
    <button
      key={type}
      onClick={() => setActiveType(type)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border font-medium text-sm transition ${
        activeType === type
          ? 'bg-blue-600 text-white border-blue-700'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{type}</span>
    </button>
    
  ))}

  {/* Clear All Filters Button */}
  <button
    onClick={() => {
      setSearch('');
      setSortBy('');
      setActiveType('All');
      setPriceLimit(null);
      setShowOnlySaved(false);
      setClickedLocation(null); // <-- Important
    }}
    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 text-sm font-semibold transition"
  >
    <span className="material-icons text-base">restart_alt</span>
    Clear All Filters
  </button>
  <button
    onClick={() => setMapOpen((prev) => !prev)}
    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 text-sm font-semibold transition"
  >
    <span className="material-icons text-base">map</span>
    {mapOpen ? 'Hide Map' : 'Show Map'}
  </button>
</div>

<div className="flex w-full px-0 gap-4 items-stretch min-h-[calc(100vh-56px)]">
  {/* LISTINGS LEFT SIDE */}
  <div
  style={{ width: mapOpen ? `${leftWidth}%` : '100%', height: 'calc(100vh - 56px)' }}
  className={`transition-all duration-200 overflow-y-auto ${mapOpen ? 'pr-1' : 'px-6'}`}
>

<div className={`grid gap-6 ${mapOpen ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
      {!favoritesReady || loading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        ))
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 col-span-full">No listings found.</div>
      ) : (
        filtered.map((listing, idx) => {
          const listingId = String(listing.id);
          const isFavorited = favorites.includes(listingId);
          return (
<motion.div
  key={listing.id}
  className="relative flex flex-col h-full bg-white/70 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition group"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: idx * 0.05 }}
  whileHover={{ scale: 1.015 }}
>
  {/* YOUR LISTING BADGE */}
  {listing.poster?.email === user.email && (
  <div className="absolute top-3 left-3 bg-blue-100 text-blue-700 text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm z-10 inline-flex items-center gap-1">
    <Tag className="w-3 h-3" />
    Your Listing
  </div>
  )}


  {/* Favorite Star (only for non-owner listings) */}
{listing.poster?.email !== user.email && (
  <button
  onClick={async () => {
    const idStr = String(listing.id);
 
    try {
      if (favorites.includes(idStr)) {
        // DELETE
        await fetch(`${API_BASE_URL}/api/favorites`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: user.email,
            listing_id: idStr
          })
        });
        setFavorites((prev) => prev.filter(id => id !== idStr));
      } else {
        // POST
        await fetch(`${API_BASE_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: user.email,
            listing_id: idStr
          })
        });
        setFavorites((prev) => [...prev, idStr]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  }}  
  className={`absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center z-10 shadow-sm ${
    isFavorited
      ? 'bg-yellow-400 text-white'
      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
  }`}
  title="Save listing"
>
  <span className="material-icons text-base">star</span>
</button>
)}


{listing.poster?.email === user.email && (
  <button
    onClick={() => handleDelete(listing.id)}
    title="Delete listing"
    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 z-10"
  >
    ×
  </button>
)}


<div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-64 rounded-t-xl overflow-hidden">
    <ImageCarousel images={listing.images || [listing.image]} className="w-full h-full object-cover" />
  </div>


  <div className="p-5 flex flex-col flex-1 justify-between">
    {/* Top Section: Badge and Title */}
    <div className="flex flex-col gap-1.5">
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full self-start ${badgeColors[listing.type] || 'bg-gray-100 text-gray-700'}`}>
        {typeIcons[listing.type] && React.createElement(typeIcons[listing.type], { size: 12 })}
        {listing.type}
      </span>


      <h3 className="text-lg font-bold text-gray-900 leading-tight min-h-[48px]">{listing.title}</h3>


      <p className="text-sm text-gray-600 leading-snug min-h-[40px]">
        {listing.description}
      </p>


      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <MapPin size={14} />
        {listing.location}
      </div>
    </div>


    {/* Bottom Section: Price, Negotiability & Button */}
    <div className="mt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-extrabold text-gray-800">
          ${listing.price.toLocaleString()}
          {listing.type !== 'Furniture Market' && (
            <span className="text-sm font-medium text-gray-500"> /month</span>
          )}
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            listing.negotiable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {listing.negotiable ? 'Negotiable' : 'Not Negotiable'}
        </span>
      </div>


      {listing.poster?.email === user.email ? (
        <button
          onClick={() => navigate(`/edit/${listing.id}`)}
          className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-full transition flex items-center justify-center"
        >
          <span className="material-icons text-base mr-1">edit</span>
          Edit Listing
        </button>
      ) : (
        <button
          onClick={() => navigate(`/listing/${listing.id}`)}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition flex items-center justify-center"
        >
          View Listing
          <ArrowRight size={16} className="ml-1" />
        </button>
      )}
    </div>
  </div>
</motion.div>
          );
        })
      )}
    </div>
  </div>

  {/* Resizer */}
  {mapOpen && (
    <div className="w-1 bg-gray-200" />
)}

{/* Map */}
{mapOpen && (
  <div
  style={{ width: `${100 - leftWidth}%`, height: 'calc(100vh - 56px)' }}
  className="relative shadow-lg border border-blue-200 rounded-none"
>

    <MapContainer
  center={[43.6685, -79.3957]}
  zoom={12}
  className="w-full h-full"
  style={{ height: '100%', width: '100%' }}
>
  <ForceMapResize />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
{filtered.map((listing, index) =>
  listing.coords ? (
<Marker
  key={index}
  position={listing.coords}
  eventHandlers={{
    click: (e) => {
      setClickedLocation(listing.location); // Filter listings
      setSearch('');
      setFilteredByMapClickId(null);
      setPinnedPopupId(listing.id); // <- Pin the popup open
      e.target.openPopup(); // Open it
    },
    mouseover: (e) => {
      if (pinnedPopupId !== listing.id) {
        e.target.openPopup();
      }
    },
    mouseout: (e) => {
      if (pinnedPopupId !== listing.id) {
        e.target.closePopup();
      }
    },
    popupclose: () => {
      if (pinnedPopupId === listing.id) {
        setPinnedPopupId(null); // Unpin when X is clicked
      }
    }
  }}
>
  <Popup>
    <div className="text-xs text-gray-600">{listing.location}</div>
  </Popup>
</Marker>
  ) : null
)}
    </MapContainer>
  </div>
)}

</div>

    </div>
  );
}
