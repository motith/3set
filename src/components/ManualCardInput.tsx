import React, { useState } from 'react';
import { ManualCardSelections, MajorArcanaCardId } from '../types';
import { MAJOR_ARCANA_CARDS } from '../constants';

interface ManualCardInputProps {
  manualCardSelections: ManualCardSelections;
  onCardSelectionChange: (selections: ManualCardSelections) => void;
  disabled?: boolean;
}

export const ManualCardInput: React.FC<ManualCardInputProps> = ({
  manualCardSelections,
  onCardSelectionChange,
  disabled = false
}) => {
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleCardChange = (position: keyof ManualCardSelections, cardId: MajorArcanaCardId | '') => {
    const newSelections = { ...manualCardSelections, [position]: cardId };
    onCardSelectionChange(newSelections);

    // 重複チェック
    if (cardId !== '') {
      const selectedCards = Object.entries(newSelections)
        .filter(([key, value]) => key !== position && value === cardId);
      
      if (selectedCards.length > 0) {
        const duplicatePositions = selectedCards.map(([key]) => key.replace('Card', '')).join(', ');
        const selectedCardName = MAJOR_ARCANA_CARDS.find(card => card.id === cardId)?.name || '';
        setDuplicateWarning(`「${selectedCardName}」がカード${duplicatePositions}と重複しています。同じカードを複数選択しても良いですか？`);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const dismissWarning = () => {
    setDuplicateWarning(null);
  };

  const getAvailableCards = (_currentPosition: keyof ManualCardSelections) => {
    // 重複を許可するため、すべてのカードを表示
    return MAJOR_ARCANA_CARDS;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-purple-700">
        カードを選択してください
      </label>
      
      {/* 重複警告メッセージ */}
      {duplicateWarning && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-yellow-800">
                {duplicateWarning}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={dismissWarning}
                className="inline-flex text-yellow-400 hover:text-yellow-600 focus:outline-none focus:text-yellow-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['CardA', 'CardB', 'CardC'] as const).map((position) => {
          const positionLabel = position.replace('Card', '') as 'A' | 'B' | 'C';
          const availableCards = getAvailableCards(position);
          
          return (
            <div key={position} className="space-y-2">
              <label className="block text-xs font-medium text-purple-600">
                カード{positionLabel}
              </label>
              <select
                value={manualCardSelections[position]}
                onChange={(e) => handleCardChange(position, e.target.value as MajorArcanaCardId | '')}
                disabled={disabled}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/75 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <option value="">カードを選択</option>
                {availableCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 