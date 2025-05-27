import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, DollarSign, Info, UploadCloud } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInMonths } from 'date-fns';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

const user = JSON.parse(localStorage.getItem('user') || '{}');

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    negotiable: false,
    description: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    amenities: '',
    images: [],
    roommatePreference: '',
    startDate: null,
    endDate: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'file') {
      const selectedFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedFiles],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const base64Images = await Promise.all(formData.images.map(fileToBase64));
  
    const sanitizeNumber = (value) => {
      const num = Number(value);
      return isNaN(num) ? null : num;
    };
  
    // Geocode the location using OpenStreetMap Nominatim
    let lat = null;
    let lng = null;
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      }
    } catch (error) {
      console.error('Geocoding failed', error);
    }
  
    // Create listing with lat/lng added
    const newListing = {
      ...formData,
      price: sanitizeNumber(formData.price),
      bedrooms: sanitizeNumber(formData.bedrooms),
      bathrooms: sanitizeNumber(formData.bathrooms),
      images: base64Images,
      amenities: formData.amenities
        ? formData.amenities.split(',').map(a => a.trim())
        : [],
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      roommatePreference: formData.roommatePreference || "",
      lat,
      lng,
      poster: {
        name: user.name,
        email: user.email,
        avatar: user.avatar || '/default-avatar.png',
        program: user.program,
        year: user.year,
      }
    };

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    await fetch(`${API_BASE_URL}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newListing)
    });
  
    navigate("/listings");
  };    

  const handleCancel = () => navigate('/listings');

  const showHousingFields = ['Roommates', 'Sublet', 'Long-Term Housing'].includes(formData.type);
  const showRoommatePreference = formData.type === 'Roommates';

  const requiredLabel = (text, tooltip) => (
    <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">
      <span>{text} <span className="text-red-500">*</span></span>
      {tooltip && <Info size={14} title={tooltip} className="text-gray-400" />}
    </label>
  );

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const months = differenceInMonths(formData.endDate, formData.startDate) + 1;
      return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : null;
    }
    return null;
  };

  const locationPlaceholder = formData.type === 'Furniture Market'
    ? 'e.g. Chest of drawers, desk chair, mini fridge...'
    : 'e.g. Harbord & Spadina';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4fa] to-[#e4e9f1] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-blue-200">
        <h2 className="text-4xl font-bold text-uoft-blue flex items-center gap-3 mb-10">
          <PlusCircle className="text-uoft-blue" size={34} />
          <span className="tracking-tight">Create New Listing</span>
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
          <div className="col-span-2">
            {requiredLabel("Listing Title")}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Give your listing a clear and compelling title"
            />
          </div>

          <div>
            {requiredLabel("Select Type")}
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
            >
              <option value="">Choose type...</option>
              <option>Roommates</option>
              <option>Sublet</option>
              <option>Furniture Market</option>
              <option>Long-Term Housing</option>
            </select>
          </div>

          <div>
            {requiredLabel(`Price ${showHousingFields ? '/month' : ''}`)}
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <DollarSign size={16} />
              </span>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="text"
                required
                pattern="\d*"
                inputMode="numeric"
                className="pl-9 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="col-span-2">
            {requiredLabel("Location")}
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <MapPin size={16} />
              </span>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="pl-9 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                placeholder={locationPlaceholder}
              />
            </div>
          </div>

          {formData.type === 'Sublet' && (
            <>
              <div>
                {requiredLabel("From (Start Date)")}
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                {requiredLabel("To (End Date)")}
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholderText="Select end date"
                />
              </div>
              {calculateDuration() && (
                <div className="col-span-2 text-sm text-blue-700 font-medium">
                  Duration: {calculateDuration()}
                </div>
              )}
            </>
          )}

          <div className="col-span-2">
            {requiredLabel("Description")}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
              placeholder="Describe the place, furniture, or other relevant details..."
            />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="negotiable"
              checked={formData.negotiable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700 font-medium">Price is negotiable</label>
          </div>

          {showHousingFields && (
            <>
              <div>
                {requiredLabel("Bedrooms")}
                <input
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  type="number"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                {requiredLabel("Bathrooms")}
                <input
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  type="number"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="e.g. 2"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label className="text-sm text-gray-700 font-medium">Furnished</label>
              </div>
              <div className="col-span-2">
                {requiredLabel("Amenities (comma-separated)")}
                <input
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                  placeholder="Wi-Fi, Utilities, Laundry, Balcony, Kitchen,..."
                />
              </div>
            </>
          )}

          {showRoommatePreference && (
            <div className="col-span-2">
              {requiredLabel("Roommate Gender Preference")}
              <select
                name="roommatePreference"
                value={formData.roommatePreference}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
              >
                <option value="">No preference</option>
                <option value="Female only">Female only</option>
                <option value="Male only">Male only</option>
              </select>
            </div>
          )}

          <div className="col-span-2">
            {requiredLabel("Upload Images")}
            <label className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 text-gray-600 text-sm font-medium flex items-center justify-between">
              <span>Choose Files</span>
              <UploadCloud size={18} className="text-gray-400" />
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                required
                className="hidden"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...Array.from(e.target.files)],
                  }))
                }
            />
            </label>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-gray-300 shadow-md bg-white"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="text-center text-xs text-gray-700 px-2 py-1 truncate">
                      {img.name}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm transition-opacity opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 mt-8 flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#2563eb] hover:bg-[#1e50c2] text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-3 text-lg"
            >
              <span className="text-2xl font-bold">+</span>
              Post Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
