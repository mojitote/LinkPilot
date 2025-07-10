import React from "react";
import '../styles/tailwind.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// LinkedIn blue: #0A66C2

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 