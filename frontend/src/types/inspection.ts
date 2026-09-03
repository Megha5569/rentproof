export type ClassificationType = 
  | 'UNCHANGED'
  | 'POSSIBLE CHANGE'
  | 'NEEDS REVIEW'
  | 'INSUFFICIENT EVIDENCE';

export type FindingCategory = 
  | 'Wall'
  | 'Flooring'
  | 'Countertop'
  | 'Cabinet'
  | 'Fixtures'
  | 'Tile'
  | 'Ceiling'
  | 'Window / Door'
  | 'General';

export interface Room {
  id: string;
  name: string;
  isCustom?: boolean;
}

export interface EvidenceItem {
  id: string;
  roomId: string;
  roomName: string;
  type: 'move-in' | 'move-out';
  dataUrl: string; // Base64 image
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  notes?: string;
}

export interface Finding {
  id: string;
  inspectionId: string;
  roomId: string;
  roomName: string;
  category: FindingCategory;
  observation: string;
  classification: ClassificationType;
  confidence: number; // 0.0 to 1.0
  moveInEvidenceId?: string;
  moveOutEvidenceId?: string;
  moveInImageUrl?: string;
  moveOutImageUrl?: string;
  differenceDetails?: string;
  locationArea?: string;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'agent';
}

export type StepStatus = 'pending' | 'running' | 'completed' | 'needs_review' | 'failed';

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  progress: number; // 0 to 100
}

export type InspectionType = 'Move-in' | 'Move-out' | 'Move-in + Move-out comparison';
export type InspectionStatus = 'Draft' | 'Evidence Uploaded' | 'In Analysis' | 'Completed';

export interface Inspection {
  id: string;
  propertyName: string;
  propertyAddress: string;
  unitNumber: string;
  tenantName?: string;
  landlordName?: string;
  inspectionDate: string;
  inspectionType: InspectionType;
  status: InspectionStatus;
  rooms: Room[];
  evidence: EvidenceItem[];
  findings: Finding[];
  agentLogs: AgentLogEntry[];
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}
