// AddContactReplyModal.jsx
// Modal for adding contact replies

import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';  

export default function AddContactReplyModal({ isOpen, onClose, contactName, onAddReply }) {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddReply(replyText);
      setReplyText('');
      onClose();
    } catch (error) {
      console.error('Error adding contact reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add {contactName}'s Reply
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reply-text" className="block text-sm font-medium text-gray-700 mb-2">
              {contactName}'s message:
            </label>
            <textarea
              id="reply-text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter the contact's reply..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyText.trim() || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Reply</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 