"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/add-contact", label: "Add Contact" },
  ];

  return (
    <nav className="bg-[#0A66C2] text-white shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-100 transition">
          LinkPilot
        </Link>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium transition ${
                pathname === item.href
                  ? "text-white border-b-2 border-white"
                  : "text-blue-100 hover:text-white hover:underline"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 