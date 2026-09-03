import { Inspection } from '../types/inspection';
import { createPropertyCanvasImage } from '../utils/imageGenerator';

export const DEMO_INSPECTION_ID = 'demo-sunrise-flat-204';

export function getDemoInspection(): Inspection {
  // Generate crisp canvas base64 photographic evidence
  const livingMoveIn = createPropertyCanvasImage('Living Room - Main Wall', 'Move-in Condition Baseline', 'move-in', '#3F3F46', '#27272A', false);
  const livingMoveOut = createPropertyCanvasImage('Living Room - Main Wall', 'Move-out Condition Evidence', 'move-out', '#3F3F46', '#27272A', true);

  const kitchenMoveIn = createPropertyCanvasImage('Kitchen - Counter & Cabinets', 'Move-in Baseline', 'move-in', '#475569', '#334155', false);
  const kitchenMoveOut = createPropertyCanvasImage('Kitchen - Counter & Cabinets', 'Move-out Evidence', 'move-out', '#475569', '#334155', false);

  const bedroomMoveIn = createPropertyCanvasImage('Master Bedroom - Hardwood', 'Move-in Baseline', 'move-in', '#78350F', '#451A03', false);
  const bedroomMoveOut = createPropertyCanvasImage('Master Bedroom - Hardwood', 'Move-out Evidence', 'move-out', '#78350F', '#451A03', false);

  const bathMoveIn = createPropertyCanvasImage('Bathroom - Shower Tiles', 'Move-in Baseline', 'move-in', '#0369A1', '#075985', false);
  const bathMoveOut = createPropertyCanvasImage('Bathroom - Shower Tiles', 'Move-out Evidence', 'move-out', '#0369A1', '#075985', false);

  return {
    id: DEMO_INSPECTION_ID,
    propertyName: 'Sunrise Apartments',
    propertyAddress: '104 Sunburst Boulevard, Westside District',
    unitNumber: 'Flat 204',
    tenantName: 'Alex Rivera',
    landlordName: 'Apex Property Management',
    inspectionDate: '2026-01-15',
    inspectionType: 'Move-in + Move-out comparison',
    status: 'Completed',
    isDemo: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
    rooms: [
      { id: 'room-living', name: 'Living Room' },
      { id: 'room-kitchen', name: 'Kitchen' },
      { id: 'room-bedroom', name: 'Bedroom' },
      { id: 'room-bathroom', name: 'Bathroom' }
    ],
    evidence: [
      {
        id: 'ev-living-in',
        roomId: 'room-living',
        roomName: 'Living Room',
        type: 'move-in',
        dataUrl: livingMoveIn,
        fileName: 'living_room_move_in_01.jpg',
        fileSize: 245000,
        mimeType: 'image/jpeg',
        uploadedAt: '2025-01-15T09:30:00.000Z',
        notes: 'East wall baseline photo near patio door.'
      },
      {
        id: 'ev-living-out',
        roomId: 'room-living',
        roomName: 'Living Room',
        type: 'move-out',
        dataUrl: livingMoveOut,
        fileName: 'living_room_move_out_01.jpg',
        fileSize: 258000,
        mimeType: 'image/jpeg',
        uploadedAt: '2026-01-15T10:15:00.000Z',
        notes: 'East wall exit inspection photo.'
      },
      {
        id: 'ev-kitchen-in',
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        type: 'move-in',
        dataUrl: kitchenMoveIn,
        fileName: 'kitchen_counter_move_in.jpg',
        fileSize: 210000,
        mimeType: 'image/jpeg',
        uploadedAt: '2025-01-15T09:35:00.000Z'
      },
      {
        id: 'ev-kitchen-out',
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        type: 'move-out',
        dataUrl: kitchenMoveOut,
        fileName: 'kitchen_counter_move_out.jpg',
        fileSize: 215000,
        mimeType: 'image/jpeg',
        uploadedAt: '2026-01-15T10:20:00.000Z'
      },
      {
        id: 'ev-bedroom-in',
        roomId: 'room-bedroom',
        roomName: 'Bedroom',
        type: 'move-in',
        dataUrl: bedroomMoveIn,
        fileName: 'bedroom_flooring_move_in.jpg',
        fileSize: 195000,
        mimeType: 'image/jpeg',
        uploadedAt: '2025-01-15T09:40:00.000Z'
      },
      {
        id: 'ev-bedroom-out',
        roomId: 'room-bedroom',
        roomName: 'Bedroom',
        type: 'move-out',
        dataUrl: bedroomMoveOut,
        fileName: 'bedroom_flooring_move_out.jpg',
        fileSize: 198000,
        mimeType: 'image/jpeg',
        uploadedAt: '2026-01-15T10:25:00.000Z'
      },
      {
        id: 'ev-bath-in',
        roomId: 'room-bathroom',
        roomName: 'Bathroom',
        type: 'move-in',
        dataUrl: bathMoveIn,
        fileName: 'bathroom_tile_move_in.jpg',
        fileSize: 185000,
        mimeType: 'image/jpeg',
        uploadedAt: '2025-01-15T09:45:00.000Z'
      },
      {
        id: 'ev-bath-out',
        roomId: 'room-bathroom',
        roomName: 'Bathroom',
        type: 'move-out',
        dataUrl: bathMoveOut,
        fileName: 'bathroom_tile_move_out.jpg',
        fileSize: 189000,
        mimeType: 'image/jpeg',
        uploadedAt: '2026-01-15T10:30:00.000Z'
      }
    ],
    findings: [
      {
        id: 'finding-demo-1',
        inspectionId: DEMO_INSPECTION_ID,
        roomId: 'room-living',
        roomName: 'Living Room',
        category: 'Wall',
        observation: 'Minor visible difference observed near lower wall corner boundary.',
        classification: 'POSSIBLE CHANGE',
        confidence: 0.89,
        moveInEvidenceId: 'ev-living-in',
        moveOutEvidenceId: 'ev-living-out',
        moveInImageUrl: livingMoveIn,
        moveOutImageUrl: livingMoveOut,
        differenceDetails: 'Localized tonal variance noted near lower skirting boundary. Visual comparison suggests light scuff mark.',
        locationArea: 'East Wall - Skirting Corner'
      },
      {
        id: 'finding-demo-2',
        inspectionId: DEMO_INSPECTION_ID,
        roomId: 'room-kitchen',
        roomName: 'Kitchen',
        category: 'Cabinet',
        observation: 'Cabinet area shows a possible visible change requiring manual review.',
        classification: 'NEEDS REVIEW',
        confidence: 0.82,
        moveInEvidenceId: 'ev-kitchen-in',
        moveOutEvidenceId: 'ev-kitchen-out',
        moveInImageUrl: kitchenMoveIn,
        moveOutImageUrl: kitchenMoveOut,
        differenceDetails: 'Upper cabinet edge alignment discrepancy noted. Physical hinge check recommended.',
        locationArea: 'Upper Overhead Cabinets'
      },
      {
        id: 'finding-demo-3',
        inspectionId: DEMO_INSPECTION_ID,
        roomId: 'room-bedroom',
        roomName: 'Bedroom',
        category: 'Flooring',
        observation: 'Flooring condition appears visually consistent across baseline and exit photos.',
        classification: 'UNCHANGED',
        confidence: 0.96,
        moveInEvidenceId: 'ev-bedroom-in',
        moveOutEvidenceId: 'ev-bedroom-out',
        moveInImageUrl: bedroomMoveIn,
        moveOutImageUrl: bedroomMoveOut,
        differenceDetails: 'Surface finish, plank alignment, and color tone show strong visual correlation.',
        locationArea: 'Main Room Floor Plane'
      },
      {
        id: 'finding-demo-4',
        inspectionId: DEMO_INSPECTION_ID,
        roomId: 'room-bathroom',
        roomName: 'Bathroom',
        category: 'Tile',
        observation: 'Tile surface and sealant lines appear generally consistent.',
        classification: 'UNCHANGED',
        confidence: 0.93,
        moveInEvidenceId: 'ev-bath-in',
        moveOutEvidenceId: 'ev-bath-out',
        moveInImageUrl: bathMoveIn,
        moveOutImageUrl: bathMoveOut,
        differenceDetails: 'Shower wall tile grout lines and sealant remain visually uniform.',
        locationArea: 'Shower Enclosure Walls'
      }
    ],
    agentLogs: [
      { id: 'log-1', timestamp: '10:42:03', message: 'Evidence collection initialized across 4 property rooms', level: 'info' },
      { id: 'log-2', timestamp: '10:42:05', message: '8 high-resolution photographic evidence files loaded', level: 'info' },
      { id: 'log-3', timestamp: '10:42:06', message: 'Evidence successfully paired by room & timestamp metadata', level: 'success' },
      { id: 'log-4', timestamp: '10:42:08', message: 'Move-in photographic baseline analysis completed', level: 'info' },
      { id: 'log-5', timestamp: '10:42:10', message: 'Move-out exit condition evidence analyzed', level: 'info' },
      { id: 'log-6', timestamp: '10:42:12', message: 'Visual differential comparison executed across 4 photo pairs', level: 'agent' },
      { id: 'log-7', timestamp: '10:42:13', message: '4 findings classified with strict non-liability compliance', level: 'success' },
      { id: 'log-8', timestamp: '10:42:14', message: 'Professional condition report compiled and ready for PDF export', level: 'success' }
    ]
  };
}
