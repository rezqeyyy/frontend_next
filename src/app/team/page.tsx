"use client";
import Navbar from "@/components/landing/Navbar";
import Link from "next/link";
import { Star, Sparkles } from "lucide-react";

const team = [
  {
    name: "Achmad Haikal Maali",
    role: "Lead Developer",
    photo: "/assets/haikal.jpg",
  },
  {
    name: "Aren Syifa Nabilah",
    role: "AI Engineer",
    photo: "/assets/muka aren.jpeg",
  },
  {
    name: "Faleza Yassinia O.R",
    role: "UI/UX Designer",
    photo: "/assets/muka eja.JPEG",
  },
  {
    name: "Rr. Afifah Ramadhani",
    role: "AI Engineer",
    photo: "/assets/muka hani.jpeg",
  },
  {
    name: "Rizqi Asan Masika",
    role: "Web Developer",
    photo: "/assets/muka gwech.jpg",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-300 bg-purple-50 text-purple-300 text-xs font-semibold tracking-widest uppercase">
        <Star size={11} className="fill-purple-300 text-purple-300" />
        {children}
      </span>
    </div>
  );
}

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim   { animation: fadeUp 0.6s ease both; }
        .anim-1 { animation-delay: 0.05s; }
        .anim-2 { animation-delay: 0.10s; }
        .anim-3 { animation-delay: 0.15s; }
        .anim-4 { animation-delay: 0.20s; }
        .anim-5 { animation-delay: 0.25s; }
      `}</style>

      <main className="min-h-screen bg-white text-gray-800 font-sans">

        {/* HERO */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-purple-100/60 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-blue-100/50 blur-2xl" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <SectionLabel>Our Team</SectionLabel>
            <h1 className="anim anim-1 text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">Meet the </span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
                People
              </span>
            </h1>
            <p className="anim anim-2 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              The talented people behind Keeva's powerful churn prediction platform.
            </p>
          </div>
        </section>

        {/* TEAM GRID */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <SectionLabel>The Team</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
              Who We Are
            </h2>
            <p className="text-center text-gray-400 text-sm mb-14">
              A multidisciplinary team building the future of customer retention
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {team.map((member, i) => (
                <div
                  key={member.name}
                  className={`anim anim-${i + 1} flex flex-col items-center group`}
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 text-center">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest text-center">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto bg-gradient-to-r from-purple-400 to-indigo-400 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-purple-200">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6 text-left">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Sparkles className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Reduce Customer Churn?</h2>
                  <p className="text-purple-50 text-sm mb-3">
                    Join thousands of companies using Keeva to predict and prevent customer churn with AI-powered insights.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-purple-50">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" />Enterprise solution</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" />Expert onboarding</span>
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white" />24/7 support</span>
                  </div>
                </div>
              </div>
              <Link href="/register" className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-base hover:bg-gray-50 transition shrink-0">
                Start Keeva
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}