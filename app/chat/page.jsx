'use client';

import { useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '../../store/chatStore';
import ContactCard from '../../components/ContactCard';
import AddContactForm from '../../components/AddContactForm';
import MessageBubble from '../../components/MessageBubble';
import PromptBox from '../../components/PromptBox';
import PostGeneratorCard from '../../components/PostGeneratorCard';
import MessageInputArea from '../../components/MessageInputArea';
import AddContactReplyModal from '../../components/AddContactReplyModal';
import ProfileSetupModal from '../../components/ProfileSetupModal';
import ProfileEditForm from '../../components/ProfileEditForm';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { contacts, currentContactId, messages, setCurrentContact, setUserProfile, userProfile, pushMessage, setMessages, setContacts } = useChatStore();
  
  // State for contact reply modal
  const [isAddReplyModalOpen, setIsAddReplyModalOpen] = useState(false);
  const [selectedMessageForReply, setSelectedMessageForReply] = useState(null);
  
  // State for profile setup flow
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [scrapedProfileData, setScrapedProfileData] = useState(null);

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    console.log('🔍 Chat page auth check - Status:', status, 'Session:', session);
    
    // Only redirect if status is explicitly 'unauthenticated' and not loading
    // But allow unauthenticated users if they have sample data (contacts or userProfile)
    if (status === 'unauthenticated' && status !== 'loading') {
      const { contacts, userProfile } = useChatStore.getState();
      console.log('🔍 Chat page - Contacts count:', contacts.length, 'UserProfile:', !!userProfile);
      
      if (contacts.length === 0 && !userProfile) {
        console.log('❌ User not authenticated and no sample data, redirecting to home');
        router.replace('/');
      } else {
        console.log('✅ User not authenticated but has sample data, allowing access');
      }
    }
  }, [status, router, session]);

  // Prevent navigation conflicts by checking if we're already on chat page
  useEffect(() => {
    if (window.location.pathname === '/chat') {
      console.log('Already on chat page, preventing navigation conflicts');
    }
  }, []);

  // Load user profile when session is available
  useEffect(() => {
    console.log('🔍 Chat page useEffect - Session:', session, 'UserProfile:', userProfile);
    if (session?.user && !userProfile) {
      console.log('📥 Loading user profile from API...');
      fetch('/api/user/profile', {
        credentials: 'include', // Include cookies for authentication
      })
        .then(res => res.json())
        .then(data => {
          console.log('📄 Profile API response:', data);
          if (data && data.success && data.data) {
            console.log('✅ Setting user profile from API response');
            setUserProfile(data.data);
          } else if (data && data.error && data.error.code === 'PROFILE_NOT_FOUND') {
            // No profile found, show setup modal
            console.log('📝 No user profile found, showing setup modal');
            setShowProfileSetup(true);
          } else {
            console.log('❌ Unexpected profile API response format');
            setShowProfileSetup(true);
          }
        })
        .catch(err => {
          console.log('❌ Error loading user profile:', err);
          setShowProfileSetup(true);
        });
    }
  }, [session, setUserProfile, userProfile]);

  // Load contacts when user is authenticated
  useEffect(() => {
    console.log('🔍 Chat page - Loading contacts. Session:', session, 'Contacts count:', contacts.length);
    if (session?.user && contacts.length === 0) {
      console.log('📥 Loading contacts from API...');
      fetch('/api/contact', {
        credentials: 'include', // Include cookies for authentication
      })
        .then(res => res.json())
        .then(data => {
          console.log('📄 Contacts API response:', data);
          if (data && data.success && data.data && data.data.contacts) {
            console.log('✅ Setting contacts from API response:', data.data.contacts.length, 'contacts');
            setContacts(data.data.contacts);
          } else {
            console.log('❌ No contacts found or unexpected API response format');
            setContacts([]); // Ensure contacts is always an array
          }
        })
        .catch(err => {
          console.log('❌ Error loading contacts:', err);
        });
    }
  }, [session, contacts.length]);

  // Load messages for current contact
  useEffect(() => {
    if (session?.user && currentContactId) {
      console.log('📥 Loading messages for contact:', currentContactId);
      fetch(`/api/message?contactId=${currentContactId}`, {
        credentials: 'include', // Include cookies for authentication
      })
        .then(res => res.json())
        .then(data => {
          console.log('📄 Messages API response:', data);
          if (data && data.success && data.data && data.data.messages) {
            console.log('✅ Setting messages from API response:', data.data.messages.length, 'messages');
            // Convert string createdAt to Date objects
            const messagesWithDates = data.data.messages.map(msg => ({
              ...msg,
              createdAt: typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt
            }));
            setMessages(currentContactId, messagesWithDates);
          } else {
            console.log('❌ No messages found or unexpected API response format');
            setMessages(currentContactId, []); // Ensure messages is always an array
          }
        })
        .catch(err => {
          console.log('❌ Error loading messages:', err);
          setMessages(currentContactId, []); // Set empty array on error
        });
    }
  }, [session, currentContactId, setMessages]);

  // 当前联系人消息
  const currentMessages = messages[currentContactId] || [];
  const currentContact = contacts.find(c => c.linkedin_id === currentContactId);

  // Handle adding contact reply
  const handleAddContactReply = () => {
    setIsAddReplyModalOpen(true);
  };

  // Handle submitting contact reply
  const handleSubmitContactReply = async (replyText) => {
    if (!currentContactId || !replyText.trim()) return;

    // Add the contact reply to the chat
    pushMessage(currentContactId, {
      role: 'contact', // New role for contact messages
      content: replyText
    });

    // In normal mode, save to database (not in sample mode)
    if (session?.user) {
      try {
        await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          body: JSON.stringify({
            contactId: currentContactId,
            role: 'contact',
            content: replyText
          }),
        });
      } catch (error) {
        console.error('Error saving contact reply to database:', error);
      }
    }
  };

  // Handle sending my message
  const handleSendMessage = async (messageContent) => {
    if (!currentContactId || !messageContent.trim()) return;

    // Add my message to the chat
    pushMessage(currentContactId, {
      role: 'user',
      content: messageContent
    });

    // In normal mode, save to database (not in sample mode)
    if (session?.user) {
      try {
        await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          body: JSON.stringify({
            contactId: currentContactId,
            role: 'user',
            content: messageContent
          }),
        });
      } catch (error) {
        console.error('Error saving user message to database:', error);
      }
    }
  };

  // Handle editing message
  const handleEditMessage = (idx, newContent) => {
    //copy current messages
   const updatedMessages = [...currentMessages];
   updatedMessages[idx] = {
    ...updatedMessages[idx],
    content: newContent,
  };
  setMessages(currentContactId, updatedMessages);
  };

  // Handle deleting message
  const handleDeleteMessage = (idx) => {
    const updatedMessages = currentMessages.filter((_, i) => i !== msgIdx);
    setMessages(currentContactId, updatedMessages);
  };

  // Handle profile scraping success
  const handleProfileScrapeSuccess = (data) => {
    setScrapedProfileData(data);
    setShowProfileSetup(false);
    setShowProfileEdit(true);
  };

  // Handle profile save
  const handleProfileSave = async (profileData) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Profile save error response:', errorData);
        throw new Error(`Failed to save profile: ${response.status} ${response.statusText}`);
      }
      
      const savedProfile = await response.json();
      setUserProfile(savedProfile);
      setShowProfileEdit(false);
      setScrapedProfileData(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };



  // Now we can have conditional rendering after all hooks are called
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show fallback if user is unauthenticated and has no data
  if (status === 'unauthenticated' && contacts.length === 0 && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">LP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to LinkPilot
          </h1>
          <p className="text-gray-600 mb-8">
            Please log in or explore with sample data to get started.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar: Contacts */}
      <aside className="w-80 bg-blue-50 border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-blue-900">Contacts</h2>
          <AddContactForm />
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-6 text-gray-400 text-center">No contacts yet.</div>
          ) : (
            contacts.map(contact => (
              <div
                key={contact.linkedin_id}
                onClick={() => setCurrentContact(contact.linkedin_id)}
                className={`cursor-pointer ${currentContactId === contact.linkedin_id ? 'bg-blue-100' : ''}`}
              >
                <ContactCard 
                  contact={contact} 
                  selected={currentContactId === contact.linkedin_id}
                  onContactUpdate={(updatedContact) => {
                    useChatStore.getState().updateContact(updatedContact.linkedin_id, updatedContact);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col">
        {/* Top: Contact Info Bar */}
        {currentContact && (
          <div className="flex items-center justify-end gap-4 px-6 py-4 bg-blue-50 border-b border-blue-200 min-h-[72px]">
            <div className="flex flex-col items-end justify-center">
              <span className="text-lg font-bold text-blue-900">{currentContact.name}</span>
              {currentContact.headline && (
                <span className="text-sm text-blue-700 mt-1">{currentContact.headline}</span>
              )}
            </div>
            <img
              src={currentContact.avatarUrl || '/default-avatar.png'}
              alt={currentContact.name || 'Contact Avatar'}
              className="w-14 h-14 rounded-full object-cover border-2 border-green-400 shadow-sm"
            />
          </div>
        )}
        {/* Message Pane */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {currentContact ? (
            <div className="space-y-4">
              {currentMessages.length === 0 ? (
                <div className="text-gray-400 text-center mt-12">No messages yet. Start the conversation!</div>
              ) : (
                currentMessages.map((msg, idx) => {
                  const prevMsg = currentMessages[idx - 1];
                  const showAvatar = !prevMsg || prevMsg.role !== msg.role;
                  return (
                    <MessageBubble 
                      key={`${currentContactId}-${idx}-${msg.createdAt?.getTime() || idx}`} 
                      message={msg} 
                      isUser={msg.role === 'user'} 
                      avatarUrl={userProfile?.avatarUrl || session?.user?.image}
                      contactAvatarUrl={currentContact?.avatarUrl}
                      showAvatar={showAvatar}
                      onEdit={(newContent) => handleEditMessage(idx, newContent)}
                      onDelete={() => handleDeleteMessage(idx)}
                    />
                  );
                })
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-24 text-2xl font-bold tracking-wide">
              Select a contact to start chatting.
            </div>
          )}
        </div>
        {/* Bottom: Message Input Area and Prompt Box */}
        <div className="border-t border-gray-200 bg-white">
          <MessageInputArea
            currentContactId={currentContactId}
            currentContact={currentContact}
            onAddContactReply={handleAddContactReply}
            onSendMessage={handleSendMessage}
          />
          <div className="p-4 border-t border-gray-100">
            <PromptBox disabled={!currentContact} />
          </div>
        </div>
      </section>

      {/* Add Contact Reply Modal */}
      <AddContactReplyModal
        isOpen={isAddReplyModalOpen}
        onClose={() => {
          setIsAddReplyModalOpen(false);
          setSelectedMessageForReply(null);
        }}
        contactName={currentContact?.name || 'Contact'}
        onAddReply={handleSubmitContactReply}
      />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onScrapeSuccess={handleProfileScrapeSuccess}
      />

      {/* Profile Edit Modal */}
      {showProfileEdit && scrapedProfileData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-800">Review & Edit Your Profile</h2>
              <button
                onClick={() => {
                  setShowProfileEdit(false);
                  setScrapedProfileData(null);
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <ProfileEditForm
              initialValues={scrapedProfileData}
              onSave={handleProfileSave}
              onCancel={() => {
                setShowProfileEdit(false);
                setScrapedProfileData(null);
              }}
              mode="user"
            />
          </div>
        </div>
      )}
    </div>
  );
} 