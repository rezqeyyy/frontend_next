"use client";
import Navbar from "@/components/landing/Navbar";
import Link from "next/link";
import {
  Brain,
  Database,
  TrendingUp,
  RefreshCw,
  Shield,
  DollarSign,
  Target,
  BarChart2,
  LayoutDashboard,
  Users,
  Sparkles,
  MessageSquare,
  LineChart,
  Zap,
  Activity,
  Star,
} from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Customer Data Collection",
    desc: "The system comprehensively collects customer data including transaction history, service usage patterns, subscription duration, interaction frequency, and other engagement metrics. Data is collected securely with full encryption to protect customer privacy.",
    icon: Database,
  },
  {
    num: "02",
    title: "Machine Learning Analysis",
    desc: "ML algorithms analyze the collected data to identify hidden patterns, trends, and churn signals. The system uses ensemble models such as Gradient Boosting, Random Forest, and Neural Networks to deliver highly accurate predictions.",
    icon: Brain,
  },
  {
    num: "03",
    title: "Churn Prediction & Explanation",
    desc: "Based on the analysis, the system generates a churn risk score for each customer along with a transparent explanation of the key contributing factors. Business teams can understand the reasoning behind every prediction through built-in explainability features.",
    icon: TrendingUp,
  },
  {
    num: "04",
    title: "Continuous Learning",
    desc: "The system continuously learns from new data and retention outcomes to improve prediction accuracy over time. Every interaction enriches the model, ensuring performance keeps pace with evolving customer behavior.",
    icon: RefreshCw,
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Improve Customer Retention",
    desc: "Identify at-risk customers early and take preventive action to retain them before it is too late.",
  },
  {
    icon: DollarSign,
    title: "Reduce Revenue Loss",
    desc: "Real-time visualization of at-risk revenue enables prioritization of retention efforts based on customer lifetime value.",
  },
  {
    icon: Target,
    title: "Optimize Retention Strategy",
    desc: "Comprehensive analytics dashboards help design targeted retention strategies based on customer segments and risk profiles.",
  },
  {
    icon: BarChart2,
    title: "Data-Driven Decision Making",
    desc: "Every strategic decision is backed by accurate data and deep analysis, reducing risk and increasing retention success rates.",
  },
];

const features = [
  {
    icon: LayoutDashboard,
    title: "Analytics Dashboard",
    desc: "A comprehensive dashboard displaying churn rate metrics, revenue at risk, customer trends, and business KPIs in real-time with intuitive visualizations.",
  },
  {
    icon: Users,
    title: "Customer Management",
    desc: "Centrally manage customer data, monitor churn risk profiles, review transaction history, and perform in-depth behavioral analysis.",
  },
  {
    icon: Sparkles,
    title: "AI Prediction",
    desc: "Advanced AI models that generate high-accuracy churn predictions with transparent risk factor explanations for every customer.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot Assistant",
    desc: "An interactive AI assistant that analyzes customer profiles, delivers deep insights, and recommends personalized retention strategies.",
  },
  {
    icon: LineChart,
    title: "Feature Importance",
    desc: "In-depth analysis of the key factors driving customer churn decisions, helping you understand root causes and design precise interventions.",
  },
  {
    icon: DollarSign,
    title: "Revenue at Risk",
    desc: "Visualization and analysis of revenue threatened by potential churn, segmented by customer value to prioritize effective retention actions.",
  },
];

