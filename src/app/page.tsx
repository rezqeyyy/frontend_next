// src/app/page.tsx
import { 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle, 
  Activity, 
  HelpCircle,
  User,
  UserX,
  DollarSign,
  Gauge,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto text-gray-800">
      {/* HEADER */}
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Customer Churn</h1>
          <p className="text-gray-400 mt-1 text-sm">Real time prediction churn for users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm font-medium">
            13.00 | Selasa, 20 April 2026
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition font-medium">
            <Filter size={16} /> <span>Filter</span>
          </button>
        </div>
      </header>

      {/* KPI CARDS (Baris 1) */}
      <div className="grid grid-cols-4 gap-5 mb-5">
        <KpiCard title="Total Customer" value="3000" trend={8} isPositive={true} color="blue" icon={User} />
        <KpiCard title="High Risk Customer" value="30" trend={8} isPositive={true} color="red" icon={UserX} />
        <KpiCard title="Revenue at Risk" value="$284,000" trend={10.2} isPositive={true} color="red" icon={DollarSign} />
        <KpiCard title="Avg. Churn Risk Score" value="300" trend={8} isPositive={false} color="blue" icon={Gauge} />
      </div>

      {/* MAIN LAYOUT (KIRI: Konten Utama, KANAN: Sidebar Info) */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* KOLOM KIRI (Lebar ~75%) */}
        <div className="flex-1 flex flex-col gap-5">
          
          {/* Charts Row */}
          <div className="flex gap-5">
            {/* Chart Trend */}
            <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Churn Risk Trend</h3>
                <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-500 bg-white outline-none cursor-pointer">
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="w-full h-[220px] bg-blue-50/40 rounded-lg flex items-center justify-center border border-dashed border-blue-200 text-gray-400 text-sm">
                [Line Chart Component]
              </div>
            </div>

            {/* Chart Donut */}
            <div className="w-[320px] bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
              <h3 className="font-semibold text-gray-800 mb-4">Risk Distribution</h3>
              <div className="w-full flex-1 bg-green-50/40 rounded-lg flex items-center justify-center border border-dashed border-green-200 text-gray-400 text-sm">
                [Donut Chart Component]
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-gray-800">Customer Priority List</h3>
              <span className="text-sm text-blue-500 font-medium cursor-pointer flex items-center gap-1 hover:underline">
                View all <ArrowUp className="rotate-45" size={14} />
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="pb-3 font-medium px-2">#</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Churn Risk Score</th>
                    <th className="pb-3 font-medium">Rank Level</th>
                    <th className="pb-3 font-medium">Segment</th>
                    <th className="pb-3 font-medium">Revenue at Risk</th>
                    <th className="pb-3 font-medium">Level Activity</th>
                    <th className="pb-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <TableRow no={1} name="Tatang suretang" score={82} rank="High" segment="All Risk User" revenue="$284,000" activity="5 days ago" />
                  <TableRow no={2} name="Tatang suretang" score={65} rank="Medium" segment="Reguler User" revenue="$284,000" activity="5 days ago" />
                  <TableRow no={3} name="Tatang suretang" score={35} rank="Low" segment="Power User" revenue="$284,000" activity="5 days ago" />
                </tbody>
              </table>
            </div>
          </div>

          {/* Why Customer Are At Risk (Bottom Section) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Why Costumer Are At Risk?</h3>
                <p className="text-xs text-gray-400 mt-1">Top factor that contribute to churn risk</p>
              </div>
              <span className="text-sm text-blue-500 font-medium cursor-pointer flex items-center gap-1 hover:underline">
                Go to Chat Bot <ArrowUp className="rotate-45" size={14} />
              </span>
            </div>
            
            <div className="flex items-center justify-between px-4 overflow-x-auto gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 min-w-[150px]">
                  {/* Div bunderan ditambah flex, items-center, justify-center, dan warna text */}
                  <div className="w-14 h-14 rounded-full border-2 border-blue-200/60 bg-blue-50/20 flex items-center justify-center flex-shrink-0 text-blue-500">
                    <LogOut size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Jarang login</span>
                    <span className="text-xl font-bold text-gray-800 leading-tight">30%</span>
                    <span className="text-[10px] text-gray-400">kontribusi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* KOLOM KANAN (Lebar ~25%) */}
        <div className="w-[320px] flex flex-col gap-5">
          
          {/* Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-gray-800">Alerts</h3>
               <span className="text-xs text-blue-500 font-medium cursor-pointer hover:underline">View all</span>
             </div>
             <div className="flex flex-col gap-3">
               <AlertItem type="danger" title="Customer Churn" desc="Real time prediction churn for users" time="3m ago" />
               <AlertItem type="warning" title="Activity Drop" desc="Drop 45%" time="3m ago" />
               <AlertItem type="info" title="No login" desc="Real time prediction churn for users" time="3m ago" />
             </div>
          </div>

          {/* AI Insight */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-blue-500"><HelpCircle size={18} /></span> AI Insight
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
              70% dari pelanggan beresiko tinggi mengalami penurunan aktivitas dalam 2 minggu terakhir dan jarang menggunakan fitur utama
            </p>
            <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              View Details
            </button>
          </div>

          {/* Top Recommendation */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1 flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-blue-500"><AlertTriangle size={18} /></span> Top Recomendation
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
              Prioritaskan outreach ke 312 pelanggan beresiko tinggi dengan menawarkan onboarding ulang dan konsultasi personal
            </p>
            {/* Class w-full dihapus dan diganti dengan self-start */}
            <button className="mt-auto self-start border border-blue-500 text-blue-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              View All Recomendation
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- SUB-KOMPONEN ---

function KpiCard({ title, value, trend, isPositive, color, icon: Icon }: any) {
  const borderColor = color === 'red' ? 'border-red-200' : 'border-blue-200';
  const textColor = isPositive ? 'text-green-500' : 'text-red-500';
  const iconColor = color === 'red' ? 'text-red-400' : 'text-blue-400';
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
      <div className={`w-14 h-14 rounded-full border-[3px] ${borderColor} flex items-center justify-center flex-shrink-0`}>
        {/* Render icon yang dikirim dari props */}
        {Icon && <Icon size={24} strokeWidth={2} className={iconColor} />}
      </div>
      <div>
        <h3 className="text-[13px] text-gray-500 font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-0.5 text-gray-900">{value}</p>
        <div className="flex items-center gap-1 mt-1 text-[11px] font-medium">
          <span className={`flex items-center ${textColor}`}>
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {trend}%
          </span>
          <span className="text-gray-400 font-normal">last 30 days</span>
        </div>
      </div>
    </div>
  );
}

function TableRow({ no, name, score, rank, segment, revenue, activity }: any) {
  const rankColors: any = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-orange-100 text-orange-600',
    Low: 'bg-green-100 text-green-600'
  };

  const segmentColors: any = {
    'All Risk User': 'bg-red-50 text-red-500',
    'Reguler User': 'bg-blue-50 text-blue-500',
    'Power User': 'bg-green-50 text-green-500'
  };

  const barColor = score > 70 ? 'bg-red-500' : score > 40 ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
      <td className="py-4 px-2">{no}</td>
      <td className="py-4 font-semibold text-gray-800">{name}</td>
      <td className="py-4">
        <div className="flex items-center gap-3">
          <span className="font-medium w-4">{score}</span>
          <ArrowUp size={12} className={score > 50 ? "text-red-500" : "text-green-500"} />
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold ${rankColors[rank]}`}>
          {rank}
        </span>
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold border border-transparent ${segmentColors[segment]}`}>
          {segment}
        </span>
      </td>
      <td className="py-4 font-semibold text-gray-800">{revenue}</td>
      <td className="py-4 text-gray-500">{activity}</td>
      <td className="py-4 text-center">
        <button className="text-blue-500 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition text-xs font-medium">
          View
        </button>
      </td>
    </tr>
  );
}

function AlertItem({ type, title, desc, time }: any) {
  const styles: any = {
    danger: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: <AlertTriangle size={14} className="text-red-600" /> },
    warning: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', icon: <Activity size={14} className="text-orange-600" /> },
    info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: <AlertTriangle size={14} className="text-blue-600" /> }
  };
  
  const current = styles[type];

  return (
    <div className={`${current.bg} p-3 rounded-xl border ${current.border}`}>
      <h4 className={`text-[13px] font-semibold ${current.text} flex items-center gap-2`}>
        {current.icon} {title}
      </h4>
      <p className="text-[11px] text-gray-500 mt-1 pl-6">{desc}</p>
      <p className="text-[10px] text-gray-400 text-right mt-1">{time}</p>
    </div>
  );
}