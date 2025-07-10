import React from "react";

// Modal to display generated message
export default function MessageModal({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <p>{message}</p>
      </div>
    </div>
  );
} 