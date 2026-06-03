import Link from 'next/link';

export function InsightCard({ title, icon: Icon, desc, href }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Icon size={20} /></div>
        <h3 className="font-bold text-gray-900 mt-1">{title}</h3>
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{desc}</p>
      <Link href={href || "#"}>
        <button className="w-full border border-blue-500 text-blue-500 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
            View Details
        </button>
      </Link>
    </div>
  );
}