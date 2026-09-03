import React, { useState } from 'react';
import { Inspection, Finding } from '../types/inspection';
import { FindingBadge } from '../components/FindingBadge';
import { ImageSlider } from '../components/ImageSlider';
import { Columns, Sliders, LayoutGrid, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface EvidenceComparisonPageProps {
  inspection: Inspection;
  onNext: () => void;
}

export const EvidenceComparisonPage: React.FC<EvidenceComparisonPageProps> = ({
  inspection,
  onNext
}) => {
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & View Switcher */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Visual Differential Engine
            </span>
            <span className="text-xs text-stone-500">• {inspection.rooms.length} Rooms Analyzed</span>
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1">Evidence Comparison Gallery</h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Compare corresponding move-in baseline and move-out exit photographic evidence for each property room.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-stone-100 p-1 rounded-xl border border-stone-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'slider' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sliders size={14} />
              <span>Interactive Slider</span>
            </button>

            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'side-by-side' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Side-by-Side</span>
            </button>
          </div>

          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>View Classified Findings</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Room Comparison List */}
      <div className="space-y-6">
        {inspection.rooms.map((room) => {
          const roomFindings = inspection.findings.filter(f => f.roomId === room.id);
          const roomMoveInImages = inspection.evidence.filter(e => e.roomId === room.id && e.type === 'move-in');
          const roomMoveOutImages = inspection.evidence.filter(e => e.roomId === room.id && e.type === 'move-out');

          const hasBothImages = roomMoveInImages.length > 0 && roomMoveOutImages.length > 0;
          const moveInImg = roomMoveInImages[0]?.dataUrl;
          const moveOutImg = roomMoveOutImages[0]?.dataUrl;

          const primaryFinding = roomFindings[0];

          return (
            <div key={room.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              {/* Room Header */}
              <div className="p-4 px-6 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {room.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">{room.name}</h3>
                    <span className="text-xs text-stone-500">
                      {roomMoveInImages.length} Move-in • {roomMoveOutImages.length} Move-out Photos
                    </span>
                  </div>
                </div>

                {primaryFinding && (
                  <FindingBadge classification={primaryFinding.classification} size="md" />
                )}
              </div>

              {/* Body Content */}
              <div className="p-6">
                {!hasBothImages ? (
                  /* Insufficient Evidence Warning */
                  <div className="p-8 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-2">
                    <AlertCircle size={32} className="text-stone-400 mx-auto" />
                    <h4 className="text-sm font-bold text-stone-800">Insufficient evidence for pairing</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Requires at least one move-in baseline photo and one move-out exit photo for automated before/after visual comparison.
                    </p>
                  </div>
                ) : viewMode === 'slider' ? (
                  /* Interactive Slider Mode */
                  <div className="space-y-4">
                    <ImageSlider 
                      beforeImage={moveInImg} 
                      afterImage={moveOutImg}
                      beforeLabel={`MOVE-IN (BEFORE) • ${room.name}`}
                      afterLabel={`MOVE-OUT (AFTER) • ${room.name}`}
                    />

                    {primaryFinding && (
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Observation Category: <strong className="text-stone-900">{primaryFinding.category}</strong>
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            Confidence: {(primaryFinding.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-bold text-stone-900 leading-snug">
                          {primaryFinding.observation}
                        </p>
                        {primaryFinding.differenceDetails && (
                          <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 pt-2 mt-1">
                            <strong>Differential Analysis:</strong> {primaryFinding.differenceDetails}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Side by Side Grid Mode */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Move-in Box */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 p-2 px-3 rounded-lg border border-emerald-200">
                          <span>MOVE-IN BASELINE</span>
                          <span>{roomMoveInImages[0]?.fileName}</span>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-900">
                          <img src={moveInImg} alt="Move-in" className="w-full h-64 object-cover" />
                        </div>
                      </div>

                      {/* Move-out Box */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-700 bg-brand-50 p-2 px-3 rounded-lg border border-brand-200">
                          <span>MOVE-OUT EXIT</span>
                          <span>{roomMoveOutImages[0]?.fileName}</span>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-900">
                          <img src={moveOutImg} alt="Move-out" className="w-full h-64 object-cover" />
                        </div>
                      </div>
                    </div>

                    {primaryFinding && (
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-800">{primaryFinding.category} Observation</span>
                          <FindingBadge classification={primaryFinding.classification} size="sm" />
                        </div>
                        <p className="text-sm font-semibold text-stone-900">{primaryFinding.observation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
