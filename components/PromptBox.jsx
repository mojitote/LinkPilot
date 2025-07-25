// PromptBox.jsx
// Bottom input area for prompt + Generate button + prompt chips + message editing

import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';

const staticPrompts = [
  'Friendly',
  'Professional',
  'Short & Sweet',
  'Mutual Interests',
];

export default function PromptBox({ disabled }) {
  const [prompt, setPrompt] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  // Remove handleRevert and showRevertButton logic
  
  const currentContactId = useChatStore(s => s.currentContactId);
  const contacts = useChatStore(s => s.contacts);
  const userProfile = useChatStore(s => s.userProfile);
  const addMessage = useChatStore(s => s.addMessage);
  const inputDrafts = useChatStore(s => s.inputDrafts);

  // Listen for AI suggestion updates
  useEffect(() => {
    const handleUpdateAISuggestion = (event) => {
      const { message } = event.detail;
      setGeneratedText(message);
      // setShowRevertButton(true); // This line is removed
    };

    window.addEventListener('updateAISuggestion', handleUpdateAISuggestion);
    return () => window.removeEventListener('updateAISuggestion', handleUpdateAISuggestion);
  }, []);

  const handleChipClick = (chip) => {
    setSelectedPrompt(chip);
    setPrompt(chip);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove the check for message history, always allow generation
    const currentContact = contacts.find(c => c.linkedin_id === currentContactId);
    if (!currentContact || !userProfile) {
      console.error('Missing contact or user profile');
      return;
    }
    setLoading(true);
    try {
      setOriginalText(inputDrafts[currentContactId] || '');
      const response = await fetch('/api/message/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: currentContact.linkedin_id,
          context: {
            contactName: currentContact.name,
            contactHeadline: currentContact.headline,
            contactCompany: currentContact.company,
            contactAbout: currentContact.about,
            userName: userProfile.name,
            userHeadline: userProfile.headline,
            userAbout: userProfile.about,
            sharedBackground: currentContact.shared || '',
            requestType: 'connection',
            tone: prompt || selectedPrompt || 'professional'
          }
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGeneratedText(data.data.message);
          // setShowRevertButton(true); // This line is removed
          window.dispatchEvent(new CustomEvent('updateMessageInput', { 
            detail: { message: data.data.message } 
          }));
        } else {
          console.error('Generation failed:', data.error);
        }
      } else {
        console.error('Generation request failed:', response.status);
      }
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setLoading(false);
      setPrompt('');
      setSelectedPrompt('');
    }
  };

  // Remove handleRevert and showRevertButton logic

  const handleDiscard = () => {
    // Restore to pre-generate text in message input
    window.dispatchEvent(new CustomEvent('updateMessageInput', { 
      detail: { message: originalText } 
    }));
    setGeneratedText('');
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Prompt Input Section */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Type your prompt or select a suggestion..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={disabled || loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={disabled || loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {/* Remove Revert Button UI */}
        <div className="flex space-x-2 mt-1">
          {staticPrompts.map((chip, idx) => (
            <button
              key={chip}
              type="button"
              className={`px-3 py-1 rounded-full border text-sm transition
                ${selectedPrompt === chip ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
              onClick={() => handleChipClick(chip)}
              disabled={disabled || loading}
            >
              {chip}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
} 