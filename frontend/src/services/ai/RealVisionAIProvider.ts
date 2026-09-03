import { AIInspectionProvider, ImageAnalysis, ComparisonResult } from './AIProvider';
import { EvidenceItem, Finding, ClassificationType } from '../../types/inspection';
import { DemoAIProvider } from './DemoAIProvider';

export class RealVisionAIProvider implements AIInspectionProvider {
  name = 'Live AI Vision Provider (Cloud Multimodal API)';
  isDemoMode = false;

  private apiKey: string;
  private apiEndpoint: string;
  private fallbackDemoProvider = new DemoAIProvider();

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
    this.apiEndpoint = import.meta.env.VITE_AI_ENDPOINT || '/api/ai/analyze';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async analyzeImage(image: EvidenceItem): Promise<ImageAnalysis> {
    if (!this.isConfigured()) {
      console.warn('Real AI API key not provided in environment. Falling back to Demo AI Provider.');
      return this.fallbackDemoProvider.analyzeImage(image);
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ image })
      });
      if (!response.ok) throw new Error(`AI Service returned status ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Real Vision API error, falling back to Demo Mode:', error);
      return this.fallbackDemoProvider.analyzeImage(image);
    }
  }

  async compareImages(moveIn: EvidenceItem, moveOut: EvidenceItem): Promise<ComparisonResult> {
    if (!this.isConfigured()) {
      return this.fallbackDemoProvider.compareImages(moveIn, moveOut);
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ moveIn, moveOut })
      });
      if (!response.ok) throw new Error(`AI Service returned status ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Real Vision API compare error, falling back to Demo Mode:', error);
      return this.fallbackDemoProvider.compareImages(moveIn, moveOut);
    }
  }

  async classifyFinding(rawFinding: Partial<Finding>): Promise<ClassificationType> {
    if (!this.isConfigured()) {
      return this.fallbackDemoProvider.classifyFinding(rawFinding);
    }
    return rawFinding.classification || 'NEEDS REVIEW';
  }

  async generateFullInspectionFindings(evidenceList: EvidenceItem[]): Promise<Finding[]> {
    if (!this.isConfigured()) {
      return this.fallbackDemoProvider.generateFullInspectionFindings(evidenceList);
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/full-inspection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ evidenceList })
      });
      if (!response.ok) throw new Error(`AI Service returned status ${response.status}`);
      const data = await response.json();
      return data.findings;
    } catch (error) {
      console.error('Full inspection API error, falling back to Demo Mode:', error);
      return this.fallbackDemoProvider.generateFullInspectionFindings(evidenceList);
    }
  }
}
