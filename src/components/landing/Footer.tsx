// src/components/landing/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-gray-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
        {/* AREA LOGO & BRAND DESCRIPTION - UPDATE DI SINI */}
        <div className="lg:col-span-2 space-y-8 pr-12 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-3">
            {/* Panggil gambar logo lengkap yang baru */}
            <img
              src="/assets/keeva.png"
              alt="Keeva - Churn Prediction Platform"
              className="h-12 w-auto"
            />
            {/* Gradien ungu dan teks manual dihapus dari sini */}
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-sm">
            AI-powered customer churn prediction platform helping businesses
            retain their most valuable customers through predictive analytics.
          </p>
        </div>

        {/* NAVIGASI - Masih Sama */}
        <div className="space-y-8">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
            Navigasi
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-semibold text-gray-400 uppercase tracking-tight">
            <li>
              <Link href="/" className="hover:text-blue-500 transition">
                home page
              </Link>
            </li>
            <li>
              <Link href="about-system" className="hover:text-blue-500 transition">
                about the system
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-500 transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* PRODUCT - Masih Sama */}
        <div className="space-y-8">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
            Product
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-semibold text-gray-400 uppercase tracking-tight">
            <li>
              <Link href="#features" className="hover:text-blue-500 transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-blue-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link
                href="#integrations"
                className="hover:text-blue-500 transition"
              >
                Integrations
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-blue-500 transition">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT - Masih Sama */}
        <div className="space-y-8">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
            Contact
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-semibold text-gray-400 uppercase tracking-tight">
            <li>
              <Link href="#" className="hover:text-blue-500 transition">
                Email
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500 transition">
                Telephone
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500 transition">
                Address
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT - Masih Sama */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
        <p>© 2026 Keeva AI. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-gray-600 transition">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gray-600 transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
