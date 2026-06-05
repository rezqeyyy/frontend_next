// src/app/page.tsx
"use client";

import Link from "next/link";
import { Sparkles, TrendingDown, Clock, DollarSign, LogIn, Search, MousePointer2, Quote } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import { Star } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const problems = [
  { icon: TrendingDown, text: "Can't tell which customers are about to leave" },
  { icon: Clock,        text: "Reacting to churn after it's already happened" },
  { icon: DollarSign,   text: "Wasting budget on retention for the wrong accounts" },
];

const howItWorks = [
  { icon: LogIn,         num: "01", title: "Connect Your Data", desc: "Link your CRM, billing, and product tools in minutes. No data warehouse required." },
  { icon: Search,        num: "02", title: "AI Analyzes Signals", desc: "Keeva scores every customer in real time across 500+ behavioral signals." },
  { icon: MousePointer2, num: "03", title: "Take Action", desc: "Trigger automated workflows or manual outreach the moment risk is detected." },
];

const testimonials = [
  {
    quote: "Keeva flagged 3 enterprise accounts that were about to churn. We reached out in time and saved over $120K in ARR in one quarter.",
    name: "Sarah Chen",
    role: "VP of Customer Success",
    company: "Nexora SaaS",
    initials: "SC",
    color: "bg-purple-100 text-purple-600",
  },
  {
    quote: "The AI recommendations are genuinely useful — not generic advice. It told us exactly which feature to nudge each at-risk customer toward.",
    name: "Marcus Webb",
    role: "Head of Growth",
    company: "Loopify",
    initials: "MW",
    color: "bg-blue-100 text-blue-600",
  },
  {
    quote: "We went from monthly churn reviews to real-time visibility. Our CSM team now spends time on the right accounts, not guessing.",
    name: "Priya Nair",
    role: "Director of Operations",
    company: "Stackform",
    initials: "PN",
    color: "bg-pink-100 text-pink-600",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div id="home" className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      

      {/* ── PROBLEM → SOLUTION ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
            Churn is Costly. Guessing is Worse.
          </h2>
          <p className="text-center text-gray-400 text-sm mb-14">
            Most teams find out a customer churned after it already happened — Keeva changes that.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Pain points */}
            <div className="space-y-4">
              {problems.map((p) => (
                <div key={p.text} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="shrink-0 p-2.5 rounded-xl bg-red-50">
                    <p.icon size={18} className="text-red-400" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">{p.text}</p>
                </div>
              ))}
            </div>

            {/* Solution card */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 p-8 shadow-sm">
              <div className="inline-flex p-2.5 rounded-xl bg-purple-100 mb-5">
                <Sparkles size={20} className="text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Keeva gives you the answer before you need to ask</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Real-time churn scores, explainable AI predictions, and automated retention workflows — so your team always knows who to focus on and why.
              </p>
              <Link href="/register" className="inline-block bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-6 py-3 rounded-xl font-bold text-sm hover:brightness-105 transition">
                See How It Works →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
            Three Steps to Zero Surprises
          </h2>
          <p className="text-center text-gray-400 text-sm mb-14">
            From data connection to retention action — up and running in under 30 minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((s) => (
              <div key={s.num} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow text-center">
                <span className="block text-5xl font-black text-purple-100 mb-4 leading-none">{s.num}</span>
                <div className="inline-flex p-2.5 rounded-xl bg-purple-50 mb-4">
                  <s.icon size={20} className="text-purple-500" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Social Proof</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
            Trusted by Retention Teams
          </h2>
          <p className="text-center text-gray-400 text-sm mb-14">
            Real results from teams using Keeva to stay ahead of churn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5">
                <Quote size={20} className="text-purple-200 shrink-0" />
                <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
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

      <Footer />
    </div>
  );
}