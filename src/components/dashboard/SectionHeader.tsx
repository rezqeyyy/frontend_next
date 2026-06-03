import { ArrowUp } from 'lucide-react';

export function SectionHeader({ title, subtitle, linkText }: any) {
    return (
        <div className="flex justify-between items-center mb-5">
        <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <span className="text-sm text-blue-500 font-medium cursor-pointer flex items-center gap-1 hover:underline">
            {linkText} <ArrowUp className="rotate-45" size={14} />
        </span>
        </div>
    );
}