// AddContactForm.jsx
// Modal form to add a new LinkedIn contact

import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import ProfileEditForm from './ProfileEditForm';

export default function AddContactForm() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContactEdit, setShowContactEdit] = useState(false);
  const [scrapedContactData, setScrapedContactData] = useState(null);
  const [scrapingFailed, setScrapingFailed] = useState(false);
  const addContact = useChatStore(s => s.addContact);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!url.includes('linkedin.com/in/')) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }
    setLoading(true);
    setScrapingFailed(false);
    
    try {
      // Call backend to scrape contact
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to scrape contact');
      }
      
      const result = await res.json();
      
      // Check if scraping was successful
      if (result.error || !result.data) {
        setScrapingFailed(true);
        // Create empty contact data for manual input
        const emptyContactData = {
          linkedin_id: url.split('/in/')[1]?.split('/')[0] || '',
          name: '',
          avatar_url: '',
          headline: '',
          about: '',
          experience: { positions: [], institutions: [], dates: [] },
          education: { positions: [], institutions: [], dates: [] }
        };
        setScrapedContactData(emptyContactData);
      } else {
        setScrapedContactData(result.data || result);
      }
      
      setOpen(false);
      setShowContactEdit(true);
      
    } catch (err) {
      console.error('Scraping error:', err);
      setScrapingFailed(true);
      setError('Failed to scrape contact. You can still add the contact manually.');
      
      // Create empty contact data for manual input
      const emptyContactData = {
        linkedin_id: url.split('/in/')[1]?.split('/')[0] || '',
        name: '',
        avatar_url: '',
        headline: '',
        about: '',
        experience: { positions: [], institutions: [], dates: [] },
        education: { positions: [], institutions: [], dates: [] }
      };
      setScrapedContactData(emptyContactData);
      setOpen(false);
      setShowContactEdit(true);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSave = async (contactData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) throw new Error('Failed to save contact');
      const result = await res.json();
      addContact(result.data);
      setShowContactEdit(false);
      setScrapedContactData(null);
      setScrapingFailed(false);
      setUrl('');
      setError('');
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        onClick={() => setOpen(true)}
        title="Add Contact"
      >
        +Contact
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Add LinkedIn Contact</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="url"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/target-profile"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Contact'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Edit Modal */}
      {showContactEdit && scrapedContactData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-800">Review & Edit Contact</h2>
                {scrapingFailed && (
                  <p className="text-orange-600 text-sm mt-1">
                    ⚠️ Scraping failed. Please fill in the contact information manually.
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowContactEdit(false);
                  setScrapedContactData(null);
                  setScrapingFailed(false);
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ProfileEditForm
              initialValues={scrapedContactData}
              onSave={handleContactSave}
              onCancel={() => {
                setShowContactEdit(false);
                setScrapedContactData(null);
                setScrapingFailed(false);
                setError('');
              }}
              mode="contact"
            />
          </div>
        </div>
      )}
    </>
  );
} 