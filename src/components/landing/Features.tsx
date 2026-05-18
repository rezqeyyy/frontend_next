// src/components/landing/Features.tsx
import {
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Layers,
  Settings,
  Layout,
  ClipboardList,
  PieChart,
  BrainCircuit,
  MessageSquare,
  LineChart,
  LogIn,
  Search,
  Sparkles,
  MousePointer2,
} from "lucide-react";

export default function Features() {
  return (
    <>
      {/* SECTION: POWERFUL FEATURES */}
      <section id="features" className="py-24 px-6 bg-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-300 mb-2 tracking-tight">
            Powerful Features
          </h2>
          <p className="text-gray-400 mb-16 text-sm font-medium">
            Everything you need to reduce churn and increase customer retention
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Real Time Prediction"
              desc="Get instant predictions on customer churn risk with our advanced ML algorithms."
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Customer Segmentation"
              desc="Automatically segment customers based on behavior patterns and engagement levels."
            />
            <FeatureCard
              icon={<Zap size={24} />}
              title="Advanced Analytics"
              desc="Dive deep into customer data with comprehensive dashboards and customizable reports."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Enterprise Security"
              desc="Bank-level encryption and compliance with GDPR, SOC 2, and ISO standards to keep data safe."
            />
            <FeatureCard
              icon={<Layers size={24} />}
              title="Fast Integration"
              desc="Connect your existing CRM, payment systems, and tools in minutes with our pre-built integrations."
            />
            <FeatureCard
              icon={<Settings size={24} />}
              title="Automated Actions"
              desc="Set up automated workflows to engage at-risk customers with personalized campaigns and offers."
            />
          </div>
        </div>
      </section>

      {/* SECTION: HOW KEEVA WORKS */}
      <section id="workflow" className="py-24 px-6 bg-[#fafbff] text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-300 mb-2 tracking-tight">
            How Keeva Works
          </h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
            A powerful Machine Learning platform designed to help you manage
            customers, analyze churn behavior, and provide targeted retention
            recommendations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <WorkCard
              icon={<Layout size={24} />}
              title="Dashboard"
              desc="View key metrics and recent system activity for real-time monitoring and insights."
            />
            <WorkCard
              icon={<ClipboardList size={24} />}
              title="Customer Management"
              desc="Manage customer data, analyze behavior patterns, and identify churn risks in detail."
            />
            <WorkCard
              icon={<PieChart size={24} />}
              title="Segmentation"
              desc="Group customers by behavior patterns and risk levels for targeted retention strategies."
            />
            <WorkCard
              icon={<BrainCircuit size={24} />}
              title="ML Recommendations"
              desc="Get AI-powered retention recommendations tailored for each at-risk customer."
            />
            <WorkCard
              icon={<MessageSquare size={24} />}
              title="AI Chatbot Assistant"
              desc="Ask questions about customer data, get instant insights, and receive actionable recommendations through our intelligent chatbot."
            />
            <WorkCard
              icon={<LineChart size={24} />}
              title="Advanced Analytics"
              desc="Deep dive into churn probability, user behavior, and retention strategy effectiveness."
            />
          </div>
        </div>
      </section>

      {/* SECTION: HOW THE SYSTEM WORKS (The 1, 2, 3, 4 Steps) */}
      <section id="ai-system" className="py-24 px-6 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-300 mb-2 tracking-tight">
            How the System Works
          </h2>
          <p className="text-gray-400 mb-16 text-sm font-medium">
            A simple process to get powerful insights about customer churn
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              number={1}
              icon={<LogIn size={24} />}
              title="Login to Dashboard"
              desc="Access your analytics dashboard with your employee credentials to start analyzing customer data."
            />
            <StepCard
              number={2}
              icon={<Search size={24} />}
              title="Analyze Customers"
              desc="Our AI automatically analyzes customer behavior patterns in real-time to detect churn signals."
            />
            <StepCard
              number={3}
              icon={<Sparkles size={24} />}
              title="AI Predictions"
              desc="Machine Learning generates accurate churn predictions and personalized retention recommendations."
            />
            <StepCard
              number={4}
              icon={<MousePointer2 size={24} />}
              title="Take Action"
              desc="Get actionable insights and concrete steps to prevent customer churn and improve retention."
            />
          </div>
        </div>
      </section>
    </>
  );
}

// Internal Mini-Components for Clean Code
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col h-full group">
      <div className="p-3 bg-blue-50 rounded-2xl w-fit mb-5 text-blue-500 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-sm mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-[10px] leading-relaxed text-gray-400 font-medium">
        {desc}
      </p>
    </div>
  );
}

function WorkCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all text-left flex flex-col h-full">
      <div className="p-3 bg-blue-50 rounded-2xl w-fit mb-6 text-blue-500">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-sm mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-[10px] leading-relaxed text-gray-400 font-medium">
        {desc}
      </p>
    </div>
  );
}

function StepCard({ number, icon, title, desc }: any) {
  return (
    <div className="relative bg-[#f8faff] p-10 rounded-[2.5rem] text-left border border-gray-50 flex flex-col h-full overflow-hidden">
      <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm z-10 shadow-lg shadow-blue-200">
        {number}
      </div>
      <div className="p-4 bg-blue-100/50 rounded-2xl w-fit mb-6 mt-4 text-blue-600">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-base mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-[12px] leading-relaxed text-gray-500 font-medium">
        {desc}
      </p>
    </div>
  );
}
