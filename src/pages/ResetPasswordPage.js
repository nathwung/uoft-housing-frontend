import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Password reset successful! You can now sign in.');
        navigate('/auth');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (!token) return <div className="p-8 text-red-500">Invalid or missing token</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-center mb-4">Reset Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-3 px-3 py-2 border rounded-md text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-3 px-3 py-2 border rounded-md text-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="w-full py-2 bg-uoft-blue text-white rounded-md hover:bg-blue-900 text-sm"
          onClick={handleReset}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
