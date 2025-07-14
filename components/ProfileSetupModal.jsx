import React, { useState } from 'react';
import ProfileEditForm from './ProfileEditForm';

export default function ProfileSetupModal({ 
  isOpen, 
  onClose, 
  onProfileSaved, 
  linkedinUrl, 
  onLinkedinUrlChange 
}) {
  const [step, setStep] = useState('input'); // 'input', 'scraping', 'edit'
  const [error, setError] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  const [scrapingFailed, setScrapingFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScrapeProfile = async () => {
    if (!linkedinUrl.trim()) {
      setError('Please enter your LinkedIn profile URL');
      return;
    }

    if (!linkedinUrl.includes('linkedin.com/in/')) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }

    setError('');
    setLoading(true);
    setStep('scraping');
    setScrapingFailed(false);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkedinUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape profile');
      }

      const result = await response.json();
      
      // Check if scraping was successful
      if (result.error || !result.data) {
        setScrapingFailed(true);
        // Create empty profile data for manual input
        const emptyProfileData = {
          linkedin_id: linkedinUrl.split('/in/')[1]?.split('/')[0] || '',
          name: '',
          avatar_url: '',
          headline: '',
          about: '',
          experience: { positions: [], institutions: [], dates: [] },
          education: { positions: [], institutions: [], dates: [] }
        };
        setScrapedData(emptyProfileData);
      } else {
        setScrapedData(result.data || result);
      }
      
      setStep('edit');
    } catch (err) {
      console.error('Scraping error:', err);
      setScrapingFailed(true);
      setError('Failed to scrape profile. You can still create your profile manually.');
      
      // Create empty profile data for manual input
      const emptyProfileData = {
        linkedin_id: linkedinUrl.split('/in/')[1]?.split('/')[0] || '',
        name: '',
        avatar_url: '',
        headline: '',
        about: '',
        experience: { positions: [], institutions: [], dates: [] },
        education: { positions: [], institutions: [], dates: [] }
      };
      setScrapedData(emptyProfileData);
      setStep('edit');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (profileData) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          ...profileData,
          linkedinUrl: linkedinUrl,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Profile save error response:', errorData);
        throw new Error(`Failed to save profile: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      onProfileSaved(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setStep('input');
    setError('');
    setScrapedData(null);
    setScrapingFailed(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {step === 'input' && 'Set Up Your Profile'}
              {step === 'scraping' && 'Fetching Your Profile...'}
              {step === 'edit' && 'Review & Edit Your Profile'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Enter your LinkedIn profile URL to automatically fetch your public information, 
                  or you can create your profile manually.
                </p>
                
                <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  id="linkedin-url"
                  value={linkedinUrl}
                  onChange={(e) => onLinkedinUrlChange(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleScrapeProfile}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Fetch & Auto-Fill</span>
                </button>
                
                <button
                  onClick={() => {
                    setScrapedData({
                      linkedin_id: '',
                      name: '',
                      avatar_url: '',
                      headline: '',
                      about: '',
                      experience: { positions: [], institutions: [], dates: [] },
                      education: { positions: [], institutions: [], dates: [] }
                    });
                    setStep('edit');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create Manually
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
          )}

          {step === 'scraping' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Fetching your LinkedIn profile...
              </h3>
              <p className="text-gray-600">
                This may take a few moments. Please don't close this window.
              </p>
            </div>
          )}

          {step === 'edit' && (
            <div className="space-y-6">
              {scrapingFailed && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Scraping was not successful
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          We couldn't automatically fetch your profile data. 
                          You can still fill in your information manually below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ProfileEditForm
                initialValues={scrapedData}
                onSave={handleProfileSave}
                onCancel={handleCancel}
                mode="user"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 