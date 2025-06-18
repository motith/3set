import React from 'react';
import { CardSelectionMethod } from '../types';
import { CARD_SELECTION_LABELS } from '../constants';

interface CardSelectorProps {
  cardSelectionMethod: CardSelectionMethod;
  onMethodChange: (method: CardSelectionMethod) => void;
  disabled?: boolean;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  cardSelectionMethod,
  onMethodChange,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-purple-700">
        カード選択方法
      </label>
      <div className="space-y-2">
        {(['random', 'manual'] as const).map((method) => (
          <label
            key={method}
            className={`flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              cardSelectionMethod === method
                ? 'border-purple-500 bg-purple-50'
                : 'border-purple-200 bg-white/75 hover:border-purple-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} min-h-[60px] sm:min-h-[70px]`}
          >
            <input
              type="radio"
              name="cardSelectionMethod"
              value={method}
              checked={cardSelectionMethod === method}
              onChange={(e) => onMethodChange(e.target.value as CardSelectionMethod)}
              disabled={disabled}
              className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 border-purple-300 focus:ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-purple-700 text-sm sm:text-base">
                {CARD_SELECTION_LABELS[method]}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 leading-relaxed">
                {method === 'random' 
                  ? '3枚のカードを自動でランダムに選択します'
                  : '3枚のカードを手動で選択します'
                }
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}; 