import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockListings from '../data/mockListings';
import { MapPin, ArrowLeft, UploadCloud, Info, DollarSign, Pencil, Users, BedDouble, Home } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const parseAmenities = (input) => {
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') return input.split(',').map((a) => a.trim());
  return [];
};

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = React.useRef(null);

  const [formData, setFormData] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [activeChat, setActiveChat] = React.useState(null);
  const [input, setInput] = React.useState('');

  const [messages, setMessages] = React.useState({});

  React.useEffect(() => {
    // Ensure scroll fires after layout + images are done
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // or 'smooth'
    }, 10); // slight delay ensures scroll applies after paint
  
    return () => clearTimeout(timeout);
  }, []);

// Scroll chat to bottom when formData and chat are ready
React.useEffect(() => {
    if (formData && activeChat) {
      const timeout = setTimeout(() => {
        const container = bottomRef.current?.parentElement;
        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }); // scroll only the chat box
        }
      }, 300); // delay lets layout fully render
  
      return () => clearTimeout(timeout);
    }
  }, [formData, activeChat]);
  
  // Scroll chat to bottom when messages update (like after sending)
  React.useEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
   
  React.useEffect(() => {
    async function fetchListingAndMessages() {
      try {
        const listingRes = await fetch(`http://localhost:5000/api/listings/${id}`);
        const listing = await listingRes.json();
  
        const latestUser = JSON.parse(localStorage.getItem('user') || '{}');

        setFormData({
          ...listing,
          amenities: parseAmenities(listing.amenities),
          startDate: listing.startDate ? new Date(listing.startDate) : null,
          endDate: listing.endDate ? new Date(listing.endDate) : null,
          image: listing.images || [],
          poster: {
            name: latestUser.name || listing.poster?.name || 'Unnamed User',
            email: latestUser.email || listing.poster?.email || '',
            avatar: latestUser.avatar || listing.poster?.avatar || '/default-avatar.png',
            program: latestUser.program || listing.poster?.program || '',
            year: latestUser.year || listing.poster?.year || ''
          }
        });        
  
        const posterName = listing.poster?.name;
  
        const msgRes = await fetch(`http://localhost:5000/api/messages/grouped/${id}`);
        const messageData = await msgRes.json();
  
        setMessages(messageData);
  
        const buyerNames = Object.keys(messageData).filter(name => name !== posterName);
        if (buyerNames[0]) setActiveChat(buyerNames[0]);
      } catch (err) {
        console.error('Failed to load listing or messages:', err);
      }
    }
  
    fetchListingAndMessages();
  }, [id]);  

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const fileList = Array.from(files);
      setFormData((prev) => ({ ...prev, image: [...prev.image, ...fileList] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toBase64 = (file) => new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    const images = await Promise.all(formData.image.map(img => typeof img === 'string' ? img : toBase64(img)));
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    const updated = {
      ...formData,
      images,
      amenities: parseAmenities(formData.amenities), 
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      poster: {
        name: storedUser.name,
        email: storedUser.email,
        avatar: storedUser.avatar || '/default-avatar.png',
        program: storedUser.program,
        year: storedUser.year
      }
    };         
    const existing = JSON.parse(localStorage.getItem('tempListings') || '[]');
    const mod = existing.map((l) => String(l.id) === id ? updated : l);
    await fetch(`http://localhost:5000/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updated)
    });    
    setEditing(false);
    setFormData(updated);
  };

  if (!formData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-6 py-10 font-sans">
      <button
        onClick={() => navigate('/listings')}
        className="mb-6 flex items-center text-sm text-uoft-blue hover:underline"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to Listings
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2">
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow mb-6">
            <ImageCarousel images={formData.image} />
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-8">
  <div className="flex justify-between items-start mb-4">
    <div className="w-full">
    {editing ? (
  <>
    <div className="mb-3">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
        <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded p-2"
        >
            <option value="">Select listing type</option>
            <option value="Roommates">Roommates</option>
            <option value="Sublet">Sublet</option>
            <option value="Furniture Market">Furniture Market</option>
            <option value="Long-Term Housing">Long-Term Housing</option>
        </select>
    </div>

    <div className="mb-3">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
      <input
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded p-2 text-lg font-semibold text-uoft-blue"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <input
        id="location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="w-full border rounded p-2 text-sm text-gray-700"
      />
    </div>
  </>
) : (
        <>
        <div className="mb-1">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${badgeColors[formData.type] || 'bg-gray-100 text-gray-700'}`}>
                {typeIcons[formData.type] && React.createElement(typeIcons[formData.type], { size: 12 })}
                {formData.type}
            </span>
        </div>
          <h1 className="text-2xl font-bold text-uoft-blue mb-1">{formData.title}</h1>
          <p className="text-sm text-gray-600 flex items-center"><MapPin size={14} className="mr-1" /> {formData.location}</p>
        </>
      )}
    </div>
    {!editing ? (
        <button
  onClick={() => setEditing(true)}
  className="p-2 rounded-full bg-[#00204E] hover:bg-[#001634] text-white shadow transition"
  aria-label="Edit Listing"
>
  <Pencil size={18} className="text-white" />
</button>

    ) : (
      <div className="flex justify-end gap-3 mt-2 ml-6">
        <button onClick={handleSubmit} className="bg-[#00204E] text-white px-4 py-2 rounded-full">Save</button>
        <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded-full">Cancel</button>
      </div>
    )}
  </div>

  {editing ? (
    <>
  {/* Description */}
  <div className="mb-3">
    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <textarea
      id="description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      className="w-full border rounded p-2 text-gray-700"
    />
  </div>

  {/* Price */}
  <div className="mb-3">
    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
    <input
      id="price"
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      className="w-full border rounded p-2"
    />
  </div>

  {/* Negotiable */}
  <label className="flex items-center gap-2 mb-4 text-sm">
    <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} />
    Price Negotiable
  </label>

  {/* Conditional fields */}
  {['Sublet', 'Roommates', 'Long-Term Housing'].includes(formData.type) && (
    <>
      <div className="mb-3">
        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
        <input
          id="bedrooms"
          type="number"
          name="bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
        <input
          id="bathrooms"
          type="number"
          name="bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <label className="flex items-center gap-2 mb-3 text-sm">
        <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} />
        Furnished
      </label>
      <div className="mb-3">
        <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
        <input
          id="amenities"
          name="amenities"
          value={formData.amenities}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="e.g. Wi-Fi, Laundry, Parking"
        />
      </div>
    </>
  )}

  {/* Roommate Preference */}
  {formData.type === 'Roommates' && (
    <div className="mb-3">
      <label htmlFor="roommatePreference" className="block text-sm font-medium text-gray-700 mb-1">Roommate Preference</label>
      <select
        id="roommatePreference"
        name="roommatePreference"
        value={formData.roommatePreference}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="">Roommate Preference</option>
        <option value="Female only">Female only</option>
        <option value="Male only">Male only</option>
      </select>
    </div>
  )}

  {/* Sublet Date Range */}
  {formData.type === 'Sublet' && (
    <div className="grid grid-cols-2 gap-4 mb-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
          className="w-full border rounded p-2"
          placeholderText="Start Date"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <DatePicker
          selected={formData.endDate}
          onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
          className="w-full border rounded p-2"
          placeholderText="End Date"
        />
      </div>
    </div>
  )}

  {/* Images */}
  <div className="mb-3">
    <label className="block mb-1 text-sm font-medium text-gray-700">Upload Images</label>
    <input type="file" multiple onChange={handleChange} />
    <div className="flex flex-wrap gap-2 mt-2">
      {formData.image.map((img, i) => (
        <div key={i} className="relative w-24 h-24">
          <img
            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
            alt=""
            className="w-full h-full object-cover rounded"
          />
          <button
            type="button"
            onClick={() => setFormData(prev => ({
              ...prev,
              image: prev.image.filter((_, idx) => idx !== i)
            }))}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
</>
  ) : (
    <>
<p className="text-gray-700 text-base leading-relaxed mb-3">{formData.description}</p>

<div className="flex items-center justify-between gap-2 mb-4">
  <p className="text-2xl font-semibold text-gray-900">
    ${Number(formData.price).toLocaleString()}
    {formData.type !== 'Furniture Market' && (
      <span className="text-base font-normal text-gray-500"> /month</span>
    )}
  </p>
  <span
    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
      formData.negotiable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'
    }`}
  >
    {formData.negotiable ? 'Negotiable' : 'Not Negotiable'}
  </span>
</div>

{/* Roommate Preference Badge */}
{formData.type === 'Roommates' && formData.roommatePreference && (
  <div className="mb-4">
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
        formData.roommatePreference === 'Female only'
          ? 'bg-pink-100 text-pink-700'
          : formData.roommatePreference === 'Male only'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {formData.roommatePreference === 'No preference'
        ? 'No preference in gender'
        : formData.roommatePreference}
    </span>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1 mt-4">
      <p><strong>Bedrooms:</strong> {formData.bedrooms || '—'}</p>
      <p><strong>Bathrooms:</strong> {formData.bathrooms || '—'}</p>
      <p><strong>Furnished:</strong> {formData.furnished ? 'Yes' : 'No'}</p>
    </div>

    <p className="mt-4">
  <strong>Amenities:</strong>{' '}
  {(Array.isArray(formData.amenities) && formData.amenities.length > 0)
    ? formData.amenities.join(', ')
    : '—'}
</p>
  </div>
  
)}

{formData.type === 'Long-Term Housing' && !editing && (
  <div className="text-sm text-gray-800 mb-4">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1">
      <p><strong>Bedrooms:</strong> {formData.bedrooms || '—'}</p>
      <p><strong>Bathrooms:</strong> {formData.bathrooms || '—'}</p>
      <p><strong>Furnished:</strong> {formData.furnished ? 'Yes' : 'No'}</p>
    </div>

    <p className="mt-4">
  <strong>Amenities:</strong>{' '}
  {(Array.isArray(formData.amenities) && formData.amenities.length > 0)
    ? formData.amenities.join(', ')
    : '—'}
</p>
  </div>
)}

{formData.type === 'Sublet' && !editing && (
  <div className="text-sm text-gray-800 mb-4">
    <p><strong>Duration:</strong> {formData.startDate && formData.endDate ? `${(new Date(formData.endDate).getFullYear() - new Date(formData.startDate).getFullYear()) * 12 + (new Date(formData.endDate).getMonth() - new Date(formData.startDate).getMonth()) + 1} months` : '—'}</p>

    <p>
      <strong>From:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}{' '}
      <strong>To:</strong> {formData.endDate ? new Date(formData.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1 mt-4">
      <p><strong>Bedrooms:</strong> {formData.bedrooms || '—'}</p>
      <p><strong>Bathrooms:</strong> {formData.bathrooms || '—'}</p>
      <p><strong>Furnished:</strong> {formData.furnished ? 'Yes' : 'No'}</p>
    </div>

    <p className="mt-4">
  <strong>Amenities:</strong>{' '}
  {(Array.isArray(formData.amenities) && formData.amenities.length > 0)
    ? formData.amenities.join(', ')
    : '—'}
</p>
  </div>
)}

    </>
  )}

  <hr className="my-4" />
  <div className="flex items-center gap-4">
    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" className="w-12 h-12 rounded-full" alt="user" />
    <div className="text-sm">
    <p className="font-semibold text-[15px] text-gray-900">
  {formData.poster?.name} <span className="text-green-500 text-xs font-medium">✔ UofT Verified</span>
</p>
<p className="text-[15px] text-gray-800">{formData.poster?.email}</p>

{(formData.poster?.program || formData.poster?.year) && (
  <p className="text-sm text-gray-500">
    {formData.poster?.program || ''}{formData.poster?.program && formData.poster?.year ? ' • ' : ''}
    {formData.poster?.year ? `Class of ${formData.poster.year}` : ''}
  </p>
)}

    </div>
  </div>
</div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location Map</h3>
            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                key={formData.location}
                title="Map"
                width="100%"
                height="300"
                loading="lazy"
                allowFullScreen
                className="border-none w-full h-[300px]"
                src={`https://www.google.com/maps?q=${encodeURIComponent(formData.location)}&output=embed`}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
  <h2 className="text-xl font-semibold text-gray-800 mb-3">Interested Buyers</h2>

  {Object.entries(messages).filter(([name]) => name !== formData.poster?.name).length === 0 ? (
    <p className="text-sm text-gray-500 italic">No interested buyers yet.</p>
  ) : (
    Object.entries(messages)
      .filter(([name]) => name !== formData.poster?.name)
      .map(([name, msgs]) => (
        <div
          key={name}
          onClick={() => setActiveChat(name)}
          className={`cursor-pointer p-2 rounded-md ${activeChat === name ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        >
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-gray-500 truncate">{msgs[msgs.length - 1]?.text || ''}</p>
        </div>
      ))
  )}
</div>

          <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-2">
            Message {activeChat?.split(' ')[0] || 'User'}
          </h3>
            <div className="h-64 overflow-y-auto border border-gray-200 rounded p-2 space-y-2 text-sm bg-gray-50">
            {messages[activeChat]?.map((msg, i) => {
              const isCurrentUserSender = msg.sender_name === formData.poster?.name;

              return (
                <div key={`${msg.text}-${msg.time}-${i}`} className={`relative group flex ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] pl-4 pr-6 py-2 rounded-lg shadow relative ${isCurrentUserSender ? 'bg-green-100' : 'bg-white border'}`}>
                    <div>
                      {msg.text?.trim() ? msg.text : <span className="text-gray-400 italic">[No message]</span>}
                    </div>
                    {isCurrentUserSender && (
                      <button
                      onClick={async () => {
                        if (!window.confirm('Delete this message?')) return;
                      
                        const messageId = msg.id; // get message ID from message object
                        try {
                          const res = await fetch(`http://localhost:5000/api/messages/${id}/${messageId}`, {
                            method: 'DELETE',
                          });
                      
                          const result = await res.json();
                          if (result.success) {
                            // re-fetch messages from backend after deletion
                            const updatedRes = await fetch(`http://localhost:5000/api/messages/grouped/${id}`);
                            const updatedMessages = await updatedRes.json();
                            setMessages(updatedMessages);
                          } else {
                            console.error('Failed to delete:', result.error);
                          }
                        } catch (err) {
                          console.error('Error deleting message:', err);
                        }
                      }}          
                        className="absolute absolute top-[2px] right-[2px] bg-red-500 text-white text-xs rounded-full px-1 shadow-sm opacity-0 group-hover:opacity-100 transition"
                        title="Delete message"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

{messages[activeChat]?.length === 0 && (
  <p className="text-gray-500 italic text-center mt-10">No messages yet. Start the conversation!</p>
)}

<div ref={bottomRef} />
            </div>
            {activeChat ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key !== 'Enter' || !input.trim()) return;
                
                  const message = {
                    listing_id: id,
                    from_user: true,
                    sender_name: user.name,
                    recipient_name: activeChat,
                    text: input.trim(),
                  };
                
                  try {
                    const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(message),
                    });
                    const saved = await res.json();
                
                    if (!saved.error) {
                      const updatedRes = await fetch(`http://localhost:5000/api/messages/grouped/${id}`);
                      const updatedMessages = await updatedRes.json();
                      setMessages(updatedMessages);
                      setInput('');
                    } else {
                      console.error('Failed to save:', saved.error);
                    }
                  } catch (err) {
                    console.error("Failed to send message:", err);
                  }
                }}                              
                placeholder="Type a message..."
                className="flex-1 border px-3 py-2 rounded-full"
              />
              <button
onClick={async () => {
  if (!input.trim()) return;

  const message = {
    listing_id: id,              // crucial: identifies which listing this message belongs to
    from_user: true,             // crucial: marks it as coming from the seller
    sender_name: user.name,
    recipient_name: activeChat,
    text: input.trim()
  };

  try {
    const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    const saved = await res.json();

    if (!saved.error) {
      const updatedRes = await fetch(`http://localhost:5000/api/messages/grouped/${id}`);
      const updatedMessages = await updatedRes.json();
      setMessages(updatedMessages);
      setInput('');
    } else {
      console.error('Failed to save:', saved.error);
    }
  } catch (err) {
    console.error("Failed to send message:", err);
  }
}}
                className="bg-uoft-blue text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
            ) : (
              <p className="text-gray-500 italic text-center mt-4">
                No interested buyers have messaged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}