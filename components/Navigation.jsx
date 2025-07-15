'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import SignInModal from './SignInModal';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LP</span>
          {/* 
            When the user clicks on the logo or the "LinkPilot" text, navigate to the home page.
            This uses Next.js's useRouter for client-side navigation.
          */}
          </div>
          <span
            className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={() => {
              // Navigate to the home page when clicked
              window.location.href = '/';
            }}
            tabIndex={0}
            role="button"
            aria-label="Go to homepage"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = '/';
              }
            }}
          >
            LinkPilot
          </span>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <button
                onClick={() => window.location.href = '/settings'}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowSignInModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
              <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 