const capabilities = [
  {
    icon: Brain,
    title: "Machine Learning",
    desc: "ML algorithms that continuously learn from new data to improve churn prediction accuracy over time.",
  },
  {
    icon: Activity,
    title: "Real-time Analytics",
    desc: "Live data analysis that keeps insights always up-to-date and immediately actionable for your team.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "AI-driven insights that provide deep understanding of customer behavior and churn patterns.",
  },
  {
    icon: Zap,
    title: "High Performance",
    desc: "A fast and responsive system delivering an optimal user experience across all features.",
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

function SectionTitle({
  children,
  gradient,
}: {
  children: React.ReactNode;
  gradient?: boolean;
}) {
  return (
    <h2
      className={`text-3xl md:text-4xl font-bold text-center mb-3 ${
        gradient
          ? "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent"
          : "text-gray-800"
      }`}
    >
      {children}
    </h2>
  );
}

export default function AboutTheSystemPage() {
  return (
    <>
      <Navbar />
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { animation: fadeUp 0.6s ease both; }
        .anim-1 { animation-delay: 0.05s; }
        .anim-2 { animation-delay: 0.1s; }
        .anim-3 { animation-delay: 0.15s; }
        .anim-4 { animation-delay: 0.2s; }
        .anim-5 { animation-delay: 0.25s; }
        .anim-6 { animation-delay: 0.3s; }
      `}</style>

      <main className="min-h-screen bg-white text-gray-800 font-sans">

        {/* HERO */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-purple-100/60 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-blue-100/50 blur-2xl" />

          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <SectionLabel>AI-Powered Customer Analytics</SectionLabel>

            <h1 className="anim anim-1 text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">Keeva </span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 bg-clip-text text-transparent">
                Churn Prediction
              </span>
            </h1>

            <p className="anim anim-2 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              A Machine Learning–powered churn prediction platform designed to
              help businesses identify and retain at-risk customers before they leave.
            </p>
          </div>
        </section>

        {/* ABOUT KEEVA */}
        <section className="py-20 max-w-4xl mx-auto px-6">
          <SectionLabel>About Keeva</SectionLabel>
          <SectionTitle gradient>What is Keeva?</SectionTitle>

          <div className="anim anim-1 mt-10 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/60 to-blue-50/40 p-8 md:p-10 shadow-sm">
            <p className="text-gray-700 font-semibold text-base md:text-lg leading-relaxed mb-4">
              Keeva is an AI-powered churn analytics platform built to help companies
              deeply understand customer behavior. It leverages state-of-the-art Machine
              Learning algorithms to analyze hundreds of customer variables and produce
              accurate, explainable churn predictions.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              With Keeva, business teams can identify at-risk customers well before they
              decide to leave, enabling timely and targeted retention actions. The platform
              also features an AI Chatbot Assistant that interactively analyzes customer
              cases and delivers personalized retention strategy recommendations.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <SectionLabel>System Workflow</SectionLabel>
            <SectionTitle gradient>How the System Works</SectionTitle>

            <div className="mt-12 space-y-5">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`anim anim-${i + 1} flex gap-5 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex-shrink-0 flex items-start gap-4">
                    <span className="text-4xl font-black text-purple-100 leading-none select-none">
                      {step.num}
                    </span>
                    <div className="mt-1 p-2 rounded-xl bg-purple-50">
                      <step.icon size={20} className="text-purple-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 max-w-5xl mx-auto px-6">
          <SectionLabel>Why Keeva</SectionLabel>
          <SectionTitle gradient>Benefits of Using Keeva</SectionTitle>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`anim anim-${i + 1} rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}
              >
                <div className="mb-4 inline-flex p-2.5 rounded-xl bg-purple-50">
                  <b.icon size={20} className="text-purple-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <SectionLabel>Features</SectionLabel>
            <SectionTitle gradient>Core System Features</SectionTitle>
            <p className="text-center text-gray-400 text-sm mb-12">
              A complete solution for identifying, analyzing, and preventing customer churn
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`anim anim-${i + 1} rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}
                >
                  <div className="mb-4 inline-flex p-2.5 rounded-xl bg-indigo-50">
                    <f.icon size={20} className="text-indigo-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="py-20 max-w-5xl mx-auto px-6">
          <SectionLabel>Technology</SectionLabel>
          <SectionTitle gradient>System Capabilities</SectionTitle>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((c, i) => (
              <div
                key={c.title}
                className={`anim anim-${i + 1} rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}
              >
                <div className="mb-4 inline-flex p-2.5 rounded-xl bg-blue-50">
                  <c.icon size={20} className="text-blue-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{c.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
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

      </main>
    </>
  );
}