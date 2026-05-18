import { CheckCircle2, Users, Headset } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    // Tambahan min-h-screen dan penyesuaian padding agar konten berada di tengah layar dengan pas
    <section className="pt-32 pb-20 px-6 bg-[#fafbff] min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
        
        {/* Kurangi space-y-8 menjadi space-y-6 agar grup teks lebih solid */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AI-Powered Customer Analytics
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight">
            Predict Customer <span className="text-purple-300">Churn</span>{" "}
            Before It Happens
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Leverage advanced machine learning to identify at-risk customers and
            take action with real-time insights and predictive analytics.
          </p>
          
          {/* PERBAIKAN TOMBOL: px-30 diganti px-12 py-3.5 agar proporsional */}
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-blue-200 to-purple-200 text-white px-12 py-3.5 rounded-2xl font-bold text-lg shadow-xl shadow-purple-100 hover:brightness-105 hover:shadow-2xl transition-all duration-300"
          >
            Login
          </Link>

          {/* Kurangi pt-8 menjadi pt-4 agar tidak terlalu mendorong ke bawah */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-4 lg:pt-6">
            <StatCard
              icon={<CheckCircle2 className="text-blue-500" size={22} />}
              label="98%"
              sub="Accuracy Rate"
            />
            <StatCard
              icon={<Users className="text-blue-500" size={22} />}
              label="10K+"
              sub="Active Users"
            />
            <StatCard
              icon={<Headset className="text-blue-500" size={22} />}
              label="24/7"
              sub="Support"
            />
          </div>
        </div>

        {/* Gambar Mockup */}
        <div className="flex-1 w-full lg:max-w-[600px] relative">
          {/* Ubah blur-3xl menjadi blur-[80px] agar glow lebih halus */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-[80px] rounded-full"></div>
          <img
            src="/assets/dashboard2.png"
            alt="Dashboard Mockup"
            className="relative rounded-[2rem] shadow-2xl border-[6px] border-white object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, sub }: any) {
  return (
    // Tambah sedikit hover effect biar stat card lebih interaktif
    <div className="bg-white p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center lg:items-start gap-3 hover:shadow-md transition-shadow">
      <div className="p-2.5 bg-blue-50 rounded-xl">{icon}</div>
      <div className="text-center lg:text-left">
        <p className="text-xl lg:text-2xl font-bold text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
          {sub}
        </p>
      </div>
    </div>
  );
}