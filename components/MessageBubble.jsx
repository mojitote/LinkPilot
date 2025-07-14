// MessageBubble.jsx
// Chat bubble for AI or user message

import React from 'react';

export default function MessageBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-line break-words
          ${isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'}`}
      >
        {message.content}
      </div>
    </div>
  );
} 