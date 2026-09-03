import React, { useState } from 'react';
import { Inspection, Room } from '../types/inspection';
import { DoorOpen, Plus, Trash2, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface RoomManagementPageProps {
  inspection: Inspection;
  onUpdateInspection: (updated: Inspection) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_ROOM_SUGGESTIONS = [
  'Balcony',
  'Dining Room',
  'Hallway',
  'Study Room',
  'Patio',
  'Laundry Room',
  'Master Suite',
  'Storage Closet'
];

export const RoomManagementPage: React.FC<RoomManagementPageProps> = ({
  inspection,
  onUpdateInspection,
  onNext,
  onBack
}) => {
  const [rooms, setRooms] = useState<Room[]>(inspection.rooms || []);
  const [customRoomInput, setCustomRoomInput] = useState('');

  const handleAddRoom = (roomName: string) => {
    if (!roomName.trim()) return;
    const exists = rooms.some(r => r.name.toLowerCase() === roomName.trim().toLowerCase());
    if (exists) return;

    const newRoom: Room = {
      id: `room-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: roomName.trim(),
      isCustom: true
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    setCustomRoomInput('');

    onUpdateInspection({
      ...inspection,
      rooms: updatedRooms
    });
  };

  const handleRemoveRoom = (roomId: string) => {
    if (rooms.length <= 1) {
      alert('An inspection requires at least one room.');
      return;
    }
    const updatedRooms = rooms.filter(r => r.id !== roomId);
    setRooms(updatedRooms);

    // Also filter out any evidence attached to this room
    const updatedEvidence = inspection.evidence.filter(e => e.roomId !== roomId);

    onUpdateInspection({
      ...inspection,
      rooms: updatedRooms,
      evidence: updatedEvidence
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="border-b border-stone-100 pb-4 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900">Room Configuration</h2>
            <p className="text-xs text-stone-500 mt-1">
              Specify all property areas to organize photographic evidence for comparison.
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
            {rooms.length} Rooms Configured
          </span>
        </div>

        {/* Current Active Rooms */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Active Property Rooms
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rooms.map((room) => {
              const roomEvidenceCount = inspection.evidence.filter(e => e.roomId === room.id).length;

              return (
                <div 
                  key={room.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between group hover:border-brand-300 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                      <DoorOpen size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{room.name}</h4>
                      <span className="text-[11px] text-stone-500">
                        {roomEvidenceCount} Evidence Photos Attached
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveRoom(room.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="Remove room"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Room Custom Input */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            + Add Custom Room
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRoomInput}
              onChange={(e) => setCustomRoomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRoom(customRoomInput))}
              placeholder="e.g. Balcony, Dining Room, Storage"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              onClick={() => handleAddRoom(customRoomInput)}
              disabled={!customRoomInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-2">Quick Add Suggestions:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_ROOM_SUGGESTIONS.map((preset) => {
                const isAdded = rooms.some(r => r.name.toLowerCase() === preset.toLowerCase());
                return (
                  <button
                    key={preset}
                    onClick={() => !isAdded && handleAddRoom(preset)}
                    disabled={isAdded}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isAdded 
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-brand-500 hover:text-brand-600'
                    }`}
                  >
                    {isAdded ? <Check size={12} /> : <Plus size={12} />}
                    <span>{preset}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Property Details</span>
          </button>

          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Move-in Photo Upload</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
