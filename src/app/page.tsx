// src/app/page.tsx
"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Team from "@/components/landing/Team";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Navigasi Atas */}
      <Navbar />

      {/* 2. Bagian Hero */}
      <Hero />

      {/* 3. Fitur Utama & Cara Kerja Sistem */}
      <Features />

      {/* 4. Bagian Tim (Termasuk Rizqi Asan Masika) */}
      <Team />

      {/* 5. Banner Ajakan (CTA) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-purple-400 to-indigo-400 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-purple-200">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-left">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Ready to Reduce Customer Churn?
                </h2>
                <p className="text-purple-50 text-sm mb-3">
                  Join thousands of companies using Keeva to predict and prevent
                  customer churn with AI-powered insights.
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-purple-50">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Enterprise solution
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Expert onboarding
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    24/7 support
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/register"
              className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-base hover:bg-gray-50 transition shrink-0"
            >
              Start Keeva
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer (Navigasi, Produk, Kontak) */}
      <Footer />
    </div>
  );
}
