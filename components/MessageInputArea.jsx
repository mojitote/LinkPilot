import React, { useState, useEffect } from 'react';

export default function MessageInputArea({ 
  currentContactId, 
  currentContact, 
  onAddContactReply, 
  onSendMessage 
}) {
  const [messageText, setMessageText] = useState('');

  // Listen for message input updates from PromptBox
  useEffect(() => {
    const handleUpdateMessageInput = (event) => {
      const { message } = event.detail;
      setMessageText(message);
    };

    window.addEventListener('updateMessageInput', handleUpdateMessageInput);
    return () => window.removeEventListener('updateMessageInput', handleUpdateMessageInput);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentContactId) return;
    
    onSendMessage(messageText.trim());
    setMessageText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!currentContact) {
    return (
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-gray-400 text-center text-sm">
          Select a contact to start messaging
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Message to {currentContact.name}
          </span>
        </div>
        <button
          onClick={onAddContactReply}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          title="Add contact reply"
        >
          + Add Reply
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type your message to ${currentContact.name}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            disabled={!currentContactId}
          />
        </div>
        <button
          type="submit"
          disabled={!messageText.trim() || !currentContactId}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Send
        </button>
      </form>
      
      <div className="mt-2 text-xs text-gray-500">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
} 