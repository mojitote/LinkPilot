import React from "react";

// Card to display contact information
export default function ContactCard({ contact }) {
  return (
    <div className="contact-card">
      {/* Display contact details here */}
      <h2>{contact?.name}</h2>
      <p>{contact?.title} at {contact?.company}</p>
    </div>
  );
} 