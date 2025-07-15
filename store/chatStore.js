import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  // State
  userProfile: null,
  contacts: [],
  currentContactId: null,
  messages: {}, // { contactId: [{ role: 'ai'|'user', content: string, createdAt: Date }] }
  loading: { scrape: false, ai: false },
  customPrompts: [], // User's custom prompts

  // Actions
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  setContacts: (contacts) => set({ contacts }),
  
  updateContact: (contactId, updatedContact) => set((state) => ({
    contacts: state.contacts.map(c => 
      c.linkedin_id === contactId ? updatedContact : c
    )
  })),
  
  addContact: (contact) => {
    const { contacts } = get();
    
    // Check if contact already exists
    const existingContact = contacts.find(c => c.linkedin_id === contact.linkedin_id);
    if (existingContact) {
      console.log('Contact already exists:', contact.linkedin_id);
      // Set as current contact if it already exists
      set({ currentContactId: contact.linkedin_id });
      return;
    }
    
    // Limit to 10 contacts
    if (contacts.length >= 10) {
      alert('Maximum 10 contacts allowed. Please remove some contacts first.');
      return;
    }
    
    set((state) => ({ 
      contacts: [...state.contacts, contact],
      currentContactId: contact.linkedin_id 
    }));
  },
  
  removeContact: (contactId) => set((state) => ({
    contacts: state.contacts.filter(c => c.linkedin_id !== contactId),
    messages: Object.fromEntries(
      Object.entries(state.messages).filter(([id]) => id !== contactId)
    )
  })),
  
  setCurrentContact: (contactId) => set({ currentContactId: contactId }),
  
  pushMessage: (contactId, message) => set((state) => {
    const list = state.messages[contactId] || [];
    return {
      ...state,
      messages: {
        ...state.messages,
        [contactId]: [...list, { ...message, createdAt: new Date() }]
      }
    };
  }),
  
  // Set all messages for a contact (used for loading history from backend)
  setMessages: (contactId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [contactId]: messages
    }
  })),
  
  updateMessage: (contactId, messageIndex, content) => set((state) => {
    const messages = state.messages[contactId] || [];
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content };
    
    return {
      ...state,
      messages: {
        ...state.messages,
        [contactId]: updatedMessages
      }
    };
  }),
  
  setLoading: (key, value) => set((state) => ({
    ...state,
    loading: { ...state.loading, [key]: value }
  })),
  
  addCustomPrompt: (prompt) => set((state) => ({
    customPrompts: [...state.customPrompts, prompt]
  })),
  
  removeCustomPrompt: (index) => set((state) => ({
    customPrompts: state.customPrompts.filter((_, i) => i !== index)
  })),
  
  // Reset store
  reset: () => set({
    userProfile: null,
    contacts: [],
    currentContactId: null,
    messages: {},
    loading: { scrape: false, ai: false },
    customPrompts: []
  })
})); 