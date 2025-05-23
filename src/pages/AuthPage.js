import React, { useState } from 'react';
import Logo from '../components/Logo';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    program: '',
    year: '',
  });

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const termsContent = `Welcome to UofT Housing!

  By using this platform, you agree to the following Terms of Service:
  
  1. Eligibility  
  You must be a current student at the University of Toronto with a valid @mail.utoronto.ca email address.
  
  2. User Conduct  
  You agree to:
  - Only post accurate and truthful listings.
  - Avoid spam, offensive content, or inappropriate language.
  - Treat other users with respect and courtesy.
  - Not impersonate others or misrepresent your identity.
  
  3. Listings  
  - Listings must be real and relevant to UofT students (sublets, furniture, housing, roommates, etc.).
  - Listings deemed fraudulent, irrelevant, or inappropriate may be removed without notice.
  
  4. Account Responsibility  
  You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.
  
  5. Platform Usage  
  - Do not misuse the site by attempting to disrupt service or access data not intended for you.
  - We reserve the right to suspend or remove users who violate these terms.
  
  6. Changes  
  We may update these terms periodically. Significant changes will be communicated to users.
  
  7. Liability  
  UofT Housing is a student-run platform. We are not responsible for disputes between users or for the condition, safety, or legality of any item or property listed.
  
  Thank you for helping keep this platform safe and respectful for all users!`;  

  const privacyContent = `UofT Housing Privacy Policy

  Your privacy matters to us. Here's how we handle your information:
  
  1. Information We Collect  
  When you register or use the platform, we collect:
  - Your name, UofT email, program, and graduation year.
  - Any information you include in listings or messages.
  
  2. How We Use Your Information  
  We use your data to:
  - Display your listings to other users.
  - Allow communication between users via chat.
  
  3. Data Sharing  
  - We do not sell, rent, or share your personal data with third parties.
  - Your listings and name may be visible to other users, but your email is never publicly shown.
  
  4. Security  
  We take reasonable measures to protect your data from unauthorized access. However, no system is completely secure.
  
  5. Cookies & Local Storage  
  We may use cookies or local storage to keep you signed in and save your preferences.
  
  6. Your Rights  
  - You may update or delete your account at any time.
  - You may contact us to request removal of your data from the system.
  
  7. Changes  
  We may update this policy occasionally. We'll notify you of significant changes.
  
  By using this platform, you agree to the terms outlined in this privacy policy.`;  
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password } = form;
  
    const endpoint = tab === 'signup'
      ? `${API_BASE_URL}/api/register`
      : `${API_BASE_URL}/api/login`;
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.error || 'Something went wrong');
      } else {
        if (tab === 'signup') {
          alert('Account created! Please check your email and verify your account before logging in.');
          setTab('signin'); // Switch to Sign In tab
        } else {
          // Successful login
          localStorage.setItem('token', data.token);
          const savedUser = {
            email: data.user?.email || form.email,
            name: data.user?.name || form.name || 'Unnamed User',
            avatar: data.user?.avatar || '/default-avatar.png',
            program: data.user?.program || form.program || '',
            year: data.user?.year || form.year || ''
          };
          localStorage.setItem('user', JSON.stringify(savedUser));
          alert('Signed in!');
          navigate('/listings');
        }
      }      
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };  

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans flex flex-col items-center justify-center px-4 py-12 md:py-20 relative">
      {/* Logo */}
      <div className="absolute -top-5 left-5">
        <Logo />
      </div>

      {/* Back to Home */}
      <div className="absolute top-12 right-14">
        <Link to="/" className="flex items-center text-sm text-gray-800 hover:text-uoft-blue transition">
          <ArrowLeft className="mr-1" size={18} />
          Back to Home
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-lg md:text-xl font-medium text-center text-uoft-blue">Welcome to UofT Housing</h1>
        <p className="text-sm text-center text-gray-500 mb-4">Sign in or create an account to get started</p>

        {/* Tabs */}
        <div className="flex bg-[#f1f5f9] p-1 rounded-full mb-6 shadow-inner">
          <button
            className={`w-1/2 py-2 rounded-full text-sm font-medium transition-all ${
              tab === 'signin'
                ? 'bg-white shadow text-[#111827]'
                : 'text-gray-500'
            }`}
            onClick={() => setTab('signin')}
          >
            Sign In
          </button>

          <button
            className={`w-1/2 py-2 rounded-full text-sm font-medium transition-all ${
              tab === 'signup'
                ? 'bg-white shadow text-[#111827]'
                : 'text-gray-500'
            }`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div
            className={`transition-all duration-300 ease-in-out ${
              tab === 'signup' ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              required={tab === 'signup'}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              UofT Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                name="email"
                pattern=".+@mail\.utoronto\.ca"
                onChange={handleChange}
                placeholder="your.name@mail.utoronto.ca"
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              />
            </div>
            {tab === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">You must use your @mail.utoronto.ca email to register</p>
            )}
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              tab === 'signup' ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-700">Program <span className="text-red-500">*</span></label>
                <input
                  name="program"
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                  placeholder="e.g. Computer Science"
                  required={tab === 'signup'}
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-700">Graduation Year <span className="text-red-500">*</span></label>
                <select
                  name="year"
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                  required={tab === 'signup'}
                >
                  <option value="">Select year</option>
                  {[2025, 2026, 2027, 2028, 2029, 2030, 2031].map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            {tab === 'signin' && (
              <span
                className="text-xs text-uoft-blue hover:underline cursor-pointer"
                onClick={() => setShowResetModal(true)}
              >
                Forgot password?
              </span>
            )}
          </div>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            required
          />

          {tab === 'signup' && (
            <div className={`transition-all duration-300 ease-in-out ${tab === 'signup' ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                required={tab === 'signup'}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-3 rounded-md text-sm font-medium text-white bg-uoft-blue hover:bg-blue-900"
          >
            {tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          {tab === 'signup' && (
            <p className="text-xs text-center text-gray-500 mt-3">
              By signing up, you agree to our{' '}
              <span
                className="text-uoft-blue hover:underline cursor-pointer"
                onClick={() => setShowTerms(true)}
              >
                Terms of Service
              </span> and{' '}
              <span
                className="text-uoft-blue hover:underline cursor-pointer"
                onClick={() => setShowPrivacy(true)}
              >
                Privacy Policy
              </span>.
            </p>
          )}
        </form>
      </div>
      {showTerms && (
        <Modal
          title="Terms of Service"
          content={termsContent}
          onClose={() => setShowTerms(false)}
        />
      )}

      {showPrivacy && (
        <Modal
          title="Privacy Policy"
          content={privacyContent}
          onClose={() => setShowPrivacy(false)}
        />
      )}

      {showResetModal && (
        <Modal
          title="Reset Password"
          content={
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Enter your UofT email and we’ll send you a reset link.</p>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="your.name@mail.utoronto.ca"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button
                className="w-full py-2 text-white bg-uoft-blue rounded-md text-sm hover:bg-blue-900"
                onClick={async () => {
                  if (!resetEmail.endsWith('@mail.utoronto.ca')) {
                    alert('Please enter a valid @mail.utoronto.ca email');
                    return;
                  }

                  const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: resetEmail })
                  });

                  const data = await res.json();
                  if (!res.ok) {
                    alert(data.error || 'Something went wrong');
                  } else {
                    alert('Reset link sent! Check your email.');
                    setShowResetModal(false);
                    setResetEmail('');
                  }
                }}
              >
                Send Reset Link
              </button>
            </div>
          }
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
