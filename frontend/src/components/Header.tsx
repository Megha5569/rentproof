import React from 'react';
import { Sparkles, Shield, Cpu, RefreshCw, Layers } from 'lucide-react';
import { Inspection } from '../types/inspection';

interface HeaderProps {
  pageTitle: string;
  activeInspection: Inspection | null;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenDemoInspection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  activeInspection,
  isDemoMode,
  onToggleDemoMode,
  onOpenDemoInspection
}) => {
  return (
    <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 no-print shadow-2xs">
      <div>
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">{pageTitle}</h1>
        <p className="text-xs text-stone-500 font-medium">
          {activeInspection 
            ? `${activeInspection.propertyName} (${activeInspection.unitNumber}) • ${activeInspection.rooms.length} Rooms`
            : 'Rental property condition evidence & visual comparison platform'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Demo Inspection Button */}
        <button
          onClick={onOpenDemoInspection}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 transition-colors shadow-2xs cursor-pointer"
          title="Instantly open sample Sunrise Apartments inspection data"
        >
          <Layers size={14} className="text-brand-500" />
          <span>Open Demo Inspection</span>
        </button>

        {/* Demo Mode Toggle Badge */}
        <button
          onClick={onToggleDemoMode}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            isDemoMode
              ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          }`}
          title="Click to toggle between Simulated Demo AI and Cloud Vision AI mode"
        >
          <Cpu size={14} className={isDemoMode ? 'text-amber-600' : 'text-emerald-600'} />
          <span>{isDemoMode ? 'DEMO MODE — Simulated AI Analysis' : 'LIVE AI VISION MODE'}</span>
        </button>
      </div>
    </header>
  );
};
