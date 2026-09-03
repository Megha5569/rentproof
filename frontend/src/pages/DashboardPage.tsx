import React from 'react';
import { Inspection } from '../types/inspection';
import { FindingBadge } from '../components/FindingBadge';
import { 
  FilePlus, 
  Layers, 
  Building2, 
  Calendar, 
  DoorOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Trash2,
  FileText
} from 'lucide-react';

interface DashboardPageProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  onCreateNew: () => void;
  onOpenDemoInspection: () => void;
  onDeleteInspection: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  inspections,
  onSelectInspection,
  onCreateNew,
  onOpenDemoInspection,
  onDeleteInspection
}) => {
  const totalRoomsAnalyzed = inspections.reduce((acc, i) => acc + i.rooms.length, 0);
  const totalFindings = inspections.reduce((acc, i) => acc + i.findings.length, 0);
  const possibleChanges = inspections.reduce((acc, i) => acc + i.findings.filter(f => f.classification === 'POSSIBLE CHANGE').length, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="inline-block bg-brand-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            Property Condition Standard
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">RentProof Evidence Engine</h2>
          <p className="text-stone-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Organize move-in and move-out condition photos, run AI agent comparisons by room, and generate neutral, print-ready reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10 shrink-0">
          <button
            onClick={onCreateNew}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-md shadow-brand-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FilePlus size={16} />
            <span>+ Create Inspection</span>
          </button>
          <button
            onClick={onOpenDemoInspection}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Layers size={16} className="text-brand-500" />
            <span>Open Demo Inspection</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Inspections</span>
            <Building2 size={16} className="text-stone-400" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{inspections.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Saved in local browser database</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Rooms Inspected</span>
            <DoorOpen size={16} className="text-stone-400" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{totalRoomsAnalyzed}</div>
          <div className="text-[11px] text-stone-500 mt-1">Across all properties</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Observable Differences</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{possibleChanges}</div>
          <div className="text-[11px] text-stone-500 mt-1">Possible changes identified</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Reports Generated</span>
            <FileText size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {inspections.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Print/PDF ready</div>
        </div>
      </div>

      {/* Recent Inspections Table / List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Property Inspections</h3>
            <p className="text-xs text-stone-500">Recent property evidence comparisons & reports</p>
          </div>
          {inspections.length > 0 && (
            <button
              onClick={onCreateNew}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
            >
              + Add New
            </button>
          )}
        </div>

        {inspections.length === 0 ? (
          /* Empty state */
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
              <Building2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-stone-900">No inspections yet</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Create your first property inspection to start organizing move-in and move-out condition evidence photos.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onCreateNew}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-all shadow-sm cursor-pointer"
              >
                + Create Inspection
              </button>
              <button
                onClick={onOpenDemoInspection}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition-all border border-stone-300 cursor-pointer"
              >
                Open Demo Inspection
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {inspections.map((item) => (
              <div 
                key={item.id} 
                className="p-4 hover:bg-stone-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-stone-900">{item.propertyName}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                      {item.unitNumber}
                    </span>
                    {item.isDemo && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        DEMO
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {item.inspectionDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><DoorOpen size={12} /> {item.rooms.length} Rooms</span>
                    <span>•</span>
                    <span>{item.evidence.length} Evidence Photos</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'
                    }`}>
                      {item.status}
                    </span>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {item.findings.length} Findings Classified
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectInspection(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white font-bold text-xs hover:bg-brand-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteInspection(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Inspection"
                    >
                      <Trash2 size={16} />
                    </button>
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
