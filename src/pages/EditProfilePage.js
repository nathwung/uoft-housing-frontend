import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    program: '',
    year: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setForm({
        name: storedUser.name || '',
        program: storedUser.program || '',
        year: storedUser.year || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    const prevUser = JSON.parse(localStorage.getItem('user'));
  
    const updatedUser = {
      ...prevUser,
      ...form,
      original_name: prevUser.name,  // Send old name
      avatar: '/default-avatar.png'
    };
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Profile updated!');
        navigate('/listings');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong');
    }
  };  

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-[#f0f4fa] to-[#e4e9f1] flex items-center justify-center p-6"
    >
        <button
            onClick={() => navigate('/listings')}
            className="absolute top-8 left-6 flex items-center text-sm text-uoft-blue hover:underline"
            >
            <ArrowLeft size={18} className="mr-1" />
            Back to Listings
        </button>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-center text-uoft-blue mb-4">Edit Your Profile</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Program</label>
            <input
              name="program"
              value={form.program}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              placeholder="e.g. Computer Science"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Graduation Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              required
            >
              <option value="">Select year</option>
              {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md text-sm font-medium text-white bg-uoft-blue hover:bg-blue-900"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}
