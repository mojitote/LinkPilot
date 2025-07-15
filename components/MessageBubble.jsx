// MessageBubble.jsx
// Chat bubble for AI or user message

import React, { useState } from 'react';

export default function MessageBubble({ message, isUser, avatarUrl, contactAvatarUrl, showAvatar, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle save edit
  const handleSave = () => {
    if (editValue.trim() && editValue !== message.content) {
      onEdit && onEdit(editValue);
    }
    setEditing(false);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditValue(message.content);
    setEditing(false);
  };

  // Handle delete
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete && onDelete();
  };

  return (
    <div
      className={`flex flex-col items-start mb-2 group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar on top, only show if showAvatar is true */}
      {showAvatar && (
        <img
          src={(isUser ? avatarUrl : contactAvatarUrl) || '/default-avatar.png'}
          alt={isUser ? 'My Avatar' : 'Contact Avatar'}
          className={`w-12 h-12 rounded-full object-cover mb-1 ${isUser ? 'ring-2 ring-blue-500 border-white' : 'ring-2 ring-green-500 border-white'}`}
        />
      )}
      <div className="relative flex">
        {/* Action buttons: only show on hover and not editing */}
        {!editing && (
          <>
            {/* Edit button：右侧顶端 */}
            <button
              className={`absolute top-0 -right-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-blue-100 shadow border border-gray-200 transition z-10 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-label="Edit message"
              tabIndex={hovered ? 0 : -1}
              onClick={() => setEditing(true)}
            >
              {/* Pencil icon */}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0L7.586 14.414a2 2 0 000 2.828l.586.586a2 2 0 002.828 0L15 13" />
              </svg>
            </button>
            {/* Delete button：右下角 */}
            <button
              className={`absolute -bottom-3 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-red-100 shadow border border-gray-200 transition z-10 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-label="Delete message"
              tabIndex={hovered ? 0 : -1}
              style={{transform: 'translateY(50%)'}} // 让按钮更贴近气泡下边缘
              onClick={() => setShowDeleteConfirm(true)}
            >
              {/* Trash icon */}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
              </svg>
            </button>
          </>
        )}
        {/* Bubble content or edit mode */}
        <div
          className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-line break-words relative
            ${isUser ? 'bg-blue-600 text-white rounded-tl-md' : 'bg-gray-100 text-gray-900 rounded-tl-md'} ml-2`}
        >
          {editing ? (
            <div>
              <textarea
                className="w-full min-h-[48px] rounded-lg border border-gray-300 px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  onClick={handleSave}
                >Save</button>
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  onClick={handleCancel}
                >Cancel</button>
              </div>
            </div>
          ) : (
            message.content
          )}
        </div>
        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs mx-4">
              <div className="text-lg font-bold text-gray-800 mb-4">Delete Message</div>
              <div className="text-gray-600 mb-6">Are you sure you want to delete this message?</div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  onClick={handleDelete}
                >Delete</button>
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  onClick={() => setShowDeleteConfirm(false)}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 