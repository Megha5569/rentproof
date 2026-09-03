import React, { useRef, useEffect } from 'react';
import { AgentLogEntry } from '../types/inspection';
import { Terminal, CheckCircle, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AgentLogConsoleProps {
  logs: AgentLogEntry[];
  heightClass?: string;
}

export const AgentLogConsole: React.FC<AgentLogConsoleProps> = ({ 
  logs, 
  heightClass = 'h-48' 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-stone-900 rounded-xl border border-stone-800 text-stone-200 overflow-hidden shadow-inner font-mono text-xs">
      <div className="bg-stone-950 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-400">
          <Terminal size={14} className="text-brand-500" />
          <span className="font-semibold text-stone-300">Agent Activity & Inspection Log</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-sans">
          <ShieldCheck size={13} />
          <span>Strict Non-Liability Enforcement Active</span>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className={`p-4 overflow-y-auto space-y-2 ${heightClass}`}
      >
        {logs.length === 0 ? (
          <div className="text-stone-500 italic">No agent log entries recorded yet. Click 'Run AI Inspection Agent' to begin analysis.</div>
        ) : (
          logs.map((log) => {
            let icon = <Info size={13} className="text-sky-400 shrink-0 mt-0.5" />;
            let textColor = 'text-stone-300';

            if (log.level === 'success') {
              icon = <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />;
              textColor = 'text-emerald-300';
            } else if (log.level === 'warning') {
              icon = <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />;
              textColor = 'text-amber-300';
            } else if (log.level === 'agent') {
              icon = <Terminal size={13} className="text-brand-500 shrink-0 mt-0.5" />;
              textColor = 'text-brand-300 font-bold';
            }

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-stone-500 shrink-0">{log.timestamp}</span>
                {icon}
                <span className={textColor}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
