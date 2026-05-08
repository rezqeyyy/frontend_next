import { CheckCircle2, Users, Headset } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-[#fafbff]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AI-Powered Customer Analytics
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
            Predict Customer <span className="text-purple-300">Churn</span>{" "}
            Before It Happens
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Leverage advanced machine learning to identify at-risk customers and
            take action with real-time insights and predictive analytics.
          </p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-blue-200 to-purple-200 text-white px-30 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-100 hover:brightness-105 transition"
          >
            Login
          </Link>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <StatCard
              icon={<CheckCircle2 className="text-blue-500" size={20} />}
              label="98%"
              sub="Accuracy Rate"
            />
            <StatCard
              icon={<Users className="text-blue-500" size={20} />}
              label="10K+"
              sub="Active Users"
            />
            <StatCard
              icon={<Headset className="text-blue-500" size={20} />}
              label="24/7"
              sub="Support"
            />
          </div>
        </div>

        <div className="flex-1 w-full lg:max-w-[600px] relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-3xl rounded-full"></div>
          <img
            src="/assets/dashboard-mockup.png"
            alt="Dashboard Mockup"
            className="relative rounded-[2.5rem] shadow-2xl border-8 border-white object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, sub }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center lg:items-start gap-2">
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
      <div className="text-center lg:text-left">
        <p className="text-xl font-bold text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {sub}
        </p>
      </div>
    </div>
  );
}
