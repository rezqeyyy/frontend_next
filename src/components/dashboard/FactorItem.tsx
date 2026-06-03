// src/components/dashboard/FactorItem.tsx

export function FactorItem({ label, value, icon: Icon, color, bg, border }: any) {
  return (
    <div className="group flex items-center gap-3 lg:gap-4 w-full bg-gray-50/40 hover:bg-white transition-all duration-300 p-3 lg:p-4 rounded-2xl border border-gray-100 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-gray-200 cursor-default">
      
      {/* Icon Circle dengan efek pop-up saat di-hover */}
      <div className={`w-11 h-11 lg:w-12 lg:h-12 rounded-full border-2 ${border} ${bg} flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Text Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] lg:text-[11px] text-gray-400 group-hover:text-gray-500 uppercase font-bold tracking-wider truncate transition-colors">
          {label}
        </span>
        <span className="text-lg lg:text-xl font-extrabold text-gray-800 leading-tight mt-0.5">
          {value}
        </span>
      </div>

    </div>
  );
}