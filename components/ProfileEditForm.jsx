import React, { useState } from 'react';

export default function ProfileEditForm({ initialValues, onSave, onCancel, mode = 'user' }) {
  const [form, setForm] = useState({ ...initialValues });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.headline) {
      setError('Name and Headline are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Headline *</label>
          <input
            name="headline"
            value={form.headline || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
        <input
          name="avatarUrl"
          value={form.avatarUrl || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
        <textarea
          name="about"
          value={form.about || ''}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Positions</label>
          <input
            value={form.experience?.positions?.join(', ') || ''}
            onChange={e => handleNestedChange('experience', 'positions', e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Software Engineer, Product Manager"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Institutions</label>
          <input
            value={form.experience?.institutions?.join(', ') || ''}
            onChange={e => handleNestedChange('experience', 'institutions', e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Google, Microsoft"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Dates</label>
          <input
            value={form.experience?.dates?.join(', ') || ''}
            onChange={e => handleNestedChange('experience', 'dates', e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 2020-2022, 2018-2020"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Education Positions</label>
          <input
            value={form.education?.positions?.join(', ') || ''}
            onChange={e => handleNestedChange('education', 'positions', e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Bachelor, Master"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Education Institutions</label>
          <input
            value={form.education?.institutions?.join(', ') || ''}
            onChange={e => handleNestedChange('education', 'institutions', e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. MIT, Stanford"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Education Dates</label>
          <input
            value={form.education?.dates?.join(', ') || ''}
            onChange={e => handleNestedChange('education', 'dates', e.target.value.split(',').map(s => s.trim()))}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 2015-2019, 2019-2021"
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
} 