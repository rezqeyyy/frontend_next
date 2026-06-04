"use client";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import { Star, Sparkles } from "lucide-react";

const workflows = [
  {
    title: "Dashboard",
    tagline: "Your command center for retention",
    desc: "A real-time overview of every metric that matters — churn rate, revenue at risk, customer health scores, and recent activity. Every widget is drag-and-drop configurable, and threshold alerts notify the right person via email or Slack the moment a metric crosses a boundary you define.",
  },
  {
    title: "Customer Management",
    tagline: "Every customer, fully understood",
    desc: "Each customer profile aggregates CRM data, product usage, support tickets, billing history, and engagement metrics into a single unified view. The churn risk timeline shows how a score has evolved over 90 days, and you can add notes, assign tasks, and flag escalations directly — no context switching.",
  },
  {
    title: "Segmentation",
    tagline: "Group smarter, retain better",
    desc: "Keeva automatically identifies natural groupings in your customer base — high-value dormant users, recently activated accounts, power users at risk — without any manual configuration. Layer custom business rules on top and segments refresh daily so your campaigns always target the right people.",
  },
  {
    title: "ML Recommendations",
    tagline: "AI tells you exactly what to do",
    desc: "For each at-risk customer, the ML engine surfaces the retention action with the highest historical success rate — with its reasoning included, e.g. 'Customers with similar usage drop-off responded well to a free feature unlock in 78% of cases.' Every accepted or rejected recommendation feeds back to improve the model.",
  },
  {
    title: "AI Chatbot Assistant",
    tagline: "Ask anything, get instant answers",
    desc: "Ask questions like 'Why is Acme Corp at risk?' or 'Which enterprise accounts are most likely to churn this quarter?' and get a detailed, data-backed answer in under 3 seconds. The chatbot can draft retention emails, summarize customer history, or compare segments — all from a single conversational prompt.",
  },
  {
    title: "Advanced Analytics",
    tagline: "Deep insight into every retention lever",
    desc: "Cohort analysis shows exactly when customers tend to churn so you can design proactive touchpoints at the right moments. Funnel analysis reveals where customers disengage, and retention strategy attribution tracks which interventions actually moved the needle — so you double down on what works.",
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

export default function WorkflowPage() {
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
            <SectionLabel>Platform Workflow</SectionLabel>
            <h1 className="anim anim-1 text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">How Keeva </span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="anim anim-2 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              A powerful Machine Learning platform designed to help you manage customers,
              analyze churn behavior, and provide targeted retention recommendations.
            </p>
          </div>
        </section>

        {/* WORKFLOW CARDS */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <SectionLabel>Step by Step</SectionLabel>
            <SectionTitle>Inside the Platform</SectionTitle>
            <p className="text-center text-gray-400 text-sm mb-14">
              Six integrated modules that work together to detect, understand, and prevent churn
            </p>

            <div className="space-y-5">
              {workflows.map((w, i) => (
                <div
                  key={w.title}
                  className={`anim anim-${(i % 6) + 1} rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex items-start gap-6`}
                >
                  <span className="shrink-0 text-5xl font-black text-purple-100 leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{w.title}</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5 mb-3">{w.tagline}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{w.desc}</p>
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