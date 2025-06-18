import React from 'react';
import { CardSetType } from '../types';
import { getCardSetInfo, hasPremiumAccess, changeCardSet, getUserUsage } from '../services/subscriptionService';

interface CardSetSelectorProps {
  onCardSetChange: (cardSet: CardSetType) => void;
  disabled?: boolean;
}

export const CardSetSelector: React.FC<CardSetSelectorProps> = ({ 
  onCardSetChange, 
  disabled = false 
}) => {
  const cardSetInfo = getCardSetInfo();
  const isPremium = hasPremiumAccess();
  const usage = getUserUsage();
  const currentCardSet = usage.selectedCardSet;

  const handleCardSetChange = (cardSet: CardSetType) => {
    if (disabled) return;
    
    if (changeCardSet(cardSet)) {
      onCardSetChange(cardSet);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-purple-700">
        タロットカードセット
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(cardSetInfo).map(([setId, info]) => {
          const isLocked = !isPremium && setId !== 'classic';
          const isSelected = currentCardSet === setId;
          
          return (
            <div
              key={setId}
              className={`relative p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-purple-500 bg-purple-50/75'
                  : isLocked
                  ? 'border-gray-200 bg-gray-50/50 opacity-60'
                  : 'border-purple-200 bg-white/50 hover:border-purple-300 hover:bg-purple-50/50'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => !isLocked && handleCardSetChange(setId as CardSetType)}
            >
              {/* プレミアム限定マーク */}
              {isLocked && (
                <div className="absolute top-2 right-2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    💎 Premium
                  </div>
                </div>
              )}

              {/* カードセット情報 */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    isSelected ? 'bg-purple-500' : 'bg-gray-300'
                  }`} />
                  <h4 className={`font-medium ${
                    isLocked ? 'text-gray-500' : 'text-purple-700'
                  }`}>
                    {info.name}
                  </h4>
                </div>
                
                <p className={`text-sm ${
                  isLocked ? 'text-gray-400' : 'text-purple-600'
                }`}>
                  {info.description}
                </p>
              </div>

              {/* カードサンプル画像プレビュー */}
              <div className="mt-3 flex space-x-1">
                {[0, 1, 2].map((cardIndex) => (
                  <div
                    key={cardIndex}
                    className={`w-8 h-12 rounded border ${
                      isLocked 
                        ? 'bg-gray-200 border-gray-300' 
                        : 'bg-gradient-to-b from-purple-100 to-purple-200 border-purple-300'
                    } flex items-center justify-center`}
                  >
                    <div className={`text-xs ${
                      isLocked ? 'text-gray-400' : 'text-purple-600'
                    }`}>
                      🃏
                    </div>
                  </div>
                ))}
              </div>

              {/* 選択状態 */}
              {isSelected && (
                <div className="mt-2 text-xs text-purple-600 font-medium flex items-center">
                  <span className="text-green-500 mr-1">✓</span>
                  現在選択中
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* プレミアム案内 */}
      {!isPremium && (
        <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-2">
            <span className="text-purple-500 mt-0.5">💡</span>
            <div>
              <p className="text-sm text-purple-700 font-medium">
                プレミアムプランで全カードセットを利用可能
              </p>
              <p className="text-xs text-purple-600 mt-1">
                4種類のカードデザインから選択でき、より豊富な鑑定体験をお楽しみいただけます。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 