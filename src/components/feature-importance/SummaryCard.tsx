export function SummaryCard({ title, value, unit, icon: Icon, color, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${color} ${iconColor} flex items-center justify-center`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 leading-tight mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">{value}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}