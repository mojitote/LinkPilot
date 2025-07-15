import React from 'react';
import { signIn } from 'next-auth/react';

export default function SignInModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-800">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close sign in modal"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path d="M44.5 20H24v8.5h11.7C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.2 4.5 29.3 2.5 24 2.5c-7.2 0-13 5.8-13 13 0 2.1.5 4.1 1.3 5.7z" fill="#FFC107"/><path d="M6.3 14.7l7 5.1C15.1 17.1 19.2 14 24 14c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.2 4.5 29.3 2.5 24 2.5c-7.2 0-13 5.8-13 13 0 2.1.5 4.1 1.3 5.7z" fill="#FF3D00"/><path d="M24 43.5c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.7 34.9 27 36 24 36c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.2 39.2 14.9 43.5 24 43.5z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.1 41.1 19.2 44 24 44c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.7 34.9 27 36 24 36c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.2 39.2 14.9 43.5 24 43.5z" fill="#1976D2"/></g></svg>
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
} 