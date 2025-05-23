import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifiedRedirectPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get('token');
    const user = {
      name: params.get('name'),
      email: params.get('email'),
      avatar: params.get('avatar'),
      program: params.get('program'),
      year: params.get('year')
    };

    if (token && user.email) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/listings');
    }
  }, [navigate, location.search]);

  return (
    <div className="text-center mt-20 text-gray-600">
      Verifying your email... redirecting shortly.
    </div>
  );
}
