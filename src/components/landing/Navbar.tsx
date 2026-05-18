// src/components/landing/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
            
            <Link href="/" className="flex items-center shrink-0">
                <img src="/assets/keeva.png" alt="Keeva Logo" className="h-10 sm:h-12 w-auto" />
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
                <Link href="#" className="hover:text-purple-400 transition">Home</Link>
                <Link href="#features" className="hover:text-purple-400 transition">Feature</Link>
                <Link href="#about" className="hover:text-purple-400 transition">Workflow</Link>
                <Link href="#integrations" className="hover:text-purple-400 transition">AI Syestem</Link>
                <Link href="#profile" className="hover:text-purple-400 transition">Profile</Link>
                <Link href="about-system" className="hover:text-purple-400 transition">About the system</Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
                <span className="text-gray-200">|</span>
                <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2">
                Log in
                </Link>
                <Link 
                href="/register" 
                className="bg-gradient-to-r from-blue-200 to-purple-200 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-100 hover:brightness-105 transition"
                >
                Sign Up
                </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="lg:hidden flex items-center gap-3">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-gray-600 transition">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
            </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out bg-white ${isOpen ? 'max-h-screen opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="px-6 pt-4 pb-10 space-y-1">
            <MobileLink href="#" label="Home" onClick={() => setIsOpen(false)} />
            <MobileLink href="#features" label="Feature" onClick={() => setIsOpen(false)} />
            <MobileLink href="#about" label="About" onClick={() => setIsOpen(false)} />
            <MobileLink href="#integrations" label="Integrations" onClick={() => setIsOpen(false)} />
            <MobileLink href="/profile" label="Profile" onClick={() => setIsOpen(false)} />
            <MobileLink href="/about-system" label="About System" onClick={() => setIsOpen(false)} />
            
            <div className="pt-6 flex flex-col gap-3">
                <Link 
                href="/login" 
                className="w-full text-center py-4 text-gray-700 font-bold border border-gray-100 rounded-2xl text-sm"
                >
                Log in
                </Link>
                {/* FIX: Tombol Sign Up Free pake Gradient */}
                <Link 
                href="/register" 
                className="w-full text-center py-4 bg-gradient-to-r from-blue-200 to-purple-200 text-white font-black rounded-2xl shadow-lg shadow-blue-100 text-sm"
                >
                Sign Up Free
                </Link>
            </div>
            </div>
        </div>
        </nav>
    );
    }

    function MobileLink({ href, label, onClick }: any) {
    return (
        <Link 
        href={href} 
        onClick={onClick}
        className="block py-4 text-sm font-bold text-gray-600 hover:text-purple-400 transition border-b border-gray-50 last:border-none"
        >
        {label}
        </Link>
    );
}