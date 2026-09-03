import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Root Status Route
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>RentProof Backend API Server</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #FDFBF7; color: #1C1917; padding: 40px; text-align: center; }
          .card { background: white; max-width: 500px; margin: 0 auto; padding: 30px; border-radius: 16px; border: 1px solid #EFE5D5; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .badge { display: inline-block; background: #E8F5E9; color: #2E7D32; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px; }
          h1 { margin: 0 0 8px 0; color: #E86A33; font-size: 24px; }
          p { color: #57534E; font-size: 14px; line-height: 1.5; }
          a.btn { display: inline-block; background: #E86A33; color: white; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 10px; margin-top: 16px; font-size: 14px; }
          a.btn:hover { background: #D2551E; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">✓ API Server Active (Port 5000)</div>
          <h1>RentProof Backend API</h1>
          <p>This is the Express backend API proxy server. The main interactive RentProof Web Application UI is running on <strong>Port 3000</strong>.</p>
          <a href="http://localhost:3000" class="btn">Launch RentProof Web App (Port 3000) &rarr;</a>
        </div>
      </body>
    </html>
  `);
});

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
