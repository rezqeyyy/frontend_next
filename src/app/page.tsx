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
    // <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto text-gray-800">
    <div className="p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8 max-w-[1600px] mx-auto text-gray-800">
      
      {/* HEADER - Stack on mobile, Row on sm+ */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Customer Churn</h1>
          <p className="text-gray-400 mt-1 text-sm">Real time prediction churn for users</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm font-medium flex-1 sm:flex-none text-center">
            13.00 | Selasa, 20 April 2026
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition font-medium flex-1 sm:flex-none">
            <Filter size={16} /> <span>Filter</span>
          </button>
        </div>
      </header>

      {/* KPI CARDS - 1 col on mobile, 2 col on tablet, 4 col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5">
        <KpiCard title="Total Customer" value="3000" trend={8} isPositive={true} color="blue" icon={User} />
        <KpiCard title="High Risk Customer" value="30" trend={8} isPositive={true} color="red" icon={UserX} />
        <KpiCard title="Revenue at Risk" value="$284,000" trend={10.2} isPositive={true} color="red" icon={DollarSign} />
        <KpiCard title="Avg. Churn Risk Score" value="300" trend={8} isPositive={false} color="blue" icon={Gauge} />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          
          {/* Charts Row - Stack on mobile, Row on lg+ */}
          <div className="flex flex-col xl:flex-row gap-5">
            {/* Chart Trend */}
            <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Churn Risk Trend</h3>
                <select className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white outline-none">
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="w-full h-[220px] bg-blue-50/40 rounded-lg flex items-center justify-center border border-dashed border-blue-200 text-gray-400 text-sm">
                [Line Chart]
              </div>
            </div>

            {/* Chart Donut */}
            <div className="w-full xl:w-[320px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Risk Distribution</h3>
              <div className="w-full h-[220px] bg-green-50/40 rounded-lg flex items-center justify-center border border-dashed border-green-200 text-gray-400 text-sm">
                [Donut Chart]
              </div>
            </div>
          </div>

          {/* Customer Table - Scroll horizontal on mobile */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-gray-800">Customer Priority List</h3>
              <span className="text-sm text-blue-500 font-medium cursor-pointer flex items-center gap-1 hover:underline">
                View all <ArrowUp className="rotate-45" size={14} />
              </span>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="pb-3 font-medium px-2">#</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Risk Score</th>
                      <th className="pb-3 font-medium">Rank</th>
                      <th className="pb-3 font-medium">Segment</th>
                      <th className="pb-3 font-medium">Revenue</th>
                      <th className="pb-3 font-medium">Activity</th>
                      <th className="pb-3 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <TableRow no={1} name="Tatang Suretang" score={82} rank="High" segment="All Risk User" revenue="$284,000" activity="5 days ago" />
                    <TableRow no={2} name="Asep Knalpot" score={65} rank="Medium" segment="Reguler User" revenue="$120,000" activity="2 days ago" />
                    <TableRow no={3} name="Ujang Racing" score={35} rank="Low" segment="Power User" revenue="$90,000" activity="1 day ago" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Factors - Horizontal scroll with snap */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Why Customers Are At Risk?</h3>
                <p className="text-xs text-gray-400 mt-1">Top factors contributing to churn</p>
              </div>
              <span className="text-sm text-blue-500 font-medium cursor-pointer flex items-center gap-1 hover:underline">
                Chat Bot <ArrowUp className="rotate-45" size={14} />
              </span>
            </div>
            
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 min-w-[160px] flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-200 bg-blue-50/20 flex items-center justify-center flex-shrink-0 text-blue-500">
                    <LogOut size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Rarely login</span>
                    <span className="text-xl font-bold text-gray-800 leading-tight">30%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Full width on mobile, Fixed on lg+ */}
        <div className="w-full lg:w-[320px] flex flex-col gap-5">
          {/* Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Alerts</h3>
              <span className="text-xs text-blue-500 font-medium cursor-pointer hover:underline">View all</span>
            </div>
            <div className="flex flex-col gap-3">
              <AlertItem type="danger" title="Customer Churn" desc="High prediction for 12 users" time="3m ago" />
              <AlertItem type="warning" title="Activity Drop" desc="Activity decreased by 45%" time="15m ago" />
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-blue-500">
              <HelpCircle size={18} /> <span className="text-gray-800">AI Insight</span>
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
              70% of high-risk customers have shown activity drops in the last 2 weeks.
            </p>
            <button className="w-full sm:w-auto border border-blue-500 text-blue-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              View Details
            </button>
          </div>

          {/* Recommendation */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-red-500">
              <AlertTriangle size={18} /> <span className="text-gray-800">Top Recommendation</span>
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
              Prioritize outreach to 312 high-risk customers with personal consultation.
            </p>
            <button className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              All Recommendations
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
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] ${borderColor} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon size={24} className={iconColor} />}
      </div>
      <div className="min-w-0">
        <h3 className="text-[13px] text-gray-500 font-medium truncate">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center gap-1 text-[11px] font-medium truncate">
          <span className={`flex items-center ${textColor}`}>
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {trend}%
          </span>
          <span className="text-gray-400 hidden sm:inline">last 30 days</span>
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
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition whitespace-nowrap">
      <td className="py-4 px-2">{no}</td>
      <td className="py-4 font-semibold text-gray-800">{name}</td>
      <td className="py-4">
        <div className="flex items-center gap-3">
          <span className="font-medium w-4">{score}</span>
          <div className="w-12 sm:w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden xs:block">
            <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${rankColors[rank]}`}>
          {rank}
        </span>
      </td>
      <td className="py-4">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${segmentColors[segment]}`}>
          {segment}
        </span>
      </td>
      <td className="py-4 font-semibold text-gray-800">{revenue}</td>
      <td className="py-4 text-gray-500">{activity}</td>
      <td className="py-4 text-center">
        <button className="text-blue-500 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-xs font-medium">
          View
        </button>
      </td>
    </tr>
  );
}

function AlertItem({ type, title, desc, time }: any) {
  const styles: any = {
    danger: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: <AlertTriangle size={14} /> },
    warning: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', icon: <Activity size={14} /> },
    info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: <AlertTriangle size={14} /> }
  };
  
  const current = styles[type];

  return (
    <div className={`${current.bg} p-3 rounded-xl border ${current.border}`}>
      <h4 className={`text-[13px] font-bold ${current.text} flex items-center gap-2`}>
        {current.icon} {title}
      </h4>
      <p className="text-[11px] text-gray-500 mt-1 pl-5 leading-tight">{desc}</p>
      <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">{time}</p>
    </div>
  );
}