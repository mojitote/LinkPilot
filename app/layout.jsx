import React from "react";
import './globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Providers from '../components/Providers';

// LinkedIn blue: #0A66C2

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Providers>
        <Navigation />
          <main className="flex-1">
          {children}
        </main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
} 