"use client";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import {
  BarChart3, Users, Zap, ShieldCheck, Layers, Settings,
  Star, Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real Time Prediction",
    tagline: "Predict churn before it happens",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    desc: "Our ML engine scores every customer in real time using 150+ behavioral signals — the moment behavior changes, you know. Outputs a churn probability (0–100%) plus the top 3 risk drivers, and integrates with your existing CRM via webhook or REST API in minutes.",
  },
  {
    icon: Users,
    title: "Customer Segmentation",
    tagline: "Group smarter, act faster",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    desc: "Automatically clusters your customer base into behaviorally coherent segments using K-Means and hierarchical clustering — built from usage patterns, contract value, support history, and engagement score, not just demographics. Export to Salesforce, HubSpot, or CSV instantly.",
  },
  {
    icon: Zap,
    title: "Advanced Analytics",
    tagline: "Dashboards that actually answer questions",
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    desc: "12 pre-built retention dashboards cover cohort analysis, funnel drop-off, feature adoption heatmaps, and renewal forecasts — plus an unlimited drag-and-drop report builder. Every chart supports drill-down, and scheduled email digests send key metrics to your team automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    tagline: "Bank-level protection, zero compromise",
    color: "bg-green-50",
    iconColor: "text-green-600",
    desc: "End-to-end AES-256 encryption, TLS 1.3 in transit, and full compliance with GDPR, SOC 2 Type II, and ISO 27001. Customer-managed encryption keys via AWS KMS or Azure Key Vault, with data residency options across US, EU, and APAC regions.",
  },
  {
    icon: Layers,
    title: "Fast Integration",
    tagline: "Connected in minutes, not months",
    color: "bg-teal-50",
    iconColor: "text-teal-600",
    desc: "60+ pre-built connectors for Salesforce, Stripe, Intercom, and more — most integrations are live in under 30 minutes via OAuth 2.0. Full REST & GraphQL API with SDKs for JavaScript, Python, Ruby, and Go. Enterprise plans include a dedicated integration engineer.",
  },
  {
    icon: Settings,
    title: "Automated Actions",
    tagline: "Engage at-risk customers automatically",
    color: "bg-rose-50",
    iconColor: "text-rose-500",
    desc: "Build no-code multi-step workflows that trigger personalized emails, Slack alerts, or CRM tasks the instant a churn score crosses your threshold. Personalization tokens pull in usage stats and risk drivers directly into messages, and native A/B testing lets you optimize every playbook.",
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
      {children}
    </h2>
  );
}

export default function FeaturesPage() {
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
        .anim-6 { animation-delay: 0.30s; }
      `}</style>

      <main className="min-h-screen bg-white text-gray-800 font-sans">

        {/* HERO */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-purple-100/60 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-blue-100/50 blur-2xl" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <SectionLabel>Everything you need</SectionLabel>
            <h1 className="anim anim-1 text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">Powerful </span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
                Features
              </span>
            </h1>
            <p className="anim anim-2 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Everything you need to reduce churn and increase customer retention —
              built into one intelligent platform.
            </p>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="py-10 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <SectionLabel>Core Features</SectionLabel>
            <SectionTitle>What Keeva Can Do</SectionTitle>
            <p className="text-center text-gray-400 text-sm mb-14">
              A complete solution for identifying, analyzing, and preventing customer churn
            </p>

            <div className="space-y-5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`anim anim-${(i % 6) + 1} rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex items-start gap-6`}
                >
                  <div className={`shrink-0 p-3 rounded-xl ${f.color}`}>
                    <f.icon size={22} className={f.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{f.title}</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5 mb-3">{f.tagline}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
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