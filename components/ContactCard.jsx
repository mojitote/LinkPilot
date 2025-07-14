// ContactCard.jsx
// Displays a LinkedIn contact in the sidebar with edit functionality

import React, { useState } from 'react';
import ProfileEditForm from './ProfileEditForm';

export default function ContactCard({ contact, selected, onContactUpdate }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleContactSave = async (contactData) => {
    try {
      const res = await fetch(`/api/contact/${contact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) throw new Error('Failed to update contact');
      const result = await res.json();
      onContactUpdate(result.data || result);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  return (
    <>
      <div 
        className={`flex items-center px-4 py-3 border-b border-gray-100 transition bg-white hover:bg-blue-50 relative ${selected ? 'ring-2 ring-blue-500 bg-blue-100' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={contact.avatarUrl || '/default-avatar.png'}
          alt={contact.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 mr-3"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{contact.name}</div>
          <div className="text-xs text-gray-500 truncate">{contact.headline}</div>
        </div>
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
            className="absolute right-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit contact"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

      {/* Contact Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-800">Edit Contact</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ProfileEditForm
              initialValues={contact}
              onSave={handleContactSave}
              onCancel={() => setShowEditModal(false)}
              mode="contact"
            />
          </div>
        </div>
      )}
    </>
  );
} 