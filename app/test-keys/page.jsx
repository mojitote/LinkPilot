'use client';

import { useChatStore } from '../../store/chatStore';
import { useEffect } from 'react';

export default function TestKeysPage() {
  const { contacts, userProfile, reset, setUserProfile, addContact } = useChatStore();

  const loadSampleData = async () => {
    console.log('Loading sample data from database...');
    
    try {
      // 重置 store
      reset();
      
      // 从数据库获取示例数据
      const response = await fetch('/api/user/sample-data');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sample data: ${response.status}`);
      }
      
      const { userProfile, contacts, messages } = await response.json();
      
      console.log('Sample data from database:', { userProfile, contacts, messages });
      
      // 设置用户资料
      if (userProfile) {
        setUserProfile(userProfile);
      }
      
      // 添加联系人
      if (contacts && contacts.length > 0) {
        contacts.forEach(contact => {
          addContact(contact);
        });
      }
      
      console.log('Sample data loaded from database');
    } catch (error) {
      console.error('Error loading sample data:', error);
      alert('Failed to load sample data from database');
    }
  };

  const addDuplicateContact = () => {
    console.log('Adding duplicate contact...');
    
    const duplicateContact = {
      ownerId: 'sample-user-123',
      linkedin_id: 'sample-contact-456', // 相同的 ID
      name: 'Duplicate Contact',
      headline: 'This should not be added'
    };
    
    addContact(duplicateContact);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Key Test Page</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={loadSampleData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Load Sample Data
            </button>
            <button
              onClick={addDuplicateContact}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Add Duplicate Contact
            </button>
            <button
              onClick={reset}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Reset Store
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contacts ({contacts.length})</h2>
          <div className="space-y-2">
            {contacts.map((contact, index) => (
              <div key={contact.linkedin_id} className="bg-gray-100 p-3 rounded">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.headline}</div>
                <div className="text-xs text-gray-500">ID: {contact.linkedin_id}</div>
                <div className="text-xs text-gray-500">Index: {index}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 