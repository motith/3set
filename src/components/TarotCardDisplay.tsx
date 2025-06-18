import React from 'react';
import { SelectedCardInfo } from '../types';

interface TarotCardDisplayProps {
  cards: SelectedCardInfo[];
  onCardClick: (cardPosition: 'A' | 'B' | 'C') => void;
}

export const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({
  cards,
  onCardClick
}) => {
  const getCardImagePath = (cardId: string): string => {
    // 画像ファイル名は cardId.jpg の形式を想定（SVGファイルも対応）
    return `/images/tarot-cards/${cardId}.svg`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // 画像が見つからない場合は他の拡張子を試す
    const target = e.target as HTMLImageElement;
    const currentSrc = target.src;
    
    if (currentSrc.includes('.svg')) {
      target.src = currentSrc.replace('.svg', '.jpg');
    } else if (currentSrc.includes('.jpg')) {
      target.src = currentSrc.replace('.jpg', '.png');
    } else {
      target.src = '/images/tarot-cards/placeholder.svg';
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-bold text-purple-800 mb-4 text-center">
        選ばれたカード
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto">
        {cards.map((card, index) => (
          <div
            key={card.position}
            className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
            onClick={() => onCardClick(card.position)}
          >
            {/* カード画像 */}
            <div className="relative aspect-[2/3] bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg shadow-lg overflow-hidden border-2 border-purple-200 group-hover:border-purple-400 transition-colors">
              <img
                src={getCardImagePath(card.cardId)}
                alt={card.cardName}
                onError={handleImageError}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* オーバーレイ効果 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* カード位置ラベル */}
              <div className="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                {card.position}
              </div>
            </div>
            
            {/* カード名 */}
            <div className="mt-2 text-center">
              <p className="text-xs sm:text-sm font-medium text-purple-700 truncate">
                {card.cardName}
              </p>
            </div>
            
            {/* タップヒント */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                タップで詳細へ
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 説明テキスト */}
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-purple-600">
          💡 カードをタップすると該当の鑑定結果にジャンプします
        </p>
      </div>
    </div>
  );
}; 