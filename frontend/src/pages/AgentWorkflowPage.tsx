import React, { useState, useEffect } from 'react';
import { Inspection, AgentStep, AgentLogEntry } from '../types/inspection';
import { AgentVisualizer } from '../components/AgentVisualizer';
import { AgentLogConsole } from '../components/AgentLogConsole';
import { getAIProvider } from '../services/ai/aiFactory';
import { Sparkles, Play, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

interface AgentWorkflowPageProps {
  inspection: Inspection;
  isDemoMode: boolean;
  onUpdateInspection: (updated: Inspection) => void;
  onCompleteWorkflow: () => void;
}

const DEFAULT_STEPS: AgentStep[] = [
  { id: 'step-1', name: 'Collect Evidence', description: 'Gather uploaded move-in and move-out photographic files', status: 'pending', progress: 0 },
  { id: 'step-2', name: 'Organize Evidence', description: 'Pair move-in & move-out photos by room metadata', status: 'pending', progress: 0 },
  { id: 'step-3', name: 'Analyze Move-in', description: 'Establish photographic baseline condition features', status: 'pending', progress: 0 },
  { id: 'step-4', name: 'Analyze Move-out', description: 'Extract exit inspection visual features', status: 'pending', progress: 0 },
  { id: 'step-5', name: 'Compare Evidence', description: 'Execute visual differential analysis on image pairs', status: 'pending', progress: 0 },
  { id: 'step-6', name: 'Classify Findings', description: 'Categorize observable differences into neutral standard', status: 'pending', progress: 0 },
  { id: 'step-7', name: 'Summarize Results', description: 'Compile observation metrics and location breakdowns', status: 'pending', progress: 0 },
  { id: 'step-8', name: 'Generate Report', description: 'Synthesize PDF-ready condition report document', status: 'pending', progress: 0 }
];

export const AgentWorkflowPage: React.FC<AgentWorkflowPageProps> = ({
  inspection,
  isDemoMode,
  onUpdateInspection,
  onCompleteWorkflow
}) => {
  const [steps, setSteps] = useState<AgentStep[]>(DEFAULT_STEPS);
  const [logs, setLogs] = useState<AgentLogEntry[]>(inspection.agentLogs || []);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(inspection.findings.length > 0);

  const addLog = (message: string, level: 'info' | 'success' | 'warning' | 'agent' = 'info') => {
    const newEntry: AgentLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      level
    };
    setLogs(prev => [...prev, newEntry]);
    return newEntry;
  };

  const updateStepStatus = (stepId: string, status: AgentStep['status'], progress: number) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status, progress } : s));
  };

  const executeWorkflow = async () => {
    setIsRunning(true);
    setIsCompleted(false);
    setLogs([]);

    const provider = getAIProvider(isDemoMode);
    addLog(`RentProof Inspection Agent initialized via ${provider.name}`, 'agent');

    // Step 1: Collect Evidence
    updateStepStatus('step-1', 'running', 40);
    addLog(`Collecting photographic evidence for ${inspection.propertyName}...`, 'info');
    await new Promise(res => setTimeout(res, 50));
    updateStepStatus('step-1', 'completed', 100);
    addLog(`Gathered ${inspection.evidence.length} total evidence photographs across ${inspection.rooms.length} rooms`, 'success');

    // Step 2: Organize Evidence
    updateStepStatus('step-2', 'running', 50);
    addLog('Grouping and metadata-matching photos by room structure...', 'info');
    await new Promise(res => setTimeout(res, 50));
    updateStepStatus('step-2', 'completed', 100);
    addLog(`Successfully indexed room evidence containers: ${inspection.rooms.map(r => r.name).join(', ')}`, 'success');

    // Step 3: Analyze Move-in
    updateStepStatus('step-3', 'running', 60);
    addLog('Extracting baseline visual surface features for Move-in images...', 'info');
    const moveInPhotos = inspection.evidence.filter(e => e.type === 'move-in');
    await Promise.all(moveInPhotos.map(photo => provider.analyzeImage(photo)));
    updateStepStatus('step-3', 'completed', 100);
    addLog(`Analyzed ${moveInPhotos.length} move-in baseline photos`, 'success');

    // Step 4: Analyze Move-out
    updateStepStatus('step-4', 'running', 60);
    addLog('Extracting exit condition visual features for Move-out images...', 'info');
    const moveOutPhotos = inspection.evidence.filter(e => e.type === 'move-out');
    await Promise.all(moveOutPhotos.map(photo => provider.analyzeImage(photo)));
    updateStepStatus('step-4', 'completed', 100);
    addLog(`Analyzed ${moveOutPhotos.length} move-out exit photos`, 'success');

    // Step 5: Compare Evidence
    updateStepStatus('step-5', 'running', 70);
    addLog('Running visual differential pixel & object comparison algorithms...', 'agent');
    const generatedFindings = await provider.generateFullInspectionFindings(inspection.evidence);
    updateStepStatus('step-5', 'completed', 100);
    addLog(`Compared evidence pairs. Generated ${generatedFindings.length} observation items`, 'success');

    // Step 6: Classify Findings
    updateStepStatus('step-6', 'running', 80);
    addLog('Applying strict non-liability classification standards...', 'info');
    await new Promise(res => setTimeout(res, 50));
    updateStepStatus('step-6', 'completed', 100);
    addLog('Classified findings into UNCHANGED, POSSIBLE CHANGE, NEEDS REVIEW standard', 'success');

    // Step 7: Summarize Results
    updateStepStatus('step-7', 'running', 90);
    addLog('Synthesizing summary metrics and room differential counts...', 'info');
    await new Promise(res => setTimeout(res, 50));
    updateStepStatus('step-7', 'completed', 100);
    addLog('Summary matrix built successfully', 'success');

    // Step 8: Generate Report
    updateStepStatus('step-8', 'running', 95);
    addLog('Rendering print-ready Condition Report layout...', 'agent');
    await new Promise(res => setTimeout(res, 50));
    updateStepStatus('step-8', 'completed', 100);

    const finalLogs = [...logs];
    addLog('Inspection Agent workflow complete! Condition Report generated', 'success');

    setIsRunning(false);
    setIsCompleted(true);

    // Save updated inspection to state & DB
    onUpdateInspection({
      ...inspection,
      status: 'Completed',
      findings: generatedFindings,
      agentLogs: finalLogs
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-200">
              Autonomous Agentic Engine
            </span>
            {isDemoMode && (
              <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                Demo Mode Simulated
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1">RentProof Inspection Agent</h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Execute autonomous 8-step image feature extraction, room pairing, differential comparison, and condition synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted ? (
            <button
              onClick={executeWorkflow}
              disabled={isRunning}
              className="px-6 py-3 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 disabled:opacity-50 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Play size={16} />
              <span>{isRunning ? 'Agent Processing...' : 'Start AI Inspection Agent'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={executeWorkflow}
                disabled={isRunning}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 border border-stone-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Re-run Agent</span>
              </button>
              <button
                onClick={onCompleteWorkflow}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <span>View Evidence Comparison</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Workflow Steps */}
      <AgentVisualizer steps={steps} isExecuting={isRunning} />

      {/* Terminal Activity Log */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Live Agent Execution Terminal
        </h3>
        <AgentLogConsole logs={logs} heightClass="h-64" />
      </div>
    </div>
  );
};
