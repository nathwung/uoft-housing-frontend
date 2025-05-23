import React, { useEffect } from 'react';

export default function Modal({ title, content, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="text-sm text-gray-700 max-h-80 overflow-y-auto whitespace-pre-wrap space-y-3 leading-relaxed">
          {content}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          ×
        </button>

        {/* Optional Bottom Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
