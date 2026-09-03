import React from 'react';
import { Inspection } from '../types/inspection';
import { FindingBadge } from '../components/FindingBadge';
import { Printer, Download, ShieldCheck, AlertCircle, Building2, Calendar, FileText, CheckCircle } from 'lucide-react';

interface ConditionReportPageProps {
  inspection: Inspection;
  isDemoMode: boolean;
}

export const ConditionReportPage: React.FC<ConditionReportPageProps> = ({
  inspection,
  isDemoMode
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 px-6 shadow-xs flex items-center justify-between no-print">
        <div>
          <h2 className="text-base font-extrabold text-stone-900">Condition Report Export</h2>
          <p className="text-xs text-stone-500">Print or save this document as a PDF report</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-stone-900 text-white font-extrabold text-xs hover:bg-stone-800 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Actual Printable Report Sheet */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-md print-container print-card space-y-8">
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 text-white font-black flex items-center justify-center text-sm">
                RP
              </div>
              <span className="text-xl font-black text-stone-900 tracking-tight">RENTPROOF</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 mt-2 tracking-tight">
              RENTAL PROPERTY CONDITION REPORT
            </h1>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider mt-0.5">
              Photographic Evidence Comparison & Visual Observation Document
            </p>
          </div>

          <div className="text-right text-xs space-y-1 text-stone-600">
            <div><strong className="text-stone-900">Report Reference:</strong> #{inspection.id.substring(0, 8)}</div>
            <div><strong className="text-stone-900">Generated:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong className="text-stone-900">Status:</strong> {inspection.status}</div>
          </div>
        </div>

        {/* Demo Mode Notice Banner if applicable */}
        {(isDemoMode || inspection.isDemo) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>
              <strong>DEMO MODE NOTICE:</strong> AI analysis shown in this report is simulated for demonstration purposes.
            </span>
          </div>
        )}

        {/* Section 1: Property & Inspection Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Property Name</span>
            <span className="text-sm font-extrabold text-stone-900">{inspection.propertyName}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Unit / Flat #</span>
            <span className="text-sm font-extrabold text-stone-900">{inspection.unitNumber}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Inspection Date</span>
            <span className="text-sm font-extrabold text-stone-900">{inspection.inspectionDate}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Inspection Type</span>
            <span className="text-sm font-extrabold text-stone-900">{inspection.inspectionType}</span>
          </div>

          {inspection.tenantName && (
            <div>
              <span className="text-[10px] font-bold uppercase text-stone-400 block">Tenant Name</span>
              <span className="text-xs font-bold text-stone-800">{inspection.tenantName}</span>
            </div>
          )}

          {inspection.landlordName && (
            <div>
              <span className="text-[10px] font-bold uppercase text-stone-400 block">Landlord / Manager</span>
              <span className="text-xs font-bold text-stone-800">{inspection.landlordName}</span>
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Total Rooms</span>
            <span className="text-xs font-bold text-stone-800">{inspection.rooms.length} Inspected</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Photographs</span>
            <span className="text-xs font-bold text-stone-800">{inspection.evidence.length} Uploaded</span>
          </div>
        </div>

        {/* Section 2: Executive Findings Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-2">
            1. Observable Condition Findings Matrix
          </h3>

          <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden">
            {inspection.findings.map((finding) => (
              <div key={finding.id} className="p-4 bg-white flex flex-col md:flex-row items-start justify-between gap-4 print-card">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-900">{finding.roomName}</span>
                    <span className="text-xs text-stone-500 font-semibold">• {finding.category}</span>
                  </div>
                  <p className="text-xs font-bold text-stone-800 leading-snug">
                    {finding.observation}
                  </p>
                  {finding.differenceDetails && (
                    <p className="text-[11px] text-stone-600">
                      <strong>Visual Detail:</strong> {finding.differenceDetails}
                    </p>
                  )}
                </div>

                <FindingBadge classification={finding.classification} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Room Evidence Photo Comparison Grid */}
        <div className="space-y-4 page-break">
          <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-2">
            2. Photographic Evidence Comparison Details
          </h3>

          <div className="space-y-6">
            {inspection.rooms.map((room) => {
              const moveInImg = inspection.evidence.find(e => e.roomId === room.id && e.type === 'move-in')?.dataUrl;
              const moveOutImg = inspection.evidence.find(e => e.roomId === room.id && e.type === 'move-out')?.dataUrl;
              const roomFinding = inspection.findings.find(f => f.roomId === room.id);

              return (
                <div key={room.id} className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white print-card">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <h4 className="text-sm font-extrabold text-stone-900">{room.name}</h4>
                    {roomFinding && <FindingBadge classification={roomFinding.classification} size="sm" />}
                  </div>

                  {moveInImg && moveOutImg ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 block mb-1">MOVE-IN BASELINE</span>
                        <img src={moveInImg} alt="Move-in" className="w-full h-44 object-cover rounded-lg border border-stone-200" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-brand-800 block mb-1">MOVE-OUT EXIT</span>
                        <img src={moveOutImg} alt="Move-out" className="w-full h-44 object-cover rounded-lg border border-stone-200" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic">Single photographic evidence timestamp available for this room.</p>
                  )}

                  {roomFinding && (
                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      <strong>Observation:</strong> {roomFinding.observation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Mandatory Legal Non-Liability Disclaimer */}
        <div className="pt-6 border-t-2 border-stone-900 space-y-2">
          <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-brand-500" />
            Standard Evidence Disclaimer & Usage Terms
          </h4>
          <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
            "This report summarizes observable differences in the provided photographic evidence. It does not determine responsibility, legal liability, or entitlement to a rental deposit. Findings may require human review."
          </p>
        </div>
      </div>
    </div>
  );
};
