import { AIInspectionProvider, ImageAnalysis, ComparisonResult } from './AIProvider';
import { EvidenceItem, Finding, ClassificationType, FindingCategory } from '../../types/inspection';

export class DemoAIProvider implements AIInspectionProvider {
  name = 'Demo Mode (Simulated AI Vision)';
  isDemoMode = true;

  async analyzeImage(image: EvidenceItem): Promise<ImageAnalysis> {
    // Ultra-fast response delay
    await new Promise(res => setTimeout(res, 50));

    const features = [
      'Wall surface structure',
      'Baseboard alignment',
      'Floor surface reflectance',
      'Natural lighting variance'
    ];

    const categoryMap: Record<string, FindingCategory[]> = {
      'living room': ['Wall', 'Flooring'],
      'kitchen': ['Countertop', 'Cabinet'],
      'bedroom': ['Flooring', 'Wall'],
      'bathroom': ['Tile', 'Fixtures']
    };

    const roomLower = image.roomName.toLowerCase();
    let categories: FindingCategory[] = ['General'];
    for (const key of Object.keys(categoryMap)) {
      if (roomLower.includes(key)) {
        categories = categoryMap[key];
        break;
      }
    }

    return {
      imageId: image.id,
      detectedFeatures: features,
      qualityScore: 0.94,
      perceivedCondition: 'Sufficient photographic evidence clarity',
      suggestedCategories: categories
    };
  }

  async compareImages(moveIn: EvidenceItem, moveOut: EvidenceItem): Promise<ComparisonResult> {
    await new Promise(res => setTimeout(res, 50));

    const roomName = moveIn.roomName || moveOut.roomName;
    const roomLower = roomName.toLowerCase();

    let classification: ClassificationType = 'UNCHANGED';
    let observation = 'Surfaces and fixtures appear visually consistent with baseline evidence.';
    let category: FindingCategory = 'General';
    let confidence = 0.92;
    let differenceDetails = 'No substantial visual discrepancy identified between move-in and move-out evidence.';
    let locationArea = 'General room area';

    if (roomLower.includes('living')) {
      category = 'Wall';
      locationArea = 'Lower wall corner / skirting board';
      classification = 'POSSIBLE CHANGE';
      observation = 'Minor visible difference observed near the wall corner boundary.';
      differenceDetails = 'Surface tonal variance noted near lower corner. Visual comparison suggests localized scuff mark or paint wear.';
      confidence = 0.88;
    } else if (roomLower.includes('kitchen')) {
      category = 'Cabinet';
      locationArea = 'Upper cabinet hinge and panel edge';
      classification = 'NEEDS REVIEW';
      observation = 'Cabinet door area shows a possible visible change requiring manual review.';
      differenceDetails = 'Edge alignment discrepancy noted on cabinet door frame. Requires physical verification of hinge function.';
      confidence = 0.82;
    } else if (roomLower.includes('bedroom')) {
      category = 'Flooring';
      locationArea = 'Central carpet / hardwood floor plane';
      classification = 'UNCHANGED';
      observation = 'Flooring condition appears visually consistent across both timestamps.';
      differenceDetails = 'Surface texture, color uniformity, and wear levels show strong baseline correlation.';
      confidence = 0.95;
    } else if (roomLower.includes('bathroom')) {
      category = 'Tile';
      locationArea = 'Shower tile grout line';
      classification = 'UNCHANGED';
      observation = 'Tile surface and sealant lines appear generally consistent.';
      differenceDetails = 'Grout sealant and tile surface alignment show normal consistent appearance.';
      confidence = 0.91;
    }

    return {
      moveInEvidenceId: moveIn.id,
      moveOutEvidenceId: moveOut.id,
      roomId: moveIn.roomId,
      roomName,
      category,
      observation,
      classification,
      confidence,
      differenceDetails,
      locationArea
    };
  }

  async classifyFinding(rawFinding: Partial<Finding>): Promise<ClassificationType> {
    return rawFinding.classification || 'NEEDS REVIEW';
  }

  async generateFullInspectionFindings(evidenceList: EvidenceItem[]): Promise<Finding[]> {
    const findings: Finding[] = [];
    const moveInMap = new Map<string, EvidenceItem[]>();
    const moveOutMap = new Map<string, EvidenceItem[]>();

    // Group images by room and type
    for (const item of evidenceList) {
      if (item.type === 'move-in') {
        const arr = moveInMap.get(item.roomId) || [];
        arr.push(item);
        moveInMap.set(item.roomId, arr);
      } else {
        const arr = moveOutMap.get(item.roomId) || [];
        arr.push(item);
        moveOutMap.set(item.roomId, arr);
      }
    }

    // Get all unique room IDs
    const allRoomIds = Array.from(new Set([...Array.from(moveInMap.keys()), ...Array.from(moveOutMap.keys())]));

    for (const roomId of allRoomIds) {
      const moveInImages = moveInMap.get(roomId) || [];
      const moveOutImages = moveOutMap.get(roomId) || [];
      const roomName = moveInImages[0]?.roomName || moveOutImages[0]?.roomName || 'Room';

      if (moveInImages.length > 0 && moveOutImages.length > 0) {
        // Compare corresponding images
        const count = Math.min(moveInImages.length, moveOutImages.length);
        for (let i = 0; i < count; i++) {
          const moveInImg = moveInImages[i];
          const moveOutImg = moveOutImages[i];

          const comp = await this.compareImages(moveInImg, moveOutImg);

          findings.push({
            id: `finding-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            inspectionId: moveInImg.roomId,
            roomId,
            roomName,
            category: comp.category,
            observation: comp.observation,
            classification: comp.classification,
            confidence: comp.confidence,
            moveInEvidenceId: moveInImg.id,
            moveOutEvidenceId: moveOutImg.id,
            moveInImageUrl: moveInImg.dataUrl,
            moveOutImageUrl: moveOutImg.dataUrl,
            differenceDetails: comp.differenceDetails,
            locationArea: comp.locationArea
          });
        }
      } else if (moveInImages.length > 0 || moveOutImages.length > 0) {
        // Insufficient evidence for paired comparison
        const existingImg = moveInImages[0] || moveOutImages[0];
        findings.push({
          id: `finding-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          inspectionId: existingImg.roomId,
          roomId,
          roomName,
          category: 'General',
          observation: 'Single timestamp evidence available. Insufficient matching pair for before/after comparison.',
          classification: 'INSUFFICIENT EVIDENCE',
          confidence: 0.60,
          moveInEvidenceId: existingImg.type === 'move-in' ? existingImg.id : undefined,
          moveOutEvidenceId: existingImg.type === 'move-out' ? existingImg.id : undefined,
          moveInImageUrl: existingImg.type === 'move-in' ? existingImg.dataUrl : undefined,
          moveOutImageUrl: existingImg.type === 'move-out' ? existingImg.dataUrl : undefined,
          differenceDetails: 'Requires corresponding move-in/move-out evidence photograph for visual differential analysis.',
          locationArea: 'Unpaired room photo'
        });
      }
    }

    return findings;
  }
}
