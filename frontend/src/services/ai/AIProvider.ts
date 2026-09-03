import { EvidenceItem, Finding, ClassificationType, FindingCategory } from '../../types/inspection';

export interface ImageAnalysis {
  imageId: string;
  detectedFeatures: string[];
  qualityScore: number;
  perceivedCondition: string;
  suggestedCategories: FindingCategory[];
}

export interface ComparisonResult {
  moveInEvidenceId: string;
  moveOutEvidenceId: string;
  roomId: string;
  roomName: string;
  category: FindingCategory;
  observation: string;
  classification: ClassificationType;
  confidence: number;
  differenceDetails: string;
  locationArea: string;
}

export interface AIInspectionProvider {
  name: string;
  isDemoMode: boolean;
  
  analyzeImage(image: EvidenceItem): Promise<ImageAnalysis>;
  compareImages(moveIn: EvidenceItem, moveOut: EvidenceItem): Promise<ComparisonResult>;
  classifyFinding(rawFinding: Partial<Finding>): Promise<ClassificationType>;
  generateFullInspectionFindings(evidenceList: EvidenceItem[]): Promise<Finding[]>;
}
