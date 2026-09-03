import React, { useState, useRef } from 'react';
import { Inspection, EvidenceItem, Room } from '../types/inspection';
import { 
  Upload, 
  ImageIcon, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileImage,
  DoorOpen
} from 'lucide-react';

interface EvidenceUploadPageProps {
  inspection: Inspection;
  mode: 'move-in' | 'move-out';
  onUpdateInspection: (updated: Inspection) => void;
  onNext: () => void;
  onBack: () => void;
}

export const EvidenceUploadPage: React.FC<EvidenceUploadPageProps> = ({
  inspection,
  mode,
  onUpdateInspection,
  onNext,
  onBack
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(inspection.rooms[0]?.id || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRoom = inspection.rooms.find(r => r.id === selectedRoomId) || inspection.rooms[0];
  const modeEvidence = inspection.evidence.filter(e => e.type === mode);

  const handleFiles = (files: FileList | File[]) => {
    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit per image

    const newEvidenceItems: EvidenceItem[] = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setUploadError(`Invalid file format: "${file.name}". Accepted formats: JPG, JPEG, PNG, WEBP.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setUploadError(`File too large: "${file.name}" exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        const newItem: EvidenceItem = {
          id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          roomId: selectedRoomId,
          roomName: currentRoom ? currentRoom.name : 'General',
          type: mode,
          dataUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString()
        };

        newEvidenceItems.push(newItem);
        processedCount++;

        if (processedCount === files.length || newEvidenceItems.length > 0) {
          const updatedEvidence = [...inspection.evidence, ...newEvidenceItems];
          onUpdateInspection({
            ...inspection,
            evidence: updatedEvidence,
            status: 'Evidence Uploaded'
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveEvidence = (id: string) => {
    const updated = inspection.evidence.filter(e => e.id !== id);
    onUpdateInspection({
      ...inspection,
      evidence: updated
    });
  };

  const handleRoomReassign = (evidenceId: string, newRoomId: string) => {
    const newRoom = inspection.rooms.find(r => r.id === newRoomId);
    if (!newRoom) return;

    const updated = inspection.evidence.map(e => {
      if (e.id === evidenceId) {
        return {
          ...e,
          roomId: newRoomId,
          roomName: newRoom.name
        };
      }
      return e;
    });

    onUpdateInspection({
      ...inspection,
      evidence: updated
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                mode === 'move-in' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'
              }`}>
                {mode === 'move-in' ? 'Move-in Evidence (Baseline)' : 'Move-out Evidence (Exit)'}
              </span>
              <span className="text-xs text-stone-500">• Step {mode === 'move-in' ? '3' : '4'} of 8</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 mt-1">
              Upload {mode === 'move-in' ? 'Move-in Baseline' : 'Move-out Exit'} Photographs
            </h2>
            <p className="text-xs text-stone-500">
              Select real photographic evidence from your device and assign them to specific property rooms.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-stone-900">{modeEvidence.length}</span>
            <div className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
              {mode} Photos Uploaded
            </div>
          </div>
        </div>

        {/* Room Selector Tab Bar */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Target Room for New Uploads:
          </label>
          <div className="flex flex-wrap gap-2">
            {inspection.rooms.map((room) => {
              const count = modeEvidence.filter(e => e.roomId === room.id).length;
              const isSelected = selectedRoomId === room.id;

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <DoorOpen size={14} />
                  <span>{room.name}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-brand-500 bg-brand-50/50 scale-[1.01]' 
              : 'border-stone-300 hover:border-brand-400 bg-stone-50/50 hover:bg-stone-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Upload size={28} />
          </div>
          <h3 className="text-sm font-extrabold text-stone-900">
            Click to upload or drag & drop photographs
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Assigning to <strong className="text-stone-800">{currentRoom?.name}</strong>. Supports high-resolution JPG, PNG, WEBP formats.
          </p>
        </div>

        {/* Error state alert */}
        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Evidence Grid for Current Mode */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
              {mode === 'move-in' ? 'Move-in Baseline Gallery' : 'Move-out Exit Gallery'}
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Total {modeEvidence.length} photos ready
            </span>
          </div>

          {modeEvidence.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200">
              <FileImage size={32} className="text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500 font-medium">
                No {mode} evidence uploaded yet. Click above to add photos for {currentRoom?.name}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {modeEvidence.map((item) => (
                <div key={item.id} className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 shadow-md group relative">
                  {/* Thumbnail Preview */}
                  <img
                    src={item.dataUrl}
                    alt={item.fileName}
                    className="w-full h-44 object-cover"
                  />

                  {/* Room reassign selector bar */}
                  <div className="p-2.5 bg-stone-950/90 border-t border-stone-800 flex items-center justify-between gap-2">
                    <select
                      value={item.roomId}
                      onChange={(e) => handleRoomReassign(item.id, e.target.value)}
                      className="bg-stone-800 text-stone-200 text-[11px] font-bold rounded px-2 py-1 border border-stone-700 focus:outline-hidden"
                    >
                      {inspection.rooms.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleRemoveEvidence(item.id)}
                      className="p-1 rounded text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Delete photograph"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Details Overlay */}
                  <div className="p-2 px-3 text-[10px] text-stone-400 flex justify-between bg-stone-900">
                    <span className="truncate max-w-[120px]">{item.fileName}</span>
                    <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workflow Navigation Controls */}
        <div className="pt-6 mt-8 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Previous Step</span>
          </button>

          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>
              {mode === 'move-in' ? 'Proceed to Move-out Photos' : 'Run AI Inspection Agent'}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
