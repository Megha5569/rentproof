import React from 'react';
import { AgentStep } from '../types/inspection';
import { CheckCircle2, Loader2, Circle, AlertCircle, Sparkles } from 'lucide-react';

interface AgentVisualizerProps {
  steps: AgentStep[];
  currentStepId?: string;
  isExecuting?: boolean;
}

export const AgentVisualizer: React.FC<AgentVisualizerProps> = ({
  steps,
  currentStepId,
  isExecuting = false
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">RentProof Inspection Agent</h3>
            <p className="text-xs text-stone-500">Autonomous evidence processing & observation pipeline</p>
          </div>
        </div>
        {isExecuting && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500 text-white animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            Agent Running...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          let statusBadge = null;
          let containerBorder = 'border-stone-200 bg-stone-50/50';

          if (step.status === 'completed') {
            containerBorder = 'border-emerald-200 bg-emerald-50/30';
            statusBadge = (
              <span className="text-emerald-600 flex items-center gap-1 text-xs font-semibold">
                <CheckCircle2 size={14} /> Completed
              </span>
            );
          } else if (step.status === 'running') {
            containerBorder = 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20';
            statusBadge = (
              <span className="text-brand-600 flex items-center gap-1 text-xs font-semibold animate-pulse">
                <Loader2 size={14} className="animate-spin" /> In Progress
              </span>
            );
          } else if (step.status === 'needs_review') {
            containerBorder = 'border-amber-200 bg-amber-50/30';
            statusBadge = (
              <span className="text-amber-700 flex items-center gap-1 text-xs font-semibold">
                <AlertCircle size={14} /> Review Needed
              </span>
            );
          } else {
            statusBadge = (
              <span className="text-stone-400 flex items-center gap-1 text-xs font-medium">
                <Circle size={14} /> Pending
              </span>
            );
          }

          return (
            <div 
              key={step.id}
              className={`p-3.5 rounded-lg border transition-all ${containerBorder}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                  Step 0{idx + 1}
                </span>
                {statusBadge}
              </div>
              <h4 className="text-sm font-bold text-stone-800 leading-snug">{step.name}</h4>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{step.description}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-stone-200 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    step.status === 'completed' 
                      ? 'bg-emerald-500' 
                      : step.status === 'running' 
                      ? 'bg-brand-500' 
                      : 'bg-stone-300'
                  }`}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
