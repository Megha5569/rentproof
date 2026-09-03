import React, { useState, useRef, useCallback } from 'react';
import { Columns, ArrowLeftRight } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'MOVE-IN (BEFORE)',
  afterLabel = 'MOVE-OUT (AFTER)',
  className = ''
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-stone-200 select-none bg-stone-900 shadow-md ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Full width background) */}
      <img 
        src={afterImage} 
        alt={afterLabel} 
        className="w-full h-72 md:h-96 object-cover block"
      />
      <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-stone-700 tracking-wider shadow-sm">
        {afterLabel}
      </div>

      {/* Before Image (Clipped overlay) */}
      <div 
        className="absolute top-0 left-0 bottom-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt={beforeLabel} 
          className="max-w-none h-72 md:h-96 object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
        />
        <div className="absolute bottom-3 left-3 bg-emerald-950/90 backdrop-blur-xs text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-emerald-800 tracking-wider shadow-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical Slider Handle Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-brand-500 text-white shadow-xl flex items-center justify-center border-2 border-white -ml-3.5 hover:scale-110 transition-transform">
          <ArrowLeftRight size={14} />
        </div>
      </div>
    </div>
  );
};
