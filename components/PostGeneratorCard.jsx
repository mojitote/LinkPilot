// PostGeneratorCard.jsx
// Placeholder card for future post generator feature

import React from 'react';

export default function PostGeneratorCard() {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.alert('Coming soon');
    }
  };
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="text-blue-900 font-semibold text-lg">Post Generator</div>
        <div className="text-blue-700 text-sm">Coming Soon: AI-powered LinkedIn post ideas</div>
      </div>
      <button
        className="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-300 disabled:opacity-60"
        onClick={handleClick}
        disabled
      >
        Coming Soon
      </button>
    </div>
  );
} 