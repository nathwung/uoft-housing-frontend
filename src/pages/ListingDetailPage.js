import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockListings from '../data/mockListings';
import { MapPin, ArrowLeft, Users, BedDouble, Home, Tag } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const badgeColors = {
  Roommates: 'bg-purple-200 text-purple-900',
  Sublet: 'bg-green-200 text-green-900',
  'Furniture Market': 'bg-yellow-200 text-yellow-900',
  'Long-Term Housing': 'bg-indigo-200 text-indigo-900',
};

const typeIcons = {
  Roommates: Users,
  Sublet: BedDouble,
  'Furniture Market': Home,
  'Long-Term Housing': BedDouble,
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    // Ensure scroll fires after layout + images are done
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // or 'smooth'
    }, 10); // slight delay ensures scroll applies after paint
    
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    // Wait for DOM layout/render to complete
    const timeout = setTimeout(() => {
      const container = bottomRef.current?.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }, 100); // Small delay helps ensure scroll container is ready
  
    return () => clearTimeout(timeout);
  }, []);
  
  const [currentUser, setCurrentUser] = React.useState({});

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(stored);
  }, []);

  const [listing, setListing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listings/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchListing();
  }, [id]);

  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${id}`);
        const all = await res.json();
  
        const filtered = all.filter(
          (msg) =>
            msg.sender_name === currentUser.name || msg.recipient_name === currentUser.name
        );
  
        setMessages(filtered);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
  
    fetchMessages();
  }, [id, currentUser.name]);
  
  const isOwner = listing?.poster?.email === currentUser.email;

  const [messages, setMessages] = React.useState([]);

  const [input, setInput] = React.useState(''); 

  const bottomRef = React.useRef(null); 

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const newMessage = {
      from_user: false,
      sender_name: currentUser.name,
      recipient_name: listing?.poster?.name,
      text: input.trim()
    };        
  
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
  
      const saved = await res.json();
      console.log("SAVED MESSAGE:", saved); // Make sure it includes 'id'
      setMessages((prev) => [...prev, saved]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };  
  
  React.useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);  
  
  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-500 px-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading listing...</div>;
  }
  
  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-500 px-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }  

  const {
    title,
    type,
    price,
    negotiable,
    startDate,
    endDate,
    bedrooms,
    bathrooms,
    furnished,
    amenities,
    image,
    location,
    description,
    poster,
  } = listing;

  const resolvedPoster = isOwner ? currentUser : poster;

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getDurationInMonths = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-6 py-10 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-sm text-uoft-blue hover:underline"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Listings
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow mb-6">
          <ImageCarousel images={listing.images || []} />
        </div>
          <div className="bg-white rounded-xl shadow p-6 space-y-5 mb-8">
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-1">
                {/* Listing Type Badge */}
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${badgeColors[type] || 'bg-gray-100 text-gray-700'}`}>
                  {typeIcons[type] && React.createElement(typeIcons[type], { size: 12 })}
                  {type}
                </span>

                {/* Owner Badge */}
                {isOwner && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    <Tag size={12} />
                    Your Listing
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-uoft-blue">{title}</h1>
              <p className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin size={16} className="mr-1" /> {location}
              </p>
            </div>

            <p className="text-gray-700 text-base leading-relaxed">{description}</p>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xl font-semibold text-gray-800">
                ${price?.toLocaleString() || '—'}
                {type !== 'Furniture Market' && (
                  <span className="text-base font-normal text-gray-500"> /month</span>
                )}
              </p>
              <span
                className={`text-xs px-3 py-1 font-medium rounded-full ${
                  negotiable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {negotiable ? 'Negotiable' : 'Not Negotiable'}
              </span>
            </div>

            {type === 'Roommates' && listing.roommatePreference && (
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                  listing.roommatePreference === 'Female only'
                    ? 'bg-pink-100 text-pink-700'
                    : listing.roommatePreference === 'Male only'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {listing.roommatePreference === 'No preference'
                  ? 'No preference in gender'
                  : listing.roommatePreference}
              </span>
            )}

            {type === 'Sublet' && (
              <div className="text-sm text-gray-700">
                <p><strong>Duration:</strong> {getDurationInMonths(startDate, endDate)} months</p>
                <p><strong>From:</strong> {formatDate(startDate)} <strong>To:</strong> {formatDate(endDate)}</p>
              </div>
            )}

            {type !== 'Furniture Market' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                <p><strong>Bedrooms:</strong> {bedrooms}</p>
                <p><strong>Bathrooms:</strong> {bathrooms}</p>
                <p><strong>Furnished:</strong> {furnished ? 'Yes' : 'No'}</p>
                {amenities?.length > 0 && (
                  <p className="col-span-2 sm:col-span-3">
                    <strong>Amenities:</strong> {amenities.join(', ')}
                  </p>
                )}
              </div>
            )}

{poster && (
  <div className="pt-4 mt-2 border-t border-gray-200 flex items-center gap-4">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
      alt={resolvedPoster?.name}
      className="w-12 h-12 rounded-full bg-gray-100 object-cover"
    />
    <div className="text-sm text-gray-700">
      <p className="font-semibold">
        {resolvedPoster?.name} <span className="text-green-500 text-xs font-medium">✔ UofT Verified</span>
      </p>
      <p>{resolvedPoster?.email}</p>
      <p className="text-xs text-gray-500">
        {resolvedPoster?.program || '—'}
        {resolvedPoster?.program && resolvedPoster?.year ? ' • ' : ''}
        Class of {resolvedPoster?.year || '—'}
      </p>
    </div>
  </div>
)}
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location Map</h3>
            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Map"
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                className="border-none w-full h-[300px]"
                src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
              />
            </div>
          </div>

          {!isOwner && (
  <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-[400px] max-h-[400px]">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">
      Message {resolvedPoster?.name?.split(' ')[0] || 'User'}
    </h2>

    <div className="h-64 overflow-y-auto space-y-2 text-sm pr-1 border border-gray-200 rounded-md p-2 bg-gray-50">
      {messages.map((msg) => {
let formattedTime = '';
try {
  formattedTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(msg.time));
} catch (err) {
  formattedTime = '[Invalid Time]';
}
        return (
          <div key={msg.id} className={`flex ${msg.from_user === false ? 'justify-end' : 'justify-start'} group`}>
<div
  className={`relative pr-7 pl-4 py-2 rounded-2xl max-w-[75%] shadow-md text-sm ${
    msg.from_user === false
      ? 'bg-green-100 text-gray-800 rounded-br-none'
      : 'bg-white text-gray-900 border border-gray-300 rounded-bl-none'
  }`}
>
              <span>{msg.text}</span>

              {msg.sender_name === currentUser.name && (
                <button
                  onClick={async () => {
                    if (!window.confirm("Delete this message?")) return;
                    try {
                      await fetch(`http://localhost:5000/api/messages/${id}/${msg.id}`, {
                        method: 'DELETE',
                      });
                      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                    } catch (err) {
                      console.error("Failed to delete message:", err);
                    }
                  }}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full shadow-sm group-hover:opacity-100 opacity-0 transition hover:bg-red-600"
                  title="Delete message"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>

    <div className="flex gap-2 mt-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-uoft-blue"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-uoft-blue text-white rounded-full hover:bg-blue-900 transition"
      >
        Send
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}
