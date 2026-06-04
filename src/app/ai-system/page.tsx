"use client";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import { Star, Sparkles, LogIn, Search, MousePointer2 } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Login to Dashboard",
    tagline: "Secure access, instant visibility",
    desc: "Access your Keeva churn prediction dashboard with your employee credentials. Role-based access ensures admins, analysts, and CSMs each see exactly what they need — protected by OAuth 2.0, SSO support, and auto-expiring encrypted sessions.",
  },
  {
    icon: Search,
    title: "Analyze Customers",
    tagline: "Every signal, automatically captured",
    desc: "Keeva's engine ingests data from your CRM, product usage logs, billing events, and support tickets — unifying them into a single customer profile. Over 500 behavioral signals are tracked in real time, and anomaly detection flags unusual patterns before they show up in your churn rate.",
  },
  {
    icon: Sparkles,
    title: "AI Churn Predictions",
    tagline: "Accurate, explainable, actionable",
    desc: "Every customer receives a churn probability score (0–100%) updated in real time, powered by a Gradient Boosting + Neural Net ensemble with 94% accuracy. The system always explains its reasoning — surfacing the top 3 risk factors like missed logins or unresolved support tickets so predictions are never a black box.",
  },
  {
    icon: MousePointer2,
    title: "Take Action",
    tagline: "From insight to retention in one click",
    desc: "The moment a churn score crosses your threshold, Keeva triggers the right action automatically — a personalized email, a CRM follow-up task, or a Slack alert to the CSM. Every action and outcome is logged, feeding back into the model to continuously sharpen future recommendations.",
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

export default function AISystemPage() {
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
      `}</style>

      <main className="min-h-screen bg-white text-gray-800 font-sans">

        {/* HERO */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-purple-100/60 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-blue-100/50 blur-2xl" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <SectionLabel>AI System</SectionLabel>
            <h1 className="anim anim-1 text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">How </span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
                Keeva
              </span>
              <span className="text-gray-900"> Works</span>
            </h1>
            <p className="anim anim-2 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              A simple four-step process to predict customer churn and take action —
              before it's too late.
            </p>
          </div>
        </section>

        {/* STEPS */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <SectionLabel>The Process</SectionLabel>
            <SectionTitle>Four Steps to Retention</SectionTitle>
            <p className="text-center text-gray-400 text-sm mb-14">
              From raw customer data to targeted churn prevention — in four simple steps
            </p>

            <div className="space-y-5">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className={`anim anim-${i + 1} rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex items-start gap-6`}
                  >
                    {/* Step number */}
                    <span className="shrink-0 text-5xl font-black text-purple-100 leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Icon + content */}
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1 w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Icon size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight">{s.title}</h3>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5 mb-3">{s.tagline}</p>
                        <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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