interface TableRowProps {
  no: number;
  name: string;
  score: number;
  rank: 'High' | 'Medium' | 'Low';
  segment: 'Reguler User' | 'All Risk User' | 'Power User';
  revenue: string;
  activity: string;
}

export function TableRow({ no, name, score, rank, segment, revenue, activity }: TableRowProps) {
  const rankColors = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-orange-100 text-orange-600',
    Low: 'bg-green-100 text-green-600'
  };

  const segmentColors = {
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