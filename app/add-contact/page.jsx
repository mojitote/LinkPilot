'use client'

import AddContactForm from '../../components/AddContactForm';

// Add Contact form page
export default function AddContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-5xl mx-auto">
        <header className="bg-[#0A66C2] text-white px-6 py-4 rounded-t-lg shadow-md mb-0">
          <h1 className="text-2xl font-bold">Add LinkedIn Contact</h1>
        </header>
        <section className="flex flex-col items-center justify-center bg-white shadow-md rounded-b-lg px-6 py-8">
          <AddContactForm />
        </section>
      </div>
    </main>
  );
} 