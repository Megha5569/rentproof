import React, { useState } from 'react';
import { Inspection, ClassificationType } from '../types/inspection';
import { FindingBadge } from '../components/FindingBadge';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileQuestion, 
  ArrowRight, 
  FileText,
  Filter,
  ShieldCheck
} from 'lucide-react';

interface FindingsPageProps {
  inspection: Inspection;
  onOpenReport: () => void;
}

export const FindingsPage: React.FC<FindingsPageProps> = ({
  inspection,
  onOpenReport
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const totalFindings = inspection.findings.length;
  const unchangedCount = inspection.findings.filter(f => f.classification === 'UNCHANGED').length;
  const possibleChangeCount = inspection.findings.filter(f => f.classification === 'POSSIBLE CHANGE').length;
  const needsReviewCount = inspection.findings.filter(f => f.classification === 'NEEDS REVIEW').length;
  const insufficientCount = inspection.findings.filter(f => f.classification === 'INSUFFICIENT EVIDENCE').length;

  const filteredFindings = filterCategory === 'ALL'
    ? inspection.findings
    : inspection.findings.filter(f => f.classification === filterCategory);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-200">
              Classified Findings Matrix
            </span>
            <span className="text-xs text-stone-500">• Strict Neutral Standard Enforced</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1">Inspection Findings Summary</h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Objective categorization of observable differences across move-in baseline and move-out exit evidence.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
        >
          <span>Generate Full Condition Report</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterCategory === 'ALL' ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-stone-200 bg-white hover:bg-stone-50'
          }`}
        >
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Findings</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{totalFindings}</div>
          <div className="text-[10px] text-stone-400 mt-0.5">Click to view all</div>
        </button>

        <button
          onClick={() => setFilterCategory('UNCHANGED')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterCategory === 'UNCHANGED' ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20' : 'border-stone-200 bg-white hover:bg-stone-50'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={12} /> Unchanged
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{unchangedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Visually consistent</div>
        </button>

        <button
          onClick={() => setFilterCategory('POSSIBLE CHANGE')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterCategory === 'POSSIBLE CHANGE' ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-stone-200 bg-white hover:bg-stone-50'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={12} /> Possible Change
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{possibleChangeCount}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Observable difference</div>
        </button>

        <button
          onClick={() => setFilterCategory('NEEDS REVIEW')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterCategory === 'NEEDS REVIEW' ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20' : 'border-stone-200 bg-white hover:bg-stone-50'
          }`}
        >
          <div className="text-[11px] font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle size={12} /> Needs Review
          </div>
          <div className="text-2xl font-black text-orange-700 mt-1">{needsReviewCount}</div>
          <div className="text-[10px] text-orange-600 mt-0.5">Manual check</div>
        </button>

        <button
          onClick={() => setFilterCategory('INSUFFICIENT EVIDENCE')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            filterCategory === 'INSUFFICIENT EVIDENCE' ? 'border-stone-500 bg-stone-100 ring-2 ring-stone-500/20' : 'border-stone-200 bg-white hover:bg-stone-50'
          }`}
        >
          <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
            <FileQuestion size={12} /> Insufficient
          </div>
          <div className="text-2xl font-black text-stone-700 mt-1">{insufficientCount}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Single timestamp</div>
        </button>
      </div>

      {/* Non-Liability Warning Disclaimer */}
      <div className="p-3.5 px-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs flex items-center gap-2.5">
        <ShieldCheck size={18} className="text-brand-500 shrink-0" />
        <p className="leading-snug">
          <strong>RentProof Standard Compliance Notice:</strong> These observations describe visible differences only. They do NOT determine financial liability, legal fault, or security deposit return status.
        </p>
      </div>

      {/* Grouped Findings List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 px-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-stone-900">
            Observation Details ({filteredFindings.length} Items)
          </h3>
          {filterCategory !== 'ALL' && (
            <button
              onClick={() => setFilterCategory('ALL')}
              className="text-xs font-bold text-brand-600 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {filteredFindings.length === 0 ? (
          <div className="p-10 text-center text-stone-500 text-xs">
            No findings match the selected classification filter.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredFindings.map((finding) => (
              <div key={finding.id} className="p-5 hover:bg-stone-50/50 transition-colors flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      {finding.roomName}
                    </span>
                    <span className="text-xs font-bold text-stone-600">
                      {finding.category} Area
                    </span>
                    {finding.locationArea && (
                      <span className="text-[11px] text-stone-500 font-medium">
                        • {finding.locationArea}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-stone-900 leading-snug">
                    {finding.observation}
                  </p>

                  {finding.differenceDetails && (
                    <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      <strong className="text-stone-800">Visual Evidence Detail:</strong> {finding.differenceDetails}
                    </p>
                  )}
                </div>

                {/* Right Badge & Images */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <FindingBadge classification={finding.classification} size="md" />

                  {/* Thumbnail Pair */}
                  <div className="flex items-center gap-2">
                    {finding.moveInImageUrl ? (
                      <img src={finding.moveInImageUrl} alt="Move-in" className="w-12 h-12 rounded-lg object-cover border border-emerald-300" title="Move-in Photo" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-stone-100 text-[10px] text-stone-400 flex items-center justify-center border border-stone-200">No Move-in</div>
                    )}
                    <span className="text-xs text-stone-300 font-bold">vs</span>
                    {finding.moveOutImageUrl ? (
                      <img src={finding.moveOutImageUrl} alt="Move-out" className="w-12 h-12 rounded-lg object-cover border border-brand-300" title="Move-out Photo" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-stone-100 text-[10px] text-stone-400 flex items-center justify-center border border-stone-200">No Move-out</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
