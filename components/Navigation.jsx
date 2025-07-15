'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import SignInModal from './SignInModal';
import { useChatStore } from '../store/chatStore';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { userProfile } = useChatStore();
  const router = useRouter();

  // Determine avatar URL: prefer userProfile.avatarUrl, fallback to session.user.image
  const avatarUrl = userProfile?.avatarUrl || session?.user?.image;

  return (
    <nav className="bg-white border-b border-gray-200 px-0 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center space-x-3 select-none pl-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow">LP</div>
          <span className="text-2xl font-extrabold text-blue-900 tracking-tight">LinkPilot</span>
        </div>
        {/* Navigation Links: right-aligned */}
        <div className="flex-1 flex justify-end items-center space-x-2 md:space-x-6 pr-6">
          {/* Chat Link */}
          <button
            onClick={() => {
              if (!session?.user) {
                setShowSignInModal(true);
              } else {
                router.push('/chat');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-700 hover:text-white hover:bg-blue-600 transition font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07A1 1 0 013 19.13l1.07-4.28A9.77 9.77 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span>Chat</span>
          </button>
          {/* Post Link */}
          <button
            onClick={() => alert('developing')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-700 hover:text-white hover:bg-blue-600 transition font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
            <span>Post</span>
          </button>
          {/* Avatar and Settings */}
          {session?.user ? (
            <div className="flex items-center space-x-3 ml-4">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500 border-white shadow"
                />
              )}
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center justify-center px-3 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="Settings"
              >
                {/* Modern minimal gear icon */}
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                <span className="ml-2 text-gray-500 text-base font-medium">Setting</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSignInModal(true)}
              className="ml-4 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-lg shadow"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      {showSignInModal && (
        <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
      )}
    </nav>
  );
} 