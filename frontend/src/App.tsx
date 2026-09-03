import React, { useState, useEffect } from 'react';
import { Inspection } from './types/inspection';
import { dbStorage } from './services/db';
import { getDemoInspection, DEMO_INSPECTION_ID } from './data/demoInspection';
import { Navigation, ActiveTab } from './components/Navigation';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { CreateInspectionPage } from './pages/CreateInspectionPage';
import { RoomManagementPage } from './pages/RoomManagementPage';
import { EvidenceUploadPage } from './pages/EvidenceUploadPage';
import { AgentWorkflowPage } from './pages/AgentWorkflowPage';
import { EvidenceComparisonPage } from './pages/EvidenceComparisonPage';
import { FindingsPage } from './pages/FindingsPage';
import { ConditionReportPage } from './pages/ConditionReportPage';

export const App: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize DB and load inspections on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        let loaded = await dbStorage.getAllInspections();
        if (loaded.length === 0) {
          // Preload demo inspection out of the box
          const demo = getDemoInspection();
          await dbStorage.saveInspection(demo);
          loaded = [demo];
        }
        setInspections(loaded);
        setActiveInspectionId(loaded[0]?.id || null);
      } catch (err) {
        console.error('Failed to initialize local DB:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const activeInspection = inspections.find(i => i.id === activeInspectionId) || null;

  const handleSaveInspection = async (updated: Inspection) => {
    setInspections(prev => {
      const idx = prev.findIndex(i => i.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    try {
      await dbStorage.saveInspection(updated);
    } catch (err) {
      console.error('DB save error:', err);
    }
  };

  const handleCreateNewInspection = async (newPartial: Partial<Inspection>) => {
    const newInspection: Inspection = {
      id: `insp-${Date.now()}`,
      propertyName: newPartial.propertyName || 'Property',
      propertyAddress: newPartial.propertyAddress || '',
      unitNumber: newPartial.unitNumber || '',
      tenantName: newPartial.tenantName,
      landlordName: newPartial.landlordName,
      inspectionDate: newPartial.inspectionDate || new Date().toISOString().split('T')[0],
      inspectionType: newPartial.inspectionType || 'Move-in + Move-out comparison',
      status: 'Draft',
      rooms: newPartial.rooms || [],
      evidence: [],
      findings: [],
      agentLogs: newPartial.agentLogs || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await handleSaveInspection(newInspection);
    setActiveInspectionId(newInspection.id);
    setActiveTab('rooms');
  };

  const handleOpenDemoInspection = async () => {
    const demo = getDemoInspection();
    await handleSaveInspection(demo);
    setActiveInspectionId(demo.id);
    setActiveTab('comparison');
  };

  const handleDeleteInspection = async (id: string) => {
    setInspections(prev => prev.filter(i => i.id !== id));
    if (activeInspectionId === id) {
      const remaining = inspections.filter(i => i.id !== id);
      setActiveInspectionId(remaining[0]?.id || null);
    }
    await dbStorage.deleteInspection(id);
  };

  const pageTitles: Record<ActiveTab, string> = {
    dashboard: 'Dashboard',
    create: 'Create Property Inspection',
    rooms: 'Room Management',
    'move-in': 'Move-in Photo Upload',
    'move-out': 'Move-out Photo Upload',
    agent: 'AI Inspection Agent Workflow',
    comparison: 'Evidence Comparison',
    findings: 'Classified Findings & Results',
    report: 'Condition Report'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500 text-white font-black text-2xl flex items-center justify-center mx-auto animate-bounce">
            RP
          </div>
          <h2 className="text-lg font-bold text-stone-900">Loading RentProof Engine...</h2>
          <p className="text-xs text-stone-500">Initializing browser storage & evidence database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-50 text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasActiveInspection={Boolean(activeInspection)}
        activePropertyName={activeInspection?.propertyName}
        activeUnitNumber={activeInspection?.unitNumber}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          pageTitle={pageTitles[activeTab]}
          activeInspection={activeInspection}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
          onOpenDemoInspection={handleOpenDemoInspection}
        />

        <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              inspections={inspections}
              onSelectInspection={(item) => {
                setActiveInspectionId(item.id);
                setActiveTab('comparison');
              }}
              onCreateNew={() => setActiveTab('create')}
              onOpenDemoInspection={handleOpenDemoInspection}
              onDeleteInspection={handleDeleteInspection}
            />
          )}

          {activeTab === 'create' && (
            <CreateInspectionPage
              onSave={handleCreateNewInspection}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'rooms' && activeInspection && (
            <RoomManagementPage
              inspection={activeInspection}
              onUpdateInspection={handleSaveInspection}
              onNext={() => setActiveTab('move-in')}
              onBack={() => setActiveTab('create')}
            />
          )}

          {activeTab === 'move-in' && activeInspection && (
            <EvidenceUploadPage
              inspection={activeInspection}
              mode="move-in"
              onUpdateInspection={handleSaveInspection}
              onNext={() => setActiveTab('move-out')}
              onBack={() => setActiveTab('rooms')}
            />
          )}

          {activeTab === 'move-out' && activeInspection && (
            <EvidenceUploadPage
              inspection={activeInspection}
              mode="move-out"
              onUpdateInspection={handleSaveInspection}
              onNext={() => setActiveTab('agent')}
              onBack={() => setActiveTab('move-in')}
            />
          )}

          {activeTab === 'agent' && activeInspection && (
            <AgentWorkflowPage
              inspection={activeInspection}
              isDemoMode={isDemoMode}
              onUpdateInspection={handleSaveInspection}
              onCompleteWorkflow={() => setActiveTab('comparison')}
            />
          )}

          {activeTab === 'comparison' && activeInspection && (
            <EvidenceComparisonPage
              inspection={activeInspection}
              onNext={() => setActiveTab('findings')}
            />
          )}

          {activeTab === 'findings' && activeInspection && (
            <FindingsPage
              inspection={activeInspection}
              onOpenReport={() => setActiveTab('report')}
            />
          )}

          {activeTab === 'report' && activeInspection && (
            <ConditionReportPage
              inspection={activeInspection}
              isDemoMode={isDemoMode}
            />
          )}
        </main>
      </div>
    </div>
  );
};
