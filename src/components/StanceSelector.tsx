import React from 'react';
import { Stance } from '../types';
import { STANCES_OPTIONS } from '../constants';

interface StanceSelectorProps {
  selectedStance: Stance;
  onStanceChange: (stance: Stance) => void;
  disabled?: boolean;
}

export const StanceSelector: React.FC<StanceSelectorProps> = ({
  selectedStance,
  onStanceChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-purple-700">
        占い師のスタンス
      </label>
      <select
        value={selectedStance}
        onChange={(e) => onStanceChange(e.target.value as Stance)}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm sm:text-base border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/75 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[44px]"
      >
        {STANCES_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-xs sm:text-sm text-purple-600 leading-relaxed">
        {STANCES_OPTIONS.find(option => option.value === selectedStance)?.description}
      </p>
    </div>
  );
}; 