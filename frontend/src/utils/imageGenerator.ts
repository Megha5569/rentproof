/**
  Helper utility to generate crisp, realistic property photographic canvas data URLs
  for demo data and fallback image previews.
 */

export function createPropertyCanvasImage(
  title: string,
  subtitle: string,
  type: 'move-in' | 'move-out',
  primaryColor: string,
  accentColor: string,
  hasScuffMark = false
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Background Gradient (Wall/Room interior)
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 600);
  bgGrad.addColorStop(0, primaryColor);
  bgGrad.addColorStop(1, '#1C1917');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 600);

  // Wall paneling / tiles grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 800; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 420);
    ctx.stroke();
  }
  for (let y = 0; y <= 420; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }

  // Floor plane (Hardwood / Tile perspective)
  const floorGrad = ctx.createLinearGradient(0, 420, 0, 600);
  floorGrad.addColorStop(0, accentColor);
  floorGrad.addColorStop(1, '#0C0A09');
  ctx.fillStyle = floorGrad;
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.lineTo(800, 420);
  ctx.lineTo(800, 600);
  ctx.lineTo(0, 600);
  ctx.closePath();
  ctx.fill();

  // Skirting board / Trim line
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 412, 800, 10);

  // Optional Scuff Mark / Difference for Move-out comparison demo
  if (hasScuffMark) {
    ctx.fillStyle = 'rgba(60, 40, 20, 0.75)';
    ctx.beginPath();
    ctx.ellipse(580, 360, 28, 14, Math.PI / 6, 0, 2 * Math.PI);
    ctx.fill();

    // Red highlight boundary
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(535, 330, 90, 60);
    ctx.setLineDash([]);

    // Differential marker badge
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(535, 305, 110, 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('OBSERVABLE CHANGE', 540, 320);
  }

  // Header Badge (TIMESTAMP & STAGE)
  const badgeColor = type === 'move-in' ? '#2E7D32' : '#E86A33';
  ctx.fillStyle = badgeColor;
  ctx.fillRect(30, 30, 200, 36);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(type === 'move-in' ? '✓ MOVE-IN EVIDENCE' : '⟳ MOVE-OUT EVIDENCE', 45, 53);

  // Title Text Overlay
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(title, 30, 105);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '14px sans-serif';
  ctx.fillText(subtitle, 30, 130);

  // Timestamp watermark in corner
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '12px monospace';
  ctx.fillText(`RENTPROOF TIMESTAMP: ${type === 'move-in' ? '2025-01-15' : '2026-01-15'} | ${title.toUpperCase()}`, 30, 575);

  return canvas.toDataURL('image/jpeg', 0.92);
}
