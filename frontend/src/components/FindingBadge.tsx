import React from 'react';
import { ClassificationType } from '../types/inspection';
import { CheckCircle2, AlertTriangle, HelpCircle, FileQuestion } from 'lucide-react';

interface FindingBadgeProps {
  classification: ClassificationType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FindingBadge: React.FC<FindingBadgeProps> = ({ 
  classification, 
  showIcon = true,
  size = 'md' 
}) => {
  let badgeStyle = '';
  let icon = null;
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  switch (classification) {
    case 'UNCHANGED':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
      icon = <CheckCircle2 size={iconSize} className="shrink-0" />;
      break;
    case 'POSSIBLE CHANGE':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
      icon = <AlertTriangle size={iconSize} className="shrink-0" />;
      break;
    case 'NEEDS REVIEW':
      badgeStyle = 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10';
      icon = <HelpCircle size={iconSize} className="shrink-0" />;
      break;
    case 'INSUFFICIENT EVIDENCE':
    default:
      badgeStyle = 'bg-stone-100 text-stone-700 border-stone-300 ring-stone-500/10';
      icon = <FileQuestion size={iconSize} className="shrink-0" />;
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  };

  return (
    <span className={`inline-flex items-center rounded-md border shadow-2xs font-sans tracking-wide uppercase ${badgeStyle} ${sizeClasses[size]}`}>
      {showIcon && icon}
      <span>{classification}</span>
    </span>
  );
};
