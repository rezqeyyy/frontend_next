import { FileText, CheckCircle2, Download } from 'lucide-react';

export function UploadRequirements() {
  return (
    <div className="mt-8 bg-[#f8f9fe] rounded-2xl p-6 md:p-8 border border-indigo-50/50">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-1.5 bg-indigo-100/50 rounded-lg">
          <FileText size={18} className="text-[#8b5cf6]" />
        </div>
        <h3 className="font-bold text-gray-800 text-[15px]">CSV Format Requirements</h3>
      </div>
      
      <ul className="space-y-3.5 mb-6">
        <RequirementItem text="First row must contain column headers" />
        <RequirementItem text="Include customer ID and relevant metrics" />
        <RequirementItem text="Recommended columns: tenure, monthly_charges, total_charges, contract_type" />
        <RequirementItem text="Use comma (,) as delimiter" />
      </ul>

      <a 
        href="#" 
        className="inline-flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] font-medium text-[14px] transition-colors mt-2"
      >
        <Download size={16} /> Download Sample CSV Template
      </a>
    </div>
  );
}

function RequirementItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 size={18} className="text-[#10b981] flex-shrink-0 mt-0.5" />
      <span className="text-gray-600 text-[14.5px] leading-relaxed">{text}</span>
    </li>
  );
}