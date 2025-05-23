import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Logo() {
  return (
    <Link to="/" className="block">
      <img
        src={logo}
        alt="UofT Housing Logo"
        className="h-36 md:h-40 w-auto object-contain"
      />
    </Link>
  );
}
