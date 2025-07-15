import React from 'react';
import { signIn } from 'next-auth/react';

export default function SignInModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative border border-blue-100">
        {/* Logo & Close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 select-none">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow">LP</div>
            <span className="text-xl font-extrabold text-blue-900 tracking-tight">LinkPilot</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close sign in modal"
          >
            ×
          </button>
        </div>
        {/* Welcome message */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm">Welcome back! Sign in to continue.</p>
        </div>
        {/* Sign in buttons */}
        <div className="space-y-4">
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm font-semibold text-base gap-2"
          >
    <svg
      className="w-6 h-6 mr-2"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
          c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,
          7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,
          4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,
          20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,
          18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
          C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
          C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,
          5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,
          2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,
          0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,
          43.862,21.35,43.611,20.083z"
      />
    </svg>            <span>Sign in with Google</span>
          </button>
          {/* 分隔线 */}
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-xs font-semibold">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            onClick={() => signIn('github')}
            className="w-full flex items-center justify-center bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow font-semibold text-base gap-2"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>Sign in with GitHub</span>
          </button>
        </div>
        {/* 辅助信息 */}
        <div className="mt-8 text-center text-xs text-gray-400">
          By signing in, you agree to our <a href="#" className="underline hover:text-blue-600">Terms of Service</a> and <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
} 