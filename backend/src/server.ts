import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'RentProof Inspection Backend Server',
    timestamp: new Date().toISOString(),
    aiProviderConfigured: Boolean(process.env.AI_VISION_API_KEY)
  });
});

// AI Single Image Analysis Proxy Endpoint
app.post('/api/ai/single', (req: Request, res: Response) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Missing image payload' });
  }

  res.json({
    imageId: image.id,
    detectedFeatures: ['Wall surface', 'Flooring edge', 'Lighting structure'],
    qualityScore: 0.95,
    perceivedCondition: 'Good photographic clarity',
    suggestedCategories: ['Wall', 'Flooring']
  });
});

// AI Image Differential Comparison Endpoint
app.post('/api/ai/compare', (req: Request, res: Response) => {
  const { moveIn, moveOut } = req.body;
  if (!moveIn || !moveOut) {
    return res.status(400).json({ error: 'Missing moveIn or moveOut image payload' });
  }

  res.json({
    moveInEvidenceId: moveIn.id,
    moveOutEvidenceId: moveOut.id,
    roomId: moveIn.roomId,
    roomName: moveIn.roomName || 'Room',
    category: 'Wall',
    observation: 'Observable visual change present near corner boundary.',
    classification: 'POSSIBLE CHANGE',
    confidence: 0.88,
    differenceDetails: 'Surface tonal variance noted. Light scuff mark visible.',
    locationArea: 'Lower wall corner'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`RentProof Express Backend running on http://localhost:${PORT}`);
});
