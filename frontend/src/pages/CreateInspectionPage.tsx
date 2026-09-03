import React, { useState } from 'react';
import { Inspection, InspectionType } from '../types/inspection';
import { Building2, MapPin, Hash, User, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface CreateInspectionPageProps {
  onSave: (inspectionData: Partial<Inspection>) => void;
  onCancel: () => void;
}

export const CreateInspectionPage: React.FC<CreateInspectionPageProps> = ({
  onSave,
  onCancel
}) => {
  const [propertyName, setPropertyName] = useState('Sunrise Apartments');
  const [propertyAddress, setPropertyAddress] = useState('104 Sunburst Boulevard');
  const [unitNumber, setUnitNumber] = useState('Flat 204');
  const [tenantName, setTenantName] = useState('Alex Rivera');
  const [landlordName, setLandlordName] = useState('Apex Property Management');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspectionType, setInspectionType] = useState<InspectionType>('Move-in + Move-out comparison');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!propertyName.trim()) newErrors.propertyName = 'Property name is required.';
    if (!propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required.';
    if (!unitNumber.trim()) newErrors.unitNumber = 'Unit / Apartment number is required.';
    if (!inspectionDate) newErrors.inspectionDate = 'Inspection date is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      propertyName,
      propertyAddress,
      unitNumber,
      tenantName: tenantName.trim() || undefined,
      landlordName: landlordName.trim() || undefined,
      inspectionDate,
      inspectionType,
      status: 'Draft',
      rooms: [
        { id: `room-${Date.now()}-1`, name: 'Living Room' },
        { id: `room-${Date.now()}-2`, name: 'Kitchen' },
        { id: `room-${Date.now()}-3`, name: 'Bedroom' },
        { id: `room-${Date.now()}-4`, name: 'Bathroom' }
      ],
      evidence: [],
      findings: [],
      agentLogs: [
        { id: `log-init`, timestamp: new Date().toLocaleTimeString(), message: 'Inspection record initialized', level: 'info' }
      ]
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="border-b border-stone-100 pb-4 mb-6">
          <h2 className="text-xl font-black text-stone-900">New Property Inspection</h2>
          <p className="text-xs text-stone-500 mt-1">
            Enter rental property details to establish a condition baseline and evidence structure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Property Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 size={14} className="text-brand-500" />
              Property Name *
            </label>
            <input
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g. Sunrise Apartments"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                errors.propertyName ? 'border-red-500 bg-red-50/50' : 'border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              }`}
            />
            {errors.propertyName && <p className="text-xs text-red-600 mt-1">{errors.propertyName}</p>}
          </div>

          {/* Property Address & Unit Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-brand-500" />
                Property Address *
              </label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="e.g. 104 Sunburst Boulevard"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                  errors.propertyAddress ? 'border-red-500 bg-red-50/50' : 'border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
              {errors.propertyAddress && <p className="text-xs text-red-600 mt-1">{errors.propertyAddress}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash size={14} className="text-brand-500" />
                Unit / Flat # *
              </label>
              <input
                type="text"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                placeholder="e.g. Flat 204"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                  errors.unitNumber ? 'border-red-500 bg-red-50/50' : 'border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
              {errors.unitNumber && <p className="text-xs text-red-600 mt-1">{errors.unitNumber}</p>}
            </div>
          </div>

          {/* Tenant Name & Landlord Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-stone-400" />
                Tenant Name (Optional)
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-stone-400" />
                Landlord / Manager (Optional)
              </label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="e.g. Apex Property Management"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Date & Inspection Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-500" />
                Inspection Date *
              </label>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                  errors.inspectionDate ? 'border-red-500 bg-red-50/50' : 'border-stone-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Inspection Type
              </label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value as InspectionType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-white"
              >
                <option value="Move-in + Move-out comparison">Move-in + Move-out comparison</option>
                <option value="Move-in">Move-in Baseline Only</option>
                <option value="Move-out">Move-out Exit Only</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-extrabold text-xs hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Room Setup</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
