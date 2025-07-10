import React, { useState } from "react";

export default function AddContactForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  // Handle LinkedIn profile fetch
  async function handleFetch(e) {
    e.preventDefault();
    setError("");
    setProfile(null);
    setSaveStatus("");
    if (!url.trim()) {
      setError("Please enter a LinkedIn profile URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to fetch profile.");
      const data = await res.json();
      if (!data.name) throw new Error("Could not extract profile info.");
      setProfile(data);
    } catch (err) {
      setError(err.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  // Handle save contact
  async function handleSave() {
    setSaveStatus("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, linkedinUrl: url }),
      });
      if (!res.ok) throw new Error("Failed to save contact.");
      setSaveStatus("Contact saved!");
    } catch (err) {
      setError(err.message || "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleFetch} className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Add LinkedIn Contact</h2>
      <label htmlFor="linkedin-url" className="block text-gray-700 font-medium mb-1">
        LinkedIn Profile URL
      </label>
      <input
        id="linkedin-url"
        type="url"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
        placeholder="https://www.linkedin.com/in/username"
        value={url}
        onChange={e => setUrl(e.target.value)}
        required
        disabled={loading}
      />
      <button
        type="submit"
        className="w-full bg-[#0A66C2] text-white px-4 py-2 rounded hover:bg-[#004182] font-medium transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Profile"}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {profile && (
        <div className="mt-6 p-4 bg-gray-50 rounded shadow-sm flex flex-col items-center">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full mb-2 border"
            />
          )}
        <div className="text-lg font-bold text-gray-900">{profile.name}</div>
          <div className="text-gray-700">{profile.title}</div>
          <div className="text-gray-500">{profile.company}</div>
          <button
            type="button"
            className="mt-4 bg-[#0A66C2] text-white px-4 py-2 rounded hover:bg-[#004182] font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Contact"}
          </button>
          {saveStatus && <div className="text-green-600 text-sm mt-2">{saveStatus}</div>}
        </div>
      )}
    </form>
  );
} 