'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import ProfileSetupModal from '../components/ProfileSetupModal';
import SignInModal from '../components/SignInModal';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userProfile, setUserProfile, setLoading } = useChatStore();
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [error, setError] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Redirect to chat if user has profile
  useEffect(() => {
    console.log('🔍 Home page useEffect - Status:', status, 'Session:', session, 'UserProfile:', userProfile);
    
    // Only redirect if we're on the home page
    if (session && userProfile && window.location.pathname === '/') {
      console.log('🚀 Home page: User has profile, redirecting to chat');
      router.push('/chat');
    } else if (session && !userProfile && window.location.pathname === '/') {
      console.log('📥 Home page: User logged in but no profile, fetching profile');
      // Try to fetch user profile from database
      fetchUserProfile();
    }
    // Don't redirect unauthenticated users - let them use the sample data feature
  }, [session, userProfile, router]);

  const fetchUserProfile = async () => {
    console.log('Fetching user profile...');
    try {
      const response = await fetch('/api/user/profile');
      console.log('Profile response status:', response.status);
      
      if (response.ok) {
        const profile = await response.json();
        console.log('Profile data:', profile);
        
        if (profile) {
          console.log('Profile found, setting user profile and redirecting to chat');
          setUserProfile(profile);
          router.push('/chat');
          return;
        }
      }
      // If no profile found, show setup
      console.log('No profile found, showing setup');
      setShowProfileSetup(true);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setShowProfileSetup(true);
    }
  };

  const handleProfileSaved = (profileData) => {
    setUserProfile(profileData);
    router.push('/chat');
  };

  const handleExploreWithSampleData = async () => {
    try {
      console.log('🎯 Starting handleExploreWithSampleData...');
      
      // 先重置 store，避免重复数据
      useChatStore.getState().reset();
      
      // 从数据库获取示例数据
      const response = await fetch('/api/user/sample-data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sample data: ${response.status}`);
      }
      
      const { userProfile, contacts, messages } = await response.json();
      
      console.log('📊 Sample data from database:', { userProfile, contacts, messages });
      
      // 设置用户资料
      if (userProfile) {
        console.log('👤 Setting user profile from database:', userProfile);
        setUserProfile(userProfile);
      }
      
      // 添加联系人
      if (contacts && contacts.length > 0) {
        contacts.forEach(contact => {
          console.log('Adding contact from database:', contact);
          useChatStore.getState().addContact(contact);
        });
      }
      
      // 添加消息
      if (messages) {
        Object.entries(messages).forEach(([contactId, messageList]) => {
          messageList.forEach(message => {
            console.log('Adding message from database:', message);
            useChatStore.getState().pushMessage(contactId, {
              role: message.role,
              content: message.content,
              createdAt: new Date(message.createdAt)
            });
          });
        });
      }
      
      console.log('✅ Sample data loaded successfully, redirecting to chat...');
      
      // 直接跳转，不使用 setTimeout
      router.push('/chat');
    } catch (error) {
      console.error('Error loading sample data from database:', error);
      
      // 如果数据库加载失败，显示错误信息
      alert('Failed to load sample data. Please make sure the database is properly initialized.');
      
      // 仍然跳转到聊天页面，让用户看到空状态
      router.push('/chat');
    }
  };

  // Main return with conditional rendering
  return (
    <>
      {status === 'loading' ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : session && showProfileSetup ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">LP</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-lg text-gray-600">
                Let's set up your profile to get started with LinkPilot
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Set Up Your Profile
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Enter your LinkedIn profile URL to automatically fetch your public information, 
                  or create your profile manually.
                </p>

                <div>
                  <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    id="linkedin-url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Start Setup</span>
                  </button>
                  
                  <button
                    onClick={handleExploreWithSampleData}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try Sample Data
                  </button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">What we'll fetch:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your name and headline</li>
                    <li>• Profile picture</li>
                    <li>• About section</li>
                    <li>• Work experience</li>
                    <li>• Education background</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* Logo */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">LP</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LinkPilot
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Streamline your LinkedIn networking workflow. Generate AI-powered connection messages in seconds, 
                not hours. Build meaningful professional relationships faster.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Scraping</h3>
                  <p className="text-gray-600">Automatically extract LinkedIn profile data with our intelligent scraper</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Messages</h3>
                  <p className="text-gray-600">Generate personalized connection requests using advanced AI</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
                  <p className="text-gray-600">Reduce networking time from hours to minutes</p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Networking?
                </h2>
                <p className="text-gray-600 mb-8">
                  Join thousands of professionals who are already using LinkPilot to build better connections.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  💡 Try the demo with sample data to see how it works!
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    Get Started with Sign In
                  </button>
                  <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
                  
                  <button
                    onClick={handleExploreWithSampleData}
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    Explore with Sample Data
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">Profiles Scraped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
                  <div className="text-gray-600">Messages Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center py-8 text-gray-500">
            <p>Built with Next.js, AI, and ❤️ for better networking</p>
          </div>
        </div>
      )}

      {/* Profile Setup Modal - rendered at root level */}
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileSaved={handleProfileSaved}
        linkedinUrl={linkedinUrl}
        onLinkedinUrlChange={setLinkedinUrl}
      />
    </>
  );
}
