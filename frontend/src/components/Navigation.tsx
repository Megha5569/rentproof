import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  DoorOpen, 
  Upload, 
  Sparkles, 
  Columns, 
  FileCheck2, 
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'create' 
  | 'rooms' 
  | 'move-in' 
  | 'move-out' 
  | 'agent' 
  | 'comparison' 
  | 'findings' 
  | 'report';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  hasActiveInspection: boolean;
  activePropertyName?: string;
  activeUnitNumber?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  hasActiveInspection,
  activePropertyName,
  activeUnitNumber
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard, category: 'Main' },
    { id: 'create' as ActiveTab, label: 'Create Inspection', icon: FilePlus, category: 'Inspection' },
    { id: 'rooms' as ActiveTab, label: 'Room Management', icon: DoorOpen, category: 'Inspection', disabled: !hasActiveInspection },
    { id: 'move-in' as ActiveTab, label: 'Move-in Evidence', icon: Upload, category: 'Evidence', disabled: !hasActiveInspection },
    { id: 'move-out' as ActiveTab, label: 'Move-out Evidence', icon: Upload, category: 'Evidence', disabled: !hasActiveInspection },
    { id: 'agent' as ActiveTab, label: 'AI Inspection Agent', icon: Sparkles, category: 'Analysis', disabled: !hasActiveInspection, badge: 'Agentic' },
    { id: 'comparison' as ActiveTab, label: 'Evidence Comparison', icon: Columns, category: 'Analysis', disabled: !hasActiveInspection },
    { id: 'findings' as ActiveTab, label: 'Findings & Results', icon: FileCheck2, category: 'Analysis', disabled: !hasActiveInspection },
    { id: 'report' as ActiveTab, label: 'Condition Report', icon: FileText, category: 'Report', disabled: !hasActiveInspection },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 shrink-0 flex flex-col justify-between h-screen sticky top-0 no-print select-none shadow-2xs">
      <div>
        {/* Logo Branding */}
        <div className="p-5 border-b border-stone-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-brand-500/20">
            RP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-stone-900 tracking-tight">RENTPROOF</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium leading-none">Property Condition Platform</p>
          </div>
        </div>

        {/* Active Context Banner */}
        {hasActiveInspection && activePropertyName && (
          <div className="mx-3 mt-3 p-2.5 rounded-lg bg-brand-50 border border-brand-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 block">Active Inspection</span>
            <div className="text-xs font-bold text-stone-900 truncate mt-0.5">{activePropertyName}</div>
            <div className="text-[11px] text-stone-600">{activeUnitNumber || 'Unit'}</div>
          </div>
        )}

        {/* Nav list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onSelectTab(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                    : isDisabled
                    ? 'text-stone-300 cursor-not-allowed'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : isDisabled ? 'text-stone-300' : 'text-stone-500 group-hover:text-stone-900'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${isActive ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && <ChevronRight size={14} className="opacity-70" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
          <ShieldCheck size={16} className="shrink-0" />
          <span>Neutral Evidence Standard</span>
        </div>
        <p className="text-[10px] text-stone-500 mt-1 leading-normal">
          Objective visual observation platform. Excludes liability & deposit determinations.
        </p>
      </div>
    </aside>
  );
};
